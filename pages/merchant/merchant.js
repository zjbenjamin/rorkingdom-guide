var app = getApp()
var i18n = require('../../utils/i18n')
var merchantData = {
  items: [
    { id: 1, name: '棱镜球', price: 3200000, effect: '100%捕捉成功率', rarity: '传说', source: '远行商人' },
    { id: 2, name: '炫彩蛋', price: 1600000, effect: '有概率孵出闪光精灵', rarity: '传说', source: '远行商人' },
    { id: 3, name: '祝福项坠', price: 800000, effect: '精灵装备后获得祝福效果', rarity: '史诗', source: '远行商人' },
    { id: 4, name: '残缺魔镜', price: 480000, effect: '用于精灵觉醒的材料', rarity: '史诗', source: '远行商人' },
    { id: 5, name: '首领血脉秘药', price: 320000, effect: '提升首领精灵血脉等级', rarity: '史诗', source: '远行商人' },
    { id: 6, name: '适格钥匙', price: 320000, effect: '用于精灵进化的钥匙', rarity: '史诗', source: '远行商人' },
    { id: 7, name: '国王球', price: 160000, effect: '100%捕捉成功率', rarity: '传说', source: '安妮商店' },
    { id: 8, name: '血脉秘药', price: 160000, effect: '提升精灵血脉等级', rarity: '史诗', source: '远行商人' },
    { id: 9, name: '奇异血脉秘药', price: 160000, effect: '提升精灵奇异血脉等级', rarity: '史诗', source: '远行商人' },
    { id: 10, name: '能力钥匙', price: 160000, effect: '用于精灵能力提升', rarity: '稀有', source: '远行商人' },
    { id: 11, name: '神奇的蛋', price: 36000, effect: '孵化出随机精灵', rarity: '稀有', source: '远行商人' },
    { id: 12, name: '魔力果', price: 6000, effect: '精灵食用后增加大量经验值', rarity: '稀有', source: '远行商人' },
    { id: 13, name: '黑晶琉璃', price: 1000, effect: '珍贵矿石，用于精灵进化', rarity: '稀有', source: '道具图鉴' },
    { id: 14, name: '黄石榴石', price: 1000, effect: '珍贵矿石，用于精灵进化', rarity: '稀有', source: '道具图鉴' },
    { id: 15, name: '蓝晶碧玺', price: 1000, effect: '珍贵矿石，用于精灵进化', rarity: '稀有', source: '道具图鉴' },
    { id: 16, name: '紫莲刚玉', price: 1000, effect: '珍贵矿石，用于精灵进化', rarity: '稀有', source: '道具图鉴' },
    { id: 17, name: '粉尘', price: 500, effect: '精灵进化基础材料', rarity: '普通', source: '道具图鉴' },
    { id: 18, name: '可可果', price: 100, effect: '精灵食用后增加经验值', rarity: '普通', source: '道具图鉴' },
    { id: 19, name: '无花果', price: 150, effect: '精灵食用后增加较多经验值', rarity: '普通', source: '道具图鉴' }
  ]
}
var cloudUrl = require('../../utils/cloudUrl')
var notify = require('../../utils/notify')
var db = null

