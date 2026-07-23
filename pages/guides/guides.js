Page({
  data: {
    loading: true
  },
  onLoad: function() {
    this.setData({ loading: false })
  },

  onShareAppMessage: function () {
    return {
      title: '新手攻略大全 - 洛克王国向导',
      path: '/pages/guides/guides'
    }
  },
  onShareTimeline: function () {
    return {
      title: '新手攻略大全 - 洛克王国向导'
    }
  }

})
