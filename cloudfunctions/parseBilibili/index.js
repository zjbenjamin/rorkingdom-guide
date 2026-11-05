const cloud = require('wx-server-sdk')
const https = require('https')
const http = require('http')
const urlModule = require('url')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 辅助函数：发 GET 请求并跟进重定向获取 HTML
function requestPage(urlStr, headers = {}, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects < 0) {
      return reject(new Error('重定向次数过多'))
    }
    try {
      const parsedUrl = urlModule.parse(urlStr)
      const client = parsedUrl.protocol === 'https:' ? https : http
      
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
      
      if (parsedUrl.host && (parsedUrl.host.includes('weibo.com') || parsedUrl.host.includes('weibo.cn'))) {
        defaultHeaders['Referer'] = 'https://m.weibo.cn/'
      }

      const req = client.get(urlStr, {
        headers: { ...defaultHeaders, ...headers }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location
          if (!redirectUrl.startsWith('http')) {
            redirectUrl = parsedUrl.protocol + '//' + parsedUrl.host + redirectUrl
          }
          resolve(requestPage(redirectUrl, headers, maxRedirects - 1))
          return
        }
        
        let chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf-8')
          resolve({
            url: urlStr,
            statusCode: res.statusCode,
            headers: res.headers,
            html: body
          })
        })
      })
      
      req.on('error', reject)
      req.setTimeout(8000, () => {
        req.destroy(new Error('请求超时'))
      })
    } catch (e) {
      reject(e)
    }
  })
}

// 获取 JSON（针对 B站 API）：兼容返回 HTML 的情况，给出可读错误
function getJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = urlModule.parse(url)
      const client = parsedUrl.protocol === 'https:' ? https : http
      client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.bilibili.com/',
          'Origin': 'https://www.bilibili.com',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          ...headers
        }
      }, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          const trimmed = (data || '').trim()
          if (!trimmed) {
            return reject(new Error('接口返回为空'))
          }
          // 被风控/跳到 HTML 页时避免把整页丢进 JSON.parse
          if (trimmed.charAt(0) === '<' || trimmed.indexOf('<!DOCTYPE') === 0 || trimmed.indexOf('<html') === 0) {
            return reject(new Error('B站接口返回异常页，可能被限流'))
          }
          try {
            resolve(JSON.parse(trimmed))
          } catch (e) {
            reject(new Error('接口数据解析失败'))
          }
        })
      }).on('error', reject)
    } catch (e) {
      reject(e)
    }
  })
}

// 核心 QQ 音乐 vkey 获取
function getQQMusicPlayUrl(songmid) {
  return new Promise((resolve, reject) => {
    const guid = '2799562608'
    const data = JSON.stringify({
      req: {
        module: 'CDN.SrfCdnDispatchServer',
        method: 'GetCdnDispatch',
        param: { guid: guid, calltype: 0, userip: '' }
      },
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: guid,
          songmid: [songmid],
          songtype: [0],
          uin: '0',
          loginflag: 1,
          platform: '20'
        }
      }
    })

    const options = {
      hostname: 'u.y.qq.com',
      path: '/cgi-bin/musicu.fcg',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      }
    }

    try {
      const req = https.request(options, (res) => {
        let responseBody = ''
        res.on('data', (chunk) => responseBody += chunk)
        res.on('end', () => {
          try {
            const resJson = JSON.parse(responseBody)
            const midurlinfo = resJson.req_0 && resJson.req_0.data && resJson.req_0.data.midurlinfo && resJson.req_0.data.midurlinfo[0]
            const sip = resJson.req && resJson.req.data && resJson.req.data.freeflowsip && resJson.req.data.freeflowsip[0]
            if (midurlinfo && midurlinfo.purl) {
              const domain = sip || 'http://ws.stream.qqmusic.qq.com/'
              resolve(domain + midurlinfo.purl)
            } else {
              resolve(`http://ws.stream.qqmusic.qq.com/C400${songmid}.m4a?guid=${guid}&vkey=7F62BF906EC7E4FFAC35A8876C66B49C7B68F915535D5275979A8761F6FA545595DE36343A3FF61F9259CED9EE18D44888D529E9AD73BB66&uin=0&fromtag=38`)
            }
          } catch (e) {
            reject(e)
          }
        })
      })
      req.on('error', reject)
      req.write(data)
      req.end()
    } catch (err) {
      reject(err)
    }
  })
}

