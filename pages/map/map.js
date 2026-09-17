const app = getApp()
var db = null
const mapPoints = require('./mapPoints.js')
const mapMarkers = require('./mapMarkers.js')
var i18n = require('../../utils/i18n')

// 坐标范围
var COORD_MIN = -3000
var COORD_MAX = 3000
var COORD_RANGE = COORD_MAX - COORD_MIN

// 标记类型分组
var TYPE_GROUPS = {
  '奖励资源': { icon: '🎁', color: '#ffab40' },
  '采集物':   { icon: '🌿', color: '#3fb950' },
  '传送与功能': { icon: '🌀', color: '#00d4ff' },
  '特殊玩法':  { icon: '🎯', color: '#9945ff' },
  '首领战':   { icon: '👑', color: '#ff4757' },
  '对战 NPC': { icon: '⚔️', color: '#ff6b9d' },
  '精灵生态':  { icon: '🐾', color: '#ffd700' },
  '商店':     { icon: '🏪', color: '#ff953f' }
}

Page({
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
    cursorY: 0
  },

  // 地图状态
  _mapScale: 1,
  _mapOffsetX: 0,
  _mapOffsetY: 0,
  _canvas: null,
  _ctx: null,
  _canvasW: 0,
  _canvasH: 0,
  _tileImg: null,
  _touchStart: null,
  _pinchStartDist: 0,
  _pinchStartScale: 1,

  onLoad: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadConfig()
    this.initMarkers()
  },
  onShow: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadConfig()
    this.initCanvas()
  },
  onReady: function() {
    this.initCanvas()
  },

  loadConfig: function() {
    var self = this
    if (!db) return
    db.collection('page_config').doc('map').get()
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
    if (!wx.cloud) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      var db = wx.cloud.database()
      db.collection('admin_config').doc('admin').get()
        .then(function(adminRes) {
          var isAdmin = openid === adminRes.data.openid
          if (isAdmin) wx.setStorageSync('is_admin_user', true)
          self.setData({ isAdmin: isAdmin })
        }).catch(function() {})
    }).catch(function() {})
  },

  initMarkers: function() {
    var self = this
    var types = mapMarkers.markerTypes || {}
    var raw = mapMarkers.compactMarkers || []
    var markers = raw.map(function(m) {
      return { tid: m[0], name: m[1], x: m[2], y: m[3], region: m[4] || '', typeName: types[m[0]] || '' }
    })

    // 按类型分组统计
    var typeStats = {}
    markers.forEach(function(m) {
      if (!typeStats[m.tid]) typeStats[m.tid] = { count: 0, name: m.typeName }
      typeStats[m.tid].count++
    })

    // 按 className 分组（从 markerTypes 无法直接得到 className，用 TYPE_GROUPS 近似）
    // 简化：按 typeName 前缀或直接按类型名称分组
    var groups = {}
    markers.forEach(function(m) {
      var gname = self._guessGroup(m.typeName)
      if (!groups[gname]) groups[gname] = { name: gname, icon: (TYPE_GROUPS[gname] || {}).icon || '📌', color: (TYPE_GROUPS[gname] || {}).color || '#888', items: [], open: false, count: 0 }
      if (!groups[gname].items.find(function(i) { return i.id === m.tid })) {
        groups[gname].items.push({ id: m.tid, name: m.typeName, color: (TYPE_GROUPS[gname] || {}).color || '#888', count: typeStats[m.tid] ? typeStats[m.tid].count : 0 })
      }
      groups[gname].count++
    })

    var catGroups = Object.values(groups)
    var activeCats = {}
    markers.forEach(function(m) { activeCats[m.tid] = true })

    self.setData({ markers: markers, filteredMarkers: markers, catGroups: catGroups, activeCats: activeCats })
  },

  _guessGroup: function(typeName) {
    if (!typeName) return '其他'
    if (/宝箱|闪光点|眠枭之星|智慧树苗|魔法石|不咕钟|音乐收集/.test(typeName)) return '奖励资源'
    if (/花|草|菌|菇|石|晶|兰|贝|珊瑚|树|果|竹|藻|魔菇/.test(typeName)) return '采集物'
    if (/炼金|魔力之源|秘境|庇护所|家园/.test(typeName)) return '传送与功能'
    if (/小游戏|测试仪|火盆|石像|扭蛋|祭台|祭坛|结晶树|芽眼|星光|赛季玩法/.test(typeName)) return '特殊玩法'
    if (/首领|传说挑战/.test(typeName)) return '首领战'
    if (/对战|黑衣人|隐藏|研究员|试炼/.test(typeName)) return '对战 NPC'
    if (/栖息地/.test(typeName)) return '精灵生态'
    if (/商店|皮卡|安妮/.test(typeName)) return '商店'
    return '其他'
  },

  // ── Canvas 初始化 ──
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

      // 加载底图
      var img = canvas.createImage()
      img.onload = function() {
        self._tileImg = img
        self._drawMap()
      }
      img.onerror = function() {
        self._drawMap()
      }
      img.src = 'https://patchwiki.biligame.com/images/nrc/e/e3/c3t3qmcglxfjg34e9dydbwc3sci99qi.png'
    })
  },

  // ── 绘制地图 ──
  _drawMap: function() {
    var ctx = this._ctx
    if (!ctx) return
    var w = this._canvasW, h = this._canvasH
    var scale = this._mapScale, ox = this._mapOffsetX, oy = this._mapOffsetY

    // 清空
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#050e1a'
    ctx.fillRect(0, 0, w, h)

    // 绘制底图（如果有）
    if (this._tileImg) {
      var iw = this._tileImg.width, ih = this._tileImg.height
      var dw = iw * scale, dh = ih * scale
      ctx.drawImage(this._tileImg, ox, oy, dw, dh)
    }

    // 绘制网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    var gridSize = 500 * scale
    var startX = ox % gridSize
    for (var gx = startX; gx < w; gx += gridSize) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
    }
    var startY = oy % gridSize
    for (var gy = startY; gy < h; gy += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
    }

    // 坐标 → 屏幕坐标
    var self = this
    function toScreen(mx, my) {
      var nx = (mx - COORD_MIN) / COORD_RANGE  // 0~1
      var ny = (my - COORD_MIN) / COORD_RANGE
      var imgW = self._tileImg ? self._tileImg.width : 1024
      var imgH = self._tileImg ? self._tileImg.height : 1024
      return {
        x: ox + nx * imgW * scale,
        y: oy + (1 - ny) * imgH * scale
      }
    }

    // 绘制标记点
    var markers = this.data.filteredMarkers
    var activeCats = this.data.activeCats
    var r = Math.max(2, 4 * scale)
    var drawn = 0
    for (var i = 0; i < markers.length; i++) {
      var m = markers[i]
      if (!activeCats[m.tid]) continue
      var pos = toScreen(m.x, m.y)
      if (pos.x < -10 || pos.x > w + 10 || pos.y < -10 || pos.y > h + 10) continue

      var group = self._guessGroup(m.typeName)
      var color = (TYPE_GROUPS[group] || {}).color || '#888'

      // 光晕
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r + 2, 0, Math.PI * 2)
      ctx.fillStyle = color + '33'
      ctx.fill()

      // 圆点
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      drawn++
      if (drawn > 3000) break // 性能保护
    }

    // 标记选中高亮
    if (this.data.selectedMarker) {
      var sm = this.data.selectedMarker
      var spos = toScreen(sm.x, sm.y)
      ctx.beginPath()
      ctx.arc(spos.x, spos.y, r + 6, 0, Math.PI * 2)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  },

  // ── 触摸交互 ──
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
      var dx = e.touches[0].clientX - this._touchStart.x
      var dy = e.touches[0].clientY - this._touchStart.y
      this._mapOffsetX = this._touchStart.ox + dx
      this._mapOffsetY = this._touchStart.oy + dy
      this._drawMap()
    } else if (e.touches.length === 2 && this._pinchStartDist > 0) {
      var dx = e.touches[0].clientX - e.touches[1].clientX
      var dy = e.touches[0].clientY - e.touches[1].clientY
      var dist = Math.sqrt(dx * dx + dy * dy)
      var ratio = dist / this._pinchStartDist
      this._mapScale = Math.max(0.2, Math.min(5, this._pinchStartScale * ratio))
      this._drawMap()
    }

    // 更新坐标显示
    if (e.touches.length === 1) {
      var cx = e.touches[0].clientX
      var cy = e.touches[0].clientY
      var info = this._screenToCoord(cx, cy)
      if (info) this.setData({ cursorX: info.x, cursorY: info.y })
    }
  },
  onTouchEnd: function(e) {
    // 单指点击 → 检测标记
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

  _screenToCoord: function(cx, cy) {
    if (!this._tileImg) return null
    var info = wx.getSystemInfoSync()
    var canvasTop = info.windowHeight * 0.15 // 估算
    var relX = cx - this._mapOffsetX
    var relY = cy - canvasTop - this._mapOffsetY
    var imgW = this._tileImg.width * this._mapScale
    var imgH = this._tileImg.height * this._mapScale
    var nx = relX / imgW
    var ny = 1 - relY / imgH
    return {
      x: Math.round(COORD_MIN + nx * COORD_RANGE),
      y: Math.round(COORD_MIN + ny * COORD_RANGE)
    }
  },

  _hitTest: function(cx, cy) {
    var self = this
    var info = wx.getSystemInfoSync()
    var canvasTop = 120 // 估算工具栏高度
    var wx = this._canvasW, h = this._canvasH
    var scale = this._mapScale, ox = this._mapOffsetX, oy = this._mapOffsetY
    var imgW = this._tileImg ? this._tileImg.width : 1024
    var imgH = this._tileImg ? this._tileImg.height : 1024

    var hit = null
    var hitDist = 20 // 点击容差
    var markers = this.data.filteredMarkers
    var activeCats = this.data.activeCats

    for (var i = 0; i < markers.length; i++) {
      var m = markers[i]
      if (!activeCats[m.tid]) continue
      var nx = (m.x - COORD_MIN) / COORD_RANGE
      var ny = (m.y - COORD_MIN) / COORD_RANGE
      var sx = ox + nx * imgW * scale
      var sy = oy + (1 - ny) * imgH * scale
      var dx = cx - sx
      var dy = (cy - canvasTop) - sy
      var dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < hitDist && (!hit || dist < hit.dist)) {
        hit = { marker: m, dist: dist, group: self._guessGroup(m.typeName) }
      }
    }

    if (hit) {
      var group = TYPE_GROUPS[hit.group] || {}
      self.setData({
        selectedMarker: {
          name: hit.marker.name,
          typeName: hit.marker.typeName,
          region: hit.marker.region,
          x: hit.marker.x,
          y: hit.marker.y,
          color: group.color || '#888'
        }
      })
    } else {
      self.setData({ selectedMarker: null })
    }
    self._drawMap()
  },

  // ── 筛选 ──
  togglePanel: function() {
    this.setData({ showPanel: !this.data.showPanel })
  },
  toggleCatGroup: function(e) {
    var name = e.currentTarget.dataset.name
    var groups = this.data.catGroups
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].name === name) {
        groups[i].open = !groups[i].open
        break
      }
    }
    this.setData({ catGroups: groups })
  },
  toggleCat: function(e) {
    var id = e.currentTarget.dataset.id
    var activeCats = this.data.activeCats
    activeCats[id] = !activeCats[id]
    this.setData({ activeCats: activeCats })
    this._filterMarkers()
  },
  selectAllCats: function() {
    var activeCats = this.data.activeCats
    for (var k in activeCats) activeCats[k] = true
    this.setData({ activeCats: activeCats })
    this._filterMarkers()
  },
  clearAllCats: function() {
    var activeCats = this.data.activeCats
    for (var k in activeCats) activeCats[k] = false
    this.setData({ activeCats: activeCats })
    this._filterMarkers()
  },
  onSearch: function(e) {
    this.setData({ searchVal: e.detail.value })
    this._filterMarkers()
  },
  clearSearch: function() {
    this.setData({ searchVal: '' })
    this._filterMarkers()
  },
  _filterMarkers: function() {
    var self = this
    var search = this.data.searchVal.trim().toLowerCase()
    var activeCats = this.data.activeCats
    var filtered = this.data.markers.filter(function(m) {
      if (!activeCats[m.tid]) return false
      if (search && m.name.toLowerCase().indexOf(search) === -1 && m.region.toLowerCase().indexOf(search) === -1) return false
      return true
    })
    this.setData({ filteredMarkers: filtered })
    this._drawMap()
  },
  closeMarkerPopup: function() {
    this.setData({ selectedMarker: null })
    this._drawMap()
  },

  onShareAppMessage: function () {
    return { title: '地图资源助手 - 洛克王国向导', path: '/pages/map/map' }
  },
  onShareTimeline: function () {
    return { title: '地图资源助手 - 洛克王国向导' }
  }
})
