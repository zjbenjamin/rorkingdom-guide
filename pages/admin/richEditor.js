/**
 * 富文本编辑器公共工具：链接/分享解析、表格解析、HTML 生成
 * 供 pages/admin 公告与活动两套编辑器共用，避免重复实现。
 */
/**
 * 富文本编辑器公共工具：链接/分享解析、表格解析、HTML 生成
 * 供 pages/admin 公告与活动两套编辑器共用，避免重复实现。
 */
function parseMusicShare(text) {
  if (!text) return { url: null, name: null };
  var url = null;
  var srcRegex = /src\s*=\s*['"]([^'"]+)['"]/i;
  var srcMatch = text.match(srcRegex);
  if (srcMatch) {
    url = srcMatch[1];
    if (url.indexOf('//') === 0) url = 'https:' + url;
  } else {
    var urlRegex = /(https?:\/\/[^\s'"<>）)】\]》]+)/i;
    var urlMatch = text.match(urlRegex);
    url = urlMatch ? urlMatch[1] : null;
  }

  if (url) {
    url = convertMusicUrl(url);
  }

  var name = null;

  var dotSpaceDot = text.match(/^(.+?)[\s]*[·\-—][\s]*(.+?)[\s]*$/);
  if (!dotSpaceDot) {
    var patterns = [
      /《([^》]+)》\s*[-\-—·]\s*(.+)/,
      /([^-—·]+)[\s]*[·\-—][\s]*(.+)/
    ];
    for (var p = 0; p < patterns.length; p++) {
      var m = text.match(patterns[p]);
      if (m && m[1] && m[2]) {
        var left = m[1].replace(/https?:\/\/[^\s]+/g, '').trim();
        var right = m[2].replace(/https?:\/\/[^\s]+/g, '').trim();
        if (left && right && left.length < 30 && right.length < 30) {
          var isPlatform = /网易云|QQ音乐|酷狗|酷我|虾米|spotify|apple/i.test(left) || /网易云|QQ音乐|酷狗|酷我|虾米|spotify|apple/i.test(right);
          if (!isPlatform) {
            name = left + ' - ' + right;
            break;
          }
        }
      }
    }
  }

  if (!name) {
    var bracketPatterns = [
      /《([^》]+)》/,
      /【([^】]+)】/,
      /「([^」]+)」/,
      /\[([^\]]+)\]/
    ];
    for (var i = 0; i < bracketPatterns.length; i++) {
      var match = text.match(bracketPatterns[i]);
      if (match && match[1].trim() && match[1].trim().length < 40) {
        name = match[1].trim();
        break;
      }
    }
  }

  return { url: url, name: name };
}

function convertMusicUrl(url) {
  if (!url) return url;
  url = url.replace(/[,;!！。，；、]+$/, '');
  var neteaseId = url.match(/(?:music\.163\.com\/.*[?&]id=|music\.163\.com\/song\/(?:media\/outer\/)?(?:\?id=)?|163cn\.tv\/\w+\/?.*?song\/?.*?[?&]id=|song\?id=)(\d+)/i);
  if (neteaseId && neteaseId[1]) {
    return 'https://music.163.com/song/media/outer/url?id=' + neteaseId[1] + '.mp3';
  }
  if (url.indexOf('163cn.tv') > -1 || url.indexOf('m.163.com') > -1) {
    return url;
  }
  return url;
}

function parseGuessedName(text, url) {
  if (!text) return '';
  var cleanText = text;
  if (url) {
    cleanText = cleanText.replace(url, '');
    var shortUrl = url.replace(/^https?:/, '');
    cleanText = cleanText.replace(shortUrl, '');
  }
  cleanText = cleanText.replace(/<[^>]+>/g, '');

  var keywords = [
    /分享.*?的单曲/g,
    /分享单曲/g,
    /分享.*?的歌/g,
    /来自@网易云音乐/g,
    /来自@QQ音乐/g,
    /来自@酷狗音乐/g,
    /来自@酷我音乐/g,
    /来自@/g,
    /QQ音乐/g,
    /网易云音乐/g,
    /酷狗音乐/g,
    /酷我音乐/g,
    /抖音/g,
    /快手/g,
    /微博/g,
    /朋友圈/g,
    /\[.*?链接\]/g,
    /\(.*?链接\)/g,
    /\(.*?复制.*?\)/g,
    /复制此链接/g,
    /打开.*?直接播放/g,
    /点击.*?听歌/g,
    /http[^\s]+/g,
    /\s*[-–—·]\s*网易云音乐/g,
    /\s*[-–—·]\s*QQ音乐/g,
    /\s*[-–—·]\s*酷狗音乐/g,
    /\s*[-–—·]\s*酷我音乐/g,
    /\[/g, /\]/g,
    /【/g, /】/g,
    /「/g, /」/g,
    /《/g, /》/g,
    /\(/g, /\)/g,
    /（/g, /）/g,
    /🎧/g, /🎵/g, /🎶/g, /🎸/g, /🎤/g, /🎼/g
  ];
  keywords.forEach(function(kw) {
    cleanText = cleanText.replace(kw, '');
  });
  cleanText = cleanText.replace(/^[:：\s,，\-——+··]+/g, '');
  cleanText = cleanText.replace(/[:：\s,，\-——+··]+$/g, '');
  cleanText = cleanText.replace(/\s{2,}/g, ' ');
  cleanText = cleanText.trim();
  if (cleanText && cleanText.length > 0 && cleanText.length < 50) {
    return cleanText;
  }
  return '';
}

function parseBilibiliUrl(url) {
  if (!url) return null
  var bvMatch = url.match(/BV[a-zA-Z0-9]{10,}/)
  if (bvMatch) return { platform: 'bilibili', platformName: 'B站', id: bvMatch[0], url: 'https://www.bilibili.com/video/' + bvMatch[0] }
  var avMatch = url.match(/av(\d{6,})/i)
  if (avMatch) return { platform: 'bilibili', platformName: 'B站', id: 'av' + avMatch[1], url: 'https://www.bilibili.com/video/av' + avMatch[1] + '/' }
  var shortMatch = url.match(/b23\.tv\/([a-zA-Z0-9]+)/)
  if (shortMatch) return { platform: 'bilibili', platformName: 'B站', id: shortMatch[1], url: url }
  return null
}

function parseWeiboUrl(url) {
  if (!url) return null
  var fidMatch = url.match(/fid=([0-9:]+)/)
  if (fidMatch) return { platform: 'weibo', platformName: '微博', id: fidMatch[1], url: 'https://video.weibo.com/show?fid=' + fidMatch[1] }
  var showMatch = url.match(/(?:tv\/show|show)\/([0-9:]+)/)
  if (showMatch) return { platform: 'weibo', platformName: '微博', id: showMatch[1], url: 'https://video.weibo.com/show?fid=' + showMatch[1] }
  
  // 解析微博文章 (ttarticle)
  var articleMatch = url.match(/ttarticle\/p\/show\?id=(\d+)/) || url.match(/weibo\.com\/ttarticle\/p\/show\?id=(\d+)/)
  if (articleMatch) return { platform: 'weibo_article', platformName: '微博文章', id: articleMatch[1], url: 'https://weibo.com/ttarticle/p/show?id=' + articleMatch[1] }
  
  if (url.indexOf('weibo.com') > -1 || url.indexOf('weibo.cn') > -1) {
    return { platform: 'weibo', platformName: '微博', id: '', url: url }
  }
  return null
}

function parseVideoUrl(url) {
  if (!url) return null
  return parseBilibiliUrl(url) || parseWeiboUrl(url) || null
}

function parseTableInput(text) {
  if (!text || !text.trim()) return null
  var lines = text.trim().split('\n')
  if (lines.length < 2) {
    var commaLines = text.trim().split(/\n|;/)
    if (commaLines.length >= 2) lines = commaLines
    else return null
  }
  var rows = []
  var cols = 0
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim()
    if (!line) continue
    var seps = ['|', '\t', ',']
    var bestSep = '|'
    var bestCount = 0
    for (var s = 0; s < seps.length; s++) {
      var parts = line.split(seps[s])
      var count = 0
      for (var p = 0; p < parts.length; p++) {
        var part = parts[p].trim()
        if (part && !/^[-—*=_]{3,}$/.test(part)) count++
      }
      if (count > bestCount) { bestCount = count; bestSep = seps[s]; cols = Math.max(cols, count) }
    }
    var cells = line.split(bestSep).map(function(c) { return c.trim() }).filter(function(c, idx) { return c || idx < cols })
    if (cells.length > 0) rows.push(cells)
  }
  if (rows.length < 2) {
    return null
  }
  var headers = rows[0]
  var dataRows = rows.slice(1)
  return { headers: headers, rows: dataRows, rowCount: dataRows.length, colCount: headers.length }
}

