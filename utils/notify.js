var templateConfig = require('../config/notifyTemplates')

var TEMPLATES = {
  announcement: templateConfig.announcement || 'TEMPLATE_ID_ANNOUNCEMENT',
  activity: templateConfig.activity || 'TEMPLATE_ID_ACTIVITY',
  system: templateConfig.system || 'TEMPLATE_ID_SYSTEM',
  merchant: templateConfig.merchant || 'TEMPLATE_ID_MERCHANT',
  interaction: templateConfig.interaction || 'TEMPLATE_ID_INTERACTION'
}

function isValidTemplateId(id) {
  return id && id.indexOf('TEMPLATE_ID') === -1 && id.length > 10
}

function getValidTemplateIds(types) {
  var ids = []
  if (!types || types.length === 0) {
    for (var key in TEMPLATES) {
      if (TEMPLATES.hasOwnProperty(key) && isValidTemplateId(TEMPLATES[key])) {
        ids.push({ type: key, id: TEMPLATES[key] })
      }
    }
  } else {
    for (var i = 0; i < types.length; i++) {
      var tid = TEMPLATES[types[i]]
      if (tid && isValidTemplateId(tid)) {
        ids.push({ type: types[i], id: tid })
      }
    }
  }
  return ids
}

function getAllTemplateIds() {
  var ids = []
  for (var key in TEMPLATES) {
    if (TEMPLATES.hasOwnProperty(key)) {
      ids.push(TEMPLATES[key])
    }
  }
  return ids
}

function checkSetting(callback) {
  wx.getSetting({
    withSubscriptions: true,
    success: function(res) {
      var settings = res.subscriptionsSetting || {}
      callback(null, settings)
    },
    fail: function(err) {
      callback(err, null)
    }
  })
}

function requestSubscribe(types, callback) {
  var validTemplates = getValidTemplateIds(types)
  if (validTemplates.length === 0) {
    callback({
      errMsg: 'requestSubscribeMessage:fail no valid template ids',
      noConfig: true,
      message: '通知模板未配置，请在微信公众平台配置订阅消息模板'
    }, null)
    return
  }
  var templateIds = validTemplates.map(function(t) { return t.id })
  wx.requestSubscribeMessage({
    tmplIds: templateIds,
    success: function(res) {
      var result = {}
      for (var j = 0; j < validTemplates.length; j++) {
        var item = validTemplates[j]
        result[item.type] = res[item.id] || 'reject'
      }
      callback(null, result)
    },
    fail: function(err) {
      callback(err, null)
    }
  })
}

function saveSubscription(type, callback) {
  var db = null
  if (wx.cloud) db = wx.cloud.database()
  if (!db) {
    callback({ errMsg: 'cloud not available' })
    return
  }
  var openid = wx.getStorageSync('openid') || ''
  if (!openid) {
    wx.cloud.callFunction({
      name: 'login',
      timeout: 5000,
      success: function(loginRes) {
        if (loginRes.result && loginRes.result.openid) {
          openid = loginRes.result.openid
          wx.setStorageSync('openid', openid)
          doSave(db, type, openid, callback)
        } else {
          callback({ errMsg: 'get openid failed' })
        }
      },
      fail: function(err) {
        callback({ errMsg: 'login cloud function failed', detail: err })
      }
    })
  } else {
    doSave(db, type, openid, callback)
  }
}

function doSave(db, type, openid, callback) {
  db.collection('subscribers').where({ openid: openid, type: type }).get()
    .then(function(res) {
      if (res.data.length > 0) {
        var sub = res.data[0]
        var newCount = (sub.count || 0) + 1
        return db.collection('subscribers').doc(sub._id).update({
          data: { count: newCount, status: 'active', updateTime: db.serverDate() }
        })
      } else {
        return db.collection('subscribers').add({
          data: {
            openid: openid,
            type: type,
            count: 1,
            status: 'active',
            createTime: db.serverDate()
          }
        })
      }
    })
    .then(function() {
      callback(null)
    })
    .catch(function(err) {
      if (err.errCode === -502005 || (err.errMsg && err.errMsg.indexOf('collection not exists') >= 0)) {
        db.createCollection('subscribers').then(function() {
          return db.collection('subscribers').add({
            data: {
              openid: openid,
              type: type,
              count: 1,
              status: 'active',
              createTime: db.serverDate()
            }
          })
        }).then(function() {
          callback(null)
        }).catch(function(err2) {
          callback(err2)
        })
      } else {
        callback(err)
      }
    })
}

