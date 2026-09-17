function checkAdmin(page, callback) {
  if (!wx.cloud) {
    if (callback) callback(false)
    return
  }
  var db = wx.cloud.database()
  // 先用缓存立即返回
  var cached = wx.getStorageSync('is_admin_user')
  if (cached) {
    if (callback) callback(true)
  }
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
        if (callback && !cached) callback(false)
      })
    })
    .catch(function() {
      if (callback && !cached) callback(false)
    })
}

module.exports = {
  checkAdmin: checkAdmin
}
