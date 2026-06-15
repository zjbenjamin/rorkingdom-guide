var app = getApp()
var itemsModule = require('../../data/items')
var itemsData = itemsModule.itemsData

var catEmoji = { '咕噜球': '🏀', '材料': '🧪', '重要': '⭐', '任务': '📋' }

function getItemEmoji(name, category) {
  var ballEmoji = { '普通咕噜球': '⚪', '高级咕噜球': '🔵', '国王球': '👑', '美妙球': '💚', '好战球': '⚔️', '光合球': '🌿', '网兜球': '🪢', '暗星球': '🌙', '变幻球': '🔮', '淘沙球': '🏖️', '调温球': '🌡️', '棱镜球': '💎', '织梦棱镜球': '🔮', '捕光球': '💡', '绝灵球': '🛡️', '可可果球': '🥥' }
  var dustEmoji = { '草系粉尘': '🌿', '火系粉尘': '🔥', '水系粉尘': '💧', '光系粉尘': '✨', '恶系粉尘': '🌙', '幽系粉尘': '👻', '地系粉尘': '⛰️', '冰系粉尘': '❄️', '龙系粉尘': '🐉', '电系粉尘': '⚡', '毒系粉尘': '☠️', '虫系粉尘': '🐛', '武系粉尘': '👊', '翼系粉尘': '🕊️', '萌系粉尘': '🧚', '机械粉尘': '⚙️', '幻系粉尘': '🔮', '普通粉尘': '✨' }
  var impEmoji = { '魔法石': '🔮', '灵魂环印': '💍', '契约本源': '📜', '可可果': '🥥', '无花果': '🫒', '魔力果': '✨' }
  return ballEmoji[name] || dustEmoji[name] || impEmoji[name] || catEmoji[category] || '📦'
}

Page({
  data: {
    items: [],
    filtered: [],
    search: '',
    category: '全部',
    categories: ['全部','咕噜球','材料','重要','任务'],
    showCommunity: true
  },
  onLoad: function() {
    var self = this
    if (wx.cloud) {
      var db = wx.cloud.database()
      db.collection('page_config').doc('community').get()
        .then(function(res) { self.setData({ showCommunity: !res.data.maintenance }) })
        .catch(function() {})
    }
    var list = []
    for (var i = 0; i < itemsData.length; i++) {
      var item = itemsData[i]
      list.push({
        id: item.id,
        name: item.name,
        category: item.category,
        desc: item.desc,
        rarity: item.rarity,
        emoji: getItemEmoji(item.name, item.category)
      })
    }
    this.setData({ items: list, filtered: list })
  },
  onSearch: function(e) {
    this.setData({ search: e.detail.value })
    this.filter()
  },
  onCategory: function(e) {
    this.setData({ category: e.currentTarget.dataset.c })
    this.filter()
  },
  filter: function() {
    var r = this.data.items
    var self = this
    if (this.data.category !== '全部') {
      var f = []
      for (var i = 0; i < r.length; i++) { if (r[i].category === self.data.category) f.push(r[i]) }
      r = f
    }
    if (this.data.search) {
      var f2 = []
      for (var i = 0; i < r.length; i++) {
        if (r[i].name.indexOf(self.data.search) >= 0 || r[i].desc.indexOf(self.data.search) >= 0) f2.push(r[i])
      }
      r = f2
    }
    this.setData({ filtered: r })
  },
  goDetail: function(e) {
    var item = e.currentTarget.dataset.item
    wx.showModal({
      title: item.name,
      content: '分类: ' + item.category + '\n稀有度: ' + item.rarity + '\n\n' + item.desc,
      showCancel: false
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
