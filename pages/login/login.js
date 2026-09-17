var app = getApp()
var notify = require('../../utils/notify')
var templateConfig = require('../../config/notifyTemplates')
var levelUtil = require('../../utils/level')
var i18n = require('../../utils/i18n')
var adminUtil = require('../../utils/admin')
var db = null
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

var i18n = require('../../utils/i18n')

function getLoginLabels(lang) {
  var dict = i18n.i18n[lang] || i18n.i18n.zh
  return {
    appName: dict.appName || '洛手助手',
    appDesc: dict.appDesc || '综合攻略 · 精灵图鉴 · 道具图鉴',
    tapChangeAvatar: dict.tapChangeAvatar || '点击更换头像',
    tapSelectAvatar: dict.tapSelectAvatar || '点击选择头像',
    nickname: dict.nickname || '昵称',
    nicknamePlaceholder: dict.nicknamePlaceholder || '输入昵称或使用微信快捷填写',
    nicknameHint: dict.nicknameHint || '💡 使用键盘栏微信昵称',
    loginBtn: dict.loginBtn || '登 录',
    agreeText: dict.agreeText || '我已阅读并同意',
    agreeAnd: dict.agreeAnd || '和',
    agreement: dict.agreement || '用户协议',
    privacy: dict.privacy || '隐私政策',
    rocoUID: dict.rocoUID || '洛克王国UID',
    tapSetUID: dict.tapSetUID || '点击设置UID',
    level: dict.level || '等级',
    loginDays: dict.loginDays || '登录天数',
    checkIn: dict.checkIn || '打卡',
    loginExpire: dict.loginExpire || '登录有效期剩余：',
    daysUnit: dict.daysUnit || '天',
    expireHoursUnit: dict.expireHoursUnit || '小时',
    needMoreDays: dict.needMoreDays || '，还需 {n} 天升级',
    needMoreCatches: dict.needMoreCatches || '距下一级还差 {n} 次捕捉',
    editor: dict.editor || '小编',
    developer: dict.developer || '开发者',
    notifyTitle: dict.notifyTitle || '通知设置',
    notifyTapHint: dict.notifyTapHint || '点击+号增加推送次数，最多99次',
    notifyAnnounce: dict.notifyAnnounce || '公告通知',
    notifyAnnounceDesc: dict.notifyAnnounceDesc || '接收最新公告和更新',
    notifyActivity: dict.notifyActivity || '活动提醒',
    notifyActivityDesc: dict.notifyActivityDesc || '活动开始前的提醒',
    notifyMerchant: dict.notifyMerchant || '商人提醒',
    notifyMerchantDesc: dict.notifyMerchantDesc || '远行商人新商品上架推送',
    reset: dict.reset || '重置',
    notifyNa: dict.notifyNa || '暂不可用',
    notifySettingTip: dict.notifySettingTip || '点击前往系统通知设置',
    adminPanel: dict.adminPanel || '管理后台',
    deleteAccount: dict.deleteAccount || '注销账户',
    logout: dict.logout || '退出登录',
    feat1Title: dict.feat1Title || '精灵图鉴',
    feat1Desc: dict.feat1Desc || '完整精灵数据库',
    feat2Title: dict.feat2Title || '捕捉统计',
    feat2Desc: dict.feat2Desc || '追踪你的捕捉记录',
    feat3Title: dict.feat3Title || '活动日历',
    feat3Desc: dict.feat3Desc || '不错过每个活动',
    noticeTitle: dict.noticeTitle || '📋 用户须知',
    notice1: dict.notice1 || '• 核心免费：攻略与查询功能免费使用，无需登录。',
    notice2: dict.notice2 || '• 会员特权：登录后解锁欧气评级、成就同步、专属水印。',
    notice3: dict.notice3 || '• 隐私优先：核心数据本地存储，云端双重加密，绝不泄露。',
    notice4: dict.notice4 || '• 授权周期：登录有效期最长为365天，您也可以随时手动注销。',
    notice5: dict.notice5 || '• 自主控制：您可随时注销账户并清除云端全部备份数据。',
    setUIDTitle: dict.setUIDTitle || '设置洛克王国UID',
    uidPlaceholder: dict.uidPlaceholder || '请输入UID（仅限数字）',
    uidHint: dict.uidHint || 'UID将作为水印显示在分享图片中',
    cancel: dict.cancel || '取消',
    save: dict.save || '保存',
    privacyModalTitle: dict.privacyModalTitle || '隐私保护提示',
    privacyModalDesc1: dict.privacyModalDesc1 || '在使用登录和云端同步功能前，请阅读并同意',
    privacyModalDesc2: dict.privacyModalDesc2 || '。我们重视您的隐私和数据安全。',
    reject: dict.reject || '拒绝',
    agreeContinue: dict.agreeContinue || '同意并继续',
    langLabel: dict.langLabel || '语言',
    dlgSyncTitle: dict.dlgSyncTitle || '数据同步',
    dlgSyncBody: dict.dlgSyncBody || '为提供更好体验，登录后将同步以下数据到云端…',
    dlgSyncOk: dict.dlgSyncOk || '我知道了',
    dlgLogoutTitle: dict.dlgLogoutTitle || '退出登录',
    dlgLogoutBody: dict.dlgLogoutBody || '确定要退出登录吗？',
    dlgDeleteTitle: dict.dlgDeleteTitle || '注销账户',
    dlgDeleteBody: dict.dlgDeleteBody || '注销后将永久删除云端数据，确定注销吗？',
    dlgNotifyOffTitle: dict.dlgNotifyOffTitle || '通知已关闭',
    dlgNotifyOffBody: dict.dlgNotifyOffBody || '您已关闭该类通知，请手动开启。',
    dlgNotifyOffBtn: dict.dlgNotifyOffBtn || '去设置',
    dlgResetTitle: dict.dlgResetTitle || '重置订阅',
    dlgResetBodyPre: dict.dlgResetBodyPre || '确定要重置"',
    dlgResetBodyPost: dict.dlgResetBodyPost || '"的订阅吗？',
    toastLoginExpired: dict.toastLoginExpired || '登录已过期，请重新登录',
    toastUidWrong: dict.toastUidWrong || 'UID必须为数字',
    toastUidSaved: dict.toastUidSaved || 'UID已保存',
    toastUidCleared: dict.toastUidCleared || 'UID已清除',
    toastPrivacyReject: dict.toastPrivacyReject || '拒绝隐私政策将无法登录授权',
    toastAgreeFirst: dict.toastAgreeFirst || '请先同意用户协议和隐私政策',
    toastAvatarFirst: dict.toastAvatarFirst || '请先点击选择微信头像',
    toastNicknameFirst: dict.toastNicknameFirst || '请输入昵称',
    toastLoggedOut: dict.toastLoggedOut || '已退出登录',
    toastDeleting: dict.toastDeleting || '注销中...',
    toastLocalDeleted: dict.toastLocalDeleted || '本地数据已删除',
    toastAccountDeleted: dict.toastAccountDeleted || '账户已注销',
    toastDeleteFailed: dict.toastDeleteFailed || '注销失败，请重试',
    toastNetworkError: dict.toastNetworkError || '网络错误，请重试',
    toastLoginFirst: dict.toastLoginFirst || '请先登录',
    toastLoginFirstSetup: dict.toastLoginFirstSetup || '请先登录后再设置',
    toastSetupFailed: dict.toastSetupFailed || '设置失败，请重试',
    toastEnabled: dict.toastEnabled || '已开启',
    toastRejected: dict.toastRejected || '已拒绝',
    toastResetDone: dict.toastResetDone || '已重置',
    toastReauthorized: dict.toastReauthorized || '已重新授权',
    toastResetFailed: dict.toastResetFailed || '重置失败',
    toastLimit99: dict.toastLimit99 || '已达上限99条',
    toastSubscribeSent: dict.toastSubscribeSent || '订阅请求已发送',
    toastAdded: dict.toastAdded || '已添加',
    toastError: dict.toastError || '异常',
    notifyNameAnnounce: dict.notifyNameAnnounce || '公告',
    notifyNameActivity: dict.notifyNameActivity || '活动',
    notifyNameMerchant: dict.notifyNameMerchant || '商人'
  }
}

