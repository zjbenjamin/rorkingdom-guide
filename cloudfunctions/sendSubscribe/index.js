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
  const { type, title, content, touser, templateId, data, page, itemName, itemNames } = event

  const db = cloud.database()
  const _ = db.command

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