// 核心音乐平台解析函数
async function parseMusicUrl(url) {
  const host = urlModule.parse(url).host || ''
  
  if (host.includes('163.com') || host.includes('163cn.tv')) {
    const match = url.match(/(?:id=|song\/)(\d+)/)
    if (match && match[1]) {
      const songId = match[1]
      let pic = ''
      let title = '网易云音乐歌曲'
      try {
        const detailUrl = `https://music.163.com/api/song/detail?id=${songId}&ids=[${songId}]`
        const detailData = await requestPage(detailUrl, {
          'Referer': 'https://music.163.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        const detail = JSON.parse(detailData)
        if (detail.songs && detail.songs[0]) {
          const song = detail.songs[0]
          pic = song.al && song.al.picUrl ? song.al.picUrl : ''
          title = song.name || title
        }
      } catch (e) {
        // 获取封面失败，忽略
      }
      return {
        title: title,
        videoUrl: `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
        pic: pic,
        desc: '网易云音乐外链播放',
        ownerName: '网易云音乐'
      }
    }
  }
  
  if (host.includes('qq.com') || host.includes('qqmusic')) {
    let songmid = ''
    const midMatch = url.match(/(?:songmid|mid)=([a-zA-Z0-9]+)/) || url.match(/songDetail\/([a-zA-Z0-9]+)/)
    if (midMatch) {
      songmid = midMatch[1]
    }
    
    if (songmid) {
      let pic = ''
      let title = 'QQ音乐歌曲'
      try {
        const detailUrl = `https://u.y.qq.com/cgi-bin/musicu.fcg?data=${encodeURIComponent(JSON.stringify({comm:{ct:24,cv:0},songinfo:{method:"get_song_detail_yqq",param:{song_type:0,song_mid:songmid,song_id:""},module:"music.pf_song_detail_svr"}}))}`
        const detailData = await requestPage(detailUrl, {
          'Referer': 'https://y.qq.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        const detail = JSON.parse(detailData)
        if (detail.songinfo && detail.songinfo.data && detail.songinfo.data.track_info) {
          const track = detail.songinfo.data.track_info
          title = track.name || title
          if (track.album && track.album.mid) {
            pic = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${track.album.mid}.jpg`
          }
        }
      } catch (e) {
        // 获取封面失败，忽略
      }
      
      try {
        const playUrl = await getQQMusicPlayUrl(songmid)
        return {
          title: title,
          videoUrl: playUrl,
          pic: pic,
          desc: 'QQ音乐外链播放',
          ownerName: 'QQ音乐'
        }
      } catch (e) {
        return {
          title: title,
          videoUrl: `http://ws.stream.qqmusic.qq.com/C400${songmid}.m4a?guid=2799562608&vkey=7F62BF906EC7E4FFAC35A8876C66B49C7B68F915535D5275979A8761F6FA545595DE36343A3FF61F9259CED9EE18D44888D529E9AD73BB66&uin=0&fromtag=38`,
          pic: pic,
          desc: 'QQ音乐外链播放(备用)',
          ownerName: 'QQ音乐'
        }
      }
    }
  }
  
  throw new Error('不支持的音乐链接或解析失败')
}

// 核心多平台视频解析函数
async function parseVideoUrl(url) {
  const res = await requestPage(url)
  const finalUrl = res.url
  const html = res.html
  const host = urlModule.parse(finalUrl).host || ''
  
  let videoUrl = ''
  let title = '在线视频'
  let pic = ''
  let desc = ''
  let ownerName = ''
  
  // 深度遍历 JSON/对象里的 mp4/m3u8 地址
  const walkMedia = (obj, depth) => {
    if (!obj || depth > 8) return null
    if (typeof obj === 'string') {
      const s = obj.replace(/\\u002F/g, '/').replace(/\\//g, '/')
      if (/^https?:\/\//i.test(s) && /\.(mp4|m3u8)(\?|$)/i.test(s)) return s
      return null
    }
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const r = walkMedia(obj[i], depth + 1)
        if (r) return r
      }
      return null
    }
    if (typeof obj === 'object') {
      // 优先 play_addr / url_list / masterUrl 等常见字段
      const preferKeys = ['play_addr', 'url_list', 'playUrl', 'play_url', 'masterUrl', 'originVideoUrl', 'backupUrl', 'backup_url', 'url']
      for (let k of preferKeys) {
        if (obj[k] !== undefined) {
          const r = walkMedia(obj[k], depth + 1)
          if (r) return r
        }
      }
      for (let k in obj) {
        const r = walkMedia(obj[k], depth + 1)
        if (r) return r
      }
    }
    return null
  }
  
  // 1. 根据不同平台定制解析逻辑
  if (host.includes('weibo.com') || host.includes('weibo.cn')) {
    // 微博视频解析
    const match = html.match(/"stream_url"\s*:\s*"([^"]+)"/) || 
                  html.match(/"hd_url"\s*:\s*"([^"]+)"/) ||
                  html.match(/video_src\s*=\s*["']([^"']+)["']/)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/').replace(/&amp;/g, '&')
    }
    const titleMatch = html.match(/<title>([^<]+)<\/title>/) || html.match(/"status_title"\s*:\s*"([^"]+)"/)
    if (titleMatch) title = titleMatch[1]
    const picMatch = html.match(/"page_pic"\s*:\s*"([^"]+)"/) || html.match(/cover_img\s*=\s*["']([^"']+)["']/)
    if (picMatch) pic = picMatch[1].replace(/\\u002F/g, '/')
    
    // 微博备用方案，抓取网页内的 weibo CDN 直链
    if (!videoUrl) {
      const weiboCdnMatch = html.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.weibocdn\.com\/[a-zA-Z0-9_\-\/\?\&\=\.%\+]*?\.(?:mp4|m3u8)[a-zA-Z0-9_\-\/\?\&\=\.%\+]*?/i)
      if (weiboCdnMatch) {
        videoUrl = weiboCdnMatch[0]
      }
    }
  } 
  else if (host.includes('douyin.com') || host.includes('iesdouyin.com') || host.includes('tiktok.com')) {
    // 抖音：优先正则，再遍历页面内嵌 JSON
    const match = html.match(/playAddr[^\}]*?src["']?\s*:\s*["']([^"']+)["']/i) || 
                  html.match(/["']play_addr["'][^\{]*?["']url_list["']\s*:\s*\[\s*["']([^"']+)["']/i) ||
                  html.match(/"playApi"\s*:\s*"([^"]+)"/i) ||
                  html.match(/srcNoMark["']?\s*:\s*["']([^"']+)["']/i)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/').replace(/\\//g, '/')
      if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl
    }
    // RENDER_DATA / _ROUTER_DATA / __pace_f 深度遍历
    if (!videoUrl) {
      const jsonBlobs = []
      const renderDataMatch = html.match(/id="RENDER_DATA"[^>]*>([^<]+)/)
      if (renderDataMatch) {
        try { jsonBlobs.push(JSON.parse(decodeURIComponent(renderDataMatch[1]))) } catch (e) {}
      }
      for (const key of ['__ROUTER_DATA', '_ROUTER_DATA', '__pace_f', 'RENDER_DATA']) {
        const obj = extractJsonObject(html, key)
        if (obj) jsonBlobs.push(obj)
      }
      // 兜底：直接从 HTML 抠 JSON 片段里的 mp4
      for (const blob of jsonBlobs) {
        const found = walkMedia(blob, 0)
        if (found) {
          videoUrl = found
          break
        }
      }
    }
    if (!videoUrl) {
      const anyMp4 = html.match(/https?:\\?\/\\?\/[^"'\s]+?\.mp4[^"'\s]*/i)
      if (anyMp4) videoUrl = anyMp4[0].replace(/\\u002F/g, '/').replace(/\\\//g, '/')
    }
  }
  else if (host.includes('kuaishou.com')) {
    // 快手视频解析
    const match = html.match(/srcNoMark["']\s*:\s*["']([^"']+)["']/) || 
                  html.match(/playUrl["']\s*:\s*["']([^"']+)["']/) ||
                  html.match(/"url"\s*:\s*"(https?:[^"]+\.mp4[^"]*)"/i)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/')
      if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl
    }
    if (!videoUrl) {
      const obj = extractJsonObject(html, '__APOLLO_STATE__') || extractJsonObject(html, 'INIT_STATE')
      videoUrl = walkMedia(obj, 0) || ''
    }
  }
  else if (host.includes('xiaohongshu.com') || host.includes('xhslink.com')) {
    // 小红书：优先正则，再走 __INITIAL_STATE__
    const match = html.match(/"masterUrl"\s*:\s*"([^"]+)"/) || 
                  html.match(/"originVideoUrl"\s*:\s*"([^"]+)"/) ||
                  html.match(/"backupUrls"\s*:\s*\[\s*"([^"]+)"/) ||
                  html.match(/"url"\s*:\s*"(https?:[^"]+?\.mp4[^"]*)"/i)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/').replace(/\\//g, '/')
      if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl
    }
    if (!videoUrl) {
      const state = extractJsonObject(html, '__INITIAL_STATE__')
      if (state) {
        videoUrl = walkMedia(state, 0) || ''
        // 标题/封面
        try {
          const note = (state.note && (state.note.noteDetailMap || state.note)) || state
          const detail = note.noteDetailMap ? Object.values(note.noteDetailMap)[0] : note
          const noteData = (detail && (detail.note || detail)) || {}
          if (noteData.title) title = noteData.title
          if (noteData.desc) desc = noteData.desc
          if (noteData.imageList && noteData.imageList[0] && noteData.imageList[0].urlDefault) pic = noteData.imageList[0].urlDefault
          if (noteData.user && noteData.user.nickname) ownerName = noteData.user.nickname
        } catch (e) {}
      }
    }
  }
  
  // 2. 通用 HTML 媒体嗅探备用方案
  if (!videoUrl) {
    const mp4Matches = html.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z0-9\-\.]+(?:\:[0-9]+)?\/[a-zA-Z0-9_\-\/\?\&\=\.%\+\#]*?\.(?:mp4|m3u8|mov)[a-zA-Z0-9_\-\/\?\&\=\.%\+\#]*/gi)
    if (mp4Matches) {
      const validUrls = mp4Matches.filter(u => {
        const lower = u.toLowerCase()
        return !lower.includes('.js') && !lower.includes('.css') && !lower.includes('hm.baidu.com')
      })
      if (validUrls.length > 0) {
        videoUrl = validUrls[0]
      }
    }
  }
  
  // 获取标题 and 描述
  if (title === '在线视频') {
    const tMatch = html.match(/<title>([^<]+)<\/title>/i)
    if (tMatch) title = tMatch[1].trim()
  }
  
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
  if (descMatch) desc = descMatch[1]
  
  return {
    title,
    pic,
    desc,
    ownerName,
    videoUrl
  }
}