function extractCleanURL(text) {
  if (!text) return ''
  text = text.replace(/[\r\n]+/g, ' ').trim()
  var urlMatch = text.match(/(https?:\/\/[^\s'"<>）)】\]》《，,。;；!！?？]+)/i)
  if (urlMatch) {
    var url = urlMatch[1]
    url = url.replace(/[,;.!?？)，,】\]》）;:：。、]+$/, '')
    return url
  }
  if (/^https?:\/\//i.test(text)) {
    return text.replace(/[,;.!?？)，,】\]》）;:：。、\s]+$/, '')
  }
  return text
}

/**
 * 将 richContent 块数组渲染为展示用 HTML。
 * 公告与活动提交逻辑共用，改动只需维护这一处。
 */
function buildHtmlFromRichContent(richContent) {
  var htmlParts = []
  for (var i = 0; i < richContent.length; i++) {
    var block = richContent[i]
    if (block.type === 'quote') {
      htmlParts.push('<blockquote style="border-left:4rpx solid rgba(0,212,255,0.3);padding-left:12rpx;color:rgba(255,255,255,0.7);font-size:26rpx;margin:12rpx 0;">' + block.content + '</blockquote>')
    } else if (block.type === 'music') {
      htmlParts.push('<p style="color:#00d4ff;font-size:26rpx;margin:12rpx 0;text-decoration:underline;">🎵 推荐单曲: ' + block.name + ' (' + block.url + ')</p>')
    } else if (block.type === 'video') {
      var platformEmoji = block.platform === 'bilibili' ? '📺' : '🎬'
      var videoTitle = block.name ? block.name + ' - ' : ''
      htmlParts.push('<p style="color:#ff6b9d;font-size:26rpx;margin:12rpx 0;">' + platformEmoji + ' 视频: ' + videoTitle + '<a href="' + block.url + '" style="color:#ff6b9d;text-decoration:underline;">' + block.url + '</a></p>')
    } else if (block.type === 'image') {
      htmlParts.push('<p style="text-align:center;margin:12rpx 0;"><img src="' + block.url + '" style="max-width:100%;border-radius:12rpx;" /></p>')
    } else if (block.type === 'attachment') {
      htmlParts.push('<p style="color:#ffab40;font-size:26rpx;margin:12rpx 0;">📎 附件: <a href="' + block.url + '" style="color:#ffab40;text-decoration:underline;">' + block.name + '</a></p>')
    } else if (block.type === 'divider') {
      htmlParts.push('<hr style="border:none;border-top:1px dashed rgba(255,255,255,0.15);margin:24rpx 0;" />')
    } else if (block.type === 'link') {
      var linkEmoji = block.isVideo ? '📺' : '🔗'
      htmlParts.push('<p style="color:#00d4ff;font-size:26rpx;margin:12rpx 0;">' + linkEmoji + ' 链接: <a href="' + block.url + '" style="color:#00d4ff;text-decoration:underline;">' + block.text + '</a></p>')
    } else if (block.type === 'table') {
      var tableHtml = '<table style="width:100%;border-collapse:collapse;margin:12rpx 0;font-size:24rpx;color:#fff;text-align:center;">'
      tableHtml += '<thead><tr>'
      for (var ci = 0; ci < block.headers.length; ci++) {
        tableHtml += '<th style="padding:12rpx 8rpx;background:rgba(0,200,255,0.1);border:1rpx solid rgba(0,200,255,0.2);font-weight:700;color:#00d4ff;">' + block.headers[ci] + '</th>'
      }
      tableHtml += '</tr></thead><tbody>'
      for (var ri = 0; ri < block.rows.length; ri++) {
        tableHtml += '<tr style="background:' + (ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)') + ';">'
        var row = block.rows[ri]
        var maxCols = Math.max(block.headers.length, (row ? row.length : 0))
        for (var cj = 0; cj < maxCols; cj++) {
          tableHtml += '<td style="padding:10rpx 8rpx;border:1rpx solid rgba(255,255,255,0.06);">' + (row && row[cj] ? row[cj] : '') + '</td>'
        }
        tableHtml += '</tr>'
      }
      tableHtml += '</tbody></table>'
      htmlParts.push(tableHtml)
    } else {
      if (block.html) {
        htmlParts.push(block.html)
      } else {
        var style = 'font-size:' + block.size + 'rpx;color:' + block.color + ';'
        if (block.weight === 'bold') style += 'font-weight:bold;'
        if (block.style === 'italic') style += 'font-style:italic;'
        if (block.fontFamily && block.fontFamily !== 'sans-serif') style += 'font-family:' + block.fontFamily + ';'
        var contentWithBreaks = (block.content || '').replace(/\n/g, '<br/>')
        htmlParts.push('<p style="' + style + '">' + contentWithBreaks + '</p>')
      }
    }
  }
  return htmlParts.join('')
}


module.exports = {
  parseMusicShare: parseMusicShare,
  convertMusicUrl: convertMusicUrl,
  parseGuessedName: parseGuessedName,
  parseBilibiliUrl: parseBilibiliUrl,
  parseWeiboUrl: parseWeiboUrl,
  parseVideoUrl: parseVideoUrl,
  parseTableInput: parseTableInput,
  extractCleanURL: extractCleanURL,
  buildHtmlFromRichContent: buildHtmlFromRichContent
}