Page({
  data: {
    items: [],
    t: {},
    isAdmin: false,
    maintenance: false,
    merchantAway: false,
    useCustom: false,
    customTitle: '',
    customDesc: '',
    customItems: '',
    currentSelling: [],
    currentSellingText: '',
    currentSellingImage: '',
    sellingMode: 'text',
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
      source: '远行商人',
      image: ''
    },
    rarityOptions: ['普通', '稀有', '史诗', '传说'],
    addingItem: false,
    newItems: [],
    newItemsPage: 0,
    newItemsAnim: false,
    showAddSellingItemModal: false,
    addingSellingItem: false,
    itemSubStatus: {}
  },
  newItemsTimer: null,
  onShow: function() {
    this.setData({ t: i18n.i18n[i18n.getLanguage()] || i18n.i18n['zh'] })
    if (wx.cloud) db = wx.cloud.database()
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, merchant: true }
    this.setData({ subscribeConfig: subscribeConfig })
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
          merchantAway: d.merchantAway || false,
          useCustom: d.useCustom || false,
          customTitle: d.customTitle || '',
          customDesc: d.customDesc || '',
          customItems: d.customItems || '',
          items: (d.useCustom && d.customItems) ? self.parseItems(d.customItems) : merchantData.items,
          currentSelling: d.currentSelling ? self.parseItems(d.currentSelling) : [],
          currentSellingText: d.currentSelling || '',
          currentSellingImage: d.currentSellingImage || '',
          sellingMode: d.sellingMode || 'text'
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
          source: parts[4] ? parts[4].trim() : '远行商人',
          image: parts[5] ? parts[5].trim() : ''
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
  toggleMerchantAway: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.merchantAway
    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({
        data: { merchantAway: newVal, updateTime: db.serverDate() }
      })
    }
    updateOrAdd().catch(function() {
      return db.collection('page_config').add({
        data: { _id: 'merchant', merchantAway: newVal, useCustom: false, customTitle: '', customDesc: '', customItems: '', updateTime: db.serverDate() }
      })
    }).then(function() {
      self.setData({ merchantAway: newVal })
      wx.showToast({ title: newVal ? '已开启出差提示' : '已关闭出差提示', icon: 'success' })
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
        var pushLabel = self.data.editingField === 'customTitle' ? '标题' : self.data.editingField === 'customDesc' ? '描述' : '数据'
        notify.pushToSubscribers('merchant', '商人信息更新', value.substring(0, 20), '/pages/merchant/merchant')
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
  openAddSellingItemModal: function() {
    if (this.data.currentSelling.length >= 8) {
      wx.showToast({ title: '最多8件商品', icon: 'none' })
      return
    }
    this.setData({ showAddSellingItemModal: true })
  },
  closeAddSellingItemModal: function() {
    this.setData({ showAddSellingItemModal: false })
  },
  addSellingItemFromList: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!item || !db) return
    var exists = false
    for (var i = 0; i < self.data.currentSelling.length; i++) {
      if (self.data.currentSelling[i].name === item.name && self.data.currentSelling[i].price === item.price) {
        exists = true
        break
      }
    }
    if (exists) { wx.showToast({ title: '已在售卖列表中', icon: 'none' }); return }
    if (self.data.currentSelling.length >= 8) { wx.showToast({ title: '最多8件商品', icon: 'none' }); return }
    var updated = self.data.currentSelling.concat([item])
    var text = updated.map(function(i) {
      return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source
    }).join('\n')
    db.collection('page_config').doc('merchant').update({
      data: { currentSelling: text, updateTime: db.serverDate() }
    }).then(function() {
      self.setData({ currentSelling: updated, currentSellingText: text, showAddSellingItemModal: false })
      wx.showToast({ title: '已添加: ' + item.name, icon: 'success' })
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },
  openSellingModal: function() {
    this.setData({ showSellingModal: true })
  },
  closeSellingModal: function() {
    this.setData({ showSellingModal: false })
  },
  onSellingInput: function(e) {
    this.setData({ currentSellingText: e.detail.value })
  },
  switchSellingMode: function(e) {
    this.setData({ sellingMode: e.currentTarget.dataset.mode })
  },
  chooseSellingImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        var ext = filePath.split('.').pop() || 'jpg'
        var cloudPath = 'merchant/' + Date.now() + '.' + ext
        wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
          .then(function(uploadRes) {
            wx.hideLoading()
            self.setData({ currentSellingImage: uploadRes.fileID })
          })
          .catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          })
      }
    })
  },
  onSellingImageInput: function(e) {
    this.setData({ currentSellingImage: e.detail.value })
  },
  removeSellingImage: function() {
    this.setData({ currentSellingImage: '' })
  },
  previewSellingImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ current: src, urls: [src] })
  },
  saveSelling: function() {
    var self = this
    if (self.data.sellingSubmitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ sellingSubmitting: true })
    var text = self.data.currentSellingText.trim()
    var image = self.data.currentSellingImage.trim()
    var mode = self.data.sellingMode
    var parsed = text ? self.parseItems(text) : []
    if (parsed.length > 8) {
      parsed = parsed.slice(0, 8)
      wx.showToast({ title: '最多8件，已截取前8件', icon: 'none' })
    }
    var data = {
      sellingMode: mode,
      currentSelling: text,
      currentSellingImage: image,
      updateTime: db.serverDate()
    }
    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({ data: data })
    }
    updateOrAdd().catch(function() {
      data._id = 'merchant'
      data.useCustom = false
      data.customTitle = ''
      data.customDesc = ''
      data.customItems = ''
      data.maintenance = false
      return db.collection('page_config').add({ data: data })
    }).then(function() {
      self.setData({ sellingSubmitting: false, showSellingModal: false, currentSelling: parsed, currentSellingText: text, currentSellingImage: image, sellingMode: mode })
      wx.showToast({ title: '保存成功', icon: 'success' })
      var itemNames = parsed.map(function(i) { return i.name })
      var notifyContent = mode === 'image' ? '在售商品图片已更新' : (parsed.length > 0 ? parsed.map(function(i) { return i.name }).join('、').substring(0, 20) : '在售信息已更新')
      notify.pushToSubscribers('merchant', '商人商品更新', notifyContent, '/pages/merchant/merchant', null, itemNames)
    }).catch(function() {
      self.setData({ sellingSubmitting: false })
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },
  deleteSellingItem: function(e) {
    var self = this
    var index = e.currentTarget.dataset.index
    if (!self.data.isAdmin || !db) return
    var items = self.data.currentSelling.slice()
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
    var newNames = {}
    for (var j = 0; j < valid.length; j++) {
      for (var k = 0; k < items.length; k++) {
        if (items[k].name === valid[j].name && items[k].price === valid[j].price) {
          matched.push(items[k])
          newNames[items[k].name] = true
          break
        }
      }
    }
    var updatedItems = items.map(function(item) {
      item._isNew = !!newNames[item.name]
      return item
    })
    self.setData({ newItems: matched, newItemsPage: 0, items: updatedItems })
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
    if (this.newItemsAnimTimer) {
      clearTimeout(this.newItemsAnimTimer)
      this.newItemsAnimTimer = null
    }
  },
  slideNewItems: function() {
    var self = this
    var len = self.data.newItems.length
    if (len < 2) return
    var next = (self.data.newItemsPage + 1) % len
    self.setData({ newItemsAnim: true, newItemsPage: next })
    self.newItemsAnimTimer = setTimeout(function() { self.setData({ newItemsAnim: false }) }, 500)
  },
  checkSubscription: function() {
    var self = this
    if (!db) return
    notify.getSubscriptionStatus(function(err, status) {
      if (err) return
      var itemSubs = status.merchant_item_items || {}
      var count = 0
      for (var k in itemSubs) { if (itemSubs[k]) count++ }
      self.setData({
        subscribedMerchant: status.merchant || false,
        subscribeCount: status.merchantCount || 0,
        itemSubStatus: itemSubs,
        totalItemSubs: count
      })
    })
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
      if (err) return
      if (result.merchant === 'accept') {
        wx.showToast({ title: '已订阅新上架', icon: 'success' })
        self.checkSubscription()
      }
    })
  },
  subscribeItem: function(e) {
    var self = this
    var name = e.currentTarget.dataset.name
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    // 已订阅 → 弹窗取消订阅
    if (self.data.itemSubStatus[name]) {
      wx.showModal({
        title: '取消订阅',
        content: '确定取消「' + name + '」的补货通知？',
        confirmText: '取消订阅',
        confirmColor: '#ff4757',
        success: function(res) {
          if (res.confirm) self._unsubscribeItem(name)
        }
      })
      return
    }
    notify.requestAndSaveItem('merchant_item', name, function(err, result) {
      if (err) return
      if (result.merchant_item === 'accept') {
        wx.showToast({ title: '已订阅: ' + name, icon: 'success' })
        self.checkSubscription()
      }
    })
  },
  _unsubscribeItem: function(name) {
    var self = this
    if (!db) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      db.collection('subscribers').where({ openid: openid, type: 'merchant_item', itemName: name }).get()
        .then(function(subRes) {
          var tasks = []
          for (var i = 0; i < subRes.data.length; i++) {
            tasks.push(db.collection('subscribers').doc(subRes.data[i]._id).remove())
          }
          return Promise.all(tasks)
        })
        .then(function() {
          var itemSubStatus = self.data.itemSubStatus
          itemSubStatus[name] = false
          var count = 0
          for (var k in itemSubStatus) { if (itemSubStatus[k]) count++ }
          self.setData({ itemSubStatus: itemSubStatus, totalItemSubs: count })
          wx.showToast({ title: '已取消订阅: ' + name, icon: 'success' })
        })
        .catch(function() {
          wx.showToast({ title: '操作失败', icon: 'none' })
        })
    })
  },
  openAddItemModal: function() {
    this.setData({
      showAddItemModal: true,
    editingItemIndex: null,
    showBatchModal: false,
    batchEditItem: null,
    batchEditIndex: -1,
    batchSaving: false,
      newItem: {
        name: '',
        price: '',
        effect: '',
        rarity: '普通',
        source: '远行商人',
        image: ''
      }
    })
  },
  editItemCard: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.items[index]
    if (!item) return
    this.setData({
      showAddItemModal: true,
      editingItemIndex: index,
      newItem: {
        name: item.name,
        price: String(item.price),
        effect: item.effect,
        rarity: item.rarity,
        source: item.source || '远行商人',
        image: item.image || ''
      }
    })
  },
  closeAddItemModal: function() {
    this.setData({ showAddItemModal: false, editingItemIndex: null })
  },
  openBatchEdit: function() {
    this.setData({ showBatchModal: true, batchEditItem: null, batchEditIndex: -1 })
  },
  closeBatchModal: function() {
    this.setData({ showBatchModal: false, batchEditItem: null, batchEditIndex: -1 })
  },
  selectBatchItem: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.items[index]
    if (!item) return
    this.setData({
      batchEditItem: { name: item.name, price: String(item.price), effect: item.effect, rarity: item.rarity, source: item.source || '远行商人', image: item.image || '' },
      batchEditIndex: index
    })
  },
  backToBatchList: function() {
    this.setData({ batchEditItem: null, batchEditIndex: -1 })
  },
  onBatchInput: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.detail.value
    this.setData({ ['batchEditItem.' + field]: value })
  },
  onBatchRarityChange: function(e) {
    var index = e.detail.value
    this.setData({ 'batchEditItem.rarity': this.data.rarityOptions[index] })
  },
  chooseBatchImage: function() {
    var self = this
    wx.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        var ext = filePath.split('.').pop() || 'jpg'
        wx.cloud.uploadFile({ cloudPath: 'merchant/' + Date.now() + '.' + ext, filePath: filePath })
          .then(function(r) { wx.hideLoading(); self.setData({ 'batchEditItem.image': r.fileID }) })
          .catch(function() { wx.hideLoading(); wx.showToast({ title: '上传失败', icon: 'none' }) })
      }
    })
  },
  inputBatchImage: function() {
    var self = this
    wx.showModal({ title: '输入图片链接', content: '', editable: true, placeholderText: '粘贴图片URL地址',
      success: function(res) { if (res.confirm && res.content && res.content.trim()) self.setData({ 'batchEditItem.image': res.content.trim() }) }
    })
  },
  removeBatchImage: function() { this.setData({ 'batchEditItem.image': '' }) },
  saveBatchItem: function() {
    var self = this
    if (self.data.batchSaving) return
    var item = self.data.batchEditItem
    var index = self.data.batchEditIndex
    if (!item || index < 0) return
    if (!item.name.trim()) { wx.showToast({ title: '请输入物品名称', icon: 'none' }); return }
    if (!item.price || isNaN(parseInt(item.price))) { wx.showToast({ title: '请输入有效价格', icon: 'none' }); return }
    self.setData({ batchSaving: true })
    var items = self.data.items.slice()
    items[index] = {
      id: items[index].id,
      name: item.name.trim(),
      price: parseInt(item.price),
      effect: (item.effect || '').trim(),
      rarity: item.rarity,
      source: (item.source || '远行商人').trim(),
      image: (item.image || '').trim()
    }
    var customItemsText = items.map(function(i) {
      return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source + (i.image ? '|' + i.image : '')
    }).join('\n')
    db.collection('page_config').doc('merchant').update({
      data: { customItems: customItemsText, updateTime: db.serverDate() }
    }).then(function() {
      self.setData({ batchSaving: false, batchEditItem: null, batchEditIndex: -1, items: items, customItems: customItemsText })
      wx.showToast({ title: '已保存', icon: 'success' })
    }).catch(function() {
      self.setData({ batchSaving: false })
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },
  chooseItemImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        var ext = filePath.split('.').pop() || 'jpg'
        var cloudPath = 'merchant/' + Date.now() + '.' + ext
        wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
          .then(function(uploadRes) {
            wx.hideLoading()
            self.setData({ 'newItem.image': uploadRes.fileID })
          })
          .catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          })
      }
    })
  },
  inputItemImage: function() {
    var self = this
    wx.showModal({
      title: '输入图片链接',
      content: '',
      editable: true,
      placeholderText: '粘贴图片URL地址',
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          self.setData({ 'newItem.image': res.content.trim() })
        }
      }
    })
  },
  removeItemImage: function() {
    this.setData({ 'newItem.image': '' })
  },
  previewItemImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src] })
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

    var editIndex = self.data.editingItemIndex
    if (editIndex !== null) {
      var items = self.data.items.slice()
      items[editIndex] = {
        id: items[editIndex].id,
        name: item.name.trim(),
        price: parseInt(item.price),
        effect: item.effect.trim(),
        rarity: item.rarity,
        source: item.source.trim() || '远行商人',
        image: item.image.trim() || ''
      }
      var customItemsText = items.map(function(i) {
        return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source + (i.image ? '|' + i.image : '')
      }).join('\n')
      db.collection('page_config').doc('merchant').update({
        data: { customItems: customItemsText, updateTime: db.serverDate() }
      }).then(function() {
        self.setData({ addingItem: false, showAddItemModal: false, editingItemIndex: null, items: items, customItems: customItemsText })
        wx.showToast({ title: '已更新', icon: 'success' })
      }).catch(function() {
        self.setData({ addingItem: false })
        wx.showToast({ title: '更新失败', icon: 'none' })
      })
      return
    }

    var newItemData = {
      id: Date.now(),
      name: item.name.trim(),
      price: parseInt(item.price),
      effect: item.effect.trim(),
      rarity: item.rarity,
      source: item.source.trim() || '远行商人',
      image: item.image.trim() || ''
    }
    var currentItems = self.data.items || []
    currentItems.unshift(newItemData)
    var customItemsText = currentItems.map(function(i) {
      return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source + (i.image ? '|' + i.image : '')
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
    editingItemIndex: null,
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
        notify.pushToSubscribers('merchant', newItemData.name, newItemData.name + ' · ' + newItemData.price + '洛克贝', '/pages/merchant/merchant', newItemData.name)
      })
      .catch(function() {
        self.setData({ addingItem: false })
        wx.showToast({ title: '添加失败', icon: 'none' })
      })
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
          var items = self.data.items.slice()
          var deleted = items[index]
          items.splice(index, 1)
          var customItemsText = items.map(function(i) {
            return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source + (i.image ? '|' + i.image : '')
          }).join('\n')
          var selling = self.data.currentSelling || []
          var sellingChanged = false
          for (var i = selling.length - 1; i >= 0; i--) {
            if (selling[i].name === deleted.name && selling[i].price === deleted.price) {
              selling.splice(i, 1)
              sellingChanged = true
            }
          }
          var sellingText = selling.map(function(i) {
            return i.name + '|' + i.price + '|' + i.effect + '|' + i.rarity + '|' + i.source
          }).join('\n')
          var updateData = { customItems: customItemsText, updateTime: db.serverDate() }
          if (sellingChanged) updateData.currentSelling = sellingText
          db.collection('page_config').doc('merchant').update({
            data: updateData
          }).then(function() {
            self.setData({ items: items, customItems: customItemsText, currentSelling: selling, currentSellingText: sellingText })
            wx.showToast({ title: '已删除', icon: 'success' })
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },
  onShareAppMessage: function() {
    return { title: '洛手助手 - 远行商人', path: '/pages/merchant/merchant', imageUrl: '/images/banner1.png' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 远行商人今日售卖物品及价格', imageUrl: '/images/banner1.png' }
  }
})
