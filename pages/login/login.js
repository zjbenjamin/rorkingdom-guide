const app = getApp()
var db = null
var i18n = require('../../utils/i18n')

var _cachedOpenId = wx.getStorageSync('openid') || null
var _openIdCallbacks = []

function getOpenId(cb) {
  if (_cachedOpenId) { cb(_cachedOpenId); return }
  _openIdCallbacks.push(cb)
  if (_openIdCallbacks.length > 1) return
  wx.cloud.callFunction({ name: 'login' }).then(function(res) {
    var id = res.result.openid
    _cachedOpenId = id
    wx.setStorageSync('openid', id)
    var cbs = _openIdCallbacks
    _openIdCallbacks = []
    for (var i = 0; i < cbs.length; i++) cbs[i](id)
  }).catch(function() {
    var cbs = _openIdCallbacks
    _openIdCallbacks = []
    for (var i = 0; i < cbs.length; i++) cbs[i](null)
  })
}

function getLoginLabels(lang) {
  var dict = i18n.i18n[lang] || i18n.i18n.zh
  return {
    appName: dict.appName || '洛手助手',
    appDesc: dict.appDesc || '综合攻略 · 精灵图鉴 · 道具图鉴',
    loginBtn: dict.loginBtn || '登 录',
    agreeText: dict.agreeText || '我已阅读并同意',
    agreement: dict.agreement || '用户协议',
    privacy: dict.privacy || '隐私政策',
    cancel: dict.cancel || '取消',
    save: dict.save || '保存',
    logout: dict.logout || '退出登录',
    loginExpire: dict.loginExpire || '登录有效期剩余：',
    daysUnit: dict.daysUnit || '天',
    expireHoursUnit: dict.expireHoursUnit || '小时',
    toastLoginExpired: dict.toastLoginExpired || '登录已过期，请重新登录',
    toastLoggedOut: dict.toastLoggedOut || '已退出登录',
    toastNetworkError: dict.toastNetworkError || '网络错误，请重试',
    toastLoginFirst: dict.toastLoginFirst || '请先登录',
    notifyTitle: dict.notifyTitle || '通知设置',
    adminPanel: dict.adminPanel || '管理后台',
    deleteAccount: dict.deleteAccount || '注销账户',
    langLabel: dict.langLabel || '语言',
    notifyNameAnnounce: dict.notifyNameAnnounce || '公告',
    notifyNameActivity: dict.notifyNameActivity || '活动',
    notifyNameMerchant: dict.notifyNameMerchant || '商人'
  }
}

function formatStr(template, obj) {
  return template.replace(/\{(\w+)\}/g, function(_, key) { return obj[key] != null ? obj[key] : '' })
}

