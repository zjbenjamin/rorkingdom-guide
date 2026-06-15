var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')

Page({
  data: {
    bannerUrl: '',
    announcements: [],
    hotPosts: [],
    subscribeConfig: {},
    buildTime: '',
    showCommunity: true
  },
  onShow: function() {
    var self = this
    var n = new Date()
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    self.setData({
      buildTime: n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(n.getDate()).padStart(2,'0') + ' ' + String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0') + ':' + String(n.getSeconds()).padStart(2,'0'),
      subscribeConfig: subscribeConfig
    })
    if (wx.cloud) db = wx.cloud.database()
    self.checkAdmin()
    self.loadAnnouncements()
    self.loadBanner()
    self.checkSubscription()
    self.loadHotPosts()
    self.loadCommunityConfig()
  },
  checkAdmin: function() {
    var self = this
    if (!db) return
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').get()
          .then(function(userRes) {
            for (var i = 0; i < userRes.data.length; i++) {
              if (userRes.data[i]._openid === adminOpenid) {
                self.setData({ isAdmin: true })
                return
              }
            }
          })
      })
      .catch(function() {})
  },
  loadCommunityConfig: function() {
    var self = this
    if (!db) return
    db.collection('page_config').doc('community').get()
      .then(function(res) {
        self.setData({ showCommunity: !res.data.maintenance })
      })
      .catch(function() {
        self.setData({ showCommunity: true })
      })
  },
  loadBanner: function() {
    var self = this
    if (!db) return
    db.collection('site_config').doc('banner').get()
      .then(function(res) {
        if (res.data && res.data.url && res.data.url !== 'none' && res.data.url.indexOf('example.com') === -1) {
          if (res.data.url.indexOf('cloud://') === 0) {
            wx.cloud.getTempFileURL({
              fileList: [res.data.url],
              success: function(fileRes) {
                if (fileRes.fileList && fileRes.fileList[0] && fileRes.fileList[0].tempFileURL) {
                  self.setData({ bannerUrl: fileRes.fileList[0].tempFileURL })
                }
              }
            })
          } else {
            self.setData({ bannerUrl: res.data.url })
          }
        }
      })
      .catch(function() {})
  },
  loadAnnouncements: function() {
    var self = this
    if (!db) return
    db.collection('announcements')
      .orderBy('pinned', 'desc')
      .orderBy('createTime', 'desc')
      .limit(10)
      .get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) {
          list[i].timeStr = self.formatTime(list[i].createTime)
        }
        self.setData({ announcements: list })
        cloudUrl.convertList(list, 'image', function(converted) {
          self.setData({ announcements: converted })
        })
      })
      .catch(function() {})
  },
  loadHotPosts: function() {
    var self = this
    if (!db) return
    db.collection('comments')
      .where({ replyTo: null })
      .orderBy('likes', 'desc')
      .limit(9)
      .get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) {
          list[i].likeCount = list[i].likes ? list[i].likes.length : 0
        }
        self.setData({ hotPosts: list })
      })
      .catch(function() {})
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date)
    var now = new Date()
    var diff = now - d
    if (diff < 86400000) return '今天'
    if (diff < 172800000) return '昨天'
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
    return d.getMonth() + 1 + '/' + d.getDate()
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  goAdmin: function() { wx.navigateTo({ url: '/pages/admin/admin' }) },
  showAnnouncement: function(e) {
    var idx = e.currentTarget.dataset.i
    if (this.data.expandedIndex === idx) {
      this.setData({ expandedIndex: -1 })
    } else {
      this.setData({ expandedIndex: idx })
    }
  },
  previewAnnouncementImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) {
      wx.previewImage({ current: src, urls: [src] })
    }
  },
  onAnnouncementImageError: function(e) {
    var idx = e.currentTarget.dataset.index
    var announcements = this.data.announcements
    if (announcements[idx]) {
      announcements[idx].image = ''
      this.setData({ announcements: announcements })
    }
  },
  subscribeAnnouncement: function() {
    var self = this
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    var currentCount = self.data.subscribeCount || 0
    if (currentCount >= 99) {
      wx.showToast({ title: '已达上限99条', icon: 'none' })
      return
    }
    notify.requestAndSave(['announcement'], function(err, result) {
      if (err) {
        if (!err.noConfig) {
          console.error('公告订阅失败:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: '请先登录后再设置', icon: 'none' })
          } else {
            wx.showToast({ title: '设置失败，请重试', icon: 'none' })
          }
        }
        return
      }
      if (result.announcement === 'accept') {
        var newCount = currentCount + 1
        self.setData({
          subscribedAnnouncement: true,
          subscribeCount: newCount
        })
        wx.showToast({ title: '已添加(' + newCount + '/99)', icon: 'success' })
      } else if (result.announcement === 'reject') {
        wx.showToast({ title: '已拒绝通知', icon: 'none' })
      } else if (result.announcement === 'ban') {
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
  saveSubscription: function(type) {
    var self = this
    if (!db) return
    var openid = ''
    try {
      var res = wx.getStorageSync('openid')
      if (res) openid = res
    } catch (e) {}
    if (!openid) {
      wx.cloud.callFunction({
        name: 'login',
        timeout: 3000,
        success: function(loginRes) {
          if (loginRes.result && loginRes.result.openid) {
            openid = loginRes.result.openid
            wx.setStorageSync('openid', openid)
            self.doSaveSubscription(type, openid)
          }
        },
        fail: function() {}
      })
    } else {
      self.doSaveSubscription(type, openid)
    }
  },
  doSaveSubscription: function(type, openid) {
    var self = this
    db.collection('subscribers').where({ openid: openid, type: type }).get()
      .then(function(res) {
        if (res.data.length > 0) {
          var sub = res.data[0]
          var newCount = (sub.count || 0) + 1
          return db.collection('subscribers').doc(sub._id).update({
            data: { count: newCount, status: 'active', updateTime: db.serverDate() }
          })
        } else {
          return db.collection('subscribers').add({
            data: {
              openid: openid,
              type: type,
              count: 1,
              status: 'active',
              createTime: db.serverDate()
            }
          })
        }
      })
      .then(function() {
        wx.showToast({ title: '订阅成功', icon: 'success' })
        self.checkSubscription()
      })
      .catch(function() {
        wx.showToast({ title: '订阅失败', icon: 'none' })
      })
  },
  checkSubscription: function() {
    var self = this
    if (!db) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      wx.setStorageSync('openid', openid)
      db.collection('subscribers').where({ openid: openid, type: 'announcement' }).get()
        .then(function(res) {
          if (res.data.length > 0) {
            self.setData({
              subscribedAnnouncement: res.data[0].status === 'active',
              subscribeCount: res.data[0].count || 0
            })
          }
        })
        .catch(function() {})
    }).catch(function() {})
  },
  toggleBannerModal: function() {
    var self = this
    if (!self.data.isAdmin) return
    self.setData({ showBannerModal: !self.data.showBannerModal, bannerInput: self.data.bannerUrl || '' })
  },
  onBannerInput: function(e) { this.setData({ bannerInput: e.detail.value }) },
  chooseBannerImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        wx.cloud.uploadFile({
          cloudPath: 'banner/' + Date.now() + '.jpg',
          filePath: filePath
        }).then(function(uploadRes) {
          wx.hideLoading()
          self.setData({ bannerInput: uploadRes.fileID })
        }).catch(function() {
          wx.hideLoading()
          wx.showToast({ title: '上传失败', icon: 'none' })
        })
      }
    })
  },
  saveBanner: function() {
    var self = this
    if (self.data.bannerSaving || !db) return
    var url = self.data.bannerInput.trim()
    if (!url) { wx.showToast({ title: '请输入图片链接', icon: 'none' }); return }
    self.setData({ bannerSaving: true })
    db.collection('site_config').doc('banner').get()
      .then(function() {
        return db.collection('site_config').doc('banner').update({ data: { url: url, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('site_config').add({ data: { _id: 'banner', url: url, updateTime: db.serverDate() } })
      })
      .then(function() {
        self.setData({ bannerSaving: false, showBannerModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadBanner()
      })
      .catch(function() {
        self.setData({ bannerSaving: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  preventClose: function() {}
})