const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SCF_URL = 'https://1442890784-28edxvn34i.ap-shanghai.tencentscf.com'

// 映射模版ID到订阅类型
const TEMPLATE_IDS_MAP = {
  'ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs': 'announcement',
  'hsIV8UY3gEeJnK4KNov09qRSfL196CyS5NzotPxz8hc': 'activity',
  'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y': 'merchant'
}

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body)
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try { 
          let parsed = JSON.parse(data)
          // 自动解包 API 网关集成响应模式下的 body 字符串
          if (parsed && parsed.body && typeof parsed.body === 'string') {
            try {
              parsed = JSON.parse(parsed.body)
            } catch (e) {}
          }
          resolve(parsed) 
        } catch (e) { 
          resolve({ raw: data }) 
        }
      })
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command

  // 0. 定时任务或前端手动检查预设的出没精灵
  if (event.checkSwarm || (event.triggerName && event.triggerName.indexOf('Trigger') !== -1) || (!event.type && !event.touser)) {
    try {
      // 获取 swarm 配置
      const swarmRes = await db.collection('page_config').doc('swarm').get()
      const d = swarmRes.data
      const swarms = d.swarms || []
      
      const now = Date.now()
      let updated = false
      let pushedCount = 0
      
      for (let i = 0; i < swarms.length; i++) {
        const item = swarms[i]
        // 如果预设了发布时间，且当前时间已经到达，并且还没推送过
        if (item.publishTime && now >= item.publishTime && !item.pushed) {
          item.pushed = true
          item.status = 'active'
          item.statusText = '正在出没'
          updated = true
          
          // 发送推送给所有订阅了 announcement 的用户
          try {
            const subscribers = await db.collection('subscribers')
              .where({ type: 'announcement', status: 'active' })
              .limit(500)
              .get()
              
            if (subscribers.data.length > 0) {
              const uniqueSubs = []
              const seenOpenids = new Set()
              for (const s of subscribers.data) {
                if (!seenOpenids.has(s.openid)) {
                  uniqueSubs.push(s)
                  seenOpenids.add(s.openid)
                }
              }
              
              const subscriberList = uniqueSubs.map(s => ({ openid: s.openid }))
              const subscriberIds = uniqueSubs.map(s => s._id)
              
              const cleanPage = 'pages/swarm/swarm'
              const title = '大量出没刷新'
              const content = item.name + ' 在 ' + item.location + ' 限时出没！'
              
              const res = await httpsPost(SCF_URL, { 
                type: 'announcement', 
                title: title, 
                content: content, 
                page: cleanPage, 
                subscribers: subscriberList 
              })
              
              const isSuccess = res.success || res.sent > 0
              if (isSuccess) {
                pushedCount++
                // 扣减订阅次数
                await db.collection('subscribers').where({
                  _id: _.in(subscriberIds)
                }).update({
                  data: {
                    count: _.inc(-1),
                    updateTime: db.serverDate()
                  }
                })
                
                // 设置次数为0的过期
                await db.collection('subscribers').where({
                  _id: _.in(subscriberIds),
                  count: _.lte(0)
                }).update({
                  data: {
                    status: 'expired',
                    updateTime: db.serverDate()
                  }
                })
              }
            }
          } catch (pushErr) {
            console.error('Push error for item:', item.name, pushErr)
          }
        }
      }
      
      if (updated) {
        await db.collection('page_config').doc('swarm').update({
          data: {
            swarms: swarms,
            updateTime: db.serverDate()
          }
        })
        return { success: true, message: `Checked swarms. Updated and pushed ${pushedCount} swarms.` }
      }
      
      return { success: true, message: 'Checked swarms. No pending publish swarms found.' }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  const { type, title, content, touser, templateId, data, page, itemName, itemNames } = event

  // 清洗页面路径，微信订阅消息路径不能以 / 开头
  let cleanPage = page ? page.replace(/^\//, '') : 'pages/index/index'

  // 1. 单人推送逻辑
  if (touser && templateId) {
    try {
      const res = await httpsPost(SCF_URL, { touser, templateId, title, content, page: cleanPage, data })
      
      // 单人推送成功后，减少该用户的订阅次数
      const isSuccess = res.success || res.sent > 0 || res.errcode === 0
      if (isSuccess) {
        const targetType = type || TEMPLATE_IDS_MAP[templateId]
        if (targetType) {
          await db.collection('subscribers').where({
            openid: touser,
            type: targetType,
            status: 'active'
          }).update({
            data: {
              count: _.inc(-1),
              updateTime: db.serverDate()
            }
          })
          
          // 将次数为0的设为过期
          await db.collection('subscribers').where({
            openid: touser,
            type: targetType,
            count: _.lte(0)
          }).update({
            data: {
              status: 'expired',
              updateTime: db.serverDate()
            }
          })
        }
      }
      return res
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  // 2. 批量推送逻辑
  try {
    let query = { type: type, status: 'active' }
    
    // 如果是商人推送且指定了商品名称，则同时推送给通用订阅者和特定商品订阅者
    let subscribers;
    if (type === 'merchant' && (itemName || (itemNames && itemNames.length > 0))) {
      const orConditions = [
        { type: 'merchant', status: 'active' }
      ]
      if (itemName) {
        orConditions.push({ type: 'merchant_item', itemName: itemName, status: 'active' })
      }
      if (itemNames && itemNames.length > 0) {
        orConditions.push({ type: 'merchant_item', itemName: _.in(itemNames), status: 'active' })
      }

      const res = await db.collection('subscribers')
        .where(_.or(orConditions))
        .limit(500)
        .get()
      subscribers = res
    } else {
      subscribers = await db.collection('subscribers')
        .where(query)
        .limit(500)
        .get()
    }

    if (subscribers.data.length === 0) {
      return { success: true, sent: 0, total: 0, message: '没有订阅者' }
    }

    // 去重 openid
    const uniqueSubs = []
    const seenOpenids = new Set()
    for (const s of subscribers.data) {
      if (!seenOpenids.has(s.openid)) {
        uniqueSubs.push(s)
        seenOpenids.add(s.openid)
      }
    }

    const subscriberList = uniqueSubs.map(function(s) { return { openid: s.openid } })
    const subscriberIds = uniqueSubs.map(function(s) { return s._id })

    const res = await httpsPost(SCF_URL, { type, title, content, page: cleanPage, subscribers: subscriberList })
    
    // 推送成功后，减少订阅次数
    const isSuccess = res.success || res.sent > 0
    if (isSuccess) {
      // 批量减少次数
      await db.collection('subscribers').where({
        _id: _.in(subscriberIds)
      }).update({
        data: {
          count: _.inc(-1),
          updateTime: db.serverDate()
        }
      })
      
      // 将次数为0的设为过期
      await db.collection('subscribers').where({
        _id: _.in(subscriberIds),
        count: _.lte(0)
      }).update({
        data: {
          status: 'expired',
          updateTime: db.serverDate()
        }
      })
    }

    return res
  } catch (e) {
    return { success: false, error: e.message }
  }
}
