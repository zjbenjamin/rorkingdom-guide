var app = getApp()
var notify = require('../../utils/notify')
var templateConfig = require('../../config/notifyTemplates')

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    isLogging: false,
    loginExpire: '',
    tempAvatar: '',
    tempNickName: '',
    loginDays: 0,
    level: 1,
    todayLogin: false,
    nextLevelDays: 3,
    isAdmin: false,
    gameUid: '',
    showUidModal: false,
    uidInput: '',
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
    notifyAdding: false
  },
  onLoad: function() {
    var app = getApp()
    var saved = wx.getStorageSync('user_info')
    if (saved) app.globalData.userInfo = saved
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    this.setData({ subscribeConfig: subscribeConfig })
    this.checkLoginStatus()
    this.recordLoginDay()
    this.checkAdmin()
    this.loadNotifyStatus()
    this.checkNotifyConfig()
  },
  recordLoginDay: function() {
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
      this.syncLoginDays(loginDays)
    }
    var totalDays = loginDays.length
    var level = this.calcLevel(totalDays)
    var nextDays = this.nextLevelDays(level)
    this.setData({
      loginDays: totalDays,
      level: level,
      todayLogin: todayLogin,
      nextLevelDays: nextDays
    })
    var app = getApp()
    app.globalData.loginDays = totalDays
    app.globalData.level = level
  },
  syncLoginDays: function(loginDays) {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { loginDays: loginDays, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function() {})
    }).catch(function() {})
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
  },
  nextLevelDays: function(level) {
    var thresholds = [3, 7, 15, 30, 60, 90, 120, 180, 365]
    if (level >= 10) return 0
    return thresholds[level - 1] || 3
  },
  checkLoginStatus: function() {
    var self = this
    var saved = wx.getStorageSync('user_info')
    var loginTime = wx.getStorageSync('login_time')
    var gameUid = wx.getStorageSync('game_uid') || ''
    if (saved && loginTime) {
      var now = Date.now()
      var expire = 3 * 24 * 60 * 60 * 1000
      if (now - loginTime > expire) {
        wx.removeStorageSync('user_info')
        wx.removeStorageSync('login_time')
        self.setData({ userInfo: null, hasUserInfo: false, gameUid: '' })
        wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
      } else {
        var remain = expire - (now - loginTime)
        var days = Math.floor(remain / (24 * 60 * 60 * 1000))
        var hours = Math.floor((remain % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        self.setData({ userInfo: saved, hasUserInfo: true, loginExpire: days + '天' + hours + '小时', gameUid: gameUid })
      }
    }
  },
  onChooseAvatar: function(e) {
    this.setData({ tempAvatar: e.detail.avatarUrl })
  },
  onNickNameInput: function(e) {
    this.setData({ tempNickName: e.detail.value })
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
      wx.showToast({ title: 'UID应为纯数字', icon: 'none' })
      return
    }
    wx.setStorageSync('game_uid', uid)
    self.setData({ gameUid: uid, showUidModal: false })
    wx.showToast({ title: uid ? 'UID已保存' : 'UID已清除', icon: 'success' })
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
  onLogin: function() {
    var self = this
    if (self.data.isLogging) return
    var avatar = self.data.tempAvatar
    var nickName = self.data.tempNickName.trim()
    if (!avatar) {
      wx.showToast({ title: '请点击头像获取微信头像', icon: 'none' })
      return
    }
    if (!nickName) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    self.setData({ isLogging: true })
    var userInfo = { avatarUrl: avatar, nickName: nickName }
    var loginTime = Date.now()
    wx.setStorageSync('user_info', userInfo)
    wx.setStorageSync('login_time', loginTime)
    var app = getApp()
    app.globalData.userInfo = userInfo
    var expire = 3 * 24 * 60 * 60 * 1000
    self.setData({ userInfo: userInfo, hasUserInfo: true, isLogging: false, loginExpire: '3天0小时' })
    self.syncToCloud(userInfo)
    wx.showModal({
      title: '数据同步说明',
      content: '为提供更好体验，登录后将同步以下数据到云端：\n\n• 头像和昵称 — 社区发帖/评论身份标识\n• 累计登录天数 — 等级系统计算\n• 用户偏好设置 — 多设备同步\n\n数据仅用于本应用功能，不会向第三方共享。',
      showCancel: false,
      confirmText: '我知道了'
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
                var app = getApp()
                app.globalData.userInfo = userInfo
                self.setData({ userInfo: userInfo })
                self.saveToCloud(db, userInfo, loginDays)
              }).catch(function() {
                self.saveToCloud(db, userInfo, loginDays)
              })
            } else {
              self.saveToCloud(db, userInfo, loginDays)
            }
          },
          fail: function() {
            self.saveToCloud(db, userInfo, loginDays)
          }
        })
      } else {
        wx.cloud.uploadFile({
          cloudPath: 'avatars/' + userInfo.nickName + '_' + Date.now() + '.jpg',
          filePath: avatarPath
        }).then(function(res) {
          userInfo.avatarUrl = res.fileID
          userInfo._cloudAvatar = res.fileID
          wx.setStorageSync('user_info', userInfo)
          var app = getApp()
          app.globalData.userInfo = userInfo
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
    var self = this
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
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('user_info')
          wx.removeStorageSync('login_time')
          var app = getApp()
          app.globalData.userInfo = null
          self.setData({ userInfo: null, hasUserInfo: false, loginExpire: '' })
          wx.showToast({ title: '已退出', icon: 'success' })
        }
      }
    })
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
    if (self.data.notifyLoading) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    self.setData({ notifyLoading: true })
    notify.requestAndSave([type], function(err, result) {
      self.setData({ notifyLoading: false })
      if (err) {
        if (!err.noConfig) {
          console.error('订阅失败详情:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: '请先登录后再设置', icon: 'none' })
          } else {
            wx.showToast({ title: '设置失败，请重试', icon: 'none' })
          }
        }
        return
      }
      if (result[type] === 'accept') {
        self.setData({ ['notifyStatus.' + type]: true })
        wx.showToast({ title: '已开启', icon: 'success' })
      } else if (result[type] === 'reject') {
        self.setData({ ['notifyStatus.' + type]: false })
        wx.showToast({ title: '已拒绝', icon: 'none' })
      } else if (result[type] === 'ban') {
        self.setData({ ['notifyStatus.' + type]: false })
        wx.showModal({
          title: '通知已关闭',
          content: '您已关闭该类通知，请在小程序设置中手动开启',
          confirmText: '去设置',
          success: function(modalRes) {
            if (modalRes.confirm) {
              wx.openSetting({})
            }
          }
        })
      }
    })
  },
  onNotifySetting: function() {
    wx.openSetting({})
  },
  onNotifyAdd: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    if (self.data.notifyAdding) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    var currentCount = self.data.notifyCount[type] || 0
    if (currentCount >= 99) {
      wx.showToast({ title: '已达上限99条', icon: 'none' })
      return
    }
    self.setData({ notifyAdding: true })
    notify.requestAndSave([type], function(err, result) {
      self.setData({ notifyAdding: false })
      if (err) {
        if (!err.noConfig) {
          console.error('订阅失败详情:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: '请先登录后再设置', icon: 'none' })
          } else {
            wx.showToast({ title: '设置失败，请重试', icon: 'none' })
          }
        }
        return
      }
      if (result[type] === 'accept') {
        var newCount = currentCount + 1
        self.setData({
          ['notifyStatus.' + type]: true,
          ['notifyCount.' + type]: newCount
        })
        wx.showToast({ title: '已添加(' + newCount + '/99)', icon: 'success' })
      } else if (result[type] === 'reject') {
        wx.showToast({ title: '已拒绝', icon: 'none' })
      } else if (result[type] === 'ban') {
        wx.showModal({
          title: '通知已关闭',
          content: '您已关闭该类通知，请在小程序设置中手动开启',
          confirmText: '去设置',
          success: function(modalRes) {
            if (modalRes.confirm) {
              wx.openSetting({})
            }
          }
        })
      }
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  showAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '1. 本应用为非官方攻略工具。\n2. 仅供学习交流使用，请勿用于商业用途。\n3. 尊重原创，数据版权归原作者所有。',
      showCancel: false
    })
  },
  showPrivacy: function() {
    wx.navigateTo({ url: '/pages/about/about' })
  },
  checkAdmin: function() {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var app = getApp()
    var userInfo = app.globalData.userInfo
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        console.log('管理员openid:', adminOpenid)
        db.collection('users').get()
          .then(function(userRes) {
            console.log('用户记录:', userRes.data)
            for (var i = 0; i < userRes.data.length; i++) {
              console.log('用户' + i + '的_openid:', userRes.data[i]._openid)
              if (userRes.data[i]._openid === adminOpenid) {
                self.setData({ isAdmin: true })
                console.log('验证通过，已设置为管理员')
                break
              }
            }
          })
      })
      .catch(function(e) {
        console.log('检查管理员失败:', e)
      })
  },
  goAdmin: function() {
    wx.navigateTo({ url: '/pages/admin/admin' })
  }
})