Page({
  behaviors: [require('../../utils/i18nBehavior')],
  data: {
    userInfo: null,
    hasUserInfo: false,
    isLogging: false,
    isAgreed: false,
    showWechatPrivacyModal: false,
    loginExpire: '',
    tempAvatar: '',
    tempNickName: '',
    loginDays: 0,
    level: 1,
    levelName: '小洛克',
    levelColor: { bg: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.2)' },
    levelIcon: '🐣',
    nextLevelDays: 3,
    nextXP: 50,
    hasUid: false,
    isAdmin: false,
    gameUid: '',
    showUidModal: false,
    uidInput: '',
    userRole: '',
    notifyStatus: {
      announcement: false,
      activity: false,
      system: false,
      merchant: false,
      interaction: false
    },
    notifyCount: {
      announcement: 0,
      activity: 0,
      system: 0,
      merchant: 0,
      interaction: 0
    },
    notifyConfigured: {
      announcement: false,
      activity: false,
      system: false,
      merchant: false,
      interaction: false
    },
    notifyLoading: false,
    notifyAdding: false,
    currentLang: 'zh',
    loginLabels: getLoginLabels('zh')
  },
  onLoad: function() {
    var self = this
    var app = getApp()
    if (wx.cloud) db = wx.cloud.database()
    var lang = i18n.getLanguage()
    self.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
    var saved = wx.getStorageSync('user_info')
    if (saved) app.globalData.userInfo = saved
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    self.setData({ subscribeConfig: subscribeConfig })
    self.checkLoginStatus()
    self.recordLoginDay()
    self.checkAdmin()
    // 延迟加载通知状态和角色，避免阻塞首屏
    setTimeout(function() {
      self.loadNotifyStatus()
      self.checkNotifyConfig()
      self.loadUserRole()
    }, 300)
  },
  onShow: function() {
    var lang = i18n.getLanguage()
    if (lang !== this.data.currentLang) {
      this.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
      this.updateLoginDayText()
    }
  },
  switchLang: function(e) {
    var lang = e.currentTarget.dataset.lang
    var app = getApp()
    app.setLang(lang)
    this.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
    this.updateLoginDayText()
  },
  updateLoginDayText: function() {
    var self = this
    var days = self.data.loginDays
    var L = self.data.loginLabels
    var daysText = days + (L.daysUnit || '天')
    self.setData({ loginDaysText: daysText })
  },
  loadUserRole: function() {
    var self = this
    if (!wx.cloud) return
    var userInfo = getApp().globalData.userInfo
    if (!userInfo) return
    getOpenId(function(openid) {
      if (!openid) return
      var db = wx.cloud.database()
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0 && r.data[0].role) {
            self.setData({ userRole: r.data[0].role })
          }
        })
        .catch(function() {})
    })
  },
  recordLoginDay: function() {
    var self = this
    var today = new Date()
    var todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var loginDays = wx.getStorageSync('login_days') || []
    if (loginDays.length === 0 || loginDays[loginDays.length - 1] !== todayStr) {
      loginDays.push(todayStr)
      wx.setStorageSync('login_days', loginDays)
    }
    var totalDays = loginDays.length
    var gameUid = wx.getStorageSync('game_uid') || ''
    var captureCount = wx.getStorageSync('total_catches') || 0
    var levelUtil = require('../../utils/level')
    var level = levelUtil.calcLevel(totalDays, !!gameUid, captureCount)
    var levelInfo = levelUtil.getLevelColor(level)
    var levelName = levelUtil.getLevelName(level)
    var levelIcon = levelUtil.getLevelIcon(level)
    var nextDays = levelUtil.calcNextLevelDays(level)
    var nextXP = levelUtil.getNextXP(captureCount)
    self.setData({
      loginDays: totalDays,
      level: level,
      levelName: levelName,
      levelIcon: levelIcon,
      levelColor: levelInfo,
      nextLevelDays: nextDays,
      nextXP: nextXP,
      hasUid: !!gameUid,
      gameUid: gameUid
    })
    self.updateLoginDayText()
  },
  checkLoginStatus: function() {
    var self = this
    var saved = wx.getStorageSync('user_info')
    var loginTime = wx.getStorageSync('login_time')
    var gameUid = wx.getStorageSync('game_uid') || ''
    if (saved && loginTime) {
      var now = Date.now()
      var expire = 365 * 24 * 60 * 60 * 1000
      if (now - loginTime > expire) {
        wx.removeStorageSync('user_info')
        wx.removeStorageSync('login_time')
        wx.removeStorageSync('is_admin_user')
        wx.removeStorageSync('admin_logged_in')
        self.setData({ userInfo: null, hasUserInfo: false, gameUid: '' })
      } else {
        var remain = expire - (now - loginTime)
        var days = Math.floor(remain / (24 * 60 * 60 * 1000))
        var hours = Math.floor((remain % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        var L = self.data.loginLabels
        self.setData({ userInfo: saved, hasUserInfo: true, loginExpire: days + L.daysUnit + hours + L.expireHoursUnit, gameUid: gameUid })
      }
    }
  },
  onChooseAvatar: function(e) {
    this.setData({ tempAvatar: e.detail.avatarUrl })
  },
  onNickNameInput: function(e) {
    this.setData({ tempNickName: e.detail.value })
  },
  onLogin: function() {
    var self = this
    if (self.data.isLogging) return
    if (!self.data.isAgreed) {
      wx.showToast({ title: self.data.loginLabels.toastAgreeFirst || '请先同意用户协议和隐私政策', icon: 'none' })
      return
    }
    var avatar = self.data.tempAvatar
    var nickName = self.data.tempNickName.trim()
    if (!avatar) {
      wx.showToast({ title: self.data.loginLabels.toastAvatarFirst || '请先选择头像', icon: 'none' })
      return
    }
    if (!nickName) {
      wx.showToast({ title: self.data.loginLabels.toastNicknameFirst || '请输入昵称', icon: 'none' })
      return
    }
    var userInfo = { avatarUrl: avatar, nickName: nickName }
    var loginTime = Date.now()
    wx.setStorageSync('user_info', userInfo)
    wx.setStorageSync('login_time', loginTime)
    var app = getApp()
    app.globalData.userInfo = userInfo
    var L = self.data.loginLabels
    self.setData({ userInfo: userInfo, hasUserInfo: true, isLogging: false, loginExpire: '365' + L.daysUnit + '0' + L.expireHoursUnit })
  },
  onLogout: function() {
    var self = this
    var L = self.data.loginLabels
    wx.showModal({
      title: L.dlgLogoutTitle || '退出登录',
      content: L.dlgLogoutBody || '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('user_info')
          wx.removeStorageSync('login_time')
          wx.removeStorageSync('is_admin_user')
          wx.removeStorageSync('admin_logged_in')
          getApp().globalData.userInfo = null
          self.setData({ userInfo: null, hasUserInfo: false, loginExpire: '' })
          wx.showToast({ title: L.toastLoggedOut || '已退出登录', icon: 'success' })
        }
      }
    })
  },
  toggleUidModal: function() {
    this.setData({ showUidModal: !this.data.showUidModal, uidInput: this.data.gameUid })
  },
  onUidInput: function(e) {
    this.setData({ uidInput: e.detail.value })
  },
  saveUid: function() {
    var self = this
    var uid = self.data.uidInput.trim()
    if (uid && !/^\d+$/.test(uid)) {
      wx.showToast({ title: self.data.loginLabels.toastUidWrong || 'UID必须为数字', icon: 'none' })
      return
    }
    wx.setStorageSync('game_uid', uid)
    self.setData({ gameUid: uid, showUidModal: false })
    if (uid && wx.cloud) {
      var db = wx.cloud.database()
      getOpenId(function(openid) {
        if (!openid) return
        db.collection('users').where({ _openid: openid }).get()
          .then(function(r) {
            if (r.data.length > 0) {
              db.collection('users').doc(r.data[0]._id).update({ data: { gameUid: uid } })
            }
          })
          .catch(function() {})
      })
    }
  },
  checkAdmin: function() {
    var self = this
    if (!wx.cloud) return
    if (wx.getStorageSync('is_admin_user')) {
      self.setData({ isAdmin: true })
    }
    var adminUtil = require('../../utils/admin')
    adminUtil.checkAdmin(self, function(isAdmin) {
      self.setData({ isAdmin: !!isAdmin })
    })
  },
  loadNotifyStatus: function() {
    var self = this
    var notify = require('../../utils/notify')
    notify.getSubscriptionStatus(function(err, status) {
      if (!err && status) {
        self.setData({
          'notifyStatus.announcement': !!status.announcement,
          'notifyStatus.activity': !!status.activity,
          'notifyStatus.merchant': !!status.merchant,
          'notifyCount.announcement': status.announcementCount || 0,
          'notifyCount.activity': status.activityCount || 0,
          'notifyCount.merchant': status.merchantCount || 0
        })
      }
    })
  },
  checkNotifyConfig: function() {
    var self = this
    var templateConfig = require('../../config/notifyTemplates')
    var configured = {}
    for (var key in templateConfig) {
      if (templateConfig.hasOwnProperty(key) && key !== 'interaction') {
        configured[key] = templateConfig[key] && templateConfig[key].indexOf('TEMPLATE_ID') === -1 && templateConfig[key].length > 10
      }
    }
    self.setData({ notifyConfigured: configured })
  },
  goAdmin: function() { wx.navigateTo({ url: '/pages/admin/admin' }) },
  showPrivacy: function() { wx.navigateTo({ url: '/pages/privacy/privacy?type=privacy' }) },
  showAgreement: function() { wx.navigateTo({ url: '/pages/privacy/privacy?type=agreement' }) },
  preventClose: function() {},
  onAgreeChange: function(e) {
    this.setData({ isAgreed: e.detail.value.indexOf('agree') >= 0 })
  },
  onShareAppMessage: function () {
    return { title: '洛手助手 - 个人中心', path: '/pages/index/index', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function () {
    return { title: '洛手助手 - 精灵图鉴·捕捉统计·活动日历', imageUrl: '/images/banner.webp' }
  }
})
