const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function translate(text, from, to) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(text)
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${from}|${to}&de=zjb@roco.app`
    https.get(url, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(body)
          if (json.responseStatus === 200) {
            resolve(json.responseData.translatedText)
          } else {
            resolve(text)
          }
        } catch(e) {
          resolve(text)
        }
      })
    }).on('error', () => resolve(text))
  })
}

exports.main = async (event) => {
  const { text, from, targets } = event
  if (!text || !targets || targets.length === 0) return { translations: {} }

  const sourceLang = from || 'zh'
  const results = {}

  for (const target of targets) {
    try {
      const translated = await translate(text, sourceLang, target)
      results[target] = translated
    } catch(e) {
      results[target] = text
    }
  }

  return { translations: results }
}
