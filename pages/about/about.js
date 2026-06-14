var app = getApp()
var db = null
var cloudUrl = require('../../utils/cloudUrl')

Page({
  data: {
    buildTime: '',
    contact: 'flyzccboard@yeah.net',
    uid: '476200',
    aboutData: {
      appName: '洛手攻略',
      version: '版本 v1.0.6F 体验版',
      devName: '浙里本杰明',
      devAvatar: '/images/avatar.jpg',
      uid: '476200',
      contact: 'flyzccboard@yeah.net',
      gift1: '免费领一测、二测、三测鸭蛋',
      gift2: '赐福奇袭固执罗隐'
    },
    isAdmin: false,
    showModal: false,
    editingField: '',
    editValue: '',
    submitting: false
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
  loadAboutData() {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(res => {
        var defaults = self.data.aboutData
        var cloudData = res.data || {}
        var merged = {}
        for (var key in defaults) {
          merged[key] = cloudData[key] !== undefined ? cloudData[key] : defaults[key]
        }
        self.setData({ aboutData: merged })
        if (cloudUrl.isCloudUrl(merged.devAvatar)) {
          cloudUrl.convertList([merged], 'devAvatar', function(converted) {
            self.setData({ 'aboutData.devAvatar': converted[0].devAvatar })
          })
        }
      })
      .catch(() => {})
  },
  checkAdmin() {
    var self = this
    if (!db) return
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(res => {
        var adminOpenid = res.data.openid
        db.collection('users').get()
          .then(userRes => {
            for (var i = 0; i < userRes.data.length; i++) {
              if (userRes.data[i]._openid === adminOpenid) {
                self.setData({ isAdmin: true })
                return
              }
            }
          })
      })
      .catch(() => {})
  },
  onEdit(e) {
    if (!this.data.isAdmin) return
    var field = e.currentTarget.dataset.field
    var value = e.currentTarget.dataset.value || ''
    this.setData({ showModal: true, editingField: field, editValue: value })
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
    var updateData = {}
    updateData[self.data.editingField] = value
    updateData.updateTime = db.serverDate()
    db.collection('about_config').doc('main').update({ data: updateData })
      .then(() => {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadAboutData()
      })
      .catch(() => {
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
  onShareAppMessage() { return { title: '洛手攻略', path: '/pages/index/index' } }
})