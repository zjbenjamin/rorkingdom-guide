var app = getApp()
var petModule = require('../../data/pets')
var petData = petModule.itemsData
var getImgUrl = petModule.getImgUrl

var _timer = null

Page({
  data: {
    displayList: [],
    search: '',
    type: '全部',
    types: ['全部','普通','草','火','水','机械','幻','光','地','冰','龙','电','恶','翼','武','幽','毒','萌'],
    page: 0,
    pageSize: 60,
    hasMore: true,
    showCommunity: true
  },
  _allItems: null,
  _filteredAll: null,

  onLoad: function() {
    var list = []
    var self = this
    var db = wx.cloud ? wx.cloud.database() : null
    if (db) {
      db.collection('page_config').doc('community').get()
        .then(function(res) { self.setData({ showCommunity: !res.data.maintenance }) })
        .catch(function() {})
    }
    for (var i = 0; i < petData.length; i++) {
      var p = petData[i]
      var t = p.type || ''
      var arr = []
      var cur = ''
      for (var j = 0; j < t.length; j++) {
        var ch = t[j]
        if (ch >= 'A' && ch <= 'Z') { cur += ch }
        else if (cur) { arr.push(cur); cur = ch }
        else { cur = ch }
      }
      if (cur) arr.push(cur)
      list.push({
        id: p.id, name: p.name, type: p.type, stage: p.stage, total: p.total,
        difficulty: p.difficulty, evolves: p.evolves, location: p.location,
        hp: p.hp, attack: p.attack, defense: p.defense, spAtk: p.spAtk, spDef: p.spDef, speed: p.speed,
        skills: p.skills, desc: p.desc,
        typeArr: arr,
        imgUrl: getImgUrl(p.name)
      })
    }
    this._allItems = list
    this._filteredAll = list
    this.setData({ displayList: list.slice(0, 60), hasMore: list.length > 60 })
  },

  onSearch: function(e) {
    var self = this
    self.setData({ search: e.detail.value })
    if (_timer) clearTimeout(_timer)
    _timer = setTimeout(function() { self.filter() }, 300)
  },

  onType: function(e) {
    this.setData({ type: e.currentTarget.dataset.t })
    this.filter()
  },

  filter: function() {
    var all = this._allItems
    var r = all
    var self = this
    if (this.data.type !== '全部') {
      var f = []
      for (var i = 0; i < r.length; i++) {
        if (r[i].type === self.data.type || (r[i].type && r[i].type.indexOf(self.data.type) >= 0)) f.push(r[i])
      }
      r = f
    }
    if (this.data.search) {
      var s = this.data.search
      var f2 = []
      for (var i = 0; i < r.length; i++) {
        if (r[i].name.indexOf(s) >= 0 || r[i].type.indexOf(s) >= 0) f2.push(r[i])
      }
      r = f2
    }
    this._filteredAll = r
    var ps = this.data.pageSize
    this.setData({
      displayList: r.slice(0, ps),
      page: 0,
      hasMore: r.length > ps
    })
  },

  onScrollLower: function() {
    if (!this.data.hasMore) return
    var page = this.data.page + 1
    var ps = this.data.pageSize
    var start = page * ps
    var end = start + ps
    var all = this._filteredAll
    var append = all.slice(start, end)
    if (append.length === 0) {
      this.setData({ hasMore: false })
      return
    }
    this.setData({
      displayList: this.data.displayList.concat(append),
      page: page,
      hasMore: end < all.length
    })
  },

  onImgError: function(e) {
    var idx = e.currentTarget.dataset.idx
    var key = 'displayList[' + idx + '].imgUrl'
    this.setData({ [key]: '' })
  },

  goDetail: function(e) {
    wx.navigateTo({ url: '/pages/pets/detail/detail?id=' + e.currentTarget.dataset.id })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
