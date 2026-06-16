var app = getApp()
var db = null
var cloudUrl = require('../../utils/cloudUrl')

Page({
  data: {
    buildTime: '',
    contact: 'flyzccboard@yeah.net',
    uid: '476200',
    aboutData: {
      appName: '洛手助手BENJAMIN',
      version: '版本 v1.0.8F 体验版',
      devName: '浙里本杰明',
      devAvatar: '/images/avatar.jpg',
      uid: '476200',
      contact: 'flyzccboard@yeah.net',
      icp: '浙ICP备2026043884号',
      gifts: ['免费领一测、二测、三测鸭蛋', '赐福奇袭固执罗隐'],
      platforms: [
        { name: 'QQ音乐', url: 'https://y.qq.com/' },
        { name: '网易云音乐', url: 'https://music.163.com/' }
      ]
    },
    editMode: '',
    showModal: false,
    platformName: '',
    platformUrl: ''
  },
  onLoad() {
    if (wx.cloud) db = wx.cloud.database()
  },
  onShow() {
    var self = this
    var n = new Date()
    self.setData({
      buildTime: n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0')
    })
    self.loadAboutData()
    self.checkAdmin()
  },
  parseChangelog(content) {
    if (!content) return []
    var lines = content.split('\n')
    var result = []
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue
      var type = 'opt'
      if (line.indexOf('新增：') === 0 || line.indexOf('+') === 0) {
        type = 'add'
      } else if (line.indexOf('下线：') === 0 || line.indexOf('-') === 0) {
        type = 'del'
      } else if (line.indexOf('优化：') === 0 || line.indexOf('*') === 0) {
        type = 'opt'
      } else if (line.indexOf('修复：') === 0) {
        type = 'fix'
      }
      result.push({ text: line, type: type })
    }
    return result
  },
  loadAboutData() {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function(res) {
        var defaults = self.data.aboutData
        var cloudData = res.data || {}
        var merged = {}
        for (var key in defaults) {
          if (key === 'gifts' || key === 'platforms') {
            merged[key] = cloudData[key] || defaults[key]
          } else {
            merged[key] = cloudData[key] !== undefined ? cloudData[key] : defaults[key]
          }
        }
        self.setData({ 
          aboutData: merged,
          changelogLines: self.parseChangelog(merged.changelogContent || self.data.defaultChangelog)
        })
        if (cloudUrl.isCloudUrl(merged.devAvatar)) {
          cloudUrl.convertList([merged], 'devAvatar', function(converted) {
            self.setData({ 'aboutData.devAvatar': converted[0].devAvatar })
          })
        }
      })
      .catch(function() {})
  },
  checkAdmin() {
    var self = this
    if (!db) return
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      db.collection('admin_config').doc('admin').get()
        .then(function(adminRes) {
          var adminOpenid = adminRes.data.openid
          if (openid === adminOpenid) {
            self.setData({ isAdmin: true })
          }
        })
        .catch(function() {})
    }).catch(function() {})
  },
  onEdit(e) {
    if (!this.data.isAdmin) return
    var field = e.currentTarget.dataset.field
    var value = e.currentTarget.dataset.value || ''
    var title = field === 'devName' ? '编辑开发者名称' : field === 'uid' ? '编辑UID' : '编辑邮箱'
    this.setData({ showModal: true, editingField: field, editValue: value, editModalTitle: title, editMode: 'field' })
  },
  addGift() {
    this.setData({ showModal: true, editingField: 'gift', editValue: '', editModalTitle: '添加福利', editMode: 'addGift' })
  },
  deleteGift(e) {
    var self = this
    var idx = e.currentTarget.dataset.idx
    var gifts = (self.data.aboutData.gifts || []).slice()
    gifts.splice(idx, 1)
    self.setData({ 'aboutData.gifts': gifts })
    self.saveGifts(gifts)
  },
  saveGifts(gifts) {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: { gifts: gifts, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('about_config').add({ data: { _id: 'main', gifts: gifts, updateTime: db.serverDate() } })
      })
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  addPlatform() {
    this.setData({
      showModal: true,
      editingField: 'platform',
      platformName: '',
      platformUrl: '',
      editModalTitle: '添加应用平台',
      editMode: 'addPlatform'
    })
  },
  deletePlatform(e) {
    var self = this
    var idx = e.currentTarget.dataset.idx
    var platforms = (self.data.aboutData.platforms || []).slice()
    platforms.splice(idx, 1)
    self.setData({ 'aboutData.platforms': platforms })
    self.savePlatforms(platforms)
  },
  savePlatforms(platforms) {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: { platforms: platforms, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('about_config').add({ data: { _id: 'main', platforms: platforms, updateTime: db.serverDate() } })
      })
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  onPlatformNameInput(e) {
    this.setData({ platformName: e.detail.value })
  },
  onPlatformUrlInput(e) {
    this.setData({ platformUrl: e.detail.value })
  },
  copyPlatformUrl(e) {
    var item = e.currentTarget.dataset.item
    wx.setClipboardData({
      data: item.url,
      success() {
        wx.showToast({ title: '平台链接已复制', icon: 'success' })
      }
    })
  },
  onEditInput(e) {
    this.setData({ editValue: e.detail.value })
  },
  saveEdit() {
    var self = this
    if (self.data.submitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ submitting: true })

    if (self.data.editMode === 'addPlatform') {
      var name = (self.data.platformName || '').trim()
      var url = (self.data.platformUrl || '').trim()
      if (!name || !url) {
        wx.showToast({ title: '名称或链接不能为空', icon: 'none' })
        self.setData({ submitting: false })
        return
      }
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        wx.showToast({ title: '链接以http://或https://开头', icon: 'none' })
        self.setData({ submitting: false })
        return
      }
      var platforms = (self.data.aboutData.platforms || []).concat([{ name: name, url: url }])
      self.setData({ 'aboutData.platforms': platforms })
      self.savePlatforms(platforms)
      self.setData({ submitting: false, showModal: false })
      return
    }

    var value = self.data.editValue ? self.data.editValue.trim() : ''
    if (!value) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      self.setData({ submitting: false })
      return
    }

    if (self.data.editMode === 'addGift') {
      var gifts = (self.data.aboutData.gifts || []).concat([value])
      self.setData({ 'aboutData.gifts': gifts })
      self.saveGifts(gifts)
      self.setData({ submitting: false, showModal: false })
      return
    }

    var updateData = {}
    updateData[self.data.editingField] = value
    updateData.updateTime = db.serverDate()

    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: updateData })
      })
      .catch(function() {
        updateData._id = 'main'
        return db.collection('about_config').add({ data: updateData })
      })
      .then(function() {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadAboutData()
      })
      .catch(function(err) {
        console.error('保存失败详情:', err)
        self.setData({ submitting: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  closeModal() {
    this.setData({ showModal: false })
  },
  preventClose: function() {},
  copyEmail() { wx.setClipboardData({ data: this.data.aboutData?.contact || this.data.contact, success() { wx.showToast({ title: '已复制', icon: 'success' }) } }) },
  copyUID() { wx.setClipboardData({ data: this.data.aboutData?.uid || this.data.uid, success() { wx.showToast({ title: '已复制', icon: 'success' }) } }) },
  onFeedback() {
    wx.showActionSheet({
      itemList: ['复制邮箱地址', '发送邮件反馈'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.setClipboardData({ data: 'flyzccboard@yeah.net', success() { wx.showToast({ title: '邮箱已复制', icon: 'success' }) } })
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({ data: 'flyzccboard@yeah.net', success() {
            wx.showModal({
              title: '发送邮件',
              content: '邮箱地址已复制到剪贴板\n\n请打开邮箱App，新建邮件发送至：\nflyzccboard@yeah.net',
              confirmText: '我知道了',
              showCancel: false
            })
          }})
        }
      }
    })
  },
  onShareAppMessage() { return { title: '洛手助手BENJAMIN', path: '/pages/index/index', imageUrl: '/images/banner1.png' } },
  onShareTimeline() { return { title: '洛手助手BENJAMIN - 洛克王国攻略工具', imageUrl: '/images/banner1.png' } }
})