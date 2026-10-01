var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')
var imageConfig = require('../../config/images')
var mediaPlayer = require('../../utils/mediaPlayer')
var admin = require('../../utils/admin')
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')

Page({
  behaviors: [i18nBehavior],
  data: {
    currentLang: 'zh',
    bannerUrl: '',
    bannerUrls: [],
    bannerFallback: '',
    merchantCard: null,
    swarmItem: null,
    expandedGoodsIndex: '',
    subscribedMerchant: false,
    merchantSubCount: 0,
    subscribedSwarm: false,
    swarmSubCount: 0,
    heroSwiperH: 0,
    announcements: [],
    subscribeConfig: {},
    subscribedAnnouncement: false,
    subscribeCount: 0,
    buildTime: '',
    currentPlayUrl: '',
    isPlaying: false,
    icp: '浙ICP备2026043884号',
    showVideoPlayer: false,
    videoPlayerUrl: '',
    videoPlayerName: '',
    videoPlayerCover: '',
    videoPlayerOwner: '',
    videoPlayerDesc: '',
    countdowns: {},
    richSwiperHeights: {}
  },

  onHide: function() {
    if (this._countdownTimer) { clearInterval(this._countdownTimer); this._countdownTimer = null }
    if (this._announcementsTimer) { clearInterval(this._announcementsTimer); this._announcementsTimer = null }
    this._stopAnnouncementsWatch()
  },
  onUnload: function() {
    if (this._countdownTimer) { clearInterval(this._countdownTimer); this._countdownTimer = null }
    if (this._announcementsTimer) { clearInterval(this._announcementsTimer); this._announcementsTimer = null }
    this._stopAnnouncementsWatch()
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },
  onShow: function() {
    var self = this
    self._refreshI18n()
    self.setData({ currentLang: i18n.getLanguage() })
    // 先清除旧定时器，防止多个setInterval叠加卡死主线程
    if (self._countdownTimer) { clearInterval(self._countdownTimer); self._countdownTimer = null }
    if (self._announcementsTimer) { clearInterval(self._announcementsTimer); self._announcementsTimer = null }
    var n = new Date()
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    self.setData({
      bannerFallback: imageConfig.getCloudUrl ? imageConfig.getCloudUrl('/images/banner.png') : '',
      buildTime: n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(n.getDate()).padStart(2,'0') + ' ' + String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0') + ':' + String(n.getSeconds()).padStart(2,'0'),
      subscribeConfig: subscribeConfig
    })
    if (wx.cloud) db = wx.cloud.database()
    self.checkAdmin()
    self.loadAnnouncements()
    self._startAnnouncementsWatch()
    // 兜底静默刷新：watch 断线时仍能周期拿到最新公告
    self._announcementsTimer = setInterval(function() {
      self.loadAnnouncements()
    }, 45000)
    self.loadBanner()
    self.loadIcp()
    self.loadBroadcast()
    self.checkSubscription()
    // 启动倒计时刷新
    self._countdownTimer = setInterval(function() {
      self.updateCountdowns()
      self.updateBroadcastCountdown()
    }, 1000)
    self.updateBroadcastCountdown()
  },
  updateBroadcastCountdown: function() {
    var self = this
    var now = Date.now()
    var dict = i18n.i18n[i18n.getLanguage()] || i18n.i18n.zh || {}
    var changed = false

    // ── 大量出没（单条）：到结束时间自动清空 ──
    var swarm = this.data.swarmItem
    if (swarm) {
      if (swarm.endTs && now >= swarm.endTs) {
        swarm = null
        changed = true
      } else {
        var text = swarm.countdownText
        if (swarm.startTs && now < swarm.startTs) {
          // 不足24小时：距上线 X时X分X秒
          var sd = swarm.startTs - now
          var sPrefix = sd < 86400000 ? 'countdownOnline' : 'countdownNextSwarm'
          text = i18n.formatCountdown(sd, sPrefix, 'countdownEnded') || ''
        } else if (swarm.endTs && swarm.endTs > now) {
          text = i18n.formatCountdown(swarm.endTs - now, 'countdownOffline', 'countdownEnded') || ''
        }
        if (swarm.countdownText !== text) {
          swarm = Object.assign({}, swarm, { countdownText: text })
          changed = true
        }
      }
    }

    // ── 远行商人卡片：商品实时剔除 + 下架倒计时 ──
    var merchant = this.data.merchantCard
    if (merchant) {
      merchant = Object.assign({}, merchant)
      if (merchant.items && merchant.items.length) {
        var bulkTs = merchant.bulkTs || 0
        var goods = []
        for (var j = 0; j < merchant.items.length; j++) {
          var g = merchant.items[j]
          var exp = 0
          if (g.offlineDate) {
            var ot = g.offlineDate + ' ' + (g.offlineTimeStr === '23:59' ? '23:59:59' : (g.offlineTimeStr || '23:59:59'))
            exp = new Date(ot.replace(/-/g, '/')).getTime()
          } else {
            exp = bulkTs
          }
          if (exp && !isNaN(exp) && now >= exp) { changed = true; continue }
          g = Object.assign({}, g)
          g.remainText = self._remainText(exp, now, dict)
          goods.push(g)
        }
        if (!goods.length) {
          changed = true
          merchant.items = []
          merchant.normalItems = []
          merchant.limitedItems = []
          merchant.desc = dict.broadcastMaintain || '运营数据维护中'
          merchant.badge = ''
          merchant.normalCountdown = ''
          merchant.normalOfflineLabel = ''
        } else {
          if (goods.length !== merchant.items.length) changed = true
          merchant.items = goods
          var normals = []
          var limited = []
          for (var n = 0; n < goods.length; n++) {
            if (goods[n].offlineDate) limited.push(goods[n])
            else normals.push(goods[n])
          }
          merchant.normalItems = normals
          merchant.limitedItems = limited

          var nCount = self._remainText(bulkTs, now, dict)
          if (merchant.normalCountdown !== nCount) {
            merchant.normalCountdown = nCount
            changed = true
          }
          if (bulkTs && bulkTs > 0) {
            var nLabel = self._offlineLabel({ offlineDate: self._tsToDateStr(bulkTs), offlineTimeStr: self._tsToTimeStr(bulkTs) })
            if (merchant.normalOfflineLabel !== nLabel) {
              merchant.normalOfflineLabel = nLabel
              changed = true
            }
          } else if (merchant.normalOfflineLabel) {
            merchant.normalOfflineLabel = ''
            changed = true
          }

          var prevItems = this.data.merchantCard && this.data.merchantCard.items
          if (!prevItems || prevItems.length !== goods.length) {
            changed = true
          } else {
            for (var r = 0; r < goods.length; r++) {
              if (!prevItems[r] || prevItems[r].remainText !== goods[r].remainText) {
                changed = true
                break
              }
            }
          }
        }
      }
    }

    if (changed) this.setData({ swarmItem: swarm, merchantCard: merchant })
  },
  _remainText: function(exp, now, dict) {
    if (!exp || isNaN(exp)) return ''
    var diff = exp - now
    if (diff > 0) return i18n.formatDuration(Math.floor(diff / 1000)) || ''
    return (dict && dict.countdownDelisted) || '已下架'
  },
  _tsToDateStr: function(ts) {
    var d = new Date(ts)
    var pad = function(n) { return n < 10 ? '0' + n : '' + n }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
  },
  _tsToTimeStr: function(ts) {
    var d = new Date(ts)
    var pad = function(n) { return n < 10 ? '0' + n : '' + n }
    return pad(d.getHours()) + ':' + pad(d.getMinutes())
  },
  _offlineLabel: function(g) {
    if (!g || !g.offlineDate) return ''
    var t = g.offlineTimeStr === '23:59' ? '24:00' : (g.offlineTimeStr || '24:00')
    return g.offlineDate + ' ' + t
  },
  // 商人商品：点击展开/收起简介
  toggleBroadcastGoods: function(e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      expandedGoodsIndex: this.data.expandedGoodsIndex === key ? '' : key
    })
  },
  switchLang: function(e) {
    var lang = e.currentTarget.dataset.lang
    var app = getApp()
    app.setLang(lang)
    this._refreshI18n()
    this.setData({ currentLang: lang })
    var tip = i18n.i18n[lang].langSwitched || '已切换'
    wx.showToast({ title: tip, icon: 'none', duration: 1500 })
  },
  checkAdmin: function() {
    var self = this
    admin.checkAdmin(self, function(isAdmin) {
      if (isAdmin) self.setData({ isAdmin: true })
    })
  },
  // 【首页双栏】大量出没（只展示最新一条）+ 远行商人上架（独立卡片）
  loadBroadcast: function() {
    var self = this
    if (!db) {
      self.setData({ merchantCard: null, swarmItem: null })
      return
    }
    // ── 大量出没：只取最新一条（进行中优先，否则最近将开的） ──
    db.collection('swarms').orderBy('createTime', 'desc').limit(50).get()
      .then(function(res) {
        var now = Date.now()
        var rows = res.data || []
        var parsed = []
        for (var i = 0; i < rows.length; i++) {
          var s = rows[i]
          var startStr = s.startDate ? (s.startDate + ' ' + (s.startTime || '00:00:00')) : ''
          var endStr = s.endDate ? (s.endDate + ' ' + (s.endTime || '23:59:59')) : ''
          var start = startStr ? new Date(startStr.replace(/-/g, '/')).getTime() : 0
          var end = endStr ? new Date(endStr.replace(/-/g, '/')).getTime() : Infinity
          if (!isNaN(start) && !isNaN(end) && end < now) continue // 过期不展示
          parsed.push({ s: s, start: start, end: end, startStr: startStr })
        }
        // 排序：进行中的在前（更早结束的靠前），未开始的按开始时间正序
        parsed.sort(function(a, b) {
          var aActive = a.start <= now
          var bActive = b.start <= now
          if (aActive !== bActive) return aActive ? -1 : 1
          if (aActive) {
            var ae = (a.end !== Infinity) ? a.end : 8640000000000000
            var be = (b.end !== Infinity) ? b.end : 8640000000000000
            return ae - be
          }
          return a.start - b.start
        })
        var top = parsed[0]
        if (!top) {
          self.setData({ swarmItem: null })
          return
        }
        var s = top.s
        var start = top.start
        var end = top.end
        var active = start && start <= now
        var timeText = ''
        if (top.startStr) timeText = (s.startDate || '') + (s.startTime ? ' ' + s.startTime : '') + (s.endDate ? ' ~ ' + s.endDate + (s.endTime ? ' ' + s.endTime : '') : '')
        var countdownText = ''
        if (!active && start) {
          var sdiff = start - now
          var sprefix = sdiff < 86400000 ? 'countdownOnline' : 'countdownNextSwarm'
          countdownText = i18n.formatCountdown(sdiff, sprefix, 'countdownEnded') || ''
        } else if (active && end && end !== Infinity && end > now) {
          countdownText = i18n.formatCountdown(end - now, 'countdownOffline', 'countdownEnded') || ''
        }
        var images = []
        if (s.images && s.images.length) {
          for (var ii = 0; ii < s.images.length; ii++) {
            if (s.images[ii]) images.push(s.images[ii])
          }
        }
        if (!images.length && s.image) images = [s.image]
        if (!images.length && s.forms && s.forms.length) {
          for (var f = 0; f < s.forms.length; f++) {
            var fi = (s.forms[f] && s.forms[f].image) ? s.forms[f].image : ''
            if (fi) { images.push(fi) }
          }
        }
        var cover = images[0] || ''
        var desc = s.desc || ''
        if (!desc && s.forms && s.forms.length) {
          var notes = []
          for (var n = 0; n < s.forms.length; n++) {
            var note = (s.forms[n] && (s.forms[n].note || s.forms[n].desc)) || ''
            var label = (s.forms[n] && s.forms[n].label) || ''
            if (note) notes.push((label ? label + '：' : '') + note)
          }
          desc = notes.join('；')
        }
        self.setData({
          swarmItem: {
            id: s._id || 'swarm_0',
            name: (s.name || '精灵出没'),
            image: cover,
            images: images,
            location: s.location || '',
            desc: desc,
            time: timeText,
            active: !!active,
            badge: active ? '出没中' : '即将出没',
            startTs: start || 0,
            endTs: (end !== Infinity) ? end : 0,
            countdownText: countdownText
          }
        })
      })
      .catch(function() { self.setData({ swarmItem: null }) })
    // ── 远行商人：独立卡片，只读 currentSelling ──
    db.collection('page_config').doc('merchant').get()
      .then(function(res) {
        var d = res.data || {}
        var selling = d.currentSelling || ''
        var items = []
        var now = Date.now()
        var bulkTs = d.offlineTime
        if (bulkTs && typeof bulkTs === 'object' && bulkTs.getTime) bulkTs = bulkTs.getTime()
        if (!(bulkTs && typeof bulkTs === 'number' && bulkTs > 1e12)) {
          bulkTs = 0
          if (d.offlineDate) {
            var bulk = d.offlineDate + ' ' + ((d.offlineTimeStr && d.offlineTimeStr !== '23:59') ? d.offlineTimeStr + ':00' : '23:59:59')
            var bts = new Date(bulk.replace(/-/g, '/')).getTime()
            if (!isNaN(bts)) bulkTs = bts
          }
        }
        if (typeof selling === 'string' && selling) {
          var lines = selling.split('\n')
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim()
            if (!line) continue
            var parts = line.split('|')
            if (!parts[0] || !parts[0].trim()) continue
            var offlineDate = (parts.length > 7) ? (parts[7] || '').trim() : ''
            var offlineTimeStr = (parts.length > 8) ? (parts[8] || '').trim() : '23:59'
            if (offlineDate) {
              var endStr = offlineDate + ' ' + (offlineTimeStr === '23:59' ? '23:59:59' : offlineTimeStr + ':00')
              var endTime = new Date(endStr.replace(/-/g, '/')).getTime()
              if (!isNaN(endTime) && now >= endTime) continue
            } else if (bulkTs && now >= bulkTs) {
              continue
            }
            var price = parseInt(parts[1]) || 0
            var limitCount = (parts.length > 6) ? (parts[6] || '').trim() : ''
            items.push({
              name: parts[0].trim(),
              price: price,
              effect: (parts.length > 2) ? parts[2].trim() : '',
              image: (parts.length > 5) ? (parts[5] || '').trim() : '',
              limitCount: limitCount,
              offlineDate: offlineDate,
              offlineTimeStr: offlineTimeStr,
              offlineLabel: offlineDate ? (offlineDate + ' ' + (offlineTimeStr === '23:59' ? '24:00' : (offlineTimeStr || '24:00'))) : ''
            })
          }
        }
        if (!items.length) {
          self.setData({
            merchantCard: {
              items: [],
              normalItems: [],
              limitedItems: [],
              desc: (i18n.i18n[i18n.getLanguage()].broadcastMaintain || '运营数据维护中'),
              badge: '',
              bulkTs: bulkTs || 0,
              normalCountdown: '',
              normalOfflineLabel: ''
            }
          })
          return
        }
        var normalItems = []
        var limitedItems = []
        var pad2 = function(n) { return n < 10 ? '0' + n : '' + n }
        for (var q = 0; q < items.length; q++) {
          var gi = Object.assign({}, items[q])
          var gexp = gi.offlineDate
            ? new Date((gi.offlineDate + ' ' + (gi.offlineTimeStr === '23:59' ? '23:59:59' : (gi.offlineTimeStr || '23:59:59'))).replace(/-/g, '/')).getTime()
            : bulkTs
          gi.remainText = (gexp && !isNaN(gexp) && gexp > Date.now())
            ? (i18n.formatDuration(Math.floor((gexp - Date.now()) / 1000)) || '')
            : (gi.offlineDate ? (i18n.i18n[i18n.getLanguage()].countdownDelisted || '已下架') : '')
          if (gi.offlineDate) limitedItems.push(gi)
          else normalItems.push(gi)
        }
        var normalOfflineLabel = ''
        if (bulkTs && bulkTs > 0) {
          var bd = new Date(bulkTs)
          normalOfflineLabel = bd.getFullYear() + '-' + pad2(bd.getMonth() + 1) + '-' + pad2(bd.getDate()) + ' ' + pad2(bd.getHours()) + ':' + pad2(bd.getMinutes())
        }
        var normalCountdown = (bulkTs && bulkTs > Date.now())
          ? (i18n.formatDuration(Math.floor((bulkTs - Date.now()) / 1000)) || '')
          : (bulkTs ? (i18n.i18n[i18n.getLanguage()].countdownDelisted || '已下架') : '')
        self.setData({
          merchantCard: {
            items: items,
            normalItems: normalItems,
            limitedItems: limitedItems,
            desc: '',
            badge: '在售',
            bulkTs: bulkTs || 0,
            normalCountdown: normalCountdown,
            normalOfflineLabel: normalOfflineLabel
          }
        })
      })
      .catch(function() {})
  },
  loadBanner: function() {
    var self = this
    if (!db) return
    db.collection('site_config').doc('banner').get()
      .then(function(res) {
        var d = res.data || {}
        var raw = d.urls && d.urls.length ? d.urls : (d.url && d.url !== 'none' ? [d.url] : [])
        raw = raw.map(function(s) { return (s || '').trim() }).filter(function(s) {
          return s && s !== 'none' && s.indexOf('example.com') === -1
        })
        // cloud:// 转临时链接
        var cloudIds = raw.filter(function(s) { return s.indexOf('cloud://') === 0 })
        var httpUrls = raw.filter(function(s) { return s.indexOf('cloud://') !== 0 })
        var finish = function(list) {
          self.setData({
            bannerUrls: list,
            bannerUrl: list[0] || '',
            bannerInput: list.join('\n')
          })
        }
        if (!cloudIds.length) { finish(httpUrls); return }
        wx.cloud.getTempFileURL({
          fileList: cloudIds,
          success: function(fileRes) {
            var map = {}
            var fl = (fileRes && fileRes.fileList) || []
            for (var i = 0; i < fl.length; i++) {
              if (fl[i].tempFileURL) map[fl[i].fileID] = fl[i].tempFileURL
            }
            var resolved = cloudIds.map(function(id) { return map[id] || '' }).filter(Boolean)
            finish(httpUrls.concat(resolved))
          },
          fail: function() { finish(httpUrls) }
        })
      })
      .catch(function(e) { console.error(e) })
  },
  loadIcp: function() {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function(res) {
        if (res.data && res.data.icp) {
          self.setData({ icp: res.data.icp })
        }
      })
      .catch(function(e) { console.error(e) })
  },

  updateCountdowns: function() {
    var list = this.data.announcements;
    if (!list || list.length === 0) return;
    var now = Date.now();
    var countdowns = this.data.countdowns || {};
    var changed = false;
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var display = '';
      if (item.autoOnlineTime && item.autoOnlineTime > now) {
        display = i18n.formatCountdown(item.autoOnlineTime - now, 'countdownOnline', 'countdownEnded')
      } else if (item.autoDeleteTime) {
        var diff = item.autoDeleteTime - now;
        if (diff > 0) {
          display = i18n.formatCountdown(diff, 'countdownOffline', 'countdownEnded')
        } else {
          display = i18n.i18n[i18n.getLanguage()].countdownEnded || '已结束'
        }
      }
      if (countdowns[i] !== display) {
        countdowns[i] = display;
        changed = true;
      }
    }
    if (changed) {
      this.setData({ countdowns: countdowns });
    }
  },
  _applyAnnouncementList: function(list) {
    var self = this
    list = list || []
    var now = Date.now()
    var filtered = []
    for (var i = 0; i < list.length; i++) {
      list[i].timeStr = self.formatTime(list[i].createTime);
      if (list[i].startDate) {
        var sd = list[i].startDate.replace(/-/g, '/');
        if (sd.length <= 10) sd += ' 00:00:00';
        list[i].autoOnlineTime = new Date(sd).getTime();
      }
      if (list[i].endDate) {
        var ed = list[i].endDate.replace(/-/g, '/');
        if (ed.length <= 10) ed += ' 23:59:59';
        list[i].autoDeleteTime = new Date(ed).getTime();
      }
      // 管理员看到所有，普通用户看不到未到上线时间或已过期的
      var onlineOk = self.data.isAdmin || !list[i].autoOnlineTime || list[i].autoOnlineTime <= now
      var deleteOk = self.data.isAdmin || !list[i].autoDeleteTime || list[i].autoDeleteTime > now
      if (onlineOk && deleteOk) {
        filtered.push(list[i])
      }
    }
    cloudUrl.convertList(filtered, 'image', function(converted) {
      localizeItems(converted)
      self.setData({ announcements: converted, countdowns: {} })
      self.updateCountdowns();
    })
  },
  loadAnnouncements: function() {
    var self = this
    if (!db) return
    db.collection('announcements')
      .where({
        type: db.command.neq('event')
      })
      .orderBy('pinned', 'desc')
      .orderBy('createTime', 'desc')
      .limit(10)
      .get()
      .then(function(res) {
        self._applyAnnouncementList(res.data || [])
      })
      .catch(function(e) { console.error(e) })
  },
  _startAnnouncementsWatch: function() {
    var self = this
    if (!db || self._announcementsWatcher) return
    try {
      self._announcementsWatcher = db.collection('announcements')
        .where({ type: db.command.neq('event') })
        .orderBy('pinned', 'desc')
        .orderBy('createTime', 'desc')
        .limit(10)
        .watch({
          onChange: function(snapshot) {
            if (!snapshot || !snapshot.docs) return
            self._applyAnnouncementList(snapshot.docs)
          },
          onError: function(err) {
            console.error('watch announcements error', err)
          }
        })
    } catch (e) {
      console.error('watch announcements failed', e)
    }
  },
  _stopAnnouncementsWatch: function() {
    if (this._announcementsWatcher) {
      try { this._announcementsWatcher.close() } catch (e) {}
      this._announcementsWatcher = null
    }
  },
  refreshAnnouncements: function() {
    this.loadAnnouncements()
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date)
    var rel = i18n.formatRelativeTime(d.getTime())
    if (rel) return rel
    return (d.getMonth() + 1) + '/' + d.getDate()
  },
  go: function(e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
      fail: function(err) {
        console.error("导航失败:", url, err)
        wx.showToast({ title: '页面加载失败', icon: 'none' })
      }
    })
  },
  goAbout: function() { wx.navigateTo({ url: '/pages/about/about' }) },
  goAdmin: function() { wx.navigateTo({ url: '/pages/admin/admin' }) },

  showAnnouncement: function(e) {
    var idx = e.currentTarget.dataset.i
    if (this.data.expandedIndex === idx) {
      this.setData({ expandedIndex: -1 })
    } else {
      this.setData({ expandedIndex: idx })
    }
  },
  previewAnnouncementImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) {
      wx.previewImage({ current: src, urls: [src] })
    }
  },
  onAnnouncementImageError: function(e) {
    var idx = e.currentTarget.dataset.index
    var announcements = this.data.announcements
    if (announcements[idx]) {
      announcements[idx].image = ''
      this.setData({ announcements: announcements })
    }
  },
  subscribeAnnouncement: function() {
    var self = this
    if (self.data.subscribedAnnouncement) {
      wx.showToast({ title: '已订阅公告通知', icon: 'none' })
      return
    }
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    var currentCount = self.data.subscribeCount || 0
    if (currentCount >= 99) {
      wx.showToast({ title: '已达上限99条', icon: 'none' })
      return
    }
    notify.requestAndSave(['announcement'], function(err, result) {
      if (err) {
        if (!err.noConfig) {
          console.error('公告订阅失败:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: '请先登录后再设置', icon: 'none' })
          } else {
            wx.showToast({ title: '设置失败，请重试', icon: 'none' })
          }
        }
        return
      }
      if (result.announcement === 'accept') {
        self.checkSubscription()
      } else if (result.announcement === 'reject') {
        wx.showToast({ title: '已拒绝通知', icon: 'none' })
      } else if (result.announcement === 'ban') {
        wx.showModal({
          title: '通知已关闭',
          content: '您已关闭该类通知，请在小程序设置中手动开启',
          confirmText: '去设置',
          success: function(modalRes) {
            if (modalRes.confirm) { wx.openSetting({}) }
          }
        })
      } else {
        wx.showToast({ title: '操作已取消', icon: 'none' })
      }
    })
  },
  saveSubscription: function(type) {
    var self = this
    if (!db) return
    notify.resolveOpenid(function(openid) {
      if (!openid) return
      notify.upsertSubscriber(db, openid, type, 99, function(err, newCount) {
        if (err) {
          console.error('保存订阅失败:', err)
          wx.showToast({ title: '保存失败，请重试', icon: 'none' })
          return
        }
        wx.showToast({ title: '已添加(' + newCount + '/99)', icon: 'success' })
        self.checkSubscription()
      })
    })
  },
  checkSubscription: function() {
    var self = this
    if (!db) return
    notify.getSubscriptionStatus(function(err, status) {
      if (!err && status) {
        self.setData({
          subscribedMerchant: !!status.merchant,
          merchantSubCount: status.merchantCount || 0,
          subscribedSwarm: !!status.announcement,
          swarmSubCount: status.announcementCount || 0,
          subscribedAnnouncement: !!status.announcement,
          subscribeCount: status.announcementCount || 0
        })
      }
    })
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      wx.setStorageSync('openid', openid)
      db.collection('subscribers').where({ openid: openid, type: 'announcement' }).get()
        .then(function(res) {
          if (res.data.length > 0) {
            self.setData({
              subscribedAnnouncement: res.data[0].status === 'active',
              subscribeCount: res.data[0].count || 0
            })
          }
        })
        .catch(function(e) { console.error(e) })
    }).catch(function(e) { console.error(e) })
  },
  // 右上角订阅按钮：商人上新
  subscribeMerchantFeed: function() {
    var self = this
    if (self.data.subscribedMerchant) {
      wx.showToast({ title: '已订阅商人上新', icon: 'none' })
      return
    }
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    notify.requestAndSave(['merchant'], function(err, result) {
      if (err) return
      if (result && result.merchant === 'accept') {
        self.setData({ subscribedMerchant: true })
        wx.showToast({ title: '已订阅商人上新', icon: 'success' })
      }
    })
  },
  // 右上角订阅按钮：大量出没（走 announcement 通道）
  subscribeSwarmFeed: function() {
    var self = this
    if (self.data.subscribedSwarm) {
      wx.showToast({ title: '已订阅出没通知', icon: 'none' })
      return
    }
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    notify.requestAndSave(['announcement'], function(err, result) {
      if (err) return
      if (result && result.announcement === 'accept') {
        self.setData({ subscribedSwarm: true })
        wx.showToast({ title: '已订阅出没通知', icon: 'success' })
      }
    })
  },
  toggleBannerModal: function() {
    var self = this
    if (!self.data.isAdmin) return
    self.setData({ showBannerModal: !self.data.showBannerModal, bannerInput: self.data.bannerUrl || '' })
  },
  onBannerInput: function(e) { this.setData({ bannerInput: e.detail.value }) },
  chooseBannerImage: function() {
    var self = this
    var chooseFn = wx.chooseMedia || wx.chooseImage
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var filePath = res.tempFiles[0].tempFilePath
          self.uploadBannerFile(filePath)
        },
        fail: function(err) {
          console.error('chooseMedia fail', err)
          if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
            wx.showToast({ title: '选择图片失败: ' + err.errMsg, icon: 'none' })
          }
        }
      })
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var filePath = res.tempFilePaths[0]
          self.uploadBannerFile(filePath)
        },
        fail: function(err) {
          console.error('chooseImage fail', err)
        }
      })
    }
  },
  uploadBannerFile: function(filePath) {
    var self = this
    wx.showLoading({ title: '上传中...' })
    
    // 正则提取图片真实后缀，若提取失败默认使用 jpg，避免 MIME 冲突被存储防火墙拦截
    var extMatch = filePath.match(/\.([a-zA-Z0-9]+)$/)
    var ext = extMatch ? extMatch[1].toLowerCase() : 'jpg'
    
    wx.cloud.uploadFile({
      cloudPath: 'banner/' + Date.now() + '.' + ext,
      filePath: filePath
    }).then(function(uploadRes) {
      wx.hideLoading()
      self.setData({ bannerInput: uploadRes.fileID })
      wx.showToast({ title: '图片上传成功', icon: 'success' })
    }).catch(function(err) {
      console.error('uploadFile fail', err)
      wx.hideLoading()
      var errMsg = err.errMsg || (err.message || '网络连接失败')
      wx.showToast({ title: '上传失败: ' + errMsg, icon: 'none' })
    })
  },
  saveBanner: function() {
    var self = this
    if (self.data.bannerSaving || !db) return
    var url = self.data.bannerInput.trim()
    if (!url) { wx.showToast({ title: '请输入图片链接', icon: 'none' }); return }
    self.setData({ bannerSaving: true })
    db.collection('site_config').doc('banner').get()
      .then(function() {
        return db.collection('site_config').doc('banner').update({ data: { url: url, updateTime: db.serverDate() } })
      })
      .catch(function(err) {
        console.warn('Doc banner get or update failed, try add', err)
        return db.collection('site_config').add({ data: { _id: 'banner', url: url, updateTime: db.serverDate() } })
      })
      .then(function() {
        self.setData({ bannerSaving: false, showBannerModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadBanner()
      })
      .catch(function(err) {
        console.error('saveBanner fail', err)
        self.setData({ bannerSaving: false })
        var errMsg = err.errMsg || (err.message || '无写入权限')
        wx.showToast({ title: '保存失败: ' + errMsg, icon: 'none' })
      })
  },
  preventClose: function() {},
  playSong: function(e) { mediaPlayer.playSong(this, e) },
  _playBgAudio: function(url, directUrl, name) { mediaPlayer.playBgAudio(this, url, directUrl, name) },
  _playSongFallback: function(url) { mediaPlayer.playSongFallback(url) },
  openIframe: function(e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(url),
      fail: function() {
        wx.showToast({ title: '无法直接打开，请复制链接', icon: 'none' })
      }
    })
  },
  copyIframe: function(e) {
    var url = e.currentTarget.dataset.url
    wx.setClipboardData({
      data: url,
      success: function() {
        wx.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
  },
  copyVideoLink: function(e) {
    var url = e.currentTarget.dataset.url
    wx.setClipboardData({
      data: url,
      success: function() {
        wx.showToast({ title: '视频链接已复制，请在浏览器打开', icon: 'success' })
      }
    })
  },
  openVideo: function(e) {
    var self = this
    var url = e.currentTarget.dataset.url
    var name = e.currentTarget.dataset.name || '视频'

    if (self.data.isPlaying) {
      var bgAudio = wx.getBackgroundAudioManager()
      bgAudio.pause()
      self.setData({ isPlaying: false })
    }

    // 检测视频平台类型
    var isBilibili = /bilibili\.com|b23\.tv/i.test(url) || /BV[a-zA-Z0-9]{10,}/.test(url)
    var isWeibo = /weibo\.(com|cn)/i.test(url)
    var isDouyin = /douyin\.com/i.test(url)
    var isKuaishou = /kuaishou\.com/i.test(url)
    var isXiaohongshu = /xiaohongshu\.com|xhslink\.com/i.test(url)
    var isTencent = /v\.qq\.com/i.test(url)
    var isYoutube = /youtube\.com|youtu\.be/i.test(url)

    // 可以播放或解析的平台
    var isSupported = isBilibili || isWeibo || isDouyin || isKuaishou || isXiaohongshu || isTencent || isYoutube

    if (!isSupported) {
      self._openVideoFallback(url, '未支持的平台')
      return
    }

    wx.showLoading({ title: '解析视频中...' })
    
    // 构造请求参数，优先提取 B站 bvid 以保证向后兼容，其他平台传整个 url
    var callData = {}
    var bvMatch = url.match(/BV[a-zA-Z0-9]{10,}/)
    if (bvMatch) {
      callData.bvid = bvMatch[0]
    } else {
      callData.url = url
    }

    wx.cloud.callFunction({
      name: 'parseBilibili',
      data: callData,
      success: function(res) {
        wx.hideLoading()
        if (res.result && res.result.code === 0 && res.result.data) {
          var data = res.result.data
          var defaultTitle = isBilibili ? 'B站视频' : isWeibo ? '微博视频' : isDouyin ? '抖音视频' : isKuaishou ? '快手视频' : isXiaohongshu ? '小红书视频' : '在线视频'
          var videoTitle = name !== '视频' ? name : (data.title || defaultTitle)
          
          self.setData({
            videoPlayerUrl: data.videoUrl,
            videoPlayerName: videoTitle,
            videoPlayerCover: data.pic || '',
            videoPlayerOwner: data.ownerName || '',
            videoPlayerDesc: data.desc || '',
            showVideoPlayer: true
          })
        } else {
          var errMsg = res.result ? res.result.msg : '解析失败'
          self._openVideoFallback(url, errMsg)
        }
      },
      fail: function(err) {
        console.error('Call parseBilibili failed:', err)
        wx.hideLoading()
        self._openVideoFallback(url, '网络解析错误')
      }
    })
  },
  _openVideoFallback: function(url, reason) {
    var content = '该视频由于版权限制或解析失败，可复制链接观看。'
    if (reason) {
      content = '解析未成功（' + reason + '），可复制链接到浏览器或App中观看。'
    }
    wx.showModal({
      title: '解析提示',
      content: content,
      confirmText: '复制链接',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: url,
            success: function() {
              wx.showToast({ title: '链接已复制', icon: 'success' })
            }
          })
        }
      }
    })
  },
  closeVideoPlayer: function() {
    this.setData({ showVideoPlayer: false, videoPlayerUrl: '', videoPlayerName: '', videoPlayerCover: '', videoPlayerOwner: '', videoPlayerDesc: '' })
  },
  // 多图轮播：按原图比例设高度，完整展示无背景框
  onRichSwiperLoad: function(e) {
    var key = e.currentTarget.dataset.hkey
    if (!key) return
    var w = e.detail.width || 1
    var h = e.detail.height || 1
    // 按容器实际宽约 702rpx 换算，完整显示原图比例
    var hRpx = Math.max(180, Math.round(702 * h / w))
    var map = this.data.richSwiperHeights || {}
    if (map[key] === hRpx) return
    map[key] = hRpx
    this.setData({ richSwiperHeights: map })
  },
  onHeroBannerLoad: function(e) {
    var w = e.detail.width || 1
    var h = e.detail.height || 1
    // 750rpx 全宽下的完整高度，多图取最大，不留黑边
    var hRpx = Math.max(120, Math.round(750 * h / w))
    var maxH = Math.max(this.data.heroSwiperH || 0, hRpx)
    if (this.data.heroSwiperH !== maxH) this.setData({ heroSwiperH: maxH })
  },
  previewRichImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src] })
  },
  openLink: function(e) {
    var url = e.currentTarget.dataset.url
    wx.showModal({
      title: '复制链接',
      content: '由于微信小程序限制，暂不支持直接跳转外部网页。是否复制此链接？\n\n' + url,
      confirmText: '复制',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: url,
            success: function() {
              wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
            }
          })
        }
      }
    })
  },
  downloadAttachment: function(e) {
    var url = e.currentTarget.dataset.url
    var name = e.currentTarget.dataset.name || '附件'
    if (!url) return
    
    wx.showLoading({ title: '加载文件中...' })
    
    var isCloud = url.indexOf('cloud://') === 0
    
    var performOpen = function(localPath) {
      wx.openDocument({
        filePath: localPath,
        showMenu: true,
        success: function() {
          wx.hideLoading()
        },
        fail: function(err) {
          wx.hideLoading()
          wx.showModal({
            title: '预览失败',
            content: '该文件格式暂不支持直接预览。是否复制下载链接？\n\n' + url,
            confirmText: '复制链接',
            success: function(res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data: url,
                  success: function() {
                    wx.showToast({ title: '链接已复制', icon: 'success' })
                  }
                })
              }
            }
          })
        }
      })
    }
    
    if (isCloud) {
      wx.cloud.downloadFile({
        fileID: url,
        success: function(res) {
          performOpen(res.tempFilePath)
        },
        fail: function(err) {
          wx.hideLoading()
          wx.showToast({ title: '文件获取失败', icon: 'none' })
        }
      })
    } else {
      wx.downloadFile({
        url: url,
        filePath: wx.env.USER_DATA_PATH + '/' + name,
        success: function(res) {
          performOpen(res.filePath || res.tempFilePath)
        },
        fail: function(err) {
          wx.hideLoading()
          wx.showToast({ title: '下载失败', icon: 'none' })
        }
      })
    }
  },
  goToActivity: function(e) {
    wx.navigateTo({ url: '/pages/activity/activity' })
  },
  onShareAppMessage: function() {
    return { title: '洛手助手 - 洛克王国攻略', path: '/pages/index/index', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 精灵图鉴·捕捉统计·活动日历', imageUrl: '/images/banner.webp' }
  },
  _initBgAudio: function() { mediaPlayer.initBgAudio(this) },
})

function localizeItems(items) {
  var lang = i18n.getLanguage()
  if (lang === 'zh') return
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    if (item['title_' + lang]) item.title = item['title_' + lang]
    if (item['content_' + lang]) item.content = item['content_' + lang]
  }
}
