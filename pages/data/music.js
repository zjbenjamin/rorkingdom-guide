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
          type: type === '2' ? 'song' : type === '1' ? 'playlist' : type === '10' ? 'album' : 'song',
          id: id,
          url: 'https://music.163.com/#' + (type === '2' ? '/song' : type === '1' ? '/playlist' : '/album') + '?id=' + id
        })
      }
    }
  }
  var cleanText = content.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '').trim()
  return { text: cleanText, musicList: musicList }
}

function parseUrl(content) {
  if (!content) return []
  var urlRegex = /https?:\/\/music\.163\.com\/(?:#\/)?(?:song|playlist|album)\?id=(\d+)/gi
  var musicList = []
  var match
  while ((match = urlRegex.exec(content)) !== null) {
    var type = match[0].indexOf('song') >= 0 ? 'song' : match[0].indexOf('playlist') >= 0 ? 'playlist' : 'album'
    musicList.push({
      type: type,
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
