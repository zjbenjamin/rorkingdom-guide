var app = getApp()
var merchantData = require('../../data/merchant')
var i18n = require('../../utils/i18n')
var notify = require('../../utils/notify')
var db = null

Page({
  data: {
    items: [],
    t: {},
    isAdmin: false,
    maintenance: false,
    useCustom: false,
    customTitle: '',
    customDesc: '',
    customItems: '',
    currentSelling: [],
    currentSellingText: '',
    showSellingModal: false,
    sellingSubmitting: false,
    showModal: false,
    editingField: '',
    editValue: '',
    submitting: false,
    subscribedMerchant: false,
    subscribeCount: 0,
    showAddItemModal: false,
    newItem: {
      name: '',
      price: '',
      effect: '',
      rarity: '普通',
      source: '远行商人'
    },
    rarityOptions: ['普通', '稀有', '史诗', '传说'],
    addingItem: false,
    newItems: [],
    newItemsPage: 0,
    newItemsAnim: false
  },
  newItemsTimer: null,
  onShow: function() {
    this.setData({ t: i18n.i18n[i18n.getLanguage()] || i18n.i18n['zh'] })
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadConfig()
    this.checkSubscription()
    this.markNewItems()
    this.startNewItemsTimer()
  },
  onHide: function() {
    this.stopNewItemsTimer()
  },
  onUnload: function() {
    this.stopNewItemsTimer()
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
    if (!db) { self.setData({ items: merchantData.items }); return }
    db.collection('page_config').doc('merchant').get()
      .then(function(res) {
        var d = res.data
        self.setData({
          maintenance: d.maintenance || false,
          useCustom: d.useCustom || false,
          customTitle: d.customTitle || '',
          customDesc: d.customDesc || '',
          customItems: d.customItems || '',
          items: (d.useCustom && d.customItems) ? self.parseItems(d.customItems) : merchantData.items,
          currentSelling: d.currentSelling ? self.parseItems(d.currentSelling) : [],
          currentSellingText: d.currentSelling || ''
        })
        self.markNewItems()
      })
      .catch(function() {
        self.setData({ items: merchantData.items })
        self.markNewItems()
      })
  },
  parseItems: function(text) {
    var lines = text.split('\n')
    var items = []
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue
      var parts = line.split('|')
      if (parts.length >= 4) {
        items.push({
          id: i + 1,
          name: parts[0].trim(),
          price: parseInt(parts[1]) || 0,
          effect: parts[2].trim(),
          rarity: parts[3].trim() || '普通',
          source: parts[4] ? parts[4].trim() : '远行商人'
        })
      }
    }
    return items.length > 0 ? items : merchantData.items
  },
  toggleMaintenance: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.maintenance
    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({
        data: { maintenance: newVal, updateTime: db.serverDate() }
      })
    }
    updateOrAdd().catch(function() {
      return db.collection('page_config').add({
        data: { _id: 'merchant', maintenance: newVal, useCustom: false, customTitle: '', customDesc: '', customItems: '', updateTime: db.serverDate() }
      })
    }).then(function() {
      self.setData({ maintenance: newVal })
      wx.showToast({ title: newVal ? '已下线' : '已上线', icon: 'success' })
    })
  },
  toggleMode: function() {
    var self = this
    if (!db) return
    var newMode = !self.data.useCustom
    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({
        data: { useCustom: newMode, updateTime: db.serverDate() }
      })
    }
    updateOrAdd().catch(function() {
      return db.collection('page_config').add({
        data: { _id: 'merchant', useCustom: newMode, customTitle: '', customDesc: '', customItems: '', updateTime: db.serverDate() }
      })
    }).then(function() {
      self.setData({ useCustom: newMode, items: newMode ? self.parseItems(self.data.customItems) : merchantData.items })
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
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    var value = self.data.editValue.trim()
    if (!value) { wx.showToast({ title: '请输入内容', icon: 'none' }); return }
    self.setData({ submitting: true })
    var updateData = {}
    updateData[self.data.editingField] = value
    updateData.updateTime = db.serverDate()
    db.collection('page_config').doc('merchant').update({ data: updateData })
      .then(function() {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadConfig()
        wx.cloud.callFunction({
          name: 'sendSubscribe',
          data: {
            type: 'merchant',
            title: '商人信息更新',
            content: value.substring(0, 20),
            page: '/pages/merchant/merchant'
          }
        }).catch(function() {})
      })
      .catch(function() {
        self.setData({ submitting: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  closeModal: function() { this.setData({ showModal: false }) },
  preventClose: function() {},
  showItem: function(e) {
    var d = e.currentTarget.dataset.d
    var t = this.data.t
    wx.showModal({ title: d.name, content: (t.price || '价格') + ': ' + d.price + (t.currency || '洛克贝') + '\n' + (t.effect || '效果') + ': ' + d.effect + '\n' + (t.rarity || '稀有度') + ': ' + d.rarity + '\n' + (t.source || '来源') + ': ' + d.source, showCancel: false })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  openSellingModal: function() {
    this.setData({ showSellingModal: true })
  },
  closeSellingModal: function() {
    this.setData({ showSellingModal: false })
  },
  onSellingInput: function(e) {
    this.setData({ currentSellingText: e.detail.value })
  },
  saveSelling: function() {
    var self = this
    if (self.data.sellingSubmitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ sellingSubmitting: true })
    var text = self.data.currentSellingText.trim()
    var parsed = text ? self.parseItems(text) : []
    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({
        data: { currentSelling: text, updateTime: db.serverDate() }
      })
    }
    updateOrAdd().catch(function() {
      return db.collection('page_config').add({
        data: { _id: 'merchant', currentSelling: text, useCustom: false, customTitle: '', customDesc: '', customItems: '', maintenance: false, updateTime: db.serverDate() }
      })
    }).then(function() {
      self.setData({ sellingSubmitting: false, showSellingModal: false, currentSelling: parsed, currentSellingText: text })
      wx.showToast({ title: '保存成功', icon: 'success' })
      if (parsed.length > 0) {
        wx.cloud.callFunction({
          name: 'sendSubscribe',
          data: {
            type: 'merchant',
            title: '商人上架更新',
            content: '在售物品已更新，共' + parsed.length + '件',
            page: '/pages/merchant/merchant'
          }
        }).catch(function() {})
      }
    }).catch(function() {
      self.setData({ sellingSubmitting: false })
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },
  deleteSellingItem: function(e) {
    var self = this
    var index = e.currentTarget.dataset.index
    if (!self.data.isAdmin || !db) return
    var items = self.data.currentSelling
    items.splice(index, 1)
    var text = items.map(function(i) {
      return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source
    }).join('\n')
    db.collection('page_config').doc('merchant').update({
      data: { currentSelling: text, updateTime: db.serverDate() }
    }).then(function() {
      self.setData({ currentSelling: items, currentSellingText: text })
      wx.showToast({ title: '已移除', icon: 'success' })
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },
  markNewItems: function() {
    var self = this
    var recent = wx.getStorageSync('merchant_new_items') || []
    var now = Date.now()
    var valid = []
    for (var i = 0; i < recent.length; i++) {
      if (now - recent[i].addTime < 86400000) valid.push(recent[i])
    }
    if (valid.length !== recent.length) wx.setStorageSync('merchant_new_items', valid)
    var items = self.data.items || []
    var matched = []
    for (var j = 0; j < valid.length; j++) {
      for (var k = 0; k < items.length; k++) {
        if (items[k].name === valid[j].name && items[k].price === valid[j].price) {
          matched.push(items[k])
          break
        }
      }
    }
    self.setData({ newItems: matched, newItemsPage: 0 })
    if (matched.length > 0) {
      self.startNewItemsTimer()
    }
  },
  startNewItemsTimer: function() {
    var self = this
    self.stopNewItemsTimer()
    if (self.data.newItems.length < 2) return
    self.newItemsTimer = setInterval(function() {
      self.slideNewItems()
    }, 3000)
  },
  stopNewItemsTimer: function() {
    if (this.newItemsTimer) {
      clearInterval(this.newItemsTimer)
      this.newItemsTimer = null
    }
  },
  slideNewItems: function() {
    var self = this
    var len = self.data.newItems.length
    if (len < 2) return
    var next = (self.data.newItemsPage + 1) % len
    self.setData({ newItemsAnim: true, newItemsPage: next })
    setTimeout(function() { self.setData({ newItemsAnim: false }) }, 500)
  },
  subscribeMerchant: function() {
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
    notify.requestAndSave(['merchant'], function(err, result) {
      if (err) {
        if (!err.noConfig) {
          console.error('商人订阅失败:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: '请先登录后再设置', icon: 'none' })
          } else {
            wx.showToast({ title: '设置失败，请重试', icon: 'none' })
          }
        }
        return
      }
      if (result.merchant === 'accept') {
        var newCount = currentCount + 1
        self.setData({
          subscribedMerchant: true,
          subscribeCount: newCount
        })
        wx.showToast({ title: '已添加(' + newCount + '/99)', icon: 'success' })
      } else if (result.merchant === 'reject') {
        wx.showToast({ title: '已拒绝通知', icon: 'none' })
      } else if (result.merchant === 'ban') {
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
  openAddItemModal: function() {
    this.setData({
      showAddItemModal: true,
      newItem: {
        name: '',
        price: '',
        effect: '',
        rarity: '普通',
        source: '远行商人'
      }
    })
  },
  closeAddItemModal: function() {
    this.setData({ showAddItemModal: false })
  },
  onNewItemInput: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.detail.value
    this.setData({ ['newItem.' + field]: value })
  },
  onRarityChange: function(e) {
    var index = e.detail.value
    this.setData({ 'newItem.rarity': this.data.rarityOptions[index] })
  },
  addMerchantItem: function() {
    var self = this
    if (self.data.addingItem) return
    var item = self.data.newItem
    if (!item.name.trim()) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' })
      return
    }
    if (!item.price.trim() || isNaN(parseInt(item.price))) {
      wx.showToast({ title: '请输入有效价格', icon: 'none' })
      return
    }
    if (!item.effect.trim()) {
      wx.showToast({ title: '请输入物品效果', icon: 'none' })
      return
    }
    self.setData({ addingItem: true })
    var newItemData = {
      id: Date.now(),
      name: item.name.trim(),
      price: parseInt(item.price),
      effect: item.effect.trim(),
      rarity: item.rarity,
      source: item.source.trim() || '远行商人'
    }
    var currentItems = self.data.items || []
    currentItems.unshift(newItemData)
    var customItemsText = currentItems.map(function(i) {
      return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source
    }).join('\n')
    db.collection('page_config').doc('merchant').get()
      .then(function() {
        return db.collection('page_config').doc('merchant').update({
          data: {
            useCustom: true,
            customItems: customItemsText,
            updateTime: db.serverDate()
          }
        })
      })
      .catch(function() {
        return db.collection('page_config').add({
          data: {
            _id: 'merchant',
            useCustom: true,
            customTitle: self.data.customTitle || '',
            customDesc: self.data.customDesc || '',
            customItems: customItemsText,
            maintenance: false,
            updateTime: db.serverDate()
          }
        })
      })
      .then(function() {
        self.setData({
          addingItem: false,
          showAddItemModal: false,
          items: currentItems,
          customItems: customItemsText,
          useCustom: true
        })
        var newRecent = wx.getStorageSync('merchant_new_items') || []
        newRecent.push({ name: newItemData.name, price: newItemData.price, addTime: Date.now() })
        wx.setStorageSync('merchant_new_items', newRecent)
        self.markNewItems()
        self.startNewItemsTimer()
        wx.showToast({ title: '添加成功', icon: 'success' })
        self.notifySubscribers(newItemData)
      })
      .catch(function() {
        self.setData({ addingItem: false })
        wx.showToast({ title: '添加失败', icon: 'none' })
      })
  },
  notifySubscribers: function(item) {
    if (!db) return
    wx.cloud.callFunction({
      name: 'sendSubscribe',
      data: {
        type: 'merchant',
        title: '新商品上架',
        content: item.name + ' - ' + item.price + '洛克贝',
        page: '/pages/merchant/merchant'
      }
    }).catch(function() {})
  },
  deleteMerchantItem: function(e) {
    var self = this
    var index = e.currentTarget.dataset.index
    if (!self.data.isAdmin || !db) return
    wx.showModal({
      title: '删除物品',
      content: '确定要删除该物品吗？',
      success: function(res) {
        if (res.confirm) {
          var items = self.data.items
          items.splice(index, 1)
          var customItemsText = items.map(function(i) {
            return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source
          }).join('\n')
          db.collection('page_config').doc('merchant').update({
            data: {
              customItems: customItemsText,
              updateTime: db.serverDate()
            }
          }).then(function() {
            self.setData({ items: items, customItems: customItemsText })
            wx.showToast({ title: '已删除', icon: 'success' })
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  }
})
