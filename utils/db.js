function getOpenid(callback) {
  var openid = wx.getStorageSync('openid') || ''
  if (openid) {
    callback(null, openid)
    return
  }
  wx.cloud.callFunction({
    name: 'login',
    timeout: 5000,
    success: function(res) {
      if (res.result && res.result.openid) {
        openid = res.result.openid
        wx.setStorageSync('openid', openid)
        callback(null, openid)
      } else {
        callback({ errMsg: 'get openid failed' }, null)
      }
    },
    fail: function(err) {
      callback(err, null)
    }
  })
}

function getDatabase() {
  return wx.cloud ? wx.cloud.database() : null
}

function updateUserData(data, callback) {
  var db = getDatabase()
  if (!db) {
    callback({ errMsg: 'cloud not available' })
    return
  }
  getOpenid(function(err, openid) {
    if (err) {
      callback(err)
      return
    }
    db.collection('users').where({ _openid: openid }).get()
      .then(function(r) {
        if (r.data.length > 0) {
          return db.collection('users').doc(r.data[0]._id).update({ data: data })
        }
      })
      .then(function() {
        callback(null)
      })
      .catch(function(err) {
        callback(err)
      })
  })
}

module.exports = {
  getOpenid: getOpenid,
  getDatabase: getDatabase,
  updateUserData: updateUserData
}