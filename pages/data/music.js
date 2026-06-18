function parseNeteaseMusic(content) {
  if (!content) return { text: content, musicList: [] }
  var musicList = []
  var iframeRegex = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi
  var match
  while ((match = iframeRegex.exec(content)) !== null) {
    var src = match[1]
    if (src.indexOf('music.163.com') >= 0) {
      var typeMatch = src.match(/type=(\d+)/)
      var idMatch = src.match(/id=(\d+)/)
      if (typeMatch && idMatch) {
        var type = typeMatch[1]
        var id = idMatch[1]
        musicList.push({
          platform: 'netease',
          type: type === '2' ? 'song' : type === '1' ? 'playlist' : type === '10' ? 'album' : 'song',
          id: id,
          url: 'https://music.163.com/#' + (type === '2' ? '/song' : type === '1' ? '/playlist' : '/album') + '?id=' + id
        })
      }
    } else if (src.indexOf('y.qq.com') >= 0 || src.indexOf('qqmusic') >= 0 || src.indexOf('music.qq.com') >= 0) {
      var midMatch = src.match(/(?:songmid|mid)=([a-zA-Z0-9]+)/)
      if (midMatch) {
        musicList.push({
          platform: 'qq',
          type: 'song',
          id: midMatch[1],
          url: 'https://y.qq.com/n/ryqq/songDetail/' + midMatch[1]
        })
      }
    }
  }
  var cleanText = content.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '').trim()
  return { text: cleanText, musicList: musicList }
}

function parseUrl(content) {
  if (!content) return []
  var musicList = []
  
  // 1. 网易云音乐
  var neteaseRegex = /https?:\/\/music\.163\.com\/(?:#\/)?(?:song|playlist|album)\?id=(\d+)/gi
  var match
  while ((match = neteaseRegex.exec(content)) !== null) {
    var type = match[0].indexOf('song') >= 0 ? 'song' : match[0].indexOf('playlist') >= 0 ? 'playlist' : 'album'
    musicList.push({
      platform: 'netease',
      type: type,
      id: match[1],
      url: match[0]
    })
  }

  // 2. QQ音乐
  var qqRegex = /https?:\/\/(?:y\.qq\.com\/n\/ryqq\/songDetail\/|i\.y\.qq\.com\/v8\/playsong\.html\?.*?songmid=)([a-zA-Z0-9]+)/gi
  while ((match = qqRegex.exec(content)) !== null) {
    musicList.push({
      platform: 'qq',
      type: 'song',
      id: match[1],
      url: match[0]
    })
  }
  
  return musicList
}

module.exports = {
  parseNeteaseMusic: parseNeteaseMusic,
  parseUrl: parseUrl
}
