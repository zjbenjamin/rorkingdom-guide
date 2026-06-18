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
      if (cachedAdmin !== '') {
        self.setData({ isAdmin: !!cachedAdmin })
      }
      
      if (!wx.cloud) return
      var db = wx.cloud.database()
      var app = getApp()
      var userInfo = app.globalData.userInfo
      var saved = wx.getStorageSync('user_info')
      if (!userInfo && saved) userInfo = saved
      if (!userInfo) {
        self.setData({ isAdmin: false })
        wx.setStorageSync('is_admin_user', false)
        return
      }
      
      db.collection('admin_config').doc('admin').get()
        .then(function(res) {
          var adminOpenid = res.data.openid
          db.collection('users').where({ _openid: adminOpenid }).get()
            .then(function(userRes) {
              var isUserAdmin = userRes.data.length > 0
              self.setData({ isAdmin: isUserAdmin })
              wx.setStorageSync('is_admin_user', isUserAdmin)
              wx.setStorageSync('admin_logged_in', isUserAdmin)
            })
            .catch(function() {})
        })
        .catch(function() {})
    }
  }
})
