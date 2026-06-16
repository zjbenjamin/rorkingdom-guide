var i18n = require('./utils/i18n')
var notify = require('./utils/notify')

App({
  globalData: {
    theme: 'light',
    lang: 'zh',
    cloudReady: false,
    userInfo: null,
    loginDays: 0,
    level: 1,
    notifyEnabled: false,
    statusBarHeight: 0
  },
  onLaunch: function() {
    var self = this
    try {
      var sys = wx.getSystemInfoSync()
      self.globalData.statusBarHeight = sys.statusBarHeight || 20
    } catch(e) {}
    try {
      var res = wx.getAppBaseInfo()
      self.globalData.theme = res.theme || 'light'
    } catch (e) {
      self.globalData.theme = 'light'
    }
    i18n.initLang()
    self.globalData.lang = i18n.getLanguage()
    if (wx.cloud) {
      wx.cloud.init({ traceUser: true })
      self.globalData.cloudReady = true
    }
    var saved = wx.getStorageSync('user_info')
    if (saved) self.globalData.userInfo = saved
    var loginDays = wx.getStorageSync('login_days') || []
    self.globalData.loginDays = loginDays.length
    self.globalData.level = self.calcLevel(loginDays.length)
    self.checkNotifyPermission()
  },
  checkNotifyPermission: function() {
    var self = this
    notify.checkSetting(function(err, settings) {
      if (!err && settings) {
        var mainSwitch = settings.mainSwitch
        var itemSettings = settings.itemSettings || {}
        var hasAccept = false
        for (var key in itemSettings) {
          if (itemSettings[key] === 'accept') {
            hasAccept = true
            break
          }
        }
        self.globalData.notifyEnabled = mainSwitch !== false && hasAccept
      }
    })
  },
  calcLevel: function(days) {
    if (days >= 365) return 10
    if (days >= 180) return 9
    if (days >= 120) return 8
    if (days >= 90) return 7
    if (days >= 60) return 6
    if (days >= 30) return 5
    if (days >= 15) return 4
    if (days >= 7) return 3
    if (days >= 3) return 2
    return 1
  }
})