// 从任意文本提取 BV 号（兼容空格/零宽字符，前缀不区分大小写）
function extractBvid(text) {
  if (!text) return null
  const compact = String(text).replace(/[\s\u200b\ufeff\u00a0\u3000]+/g, '')
  const m = compact.match(/BV([0-9A-Za-z]{10})/i)
  return m ? ('BV' + m[1]) : null
}

// 从 HTML 里按花括号配平截取 JSON 对象（避免正则截断嵌套结构）
function extractJsonObject(html, varName) {
  if (!html) return null
  const marker = 'window.' + varName
  const idx = html.indexOf(marker)
  if (idx < 0) return null
  const eq = html.indexOf('=', idx)
  if (eq < 0) return null
  const start = html.indexOf('{', eq)
  if (start < 0) return null
  let depth = 0
  let inStr = false
  let escape = false
  for (let i = start; i < html.length; i++) {
    const ch = html.charAt(i)
    if (escape) { escape = false; continue }
    if (ch === '\\') { escape = true; continue }
    if (ch === '"') inStr = !inStr
    if (inStr) continue
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        const raw = html.substring(start, i + 1)
        try { return JSON.parse(raw) } catch (e) { return null }
      }
    }
  }
  return null
}

// B站风控/错误码转可读中文
function friendlyBiliError(code, message) {
  const msg = String(message || '')
  if (code === -412 || /request was banned|banned|风控|拒绝访问/i.test(msg)) {
    return 'B站接口触发风控，请稍后重试或复制链接到浏览器观看'
  }
  if (code === -404 || /bad request|参数/i.test(msg)) {
    return '视频不存在或链接无效'
  }
  if (code === 62002 || /稿件不可见|已失效/i.test(msg)) {
    return '视频已失效或不可见'
  }
  if (code === -101 || /账号未登录|未登录/i.test(msg)) {
    return 'B站接口需要登录，无法解析'
  }
  if (/timeout|超时/i.test(msg)) {
    return '解析超时，请稍后重试'
  }
  return msg || '获取视频信息失败'
}

