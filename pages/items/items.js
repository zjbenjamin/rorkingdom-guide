Page({
  data: {
    loading: true
  },
  onLoad: function() {
    this.setData({ loading: false })
  },

  onShareAppMessage: function () {
    return {
      title: '游戏道具图鉴 - 洛克王国向导',
      path: '/pages/items/items'
    }
  },
  onShareTimeline: function () {
    return {
      title: '游戏道具图鉴 - 洛克王国向导'
    }
  }

})
