var i18nBehavior = require('../../utils/i18nBehavior')
Page({
  behaviors: [i18nBehavior],
  data: {
    loading: true
  },
  onLoad: function() {
    this._refreshI18n()
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
