var app = getApp()
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')
var adminUtil = require('../../utils/admin')
var activitiesData = [
  { id: 1, title: '异色获取方法', type: '官方权威信息', status: '置顶', start: '', end: '', rewards: [], desc: '通过赛季奇遇、大世界遭遇、生蛋孵蛋、赛季商店兑换等方式获取异色精灵。' }
]
var cloudUrl = require('../../utils/cloudUrl')
var notify = require('../../utils/notify')
var db = null

// 将深色背景下保存的浅色富文本字色转换为适合浅色亮底阅读的高对比度颜色
function adaptRichBlocksForLightTheme(blocks) {
  if (!Array.isArray(blocks)) return []
  var colorMap = {
    '#ffffff': '#1E293B',
    '#fff': '#1E293B',
    'rgba(255,255,255,0.5)': '#64748B',
    'rgba(255,255,255,0.3)': '#94A3B8',
    '#00d4ff': '#0284C7',
    '#4dc9f6': '#0284C7',
    '#00e676': '#16A34A',
    '#ffd700': '#D97706',
    '#ffcc00': '#D97706',
    '#ffab40': '#EA580C'
  }
  return blocks.map(function(b) {
    if (!b || typeof b !== 'object') return b
    var copy = Object.assign({}, b)
    if (copy.color) {
      var lc = String(copy.color).trim().toLowerCase()
      if (colorMap[lc]) copy.color = colorMap[lc]
    } else {
      copy.color = '#1E293B'
    }
    if (copy.html && typeof copy.html === 'string') {
      copy.html = copy.html
        .replace(/color\s*:\s*(#fff(?:fff)?|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))/gi, 'color:#1E293B')
        .replace(/color\s*:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[35]\s*\)/gi, 'color:#64748B')
    }
    return copy
  })
}

// 富文本块内的 cloud:// 封面/图片转临时链接
function convertRichCloudUrls(list, callback) {
  if (!list || !list.length || !wx.cloud) { callback(list); return }
  var result = list.map(function(item) {
    var copy = Object.assign({}, item)
    if (copy.richContent && copy.richContent.length) {
      copy.richContent = copy.richContent.map(function(b) { return Object.assign({}, b) })
    }
    return copy
  })
  var fileIDs = []
  var map = []
  function push(val, itemIndex, blockIndex, field) {
    if (val && typeof val === 'string' && val.indexOf('cloud://') === 0) {
      if (fileIDs.indexOf(val) === -1) fileIDs.push(val)
      map.push({ itemIndex: itemIndex, blockIndex: blockIndex, field: field, fileID: val })
    }
  }
  for (var i = 0; i < result.length; i++) {
    var blocks = result[i].richContent || []
    for (var j = 0; j < blocks.length; j++) {
      var b = blocks[j]
      push(b.url, i, j, 'url')
      push(b.cover, i, j, 'cover')
      if (b.urls && b.urls.length) {
        for (var u = 0; u < b.urls.length; u++) push(b.urls[u], i, j, 'urls:' + u)
      }
    }
  }
  if (!fileIDs.length) { callback(result); return }
  wx.cloud.getTempFileURL({ fileList: fileIDs }).then(function(res) {
    var urlMap = {}
    if (res.fileList) {
      for (var k = 0; k < res.fileList.length; k++) {
        if (res.fileList[k].tempFileURL) urlMap[res.fileList[k].fileID] = res.fileList[k].tempFileURL
      }
    }
    for (var m = 0; m < map.length; m++) {
      var rec = map[m]
      var url = urlMap[rec.fileID]
      if (!url) continue
      var block = result[rec.itemIndex].richContent[rec.blockIndex]
      if (rec.field.indexOf('urls:') === 0) {
        block.urls[parseInt(rec.field.slice(5), 10)] = url
      } else {
        block[rec.field] = url
      }
    }
    callback(result)
  }).catch(function() { callback(result) })
}

Page({
  behaviors: [i18nBehavior, require('../../utils/padLayoutBehavior')],
  data: { theme: 'light', activities: [], filtered: [], status: '进行中', statuses: ['进行中','全部','置顶'], hasPinnedInFiltered: false, hasNormalInFiltered: false, expandedId: -1, collapsedMap: {}, isAdmin: false, showEditModal: false, editingItem: null, editTitle: '', editDesc: '', editStatus: '进行中', editType: '', editRewards: '', editStart: '', editEnd: '', subscribedActivity: false, subscribeCount: 0, currentPlayUrl: '', isPlaying: false, showVideoPlayer: false, videoPlayerUrl: '', videoPlayerName: '', videoPlayerCover: '', videoPlayerOwner: '', videoPlayerDesc: '', richSwiperHeights: {}, seasonLogoUrl: 'https://img.remit.ee/i/WX0FEAjMVvvY', seasonBoard: null, boardExpanded: true, boardFilter: 'live', boardLiveCount: 0, boardTotalCount: 0, expandedBarId: '', ganttMonths: [], ganttGroups: [], ganttWidth: 1200, countdownItems: [], boardCountdowns: {} },
  onShow: function() {
    this._refreshI18n()
    this.setData({ theme: app.globalData.theme })
    if (wx.cloud) db = wx.cloud.database()
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    this.setData({ subscribeConfig: subscribeConfig })
    this.checkAdmin()
    this.checkSubscription()
    this.loadSeasonLogo()
    this.loadSeasonBoard()
  },
  loadSeasonLogo: function() {
    var self = this
    var defaultLogo = 'https://img.remit.ee/i/WX0FEAjMVvvY'
    var cached = wx.getStorageSync('season_logo_url')
    if (cached && cached !== 'https://img.remit.ee/i/ZQZBWvDqP4rG') {
      self.setData({ seasonLogoUrl: cached })
    }
    if (!db) return
    db.collection('site_config').doc('season_logo').get().then(function(res) {
      var u = (res.data && res.data.url) ? String(res.data.url).trim() : ''
      if (u === 'https://img.remit.ee/i/ZQZBWvDqP4rG') u = defaultLogo
      if (u) {
        wx.setStorageSync('season_logo_url', u)
        self.setData({ seasonLogoUrl: u })
      }
    }).catch(function() {})
  },
  checkAdmin: function() {
    var self = this
    if (!db) { self.sortActivities(); return }
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) { self.setData({ isAdmin: false }); self.sortActivities(); return }
    if (wx.getStorageSync('is_admin_user')) {
      self.setData({ isAdmin: true })
    }
    adminUtil.checkAdmin(self, function(isAdmin) {
      self.setData({ isAdmin: !!isAdmin })
      self.sortActivities()
    })
  },
  _parseActivityBoundary: function(dateStr, timeStr, isEnd) {
    var m = String(dateStr || '').match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/)
    if (!m) return null
    var y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, d = parseInt(m[3], 10)
    var hh = isEnd ? 23 : 0, mm = isEnd ? 59 : 0, ss = isEnd ? 59 : 0
    var tm = String(timeStr || '').match(/(\d{1,2}):(\d{1,2})/)
    if (tm) {
      hh = parseInt(tm[1], 10)
      mm = parseInt(tm[2], 10)
      ss = isEnd ? 59 : 0
    }
    return new Date(y, mo, d, hh, mm, ss).getTime()
  },
  _calcActivityDateStatus: function(start, startTime, end, endTime, nowMs) {
    var sMs = this._parseActivityBoundary(start, startTime, false)
    var eMs = this._parseActivityBoundary(end, endTime, true)
    if (sMs !== null && nowMs < sMs) return '即将开始'
    if (eMs !== null && nowMs > eMs) return '已结束'
    return '进行中'
  },
  sortActivities: function() {
    var self = this
    var nowMs = Date.now()
    var baseList = activitiesData.map(function(item) {
      var copy = Object.assign({}, item)
      copy.hasDate = !!(copy.start || copy.end)
      copy.dateStatus = self._calcActivityDateStatus(copy.start, copy.startTime, copy.end, copy.endTime, nowMs)
      return copy
    })
    if (db) {
      db.collection('announcements').where({ type: 'event' }).orderBy('createTime', 'desc').limit(50).get()
        .then(function(res) {
          var lang = i18n.getLanguage()
          var cloudActivities = (res.data || []).map(function(item) {
            var title = (lang !== 'zh' && item['title_' + lang]) ? item['title_' + lang] : item.title
            var desc = (lang !== 'zh' && item['content_' + lang]) ? item['content_' + lang] : item.content
            var start = item.start || item.startDate || ''
            var end = item.end || item.endDate || ''
            var startTime = item.startTime || ''
            var endTime = item.endTime || ''
            var dateStatus = self._calcActivityDateStatus(start, startTime, end, endTime, nowMs)
            return {
              id: item._id,
              title: title,
              desc: desc,
              // 富文本/联动字段必须带上，否则视频卡片、联动Logo会丢
              richContent: adaptRichBlocksForLightTheme(item.richContent || []),
              subType: item.subType || '',
              collabLogo: item.collabLogo || '',
              status: item.pinned ? '置顶' : dateStatus,
              dateStatus: dateStatus,
              hasDate: !!(start || end),
              pinned: !!item.pinned,
              type: item.type || '',
              rewards: item.rewards || [],
              start: start,
              end: end,
              startTime: startTime,
              endTime: endTime,
              source: item.source || '',
              isCloud: true
            }
          })
          var all = baseList.concat(cloudActivities)
          self.setData({ activities: all })
          self.filterList()
          cloudUrl.convertList(all, ['image', 'collabLogo'], function(converted) {
            convertRichCloudUrls(converted, function(finalList) {
              self.setData({ activities: finalList })
              self.filterList()
            })
          })
        })
        .catch(function() {
          self.setData({ activities: baseList })
          self.filterList()
        })
    } else {
      self.setData({ activities: baseList })
      self.filterList()
    }
  },
  filterList: function() {
    var sorted = this.data.activities.slice()
    sorted.sort(function(a, b) {
      var ap = a.pinned || a.status === '置顶'
      var bp = b.pinned || b.status === '置顶'
      if (ap && !bp) return -1
      if (!ap && bp) return 1
      var statusOrder = { '进行中': 0, '即将开始': 1, '已结束': 2 }
      var sa = a.dateStatus || a.status
      var sb = b.dateStatus || b.status
      var orderA = statusOrder[sa] !== undefined ? statusOrder[sa] : 3
      var orderB = statusOrder[sb] !== undefined ? statusOrder[sb] : 3
      if (orderA !== orderB) return orderA - orderB
      if (a.start && b.start) return b.start.localeCompare(a.start)
      return 0
    })
    var s = this.data.status
    var filtered = []
    if (s === '全部') {
      filtered = sorted
    } else if (s === '置顶') {
      for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].pinned || sorted[i].status === '置顶') filtered.push(sorted[i])
      }
    } else if (s === '进行中') {
      var activeWithDate = []
      var activeAll = []
      for (var j = 0; j < sorted.length; j++) {
        var it = sorted[j]
        var ds = it.dateStatus || (it.status === '置顶' ? '进行中' : it.status)
        if (ds === '进行中') {
          activeAll.push(it)
          if (it.hasDate || !it.pinned) activeWithDate.push(it)
        }
      }
      filtered = activeWithDate.length > 0 ? activeWithDate : activeAll
    } else {
      for (var k = 0; k < sorted.length; k++) {
        if (sorted[k].status === s || sorted[k].dateStatus === s) filtered.push(sorted[k])
      }
    }
    var hasPinned = false, hasNormal = false
    for (var m = 0; m < filtered.length; m++) {
      if (filtered[m].pinned || filtered[m].status === '置顶') hasPinned = true
      else hasNormal = true
    }
    this.setData({ activities: sorted, filtered: filtered, hasPinnedInFiltered: hasPinned, hasNormalInFiltered: hasNormal })
  },
  onStatus: function(e) {
    this.setData({ status: e.currentTarget.dataset.s })
    this.filterList()
  },
  onExpand: function(e) {
    var id = e.currentTarget.dataset.id
    var map = Object.assign({}, this.data.collapsedMap || {})
    map[id] = !map[id]
    this.setData({ collapsedMap: map })
  },
  onAddActivity: function() {
    this.setData({ showEditModal: true, editingItem: null, editTitle: '', editDesc: '', editStatus: '进行中', editType: '活动', editRewards: '', editStart: '', editEnd: '', })
  },
  onEditActivity: function(e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      showEditModal: true, editingItem: item,
      editTitle: item.title, editDesc: item.desc, editStatus: item.status,
      editType: item.type || '', editRewards: (item.rewards || []).join('\n'),
      editStart: item.start || '', editEnd: item.end || ''
    })
  },
  onCloseModal: function() { this.setData({ showEditModal: false }) },
  preventClose: function() {},
  onEditInput: function(e) { this.setData({ editTitle: e.detail.value }) },
  onDescInput: function(e) { this.setData({ editDesc: e.detail.value }) },
  onTypeInput: function(e) { this.setData({ editType: e.detail.value }) },
  onRewardsInput: function(e) { this.setData({ editRewards: e.detail.value }) },
  onStartInput: function(e) { this.setData({ editStart: e.detail.value }) },
  onEndInput: function(e) { this.setData({ editEnd: e.detail.value }) },
  onStatusChange: function(e) { var statuses = ['进行中','即将开始','置顶']; this.setData({ editStatus: statuses[e.detail.value] }) },
        importActivityFile: function() {
    var self = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xml', 'docx'],
      success: function(res) {
        var file = res.tempFiles[0]
        var ext = file.name.split('.').pop().toLowerCase()
        wx.showLoading({ title: '解析中...' })
        if (ext === 'xml') {
          wx.getFileSystemManager().readFile({
            filePath: file.path,
            encoding: 'utf8',
            success: function(readRes) {
              wx.hideLoading()
              var content = readRes.data
              var lines = content.split('\n')
              var text = ''
              for (var i = 0; i < lines.length; i++) {
                var line = lines[i].replace(/<[^>]+>/g, '').trim()
                if (line) text += line + '\n'
              }
              self.setData({ editDesc: (self.data.editDesc ? self.data.editDesc + '\n' : '') + text.trim() })
              wx.showToast({ title: '导入成功', icon: 'success' })
            },
            fail: function() {
              wx.hideLoading()
              wx.showToast({ title: '读取失败', icon: 'none' })
            }
          })
        } else {
          wx.cloud.uploadFile({
            cloudPath: 'temp/' + Date.now() + '.' + ext,
            filePath: file.path
          }).then(function(uploadRes) {
            return wx.cloud.callFunction({
              name: 'parseFile',
              data: { fileID: uploadRes.fileID, fileType: ext }
            })
.catch(function(err) { console.error("Cloud call failed", err); })
          }).then(function(parseRes) {
            wx.hideLoading()
            if (parseRes.result && parseRes.result.success) {
              self.setData({ editDesc: (self.data.editDesc ? self.data.editDesc + '\n' : '') + parseRes.result.content })
              wx.showToast({ title: '导入成功', icon: 'success' })
            } else {
              wx.showToast({ title: parseRes.result ? parseRes.result.error : '解析失败', icon: 'none' })
            }
          }).catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '导入失败', icon: 'none' })
          })
        }
      }
    })
  },
  onSubmitActivity: function() {
    var self = this
    if (self.data.submitting) return
    var title = self.data.editTitle.trim()
    var desc = self.data.editDesc.trim()
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return }
    self.setData({ submitting: true })
    var rewards = self.data.editRewards ? self.data.editRewards.split('\n').filter(function(r) { return r.trim() }) : []
    var data = { title: title, content: desc, type: 'event', pinned: self.data.editStatus === '置顶', rewards: rewards, start: self.data.editStart, end: self.data.editEnd, updateTime: db.serverDate() }
    var promise = self.data.editingItem && self.data.editingItem.isCloud
      ? db.collection('announcements').doc(self.data.editingItem.id).update({ data: data })
      : (data.createTime = db.serverDate(), data.author = app.globalData.userInfo ? app.globalData.userInfo.nickName : 'Admin', db.collection('announcements').add({ data: data }))
    promise.then(function() {
      self.setData({ submitting: false, showEditModal: false, editingItem: null })
      wx.showToast({ title: '操作成功', icon: 'success' })
      self.sortActivities()
      notify.pushToSubscribers('activity', notify.smartTruncate(title, 20), notify.smartTruncate(desc, 20), '/pages/activity/activity')
    }).catch(function() { self.setData({ submitting: false }); wx.showToast({ title: '操作失败', icon: 'none' }) })
  },
  onDeleteActivity: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!item.isCloud || !db) { wx.showToast({ title: '本地活动无法删除', icon: 'none' }); return }
    wx.showModal({
      title: '删除活动', content: '确定删除该活动？',
      success: function(res) {
        if (res.confirm) {
          db.collection('announcements').doc(item.id).remove()
            .then(function() { wx.showToast({ title: '已删除', icon: 'success' }); self.sortActivities() })
            .catch(function() { wx.showToast({ title: '删除失败', icon: 'none' }) })
        }
      }
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  subscribeActivity: function() {
    var self = this
    if (!app.globalData.userInfo) { wx.showToast({ title: '请先登录', icon: 'none' }); return }
    var currentCount = self.data.subscribeCount || 0
    if (currentCount >= 99) { wx.showToast({ title: '已达上限99条', icon: 'none' }); return }
    notify.requestAndSave(['activity'], function(err, result) {
      if (err) {
        if (!err.noConfig) wx.showToast({ title: '设置失败，请重试', icon: 'none' })
        return
      }
      if (result.activity === 'accept') {
        self.saveSubscription('activity')
      } else if (result.activity === 'reject') {
        wx.showToast({ title: '已拒绝通知', icon: 'none' })
      } else if (result.activity === 'ban') {
        wx.showModal({
          title: '通知已关闭',
          content: '您已关闭该类通知，请在小程序设置中手动开启',
          confirmText: '去设置',
          success: function(modalRes) {
            if (modalRes.confirm) {
              wx.openSetting({})
            }
          }
        })
      }
    })
  },
  checkSubscription: function() {
    var self = this
    if (!db) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      if (!openid) return
      wx.setStorageSync('openid', openid)
      db.collection('subscribers').where({ openid: openid, type: 'activity' }).get()
        .then(function(res) {
          if (res.data.length > 0) {
            self.setData({ subscribedActivity: res.data[0].status === 'active', subscribeCount: res.data[0].count || 0 })
          }
        })
        .catch(function() {})
    }).catch(function() {})
  },
  saveSubscription: function(type) {
    var self = this
    if (!db) return
    var openid = ''
    try {
      var res = wx.getStorageSync('openid')
      if (res) openid = res
    } catch (e) {}
    if (!openid) {
      wx.cloud.callFunction({
        name: 'login',
        timeout: 3000,
        success: function(loginRes) {
          if (loginRes.result && loginRes.result.openid) {
            openid = loginRes.result.openid
            wx.setStorageSync('openid', openid)
            self.doSaveSubscription(type, openid)
          }
        },
        fail: function() {}
      })
.catch(function(err) { console.error("Cloud call failed", err); })
    } else {
      self.doSaveSubscription(type, openid)
    }
  },
  doSaveSubscription: function(type, openid) {
    var self = this
    db.collection('subscribers').where({ openid: openid, type: type }).get()
      .then(function(res) {
        if (res.data.length > 0) {
          var sub = res.data[0]
          var newCount = (sub.count || 0) + 1
          if (newCount > 99) newCount = 99
          return db.collection('subscribers').doc(sub._id).update({
            data: { count: newCount, status: 'active', updateTime: db.serverDate() }
          }).then(function() {
            wx.showToast({ title: '已添加(' + newCount + '/99)', icon: 'success' })
            self.checkSubscription()
          })
        } else {
          return db.collection('subscribers').add({
            data: {
              openid: openid,
              type: type,
              count: 1,
              status: 'active',
              createTime: db.serverDate()
            }
          }).then(function() {
            wx.showToast({ title: '已添加(1/99)', icon: 'success' })
            self.checkSubscription()
          })
        }
      })
      .catch(function(err) {
        console.error('保存订阅失败:', err)
        wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      })
  },
  _initBgAudio: function() {
    var self = this
    if (self._bgAudioInited) return
    self._bgAudioInited = true
    var bgAudio = wx.getBackgroundAudioManager()
    bgAudio.onPlay(function() { self.setData({ isPlaying: true }) })
    bgAudio.onPause(function() { self.setData({ isPlaying: false }) })
    bgAudio.onStop(function() { self.setData({ isPlaying: false, currentPlayUrl: '' }) })
    bgAudio.onEnded(function() { self.setData({ isPlaying: false, currentPlayUrl: '' }) })
    bgAudio.onError(function(res) {
      console.error('Audio play error:', res)
      self.setData({ isPlaying: false, currentPlayUrl: '' })
      wx.showModal({
        title: '播放失败',
        content: '音频加载失败(错误码 10001)。这可能是因为：\n1. 该歌曲属VIP或版权限制，无法直接播放外链；\n2. 微信开发者工具未开启"不校验合法域名"设置；\n建议复制链接到浏览器或音乐App中打开听歌。',
        showCancel: false
      })
    })
  },
  playSong: function(e) {
    var self = this
    self._initBgAudio()
    var url = e.currentTarget.dataset.url
    var name = e.currentTarget.dataset.name || '推荐单曲'
    
    var directUrl = null
    if (/\.(mp3|m4a|wav|aac|mp4|ogg)($|\?)/i.test(url)) {
      directUrl = url
    } else if (url.indexOf('163.com') > -1 || url.indexOf('163cn.tv') > -1) {
      var idMatch = url.match(/(?:id=|song\/)(\d+)/)
      if (idMatch && idMatch[1]) {
        directUrl = 'https://music.163.com/song/media/outer/url?id=' + idMatch[1] + '.mp3'
      }
    }
    
    if (directUrl) {
      self._playBgAudio(url, directUrl, name)
      return
    }

    // 无法本地直接解析（如 QQ 音乐），调用云函数解析
    var isQQ = /qq\.com|qqmusic/i.test(url)
    var isNetEase = /163\.com|163cn\.tv/i.test(url)
    if (isQQ || isNetEase) {
      wx.showLoading({ title: '加载音乐中...' })
      wx.cloud.callFunction({
        name: 'parseBilibili',
        data: { url: url },
        success: function(res) {
          wx.hideLoading()
          if (res.result && res.result.code === 0 && res.result.data && res.result.data.videoUrl) {
            var musicUrl = res.result.data.videoUrl
            var musicTitle = res.result.data.title || name
            self._playBgAudio(url, musicUrl, musicTitle)
          } else {
            self._playSongFallback(url)
          }
        },
        fail: function(err) {
          console.error('音乐解析失败:', err)
          wx.hideLoading()
          self._playSongFallback(url)
        }
      })
.catch(function(err) { console.error("Cloud call failed", err); })
      return
    }

    self._playSongFallback(url)
  },
  _playBgAudio: function(url, directUrl, name) {
    var self = this
    var bgAudio = wx.getBackgroundAudioManager()
    
    if (self.data.currentPlayUrl === url && self.data.isPlaying) {
      bgAudio.pause()
      self.setData({ isPlaying: false })
      return
    }
    
    self.setData({
      currentPlayUrl: url,
      isPlaying: true
    })
    
    bgAudio.title = name
    bgAudio.epname = '音乐分享'
    bgAudio.singer = '洛手助手'
    bgAudio.src = directUrl
  },
  _playSongFallback: function(url) {
    wx.setClipboardData({
      data: url,
      success: function() {
        wx.showModal({
          title: '听歌链接已复制',
          content: '该音乐暂不支持在小程序内直接播放，已复制链接到剪贴板，请到浏览器或官方音乐APP中打开听歌！',
          showCancel: false
        })
      }
    })
  },
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
  preventClose: function() {},
  // 多图轮播：按原图比例设高度，完整展示无背景框
  onRichSwiperLoad: function(e) {
    var key = e.currentTarget.dataset.hkey
    if (!key) return
    var w = e.detail.width || 1
    var h = e.detail.height || 1
    var hRpx = Math.max(180, Math.round(702 * h / w))
    var map = this.data.richSwiperHeights || {}
    if (map[key] === hRpx) return
    map[key] = hRpx
    this.setData({ richSwiperHeights: map })
  },
  previewRichImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src] })
  },
  closeVideoPlayer: function() {
    this.setData({ showVideoPlayer: false, videoPlayerUrl: '', videoPlayerName: '', videoPlayerCover: '', videoPlayerOwner: '', videoPlayerDesc: '' })
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
    var isBilibili = /bilibili\.com|b23\.tv/i.test(url) || /BV[0-9A-Za-z]{10}/i.test(url)
    var isWeibo = /weibo\.(com|cn)/i.test(url)
    var isDouyin = /douyin\.com/i.test(url)
    var isKuaishou = /kuaishou\.com/i.test(url)
    var isXiaohongshu = /xiaohongshu\.com|xhslink\.com/i.test(url)
    var isTencent = /v\.qq\.com/i.test(url)
    var isYoutube = /youtube\.com|youtu\.be/i.test(url)

    // 可以播放或解析的平台
    var isSupported = isBilibili || isWeibo || isDouyin || isKuaishou || isXiaohongshu || isTencent || isYoutube

    // 视频号在微信外无法解析播放，直接给复制链接引导
    var isWechatChannels = /finder\.video\.qq\.com|channels\.weixin\.qq\.com/i.test(url)
    if (isWechatChannels) {
      wx.showModal({
        title: '视频号视频',
        content: '视频号内容需在微信中观看，可复制链接到微信中打开。',
        confirmText: '复制链接',
        cancelText: '取消',
        success: function(res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: url,
              success: function() {
                wx.showToast({ title: '已复制，去微信中打开', icon: 'none' })
              }
            })
          }
        }
      })
      return
    }

    if (!isSupported) {
      self._openVideoFallback(url, '未支持的平台')
      return
    }

    wx.showLoading({ title: '解析视频中...' })
    
    // 构造请求参数，优先提取 B站 bvid 以保证向后兼容，其他平台传整个 url
    var callData = {}
    var compactUrl = String(url || '').replace(/[\s\u200b\ufeff\u00a0\u3000]+/g, '')
    var bvMatch = compactUrl.match(/BV([0-9A-Za-z]{10})/i)
    if (bvMatch) {
      callData.bvid = 'BV' + bvMatch[1]
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
          if (errMsg && /Unexpected token|JSON|position\s*\d|SyntaxError|request was banned|banned/i.test(errMsg)) {
            errMsg = /banned/i.test(errMsg) ? 'B站风控拦截，请稍后重试' : '接口限流或返回异常'
          }
          self._openVideoFallback(url, errMsg)
        }
      },
      fail: function(err) {
        console.error('Call parseBilibili failed:', err)
        wx.hideLoading()
        self._openVideoFallback(url, '网络解析错误')
      }
    })
