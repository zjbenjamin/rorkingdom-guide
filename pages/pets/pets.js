var app = getApp()
var petData = require('../../data/pets').petsData
Page({
  data: { pets: petData, filtered: petData, search: '', type: '全部', types: ['全部','普通','草','火','水','机械','幻','光','地','冰','龙','电','恶','翼','武','幽','毒','萌'] },
  onSearch: function(e) { this.setData({ search: e.detail.value }); this.filter() },
  onType: function(e) { this.setData({ type: e.currentTarget.dataset.t }); this.filter() },
  filter: function() {
    var r = this.data.pets, self = this
    if (this.data.type !== '全部') { var f = []; for (var i = 0; i < r.length; i++) { if (r[i].type === self.data.type) f.push(r[i]) } r = f }
    if (this.data.search) { var f2 = []; for (var i = 0; i < r.length; i++) { if (r[i].name.indexOf(self.data.search) >= 0 || r[i].type.indexOf(self.data.search) >= 0) f2.push(r[i]) } r = f2 }
    this.setData({ filtered: r })
  },
  goDetail: function(e) { wx.navigateTo({ url: '/pages/pets/detail/detail?id=' + e.currentTarget.dataset.id }) },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
