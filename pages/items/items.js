var app = getApp()
var itemsData = require('../../data/items').itemsData
Page({
  data: {
    items: itemsData,
    filtered: itemsData,
    search: '',
    category: '全部',
    categories: ['全部','咕噜球','材料','重要','任务']
  },
  onShow: function() {},
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
    var sourceText = item.source === '远行商人' ? '远行商人购买' : item.source === '安妮商店' ? '安妮商店购买' : '道具图鉴查看'
    wx.showModal({
      title: item.name,
      content: '【道具信息】\n分类: ' + item.category + '\n稀有度: ' + item.rarity + '\n\n【道具效果】\n' + item.effect + '\n\n【获取方式】\n' + sourceText + '\n\n【价值参考】\n' + (item.rarity === '传说' ? '极高价值，稀有珍贵' : item.rarity === '史诗' ? '高价值，重要材料' : item.rarity === '稀有' ? '中等价值，常用材料' : '基础价值，日常消耗'),
      showCancel: false
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
