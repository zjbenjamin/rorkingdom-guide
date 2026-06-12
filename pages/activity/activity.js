var app = getApp()
var { activitiesData } = require('../../data/pets')
Page({
  data: { theme: 'light', activities: activitiesData, filtered: activitiesData, status: '全部', statuses: ['全部','进行中','置顶'], expandedId: -1 },
  onShow: function() { this.setData({ theme: app.globalData.theme }) },
  onStatus: function(e) {
    var s = e.currentTarget.dataset.s
    this.setData({ status: s })
    if (s === '全部') {
      this.setData({ filtered: activitiesData })
    } else {
      var filtered = []
      for (var i = 0; i < activitiesData.length; i++) {
        if (activitiesData[i].status === s) filtered.push(activitiesData[i])
      }
      this.setData({ filtered: filtered })
    }
  },
  onExpand: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({ expandedId: this.data.expandedId === id ? -1 : id })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
