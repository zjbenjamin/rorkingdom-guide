var i18n = require('./i18n')

module.exports = Behavior({
  data: {
    _l: i18n.i18n['zh']
  },
  pageLifetimes: {
    show: function() {
      var app = getApp()
      if (!this._langVer || app.globalData.langVersion !== this._langVer) {
        this._refreshI18n()
      }
    }
  },
  methods: {
    _refreshI18n: function() {
      var lang = i18n.getLanguage()
      var app = getApp()
      this._langVer = app.globalData.langVersion || 0
      this.setData({ _l: i18n.i18n[lang] || i18n.i18n['zh'] })
    },
    _t: function(key) {
      return i18n.t(key)
    }
  }
})
