const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SCF_URL = 'https://1442890784-28edxvn34i.ap-shanghai.tencentscf.com'

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
        try { resolve(JSON.parse(data)) } catch (e) { resolve({ raw: data }) }
      })
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

exports.main = async (event, context) => {
  const { type, title, content, touser, templateId, data, page } = event

  const db = cloud.database()

  if (touser && templateId) {
    try {
      const res = await httpsPost(SCF_URL, { touser, templateId, title, content, page, data })
      return res
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  try {
    const subscribers = await db.collection('subscribers')
      .where({ type: type, status: 'active' })
      .limit(100)
      .get()

    if (subscribers.data.length === 0) {
      return { success: true, sent: 0, total: 0, message: '没有订阅者' }
    }

    const subscriberList = subscribers.data.map(function(s) { return { openid: s.openid } })

    const res = await httpsPost(SCF_URL, { type, title, content, page, subscribers: subscriberList })
    return res
  } catch (e) {
    return { success: false, error: e.message }
  }
}
