var TILE_URL = 'https://wiki-dev-patch-oss.oss-cn-hangzhou.aliyuncs.com/res/lkwg/map-3.0/{z}/tile-{x}_{y}.png'
var TILE_SIZE = 256
var MIN_ZOOM = 3
var MAX_ZOOM = 7
var DEFAULT_ZOOM = 4

var TRANSFORM_A = 0.0078125

function worldToTile(wx, wy, z) {
  var scale = TRANSFORM_A * Math.pow(2, z)
  return {
    x: Math.floor(wx * scale / TILE_SIZE),
    y: Math.floor(wy * scale / TILE_SIZE)
  }
}

function getScale(z) {
  return TRANSFORM_A * Math.pow(2, z)
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v
}

Component({
  properties: {
    markers: { type: Array, value: [] },
    initialCenterX: { type: Number, value: 0 },
    initialCenterY: { type: Number, value: 0 },
    initialZoom: { type: Number, value: DEFAULT_ZOOM },
    showZoomLevel: { type: Boolean, value: false },
    navTarget: { type: Object, value: null }
  },

  data: {
    zoomText: ''
  },

  lifetimes: {
    attached: function () {
      this._tileCache = {}
      this._tileCacheKeys = []
      this._tileCacheMax = 200
      this._loadingTiles = {}
      this._pendingLoads = 0
      this._maxConcurrent = 6
      this._canvas = null
      this._ctx = null
      this._canvasW = 0
      this._canvasH = 0
      this._centerX = this.data.initialCenterX
      this._centerY = this.data.initialCenterY
      this._zoom = this.data.initialZoom
      this._renderTimer = null
      this._isDragging = false
      this._dragStartX = 0
      this._dragStartY = 0
      this._dragStartCX = 0
      this._dragStartCY = 0
      this._lastMoveTime = 0
      this._velocityX = 0
      this._velocityY = 0
      this._lastMoveX = 0
      this._lastMoveY = 0
      this._inertiaTimer = null
      this._lastPinchDist = 0
      this._lastPinchCX = 0
      this._lastPinchCY = 0
      this._markerIcons = {}
      this._markerIconKeys = []
      this._markerIconMax = 50
      this._iconLoading = {}
      this._lastTapTime = 0
      this._rafCallback = null
      this._navAnimTimer = null
      this._lastDataX = Math.round(this._centerX)
      this._lastDataY = Math.round(this._centerY)

      this.setData({
        centerValX: this._lastDataX,
        centerValY: this._lastDataY,
        compassAngle: 0,
        compassDirection: 'N'
      })

      var self = this
      setTimeout(function () {
        self._initCanvas()
      }, 30)

      this._onResize = function () {
        self._initCanvas()
      }
      wx.onWindowResize && wx.onWindowResize(this._onResize)
    },
    detached: function () {
      if (this._renderTimer) this._cancelAnimFrame(this._renderTimer)
      if (this._inertiaTimer) this._cancelAnimFrame(this._inertiaTimer)
      if (this._onResize) wx.offWindowResize && wx.offWindowResize(this._onResize)
      if (this._navAnimTimer) {
        clearInterval(this._navAnimTimer)
        this._navAnimTimer = null
      }
    }
  },

  observers: {
    'markers': function () {
      this._scheduleRender()
    },
    'navTarget': function (newVal) {
      if (newVal) {
        this._startNavAnimation()
      }
      this._scheduleRender()
    }
  },

  methods: {
    _initCanvas: function () {
      var self = this
      var query = wx.createSelectorQuery().in(this)
      query.select('#tileCanvas')
        .fields({ node: true, size: true })
        .exec(function (res) {
          if (!res || !res[0] || !res[0].node) return
          var canvas = res[0].node
          var ctx = canvas.getContext('2d')
          var dpr = 2
          if (wx.getWindowInfo) {
            dpr = wx.getWindowInfo().pixelRatio || 2
          } else {
            try {
              var sysInfo = wx.getSystemInfoSync()
              dpr = sysInfo.pixelRatio || 2
            } catch (e) {}
          }

          var cssW = res[0].width
          var cssH = res[0].height

          canvas.width = cssW * dpr
          canvas.height = cssH * dpr

          self._canvas = canvas
          self._ctx = ctx
          self._dpr = dpr
          self._canvasW = cssW
          self._canvasH = cssH

          self._updateZoomText()
          self._scheduleRender()
        })
    },

    _updateZoomText: function () {
      this.setData({ zoomText: 'Lv.' + this._zoom.toFixed(1) })
    },

    _reqAnimFrame: function(cb) {
      if (this._canvas && this._canvas.requestAnimationFrame) {
        return this._canvas.requestAnimationFrame(cb)
      }
      return setTimeout(cb, 1000 / 120) // approx 8ms for 120Hz
    },

    _cancelAnimFrame: function(id) {
      if (this._canvas && this._canvas.cancelAnimationFrame) {
        this._canvas.cancelAnimationFrame(id)
      } else {
        clearTimeout(id)
      }
    },

    _scheduleRender: function () {
      var self = this
      if (this._renderTimer) return
      this._renderTimer = this._reqAnimFrame(function () {
        self._renderTimer = null
        self._render()
      })
    },

    _render: function () {
      var ctx = this._ctx
      var canvas = this._canvas
      if (!ctx || !canvas) return

      var dpr = this._dpr || 1
      var w = this._canvasW
      var h = this._canvasH
      var z = this._zoom
      var cx = this._centerX
      var cy = this._centerY
      var scale = getScale(z)

      var tileZ = Math.floor(z)
      var fracScale = Math.pow(2, z - tileZ)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#2a2a3e'
      ctx.fillRect(0, 0, w, h)

      var halfW = w / 2
      var halfH = h / 2

      var worldLeft = cx - halfW / scale
      var worldRight = cx + halfW / scale
      var worldTop = cy - halfH / scale
      var worldBottom = cy + halfH / scale

      var tileScale = getScale(tileZ)
      var tileWorldSize = TILE_SIZE / tileScale

      var txMin = Math.floor(worldLeft / tileWorldSize) - 1
      var txMax = Math.floor(worldRight / tileWorldSize) + 1
      var tyMin = Math.floor(worldTop / tileWorldSize) - 1
      var tyMax = Math.floor(worldBottom / tileWorldSize) + 1

      for (var tx = txMin; tx <= txMax; tx++) {
        for (var ty = tyMin; ty <= tyMax; ty++) {
          var screenX = (tx * tileWorldSize - cx) * scale + halfW
          var screenY = (ty * tileWorldSize - cy) * scale + halfH
          var drawSize = TILE_SIZE * fracScale

          if (screenX + drawSize < 0 || screenY + drawSize < 0 || screenX > w || screenY > h) {
            continue
          }

          this._drawTile(ctx, tileZ, tx, ty, screenX, screenY, drawSize)
        }
      }

      this._drawMarkers(ctx, cx, cy, scale, halfW, halfH)

      var roundX = Math.round(cx)
      var roundY = Math.round(cy)
      if (roundX !== this._lastDataX || roundY !== this._lastDataY) {
        this._lastDataX = roundX
        this._lastDataY = roundY
        this.setData({
          centerValX: roundX,
          centerValY: roundY
        })
        this.triggerEvent('centerchange', { x: roundX, y: roundY })
      }

      var navTarget = this.data.navTarget
      if (navTarget && navTarget.visible) {
        var tx = (navTarget.gameX - cx) * scale + halfW
        var ty = (navTarget.gameY - cy) * scale + halfH

        ctx.beginPath()
        ctx.moveTo(halfW, halfH)
        ctx.lineTo(tx, ty)
        ctx.strokeStyle = '#00ffaa'
        ctx.lineWidth = 3
        ctx.setLineDash([8, 6])
        ctx.stroke()
        ctx.setLineDash([])

        var scalePulse = (Math.sin(Date.now() / 300) + 1) / 2
        ctx.beginPath()
        ctx.arc(tx, ty, 16 + scalePulse * 8, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.5)'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(halfW, halfH, 10 + scalePulse * 6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 150, 255, 0.2)'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(halfW, halfH, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#0088ff'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()

        var dx = navTarget.gameX - cx
        var dy = navTarget.gameY - cy
        var dist = Math.round(Math.sqrt(dx * dx + dy * dy))
        var angle = Math.atan2(dy, dx) * 180 / Math.PI
        var compassAngle = angle + 90

        var compassDirection = 'N'
        var dirStr = '正北'
        var arrowStr = '⬆️'

        if (angle >= -22.5 && angle < 22.5) {
          compassDirection = 'E'
          dirStr = '正东'
          arrowStr = '➡️'
        } else if (angle >= 22.5 && angle < 67.5) {
          compassDirection = 'SE'
          dirStr = '东南'
          arrowStr = '↘️'
        } else if (angle >= 67.5 && angle < 112.5) {
          compassDirection = 'S'
          dirStr = '正南'
          arrowStr = '⬇️'
        } else if (angle >= 112.5 && angle < 157.5) {
          compassDirection = 'SW'
          dirStr = '西南'
          arrowStr = '↙️'
        } else if (angle >= 157.5 || angle < -157.5) {
          compassDirection = 'W'
          dirStr = '正西'
          arrowStr = '⬅️'
        } else if (angle >= -157.5 && angle < -112.5) {
          compassDirection = 'NW'
          dirStr = '西北'
          arrowStr = '↖️'
        } else if (angle >= -112.5 && angle < -67.5) {
          compassDirection = 'N'
          dirStr = '正北'
          arrowStr = '⬆️'
        } else if (angle >= -67.5 && angle < -22.5) {
          compassDirection = 'NE'
          dirStr = '东北'
          arrowStr = '↗️'
        }

        if (this.data.compassAngle !== compassAngle || this.data.compassDirection !== compassDirection) {
          this.setData({
            compassAngle: compassAngle,
            compassDirection: compassDirection
          })
        }

        this.triggerEvent('navupdate', {
          dist: dist,
          dir: dirStr,
          arrow: arrowStr,
          angle: angle
        })
      }
    },

    _drawTile: function (ctx, z, tx, ty, sx, sy, size) {
      var key = z + '_' + tx + '_' + ty

      if (this._tileCache[key]) {
        try {
          ctx.drawImage(this._tileCache[key], sx, sy, size, size)
        } catch (e) {}
        return
      }

      // Prevent flickering: draw a scaled-up portion of a cached lower-res parent tile
      var pz = z;
      var ptx = tx;
      var pty = ty;
      for (var level = 1; level <= 3; level++) {
        pz -= 1;
        ptx = Math.floor(ptx / 2);
        pty = Math.floor(pty / 2);
        var pKey = pz + '_' + ptx + '_' + pty;
        if (this._tileCache[pKey]) {
          var img = this._tileCache[pKey];
          var tilesPerSide = Math.pow(2, level);
          var subW = 256 / tilesPerSide;
          var dx = ((tx % tilesPerSide) + tilesPerSide) % tilesPerSide;
          var dy = ((ty % tilesPerSide) + tilesPerSide) % tilesPerSide;
          try {
            ctx.drawImage(img, dx * subW, dy * subW, subW, subW, sx, sy, size, size);
          } catch(e) {}
          break;
        }
      }

      if (this._loadingTiles[key]) return

      var refer = Math.ceil((1 << (z - 1)) / 2)
      var bounds = 4
      if (!(-refer * bounds <= tx && tx < refer * bounds && -refer * bounds <= ty && ty < refer * bounds)) {
        return
      }

      if (this._pendingLoads >= this._maxConcurrent) return

      this._loadingTiles[key] = true
      this._pendingLoads++

      var self = this
      var url = TILE_URL.replace('{z}', z).replace('{x}', tx).replace('{y}', ty)

      if (!this._canvas) return
      var img = this._canvas.createImage()
      img.onload = function () {
        self._tileCache[key] = img
        self._tileCacheKeys.push(key)
        if (self._tileCacheKeys.length > self._tileCacheMax) {
          var oldKey = self._tileCacheKeys.shift()
          delete self._tileCache[oldKey]
        }
        delete self._loadingTiles[key]
        self._pendingLoads--
        self._scheduleRender()
      }
      img.onerror = function () {
        delete self._loadingTiles[key]
        self._pendingLoads--
      }
      img.src = url
    },

    _drawMarkers: function (ctx, cx, cy, scale, halfW, halfH) {
      var markers = this.data.markers
      if (!markers || markers.length === 0) return

      for (var i = 0; i < markers.length; i++) {
        var m = markers[i]
        if (!m.visible) continue

        var sx = (m.gameX - cx) * scale + halfW
        var sy = (m.gameY - cy) * scale + halfH

        if (sx < -50 || sx > halfW * 2 + 50 || sy < -50 || sy > halfH * 2 + 50) continue

        this._drawMarkerIcon(ctx, m, sx, sy)
        this._drawMarkerLabel(ctx, m, sx, sy)
      }
    },

    _drawMarkerLabel: function(ctx, marker, sx, sy) {
      var typeId = marker.typeId
      // 过滤掉 宝箱(3xx)、采集(7xx) 和 收集(8xx) 分类，防止地图信息过载显得杂乱
      if ((typeId >= 300 && typeId <= 399) || (typeId >= 700 && typeId <= 799) || (typeId >= 800 && typeId <= 899)) {
        return
      }
      
      // 只有地图放大到一定等级才浮现文字标签，避免缩小视口时文字堆叠
      if (this._zoom < 4.2) return

      if (!marker.name) return
      ctx.save()
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      
      // 精简地名：把传送点名称里冗长的 '周边的魔力之源'、'岸的魔力之源' 等尾缀过滤掉
      var text = marker.name.replace(/(周边的|岸的|处的|地的)?魔力之源/, '')
      
      // 限制标签名称最大字数
      if (text.length > 8) {
        text = text.substring(0, 7) + '...'
      }
      
      var textWidth = ctx.measureText(text).width
      var paddingX = 5
      var paddingY = 3
      var rectW = textWidth + paddingX * 2
      var rectH = 10 + paddingY * 2
      var rectX = sx - rectW / 2
      var rectY = sy + 18 // 绘制在图标下方 18 像素处 (maxSize=32)
      
      // 绘制暗色半透明圆角背景框
      ctx.fillStyle = 'rgba(16, 20, 48, 0.85)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.lineWidth = 1
      
      var radius = 4
      ctx.beginPath()
      ctx.moveTo(rectX + radius, rectY)
      ctx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + rectH, radius)
      ctx.arcTo(rectX + rectW, rectY + rectH, rectX, rectY + rectH, radius)
      ctx.arcTo(rectX, rectY + rectH, rectX, rectY, radius)
      ctx.arcTo(rectX, rectY, rectX + rectW, rectY, radius)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // 绘制白色地名文字
      ctx.fillStyle = '#ffffff'
      ctx.fillText(text, sx, rectY + paddingY)
      ctx.restore()
    },

    _drawMarkerIcon: function (ctx, marker, sx, sy) {
      var maxSize = 32
      var iconUrl = marker.iconUrl

      if (iconUrl && this._markerIcons[iconUrl]) {
        try {
          var img = this._markerIcons[iconUrl]
          var w = img.naturalWidth || img.width
          var h = img.naturalHeight || img.height
          if (w > 0 && h > 0) {
            var scale = Math.min(maxSize / w, maxSize / h)
            var dw = w * scale
            var dh = h * scale
            ctx.drawImage(img, sx - dw / 2, sy - dh / 2, dw, dh)
          } else {
            ctx.drawImage(img, sx - maxSize / 2, sy - maxSize / 2, maxSize, maxSize)
          }
        } catch (e) {
          this._drawDefaultMarker(ctx, sx, sy, marker.color || '#00d4ff')
        }
        return
      }

      if (iconUrl && !this._iconLoading[iconUrl]) {
        this._iconLoading[iconUrl] = true
        this._loadMarkerIcon(iconUrl)
      }

      this._drawDefaultMarker(ctx, sx, sy, marker.color || '#00d4ff')
    },

    _drawDefaultMarker: function (ctx, sx, sy, color) {
      ctx.beginPath()
      ctx.arc(sx, sy, 10, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.9
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(sx, sy, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    },

    _loadMarkerIcon: function (url) {
      var self = this
      if (!this._canvas) return
      var img = this._canvas.createImage()
      img.onload = function () {
        self._markerIcons[url] = img
        self._markerIconKeys.push(url)
        if (self._markerIconKeys.length > self._markerIconMax) {
          var oldUrl = self._markerIconKeys.shift()
          delete self._markerIcons[oldUrl]
        }
        delete self._iconLoading[url]
        self._scheduleRender()
      }
      img.onerror = function () {
        delete self._iconLoading[url]
      }
      img.src = url
    },

    screenToWorld: function (sx, sy) {
      var scale = getScale(this._zoom)
      return {
        x: (sx - this._canvasW / 2) / scale + this._centerX,
        y: (sy - this._canvasH / 2) / scale + this._centerY
      }
    },

    onTouchStart: function (e) {
      if (this._inertiaTimer) {
        this._cancelAnimFrame(this._inertiaTimer)
        this._inertiaTimer = null
      }

      var touches = e.touches
      if (touches.length === 1) {
        this._isDragging = true
        this._dragStartX = touches[0].clientX
        this._dragStartY = touches[0].clientY
        this._dragStartCX = this._centerX
        this._dragStartCY = this._centerY
        this._lastMoveX = touches[0].clientX
        this._lastMoveY = touches[0].clientY
        this._lastMoveTime = Date.now()
        this._velocityX = 0
        this._velocityY = 0
      } else if (touches.length === 2) {
        this._isDragging = false
        var dx = touches[1].clientX - touches[0].clientX
        var dy = touches[1].clientY - touches[0].clientY
        this._lastPinchDist = Math.sqrt(dx * dx + dy * dy)
        this._lastPinchCX = (touches[0].clientX + touches[1].clientX) / 2
        this._lastPinchCY = (touches[0].clientY + touches[1].clientY) / 2
      }
    },

    onTouchMove: function (e) {
      e.preventDefault && e.preventDefault()
      var touches = e.touches
      var now = Date.now()

      if (touches.length === 1 && this._isDragging) {
        var dx = touches[0].clientX - this._dragStartX
        var dy = touches[0].clientY - this._dragStartY
        var scale = getScale(this._zoom)
        this._centerX = this._dragStartCX - dx / scale
        this._centerY = this._dragStartCY - dy / scale

        var dt = now - this._lastMoveTime
        if (dt > 0) {
          this._velocityX = (touches[0].clientX - this._lastMoveX) / dt
          this._velocityY = (touches[0].clientY - this._lastMoveY) / dt
        }
        this._lastMoveX = touches[0].clientX
        this._lastMoveY = touches[0].clientY
        this._lastMoveTime = now

        this._scheduleRender()
      } else if (touches.length === 2) {
        var tdx = touches[1].clientX - touches[0].clientX
        var tdy = touches[1].clientY - touches[0].clientY
        var dist = Math.sqrt(tdx * tdx + tdy * tdy)
        var pcx = (touches[0].clientX + touches[1].clientX) / 2
        var pcy = (touches[0].clientY + touches[1].clientY) / 2

        if (this._lastPinchDist > 0) {
          var ratio = dist / this._lastPinchDist
          var newZoom = clamp(this._zoom * ratio, MIN_ZOOM, MAX_ZOOM)

          var scale = getScale(this._zoom)
          var worldX = (this._lastPinchCX - this._canvasW / 2) / scale + this._centerX
          var worldY = (this._lastPinchCY - this._canvasH / 2) / scale + this._centerY

          this._zoom = newZoom
          var newScale = getScale(newZoom)
          this._centerX = worldX - (pcx - this._canvasW / 2) / newScale
          this._centerY = worldY - (pcy - this._canvasH / 2) / newScale

          this._updateZoomText()
          this._scheduleRender()
        }

        this._lastPinchDist = dist
        this._lastPinchCX = pcx
        this._lastPinchCY = pcy
      }
    },

    onTouchEnd: function (e) {
      if (this._isDragging) {
        var vx = this._velocityX
        var vy = this._velocityY
        var speed = Math.sqrt(vx * vx + vy * vy)

        if (speed > 0.3) {
          var self = this
          var friction = 0.92
          var scale = getScale(this._zoom)

          var lastTime = Date.now()
          var animate = function () {
            var now = Date.now()
            var dt = Math.max(1, now - lastTime)
            lastTime = now

            var timeRatio = dt / 16.66
            var actualFriction = Math.pow(friction, timeRatio)

            vx *= actualFriction
            vy *= actualFriction
            speed = Math.sqrt(vx * vx + vy * vy)

            if (speed < 0.05) {
              self._inertiaTimer = null
              return
            }

            self._centerX -= (vx / scale) * dt
            self._centerY -= (vy / scale) * dt
            self._scheduleRender()

            self._inertiaTimer = self._reqAnimFrame(animate)
          }
          this._inertiaTimer = this._reqAnimFrame(animate)
        }
      }

      this._isDragging = false
      this._lastPinchDist = 0

      this._zoom = Math.round(this._zoom * 2) / 2
      this._zoom = clamp(this._zoom, MIN_ZOOM, MAX_ZOOM)
      this._updateZoomText()
      this._scheduleRender()
    },

    onTap: function (e) {
      var now = Date.now()
      if (now - this._lastTapTime < 300) {
        var x = e.detail.x
        var y = e.detail.y
        if (x !== undefined && y !== undefined) {
          this._zoomAtPoint(x, y, 0.5)
        }
        this._lastTapTime = 0
        return
      }
      this._lastTapTime = now

      var x = e.detail.x
      var y = e.detail.y
      if (x === undefined || y === undefined) return

      var world = this.screenToWorld(x, y)
      var markers = this.data.markers
      var hitRadius = 25 / getScale(this._zoom)

      for (var i = 0; i < markers.length; i++) {
        var m = markers[i]
        if (!m.visible) continue
        var dx = m.gameX - world.x
        var dy = m.gameY - world.y
        if (Math.abs(dx) < hitRadius && Math.abs(dy) < hitRadius) {
          this.triggerEvent('markertap', { marker: m })
          return
        }
      }

      this.triggerEvent('maptap', { x: world.x, y: world.y })
    },

    _setZoom: function (z) {
      this._zoom = clamp(z, MIN_ZOOM, MAX_ZOOM)
      this._updateZoomText()
      this._scheduleRender()
    },

    _zoomAtPoint: function (sx, sy, delta) {
      var world = this.screenToWorld(sx, sy)
      var newZoom = clamp(this._zoom + delta, MIN_ZOOM, MAX_ZOOM)
      if (newZoom === this._zoom) return

      var newScale = getScale(newZoom)
      this._centerX = world.x - (sx - this._canvasW / 2) / newScale
      this._centerY = world.y - (sy - this._canvasH / 2) / newScale

      this._zoom = newZoom
      this._updateZoomText()
      this._scheduleRender()
    },

    zoomIn: function () {
      this._zoomAtPoint(this._canvasW / 2, this._canvasH / 2, 0.5)
    },

    zoomOut: function () {
      this._zoomAtPoint(this._canvasW / 2, this._canvasH / 2, -0.5)
    },

    moveTo: function (wx, wy, zoom) {
      this._centerX = wx
      this._centerY = wy
      if (zoom !== undefined) this._zoom = zoom
      this._updateZoomText()
      this._scheduleRender()
    },

    getZoom: function () {
      return this._zoom
    },

    getCenter: function () {
      return { x: this._centerX, y: this._centerY }
    },

    _startNavAnimation: function () {
      var self = this
      if (this._navAnimTimer) return
      this._navAnimTimer = setInterval(function () {
        if (self.data.navTarget) {
          self._scheduleRender()
        } else {
          clearInterval(self._navAnimTimer)
          self._navAnimTimer = null
        }
      }, 100)
    },

    snapToStart: function () {
      this.moveTo(0, 0, DEFAULT_ZOOM)
    }
  }
})


