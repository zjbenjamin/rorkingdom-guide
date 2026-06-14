var app = getApp()
var eggData = require('../../data/egg')
var db = null

Page({
  data: {
    types: eggData.types,
    sizes: eggData.sizes,
    pets: eggData.pets,
    mounts: eggData.mounts,
    isAdmin: false,
    maintenance: false,
    useCustom: false,
    customContent: '',
    showModal: false,
    editingField: '',
    editValue: '',
    submitting: false
  },
  onShow: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadConfig()
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
  loadConfig: function() {
    var self = this
    if (!db) return
    db.collection('page_config').doc('egg').get()
      .then(function(res) {
        var d = res.data
        self.setData({
          maintenance: d.maintenance || false,
          useCustom: d.useCustom || false,
          customContent: d.customContent || ''
        })
      })
      .catch(function() {})
  },
  toggleMaintenance: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.maintenance
    db.collection('page_config').doc('egg').get()
      .then(function() {
        return db.collection('page_config').doc('egg').update({
          data: { maintenance: newVal, updateTime: db.serverDate() }
        })
      })
      .catch(function() {
        return db.collection('page_config').add({
          data: { _id: 'egg', maintenance: newVal, useCustom: false, customContent: '', updateTime: db.serverDate() }
        })
      })
      .then(function() {
        self.setData({ maintenance: newVal })
        wx.showToast({ title: newVal ? '已下线' : '已上线', icon: 'success' })
      })
  },
  toggleMode: function() {
    var self = this
    if (!db) return
    var newMode = !self.data.useCustom
    db.collection('page_config').doc('egg').get()
      .then(function() {
        return db.collection('page_config').doc('egg').update({
          data: { useCustom: newMode, updateTime: db.serverDate() }
        })
      })
      .catch(function() {
        return db.collection('page_config').add({
          data: { _id: 'egg', useCustom: newMode, customContent: '', updateTime: db.serverDate() }
        })
      })
      .then(function() {
        self.setData({ useCustom: newMode })
        wx.showToast({ title: newMode ? '已切换为自定义' : '已切换为默认', icon: 'success' })
      })
  },
  onEdit: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.currentTarget.dataset.value || ''
    this.setData({ showModal: true, editingField: field, editValue: value })
  },
  onEditInput: function(e) { this.setData({ editValue: e.detail.value }) },
  saveEdit: function() {
    var self = this
    if (self.data.submitting) return
    var value = self.data.editValue.trim()
    if (!value) { wx.showToast({ title: '请输入内容', icon: 'none' }); return }
    self.setData({ submitting: true })
    var updateData = {}
    updateData[self.data.editingField] = value
    updateData.updateTime = db.serverDate()
    db.collection('page_config').doc('egg').update({ data: updateData })
      .then(function() {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadConfig()
      })
      .catch(function() {
        self.setData({ submitting: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  closeModal: function() { this.setData({ showModal: false }) },
  preventClose: function() {},
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
