const cloud = require('wx-server-sdk')
const https = require('https')
const http = require('http')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function httpGet(url, timeout) {
  return new Promise((resolve) => {
    const lib = url.indexOf('https') === 0 ? https : http
    const req = lib.get(url, { timeout: timeout || 12000 }, (res) => {
      let body = ''
      res.on('data', (c) => { body += c })
      res.on('end', () => resolve({ ok: true, body, status: res.statusCode }))
    })
    req.on('error', (e) => resolve({ ok: false, error: e.message }))
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }) })
  })
}

function mapLang(l) {
  const m = { zh: 'zh-CN', 'zh-CN': 'zh-CN', en: 'en', ja: 'ja', ko: 'ko', jp: 'ja', kr: 'ko' }
  return m[l] || l
}

// 1) MyMemory
async function viaMyMemory(text, from, to) {
  const q = encodeURIComponent(text.substring(0, 500))
  const langpair = encodeURIComponent(mapLang(from) + '|' + mapLang(to))
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${langpair}&de=zjb@roco.app`
  const r = await httpGet(url, 12000)
  if (!r.ok) return null
  try {
    const json = JSON.parse(r.body)
    const t = json && json.responseData && json.responseData.translatedText
    if (json.responseStatus === 200 && t && t !== text) return t
  } catch (e) {}
  return null
}

// 2) Google 免费端点（无 key，可能失败则跳过）
async function viaGoogle(text, from, to) {
  const q = encodeURIComponent(text.substring(0, 500))
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(mapLang(from))}&tl=${encodeURIComponent(mapLang(to))}&dt=t&q=${q}`
  const r = await httpGet(url, 12000)
  if (!r.ok) return null
  try {
    const json = JSON.parse(r.body)
    if (Array.isArray(json) && json[0] && Array.isArray(json[0])) {
      const t = json[0].map((seg) => (seg && seg[0]) || '').join('')
      if (t && t !== text) return t
    }
  } catch (e) {}
  return null
}

async function translate(text, from, to) {
  if (!text || !text.trim()) return null
  return (await viaMyMemory(text, from, to)) || (await viaGoogle(text, from, to))
}

exports.main = async (event) => {
  const { text, from, targets } = event
  if (!text || !text.trim() || !targets || targets.length === 0) {
    return { translations: {}, error: 'empty input' }
  }

  const sourceLang = from || 'zh'
  const results = {}

  for (const target of targets) {
    try {
      const translated = await translate(text, sourceLang, target)
      if (translated && translated !== text) {
        results[target] = translated
      }
    } catch (e) {
      // 跳过该语种
    }
    if (targets.indexOf(target) < targets.length - 1) {
      await new Promise((r) => setTimeout(r, 250))
    }
  }

  return {
    translations: results,
    ok: Object.keys(results).length > 0
  }
}