function getSubscriptionStatus(callback) {
  var db = null
  if (wx.cloud) db = wx.cloud.database()
  if (!db) {
    callback(null, {})
    return
  }
  wx.cloud.callFunction({ name: 'login' }).then(function(res) {
    var openid = res.result.openid
    if (!openid) {
      callback(null, {})
      return
    }
    wx.setStorageSync('openid', openid)
    db.collection('subscribers').where({ openid: openid, status: 'active' }).get()
      .then(function(res) {
        var status = {}
        for (var i = 0; i < res.data.length; i++) {
          var sub = res.data[i]
          status[sub.type] = true
          status[sub.type + 'Count'] = sub.count || 0
        }
        callback(null, status)
      })
      .catch(function(err) {
        callback(err, null)
      })
  }).catch(function() {
    callback(null, {})
  })
}

function requestAndSave(types, callback) {
  requestSubscribe(types, function(err, result) {
    if (err) {
      if (err.noConfig) {
        wx.showModal({
          title: '功能配置中',
          content: '该通知功能正在配置中，敬请期待',
          showCancel: false
        })
      }
      callback(err, null)
      return
    }
    var accepted = []
    for (var key in result) {
      if (result[key] === 'accept') {
        accepted.push(key)
      }
    }
    if (accepted.length === 0) {
      callback(null, result)
      return
    }
    var done = 0
    var hasError = false
    for (var j = 0; j < accepted.length; j++) {
      saveSubscription(accepted[j], function(saveErr) {
        done++
        if (saveErr && !hasError) {
          hasError = true
          callback(saveErr, null)
          return
        }
        if (done === accepted.length && !hasError) {
          callback(null, result)
        }
      })
    }
  })
}

function pushToSubscribers(type, title, content, page) {
  var db = null
  if (wx.cloud) db = wx.cloud.database()
  if (!db) return
  db.collection('subscribers').where({ type: type, status: 'active' }).get()
    .then(function(res) {
      var subs = (res.data || []).map(function(s) { return { openid: s.openid } })
      if (subs.length === 0) return
      wx.request({
        url: 'https://1442890784-28edxvn34i.ap-shanghai.tencentscf.com',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: { type: type, title: title, content: (content || '').substring(0, 20), subscribers: subs, page: page || '/pages/index/index' }
      }).catch(function() {})
    })
    .catch(function() {})
}

function sendInteractionNotify(targetOpenid, type, data) {
  if (!targetOpenid) return
  var templateId = TEMPLATES.interaction
  if (!isValidTemplateId(templateId)) return
  var thing1 = ''
  if (type === 'like') {
    thing1 = data.userName + ' 赞了你的帖子'
  } else if (type === 'reply') {
    thing1 = data.userName + ' 回复了你'
  }
  wx.request({
    url: 'https://1442890784-28edxvn34i.ap-shanghai.tencentscf.com',
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    data: {
      touser: targetOpenid,
      templateId: templateId,
      data: {
        thing1: { value: thing1.substring(0, 20) },
        thing2: { value: (data.postContent || data.content || '查看帖子').substring(0, 20) },
        thing3: { value: '点击查看' },
        time4: { value: formatNotifyTime(new Date()) }
      },
      page: '/pages/community/community'
    }
  }).catch(function() {})
}

function formatNotifyTime(date) {
  var y = date.getFullYear()
  var m = String(date.getMonth() + 1).padStart(2, '0')
  var d = String(date.getDate()).padStart(2, '0')
  var h = String(date.getHours()).padStart(2, '0')
  var min = String(date.getMinutes()).padStart(2, '0')
  return y + '-' + m + '-' + d + ' ' + h + ':' + min
}

function getOpenidByNickname(nickname, callback) {
  var db = null
  if (wx.cloud) db = wx.cloud.database()
  if (!db) {
    callback(null)
    return
  }
  db.collection('users').where({ nickName: nickname }).get()
    .then(function(userRes) {
      if (userRes.data.length > 0 && userRes.data[0]._openid) {
        var openid = userRes.data[0]._openid
        db.collection('subscribers').where({ openid: openid, status: 'active', type: 'interaction' }).get()
          .then(function(subRes) {
            if (subRes.data.length > 0) {
              callback(openid)
            } else {
              callback(null)
            }
          })
          .catch(function() { callback(null) })
      } else {
        callback(null)
      }
    })
    .catch(function() {
      callback(null)
    })
}

module.exports = {
  TEMPLATES: TEMPLATES,
  getAllTemplateIds: getAllTemplateIds,
  checkSetting: checkSetting,
  requestSubscribe: requestSubscribe,
  saveSubscription: saveSubscription,
  getSubscriptionStatus: getSubscriptionStatus,
  requestAndSave: requestAndSave,
  sendInteractionNotify: sendInteractionNotify,
  getOpenidByNickname: getOpenidByNickname,
  pushToSubscribers: pushToSubscribers
}
