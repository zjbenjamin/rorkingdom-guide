var merchantData = require('../../data/merchant')
Page({
  data: { items: merchantData.items },
  showItem: function(e) {
    var d = e.currentTarget.dataset.d
    wx.showModal({ title: d.name, content: '价格: ' + d.price + '洛克贝\n效果: ' + d.effect + '\n稀有度: ' + d.rarity + '\n来源: ' + d.source, showCancel: false })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
