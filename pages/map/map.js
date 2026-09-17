const app = getApp()
var db = null
const mapMarkers = require('./mapMarkers.js')
var i18n = require('../../utils/i18n')

// Wiki 地图元数据
var MAP_BOUNDS = { xMin: 306000, yMin: 408000, xMax: 714000, yMax: 816000 }
var MAP_SIDE = 408000
var TILE_COLS = 4
var TILE_ROWS = 4
var TILE_SIZE = 1024
var MAP_PX = TILE_COLS * TILE_SIZE  // 4096
var TILE_BASE = 'https://patchwiki.biligame.com/images/nrc/map-media/tiles-08e9506c2555bae050be'

// 标记坐标范围（已转换到 -3000~3000）
var M_MIN = -3000
var M_MAX = 3000
var M_RANGE = M_MAX - M_MIN

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

function guessGroup(name) {
  if (!name) return '其他'
  if (/宝箱|闪光点|眠枭之星|智慧树苗|魔法石|不咕钟|音乐收集/.test(name)) return '奖励资源'
  if (/花|草|菌|菇|石|晶|兰|贝|珊瑚|果|竹|藻|魔菇/.test(name)) return '采集物'
  if (/炼金|魔力之源|秘境|庇护所|家园/.test(name)) return '传送与功能'
  if (/小游戏|测试仪|火盆|石像|扭蛋|祭台|祭坛|结晶树|芽眼|星光|赛季玩法/.test(name)) return '特殊玩法'
  if (/首领|传说挑战/.test(name)) return '首领战'
  if (/对战|黑衣人|隐藏|研究员|试炼/.test(name)) return '对战 NPC'
  if (/栖息地/.test(name)) return '精灵生态'
  if (/商店|皮卡|安妮/.test(name)) return '商店'
  return '其他'
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
    cursorY: 0,
    tileProgress: 0
  },

  _mapScale: 0.2,
  _mapOffsetX: 0,
  _mapOffsetY: 0,
  _canvas: null,
  _ctx: null,
  _canvasW: 0,
  _canvasH: 0,
  _tiles: [],
  _tilesLoaded: 0,
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
  },
  onReady: function() {
    this.initCanvas()
  },

  loadConfig: function() {
    var self = this
    if (!db) return
    db.collection('page_config').doc('map').get()
      .then(function(res) { self.setData({ maintenance: res.data.maintenance || false }) })
      .catch(function() {})
  },

  checkAdmin: function() {
    var self = this
    if (wx.getStorageSync('is_admin_user')) self.setData({ isAdmin: true })
    if (!wx.cloud) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      var db = wx.cloud.database()
      db.collection('admin_config').doc('admin').get()
        .then(function(ar) {
          var isAdmin = openid === ar.data.openid
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
    // 分组统计
    var typeStats = {}
    markers.forEach(function(m) {
      if (!typeStats[m.tid]) typeStats[m.tid] = 0
      typeStats[m.tid]++
    })
    var groups = {}
    markers.forEach(function(m) {
      var gn = guessGroup(m.typeName)
      if (!groups[gn]) groups[gn] = { name: gn, icon: (TYPE_GROUPS[gn]||{}).icon||'📌', color: (TYPE_GROUPS[gn]||{}).color||'#888', items: [], open: false, count: 0 }
      if (!groups[gn].items.find(function(i){return i.id===m.tid})) {
        groups[gn].items.push({ id: m.tid, name: m.typeName, color: (TYPE_GROUPS[gn]||{}).color||'#888', count: typeStats[m.tid]||0 })
      }
      groups[gn].count++
    })
    var catGroups = Object.values(groups)
    var activeCats = {}
    markers.forEach(function(m) { activeCats[m.tid] = true })
    self.setData({ markers: markers, filteredMarkers: markers, catGroups: catGroups, activeCats: activeCats })
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

      // 初始视野居中
      self._mapScale = Math.min(self._canvasW / MAP_PX, self._canvasH / MAP_PX) * 0.9
      self._mapOffsetX = (self._canvasW - MAP_PX * self._mapScale) / 2
      self._mapOffsetY = (self._canvasH - MAP_PX * self._mapScale) / 2

      self._loadTiles()
    })
  },

  // ── 加载 4×4 瓦片 ──
  _loadTiles: function() {
    var self = this
    var canvas = this._canvas
    this._tiles = []
    this._tilesLoaded = 0
    var total = TILE_COLS * TILE_ROWS
    this.setData({ tileProgress: 0 })

    for (var i = 0; i < total; i++) {
      var row = Math.floor(i / TILE_COLS)
      var col = i % TILE_COLS
      var img = canvas.createImage()
      img.onload = (function(idx) {
        return function() {
          self._tiles[idx] = true
          self._tilesLoaded++
          self.setData({ tileProgress: Math.round(self._tilesLoaded / total * 100) })
          self._drawMap()
        }
      })(i)
      img.onerror = (function(idx) {
        return function() {
          self._tiles[idx] = false
          self._tilesLoaded++
          self.setData({ tileProgress: Math.round(self._tilesLoaded / total * 100) })
          self._drawMap()
        }
      })(i)
      img.src = TILE_BASE + '/' + i + '.png'
      this._tiles[i] = img
    }
  },

  // ── 标记坐标 → 画布像素 ──
  _markerToCanvas: function(mx, my) {
    // 标记坐标 -3000~3000 → 画布 0~4096
    var nx = (mx - M_MIN) / M_RANGE  // 0~1
    var ny = (my - M_MIN) / M_RANGE  // 0~1
    return { x: nx * MAP_PX, y: (1 - ny) * MAP_PX }  // Y 翻转
  },

  // ── 画布像素 → 屏幕坐标 ──
  _canvasToScreen: function(cx, cy) {
    return {
      x: this._mapOffsetX + cx * this._mapScale,
      y: this._mapOffsetY + cy * this._mapScale
    }
  },

  // ── 绘制地图 ──
  _drawMap: function() {
    var ctx = this._ctx
    if (!ctx) return
    var w = this._canvasW, h = this._canvasH
    var scale = this._mapScale, ox = this._mapOffsetX, oy = this._mapOffsetY

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#050e1a'
    ctx.fillRect(0, 0, w, h)

    // 绘制 4×4 瓦片
    for (var i = 0; i < TILE_COLS * TILE_ROWS; i++) {
      var tile = this._tiles[i]
      if (!tile || !tile.width) continue
      var row = Math.floor(i / TILE_COLS)
      var col = i % TILE_COLS
      var tx = ox + col * TILE_SIZE * scale
      var ty = oy + row * TILE_SIZE * scale
      var ts = TILE_SIZE * scale
      ctx.drawImage(tile, tx, ty, ts, ts)
    }

    // 绘制标记点
    var markers = this.data.filteredMarkers
    var activeCats = this.data.activeCats
    var self = this
    var r = Math.max(1.5, Math.min(6, 3 * scale))
    var drawn = 0

    for (var j = 0; j < markers.length; j++) {
      var m = markers[j]
      if (!activeCats[m.tid]) continue
      var cp = self._markerToCanvas(m.x, m.y)
      var sp = self._canvasToScreen(cp.x, cp.y)
      if (sp.x < -r || sp.x > w + r || sp.y < -r || sp.y > h + r) continue

      var group = guessGroup(m.typeName)
      var color = (TYPE_GROUPS[group] || {}).color || '#888'

      // 光晕
      if (scale > 0.4) {
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, r + 2, 0, Math.PI * 2)
        ctx.fillStyle = color + '22'
        ctx.fill()
      }
      // 圆点
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      if (r > 2) {
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      drawn++
      if (drawn > 4000) break
    }

    // 选中标记高亮
    if (this.data.selectedMarker) {
      var sm = this.data.selectedMarker
      var scp = self._markerToCanvas(sm.x, sm.y)
      var ssp = self._canvasToScreen(scp.x, scp.y)
      ctx.beginPath()
      ctx.arc(ssp.x, ssp.y, r + 5, 0, Math.PI * 2)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
      // 名称标签
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.fillText(sm.name, ssp.x, ssp.y - r - 10)
      ctx.textAlign = 'left'
    }

    // 边框
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(ox, oy, MAP_PX * scale, MAP_PX * scale)
  },

  // ── 触摸 ──
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
      this._mapScale = Math.max(0.05, Math.min(3, this._pinchStartScale * ratio))
      this._drawMap()
    }
    if (e.touches.length === 1) {
      var info = this._getCanvasCoord(e.touches[0].clientX, e.touches[0].clientY)
      if (info) this.setData({ cursorX: info.x, cursorY: info.y })
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

  _getCanvasCoord: function(clientX, clientY) {
    // 获取 canvas 在屏幕上的位置
    var self = this
    var query = wx.createSelectorQuery().in(this)
    query.select('#mapCanvas').boundingClientRect(function(rect) {
      if (!rect) return
      var relX = clientX - rect.left
      var relY = clientY - rect.top
      // 屏幕 → 画布像素
      var cx = (relX - self._mapOffsetX) / self._mapScale
      var cy = (relY - self._mapOffsetY) / self._mapScale
      // 画布像素 → 标记坐标
      var nx = cx / MAP_PX
      var ny = 1 - cy / MAP_PX  // Y 翻转
      var mx = Math.round(M_MIN + nx * M_RANGE)
      var my = Math.round(M_MIN + ny * M_RANGE)
      self.setData({ cursorX: mx, cursorY: my })
    }).exec()
  },

  _hitTest: function(clientX, clientY) {
    var self = this
    var query = wx.createSelectorQuery().in(this)
    query.select('#mapCanvas').boundingClientRect(function(rect) {
      if (!rect) return
      var relX = clientX - rect.left
      var relY = clientY - rect.top
      var hit = null
      var hitDist = 15
      var markers = self.data.filteredMarkers
      var activeCats = self.data.activeCats

      for (var i = 0; i < markers.length; i++) {
        var m = markers[i]
        if (!activeCats[m.tid]) continue
        var cp = self._markerToCanvas(m.x, m.y)
        var sp = self._canvasToScreen(cp.x, cp.y)
        var dx = relX - sp.x
        var dy = relY - sp.y
        var dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < hitDist && (!hit || dist < hit.dist)) {
          hit = { marker: m, dist: dist }
        }
      }

      if (hit) {
        var group = guessGroup(hit.marker.typeName)
        self.setData({
          selectedMarker: {
            name: hit.marker.name,
            typeName: hit.marker.typeName,
            region: hit.marker.region,
            x: hit.marker.x,
            y: hit.marker.y,
            color: (TYPE_GROUPS[group] || {}).color || '#888'
          }
        })
      } else {
        self.setData({ selectedMarker: null })
      }
      self._drawMap()
    }).exec()
  },

  // ── 筛选 ──
  togglePanel: function() { this.setData({ showPanel: !this.data.showPanel }) },
  toggleCatGroup: function(e) {
    var name = e.currentTarget.dataset.name
    var groups = this.data.catGroups
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].name === name) { groups[i].open = !groups[i].open; break }
    }
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
    this._drawMap()
  },
  closeMarkerPopup: function() { this.setData({ selectedMarker: null }); this._drawMap() },

  onShareAppMessage: function() { return { title: '地图资源助手 - 洛克王国向导', path: '/pages/map/map' } },
  onShareTimeline: function() { return { title: '地图资源助手 - 洛克王国向导' } }
})
