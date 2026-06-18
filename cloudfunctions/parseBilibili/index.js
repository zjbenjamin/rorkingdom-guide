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

// 获取 JSON（针对 B站 API）
function getJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = urlModule.parse(url)
      const client = parsedUrl.protocol === 'https:' ? https : http
      client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.bilibili.com/',
          ...headers
        }
      }, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(e)
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
      return {
        title: '网易云音乐歌曲',
        videoUrl: `https://music.163.com/song/media/outer/url?id=${match[1]}.mp3`,
        pic: '',
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
      try {
        const playUrl = await getQQMusicPlayUrl(songmid)
        return {
          title: 'QQ音乐歌曲',
          videoUrl: playUrl,
          pic: '',
          desc: 'QQ音乐外链播放',
          ownerName: 'QQ音乐'
        }
      } catch (e) {
        return {
          title: 'QQ音乐歌曲',
          videoUrl: `http://ws.stream.qqmusic.qq.com/C400${songmid}.m4a?guid=2799562608&vkey=7F62BF906EC7E4FFAC35A8876C66B49C7B68F915535D5275979A8761F6FA545595DE36343A3FF61F9259CED9EE18D44888D529E9AD73BB66&uin=0&fromtag=38`,
          pic: '',
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
  else if (host.includes('douyin.com')) {
    // 抖音视频解析
    const match = html.match(/playAddr[^\}]*?src["']:\s*["']([^"']+)["']/i) || 
                  html.match(/["']play_addr["'][^\{]*?["']url_list["']\s*:\s*\[\s*["']([^"']+)["']/i)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/')
      if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl
    }
    // 尝试 RENDER_DATA 深度遍历
    if (!videoUrl) {
      const renderDataMatch = html.match(/RENDER_DATA[^>]*>([^<]+)/)
      if (renderDataMatch) {
        try {
          const data = JSON.parse(decodeURIComponent(renderDataMatch[1]))
          const walk = (obj) => {
            if (typeof obj === 'string' && obj.startsWith('http') && obj.includes('.mp4')) return obj
            if (obj && typeof obj === 'object') {
              for (let k in obj) {
                const r = walk(obj[k])
                if (r) return r
              }
            }
            return null
          }
          const found = walk(data)
          if (found) videoUrl = found
        } catch(e) {}
      }
    }
  }
  else if (host.includes('kuaishou.com')) {
    // 快手视频解析
    const match = html.match(/srcNoMark["']\s*:\s*["']([^"']+)["']/) || 
                  html.match(/playUrl["']\s*:\s*["']([^"']+)["']/)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/')
    }
  }
  else if (host.includes('xiaohongshu.com') || host.includes('xhslink.com')) {
    // 小红书视频解析
    const match = html.match(/"masterUrl"\s*:\s*"([^"]+)"/) || 
                  html.match(/"originVideoUrl"\s*:\s*"([^"]+)"/)
    if (match) {
      videoUrl = match[1].replace(/\\u002F/g, '/')
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

exports.main = async (event, context) => {
  const bvid = event.bvid
  const url = event.url

  // 1. 如果传了 bvid，走原有B站解析逻辑
  if (bvid) {
    try {
      const viewRes = await getJSON(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
      if (viewRes.code !== 0 || !viewRes.data) {
        return { code: viewRes.code, msg: viewRes.message || '获取视频信息失败' }
      }
      
      const info = viewRes.data
      const cid = info.cid || (info.pages && info.pages[0] && info.pages[0].cid)
      
      if (!cid) {
        return { code: -2, msg: 'cid not found' }
      }
      
      const playRes = await getJSON(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&platform=html5&qn=80&fnval=1`)
      if (playRes.code !== 0 || !playRes.data) {
        return { code: playRes.code, msg: playRes.message || '获取播放地址失败' }
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
      return { code: -99, msg: err.message || '系统错误' }
    }
  }

  // 2. 如果传了 url，走通用视频及其他平台的解析逻辑
  if (url) {
    try {
      // 判定是否是音乐链接
      const host = urlModule.parse(url).host || ''
      const isMusic = host.includes('163.com') || host.includes('163cn.tv') || host.includes('qq.com') || host.includes('qqmusic')
      
      if (isMusic) {
        const musicData = await parseMusicUrl(url)
        return {
          code: 0,
          data: musicData
        }
      }

      const bvMatch = url.match(/BV[a-zA-Z0-9]{10,}/)
      if (bvMatch) {
        return exports.main({ bvid: bvMatch[0] }, context)
      }
      
      const data = await parseVideoUrl(url)
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