function formatStr(template, obj) {
  return template.replace(/\{(\w+)\}/g, function(_, key) { return obj[key] != null ? obj[key] : '' })
}

Page({
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
    if (saved) self.loadNotifyStatus()
    self.checkNotifyConfig()
    self.loadUserRole()

    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization(function(resolve) {
        self.resolvePrivacyAuthorization = resolve
        self.setData({ showWechatPrivacyModal: true })
      })
    }
  },
  onShow: function() {
    var lang = i18n.getLanguage()
    if (lang !== this.data.currentLang) {
      this.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
      this.updateLoginDayText()
    }
    this.loadUserRole()
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
    var next = self.data.nextLevelDays
    var nextXP = self.data.nextXP
    var L = self.data.loginLabels
    var daysRemain = next - days > 0 ? formatStr(L.needMoreDays, { n: next - days }) : ''
    self.setData({
      loginDaysText: L.daysUnit ? days + L.daysUnit : days,
      nextLevelText: daysRemain,
      nextXPText: formatStr(L.needMoreCatches, { n: nextXP })
    })
  },

  loadUserRole: function() {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var userInfo = getApp().globalData.userInfo
    if (!userInfo) return
    getOpenId(function(openid) {
      if (!openid) return
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
    var todayLogin = false
    if (loginDays.length > 0 && loginDays[loginDays.length - 1] === todayStr) {
      todayLogin = true
    } else {
      loginDays.push(todayStr)
      wx.setStorageSync('login_days', loginDays)
      todayLogin = true
      self.syncLoginDays(loginDays)
    }
    var totalDays = loginDays.length
    var gameUid = wx.getStorageSync('game_uid') || ''
    var captureCount = wx.getStorageSync('total_catches') || 0
    var hasUid = !!gameUid
    var level = levelUtil.calcLevel(totalDays, hasUid, captureCount)
    var levelInfo = levelUtil.getLevelColor(level)
    var levelName = levelUtil.getLevelName(level)
    var levelIcon = levelUtil.getLevelIcon(level)
    var nextDays = levelUtil.calcNextLevelDays(level)
    var nextXP = levelUtil.getNextXP(captureCount)
    self.setData({
      loginDays: totalDays,
      level: level,
      levelName: levelName,
      levelColor: levelInfo,
      levelIcon: levelIcon,
      todayLogin: todayLogin,
      nextLevelDays: nextDays,
      nextXP: nextXP,
      hasUid: hasUid,
      gameUid: gameUid
    })
    var app = getApp()
    app.globalData.loginDays = totalDays
    app.globalData.level = level
    self.syncLevel(level)
    self.updateLoginDayText()
  },
  syncLoginDays: function(loginDays) {
    if (!wx.cloud) return
    var db = wx.cloud.database()
    getOpenId(function(openid) {
      if (!openid) return
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { loginDays: loginDays, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function() {})
    })
  },
  syncLevel: function(level) {
    if (!wx.cloud) return
    var db = wx.cloud.database()
    getOpenId(function(openid) {
      if (!openid) return
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { level: level, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function() {})
    })
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
        wx.showToast({ title: self.data.loginLabels.toastLoginExpired, icon: 'none' })
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
  onNickNameBlur: function(e) {
    var val = (e.detail.value || '').trim()
    if (val && val !== this.data.tempNickName) {
      this.setData({ tempNickName: val })
    }
  },
  onNickFormSubmit: function(e) {
    var val = (e.detail.value.nickname || '').trim()
    if (val) {
      this.setData({ tempNickName: val })
    }
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
      wx.showToast({ title: self.data.loginLabels.toastUidWrong, icon: 'none' })
      return
    }
    wx.setStorageSync('game_uid', uid)
    self.setData({ gameUid: uid, showUidModal: false })
    wx.showToast({ title: uid ? self.data.loginLabels.toastUidSaved : self.data.loginLabels.toastUidCleared, icon: 'success' })
    if (uid && wx.cloud) {
      var db = wx.cloud.database()
      if (db) {
        wx.cloud.callFunction({ name: 'login' }).then(function(res) {
          var openid = res.result.openid
          db.collection('users').where({ _openid: openid }).get()
            .then(function(r) {
              if (r.data.length > 0) {
                db.collection('users').doc(r.data[0]._id).update({ data: { gameUid: uid } })
              }
            })
            .catch(function() {})
        }).catch(function() {})
      }
    }
  },
  preventClose: function() {},
  onAgreeChange: function(e) {
    this.setData({ isAgreed: e.detail.value.indexOf('agree') >= 0 })
  },
  handleAgreePrivacy: function(e) {
    this.setData({ showWechatPrivacyModal: false })
    if (this.resolvePrivacyAuthorization) {
      this.resolvePrivacyAuthorization({ event: 'agree', buttonId: 'agree-btn' })
      this.resolvePrivacyAuthorization = null
    }
  },
  handleDisagreePrivacy: function() {
    this.setData({ showWechatPrivacyModal: false })
    if (this.resolvePrivacyAuthorization) {
      this.resolvePrivacyAuthorization({ event: 'disagree' })
      this.resolvePrivacyAuthorization = null
    }
    wx.showToast({ title: this.data.loginLabels.toastPrivacyReject, icon: 'none' })
  },
  onLogin: function() {
    var self = this
    if (self.data.isLogging) return
    if (!self.data.isAgreed) {
      wx.showToast({ title: self.data.loginLabels.toastAgreeFirst, icon: 'none' })
      return
    }
    var avatar = self.data.tempAvatar
    var nickName = self.data.tempNickName.trim()
    if (!avatar) {
      wx.showToast({ title: self.data.loginLabels.toastAvatarFirst, icon: 'none' })
      return
    }
    if (!nickName) {
      wx.showToast({ title: self.data.loginLabels.toastNicknameFirst, icon: 'none' })
      return
    }
    self.setData({ isLogging: true })
    var userInfo = { avatarUrl: avatar, nickName: nickName }
    var loginTime = Date.now()
    wx.setStorageSync('user_info', userInfo)
    wx.setStorageSync('login_time', loginTime)
    var app = getApp()
    app.globalData.userInfo = userInfo
    var expire = 365 * 24 * 60 * 60 * 1000
    var L = self.data.loginLabels
    self.setData({ userInfo: userInfo, hasUserInfo: true, isLogging: false, loginExpire: '365' + L.daysUnit + '0' + L.expireHoursUnit })
    self.syncToCloud(userInfo)
    wx.showModal({
      title: L.dlgSyncTitle,
      content: L.dlgSyncBody,
      showCancel: false,
      confirmText: L.dlgSyncOk
    })
  },
  syncToCloud: function(userInfo) {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var loginDays = wx.getStorageSync('login_days') || []
    if (userInfo.avatarUrl && userInfo.avatarUrl.indexOf('cloud://') === -1) {
      var avatarPath = userInfo.avatarUrl
      if (avatarPath.indexOf('http') === 0) {
        wx.downloadFile({
          url: avatarPath,
          success: function(downloadRes) {
            if (downloadRes.statusCode === 200) {
              var tempPath = downloadRes.tempFilePath
              wx.cloud.uploadFile({
                cloudPath: 'avatars/' + userInfo.nickName + '_' + Date.now() + '.jpg',
                filePath: tempPath
              }).then(function(uploadRes) {
                userInfo.avatarUrl = uploadRes.fileID
                userInfo._cloudAvatar = uploadRes.fileID
                wx.setStorageSync('user_info', userInfo)
                getApp().globalData.userInfo = userInfo
                self.setData({ userInfo: userInfo })
                self.saveToCloud(db, userInfo, loginDays)
              }).catch(function() {
                self.saveToCloud(db, userInfo, loginDays)
              })
            } else {
              self.saveToCloud(db, userInfo, loginDays)
            }
          },
          fail: function() { self.saveToCloud(db, userInfo, loginDays) }
        })
      } else {
        wx.cloud.uploadFile({
          cloudPath: 'avatars/' + userInfo.nickName + '_' + Date.now() + '.jpg',
          filePath: avatarPath
        }).then(function(res) {
          userInfo.avatarUrl = res.fileID
          userInfo._cloudAvatar = res.fileID
          wx.setStorageSync('user_info', userInfo)
          getApp().globalData.userInfo = userInfo
          self.setData({ userInfo: userInfo })
          self.saveToCloud(db, userInfo, loginDays)
        }).catch(function() {
          self.saveToCloud(db, userInfo, loginDays)
        })
      }
    } else {
      if (userInfo.avatarUrl && userInfo.avatarUrl.indexOf('cloud://') === 0) {
        userInfo._cloudAvatar = userInfo.avatarUrl
      }
      self.saveToCloud(db, userInfo, loginDays)
    }
  },
  saveToCloud: function(db, userInfo, loginDays) {
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      var cloudData = {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        loginDays: loginDays,
        lastLogin: db.serverDate(),
        updateTime: db.serverDate()
      }
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({ data: cloudData })
          } else {
            db.collection('users').add({ data: cloudData })
          }
        })
        .catch(function() {})
    }).catch(function() {})
  },
  onLogout: function() {
    var self = this
    var L = self.data.loginLabels
    wx.showModal({
      title: L.dlgLogoutTitle,
      content: L.dlgLogoutBody,
      success: function(res) {
        if (res.confirm) {
          self.clearLocalUserData()
          wx.showToast({ title: L.toastLoggedOut, icon: 'success' })
        }
      }
    })
  },
  onDeleteAccount: function() {
    var self = this
    var L = self.data.loginLabels
    wx.showModal({
      title: L.dlgDeleteTitle,
      content: L.dlgDeleteBody,
      confirmColor: '#ff4757',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: L.toastDeleting })
          if (!wx.cloud) {
            wx.hideLoading()
            self.clearLocalUserData()
            wx.showToast({ title: L.toastLocalDeleted, icon: 'success' })
            return
          }
          var db = wx.cloud.database()
          wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
            var openid = loginRes.result.openid
            db.collection('users').where({ _openid: openid }).remove()
              .then(function() {
                wx.hideLoading()
                self.clearLocalUserData()
                wx.showToast({ title: L.toastAccountDeleted, icon: 'success' })
              })
              .catch(function(e) {
                console.error('云端数据注销失败:', e)
                wx.hideLoading()
                wx.showToast({ title: L.toastDeleteFailed, icon: 'none' })
              })
          }).catch(function(e) {
            console.error('获取 openid 失败:', e)
            wx.hideLoading()
            wx.showToast({ title: L.toastNetworkError, icon: 'none' })
          })
        }
      }
    })
  },
  clearLocalUserData: function() {
    wx.removeStorageSync('user_info')
    wx.removeStorageSync('login_time')
    wx.removeStorageSync('is_admin_user')
    wx.removeStorageSync('admin_logged_in')
    getApp().globalData.userInfo = null
    this.setData({ userInfo: null, hasUserInfo: false, loginExpire: '' })
  },
  loadNotifyStatus: function() {
    var self = this
    notify.getSubscriptionStatus(function(err, status) {
      if (!err && status) {
        self.setData({
          'notifyStatus.announcement': !!status.announcement,
          'notifyStatus.activity': !!status.activity,
          'notifyStatus.system': !!status.system,
          'notifyStatus.merchant': !!status.merchant,
          'notifyStatus.interaction': !!status.interaction,
          'notifyCount.announcement': status.announcementCount || 0,
          'notifyCount.activity': status.activityCount || 0,
          'notifyCount.system': status.systemCount || 0,
          'notifyCount.merchant': status.merchantCount || 0,
          'notifyCount.interaction': status.interactionCount || 0
        })
      }
    })
  },
  checkNotifyConfig: function() {
    var self = this
    var configured = {}
    for (var key in templateConfig) {
      if (templateConfig.hasOwnProperty(key)) {
        configured[key] = templateConfig[key] && templateConfig[key].indexOf('TEMPLATE_ID') === -1 && templateConfig[key].length > 10
      }
    }
    self.setData({ notifyConfigured: configured })
  },
  onNotifyToggle: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var L = self.data.loginLabels
    if (self.data.notifyLoading) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: L.toastLoginFirst, icon: 'none' })
      return
    }
    self.setData({ notifyLoading: true })
    notify.requestAndSave([type], function(err, result) {
      self.setData({ notifyLoading: false })
      if (err) {
        if (!err.noConfig) {
          console.error('订阅失败详情:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: L.toastLoginFirstSetup, icon: 'none' })
          } else {
            wx.showToast({ title: L.toastSetupFailed, icon: 'none' })
          }
        }
        return
      }
      if (result[type] === 'accept') {
        self.setData({ ['notifyStatus.' + type]: true })
        wx.showToast({ title: L.toastEnabled, icon: 'success' })
      } else if (result[type] === 'reject') {
        self.setData({ ['notifyStatus.' + type]: false })
        wx.showToast({ title: L.toastRejected, icon: 'none' })
      } else if (result[type] === 'ban') {
        self.setData({ ['notifyStatus.' + type]: false })
        wx.showModal({
          title: L.dlgNotifyOffTitle,
          content: L.dlgNotifyOffBody,
          confirmText: L.dlgNotifyOffBtn,
          success: function(modalRes) {
            if (modalRes.confirm) wx.openSetting({})
          }
        })
      }
    })
  },
  onNotifySetting: function() { wx.openSetting({}) },
  onResetSubscribe: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var L = self.data.loginLabels
    var names = { announcement: L.notifyNameAnnounce, activity: L.notifyNameActivity, merchant: L.notifyNameMerchant }
    wx.showModal({
      title: L.dlgResetTitle,
      content: L.dlgResetBodyPre + names[type] + L.dlgResetBodyPost,
      success: function(res) {
        if (res.confirm) {
          if (!db) return
          wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
            var openid = loginRes.result.openid
            db.collection('subscribers').where({ openid: openid, type: type }).get()
              .then(function(subRes) {
                if (subRes.data.length > 0) {
                  return db.collection('subscribers').doc(subRes.data[0]._id).update({
                    data: { status: 'expired', count: 0, updateTime: db.serverDate() }
                  })
                }
              })
              .then(function() {
                self.setData({ ['notifyCount.' + type]: 0 })
                self.loadNotifyStatus()
                wx.showToast({ title: L.toastResetDone, icon: 'success' })
                notify.requestAndSave([type], function(err, result) {
                  if (!err && result && result[type] === 'accept') {
                    self.setData({ ['notifyCount.' + type]: 1 })
                    self.loadNotifyStatus()
                    wx.showToast({ title: L.toastReauthorized, icon: 'success' })
                  }
                })
              })
              .catch(function() { wx.showToast({ title: L.toastResetFailed, icon: 'none' }) })
          }).catch(function() {})
        }
      }
    })
  },
  _notifyAddingLock: false,
  onNotifyAdd: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var L = self.data.loginLabels
    if (self.data.notifyAdding || self._notifyAddingLock) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: L.toastLoginFirst, icon: 'none' })
      return
    }
    var currentCount = self.data.notifyCount[type] || 0
    if (currentCount >= 99) {
      wx.showToast({ title: L.toastLimit99, icon: 'none' })
      return
    }
    self._notifyAddingLock = true
    self.setData({ notifyAdding: true })
    var unlockTimer = setTimeout(function() {
      if (self.data.notifyAdding) {
        console.warn('[onNotifyAdd] Force unlock notifyAdding due to timeout')
        self._notifyAddingLock = false
        self.setData({ notifyAdding: false })
      }
    }, 4000)
    try {
      notify.requestAndSave([type], function(err, result) {
        clearTimeout(unlockTimer)
        self._notifyAddingLock = false
        self.setData({ notifyAdding: false })
        if (err) {
          if (!err.noConfig) {
            console.error('订阅失败详情:', err)
            if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
              wx.showToast({ title: L.toastLoginFirstSetup, icon: 'none' })
            } else {
              wx.showToast({ title: L.toastSetupFailed + (err.errMsg || ''), icon: 'none' })
            }
          }
          return
        }
        if (!result) { wx.showToast({ title: L.toastSubscribeSent, icon: 'none' }); return }
        if (result[type] === 'accept') {
          var newCount = currentCount + 1
          var notifyCount = self.data.notifyCount || {}
          notifyCount[type] = newCount
          var notifyStatus = self.data.notifyStatus || {}
          notifyStatus[type] = true
          self.setData({ notifyCount: notifyCount, notifyStatus: notifyStatus })
          wx.showToast({ title: L.toastAdded + '(' + newCount + '/99)', icon: 'success' })
          self.loadNotifyStatus()
        } else if (result[type] === 'reject') {
          wx.showToast({ title: L.toastRejected, icon: 'none' })
        } else if (result[type] === 'ban') {
          wx.showModal({
            title: L.dlgNotifyOffTitle,
            content: L.dlgNotifyOffBody,
            confirmText: L.dlgNotifyOffBtn,
            success: function(modalRes) { if (modalRes.confirm) wx.openSetting({}) }
          })
        }
      })
    } catch (ex) {
      clearTimeout(unlockTimer)
      self._notifyAddingLock = false
      self.setData({ notifyAdding: false })
      console.error('[onNotifyAdd] Exception caught:', ex)
      wx.showToast({ title: L.toastError + (ex.message || ''), icon: 'none' })
    }
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  showAgreement: function() {
    wx.navigateTo({ url: '/pages/privacy/privacy?type=agreement' })
  },
  showPrivacy: function() {
    wx.navigateTo({ url: '/pages/privacy/privacy?type=privacy' })
  },
  checkAdmin: function() {
    var self = this
    if (wx.getStorageSync('is_admin_user')) {
      self.setData({ isAdmin: true })
    }
    adminUtil.checkAdmin(self, function(isAdmin) {
      self.setData({ isAdmin: !!isAdmin })
    })
  },
  goAdmin: function() { wx.navigateTo({ url: '/pages/admin/admin' }) },
  onShareAppMessage: function() {
    return { title: '洛手助手BENJAMIN - 个人中心', path: '/pages/index/index', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手BENJAMIN - 精灵图鉴·捕捉统计·活动日历', imageUrl: '/images/banner.webp' }
  }
})
