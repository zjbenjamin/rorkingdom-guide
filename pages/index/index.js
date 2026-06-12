var app = getApp()
var petData = require('../../data/pets').petsData
var newsData = require('../../data/news').newsData

Page({
  data: {
    buildTime: '',
    news: [],
    rocoCoins: 0,
    shinyCount: 0,
    carnivalCount: 0,
    nightmareCount: 0,
    totalSuccess: 0
  },
  onShow: function() {
    var n = new Date()
    var y = n.getFullYear()
    var m = String(n.getMonth() + 1).padStart(2, '0')
    var d = String(n.getDate()).padStart(2, '0')
    var h = String(n.getHours()).padStart(2, '0')
    var mi = String(n.getMinutes()).padStart(2, '0')
    var s = String(n.getSeconds()).padStart(2, '0')
    var now = new Date()
    var freshNews = []
    var pinnedNews = []
    for (var i = 0; i < newsData.length; i++) {
      var item = newsData[i]
      if (item.pinned) {
        pinnedNews.push(item)
      } else {
        var parts = item.date.split('-')
        var newsDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
        var diff = (now - newsDate) / (1000 * 60 * 60 * 24)
        if (diff <= 60) freshNews.push(item)
      }
    }
    this.setData({
      buildTime: y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s,
      news: pinnedNews.concat(freshNews).slice(0, 8),
      rocoCoins: wx.getStorageSync('roco_coins') || 0,
      shinyCount: wx.getStorageSync('shiny_count') || 0,
      carnivalCount: wx.getStorageSync('carnival_count') || 0,
      nightmareCount: wx.getStorageSync('nightmare_count') || 0,
      totalSuccess: wx.getStorageSync('total_success') || 0
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  showNews: function(e) {
    var n = this.data.news[e.currentTarget.dataset.i]
    wx.showModal({ title: n.title, content: n.date + ' | ' + n.type + '\n\n' + n.summary, showCancel: false })
  }
})
