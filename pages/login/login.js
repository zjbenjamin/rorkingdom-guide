var app = getApp()
var notify = require('../../utils/notify')
var templateConfig = require('../../config/notifyTemplates')
var levelUtil = require('../../utils/level')
var db = null

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
    notifyAdding: false
  },
  onLoad: function() {
    var self = this
    var app = getApp()
    if (wx.cloud) db = wx.cloud.database()
    var saved = wx.getStorageSync('user_info')
    if (saved) app.globalData.userInfo = saved
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    self.setData({ subscribeConfig: subscribeConfig })
    self.checkLoginStatus()
    self.recordLoginDay()
    self.checkAdmin()
    self.loadNotifyStatus()
    self.checkNotifyConfig()
    self.loadUserRole()

    // 监听微信官方隐私授权触发
    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization(function(resolve) {
        self.resolvePrivacyAuthorization = resolve
        self.setData({ showWechatPrivacyModal: true })
      })
    }
  },
  onShow: function() {
    this.loadUserRole()
  },
  loadUserRole: function() {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var app = getApp()
    var userInfo = app.globalData.userInfo
    if (!userInfo) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0 && r.data[0].role) {
            self.setData({ userRole: r.data[0].role })
          }
        })
        .catch(function() {})
    }).catch(function() {})
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
    var gameUid = wx.getStorageSync('game_uid') || ''
    var captureCount = wx.getStorageSync('total_catches') || 0
    var hasUid = !!gameUid
    var level = levelUtil.calcLevel(totalDays, hasUid, captureCount)
    var levelInfo = levelUtil.getLevelColor(level)
    var levelName = levelUtil.getLevelName(level)
    var levelIcon = levelUtil.getLevelIcon(level)
    var nextDays = levelUtil.calcNextLevelDays(level)
    var nextXP = levelUtil.getNextXP(captureCount)
    this.setData({
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
    this.syncLevel(level)
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
  syncLevel: function(level) {
    if (!wx.cloud) return
    var db = wx.cloud.database()
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { level: level, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function() {})
    }).catch(function() {})
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
        wx.removeStorageSync('is_admin_user')
        wx.removeStorageSync('admin_logged_in')
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
    wx.showToast({ title: '拒绝隐私指引将无法进行登录授权', icon: 'none' })
  },
  onLogin: function() {
    var self = this
    if (self.data.isLogging) return
    if (!self.data.isAgreed) {
      wx.showToast({ title: '请先勾选同意《用户协议》和《隐私政策》', icon: 'none' })
      return
    }
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
      content: '为提供更好体验，登录后将同步以下数据到云端：\n\n• 头像和昵称 — 评论身份标识\n• 累计登录天数 — 等级系统计算\n• 用户偏好设置 — 多设备同步\n\n数据仅用于本应用功能，不会向第三方共享。',
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
          self.clearLocalUserData()
          wx.showToast({ title: '已退出', icon: 'success' })
        }
      }
    })
  },
  onDeleteAccount: function() {
    var self = this
    wx.showModal({
      title: '注销账户',
      content: '注销后将永久删除您在云端的头像、昵称、积分等级及全部设置数据，注销操作无法恢复。确定要注销吗？',
      confirmColor: '#ff4757',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '注销中...' })
          if (!wx.cloud) {
            wx.hideLoading()
            self.clearLocalUserData()
            wx.showToast({ title: '本地注销成功', icon: 'success' })
            return
          }
          var db = wx.cloud.database()
          wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
            var openid = loginRes.result.openid
            db.collection('users').where({ _openid: openid }).remove()
              .then(function() {
                wx.hideLoading()
                self.clearLocalUserData()
                wx.showToast({ title: '账户已注销', icon: 'success' })
              })
              .catch(function(e) {
                console.error('云端数据注销失败:', e)
                wx.hideLoading()
                wx.showToast({ title: '注销失败，请重试', icon: 'none' })
              })
          }).catch(function(e) {
            console.error('获取 openid 失败:', e)
            wx.hideLoading()
            wx.showToast({ title: '网络错误，请重试', icon: 'none' })
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
    var app = getApp()
    app.globalData.userInfo = null
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
  onResetSubscribe: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var names = { announcement: '公告', activity: '活动', merchant: '商人' }
    wx.showModal({
      title: '重置订阅',
      content: '确定重置「' + names[type] + '」订阅？重置后需重新授权',
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
                wx.showToast({ title: '已重置', icon: 'success' })
                notify.requestAndSave([type], function(err, result) {
                  if (!err && result && result[type] === 'accept') {
                    self.setData({ ['notifyCount.' + type]: 1 })
                    self.loadNotifyStatus()
                    wx.showToast({ title: '已重新授权', icon: 'success' })
                  }
                })
              })
              .catch(function() { wx.showToast({ title: '重置失败', icon: 'none' }) })
          }).catch(function() {})
        }
      }
    })
  },
  _notifyAddingLock: false,
  onNotifyAdd: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    if (self.data.notifyAdding || self._notifyAddingLock) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    var currentCount = self.data.notifyCount[type] || 0
    if (currentCount >= 99) {
      wx.showToast({ title: '已达上限99条', icon: 'none' })
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
              wx.showToast({ title: '请先登录后再设置', icon: 'none' })
            } else {
              wx.showToast({ title: '设置失败：' + (err.errMsg || '请重试'), icon: 'none' })
            }
          }
          return
        }
        if (!result) {
          wx.showToast({ title: '订阅请求已发送', icon: 'none' })
          return
        }
        if (result[type] === 'accept') {
          var newCount = currentCount + 1
          var notifyCount = self.data.notifyCount || {}
          notifyCount[type] = newCount
          var notifyStatus = self.data.notifyStatus || {}
          notifyStatus[type] = true
          self.setData({
            notifyCount: notifyCount,
            notifyStatus: notifyStatus
          })
          wx.showToast({ title: '已添加(' + newCount + '/99)', icon: 'success' })
          self.loadNotifyStatus()
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
    } catch (ex) {
      clearTimeout(unlockTimer)
      self._notifyAddingLock = false
      self.setData({ notifyAdding: false })
      console.error('[onNotifyAdd] Exception caught:', ex)
      wx.showToast({ title: '异常：' + (ex.message || '请重试'), icon: 'none' })
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
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var app = getApp()
    var userInfo = app.globalData.userInfo
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            if (userRes.data.length > 0) {
              self.setData({ isAdmin: true })
            }
          })
          .catch(function() {})
      })
      .catch(function(e) {
        console.log('检查管理员失败:', e)
      })
  },
  goAdmin: function() {
    wx.navigateTo({ url: '/pages/admin/admin' })
  },
  onShareAppMessage: function() {
    return { title: '洛手助手BENJAMIN - 个人中心', path: '/pages/index/index', imageUrl: '/images/banner1.png' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手BENJAMIN - 精灵图鉴·捕捉统计·活动日历', imageUrl: '/images/banner1.png' }
  }
})