.catch(function(err) { console.error("Cloud call failed", err); })
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
  // ── 活动倒计时板块（赛季日历） ──
  toggleBoard: function() {
    this.setData({ boardExpanded: !this.data.boardExpanded })
  },
  onBoardFilter: function(e) {
    var f = e.currentTarget.dataset.filter
    if (!f || f === this.data.boardFilter) return
    this.setData({ boardFilter: f, expandedBarId: '' })
    if (this._rawSeason) this._buildBoard(this._rawSeason)
  },
  onTapGanttBar: function(e) {
    var id = e.currentTarget.dataset.id
    if (!id) return
    this.setData({ expandedBarId: this.data.expandedBarId === id ? '' : id })
  },
  _calMonthLabel: function(y, m) {
    var lang = i18n.getLanguage()
    if (lang === 'zh') return ['一','二','三','四','五','六','七','八','九','十','十一','十二'][m] + '月'
    if (lang === 'ja') return (m + 1) + '月'
    if (lang === 'ko') return (m + 1) + '월'
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m]
  },
  _parseDay: function(str) {
    var m = String(str || '').match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/)
    if (!m) return null
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10))
  },
  _mdText: function(d) {
    return (d.getMonth() + 1) + '.' + (d.getDate() < 10 ? '0' : '') + d.getDate()
  },
  _matchPresetPet: function(title, pets) {
    if (!title || !pets || !pets.length) return null
    var t = String(title).trim()
    if (!t) return null
    var tClean = t.replace(/^异色/, '').trim()
    for (var i = 0; i < pets.length; i++) {
      var pName = String(pets[i].name || '').trim()
      if (!pName) continue
      if (pName === t || pName.replace(/^异色/, '').trim() === tClean) return pets[i]
    }
    for (var j = 0; j < pets.length; j++) {
      var pName2 = String(pets[j].name || '').trim()
      var pClean2 = pName2.replace(/^异色/, '').trim()
      if (!pClean2) continue
      if (tClean.indexOf(pClean2) !== -1 || pClean2.indexOf(tClean) !== -1) return pets[j]
    }
    return null
  },
  loadSeasonBoard: function() {
    var self = this
    if (!db) return
    var pSeasons = db.collection('calendar_seasons').orderBy('start', 'desc').limit(20).get()
    var pPets = db.collection('site_config').doc('shiny_pets').get().catch(function() { return null })
    Promise.all([pSeasons, pPets]).then(function(results) {
      var res = results[0] || {}
      var petRes = results[1]
      var presetPets = (petRes && petRes.data && petRes.data.pets) ? petRes.data.pets : (wx.getStorageSync('shiny_pets') || [])
      var seasons = res.data || []
      if (!seasons.length) { self.setData({ seasonBoard: null }); self._stopBoardTimer(); return }
      var now = new Date()
      var chosen = null
      var best = null
      for (var i = 0; i < seasons.length; i++) {
        var s = self._parseDay(seasons[i].start)
        var e = self._parseDay(seasons[i].end)
        if (!s || !e) continue
        var eLast = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59)
        if (now >= s && now <= eLast) { chosen = seasons[i]; break }
        var diff = Math.abs(s - now)
        if (!best || diff < best.diff) best = { diff: diff, s: seasons[i] }
      }
      if (!chosen && best) chosen = best.s
      if (!chosen) { self.setData({ seasonBoard: null }); self._stopBoardTimer(); return }
      var items = (chosen.items || []).map(function(it) {
        var copy = Object.assign({}, it)
        var matched = self._matchPresetPet(copy.title, presetPets)
        var icons = Array.isArray(copy.icons) && copy.icons.length
          ? copy.icons.filter(Boolean)
          : (Array.isArray(copy.images) && copy.images.length ? copy.images.filter(Boolean) : (copy.icon ? [copy.icon] : []))
        if (!icons.length && matched) {
          if (Array.isArray(matched.imgs) && matched.imgs.length) icons = matched.imgs.filter(Boolean)
          else if (matched.img) icons = [matched.img]
        }
        copy.icons = icons
        copy.icon = icons[0] || ''
        return copy
      })
      cloudUrl.convertList(items, ['icon', 'icons'], function(converted) {
        chosen = Object.assign({}, chosen, { items: converted || items })
        self._buildBoard(chosen)
      })
    }).catch(function() {
      self.setData({ seasonBoard: null })
    })
  },
  _buildBoard: function(season) {
    this._rawSeason = season
    var start = this._parseDay(season.start)
    var end = this._parseDay(season.end)
    if (!start || !end || end < start) { this.setData({ seasonBoard: null }); return }
    var startMs = start.getTime()
    var endLastMs = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59).getTime()
    var totalMs = endLastMs - startMs
    if (totalMs <= 0) totalMs = 86400000
    var months = []
    var cur = new Date(start.getFullYear(), start.getMonth(), 1)
    while (cur <= end) {
      var mStart = new Date(cur.getFullYear(), cur.getMonth(), 1)
      var mEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0, 23, 59, 59)
      var lMs = Math.max(mStart.getTime(), startMs)
      var rMs = Math.min(mEnd.getTime(), endLastMs)
      if (rMs > lMs) {
        months.push({
          label: this._calMonthLabel(cur.getFullYear(), cur.getMonth()),
          left: (lMs - startMs) / totalMs * 100,
          width: (rMs - lMs) / totalMs * 100
        })
      }
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
    }
    var dict = i18n.i18n[i18n.getLanguage()] || i18n.i18n.zh
    var groups = [
      { key: 'version', cls: 'grp-version', label: dict.groupVersion || '版本周期性活动', bars: [] },
      { key: 'spawn', cls: 'grp-spawn', label: dict.groupSpawn || '大量出没', bars: [] },
      { key: 'seed', cls: 'grp-seed', label: dict.groupSeed || '命定花种', bars: [] },
      { key: 'quest', cls: 'grp-quest', label: dict.groupQuest || '常驻课题', bars: [] }
    ]
    var cdItems = []
    var parsedItems = []
    var items = season.items || []
    var now = Date.now()
    var liveCount = 0
    for (var i = 0; i < items.length; i++) {
      var it = items[i]
      var s = this._parseDay(it.start)
      if (!s) continue
      var e = this._parseDay(it.end)
      if (e && e < s) continue
      var openEnd = !e
      var sMs = s.getTime()
      var eMs = e ? new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59).getTime() : endLastMs
      var isLive = now >= sMs && (openEnd || now <= eMs)
      if (isLive) liveCount++
      parsedItems.push({ it: it, s: s, e: e, openEnd: openEnd, sMs: sMs, eMs: eMs, isLive: isLive, idx: i })
    }
    var filterMode = this.data.boardFilter || 'live'
    var onlyLive = (filterMode === 'live' && liveCount > 0)
    for (var p = 0; p < parsedItems.length; p++) {
      var rec = parsedItems[p]
      var it = rec.it
      var s = rec.s
      var e = rec.e
      var openEnd = rec.openEnd
      var sMs = rec.sMs
      var eMs = rec.eMs
      var dateText = openEnd
        ? (s.getMonth() + 1) + '月' + (s.getDate() < 10 ? '0' : '') + s.getDate() + '日起'
        : this._mdText(s) + '-' + this._mdText(e)
      var gi = it.group === 'spawn' ? 1 : (it.group === 'seed' ? 2 : (it.group === 'quest' ? 3 : 0))
      var id = 'it' + rec.idx
      cdItems.push({ id: id, title: it.title || '', dateText: dateText, groupLabel: groups[gi].label, startMs: sMs, endMs: eMs, openEnd: openEnd })
      if (onlyLive && !rec.isLive) continue
      var left = Math.max(0, Math.min(100, (sMs - startMs) / totalMs * 100))
      var width = Math.min(100 - left, Math.max(4, (Math.min(eMs, endLastMs) - sMs) / totalMs * 100))
      var labelStr = (it.title || '') + ' ' + dateText
      var cjk = 0, asc = 0
      for (var c = 0; c < labelStr.length; c++) {
        if (labelStr.charCodeAt(c) > 255) cjk++
        else asc++
      }
      var barIcons = (Array.isArray(it.icons) && it.icons.length) ? it.icons : (it.icon ? [it.icon] : [])
      var needRpx = cjk * 26 + asc * 16 + (barIcons.length ? (barIcons.length * 44 + 12) : 0) + 80
      var needPct = Math.min(100, Math.ceil(needRpx / 520 * 100))
      var finalWidth = Math.min(100, Math.max(width, needPct))
      var finalLeft = Math.max(0, Math.min(left, 100 - finalWidth))
      groups[gi].bars.push({
        id: id,
        title: it.title || '',
        dateText: dateText,
        groupLabel: groups[gi].label,
        left: finalLeft,
        width: finalWidth,
        icon: barIcons[0] || '',
        icons: barIcons,
        cls: 'bar-' + groups[gi].key
      })
    }
    var visibleGroups = groups.filter(function(g) { return g.bars.length > 0 })
    function stateOf(x) { return now < x.startMs ? 0 : (x.openEnd || now <= x.endMs ? 1 : 2) }
    cdItems.sort(function(a, b) {
      var sa = stateOf(a)
      var sb = stateOf(b)
      if (sa !== sb) return sa - sb
      if (sa === 0) return a.startMs - b.startMs
      if (sa === 1) return a.endMs - b.endMs
      return b.endMs - a.endMs
    })
    this.setData({
      seasonBoard: { name: season.name || '', start: this._mdText(start), end: this._mdText(end) },
      boardLiveCount: liveCount,
      boardTotalCount: parsedItems.length,
      ganttMonths: months,
      ganttGroups: visibleGroups,
      ganttWidth: 640,
      countdownItems: cdItems
    })
    this._startBoardTimer()
  },
  _startBoardTimer: function() {
    var self = this
    this._stopBoardTimer()
    this._boardTick()
    this._boardTimer = setInterval(function() { self._boardTick() }, 1000)
  },
  _stopBoardTimer: function() {
    if (this._boardTimer) { clearInterval(this._boardTimer); this._boardTimer = null }
  },
  _boardTick: function() {
    var items = this.data.countdownItems || []
    if (!items.length) return
    var now = Date.now()
    var dict = i18n.i18n[i18n.getLanguage()] || i18n.i18n.zh
    var ongoingText = dict.countdownOngoing || '进行中'
    var map = {}
    for (var i = 0; i < items.length; i++) {
      var it = items[i]
      if (now < it.startMs) {
        map[it.id] = { state: 'soon', text: i18n.formatCountdown(it.startMs - now, 'countdownToStart', 'countdownEnded') }
      } else if (it.openEnd) {
        map[it.id] = { state: 'live', text: ongoingText }
      } else if (now <= it.endMs) {
        map[it.id] = { state: 'live', text: i18n.formatCountdown(it.endMs - now, 'countdownRemain', 'countdownEnded') }
      } else {
        map[it.id] = { state: 'ended', text: i18n.formatCountdown(-1, 'countdownRemain', 'countdownEnded') }
      }
    }
    this.setData({ boardCountdowns: map })
  },
  onHide: function() {
    this._stopBoardTimer()
  },
  onUnload: function() {
    this._stopBoardTimer()
  },
  onShareAppMessage: function() {
    return { title: '洛手助手 - 活动日历', path: '/pages/activity/activity', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 洛克王国活动日历，不错过每个活动', imageUrl: '/images/banner.webp' }
  }
})
