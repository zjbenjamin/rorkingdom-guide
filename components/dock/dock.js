Component({
  properties: {
    current: { type: String, value: '' }
  },
  data: {
    isAdmin: false
  },
  lifetimes: {
    attached: function() {
      this.checkAdminStatus()
    }
  },
  methods: {
    checkAdminStatus: function() {
      var self = this
      var cachedAdmin = wx.getStorageSync('is_admin_user')
      if (cachedAdmin) {
        self.setData({ isAdmin: true })
      }

      if (!wx.cloud) return
      var db = wx.cloud.database()
      var app = getApp()
      var userInfo = app.globalData.userInfo
      var saved = wx.getStorageSync('user_info')
      if (!userInfo && saved) userInfo = saved
      if (!userInfo) {
        self.setData({ isAdmin: false })
        wx.removeStorageSync('is_admin_user')
        return
      }

      db.collection('admin_config').doc('admin').get()
        .then(function(res) {
          var adminOpenid = res.data && res.data.openid
          var adminOpenids = (res.data && res.data.openids) || []
          if (!adminOpenid) { self.setData({ isAdmin: false }); return }
          wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
              var openid = loginRes.result && loginRes.result.openid;
              var isUserAdmin = (openid === adminOpenid || adminOpenids.indexOf(openid) !== -1)
              self.setData({ isAdmin: isUserAdmin })
              if (isUserAdmin) {
                wx.setStorageSync('is_admin_user', true)
              } else {
                wx.removeStorageSync('is_admin_user')
              }
            })
            .catch(function() {
              self.setData({ isAdmin: false })
              wx.removeStorageSync('is_admin_user')
            })
        })
        .catch(function() {
          self.setData({ isAdmin: false })
          wx.removeStorageSync('is_admin_user')
        })
    }
  }
})