function isBannedResult(res) {
  return res && (res.code === -412 || /request was banned|banned/i.test(String(res.message || '')))
}

// 换移动端 UA + 随机 buvid 再取一次
function getJSONMobile(url) {
  return getJSON(url, {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Referer': 'https://m.bilibili.com/',
    'Origin': 'https://m.bilibili.com',
    'Cookie': 'buvid3=' + Date.now() + Math.random().toString(36).slice(2, 10) + 'infoc; b_nut=' + Math.floor(Date.now() / 1000)
  })
}

// B站 API 不可用时，从视频页兜底解析
async function parseBilibiliFromPage(bvid) {
  const tryUrls = [
    'https://www.bilibili.com/video/' + bvid + '/',
    'https://m.bilibili.com/video/' + bvid
  ]
  for (const pageUrl of tryUrls) {
    try {
      const res = await requestPage(pageUrl, {
        'Referer': 'https://www.bilibili.com/',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': 'buvid3=' + Date.now() + Math.random().toString(36).slice(2, 10) + 'infoc;'
      })
      const html = res.html || ''
      const playinfo = extractJsonObject(html, '__playinfo__')
      const initialState = extractJsonObject(html, '__INITIAL_STATE__')

      let title = ''
      let pic = ''
      let desc = ''
      let ownerName = ''
      let videoUrl = ''

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/property="og:title"\s+content="([^"]+)"/i)
      if (titleMatch) {
        title = titleMatch[1].replace(/[_\-]\s*哔哩哔哩.*$/i, '').replace(/_bilibili.*$/i, '').trim()
      }
      const picMatch = html.match(/property="og:image"\s+content="([^"]+)"/i)
      if (picMatch) pic = picMatch[1]
      const descMatch = html.match(/property="og:description"\s+content="([^"]+)"/i)
      if (descMatch) desc = descMatch[1]

      if (playinfo && playinfo.data) {
        const durl = playinfo.data.durl
        if (durl && durl[0] && durl[0].url) videoUrl = durl[0].url
      }

      if (initialState && initialState.videoData) {
        const vd = initialState.videoData
        title = title || vd.title || ''
        pic = pic || vd.pic || ''
        desc = desc || vd.desc || ''
        ownerName = (vd.owner && vd.owner.name) || ''
        // cid 兜底：有的页面只有 videoData 没有 playinfo
        if (!videoUrl && vd.cid) {
          try {
            let playRes = await getJSON(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${vd.cid}&platform=html5&qn=80&fnval=1`)
            if (isBannedResult(playRes) || !playRes || playRes.code !== 0) {
              playRes = await getJSONMobile(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${vd.cid}&platform=html5&qn=80&fnval=1`)
            }
            if (playRes && playRes.code === 0 && playRes.data && playRes.data.durl && playRes.data.durl[0]) {
              videoUrl = playRes.data.durl[0].url
            }
          } catch (e) {}
        }
      }

      if (!videoUrl && !title && !initialState) continue
      return {
        title: title || 'B站视频',
        pic: pic,
        desc: desc,
        ownerName: ownerName,
        videoUrl: videoUrl
      }
    } catch (e) {
      // 尝试下一个入口
    }
  }
  return null
}

