var adminUtil = require('../../utils/admin')
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')

// 节流：onShow 时避免重复请求
var _loadConfigTime = 0

Page({
  behaviors: [i18nBehavior],
  data: {
    isAdmin: false,
    maintenance: false,
    markers: [],
    filteredMarkers: [],
    catGroups: [],
    activeCats: {},
    searchVal: '',
    showPanel: false,
    selectedMarker: null,
    cursorX: 0,
    cursorY: 0,
    tileProgress: 0,
    tileUrls: [],
    iconUrls: []
  },
  _mapScale: 0.2,
  _mapOffsetX: 0,
  _mapOffsetY: 0,
  _canvas: null,
  _ctx: null,
  _canvasW: 0,
  _canvasH: 0,
  _tiles: [],
  _icons: {},
  _touchStart: null,
  _pinchStartDist: 0,
  _pinchStartScale: 1,
  _drawTimer: null,

  onLoad: function() {
    var self = this
    if (wx.cloud && !getApp()._mapDb) getApp()._mapDb = wx.cloud.database()
    this._db = getApp()._mapDb
    this.checkAdmin()
    this.loadConfig(true)
    this.initMarkers()
  },
  onShow: function() {
    this.checkAdmin()
    this.loadConfig(false)
  },
  onReady: function() {
    this.initCanvas()
  },
  onUnload: function() {
    if (this._drawTimer) clearTimeout(this._drawTimer)
  },

  loadConfig: function(force) {
    var self = this
    var now = Date.now()
    if (!force && now - _loadConfigTime < 10000) return
    _loadConfigTime = now
    if (!this._db) return
    this._db.collection('page_config').doc('map').get()
      .then(function(res) {
        self.setData({ maintenance: res.data.maintenance || false })
      })
      .catch(function() {})
  },

  checkAdmin: function() {
    var self = this
    if (wx.getStorageSync('is_admin_user')) {
      self.setData({ isAdmin: true })
    }
    adminUtil.checkAdmin(self, function(isAdmin) {
      self.setData({ isAdmin: isAdmin })
    })
  },

  initMarkers: function() {
    var self = this
    var types = require('./mapMarkers.js').markerTypes || {}
    var raw = require('./mapMarkers.js').compactMarkers || []
    var bounds = require('./mapMarkers.js').bounds || [306000, 408000, 714000, 816000]
    var side = require('./mapMarkers.js').sideLength || 408000
    self._bounds = bounds
    self._side = side
    var markers = raw.map(function(m) {
      return { tid: m[0], name: m[1], x: m[2], y: m[3], region: m[4] || '', className: m[5] || '', largeRegion: m[6] || '', typeName: types[m[0]] || '' }
    })
    var typeStats = {}
    markers.forEach(function(m) { if (!typeStats[m.tid]) typeStats[m.tid] = 0; typeStats[m.tid]++ })
    var DEFAULT_ON = ['大型眠枭庇护所', '小型眠枭庇护所', '炼金釜', '秘境入口', '魔力之源']
    var groups = {}
    var activeCats = {}
    markers.forEach(function(m) {
      var gn = self._guessGroup(m.typeName)
      if (!groups[gn]) groups[gn] = { name: gn, items: [], open: false, count: 0 }
      if (!groups[gn].items.find(function(i){return i.id===m.tid})) {
        groups[gn].items.push({ id: m.tid, name: m.typeName, count: typeStats[m.tid]||0 })
      }
      groups[gn].count++
      activeCats[m.tid] = DEFAULT_ON.indexOf(m.typeName) !== -1
    })
    var filtered = markers.filter(function(m) { return activeCats[m.tid] })
    self.setData({ markers: markers, filteredMarkers: filtered, catGroups: Object.values(groups), activeCats: activeCats })
  },

  _guessGroup: function(name) {
    if (!name) return '其他'
    if (/庇护所|炼金|秘境|魔力之源/.test(name)) return '传送与功能'
    if (/宝箱|眠枭之星/.test(name)) return '奖励资源'
    return '其他'
  },

  _markerToCanvas: function(gx, gy) {
    var b = this._bounds, s = this._side, P = 4096
    return { x: (gx - b[0]) / s * P, y: (gy - b[1]) / s * P }
  },
  _canvasToScreen: function(cx, cy) {
    return { x: this._mapOffsetX + cx * this._mapScale, y: this._mapOffsetY + cy * this._mapScale }
  },

  initCanvas: function() {
    var self = this
    wx.createSelectorQuery().in(this).select('#mapCanvas').fields({ node: true, size: true }).exec(function(res) {
      if (!res || !res[0] || !res[0].node) return
      var canvas = res[0].node
      var ctx = canvas.getContext('2d')
      var dpr = wx.getSystemInfoSync().pixelRatio || 2
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      self._canvas = canvas
      self._ctx = ctx
      self._canvasW = res[0].width
      self._canvasH = res[0].height
      var MAP_PX = 4096
      self._mapScale = Math.min(self._canvasW / MAP_PX, self._canvasH / MAP_PX) * 0.9
      self._mapOffsetX = (self._canvasW - MAP_PX * self._mapScale) / 2
      self._mapOffsetY = (self._canvasH - MAP_PX * self._mapScale) / 2
      self._loadTiles()
    })
  },

  _loadTiles: function() {
    var self = this
    var TILE_URLS = [
      'https://patchwiki.biligame.com/images/nrc/5/57/61yxsiquytdzotpcpvomienw35et5v0.png',
      'https://patchwiki.biligame.com/images/nrc/a/a7/1vev9yix9e9yse8qmixkr93dmyrsq0o.png',
      'https://patchwiki.biligame.com/images/nrc/2/25/15y3m34ss6ivfw8e48106jo3fmtsrpo.png',
      'https://patchwiki.biligame.com/images/nrc/f/f6/9tg2qs60tmc89iz3fdlbxv2bativt4a.png',
      'https://patchwiki.biligame.com/images/nrc/6/63/gkohj0u7xuprv42yp5qjkz9rmg529ky.png',
      'https://patchwiki.biligame.com/images/nrc/0/03/lamrw5xs7dkzb8jacy8zi57ibwtjf7c.png',
      'https://patchwiki.biligame.com/images/nrc/e/ef/no6xv1s2q62fwetkj6agrgy6c542lru.png',
      'https://patchwiki.biligame.com/images/nrc/b/b4/100rcbyq4b63jk8j85jaia2lwel1ozw.png',
      'https://patchwiki.biligame.com/images/nrc/e/ec/d4z3hglg4hv2n98lg80pm5w48rqtdi6.png',
      'https://patchwiki.biligame.com/images/nrc/c/ca/7rse2p4e1eao6upq9pfb3slym0i16or.png',
      'https://patchwiki.biligame.com/images/nrc/5/51/j098b9uxm09v8vsu9f8sraxzp9b2g24.png',
      'https://patchwiki.biligame.com/images/nrc/e/ea/e67p8ecrb5attopoernkus1tj6wme8o.png',
      'https://patchwiki.biligame.com/images/nrc/0/0a/9wzyhvfgowx1r4benxwyjdikkl5ux84.png',
      'https://patchwiki.biligame.com/images/nrc/6/67/jedkxo4eyqx4q9f655j7rylnmnuvyr7.png',
      'https://patchwiki.biligame.com/images/nrc/d/dc/3c279nvqfotlb6q6x281b4q5p410y3n.png',
      'https://patchwiki.biligame.com/images/nrc/8/8c/7hpcy4yjdjy3bpz2405v91svt491ytj.png'
    ]
    var MARKER_ICONS = {
      '魔力之源': 'https://patchwiki.biligame.com/images/nrc/7/76/sdibelxkj6dtossi299yqrrcphjdd7i.png',
      '大型眠枭庇护所': 'https://patchwiki.biligame.com/images/nrc/d/d2/o5evcztzo2vp80qd8qt70m2csme2ami.png',
      '小型眠枭庇护所': 'https://patchwiki.biligame.com/images/nrc/1/17/fy2t2skpj760pxc13za2crcz2y7t5jd.png',
      '炼金釜': 'https://patchwiki.biligame.com/images/nrc/1/11/a6yi0fqfk2877zzcj0bixe0mvequ94p.png',
      '秘境入口': 'https://patchwiki.biligame.com/images/nrc/7/7a/hmtus0il23qrlr6h90eh37la7dg127t.png'
    }
    self._markerIcons = MARKER_ICONS
    self._tiles = []
    self._tilesLoaded = 0
    for (var i = 0; i < 16; i++) self._tiles[i] = null
    var iconUrls = []
    for (var k in MARKER_ICONS) iconUrls.push({ name: k, url: MARKER_ICONS[k] })
    self.setData({ tileUrls: TILE_URLS.slice(), iconUrls: iconUrls, tileProgress: 0 })
  },

  onTileLoaded: function(e) {
    var idx = e.currentTarget.dataset.idx
    var self = this
    var img = this._canvas.createImage()
    img.onload = function() {
      self._tiles[idx] = img
      self._tilesLoaded++
      self.setData({ tileProgress: Math.round(self._tilesLoaded / 16 * 100) })
      self._scheduleDraw()
    }
    img.onerror = function() {
      self._tilesLoaded++
      self.setData({ tileProgress: Math.round(self._tilesLoaded / 16 * 100) })
    }
    var url = this.data.tileUrls[idx]
    img.src = url
  },
  onTileError: function(e) {
    this._tilesLoaded++
    this.setData({ tileProgress: Math.round(this._tilesLoaded / 16 * 100) })
  },
  onIconLoaded: function(e) {
    var name = e.currentTarget.dataset.name
    var self = this
    var img = this._canvas.createImage()
    img.onload = function() { self._icons[name] = img; self._scheduleDraw() }
    img.src = self._markerIcons[name]
  },
  onIconError: function() {},

  _scheduleDraw: function() {
    var self = this
    if (this._drawTimer) return
    this._drawTimer = setTimeout(function() {
      self._drawTimer = null
      self._drawMap()
    }, 16)
  },

  _drawMap: function() {
    var ctx = this._ctx
    if (!ctx) return
    var w = this._canvasW, h = this._canvasH
    var scale = this._mapScale, ox = this._mapOffsetX, oy = this._mapOffsetY
    var MAP_PX = 4096
    var TILE_SIZE = 1024

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#050e1a'
    ctx.fillRect(0, 0, w, h)

    for (var i = 0; i < 16; i++) {
      var tile = this._tiles[i]
      if (!tile) continue
      var row = Math.floor(i / 4), col = i % 4
      var ts = TILE_SIZE * scale
      ctx.drawImage(tile, ox + col * ts, oy + row * ts, ts, ts)
    }

    var markers = this.data.filteredMarkers
    var activeCats = this.data.activeCats
    var r = Math.max(1.5, Math.min(6, 3 * scale))
    var drawn = 0

    for (var j = 0; j < markers.length; j++) {
      var m = markers[j]
      if (!activeCats[m.tid]) continue
      var cp = this._markerToCanvas(m.x, m.y)
      var sp = this._canvasToScreen(cp.x, cp.y)
      if (sp.x < -20 || sp.x > w + 20 || sp.y < -20 || sp.y > h + 20) continue
      var iconImg = this._icons[m.typeName]
      if (iconImg) {
        var baseSize = Math.max(16, Math.min(40, 28 * scale))
        var iw = iconImg.width || 28, ih = iconImg.height || 28
        var ratio = iw / ih
        var iszW = ratio >= 1 ? baseSize : baseSize * ratio
        var iszH = ratio >= 1 ? baseSize / ratio : baseSize
        ctx.drawImage(iconImg, sp.x - iszW / 2, sp.y - iszH / 2, iszW, iszH)
      } else {
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2)
        ctx.fillStyle = '#00d4ff'
        ctx.fill()
      }
      drawn++
      if (drawn > 3000) break
    }

    if (this.data.selectedMarker) {
      var sm = this.data.selectedMarker
      var scp = this._markerToCanvas(sm.x, sm.y)
      var ssp = this._canvasToScreen(scp.x, scp.y)
      ctx.beginPath()
      ctx.arc(ssp.x, ssp.y, r + 5, 0, Math.PI * 2)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  },

  onTouchStart: function(e) {
    if (e.touches.length === 1) {
      this._touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, ox: this._mapOffsetX, oy: this._mapOffsetY }
    } else if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX
      var dy = e.touches[0].clientY - e.touches[1].clientY
      this._pinchStartDist = Math.sqrt(dx * dx + dy * dy)
      this._pinchStartScale = this._mapScale
    }
  },
  onTouchMove: function(e) {
    if (e.touches.length === 1 && this._touchStart) {
      this._mapOffsetX = this._touchStart.ox + (e.touches[0].clientX - this._touchStart.x)
      this._mapOffsetY = this._touchStart.oy + (e.touches[0].clientY - this._touchStart.y)
      this._scheduleDraw()
    } else if (e.touches.length === 2 && this._pinchStartDist > 0) {
      var dx = e.touches[0].clientX - e.touches[1].clientX
      var dy = e.touches[0].clientY - e.touches[1].clientY
      var dist = Math.sqrt(dx * dx + dy * dy)
      this._mapScale = Math.max(0.05, Math.min(3, this._pinchStartScale * (dist / this._pinchStartDist)))
      this._scheduleDraw()
    }
  },
  onTouchEnd: function(e) {
    if (this._touchStart && e.changedTouches.length === 1) {
      var dx = e.changedTouches[0].clientX - this._touchStart.x
      var dy = e.changedTouches[0].clientY - this._touchStart.y
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        this._hitTest(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      }
    }
    this._touchStart = null
    this._pinchStartDist = 0
  },

  _hitTest: function(clientX, clientY) {
    var self = this
    var query = wx.createSelectorQuery().in(this)
    query.select('#mapCanvas').boundingClientRect(function(rect) {
      if (!rect) return
      var relX = clientX - rect.left
      var relY = clientY - rect.top
      var hit = null
      var markers = self.data.filteredMarkers
      var activeCats = self.data.activeCats
      for (var i = 0; i < markers.length; i++) {
        var m = markers[i]
        if (!activeCats[m.tid]) continue
        var cp = self._markerToCanvas(m.x, m.y)
        var sp = self._canvasToScreen(cp.x, cp.y)
        var dx = relX - sp.x, dy = relY - sp.y
        var dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 15 && (!hit || dist < hit.dist)) hit = { marker: m, dist: dist }
      }
      if (hit) {
        self.setData({ selectedMarker: { name: hit.marker.name, typeName: hit.marker.typeName, className: hit.marker.className, region: hit.marker.region, largeRegion: hit.marker.largeRegion, x: hit.marker.x, y: hit.marker.y, color: '#00d4ff' } })
      } else {
        self.setData({ selectedMarker: null })
      }
      self._scheduleDraw()
    }).exec()
  },

  togglePanel: function() { this.setData({ showPanel: !this.data.showPanel }) },
  toggleCatGroup: function(e) {
    var name = e.currentTarget.dataset.name
    var groups = this.data.catGroups
    for (var i = 0; i < groups.length; i++) { if (groups[i].name === name) { groups[i].open = !groups[i].open; break } }
    this.setData({ catGroups: groups })
  },
  toggleCat: function(e) {
    var id = e.currentTarget.dataset.id
    var ac = this.data.activeCats
    ac[id] = !ac[id]
    this.setData({ activeCats: ac })
    this._filterMarkers()
  },
  selectAllCats: function() {
    var ac = this.data.activeCats
    for (var k in ac) ac[k] = true
    this.setData({ activeCats: ac })
    this._filterMarkers()
  },
  clearAllCats: function() {
    var ac = this.data.activeCats
    for (var k in ac) ac[k] = false
    this.setData({ activeCats: ac })
    this._filterMarkers()
  },
  onSearch: function(e) { this.setData({ searchVal: e.detail.value }); this._filterMarkers() },
  clearSearch: function() { this.setData({ searchVal: '' }); this._filterMarkers() },
  _filterMarkers: function() {
    var search = this.data.searchVal.trim().toLowerCase()
    var ac = this.data.activeCats
    var filtered = this.data.markers.filter(function(m) {
      if (!ac[m.tid]) return false
      if (search && m.name.toLowerCase().indexOf(search) === -1 && m.region.toLowerCase().indexOf(search) === -1) return false
      return true
    })
    this.setData({ filteredMarkers: filtered })
    this._scheduleDraw()
  },
  closeMarkerPopup: function() { this.setData({ selectedMarker: null }); this._scheduleDraw() },

  onShareAppMessage: function() { return { title: '地图资源助手 - 洛克王国向导', path: '/pages/map/map' } },
  onShareTimeline: function() { return { title: '地图资源助手 - 洛克王国向导' } }
})
