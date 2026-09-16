const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function translate(text, from, to) {
  return new Promise((resolve, reject) => {
    if (!text || !text.trim()) { resolve(null); return }
    const q = encodeURIComponent(text.substring(0, 500))
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${from}|${to}&de=zjb@roco.app`
    const req = https.get(url, { timeout: 10000 }, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(body)
          if (json.responseStatus === 200 && json.responseData && json.responseData.translatedText) {
            resolve(json.responseData.translatedText)
          } else {
            resolve(null)
          }
        } catch(e) {
          resolve(null)
        }
      })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
  })
}

exports.main = async (event) => {
  const { text, from, targets } = event
  if (!text || !text.trim() || !targets || targets.length === 0) return { translations: {} }

  const sourceLang = from || 'zh'
  const results = {}

  for (const target of targets) {
    try {
      const translated = await translate(text, sourceLang, target)
      if (translated && translated !== text) {
        results[target] = translated
      }
      // 翻译失败或返回原文时不写入，让调用方知道这条未翻译
    } catch(e) {
      // 静默跳过
    }
    // 请求间隔，避免被 MyMemory 限流
    if (targets.indexOf(target) < targets.length - 1) {
      await new Promise(r => setTimeout(r, 300))
    }
  }

  return { translations: results }
}
