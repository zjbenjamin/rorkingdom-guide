Page({
  data: {
    type: 'privacy', // 'privacy' or 'agreement'
    title: '隐私保护指引'
  },
  onLoad: function(options) {
    if (options.type) {
      this.setData({
        type: options.type,
        title: options.type === 'agreement' ? '用户协议' : '隐私保护指引'
      })
      wx.setNavigationBarTitle({
        title: options.type === 'agreement' ? '用户协议' : '隐私保护指引'
      })
    }
  },
  onShareAppMessage: function() {
    return { 
      title: '洛手助手 - ' + this.data.title, 
      path: '/pages/privacy/privacy?type=' + this.data.type 
    }
  },
  onShareTimeline: function() {
    return { title: '洛手助手：' + this.data.title }
  }
})