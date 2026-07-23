function checkAdmin(page, callback) {
  if (!wx.cloud) {
    if (callback) callback(false)
    return
  }
  var db = wx.cloud.database()

  var cached = wx.getStorageSync('admin_logged_in')
  if (cached) {
    if (callback) callback(true)
    return
  }

  db.collection('admin_config').doc('admin').get()
    .then(function(res) {
      var adminOpenid = res.data.openid
      var adminOpenids = res.data.openids || []

      wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
        var openid = loginRes.result ? loginRes.result.openid : null
        var isAdmin = openid && (openid === adminOpenid || adminOpenids.indexOf(openid) !== -1)
        if (isAdmin) {
          wx.setStorageSync('admin_logged_in', true)
          wx.setStorageSync('is_admin_user', true)
        }
        if (callback) callback(isAdmin)
      }).catch(function() {
        if (callback) callback(false)
      })
    })
    .catch(function() {
      if (callback) callback(false)
    })
}

module.exports = {
  checkAdmin: checkAdmin
}
