var templateConfig = require('../config/notifyTemplates')
var i18n = require('./i18n')

function smartTruncate(text, maxLen) {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen - 1) + '…'
}

function pushI18n(key, fallback) {
  var t = i18n.i18n[i18n.getLanguage()] || i18n.i18n.zh
  return t[key] || fallback
}

var TEMPLATES = {
  announcement: templateConfig.announcement || 'TEMPLATE_ID_ANNOUNCEMENT',
  activity: templateConfig.activity || 'TEMPLATE_ID_ACTIVITY',
  merchant: templateConfig.merchant || 'TEMPLATE_ID_MERCHANT',
  merchant_item: templateConfig.merchant || 'TEMPLATE_ID_MERCHANT',
  interaction: templateConfig.interaction || 'TEMPLATE_ID_INTERACTION'
}

function resolveOpenid(callback) {
  var cached = wx.getStorageSync('openid')
  if (cached) { callback(cached); return }
  wx.cloud.callFunction({
    name: 'login',
    timeout: 3000,
    success: function(res) {
      var oid = res.result && res.result.openid
      if (oid) {
        wx.setStorageSync('openid', oid)
        callback(oid)
      } else {
        callback(null)
      }
    },
    fail: function() { callback(null) }
  })
}

function getSubscriptionStatus(callback) {
  var db = null
  if (wx.cloud) db = wx.cloud.database()
  if (!db) { callback(null, {}); return }
  resolveOpenid(function(openid) {
    if (!openid) { callback(null, {}); return }
    db.collection('subscribers').where({ openid: openid, status: 'active' }).get()
      .then(function(res) {
        var status = {}
        for (var i = 0; i < res.data.length; i++) {
          var sub = res.data[i]
          if (sub.itemName) {
            if (!status[sub.type + '_items']) status[sub.type + '_items'] = {}
            status[sub.type + '_items'][sub.itemName] = true
            status[sub.type + '_items_' + sub.itemName + 'Count'] = sub.count || 0
          } else {
            status[sub.type] = true
            status[sub.type + 'Count'] = sub.count || 0
          }
        }
        callback(null, status)
      })
      .catch(function(err) { callback(err, null) })
  })
}

function pushToSubscribers(type, title, content, page, itemName, itemNames) {
  if (!wx.cloud) {
    console.error('云开发环境不可用，无法执行云函数推送')
    return
  }
  wx.cloud.callFunction({
    name: 'sendSubscribe',
    data: {
      type: type,
      title: title,
      content: content,
      page: page || '/pages/index/index',
      itemName: itemName,
      itemNames: itemNames
    },
    success: function(res) {
      console.log('推送已提交:', res.result)
    },
    fail: function(err) {
      console.error('推送失败:', err)
    }
  })
}

module.exports = {
  TEMPLATES: TEMPLATES,
  smartTruncate: smartTruncate,
  pushI18n: pushI18n,
  resolveOpenid: resolveOpenid,
  getSubscriptionStatus: getSubscriptionStatus,
  pushToSubscribers: pushToSubscribers
}
