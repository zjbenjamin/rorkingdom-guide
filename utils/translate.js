var i18n = require('./i18n')

function translateText(text, callback) {
  if (!text || !text.trim()) { callback({}); return }
  var targets = ['en', 'ja', 'ko']
  
  wx.cloud.callFunction({
    name: 'translateText',
    data: { text: text, from: 'zh', targets: targets }
  }).then(function(res) {
    callback(res.result.translations || {})
  }).catch(function() {
    callback({})
  })
}

function translateAnnouncement(item, callback) {
  var fields = [{ key: 'title', text: item.title }]
  if (item.content) fields.push({ key: 'content', text: item.content })

  var pending = fields.length
  if (pending === 0) { callback(item); return }

  var translations = {}
  for (var f = 0; f < fields.length; f++) {
    ;(function(field) {
      translateText(field.text, function(result) {
        translations[field.key] = result
        pending--
        if (pending === 0) {
          for (var k in translations) {
            for (var lang in translations[k]) {
              item[k + '_' + lang] = translations[k][lang]
            }
          }
          callback(item)
        }
      })
    })(fields[f])
  }
}

function getLocalized(item, key, fallback) {
  var lang = i18n.getLanguage()
  if (lang === 'zh') return item[key] || fallback
  var translated = item[key + '_' + lang]
  return translated || item[key] || fallback
}

module.exports = {
  translateText: translateText,
  translateAnnouncement: translateAnnouncement,
  getLocalized: getLocalized
}
