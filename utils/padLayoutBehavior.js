var padMode = require('./padMode')

// 在页面根节点注入 layout-pad / layout-wide；仅跟随「我的」页 Pad 模式按钮切换
module.exports = Behavior({
  data: {
    padLayoutClass: 'layout-phone',
    padMode: 'phone'
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
      // 仅用于 pad 模式下重算 layout-wide，不会自动切换布局
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
