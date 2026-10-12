var padMode = require('./padMode')

// 在页面根节点注入 layout-pad / layout-wide，并跟随「我的」页里的模式切换
module.exports = Behavior({
  data: {
    padLayoutClass: '',
    padMode: 'auto'
  },
  pageLifetimes: {
    show: function() {
      this._applyPadLayout()
    },
    hide: function() {
      if (this._padResizeHandler) {
        try { wx.offWindowResize(this._padResizeHandler) } catch (e) {}
        this._padResizeHandler = null
      }
    }
  },
  lifetimes: {
    attached: function() {
      var self = this
      this._padResizeHandler = function() {
        self._applyPadLayout()
      }
      try { wx.onWindowResize(this._padResizeHandler) } catch (e) {}
      this._applyPadLayout()
    },
    detached: function() {
      if (this._padResizeHandler) {
        try { wx.offWindowResize(this._padResizeHandler) } catch (e) {}
        this._padResizeHandler = null
      }
    }
  },
  methods: {
    _applyPadLayout: function() {
      var mode = padMode.getMode()
      var w = 0
      try {
        // 新 API 优先，兼容旧基础库
        if (typeof wx.getWindowInfo === 'function') {
          w = wx.getWindowInfo().windowWidth
        } else {
          w = wx.getSystemInfoSync().windowWidth
        }
      } catch (e) {}
      this.setData({
        padMode: mode,
        padLayoutClass: padMode.layoutClasses(mode, w)
      })
    },
    setPadMode: function(mode) {
      padMode.setMode(mode)
      this._applyPadLayout()
    }
  }
})
