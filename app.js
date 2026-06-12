App({
  globalData: {
    theme: 'light'
  },
  onLaunch: function() {
    var self = this
    try {
      var res = wx.getSystemInfoSync()
      self.globalData.theme = res.theme || 'light'
    } catch (e) {
      self.globalData.theme = 'light'
    }
  }
})
