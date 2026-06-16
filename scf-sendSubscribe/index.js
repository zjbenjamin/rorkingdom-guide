const https = require('https')

const APP_ID = process.env.APP_ID
const APP_SECRET = process.env.APP_SECRET

const TEMPLATE_IDS = {
  announcement: 'ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs',
  activity: 'hsIV8UY3gEeJnK4KNov09qRSfL196CyS5NzotPxz8hc',
  merchant: 'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y'
}

function formatTime() {
  const d = new Date(Date.now() + 8 * 3600000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const h = String(d.getUTCHours()).padStart(2, '0')
  const min = String(d.getUTCMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch (e) { reject(new Error(data)) }
      })
    }).on('error', reject)
  })
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
        try { resolve(JSON.parse(data)) } catch (e) { reject(new Error(data)) }
      })
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`
  const res = await httpsGet(url)
  if (res.access_token) return res.access_token
  throw new Error('获取access_token失败: ' + (res.errmsg || JSON.stringify(res)))
}

const TEMPLATE_FIELDS = {
  announcement: (t, c) => ({
    thing1: { value: '洛手助手BENJAMIN' },
    time2: { value: formatTime() },
    thing3: { value: '公告' },
    thing4: { value: (t || '新公告').substring(0, 20) },
    thing5: { value: '洛手助手' },
    thing6: { value: '新发布' }
  }),
  activity: (t, c) => ({
    thing1: { value: (t || '新活动').substring(0, 20) },
    thing2: { value: (c || '点击查看').substring(0, 20) },
    time3: { value: formatTime() },
    time4: { value: formatTime() }
  }),
  merchant: (t, c) => ({
    thing1: { value: (t || '商品上架').substring(0, 20) },
    time2: { value: formatTime() },
    thing3: { value: (c || '前往查看').substring(0, 20) }
  })
}

const makeRes = (data) => ({
  isBase64Encoded: false,
  statusCode: 200,
  headers: { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(data)
})

exports.main_handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return makeRes({ message: 'ok' })

  console.log('接收到请求')
  let body = event;
  if (event.body) {
    try { body = JSON.parse(event.body) } catch(e) { console.error('解析Body失败') }
  }
  const { type, title, content, subscribers: subscriberList } = body

  try {
    const token = await getAccessToken()
    const sendTemplateId = TEMPLATE_IDS[type]
    const buildData = TEMPLATE_FIELDS[type]
    
    if (!sendTemplateId || !buildData) return makeRes({ success: false, error: '未知类型: ' + type })
    if (!subscriberList || subscriberList.length === 0) return makeRes({ success: true, sent: 0, total: 0 })

    const msgData = buildData(title, content)
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`

    // 并发发送，提高效率，减少超时风险
    const tasks = subscriberList.map(sub => {
      return httpsPost(url, {
        touser: sub.openid,
        template_id: sendTemplateId,
        page: '/pages/index/index',
        data: msgData
      }).catch(e => ({ errcode: -1, errmsg: e.message }))
    })

    const results = await Promise.all(tasks)
    const sent = results.filter(r => r.errcode === 0).length
    const failed = results.length - sent

    return makeRes({ success: true, sent, failed, total: subscriberList.length })
  } catch (e) {
    console.error('执行失败:', e)
    return makeRes({ success: false, error: e.message })
  }
}
