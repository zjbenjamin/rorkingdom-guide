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
      version: '版本 v1.0.7B 体验版',
      devName: '浙里本杰明',
      devAvatar: '/images/avatar.jpg',
      uid: '476200',
      contact: 'flyzccboard@yeah.net',
      gifts: ['免费领一测、二测、三测鸭蛋', '赐福奇袭固执罗隐']
    },
    isAdmin: false,
    showModal: false,
    editingField: '',
    editValue: '',
    submitting: false,
    editModalTitle: '',
    editMode: '',
    showCommunity: true
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
    if (db) {
      db.collection('page_config').doc('community').get()
        .then(function(res) { self.setData({ showCommunity: !res.data.maintenance }) })
        .catch(function() {})
    }
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
          if (key === 'gifts') {
            merged[key] = cloudData[key] || defaults[key]
          } else {
            merged[key] = cloudData[key] !== undefined ? cloudData[key] : defaults[key]
          }
        }
        self.setData({ aboutData: merged })
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
  onEditInput(e) {
    this.setData({ editValue: e.detail.value })
  },
  saveEdit() {
    var self = this
    if (self.data.submitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    var value = self.data.editValue.trim()
    if (!value) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    self.setData({ submitting: true })

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
  onShareAppMessage() { return { title: '洛手助手BENJAMIN', path: '/pages/index/index' } }
})