var app = getApp()
var i18n = require('../../utils/i18n')

var initialItems = [
  { id: 1, name: '棱镜球', price: 3200000, effect: '100%捕捉成功，必定随机炫彩外观，完美无瑕，顶级稀有精灵捕捉道具', rarity: '传说', source: '炼金台合成/活动奖励/商城购买/远行商人', image: '', limitCount: '' },
  { id: 2, name: '国王球', price: 160000, effect: '100%捕捉成功，无视目标等级，性格随机，必定为了不起的天分', rarity: '传说', source: '远行商人/炼金台合成/月卡', image: '', limitCount: '' },
  { id: 3, name: '美妙球', price: 3000, effect: '更适合捕捉萌系、普通系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 4, name: '调温球', price: 3000, effect: '更适合捕捉火系、冰系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 5, name: '变幻球', price: 3000, effect: '更适合捕捉幻系、机械系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 6, name: '光合球', price: 3000, effect: '更适合捕捉草系、光系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 7, name: '淘沙球', price: 3000, effect: '更适合捕捉地系、虫系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 8, name: '好战球', price: 3000, effect: '更适合捕捉武系、龙系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 9, name: '网兜球', price: 3000, effect: '更适合捕捉水系、翼系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 10, name: '绝缘球', price: 3000, effect: '更适合捕捉电系、毒系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 11, name: '暗星球', price: 3000, effect: '更适合捕捉幽系、恶系精灵，捕捉其他属性概率会降低', rarity: '稀有', source: '炼金造物合成/远行商人', image: '', limitCount: '' },
  { id: 12, name: '首领血脉秘药', price: 320000, effect: '精灵突破升星、提升资质，为精灵解锁首领血脉，毕业级血脉道具', rarity: '传说', source: '远行商人/放生首领精灵', image: '', limitCount: '' },
  { id: 13, name: '地系血脉秘药', price: 160000, effect: '将精灵血脉改为地系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉地系精灵', image: '', limitCount: '' },
  { id: 14, name: '火系血脉秘药', price: 160000, effect: '将精灵血脉改为火系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉火系精灵', image: '', limitCount: '' },
  { id: 15, name: '水系血脉秘药', price: 160000, effect: '将精灵血脉改为水系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉水系精灵', image: '', limitCount: '' },
  { id: 16, name: '草系血脉秘药', price: 160000, effect: '将精灵血脉改为草系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉草系精灵', image: '', limitCount: '' },
  { id: 17, name: '冰系血脉秘药', price: 160000, effect: '将精灵血脉改为冰系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉冰系精灵', image: '', limitCount: '' },
  { id: 18, name: '翼系血脉秘药', price: 160000, effect: '将精灵血脉改为翼系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉翼系精灵', image: '', limitCount: '' },
  { id: 19, name: '机械系血脉秘药', price: 160000, effect: '将精灵血脉改为机械系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉机械系精灵', image: '', limitCount: '' },
  { id: 20, name: '萌系血脉秘药', price: 160000, effect: '将精灵血脉改为萌系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉萌系精灵', image: '', limitCount: '' },
  { id: 21, name: '奇异血脉秘药', price: 160000, effect: '随机改变精灵血脉属性，为精灵解锁奇异血脉', rarity: '传说', source: '远行商人/捕捉任意属性精灵', image: '', limitCount: '' },
  { id: 22, name: '普通系血脉秘药', price: 160000, effect: '将精灵血脉改为普通系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉普通系精灵', image: '', limitCount: '' },
  { id: 23, name: '光系血脉秘药', price: 160000, effect: '将精灵血脉改为光系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉光系精灵', image: '', limitCount: '' },
  { id: 24, name: '恶系血脉秘药', price: 160000, effect: '将精灵血脉改为恶系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉恶系精灵', image: '', limitCount: '' },
  { id: 25, name: '幽系血脉秘药', price: 160000, effect: '将精灵血脉改为幽系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉幽系精灵', image: '', limitCount: '' },
  { id: 26, name: '龙系血脉秘药', price: 160000, effect: '将精灵血脉改为龙系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉龙系精灵', image: '', limitCount: '' },
  { id: 27, name: '电系血脉秘药', price: 160000, effect: '将精灵血脉改为电系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉电系精灵', image: '', limitCount: '' },
  { id: 28, name: '毒系血脉秘药', price: 160000, effect: '将精灵血脉改为毒系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉毒系精灵', image: '', limitCount: '' },
  { id: 29, name: '虫系血脉秘药', price: 160000, effect: '将精灵血脉改为虫系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉虫系精灵', image: '', limitCount: '' },
  { id: 30, name: '武系血脉秘药', price: 160000, effect: '将精灵血脉改为武系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉武系精灵', image: '', limitCount: '' },
  { id: 31, name: '翼系血脉秘药', price: 160000, effect: '将精灵血脉改为翼系，改变精灵属性适配', rarity: '传说', source: '远行商人/捕捉翼系精灵', image: '', limitCount: '' },
  { id: 32, name: '残缺魔镜', price: 480000, effect: '锁定炫彩异色，稀有精灵捕捉辅助道具，大幅提升异色精灵获取效率', rarity: '传说', source: '远行商人（周末限时）/炼金台', image: '', limitCount: '' },
  { id: 33, name: '适格钥匙', price: 320000, effect: '精灵养成核心道具，用于精灵进阶突破', rarity: '传说', source: '远行商人（周末限时）/炼金台', image: '', limitCount: '' },
  { id: 34, name: '能力钥匙', price: 160000, effect: '精灵养成核心道具，用于解锁精灵潜能', rarity: '传说', source: '远行商人（周末限时）/炼金台', image: '', limitCount: '' },
  { id: 35, name: '祝福项坠', price: 800000, effect: '将极品精灵的性格、特长、个体资质完整复制到同种类普通精灵蛋上，一键批量造极品', rarity: '史诗', source: '远行商人（限时刷新）', image: '', limitCount: '' },
  { id: 36, name: '炫彩蛋', price: 1600000, effect: '孵化必出了不起天分+炫彩外观，赛季收藏与战力双提升', rarity: '传说', source: '远行商人', image: '', limitCount: '' },
  { id: 37, name: '神奇的蛋', price: 36000, effect: '随机开出精灵蛋，盲盒玩法，小概率出炫彩精灵', rarity: '史诗', source: '远行商人', image: '', limitCount: '' },
  { id: 38, name: '无花果', price: 3000, effect: '为精灵提供经验值的基础果实，快速提升精灵等级', rarity: '稀有', source: '远行商人/任务奖励', image: '', limitCount: '' },
  { id: 39, name: '魔力果', price: 6000, effect: '为精灵提供大量经验值的常见果实，献祭低等精灵可获得', rarity: '稀有', source: '远行商人/任务奖励/活动奖励', image: '', limitCount: '' },
  { id: 40, name: '黑晶琉璃', price: 1000, effect: '稀有矿石材料，可用于合成高级道具和装备升级', rarity: '稀有', source: '采集/远行商人', image: '', limitCount: '' },
  { id: 41, name: '黄石榴石', price: 1000, effect: '稀有矿石材料，可用于合成高级道具和装备升级', rarity: '稀有', source: '采集/远行商人', image: '', limitCount: '' },
  { id: 42, name: '蓝晶碧玺', price: 1000, effect: '稀有矿石材料，可用于合成高级道具和装备升级', rarity: '稀有', source: '采集/远行商人', image: '', limitCount: '' },
  { id: 43, name: '紫莲刚玉', price: 1000, effect: '稀有矿石材料，可用于合成高级道具和装备升级', rarity: '稀有', source: '采集/远行商人', image: '', limitCount: '' },
  { id: 44, name: '龙系粉尘', price: 500, effect: '龙系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 45, name: '萌系粉尘', price: 500, effect: '萌系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 46, name: '草系粉尘', price: 500, effect: '草系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 47, name: '机械粉尘', price: 500, effect: '机械系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 48, name: '火系粉尘', price: 500, effect: '火系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 49, name: '水系粉尘', price: 500, effect: '水系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 50, name: '普通系粉尘', price: 500, effect: '普通系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 51, name: '光系粉尘', price: 500, effect: '光系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 52, name: '恶系粉尘', price: 500, effect: '恶系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 53, name: '幽系粉尘', price: 500, effect: '幽系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 54, name: '龙系粉尘', price: 500, effect: '龙系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 55, name: '电系粉尘', price: 500, effect: '电系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 56, name: '毒系粉尘', price: 500, effect: '毒系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 57, name: '虫系粉尘', price: 500, effect: '虫系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 58, name: '武系粉尘', price: 500, effect: '武系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 59, name: '翼系粉尘', price: 500, effect: '翼系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 60, name: '地系粉尘', price: 500, effect: '地系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' },
  { id: 61, name: '幻系粉尘', price: 500, effect: '幻系精灵培养材料，用于合成技能石和精灵突破', rarity: '普通', source: '炼金转化获得/对应系别精灵掉落', image: '', limitCount: '' }
]

