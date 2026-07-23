const app = getApp()
var db = null
const mapPoints = require('./mapPoints.js')

Page({
  data: {
    isAdmin: false,
    maintenance: true,
    markers: [],
    isNavigating: false,
    navTarget: null,
    navInfo: {},
    searchVal: '',
    categories: [],
    activeCategory: '',
    searchResults: [],
    showPanel: false,
    panelExpanded: false,
    panelStyle: '',
    selectedMarker: null,
    targetDistance: null
  },
  onLoad: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
  },
  onShow: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
  },
  checkAdmin: function() {
    var self = this
    if (!wx.cloud) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var currentOpenid = res.result.openid || res.result.userInfo.openId
      var db = wx.cloud.database()
      db.collection('admin_config').doc('admin').get()
        .then(function(adminRes) {
          if (adminRes.data.openid === currentOpenid) {
            wx.setStorageSync('is_admin_user', true)
            self.setData({ isAdmin: true })
          } else {
            wx.removeStorageSync('is_admin_user')
            self.setData({ isAdmin: false })
          }
        }).catch(function(e) { console.error(e) })
    }).catch(function(e) { console.error(e) })
  },

  onShareAppMessage: function () {
    return {
      title: '地图资源助手 - 洛克王国向导',
      path: '/pages/map/map'
    }
  },
  onShareTimeline: function () {
    return {
      title: '地图资源助手 - 洛克王国向导'
    }
  }

})
