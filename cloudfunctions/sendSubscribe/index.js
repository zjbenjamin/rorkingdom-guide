const cloud = require('wx-server-sdk')
const http = require('http')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const TEMPLATE_IDS = {
  announcement: 'ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs',
  activity: 'hsIV8UY3gEeJnK4KNov09qRSfL196CyS5NzotPxz8hc',
  merchant: 'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y',
  merchant_item: 'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y'
}

const TEMPLATE_IDS_MAP = {
  'ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs': 'announcement',
  'hsIV8UY3gEeJnK4KNov09qRSfL196CyS5NzotPxz8hc': 'activity',
  'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y': 'merchant'
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}年${m}月${d}日 ${h}:${min}`
}

function getDataPayload(type, title, content) {
  const timeStr = formatDate(new Date())
  const safeTitle = (title || '提示').substring(0, 20)
  const safeContent = (content || '请前往小程序查看详情').substring(0, 20)
  
  if (type === 'announcement') {
    return {
      thing1: { value: '洛克王国向导' },
      time2: { value: timeStr },
      thing4: { value: safeTitle }
    }
  } else if (type === 'activity') {
    return {
      thing1: { value: safeTitle },
      thing2: { value: safeContent },
      time3: { value: timeStr }
    }
  } else if (type === 'merchant' || type === 'merchant_item') {
    return {
      thing1: { value: safeTitle },
      time2: { value: timeStr },
      thing3: { value: safeContent }
    }
  }
  return {}
}

function pingAliyunServer(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload)
    const options = {
      hostname: '121.41.6.197',
      port: 3000,
      path: '/api/push/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => resolve({ success: true, statusCode: res.statusCode, body: body }))
    })
    req.on('error', (e) => resolve({ success: false, error: e.message }))
    req.write(postData)
    req.end()
  })
}

async function doPush(touser, templateId, page, dataPayload, targetType) {
  try {
    const res = await cloud.openapi.subscribeMessage.send({
      touser: touser,
      templateId: templateId,
      page: page || 'pages/index/index',
      data: dataPayload,
      miniprogramState: 'formal'
    })
    
    if (res.errCode === 0) {
      if (targetType) {
        const db = cloud.database()
        const _ = db.command
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
      return { success: true }
    }
    return { success: false, error: res.errMsg }
  } catch (err) {
    console.error('Push error for', touser, err)
    return { success: false, error: err.message || err.errMsg || String(err) }
  }
}

exports.main = async (event, context) => {
  // 如果带有 proxyToAliyun 标志，云函数仅作为跳板，直接转发并结束，不消耗大量云资源
  if (event.proxyToAliyun) {
    const result = await pingAliyunServer({
      type: event.type,
      title: event.title,
      content: event.content,
      page: event.page,
      itemName: event.itemName,
      itemNames: event.itemNames
    })
    return { proxyResult: result }
  }

  const db = cloud.database()
  const _ = db.command

  // 0. 定时检查大量出没 (Check Swarms)
  if (event.checkSwarm || (event.triggerName && event.triggerName.indexOf('Trigger') !== -1) || (!event.type && !event.touser)) {
    try {
      const swarmRes = await db.collection('swarms').where({
        status: 1,
        pushed: _.neq(true)
      }).get()
      
      const swarms = swarmRes.data || []
      const now = Date.now()
      let updated = false
      let pushedCount = 0
      
      for (let i = 0; i < swarms.length; i++) {
        const item = swarms[i]
        const startStr = item.startDate ? item.startDate.replace(/-/g, '/') + ' ' + (item.startTime || '00:00:00') : null
        const start = startStr ? new Date(startStr).getTime() : 0
        
        if (start && now >= start) {
          updated = true
          
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
            
            const cleanPage = 'pages/swarm/swarm'
            const title = '大量出没刷新'
            const content = item.name + ' 在 ' + item.location + ' 限时出没'
            const payload = getDataPayload('announcement', title, content)
            const tId = TEMPLATE_IDS['announcement']
            
            for (const s of uniqueSubs) {
              const resObj = await doPush(s.openid, tId, cleanPage, payload, 'announcement')
              if (resObj.success) pushedCount++
            }
          }
          
          await db.collection('swarms').doc(item._id).update({
            data: { pushed: true, updateTime: db.serverDate() }
          })
        }
      }
      
      return { success: true, message: `Checked swarms. Pushed to ${pushedCount} users.` }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  const { type, title, content, touser, templateId, data, page, itemName, itemNames } = event
  const cleanPage = page ? page.replace(/^\//, '') : 'pages/index/index'

  // 1. 单人推送
  if (touser && templateId) {
    try {
      const targetType = type || TEMPLATE_IDS_MAP[templateId] || 'announcement'
      const payload = data || getDataPayload(targetType, title, content)
      
      const resObj = await doPush(touser, templateId, cleanPage, payload, targetType)
      return { success: resObj.success, sent: resObj.success ? 1 : 0, error: resObj.error }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  // 2. 批量推送
  try {
    const targetTemplateId = TEMPLATE_IDS[type]
    if (!targetTemplateId) {
      return { success: false, error: 'invalid type' }
    }
    
    let query = { type: type, status: 'active' }
    let subscribers
    
    if (type === 'merchant' && (itemName || (itemNames && itemNames.length > 0))) {
      const orConditions = [{ type: 'merchant', status: 'active' }]
      if (itemName) {
        orConditions.push({ type: 'merchant_item', itemName: itemName, status: 'active' })
      }
      if (itemNames && itemNames.length > 0) {
        orConditions.push({ type: 'merchant_item', itemName: _.in(itemNames), status: 'active' })
      }
      subscribers = await db.collection('subscribers').where(_.or(orConditions)).limit(500).get()
    } else {
      subscribers = await db.collection('subscribers').where(query).limit(500).get()
    }

    if (subscribers.data.length === 0) {
      return { success: true, sent: 0, total: 0, message: '没有订阅者' }
    }

    const uniqueSubs = []
    const seenOpenids = new Set()
    for (const s of subscribers.data) {
      if (!seenOpenids.has(s.openid)) {
        uniqueSubs.push(s)
        seenOpenids.add(s.openid)
      }
    }

    const payload = getDataPayload(type, title, content)
    let sentCount = 0
    let lastError = null

    for (const s of uniqueSubs) {
      const resObj = await doPush(s.openid, targetTemplateId, cleanPage, payload, type)
      if (resObj.success) {
        sentCount++
      } else {
        lastError = resObj.error
      }
    }

    return { success: true, sent: sentCount, total: uniqueSubs.length, error: lastError }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
