var app = getApp()
var skillsData = require('../../data/skills').skillsData
Page({
  data: { skills: skillsData, filtered: skillsData, search: '', type: '全部', types: ['全部','普通','火','水','草','冰','电','地','翼','幽','恶','光','武','机械','幻','毒','虫'] },
  onSearch: function(e) { this.setData({ search: e.detail.value }); this.filter() },
  onType: function(e) { this.setData({ type: e.currentTarget.dataset.t }); this.filter() },
  filter: function() {
    var r = this.data.skills, self = this
    if (this.data.type !== '全部') { var f = []; for (var i = 0; i < r.length; i++) { if (r[i].type === self.data.type) f.push(r[i]) } r = f }
    if (this.data.search) { var f2 = []; for (var i = 0; i < r.length; i++) { if (r[i].name.indexOf(self.data.search) >= 0) f2.push(r[i]) } r = f2 }
    this.setData({ filtered: r })
  },
  showDetail: function(e) {
    var s = e.currentTarget.dataset.s
    wx.showModal({ title: s.name, content: '【技能信息】\n属性: ' + s.type + '\n分类: ' + s.category + '\n威力: ' + (s.power > 0 ? s.power : '变化') + '\nPP: ' + s.pp + '\n\n【技能效果】\n' + s.desc + '\n\n【数据来源】\n洛克王国手游WIKI（CC BY-NC-SA 4.0）\nhttps://wiki.biligame.com/rocom/技能图鉴', showCancel: false })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