exports.main = async (event, context) => {
  let bvid = event.bvid ? extractBvid(event.bvid) || String(event.bvid).trim() : null
  const url = event.url

  // 1. 如果传了 bvid，走原有B站解析逻辑（风控换头重试 + 视频页兜底）
  if (bvid) {
    try {
      let viewRes = await getJSON(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
      if (isBannedResult(viewRes)) {
        try { viewRes = await getJSONMobile(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`) } catch (e) {}
      }
      if (!viewRes || viewRes.code !== 0 || !viewRes.data) {
        const fallback = await parseBilibiliFromPage(bvid)
        if (fallback && fallback.videoUrl) {
          return { code: 0, data: fallback }
        }
        return {
          code: (viewRes && viewRes.code) || -412,
          msg: friendlyBiliError(viewRes && viewRes.code, viewRes && viewRes.message)
        }
      }
      
      const info = viewRes.data
      const cid = info.cid || (info.pages && info.pages[0] && info.pages[0].cid)
      
      if (!cid) {
        return { code: -2, msg: '未找到视频分P' }
      }
      
      let playRes = await getJSON(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&platform=html5&qn=80&fnval=1`)
      if (isBannedResult(playRes)) {
        try {
          playRes = await getJSONMobile(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&platform=html5&qn=80&fnval=1`)
        } catch (e) {}
      }
      if (!playRes || playRes.code !== 0 || !playRes.data) {
        const fallback = await parseBilibiliFromPage(bvid)
        if (fallback && fallback.videoUrl) {
          return { code: 0, data: fallback }
        }
        return {
          code: (playRes && playRes.code) || -412,
          msg: friendlyBiliError(playRes && playRes.code, playRes && playRes.message)
        }
      }
      
      return {
        code: 0,
        data: {
          title: info.title,
          pic: info.pic,
          ownerName: info.owner ? info.owner.name : '',
          desc: info.desc,
          videoUrl: playRes.data.durl && playRes.data.durl[0] ? playRes.data.durl[0].url : ''
        }
      }
    } catch (err) {
      const fallback = await parseBilibiliFromPage(bvid)
      if (fallback && fallback.videoUrl) {
        return { code: 0, data: fallback }
      }
      return { code: -99, msg: friendlyBiliError(-99, err.message || '系统错误') }
    }
  }

  // 2. 如果传了 url，走通用视频及其他平台的解析逻辑
  if (url) {
    try {
      // 先去掉空白再识别
      const cleanUrl = String(url).replace(/[\s\u200b\ufeff\u00a0\u3000]+/g, '')
      // 判定是否是音乐链接
      const host = urlModule.parse(cleanUrl).host || ''
      const isMusic = host.includes('163.com') || host.includes('163cn.tv') || host.includes('qq.com') || host.includes('qqmusic')
      
      if (isMusic) {
        const musicData = await parseMusicUrl(cleanUrl)
        return {
          code: 0,
          data: musicData
        }
      }

      const bvFromUrl = extractBvid(cleanUrl)
      if (bvFromUrl) {
        return exports.main({ bvid: bvFromUrl }, context)
      }
      
      // b23.tv 等短链：跟进重定向后再抽 BV
      if (/b23\.tv\//i.test(cleanUrl) || /bilibili\.com/i.test(cleanUrl)) {
        try {
          const res = await requestPage(cleanUrl)
          const htmlBvid = (res.html || '').match(/"bvid"\s*:\s*"(BV[0-9A-Za-z]{10})"/i)
          const bvFromFinal = extractBvid(res.url) || (htmlBvid ? ('BV' + htmlBvid[1]) : extractBvid(res.html || ''))
          if (bvFromFinal) {
            return exports.main({ bvid: bvFromFinal }, context)
          }
        } catch (e) {
          // 继续走通用解析
        }
      }
      
      const data = await parseVideoUrl(cleanUrl)
      if (!data.videoUrl) {
        return { code: -3, msg: '未能解析出有效的视频播放流' }
      }
      return {
        code: 0,
        data: data
      }
    } catch (err) {
      return { code: -99, msg: err.message || '解析出错' }
    }
  }

  return { code: -1, msg: 'bvid or url is required' }
}