var cloudUrl = require('../../utils/cloudUrl')
var notify = require('../../utils/notify')
var db = null

function serializeItem(item) {
  return item.name + '|' + item.price + '|' + item.effect + '|' + item.rarity + '|' + item.source + '|' + (item.image || '') + '|' + (item.limitCount || '')
}

function serializeItems(items) {
  return items.map(serializeItem).join('\n')
}

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
    showAddSellingItemModal: false,
    addingSellingItem: false,
    itemSubStatus: {},
    todayDate: '',
    offlineDate: '',
    offlineTimeStr: '23:59',
    offlineTime: null,
    limitCount: '',
    showCountdown: true,
    timeSlots: ['08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'],
    timeSlotIndex: -1,
    remainingTimeStr: '',
    remoteSelling: [],
    remoteRound: null,
    remoteCategories: []
  },
  newItemsTimer: null,
  countdownTimer: null,
  fetchRemoteMerchant: function() {
    var self = this
    wx.request({
      url: 'https://silverwing.elysia.beauty/api/v1/games/rocom/merchant/info',
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200 && res.data) {
          self.processRemoteData(res.data)
        }
      },
      fail: function() {}
    })
  },
  processRemoteData: function(payload) {
    var self = this
    var activities = payload.merchantActivities || payload.merchant_activities || []
    var activity = activities[0] || {}
    var props = activity.get_props || []
    var extraProps = activity.get_extra_props || []
    var pets = activity.get_pets || []
    
    var products = []
    var now = Date.now()
    
    var collect = function(items, kind) {
      for (var i = 0; i < items.length; i++) {
        var it = items[i]
        var start = Number(it.start_time)
        var end = Number(it.end_time)
        if (start > 0 && end > 0 && (now < start || now >= end)) continue
        
        var category = 'round'
        var durationHours = (end - start) / (1000 * 60 * 60)
        if (durationHours / 24 >= 2) {
          category = 'weekend'
        } else {
          // 检查是否覆盖全天
          var startDate = new Date(start)
          var startH = startDate.getHours()
          var endDate = new Date(end)
          var endH = endDate.getHours()
          if (startH <= 8 && endH >= 23) {
            category = 'normal'
          }
        }
        
        products.push({
          name: it.name,
          image: it.icon_url,
          category: category,
          start: start,
          end: end,
          timeLabel: self.formatTimeLabel(start, end)
        })
      }
    }
    
    collect(props, 'prop')
    collect(extraProps, 'extra_prop')
    collect(pets, 'pet')
    
    var categories = [
      { key: 'normal', label: '热销商品', products: [] },
      { key: 'round', label: '常规商品', products: [] },
      { key: 'weekend', label: '周末限定', products: [] }
    ]
    
    for (var j = 0; j < products.length; j++) {
      var p = products[j]
      var group = categories.find(function(c) { return c.key === p.category })
      if (group) group.products.push(p)
    }
    
    self.setData({
      remoteSelling: products,
      remoteCategories: categories.filter(function(c) { return c.products.length > 0 }),
      remoteRound: self.calculateRemoteRound()
    })
  },
  formatTimeLabel: function(start, end) {
    if (!start || !end) return '全天'
    var s = new Date(start)
    var e = new Date(end)
    var pad = function(n) { return n < 10 ? '0' + n : n }
    return pad(s.getMonth() + 1) + '-' + pad(s.getDate()) + ' ' + pad(s.getHours()) + ':' + pad(s.getMinutes()) + ' - ' + pad(e.getHours()) + ':' + pad(e.getMinutes())
  },
  calculateRemoteRound: function() {
    var now = new Date()
    var hours = now.getHours()
    var minutes = now.getMinutes()
    var seconds = now.getSeconds()
    var secondsOfDay = hours * 3600 + minutes * 60 + seconds
    
    var marketStart = 8 * 3600
    var marketEnd = 24 * 3600
    
    if (secondsOfDay < marketStart || secondsOfDay >= marketEnd) {
      return { is_open: false, countdown: '未开市' }
    }
    
    var roundWindow = 4 * 3600
    var elapsed = secondsOfDay - marketStart
    var roundIndex = Math.floor(elapsed / roundWindow) + 1
    var roundEndSeconds = marketStart + roundIndex * roundWindow
    
    var diff = roundEndSeconds - secondsOfDay
    var h = Math.floor(diff / 3600)
    var m = Math.floor((diff % 3600) / 60)
    var countdown = (h > 0 ? h + '小时' : '') + m + '分钟'
    
    return {
      is_open: true,
      current: roundIndex,
      total: 4,
      countdown: countdown
    }
  },
  markNewItems: function() {
    var self = this
    if (typeof wx.getStorageSync !== 'function') return
    var recent = wx.getStorageSync('merchant_new_items') || []
    var now = Date.now()
    var valid = []
    for (var i = 0; i < recent.length; i++) {
      if (now - recent[i].addTime < 86400000) valid.push(recent[i])
    }
    if (valid.length !== recent.length) wx.setStorageSync('merchant_new_items', valid)
    var items = self.data.items || []
    var newNames = {}
    for (var j = 0; j < valid.length; j++) {
      newNames[valid[j].name] = true
    }
    var updatedItems = items.map(function(item) {
      item._isNew = !!newNames[item.name]
      return item
    })
    self.setData({ items: updatedItems })
  },
  startNewItemsTimer: function() {
    var self = this
    self.stopNewItemsTimer()
    self.newItemsTimer = setInterval(function() {
      if (typeof self.markNewItems === 'function') self.markNewItems()
    }, 60000)
  },
  stopNewItemsTimer: function() {
    if (this.newItemsTimer) {
      clearInterval(this.newItemsTimer)
      this.newItemsTimer = null
    }
  },
  onShow: function() {
    var self = this
    this.setData({ t: i18n.i18n[i18n.getLanguage()] || i18n.i18n['zh'] })
    if (wx.cloud) db = wx.cloud.database()
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, merchant: true }
    this.setData({ subscribeConfig: subscribeConfig })
    this.checkAdmin()
    this.loadConfig()
    this.checkSubscription()
    this.fetchRemoteMerchant()
    if (typeof this.markNewItems === 'function') this.markNewItems()
    if (typeof this.startNewItemsTimer === 'function') this.startNewItemsTimer()
    this.startCountdownTimer()
    
    var today = new Date()
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var dStr = today.getDate()
    var todayDate = y + '-' + (m < 10 ? '0' + m : m) + '-' + (dStr < 10 ? '0' + dStr : dStr)
    this.setData({ todayDate: todayDate })
  },
  onHide: function() {
    this.stopNewItemsTimer()
    this.stopCountdownTimer()
  },
  onUnload: function() {
    this.stopNewItemsTimer()
    this.stopCountdownTimer()
  },
  startCountdownTimer: function() {
    var self = this
    self.stopCountdownTimer()
    if (!self.data.offlineTime) return
    self.updateCountdown()
    self.countdownTimer = setInterval(function() {
      self.updateCountdown()
    }, 1000)
  },
  stopCountdownTimer: function() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  },
  updateCountdown: function() {
    var self = this
    var offlineTime = self.data.offlineTime
    if (!offlineTime) {
      if (self.data.remainingTimeStr) self.setData({ remainingTimeStr: '' })
      return
    }
    var now = Date.now()
    var diff = offlineTime - now
    if (diff <= 0) {
      self.setData({ remainingTimeStr: '已下架', currentSelling: [], currentSellingText: '' })
      self.stopCountdownTimer()
      self.loadConfig()
      return
    }
    var totalSeconds = Math.floor(diff / 1000)
    var hours = Math.floor(totalSeconds / 3600)
    var minutes = Math.floor((totalSeconds % 3600) / 60)
    var seconds = totalSeconds % 60
    var str = ''
    if (hours > 0) str += hours + '小时'
    str += (minutes < 10 ? '0' + minutes : minutes) + '分' + (seconds < 10 ? '0' + seconds : seconds) + '秒'
    self.setData({ remainingTimeStr: str })
  },
  checkAdmin: function() {
    var self = this
    if (!db) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            if (userRes.data.length > 0) {
              self.setData({ isAdmin: true })
            }
          })
      })
      .catch(function() {})
  },
  loadConfig: function() {
    var self = this
    if (!db) { self.setData({ items: initialItems }); return }
    db.collection('page_config').doc('merchant').get()
      .then(function(res) {
        var d = res.data
        var now = Date.now()
        var currentSelling = d.currentSelling ? self.parseItems(d.currentSelling) : []
        var currentSellingText = d.currentSelling || ''
        var currentSellingImage = d.currentSellingImage || ''
        if (d.offlineTime && now >= d.offlineTime) {
          currentSelling = []
          currentSellingText = ''
          currentSellingImage = ''
          d.offlineDate = ''
          d.offlineTimeStr = '23:59'
          d.offlineTime = null
        }
        var ends = ['12:00', '16:00', '20:00', '23:59']
        var tsi = -1
        if (d.offlineDate) {
          tsi = ends.indexOf(d.offlineTimeStr || '23:59')
          if (tsi === -1) tsi = 3
        }

        var items = (d.useCustom && d.customItems) ? self.parseItems(d.customItems) : initialItems

        cloudUrl.convertList(items, 'image', function(convertedItems) {
          cloudUrl.convertList(currentSelling, 'image', function(convertedSelling) {
            self.setData({
              maintenance: d.maintenance || false,
              merchantAway: d.merchantAway || false,
              useCustom: d.useCustom || false,
              customTitle: d.customTitle || '',
              customDesc: d.customDesc || '',
              customItems: d.customItems || '',
              items: convertedItems,
              currentSelling: convertedSelling,
              currentSellingText: currentSellingText,
              currentSellingImage: currentSellingImage,
              sellingMode: 'text',
              offlineDate: d.offlineDate || '',
              offlineTimeStr: d.offlineTimeStr || '23:59',
              offlineTime: d.offlineTime || null,
              timeSlotIndex: tsi,
              showCountdown: d.showCountdown !== undefined ? d.showCountdown : true
            })
            self.markNewItems()
          })
        })
      })
      .catch(function() {
        self.setData({ items: initialItems })
        self.markNewItems()
      })
  },
  toggleCountdown: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.showCountdown
    db.collection('page_config').doc('merchant').update({
      data: { showCountdown: newVal, updateTime: db.serverDate() }
    }).then(function() {
      self.setData({ showCountdown: newVal })
      if (newVal) {
        if (self.data.offlineTime) {
          self.startCountdownTimer()
          wx.showToast({ title: '倒计时已开启', icon: 'success' })
        } else {
          wx.showToast({ title: '倒计时已开启，请先设置下架时间', icon: 'none' })
        }
      } else {
        self.stopCountdownTimer()
        self.setData({ remainingTimeStr: '' })
        wx.showToast({ title: '倒计时已隐藏', icon: 'success' })
      }
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
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
          source: (parts.length > 4) ? parts[4].trim() : '远行商人',
          image: (parts.length > 5) ? parts[5].trim() : undefined,
          limitCount: (parts.length > 6) ? parts[6].trim() : undefined
        })
      }
    }
    return items
  },
  toggleMaintenance: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.maintenance
    db.collection('page_config').doc('merchant').update({
      data: { maintenance: newVal, updateTime: db.serverDate() }
    }).catch(function(err) {
      if (err.errCode === -1 || err.message.indexOf('not exist') !== -1) {
        return db.collection('page_config').add({
          data: { _id: 'merchant', maintenance: newVal, useCustom: false, customTitle: '', customDesc: '', customItems: '', updateTime: db.serverDate() }
        })
      }
      throw err
    }).then(function() {
      self.setData({ maintenance: newVal })
      wx.showToast({ title: newVal ? '已下线' : '已上线', icon: 'success' })
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },
  toggleMerchantAway: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.merchantAway
    db.collection('page_config').doc('merchant').update({
      data: { merchantAway: newVal, updateTime: db.serverDate() }
    }).catch(function(err) {
      if (err.errCode === -1 || err.message.indexOf('not exist') !== -1) {
        return db.collection('page_config').add({
          data: { _id: 'merchant', merchantAway: newVal, useCustom: false, customTitle: '', customDesc: '', customItems: '', updateTime: db.serverDate() }
        })
      }
      throw err
    }).then(function() {
      self.setData({ merchantAway: newVal })
      wx.showToast({ title: newVal ? '已开启出差提示' : '已关闭出差提示', icon: 'success' })
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
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
        // var pushLabel = self.data.editingField === 'customTitle' ? '标题' : self.data.editingField === 'customDesc' ? '描述' : '数据'
        // notify.pushToSubscribers('merchant', '商人信息更新', value.substring(0, 20), '/pages/merchant/merchant')
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
    var text = serializeItems(updated)

    var now = Date.now()
    var updateData = { currentSelling: text, updateTime: db.serverDate() }
    
    if (self.data.offlineTime && now >= self.data.offlineTime) {
      updateData.offlineTime = null
      updateData.offlineDate = ''
      updateData.offlineTimeStr = '23:59'
    }

    db.collection('page_config').doc('merchant').update({
      data: updateData
    }).then(function() {
      var nextState = { currentSelling: updated, currentSellingText: text, showAddSellingItemModal: false }
      if (updateData.offlineTime === null) {
        nextState.offlineTime = null
        nextState.offlineDate = ''
        nextState.offlineTimeStr = '23:59'
        nextState.timeSlotIndex = -1
        nextState.remainingTimeStr = ''
      }
      self.setData(nextState)
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
  saveSelling: function() {
    var self = this
    if (self.data.sellingSubmitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ sellingSubmitting: true })
    var text = self.data.currentSellingText.trim()
    var mode = 'text'
    var parsed = text ? self.parseItems(text) : []
    if (parsed.length > 8) {
      parsed = parsed.slice(0, 8)
      wx.showToast({ title: '最多8件，已截取前8件', icon: 'none' })
    }
    
    // 自动回写图片到商品库 items
    var itemsChanged = false
    var updatedItems = self.data.items.slice()
    for (var i = 0; i < parsed.length; i++) {
      var sellingItem = parsed[i]
      for (var j = 0; j < updatedItems.length; j++) {
        if (updatedItems[j].name === sellingItem.name && updatedItems[j].price === sellingItem.price) {
          if (sellingItem.image !== undefined && updatedItems[j].image !== sellingItem.image) {
            updatedItems[j].image = sellingItem.image || ''
            itemsChanged = true
          }
        }
      }
    }
    
    var customItemsText = self.data.customItems || ''
    if (itemsChanged) {
      customItemsText = serializeItems(updatedItems)
    }
    
    var offlineTime = null
    if (self.data.offlineDate) {
      var timeStr = self.data.offlineTimeStr || '23:59'
      var dateStr = self.data.offlineDate.replace(/-/g, '/')
      offlineTime = new Date(dateStr + ' ' + timeStr + ':00').getTime()
    }
    
    var data = {
      sellingMode: mode,
      currentSelling: text,
      offlineDate: self.data.offlineDate || '',
      offlineTimeStr: self.data.offlineTimeStr || '23:59',
      offlineTime: offlineTime,
      updateTime: db.serverDate()
    }
    if (itemsChanged) {
      data.customItems = customItemsText
      data.useCustom = true
    }
    
    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({ data: data })
    }
    updateOrAdd().catch(function(err) {
      if (err.errCode === -1 || err.message.indexOf('not exist') !== -1) {
        data._id = 'merchant'
        data.useCustom = itemsChanged ? true : self.data.useCustom
        data.customTitle = self.data.customTitle || ''
        data.customDesc = self.data.customDesc || ''
        data.customItems = customItemsText
        data.maintenance = self.data.maintenance || false
        return db.collection('page_config').add({ data: data })
      }
      throw err
    }).then(function() {
      var nextState = {
        sellingSubmitting: false,
        showSellingModal: false,
        currentSelling: parsed,
        currentSellingText: text,
        sellingMode: mode,
        offlineDate: self.data.offlineDate || '',
        offlineTimeStr: self.data.offlineTimeStr || '23:59',
        offlineTime: offlineTime,
        timeSlotIndex: self.data.timeSlotIndex,
        limitCount: self.data.limitCount || ''
      }
      if (itemsChanged) {
        nextState.items = updatedItems
        nextState.customItems = customItemsText
        nextState.useCustom = true
      }
      self.setData(nextState)
      self.markNewItems()
      wx.showToast({ title: '上架成功', icon: 'success' })
      var itemNames = parsed.map(function(i) { return i.name })
      var notifyContent = (parsed.length > 0 ? parsed.map(function(i) { return i.name }).join('、').substring(0, 20) : '在售信息已更新')
      notify.pushToSubscribers('merchant', '商人商品更新', notifyContent, '/pages/merchant/merchant', null, itemNames)
    }).catch(function() {
      self.setData({ sellingSubmitting: false })
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },
  updateSellingSilent: function() {
    var self = this
    if (self.data.sellingSubmitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ sellingSubmitting: true })
    var text = self.data.currentSellingText.trim()
    var parsed = text ? self.parseItems(text) : []
    if (parsed.length > 8) {
      parsed = parsed.slice(0, 8)
      wx.showToast({ title: '最多8件，已截取前8件', icon: 'none' })
    }

    var itemsChanged = false
    var updatedItems = self.data.items.slice()
    for (var i = 0; i < parsed.length; i++) {
      var sellingItem = parsed[i]
      for (var j = 0; j < updatedItems.length; j++) {
        if (updatedItems[j].name === sellingItem.name && updatedItems[j].price === sellingItem.price) {
          if (sellingItem.image !== undefined && updatedItems[j].image !== sellingItem.image) {
            updatedItems[j].image = sellingItem.image || ''
            itemsChanged = true
          }
        }
      }
    }

    var customItemsText = self.data.customItems || ''
    if (itemsChanged) {
      customItemsText = serializeItems(updatedItems)
    }

    var offlineTime = null
    if (self.data.offlineDate) {
      var timeStr = self.data.offlineTimeStr || '23:59'
      var dateStr = self.data.offlineDate.replace(/-/g, '/')
      offlineTime = new Date(dateStr + ' ' + timeStr + ':00').getTime()
    }

    var data = {
      sellingMode: 'text',
      currentSelling: text,
      offlineDate: self.data.offlineDate || '',
      offlineTimeStr: self.data.offlineTimeStr || '23:59',
      offlineTime: offlineTime,
      updateTime: db.serverDate()
    }
    if (itemsChanged) {
      data.customItems = customItemsText
      data.useCustom = true
    }

    var updateOrAdd = function() {
      return db.collection('page_config').doc('merchant').update({ data: data })
    }
    updateOrAdd().catch(function(err) {
      if (err.errCode === -1 || err.message.indexOf('not exist') !== -1) {
        data._id = 'merchant'
        data.useCustom = itemsChanged ? true : self.data.useCustom
        data.customTitle = self.data.customTitle || ''
        data.customDesc = self.data.customDesc || ''
        data.customItems = customItemsText
        data.maintenance = self.data.maintenance || false
        return db.collection('page_config').add({ data: data })
      }
      throw err
    }).then(function() {
      var nextState = {
        sellingSubmitting: false,
        showSellingModal: false,
        currentSelling: parsed,
        currentSellingText: text,
        sellingMode: 'text',
        offlineDate: self.data.offlineDate || '',
        offlineTimeStr: self.data.offlineTimeStr || '23:59',
        offlineTime: offlineTime,
        timeSlotIndex: self.data.timeSlotIndex,
        limitCount: self.data.limitCount || ''
      }
      if (itemsChanged) {
        nextState.items = updatedItems
        nextState.customItems = customItemsText
        nextState.useCustom = true
      }
      self.setData(nextState)
      self.markNewItems()
      wx.showToast({ title: '已更新，未推送通知', icon: 'success' })
    }).catch(function() {
      self.setData({ sellingSubmitting: false })
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },
  onOfflineDateChange: function(e) {
    this.setData({ offlineDate: e.detail.value })
  },
  onTimeSlotChange: function(e) {
    var index = parseInt(e.detail.value)
    var ends = ['12:00', '16:00', '20:00', '23:59']
    this.setData({ 
      timeSlotIndex: index,
      offlineTimeStr: ends[index]
    })
  },
  onLimitCountInput: function(e) {
    this.setData({ limitCount: e.detail.value })
  },
  clearOfflineDate: function() {
    this.setData({ offlineDate: '', offlineTimeStr: '23:59', timeSlotIndex: -1 })
  },
  onSellingItemImageUrlInput: function(e) {
    var index = e.currentTarget.dataset.index
    var val = e.detail.value !== undefined ? e.detail.value : (e.currentTarget.dataset.value || '')
    var currentSelling = this.data.currentSelling.slice()
    if (currentSelling[index]) {
      currentSelling[index].image = val
      var text = serializeItems(currentSelling)
      this.setData({ currentSelling: currentSelling, currentSellingText: text })
    }
  },
  onSellingItemLimitInput: function(e) {
    var index = e.currentTarget.dataset.index
    var val = e.detail.value
    var currentSelling = this.data.currentSelling.slice()
    if (currentSelling[index]) {
      currentSelling[index].limitCount = val
      var text = serializeItems(currentSelling)
      this.setData({ currentSelling: currentSelling, currentSellingText: text })
    }
  },
  chooseSellingItemImage: function(e) {
    var self = this
    var index = e.currentTarget.dataset.index
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
            var currentSelling = self.data.currentSelling.slice()
            if (currentSelling[index]) {
              currentSelling[index].image = uploadRes.fileID
              var text = serializeItems(currentSelling)
              self.setData({ currentSelling: currentSelling, currentSellingText: text })
            }
          })
          .catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          })
      }
    })
  },
  removeSellingItemFromEdit: function(e) {
    var index = e.currentTarget.dataset.index
    var currentSelling = this.data.currentSelling.slice()
    currentSelling.splice(index, 1)
    var text = serializeItems(currentSelling)
    this.setData({ currentSelling: currentSelling, currentSellingText: text })
  },
  previewSellingItemImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src] })
  },
  deleteSellingItem: function(e) {
    var self = this
    var index = e.currentTarget.dataset.index
    if (!self.data.isAdmin || !db) return
    var items = self.data.currentSelling.slice()
    items.splice(index, 1)
    var text = serializeItems(items)
    db.collection('page_config').doc('merchant').update({
      data: { currentSelling: text, updateTime: db.serverDate() }
    }).then(function() {
      self.setData({ currentSelling: items, currentSellingText: text })
      wx.showToast({ title: '已移除', icon: 'success' })
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
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
      if (!openid) { wx.showToast({ title: '获取用户信息失败', icon: 'none' }); return }
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
  restoreInitialItems: function() {
    var self = this
    if (!self.data.isAdmin || !db) return
    wx.showModal({
      title: '恢复初始商品',
      content: '确定要导入基础商品吗？这不会删除您现有的自定义商品，只会将缺失的基础商品追加到库中。',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '导入中...' })
          var currentItems = self.data.items.slice()
          var added = 0
          initialItems.forEach(function(initItem) {
            var exists = currentItems.some(function(ci) { return ci.name === initItem.name })
            if (!exists) {
              currentItems.push(initItem)
              added++
            }
          })
          if (added === 0) {
            wx.hideLoading()
            wx.showToast({ title: '没有缺失的基础商品', icon: 'none' })
            return
          }
          var customItemsText = serializeItems(currentItems)
          
          db.collection('page_config').doc('merchant').update({
            data: { customItems: customItemsText, updateTime: db.serverDate() }
          }).catch(function() {
            return db.collection('page_config').add({
              data: { _id: 'merchant', customItems: customItemsText, updateTime: db.serverDate() }
            })
          }).then(function() {
            wx.hideLoading()
            self.setData({ items: currentItems, customItems: customItemsText })
            wx.showToast({ title: '成功导入' + added + '件商品', icon: 'success' })
          }).catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '导入失败', icon: 'none' })
          })
        }
      }
    })
  },
  replaceAllItems: function() {
    var self = this
    if (!self.data.isAdmin || !db) return
    wx.showModal({
      title: '全量替换商品',
      content: '确定要用最新内置数据替换全部现有商品吗？此操作不可撤销。',
      confirmColor: '#ff4757',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '替换中...' })
          var newItems = initialItems.slice()
          var customItemsText = serializeItems(newItems)
          db.collection('page_config').doc('merchant').update({
            data: { useCustom: true, customItems: customItemsText, updateTime: db.serverDate() }
          }).catch(function() {
            return db.collection('page_config').add({
              data: { _id: 'merchant', useCustom: true, customItems: customItemsText, customTitle: self.data.customTitle || '', customDesc: self.data.customDesc || '', maintenance: false, updateTime: db.serverDate() }
            })
          }).then(function() {
            wx.hideLoading()
            self.setData({ items: newItems, customItems: customItemsText, useCustom: true })
            wx.showToast({ title: '已替换' + newItems.length + '件商品', icon: 'success' })
          }).catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '替换失败', icon: 'none' })
          })
        }
      }
    })
  },
  importFromFile: function() {
    var self = this
    if (!self.data.isAdmin || !db) return
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xml', 'xlsx', 'xls'],
      success: function(res) {
        var file = res.tempFiles[0]
        var ext = file.name.split('.').pop().toLowerCase()
        if (ext !== 'xml' && ext !== 'xlsx' && ext !== 'xls') {
          wx.showToast({ title: '请选择XML或XLSX文件', icon: 'none' })
          return
        }
        wx.showLoading({ title: '解析文件中...' })
        wx.cloud.uploadFile({
          cloudPath: 'import/' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext,
          filePath: file.path
        }).then(function(uploadRes) {
          return wx.cloud.callFunction({
            name: 'parseFile',
            data: { fileID: uploadRes.fileID, fileType: ext }
          })
        }).then(function(parseRes) {
          wx.hideLoading()
          var result = parseRes.result
          if (!result.success) {
            wx.showToast({ title: result.error || '解析失败', icon: 'none' })
            return
          }
          self.processImportData(result.content, result.type)
        }).catch(function(err) {
          wx.hideLoading()
          wx.showToast({ title: '导入失败', icon: 'none' })
        })
      }
    })
  },
  processImportData: function(content, type) {
    var self = this
    if (!content || type === 'empty') {
      wx.showToast({ title: '文件内容为空', icon: 'none' })
      return
    }
    var lines = content.split('\n')
    var items = []
    var startIndex = 0
    if (type === 'table') {
      startIndex = 2
    }
    for (var i = startIndex; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line || line.indexOf('|') === -1) continue
      var rawCells = line.split('|')
      var cells = []
      for (var k = 0; k < rawCells.length; k++) {
        cells.push((rawCells[k] || '').trim())
      }
      if (cells.length >= 3) {
        var name = cells[0]
        var price = parseInt(cells[1]) || 0
        var effect = cells[2] || ''
        var rarity = cells[3] || '普通'
        var source = cells[4] || '远行商人'
        var image = cells[5] || ''
        var limitCount = cells[6] || ''
        if (name && price > 0) {
          items.push({
            id: Date.now() + i,
            name: name,
            price: price,
            effect: effect,
            rarity: rarity,
            source: source,
            image: image,
            limitCount: limitCount
          })
        }
      }
    }
    if (items.length === 0) {
      wx.showToast({ title: '未识别到有效商品', icon: 'none' })
      return
    }
    wx.showModal({
      title: '导入商品确认',
      content: '识别到 ' + items.length + ' 件商品，是否导入？',
      success: function(res) {
        if (res.confirm) {
          self.saveImportedItems(items)
        }
      }
    })
  },
  saveImportedItems: function(newItems) {
    var self = this
    wx.showLoading({ title: '保存中...' })
    var currentItems = self.data.items.slice()
    var added = 0
    var updated = 0
    newItems.forEach(function(newItem) {
      var existingIndex = -1
      for (var i = 0; i < currentItems.length; i++) {
        if (currentItems[i].name === newItem.name) {
          existingIndex = i
          break
        }
      }
      if (existingIndex >= 0) {
        currentItems[existingIndex] = newItem
        updated++
      } else {
        currentItems.push(newItem)
        added++
      }
    })
    var customItemsText = serializeItems(currentItems)
    db.collection('page_config').doc('merchant').get()
      .then(function() {
        return db.collection('page_config').doc('merchant').update({
          data: { useCustom: true, customItems: customItemsText, updateTime: db.serverDate() }
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
        wx.hideLoading()
        self.setData({ items: currentItems, customItems: customItemsText, useCustom: true })
        var msg = '导入成功：新增' + added + '件'
        if (updated > 0) msg += '，更新' + updated + '件'
        wx.showToast({ title: msg, icon: 'success' })
      })
      .catch(function() {
        wx.hideLoading()
        wx.showToast({ title: '保存失败', icon: 'none' })
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
    this.setData({ showBatchModal: true, batchEditItem: null, batchEditIndex: -1, selectedItems: {}, selectedCount: 0 })
  },
  closeBatchModal: function() {
    this.setData({ showBatchModal: false, batchEditItem: null, batchEditIndex: -1, selectedItems: {}, selectedCount: 0 })
  },
  toggleSelectItem: function(e) {
    var id = e.currentTarget.dataset.id
    var selectedItems = Object.assign({}, this.data.selectedItems || {})
    if (selectedItems[id]) {
      delete selectedItems[id]
    } else {
      selectedItems[id] = true
    }
    var count = Object.keys(selectedItems).length
    this.setData({ selectedItems: selectedItems, selectedCount: count })
  },
  toggleSelectAll: function() {
    var items = this.data.items || []
    var selectedItems = this.data.selectedItems || {}
    var selectedCount = Object.keys(selectedItems).length
    var newSelected = {}
    if (selectedCount < items.length) {
      items.forEach(function(item) {
        newSelected[item.id] = true
      })
    }
    var count = Object.keys(newSelected).length
    this.setData({ selectedItems: newSelected, selectedCount: count })
  },
  batchDeleteItems: function() {
    var self = this
    if (!self.data.isAdmin || !db) return
    var selectedItems = self.data.selectedItems || {}
    var selectedIds = Object.keys(selectedItems).filter(function(id) {
      return selectedItems[id] === true
    })
    if (selectedIds.length === 0) {
      wx.showToast({ title: '请先勾选商品', icon: 'none' })
      return
    }
    wx.showModal({
      title: '批量下架',
      content: '确定要将选中的 ' + selectedIds.length + ' 个商品批量下架（永久删除）吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' })
          var items = self.data.items.slice()
          var deletedMap = {}
          selectedIds.forEach(function(id) {
            deletedMap[id] = true
          })
          var updatedItems = items.filter(function(item) {
            return !deletedMap[item.id]
          })
          var customItemsText = serializeItems(updatedItems)
          
          var selling = self.data.currentSelling || []
          var sellingChanged = false
          var deletedItems = items.filter(function(item) {
            return deletedMap[item.id]
          })
          for (var i = selling.length - 1; i >= 0; i--) {
            var isDeleted = deletedItems.some(function(delItem) {
              return delItem.name === selling[i].name && delItem.price === selling[i].price
            })
            if (isDeleted) {
              selling.splice(i, 1)
              sellingChanged = true
            }
          }
          var sellingText = serializeItems(selling)
          var updateData = { customItems: customItemsText, updateTime: db.serverDate() }
          if (sellingChanged) updateData.currentSelling = sellingText
          
          db.collection('page_config').doc('merchant').update({
            data: updateData
          }).then(function() {
            wx.hideLoading()
            self.setData({
              items: updatedItems,
              customItems: customItemsText,
              currentSelling: selling,
              currentSellingText: sellingText,
              selectedItems: {},
              selectedCount: 0
            })
            wx.showToast({ title: '下架成功', icon: 'success' })
          }).catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '下架失败', icon: 'none' })
          })
        }
      }
    })
  },
  updateBatchItemsProperty: function(property, newValue, successMsg) {
    var self = this
    var selectedItems = self.data.selectedItems || {}
    var selectedIds = Object.keys(selectedItems).filter(function(id) {
      return selectedItems[id] === true
    })
    
    wx.showLoading({ title: '处理中...' })
    var items = self.data.items.slice()
    var selectedMap = {}
    selectedIds.forEach(function(id) {
      selectedMap[id] = true
    })
    
    // 更新商品库对应属性
    var updatedItems = items.map(function(item) {
      if (selectedMap[item.id]) {
        item[property] = newValue
      }
      return item
    })
    
    var customItemsText = serializeItems(updatedItems)
    
    // 获取被选中的商品原数据，用来匹配正在售卖的商品（按名字匹配）
    var selectedOriginalItems = items.filter(function(item) {
      return selectedMap[item.id]
    })
    
    // 同步更新正在售卖列表里的属性
    var selling = self.data.currentSelling || []
    var sellingChanged = false
    
    for (var i = 0; i < selling.length; i++) {
      for (var j = 0; j < selectedOriginalItems.length; j++) {
        if (selling[i].name === selectedOriginalItems[j].name) {
          selling[i][property] = newValue
          sellingChanged = true
          break
        }
      }
    }
    
    var sellingText = serializeItems(selling)
    
    var updateData = { customItems: customItemsText, updateTime: db.serverDate() }
    if (sellingChanged) updateData.currentSelling = sellingText
    
    db.collection('page_config').doc('merchant').update({
      data: updateData
    }).then(function() {
      wx.hideLoading()
      self.setData({
        items: updatedItems,
        customItems: customItemsText,
        currentSelling: selling,
        currentSellingText: sellingText,
        selectedItems: {},
        selectedCount: 0
      })
      wx.showToast({ title: successMsg || '修改成功', icon: 'success' })
    }).catch(function() {
      wx.hideLoading()
      wx.showToast({ title: '修改失败', icon: 'none' })
    })
  },
  batchManageActions: function() {
    var self = this
    if (!self.data.isAdmin || !db) return
    var selectedItems = self.data.selectedItems || {}
    var selectedIds = Object.keys(selectedItems).filter(function(id) {
      return selectedItems[id] === true
    })
    if (selectedIds.length === 0) {
      wx.showToast({ title: '请先勾选商品', icon: 'none' })
      return
    }
    
    wx.showActionSheet({
      itemList: ['批量修改售价', '批量修改商品来源', '批量修改效果描述'],
      success: function(res) {
        var tapIndex = res.tapIndex
        if (tapIndex === 0) {
          // 售价
          wx.showModal({
            title: '批量调整售价',
            content: '',
            placeholderText: '请输入新价格（正整数）',
            editable: true,
            success: function(mRes) {
              if (mRes.confirm) {
                var priceStr = mRes.content ? mRes.content.trim() : ''
                if (!priceStr || isNaN(parseInt(priceStr)) || parseInt(priceStr) < 0) {
                  wx.showToast({ title: '请输入有效价格', icon: 'none' })
                  return
                }
                self.updateBatchItemsProperty('price', parseInt(priceStr), '价格调整成功')
              }
            }
          })
        } else if (tapIndex === 1) {
          // 来源
          wx.showModal({
            title: '批量修改商品来源',
            content: '',
            placeholderText: '请输入新的来源（如：远行商人）',
            editable: true,
            success: function(mRes) {
              if (mRes.confirm) {
                var sourceStr = mRes.content ? mRes.content.trim() : ''
                if (!sourceStr) {
                  wx.showToast({ title: '来源不能为空', icon: 'none' })
                  return
                }
                self.updateBatchItemsProperty('source', sourceStr, '来源修改成功')
              }
            }
          })
        } else if (tapIndex === 2) {
          // 效果说明
          wx.showModal({
            title: '批量修改效果描述',
            content: '',
            placeholderText: '请输入新的效果说明',
            editable: true,
            success: function(mRes) {
              if (mRes.confirm) {
                var effectStr = mRes.content ? mRes.content.trim() : ''
                if (!effectStr) {
                  wx.showToast({ title: '描述不能为空', icon: 'none' })
                  return
                }
                self.updateBatchItemsProperty('effect', effectStr, '效果描述修改成功')
              }
            }
          })
        }
      }
    })
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
    var customItemsText = serializeItems(items)
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
  deleteBatchItem: function() {
    var self = this
    var index = self.data.batchEditIndex
    if (!self.data.isAdmin || !db || index < 0 || index === undefined) return
    wx.showModal({
      title: '下架商品',
      content: '确定要下架（永久删除）该商品吗？',
      success: function(res) {
        if (res.confirm) {
          var items = self.data.items.slice()
          var deleted = items[index]
          items.splice(index, 1)
          var customItemsText = serializeItems(items)
          
          var selling = self.data.currentSelling || []
          var sellingChanged = false
          for (var i = selling.length - 1; i >= 0; i--) {
            if (selling[i].name === deleted.name && selling[i].price === deleted.price) {
              selling.splice(i, 1)
              sellingChanged = true
            }
          }
          var sellingText = serializeItems(selling)
          
          var updateData = { customItems: customItemsText, updateTime: db.serverDate() }
          if (sellingChanged) updateData.currentSelling = sellingText
          
          db.collection('page_config').doc('merchant').update({
            data: updateData
          }).then(function() {
            self.setData({
              items: items,
              customItems: customItemsText,
              currentSelling: selling,
              currentSellingText: sellingText,
              batchEditItem: null,
              batchEditIndex: -1
            })
            wx.showToast({ title: '已删除', icon: 'success' })
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },
  deleteEditItem: function() {
    var self = this
    var index = self.data.editingItemIndex
    if (!self.data.isAdmin || !db || index === null || index === undefined || index < 0) return
    wx.showModal({
      title: '下架商品',
      content: '确定要下架（永久删除）该商品吗？',
      success: function(res) {
        if (res.confirm) {
          var items = self.data.items.slice()
          var deleted = items[index]
          items.splice(index, 1)
          var customItemsText = serializeItems(items)
          
          var selling = self.data.currentSelling || []
          var sellingChanged = false
          for (var i = selling.length - 1; i >= 0; i--) {
            if (selling[i].name === deleted.name && selling[i].price === deleted.price) {
              selling.splice(i, 1)
              sellingChanged = true
            }
          }
          var sellingText = serializeItems(selling)
          
          var updateData = { customItems: customItemsText, updateTime: db.serverDate() }
          if (sellingChanged) updateData.currentSelling = sellingText
          
          db.collection('page_config').doc('merchant').update({
            data: updateData
          }).then(function() {
            self.setData({
              items: items,
              customItems: customItemsText,
              currentSelling: selling,
              currentSellingText: sellingText,
              showAddItemModal: false,
              editingItemIndex: null
            })
            wx.showToast({ title: '已删除', icon: 'success' })
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
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
      var customItemsText = serializeItems(items)
      db.collection('page_config').doc('merchant').update({
        data: { customItems: customItemsText, updateTime: db.serverDate() }
      }).then(function() {
        self.setData({ addingItem: false, showAddItemModal: false, editingItemIndex: null, items: items, customItems: customItemsText })
        wx.showToast({ title: '已更新', icon: 'success' })
      }).catch(function() {
        // 文档不存在时创建
        db.collection('page_config').add({
          data: { _id: 'merchant', useCustom: true, customItems: customItemsText, maintenance: false, updateTime: db.serverDate() }
        }).then(function() {
          self.setData({ addingItem: false, showAddItemModal: false, editingItemIndex: null, items: items, customItems: customItemsText })
          wx.showToast({ title: '已更新', icon: 'success' })
        }).catch(function() {
          self.setData({ addingItem: false })
          wx.showToast({ title: '更新失败', icon: 'none' })
        })
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
    var customItemsText = serializeItems(currentItems)
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
        // 添加商品到基础数据库默认不推送通知，只在上架时推送
        // notify.pushToSubscribers('merchant', newItemData.name, newItemData.name + ' · ' + newItemData.price + '洛克贝', '/pages/merchant/merchant', newItemData.name)
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
      title: '下架商品',
      content: '确定要下架（永久删除）该商品吗？',
      success: function(res) {
        if (res.confirm) {
          var items = self.data.items.slice()
          var deleted = items[index]
          items.splice(index, 1)
          var customItemsText = serializeItems(items)
          var selling = self.data.currentSelling || []
          var sellingChanged = false
          for (var i = selling.length - 1; i >= 0; i--) {
            if (selling[i].name === deleted.name && selling[i].price === deleted.price) {
              selling.splice(i, 1)
              sellingChanged = true
            }
          }
          var sellingText = serializeItems(selling)
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
