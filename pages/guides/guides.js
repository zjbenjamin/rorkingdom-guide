var app = getApp()
Page({
  data: { theme: 'light' },
  onShow: function() { this.setData({ theme: app.globalData.theme }) },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
