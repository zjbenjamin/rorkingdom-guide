const https = require('https')

const APP_ID = process.env.APP_ID
const APP_SECRET = process.env.APP_SECRET

const TEMPLATE_IDS = {
  announcement: 'ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs',
  activity: 'hsIV8UY3gEeJnK4KNov09qRSfL196CyS5NzotPxz8hc',
  system: '46MLP0pv3NcTvZKAkrIApkj9DWvVQj_bR_mavRIzgf4',
  merchant: 'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y',
  interaction: 'dfk9xCUuBSpqwJXHG0Cs_MkK9BQVxdYK_Cl3mzSAUi8'
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
  system: (t, c) => ({
    thing1: { value: '洛手助手BENJAMIN' },
    thing2: { value: (c || t || '系统更新').substring(0, 20) },
    time3: { value: formatTime() },
    time4: { value: formatTime() },
    thing5: { value: '功能更新' },
    thing6: { value: '请更新至最新版本' }
  }),
  merchant: (t, c) => ({
    thing1: { value: (t || '商品上架').substring(0, 20) },
    time2: { value: formatTime() },
    thing3: { value: (c || '前往查看').substring(0, 20) }
  }),
  interaction: (t, c) => ({
    thing1: { value: (t || '社区互动').substring(0, 20) },
    thing2: { value: (c || '有人回复了你').substring(0, 20) },
    thing3: { value: '点击查看' },
    time4: { value: formatTime() }
  })
}

exports.main_handler = async (event, context) => {
  console.log('原始event:', JSON.stringify(event))
  var parsedEvent = event
  if (typeof event.body === 'string') {
    try { parsedEvent = JSON.parse(event.body) } catch (e) { console.log('解析body失败:', e) }
  }
  console.log('解析后:', JSON.stringify(parsedEvent))
  const { type, title, content, touser, templateId, data, page, subscribers: subscriberList } = parsedEvent

  const defaultPages = {
    announcement: '/pages/index/index',
    activity: '/pages/activity/activity',
    system: '/pages/index/index',
    merchant: '/pages/merchant/merchant',
    interaction: '/pages/community/community'
  }

  if (touser && templateId) {
    try {
      const token = await getAccessToken()
      const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`
      const res = await httpsPost(url, {
        touser, template_id: templateId,
        page: page || '/pages/index/index',
        data: data || { thing1: { value: title || '新通知' }, thing2: { value: content || '点击查看' }, time3: { value: formatTime() } }
      })
      return { success: res.errcode === 0, sent: 1, result: res }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  const sendTemplateId = TEMPLATE_IDS[type]
  const buildData = TEMPLATE_FIELDS[type]
  if (!sendTemplateId || !buildData) return { success: false, error: '未知类型: ' + type }
  if (!subscriberList || subscriberList.length === 0) return { success: true, sent: 0, total: 0, message: '没有订阅者' }

  try {
    const token = await getAccessToken()
    let sent = 0, failed = 0
    let failDetails = []
    const msgData = buildData(title, content)

    for (const sub of subscriberList) {
      try {
        const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`
        const res = await httpsPost(url, {
          touser: sub.openid,
          template_id: sendTemplateId,
          page: page || defaultPages[type] || '/pages/index/index',
          data: msgData
        })
        if (res.errcode === 0) {
          sent++
        } else {
          failed++
          failDetails.push({ openid: sub.openid, errCode: res.errcode, errMsg: res.errmsg })
        }
      } catch (e) {
        failed++
        failDetails.push({ openid: sub.openid, errCode: -1, errMsg: e.message })
      }
    }

    return { success: true, sent, failed, total: subscriberList.length, failDetails }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
