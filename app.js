var i18n = require('./utils/i18n')
var notify = require('./utils/notify')

App({
  globalData: {
    theme: 'light',
    lang: 'zh',
    langVersion: 0,
    cloudReady: false,
    userInfo: null,
    loginDays: 0,
    level: 1,
    notifyEnabled: false,
    statusBarHeight: 0
  },
  onShow: function() {
    var lang = i18n.getLanguage()
    if (lang !== this.globalData.lang) {
      var titles = { zh: '洛手助手', en: 'Roco Helper', ja: 'ロコヘルパー', ko: '로코 도우미' }
      this.globalData.lang = lang
      this.globalData.langVersion++
      wx.setNavigationBarTitle({ title: titles[lang] || 'Roco Helper' })
    }
  },
  setLang: function(lang) {
    i18n.setLang(lang)
    this.globalData.lang = lang
    this.globalData.langVersion++
    var titles = { zh: '洛手助手', en: 'Roco Helper', ja: 'ロコヘルパー', ko: '로코 도우미' }
    wx.setNavigationBarTitle({ title: titles[lang] || 'Roco Helper' })
  },
  getLang: function() {
    return this.globalData.lang
  },
  onLaunch: function() {
    this.checkUpdate()
    var self = this
    try {
      var winInfo = wx.getWindowInfo()
      self.globalData.statusBarHeight = winInfo.statusBarHeight || 20
    } catch(e) {
      self.globalData.statusBarHeight = 20
    }
    try {
      var res = wx.getAppBaseInfo()
      self.globalData.theme = res.theme || 'light'
    } catch (e) {
      self.globalData.theme = 'light'
    }
    i18n.initLang()
    self.globalData.lang = i18n.getLanguage()
    if (wx.cloud) {
      self._initCloud(0)
    }
    var saved = wx.getStorageSync('user_info')
    if (saved) self.globalData.userInfo = saved
    var loginDays = wx.getStorageSync('login_days') || []
    self.globalData.loginDays = loginDays.length
    self.globalData.level = self.calcLevel(loginDays.length)
    self.checkNotifyPermission()
  },
  _initCloud: function(retryCount) {
    var self = this
    wx.cloud.init({ env: 'cloudbase-d2gu3iv2o6878a0f9', traceUser: true })
    var cachedReady = wx.getStorageSync('cloud_ready')
    if (cachedReady && Date.now() - cachedReady < 600000) {
      self.globalData.cloudReady = true
      return
    }
    var db = wx.cloud.database()
    db.collection('site_config').limit(1).get()
      .then(function() {
        self.globalData.cloudReady = true
        wx.setStorageSync('cloud_ready', Date.now())
      })
      .catch(function(err) {
        if (retryCount < 2) {
          setTimeout(function() {
            self._initCloud(retryCount + 1)
          }, 1500)
        } else {
          console.error('云环境初始化失败，请检查网络或云开发环境配置:', err)
          self.globalData.cloudReady = false
        }
      })
  },
  checkUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      var updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate(function (res) {
        // console.log("hasUpdate:", res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经上线，请您删除当前小程序，重新搜索打开体验最新版本。',
          showCancel: false
        })
      })
    }
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
