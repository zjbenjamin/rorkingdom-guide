function checkAdmin(page, callback) {
  if (!wx.cloud) {
    if (callback) callback(false)
    return
  }
  var db = wx.cloud.database()

  db.collection('admin_config').doc('admin').get()
    .then(function(res) {
      var adminOpenid = res.data.openid
      var adminOpenids = res.data.openids || []

      wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
        var openid = loginRes.result ? loginRes.result.openid : null
        var isAdmin = openid && (openid === adminOpenid || adminOpenids.indexOf(openid) !== -1)
        if (isAdmin) {
          wx.setStorageSync('is_admin_user', true)
        } else {
          wx.removeStorageSync('is_admin_user')
        }
        if (callback) callback(isAdmin)
      }).catch(function() {
        wx.removeStorageSync('is_admin_user')
        if (callback) callback(false)
      })
    })
    .catch(function() {
      wx.removeStorageSync('is_admin_user')
      if (callback) callback(false)
    })
}

module.exports = {
  checkAdmin: checkAdmin
}
