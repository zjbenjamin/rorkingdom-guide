var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')
var activitiesData = [
  { id: 1, title: '异色获取方法', type: '官方权威信息', status: '置顶', start: '', end: '', rewards: [], desc: '通过赛季奇遇、大世界遭遇、生蛋孵蛋、赛季商店兑换等方式获取异色精灵。' }
]

var richEditor = require('./richEditor')
var parseMusicShare = richEditor.parseMusicShare
var convertMusicUrl = richEditor.convertMusicUrl
var parseGuessedName = richEditor.parseGuessedName
var parseBilibiliUrl = richEditor.parseBilibiliUrl
var parseWeiboUrl = richEditor.parseWeiboUrl
var parseVideoUrl = richEditor.parseVideoUrl
var parseTableInput = richEditor.parseTableInput
var extractCleanURL = richEditor.extractCleanURL

var editorOps = require('./editorOps')
var formOps = editorOps.createRichEditorOps({
  ctxKey: 'editorCtx',
  listKey: 'formRichContent',
  contentKey: 'formContent',
  htmlKey: 'formHtml',
  font: {
    style: 'currentFontStyle', weight: 'currentFontWeight', size: 'currentFontSize',
    color: 'currentFontColor', family: 'currentFontFamily', underline: 'currentUnderline',
    strike: 'currentStrike', header: 'currentHeader', align: 'currentAlign'
  },
  picker: { size: 'showSizePicker', color: 'showColorPicker', family: 'showFontFamilyPicker' },
  editIdxKey: '_formEditIdx',
  parseTableInput: parseTableInput
})
var activityOps = editorOps.createRichEditorOps({
  ctxKey: 'activityEditorCtx',
  listKey: 'activityRichContent',
  contentKey: 'activityFormContent',
  htmlKey: 'activityFormHtml',
  font: {
    style: 'activityFontStyle', weight: 'activityFontWeight', size: 'activityFontSize',
    color: 'activityFontColor', family: 'activityFontFamily', underline: 'activityUnderline',
    strike: 'activityStrike', header: 'activityHeader', align: 'activityAlign'
  },
  picker: { size: 'showActivitySizePicker', color: 'showActivityColorPicker', family: 'showActivityFontFamilyPicker' },
  editIdxKey: '_activityEditIdx',
  parseTableInput: parseTableInput
})

Page({
  behaviors: [i18nBehavior, require('../../utils/padLayoutBehavior')],
  data: {
    isAdmin: false,
    loading: true,
    activeTab: 'announce',
    ballsConfig: [],
      ballsSubmitting: false,
      showBallModal: false,
      editingBall: null,
      ballForm: {
        id: '', name: '', isBuy: false, isCraft: false, isSpecial: false, isActivity: false, price: 0, cnyPrice: 0,
              craftMaterials: '', desc: '', source: '', img: '', color: '', icon: ''
      },
      // 异色精灵预设（捕捉统计目标精灵）
      shinyPets: [],
      shinyPetSubmitting: false,
      showPetModal: false,
      editingPet: null,
      petForm: { id: '', name: '', season: 'S1', img: '' },
      petSeasons: ['S1', 'S2', 'S3', 'S4'],
      petSeasonIndex: 0,
      showSeasonModal: false,
      editingSeason: null,
      seasonFormName: '',
    announcements: [],
    users: [],
    stats: { totalUsers: 0 },
    showModal: false,
    showBannerModal: false,
    translating: false,
    translateCount: 0,
    translateTotal: 0,
    translateProgress: '',
    _translateStop: false,
    editingItem: null,
    formTitle: '',
    formContent: '',
    formType: 'notice',
      formSubType: 'regular',
      formCollabLogo: '',
    formPinned: false,
    formStartDate: '',
    formStartTime: '',
    formEndDate: '',
    formEndTime: '',
    formRichContent: [],
    formSource: '',
    submitting: false,
    swarmLocations: [],
    showSwarmModal: false,
    swarmLocationInput: '',
    siteConfig: { loginLogoUrl: '' },
    showLogShareBtn: true,
    bannerUrl: '',
    bannerInput: '',
    bannerItems: [''],
    bannerPreviewUrls: [],
    bannerLoading: false,
    pageConfigs: [],
    editorMode: 'simple',
    currentFontSize: 28,
    currentFontColor: '#ffffff',
    currentFontStyle: 'normal',
    currentFontWeight: 'normal',
    currentFontFamily: 'sans-serif',
    fontSizeOptions: [20, 24, 28, 32, 36, 40, 48],
    fontFamilyOptions: [
      { name: '系统默认', value: 'sans-serif' },
      { name: '衬线体', value: 'serif' },
      { name: '等宽体', value: 'monospace' },
      { name: '楷体', value: 'KaiTi, STKaiti, serif' },
      { name: '圆体', value: 'PingFang SC, Microsoft YaHei, sans-serif' }
    ],
    showFontFamilyPicker: false,
    fontColorOptions: [
      { name: '白色', value: '#ffffff' },
      { name: '青色', value: '#00d4ff' },
      { name: '蓝色', value: '#448aff' },
      { name: '紫色', value: '#9945ff' },
      { name: '绿色', value: '#00e676' },
      { name: '橙色', value: '#ffab40' },
      { name: '红色', value: '#ff4757' },
      { name: '黄色', value: '#ffd700' },
      { name: '粉色', value: '#ff6b9d' },
      { name: '金色', value: '#ffcc00' },
      { name: '天蓝', value: '#4dc9f6' },
      { name: '靛蓝', value: '#6366f1' },
      { name: '青绿', value: '#14b8a6' },
      { name: '珊瑚', value: '#ff6b6b' },
      { name: '灰色', value: 'rgba(255,255,255,0.5)' },
      { name: '浅灰', value: 'rgba(255,255,255,0.3)' }
    ],
    showColorPicker: false,
    showSizePicker: false,
    showActivityModal: false,
    activityEditingItem: null,
    activityFormTitle: '',
    activityFormContent: '',
    activityFormType: '活动',
    activityFormStatus: '进行中',
    activityFormStart: '',
    activityFormEnd: '',
    activityFormStartTime: '',
    activityFormEndTime: '',
    activityFormSource: '',
    activitySubmitting: false,
    activityEditorMode: 'simple',
    activityFontWeight: 'normal',
    activityFontStyle: 'normal',
    activityFontSize: 28,
    activityFontColor: '#ffffff',
    activityFontFamily: 'sans-serif',
    showActivityFontFamilyPicker: false,
    activityRichContent: [],
    showActivitySizePicker: false,
    showActivityColorPicker: false,
    adminActivities: [],
    localActivities: [],
    deletedLocalIds: [],
    subscribers: [],
    subscribeConfig: { announcement: true, activity: true, merchant: true },
    showContentPreview: false,
    previewKind: 'announcement',
    previewTitle: '',
    previewTypeLabel: '公告',
    previewBlocks: [],
    previewEditorHtml: '',
    previewSource: ''
  },
  onLoad: function() {
    this._refreshI18n()
    this.subscribersWatcher = null;
    if (wx.cloud) db = wx.cloud.database()
    var deletedIds = wx.getStorageSync('deleted_local_activities') || []
    this.setData({ deletedLocalIds: deletedIds })
    this.checkAdmin()
  },
  onUnload: function() {
    if (this.subscribersWatcher) {
      this.subscribersWatcher.close()
      this.subscribersWatcher = null
    }
  },
  checkAdmin: function() {
    var self = this
    if (!db) { self.setData({ loading: false }); return }
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) { self.setData({ isAdmin: false, loading: false }); return }
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data && res.data.openid
        var adminOpenids = (res.data && res.data.openids) || []
        if (!adminOpenid) { self.setData({ isAdmin: false, loading: false }); return }
        wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) { if (loginRes.result && (loginRes.result.openid === adminOpenid || adminOpenids.indexOf(loginRes.result.openid) !== -1)) {
              self.setData({ isAdmin: true })
              self.loadData()
              return
            }
            self.setData({ isAdmin: false, loading: false })
          })
      })
      .catch(function() { self.setData({ isAdmin: false, loading: false }) })
  },
  loadData: function() {
    this.loadAnnouncements()
    this.loadStats()
    this.loadBanner()
    this.loadSwarmLocations()
  },
  loadSwarmLocations: function() {
    var self = this
    if (!db) return
    db.collection('swarm_config').doc('locations').get()
      .then(function(res) {
        if (res.data && res.data.locations) {
          self.setData({ swarmLocations: res.data.locations })
        }
      })
      .catch(function() {})
  },
  loadBanner: function() {
    var self = this
    if (!db) return
    db.collection('site_config').doc('banner').get()
      .then(function(res) {
        var d = res.data || {}
        var urls = d.urls && d.urls.length ? d.urls : (d.url && d.url !== 'none' ? [d.url] : [])
        urls = urls.map(function(s) { return (s || '').trim() }).filter(function(s) { return s && s !== 'none' })
        self.setData({
          bannerItems: urls.length ? urls : [''],
          bannerPreviewUrls: urls
        })
      })
      .catch(function(e) { console.error(e) })
  },
  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab
    if (tab !== 'subscribe' && this.subscribersWatcher) {
      this.subscribersWatcher.close()
      this.subscribersWatcher = null
    }
    this.setData({ activeTab: tab })
    if (tab === 'announce') this.loadAnnouncements()
    else if (tab === 'activity') this.loadAdminActivities()
    else if (tab === 'subscribe') this.loadSubscribers()
    else if (tab === 'users') this.loadUsers()
    else if (tab === 'stats') this.loadStats()
    else if (tab === 'pages') { this.loadPageConfigs(); this.loadBanner() }
    else if (tab === 'balls') { this.loadBallsConfig(); this.loadShinyPets() }
  },
  loadAnnouncements: function() {
    var self = this
    if (!db) return
    db.collection('announcements').orderBy('createTime', 'asc').limit(50).get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) list[i].timeStr = self.formatTime(list[i].createTime)
        self.setData({ announcements: list, loading: false })
      })
      .catch(function() { self.setData({ loading: false }) })
  },
  loadUsers: function() {
    var self = this
    if (!db) return
    db.collection('users').orderBy('lastLogin', 'desc').limit(50).get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) {
          list[i].timeStr = self.formatTime(list[i].lastLogin)
          list[i].level = self.calcLevel(list[i].loginDays ? list[i].loginDays.length : 0)
        }
        self.setData({ users: list, loading: false })
        cloudUrl.convertList(list, 'avatarUrl', function(converted) {
          self.setData({ users: converted })
        })
      })
      .catch(function() { self.setData({ loading: false }) })
  },
  loadStats: function() {
    var self = this
    if (!db) return
    var stats = { totalUsers: 0 }
    db.collection('users').count()
      .then(function(r) {
        stats.totalUsers = r.total
        self.setData({ stats: stats, loading: false })
      })
      .catch(function() {
        self.setData({ stats: stats, loading: false })
      })
  },
  calcLevel: function(days) {
    if (days >= 365) return 10; if (days >= 180) return 9; if (days >= 120) return 8
    if (days >= 90) return 7; if (days >= 60) return 6; if (days >= 30) return 5
    if (days >= 15) return 4; if (days >= 7) return 3; if (days >= 3) return 2; return 1
  },
  toggleBannerModal: function() {
    this.setData({ showBannerModal: !this.data.showBannerModal })
  },
  addBannerItem: function() {
    var list = (this.data.bannerItems || []).slice()
    list.push('')
    this.setData({ bannerItems: list })
  },
  removeBannerItem: function(e) {
    var idx = e.currentTarget.dataset.index
    var list = (this.data.bannerItems || []).slice()
    list.splice(idx, 1)
    if (!list.length) list = ['']
    var urls = list.map(function(s) { return (s || '').trim() }).filter(Boolean)
    this.setData({ bannerItems: list, bannerPreviewUrls: urls })
  },
  onBannerItemInput: function(e) {
    var idx = e.currentTarget.dataset.index
    var list = (this.data.bannerItems || []).slice()
    list[idx] = e.detail.value
    var urls = list.map(function(s) { return (s || '').trim() }).filter(Boolean)
    this.setData({ bannerItems: list, bannerPreviewUrls: urls })
  },
  onBannerInput: function(e) {
    var val = e.detail.value || ''
    var urls = val.split(/\n/).map(function(s) { return s.trim() }).filter(function(s) { return s && s !== 'none' })
    this.setData({ bannerInput: val, bannerPreviewUrls: urls })
  },
  saveBanner: function() {
    var self = this
    if (self.data.bannerLoading) return
    var urls = (self.data.bannerItems || [])
      .map(function(s) { return (s || '').trim() })
      .filter(function(s) { return s })
    if (!urls.length) {
      wx.showToast({ title: '请至少添加一张图片', icon: 'none' })
      return
    }
    self.setData({ bannerLoading: true })
    var payload = {
      url: urls[0],
      urls: urls,
      updateTime: db.serverDate()
    }
    db.collection('site_config').doc('banner').set({ data: payload })
      .then(function() {
        self.setData({ bannerLoading: false, bannerPreviewUrls: urls })
        wx.showToast({ title: '头图已保存（' + urls.length + ' 张）', icon: 'success' })
      })
      .catch(function(err) {
        self.setData({ bannerLoading: false })
        wx.showToast({ title: '头图保存失败：' + ((err && err.errMsg) || '请重试'), icon: 'none' })
      })
  },
  startBatchTranslate: function() {
    var self = this
    if (!wx.cloud || !db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ translating: true, translateCount: 0, translateTotal: 0, translateProgress: '正在查询未翻译公告...', _translateStop: false })
    db.collection('announcements').where({ title: db.command.neq('') }).limit(200).get()
      .then(function(res) {
        var items = res.data || []
        var needTranslate = []
        for (var i = 0; i < items.length; i++) {
          if (!items[i].title_en || !items[i].title_ja || !items[i].title_ko) {
            needTranslate.push(items[i])
          }
        }
        if (needTranslate.length === 0) {
          self.setData({ translating: false, translateProgress: '全部已翻译，无需处理' })
          return
        }
        self.setData({ translateTotal: needTranslate.length })
        self._doBatchTranslate(needTranslate, 0)
      })
      .catch(function() {
        self.setData({ translating: false, translateProgress: '查询失败' })
      })
  },
  stopBatchTranslate: function() {
    this.setData({ _translateStop: true, translateProgress: '正在停止...' })
  },
  _doBatchTranslate: function(items, index) {
    var self = this
    if (self.data._translateStop) {
      self.setData({ translating: false, translateProgress: '已停止，完成' + self.data.translateCount + '条' })
      return
    }
    if (index >= items.length) {
      self.setData({ translating: false, translateProgress: '全部完成，共翻译' + self.data.translateCount + '条' })
      return
    }
    var item = items[index]
    var title = (item.title || '').trim()
    var content = (item.content || item.title || '').substring(0, 500)
    
    // 跳过空标题的条目，避免无限重试
    if (!title) {
      var nextSkip = index + 1
      self.setData({ translateCount: nextSkip, translateProgress: '跳过无标题: ' + (item._id || '') })
      setTimeout(function() { self._doBatchTranslate(items, nextSkip) }, 100)
      return
    }
    
    wx.cloud.callFunction({
      name: 'translateText',
      data: { text: title, from: 'zh', targets: ['en', 'ja', 'ko'] }
    }).then(function(titleRes) {
      var data = {}
      var t = (titleRes.result && titleRes.result.translations) || {}
      for (var lang in t) { if (t[lang]) data['title_' + lang] = t[lang] }
      return wx.cloud.callFunction({
        name: 'translateText',
        data: { text: content, from: 'zh', targets: ['en', 'ja', 'ko'] }
      }).then(function(contentRes) {
        var tc = (contentRes.result && contentRes.result.translations) || {}
        for (var l in tc) { if (tc[l]) data['content_' + l] = tc[l] }
        if (Object.keys(data).length === 0) return null
        return db.collection('announcements').doc(item._id).update({ data: data })
      })
    }).then(function() {
      var next = index + 1
      self.setData({
        translateCount: next,
        translateProgress: '已翻译' + next + '/' + items.length + ': ' + title
      })
      setTimeout(function() { self._doBatchTranslate(items, next) }, 500)
    }).catch(function() {
      var next = index + 1
      self.setData({ translateCount: next, translateProgress: '跳过失败: ' + title })
      setTimeout(function() { self._doBatchTranslate(items, next) }, 200)
    })
  },
  loadPageConfigs: function() {
    var self = this
    if (!db) return
    var pageList = [
      { id: 'merchant', name: '远行商人', icon: '🛒', maintenance: false, useCustom: false },
      { id: 'captureImage', name: '捕捉统计生成图片', icon: '📷', maintenance: wx.getStorageSync('show_log_share_btn') !== false, useCustom: false },
      { id: 'map', name: '地图', icon: '🗺️', maintenance: false, useCustom: false }
    ]
    var done = 0
    for (var i = 0; i < pageList.length; i++) {
      (function(idx) {
        if (pageList[idx].id === 'captureImage') { done++; if (done >= pageList.length) self.setData({ pageConfigs: pageList }); return }
        db.collection('page_config').doc(pageList[idx].id).get()
          .then(function(res) {
            pageList[idx].maintenance = res.data.maintenance || false
            pageList[idx].useCustom = res.data.useCustom || false
            done++
            if (done >= pageList.length) self.setData({ pageConfigs: pageList })
          })
          .catch(function() {
            done++
            if (done >= pageList.length) self.setData({ pageConfigs: pageList })
          })
      })(i)
    }
  },
  
    
    // 直连数据库写 page_config，不依赖云函数部署
    _savePageConfig: function(id, patch, okMsg) {
      var self = this
      if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
      var data = Object.assign({}, patch, { updateTime: db.serverDate() })
      db.collection('page_config').doc(id).set({ data: data })
        .then(function() {
          self.loadPageConfigs()
          wx.showToast({ title: okMsg || '设置成功', icon: 'success' })
        })
        .catch(function(err) {
          wx.showToast({ title: '保存失败：' + ((err && (err.errMsg || err.message)) || '请重试'), icon: 'none' })
        })
    },
    togglePageMaintenance: function(e) {
      var self = this
      var id = e.currentTarget.dataset.id
      if (id === 'captureImage') {
        var currentVal = wx.getStorageSync('show_log_share_btn') !== false
        var newVal = !currentVal
        wx.setStorageSync('show_log_share_btn', newVal)
        self.loadPageConfigs()
        wx.showToast({ title: newVal ? '已开启' : '已关闭', icon: 'success' })
        return
      }
      if (!db) return
      var list = self.data.pageConfigs || []
      var cur = false
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { cur = !!list[i].maintenance; break }
      }
      self._savePageConfig(id, { maintenance: !cur }, !cur ? '已设为维护中' : '已恢复运行')
    },
    togglePageCustom: function(e) {
      var self = this
      var id = e.currentTarget.dataset.id
      if (!db) return
      var list = self.data.pageConfigs || []
      var cur = false
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { cur = !!list[i].useCustom; break }
      }
      self._savePageConfig(id, { useCustom: !cur }, '自定义已' + (!cur ? '开启' : '关闭'))
    },
openModal: function(e) {
    var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item || null : null
    var richContent = []
    var source = ''
    var formContent = ''
    var formHtml = ''
    if (item && item.richContent && item.richContent.length > 0) {
      richContent = item.richContent
    } else if (item && item.content) {
      // 旧数据无 richContent：只放进编辑器，避免再拼一个 text 块导致内容重复
      formContent = item.content
      formHtml = item.content
    }
    if (item && item.source) {
      source = item.source
    }
    // 新建时尝试恢复未提交草稿
    var draft = null
    if (!item) draft = this._restoreAnnounceDraft()
    if (draft) {
      wx.showModal({
        title: '发现未发布草稿',
        content: '标题：' + (draft.formTitle || '（无标题）'),
        confirmText: '恢复草稿',
        cancelText: '不用，新建',
        success: function(mr) {
          if (mr.confirm) {
            this.setData({
              showModal: true,
              editingItem: null,
              formTitle: draft.formTitle || '',
              formContent: draft.formContent || '',
              formHtml: draft.formHtml || '',
              formType: draft.formType || 'notice',
              formSubType: draft.formSubType || 'regular',
              formCollabLogo: draft.formCollabLogo || '',
              formPinned: !!draft.formPinned,
              formRichContent: draft.formRichContent || [],
              formSource: draft.formSource || '',
              formStartDate: draft.formStartDate || '',
              formStartTime: draft.formStartTime || '',
              formEndDate: draft.formEndDate || '',
              formEndTime: draft.formEndTime || ''
            })
          } else {
            this._clearAnnounceDraft()
            this._openAnnounceBlank()
          }
        }.bind(this)
      })
      return
    }
    this._formEditIdx = null
    this.setData({
      showModal: true,
      editingItem: item,
      formTitle: item ? item.title : '',
      formContent: formContent,
      formHtml: formHtml,
      formType: item ? item.type : 'notice',
        formSubType: item ? (item.subType || 'regular') : 'regular',
        formCollabLogo: item ? (item.collabLogo || '') : '',
      formPinned: item ? item.pinned : false,
      formRichContent: richContent,
      formSource: source,
      formStartDate: item ? (item.startDate || '') : '',
      formStartTime: item ? (item.startTime || '') : '',
      formEndDate: item ? (item.endDate || '') : '',
      formEndTime: item ? (item.endTime || '') : '',
      // 重置编辑器样式状态，防止上次编辑残留
      currentFontStyle: 'normal',
      currentFontWeight: 'normal',
      currentFontSize: 28,
      currentFontColor: '#ffffff',
      currentFontFamily: 'sans-serif',
      currentUnderline: false,
      currentStrike: false,
      currentHeader: 0,
      currentAlign: '',
      showSizePicker: false,
      showColorPicker: false,
      showFontFamilyPicker: false
    })
  },
  closeModal: function() {
    this._saveAnnounceDraft()
    this.setData({ showModal: false })
  },
  // ── 公告草稿：防误关丢失 ──
  _saveAnnounceDraft: function() {
    var d = this.data
    if (d.editingItem) return
    var has = d.formTitle || d.formContent || (d.formRichContent && d.formRichContent.length)
    if (!has) { try { wx.removeStorageSync('admin_draft_announce') } catch (e) {} return }
    try {
      wx.setStorageSync('admin_draft_announce', {
        formTitle: d.formTitle, formContent: d.formContent, formHtml: d.formHtml,
        formType: d.formType, formSubType: d.formSubType,
        formCollabLogo: d.formCollabLogo,
        formSource: d.formSource, formPinned: d.formPinned,
        formRichContent: d.formRichContent,
        formStartDate: d.formStartDate, formStartTime: d.formStartTime,
        formEndDate: d.formEndDate, formEndTime: d.formEndTime
      })
    } catch (e) {}
  },
  _restoreAnnounceDraft: function() {
    var draft = null
    try { draft = wx.getStorageSync('admin_draft_announce') } catch (e) {}
    if (!draft) return null
    return draft
  },
  _clearAnnounceDraft: function() {
    try { wx.removeStorageSync('admin_draft_announce') } catch (e) {}
  },
  // 放弃草稿后打开空白发布公告弹窗
  _openAnnounceBlank: function() {
    this.setData({
      showModal: true,
      editingItem: null,
      formTitle: '', formContent: '', formHtml: '',
      formType: 'notice', formSubType: 'regular',
      formCollabLogo: '',
      formPinned: false, formRichContent: [], formSource: '',
      formStartDate: '', formStartTime: '', formEndDate: '', formEndTime: '',
      currentFontStyle: 'normal', currentFontWeight: 'normal', currentFontSize: 28,
      currentFontColor: '#ffffff', currentFontFamily: 'sans-serif',
      currentUnderline: false, currentStrike: false, currentHeader: 0, currentAlign: '',
      showSizePicker: false, showColorPicker: false, showFontFamilyPicker: false
    })
  },
  preventClose: function() {},
  showMusicDialog: function() {
    var self = this
    wx.getClipboardData({
      success: function(cb) {
        var clipText = (cb.data || '').trim()
        var defaultContent = clipText ? clipText : ''
        wx.showModal({
          title: '添加音乐',
          content: defaultContent,
          placeholderText: '粘贴歌曲分享文本（支持网易云/QQ音乐等）',
          editable: true,
          success: function(resShare) {
            if (resShare.confirm || (defaultContent && resShare.confirm !== false)) {
              var shareText = (resShare.content || defaultContent).trim()
              var parsed = parseMusicShare(shareText)
              if (!parsed.url) {
                var cleanedUrl = extractCleanURL(shareText)
                if (cleanedUrl) {
                  var url = convertMusicUrl(cleanedUrl)
                  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    wx.showToast({ title: '链接需以 http 或 https 开头', icon: 'none' })
                    return
                  }
                  wx.showModal({
                    title: '输入歌曲名称',
                    content: '',
                    placeholderText: '歌名 - 歌手',
                    editable: true,
                    success: function(nameRes) {
                      var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
                      if (!name && !resShare.confirm) name = shareText.substring(0, 20)
                      self._addMusicBlock(self, { type: 'music', name: name || '音乐', url: url })
                    }
                  })
                } else {
                  wx.showToast({ title: '未找到有效的音乐链接', icon: 'none' })
                }
                return
              }
              if (parsed.name) {
                self._addMusicBlock(self, { type: 'music', name: parsed.name, url: parsed.url })
              } else {
                var guessedName = parseGuessedName(shareText, parsed.url)
                wx.showModal({
                  title: '输入歌曲名称',
                  content: guessedName || '',
                  placeholderText: '歌名 - 歌手',
                  editable: true,
                  success: function(resName) {
                    if (resName.confirm && resName.content && resName.content.trim()) {
                      self._addMusicBlock(self, { type: 'music', name: resName.content.trim(), url: parsed.url })
                    }
                  }
                })
              }
            }
          }
        })
      },
      fail: function() {
        self._showMusicDialogFallback()
      }
    })
  },
  _addMusicBlock: function(self, block) {
    if (block.cover === undefined) {
      self._askForCover(function(cover) {
        block.cover = cover;
        self._addMusicBlock(self, block);
      });
      return;
    }
    self._insertFormBlock(block, { stripUrls: block.url ? [block.url] : [], toast: '已添加: ' + block.name })
  },
  _showMusicDialogFallback: function() {
    var self = this
    wx.showModal({
      title: '添加音乐',
      content: '',
      placeholderText: '粘贴歌曲分享文本（支持网易云/QQ音乐等）',
      editable: true,
      success: function(resShare) {
        if (resShare.confirm && resShare.content && resShare.content.trim()) {
          var shareText = resShare.content.trim()
          var cleanedUrl = extractCleanURL(shareText)
          var isUrl = cleanedUrl && /^https?:\/\//i.test(cleanedUrl)
          if (isUrl) {
            var url = convertMusicUrl(cleanedUrl)
            wx.showModal({
              title: '输入歌曲名称',
              content: '',
              placeholderText: '歌名 - 歌手',
              editable: true,
              success: function(nameRes) {
                var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : shareText.substring(0, 20)
                self._addMusicBlock(self, { type: 'music', name: name || '音乐', url: url })
              }
            })
          } else {
            wx.showToast({ title: '未找到有效的音乐链接', icon: 'none' })
          }
        }
      }
    })
  },
  showVideoDialog: function() {
    var self = this
    wx.getClipboardData({
      success: function(cb) {
        var clipText = (cb.data || '').trim()
        var defaultContent = clipText ? extractCleanURL(clipText) : ''
        wx.showModal({
          title: '添加视频',
          content: defaultContent,
          placeholderText: '粘贴视频链接（支持微博/哔哩哔哩）',
          editable: true,
          success: function(res) {
            var inputUrl = (res.confirm ? (res.content || defaultContent) : defaultContent).trim()
            if (!inputUrl) return
            if (!/^https?:\/\//i.test(inputUrl)) {
              inputUrl = extractCleanURL(inputUrl)
            }
            if (!inputUrl) { wx.showToast({ title: '请输入有效链接', icon: 'none' }); return }
            var videoInfo = parseVideoUrl(inputUrl)
            if (!videoInfo) {
              if (/^https?:\/\//i.test(inputUrl)) {
                wx.showModal({
                  title: '视频标题（可选）',
                  content: '',
                  placeholderText: '输入视频标题',
                  editable: true,
                  success: function(nameRes) {
                    var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
                    self._addVideoBlock(self, { platform: 'other', platformName: '其他', url: inputUrl, id: '' }, name)
                  }
                })
              } else {
                wx.showToast({ title: '未识别视频链接', icon: 'none' })
              }
              return
            }
            wx.showModal({
              title: '视频标题（可选）',
              content: '',
              placeholderText: '输入视频标题',
              editable: true,
              success: function(nameRes) {
                var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
                self._addVideoBlock(self, videoInfo, name)
              }
            })
          }
        })
      },
      fail: function() {
        self._showVideoDialogFallback()
      }
    })
  },
  _addVideoBlock: function(self, videoInfo, name) {
    if (videoInfo.cover === undefined) {
      self._askForCover(function(cover) {
        videoInfo.cover = cover;
        self._addVideoBlock(self, videoInfo, name);
      });
      return;
    }
    var block = { type: 'video', platform: videoInfo.platform, platformName: videoInfo.platformName, name: name || '', url: videoInfo.url, vid: videoInfo.id, cover: videoInfo.cover }
    self._insertFormBlock(block, { stripUrls: [videoInfo.url], toast: '已添加: ' + videoInfo.platformName + '视频' })
  },
  showTableDialog: function() {
    var self = this
    wx.showModal({
      title: '添加表格',
      content: '',
      placeholderText: '粘贴表格数据：每行换行，列用 | 或 Tab 或 , 分隔\n第一行为表头\n\n例：\n名称|属性|技能\n皮卡丘|电|十万伏特\n小火龙|火|喷射火焰',
      editable: true,
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          var tableData = parseTableInput(res.content.trim())
          if (!tableData) {
            wx.showToast({ title: '未识别表格，请检查格式（至少2行）', icon: 'none' })
            return
          }
          self._insertFormBlock({ type: 'table', headers: tableData.headers, rows: tableData.rows, colCount: tableData.colCount, rowCount: tableData.rowCount }, { toast: '已添加: ' + tableData.colCount + '列' + tableData.rowCount + '行表格' })
        }
      }
    })
  },
  showActivityTableDialog: function() {
    var self = this
    wx.showModal({
      title: '添加表格',
      content: '',
      placeholderText: '粘贴表格数据：每行换行，列用 | 或 Tab 或 , 分隔\n第一行为表头\n\n例：\n名称|属性|技能\n皮卡丘|电|十万伏特\n小火龙|火|喷射火焰',
      editable: true,
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          var tableData = parseTableInput(res.content.trim())
          if (!tableData) {
            wx.showToast({ title: '未识别表格，请检查格式（至少2行）', icon: 'none' })
            return
          }
          self._insertActivityBlock({ type: 'table', headers: tableData.headers, rows: tableData.rows, colCount: tableData.colCount, rowCount: tableData.rowCount }, { toast: '已添加: ' + tableData.colCount + '列' + tableData.rowCount + '行表格' })
        }
      }
    })
  },
  onTitleInput: function(e) { this.setData({ formTitle: e.detail.value }) },
  onContentInput: function(e) { this.setData({ formContent: e.detail.value }) },
  onEditorReady: function() {
    var self = this
    wx.createSelectorQuery().in(this).select('#editor').context(function(res) {
      self.editorCtx = res.context
      if (!self.editorCtx) return
      if (self.data.formContent) {
        self.editorCtx.setContents({
          html: self.data.formHtml || self.data.formContent
        })
      } else {
        // 弹窗复用编辑器实例时清空残留内容
        self.editorCtx.clear()
      }
    }).exec()
  },
  onEditorInput: function(e) {
    var text = e.detail.text || ''
    if (text.endsWith('\n')) {
      text = text.slice(0, -1)
    }
    this.setData({ 
      formContent: text,
      formHtml: e.detail.html || ''
    })
  },
  onStatusChange: function(e) {
    var formats = e.detail || {}
    this.setData({
      currentFontWeight: formats.bold ? 'bold' : 'normal',
      currentFontStyle: formats.italic ? 'italic' : 'normal',
      currentFontColor: formats.color || '#ffffff',
      currentFontFamily: formats.fontFamily || 'sans-serif',
      currentUnderline: formats.underline || false,
      currentStrike: formats.strike || false,
      currentHeader: formats.header || 0,
      currentAlign: formats.align || ''
    })
  },
    onSourceInput: function(e) { this.setData({ formSource: e.detail.value }) },
  onStartDateChange: function(e) { this.setData({ formStartDate: e.detail.value }) },
  onStartTimeChange: function(e) { this.setData({ formStartTime: e.detail.value }) },
  onEndDateChange: function(e) { this.setData({ formEndDate: e.detail.value }) },
  onEndTimeChange: function(e) { this.setData({ formEndTime: e.detail.value }) },
  onTypeChange: function(e) { var types = ['notice', 'update', 'event', 'tip']; this.setData({ formType: types[e.detail.value] }) },
    onSubTypeChange: function(e) { var types = ['regular', 'season', 'collab']; this.setData({ formSubType: types[e.detail.value] }) },
    onCollabLogoInput: function(e) { this.setData({ formCollabLogo: e.detail.value }) },
    
  togglePinned: function() { this.setData({ formPinned: !this.data.formPinned }) },
  _autoCommitText: formOps.autoCommitText,
  // 统一插入入口：先落草稿再插块（公告）
  _insertFormBlock: function(block, opts) { formOps.insertBlock.call(this, block, opts) },
  // 统一插入入口：先落草稿再插块（活动）
  _insertActivityBlock: function(block, opts) { activityOps.insertBlock.call(this, block, opts) },
  toggleBold: formOps.toggleBold,
  toggleItalic: formOps.toggleItalic,
  toggleUnderline: formOps.toggleUnderline,
  toggleStrike: formOps.toggleStrike,
  toggleHeader2: formOps.toggleHeader2,
  toggleHeader3: formOps.toggleHeader3,
  setFontSize: formOps.setFontSize,
  setFontColor: formOps.setFontColor,
  setFontFamily: formOps.setFontFamily,
  showFontSizePicker: formOps.showFontSizePicker,
  showFontColorPicker: formOps.showFontColorPicker,
  showFontFamilyPicker: formOps.showFontFamilyPicker,
  addRichTextBlock: formOps.addRichTextBlock,
  addRichQuoteBlock: formOps.addRichQuoteBlock,
  // 块上移/下移一格（公告与活动共用）
  moveRichBlockStep: function(e) {
    var idx = e.currentTarget.dataset.idx
    var dir = e.currentTarget.dataset.dir
    var target = e.currentTarget.dataset.target || 'form'
    var key = target === 'activity' ? 'activityRichContent' : 'formRichContent'
    var list = (this.data[key] || []).slice()
    var to = idx + dir
    if (to < 0 || to >= list.length) return
    var block = list.splice(idx, 1)[0]
    list.splice(to, 0, block)
    var upd = {}
    upd[key] = list
    this.setData(upd)
  },
  removeRichBlock: formOps.removeRichBlock,
  editRichBlock: function(e) {
    var idx = e.currentTarget.dataset.idx
    var block = this.data.formRichContent[idx]
    var richContent = this.data.formRichContent
    if (block.type === 'swiper') {
      var self = this;
      var itemList = [];
      for (var i = 0; i < block.urls.length; i++) {
        if (i < 5) itemList.push('删除第 ' + (i+1) + ' 张');
      }
      if (block.urls.length > 5) itemList.push('删除最后一张 (第' + block.urls.length + '张)');
      wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
          var deleteIdx = res.tapIndex;
          if (deleteIdx === 5) deleteIdx = block.urls.length - 1;
          block.urls.splice(deleteIdx, 1);
          if (block.urls.length === 0) richContent.splice(idx, 1);
          self.setData({ formRichContent: richContent });
          wx.showToast({ title: '已删除图片', icon: 'success' });
        }
      });
      return;
    }
    // 引用块原地编辑，避免拉进编辑器后丢失 quote 类型
    if (block.type === 'quote') {
      var self2 = this
      wx.showModal({
        title: '编辑引用',
        content: block.content || '',
        editable: true,
        placeholderText: '输入引用内容',
        success: function(mr) {
          if (mr.confirm && mr.content !== undefined) {
            var rc = self2.data.formRichContent.slice()
            rc[idx] = Object.assign({}, block, { content: mr.content })
            self2.setData({ formRichContent: rc })
            wx.showToast({ title: '已更新引用', icon: 'success' })
          }
        }
      })
      return
    }
    richContent.splice(idx, 1)
    // 记录原位置：改完落块时插回原处，而不是沉到文末
    this._formEditIdx = idx
    this.setData({
      formRichContent: richContent,
      formContent: block.html || block.content,
      formHtml: block.html || '',
      currentFontStyle: block.style || 'normal',
      currentFontWeight: block.weight || 'normal',
      currentFontSize: block.size || 28,
      currentFontColor: block.color || '#ffffff',
      currentFontFamily: block.fontFamily || 'sans-serif'
    })
    if (this.editorCtx) {
      this.editorCtx.setContents({
        html: block.html || block.content
      })
    }
  },
          previewBlockImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src], current: src })
  },
  _buildPreviewBlocks: function(richContent, editorHtml) {
    var blocks = (richContent || []).slice()
    if (editorHtml) {
      blocks.push({ type: 'text', content: '', html: editorHtml })
    }
    return blocks
  },
  _typeLabel: function(type) {
    return type === 'notice' ? '公告' : type === 'update' ? '更新' : type === 'event' ? '活动' : '提示'
  },
  openFormPreview: function() {
    var content = this.data.formContent || ''
    var blocks = this._buildPreviewBlocks(this.data.formRichContent, this.data.formHtml || content)
    this.setData({
      showContentPreview: true,
      previewKind: 'announcement',
      previewTitle: this.data.formTitle,
      previewTypeLabel: this._typeLabel(this.data.formType),
      previewBlocks: blocks,
      previewEditorHtml: '',
      previewSource: this.data.formSource || ''
    })
  },
  openActivityPreview: function() {
    var content = this.data.activityFormContent || ''
    var blocks = this._buildPreviewBlocks(this.data.activityRichContent, this.data.activityFormHtml || content)
    this.setData({
      showContentPreview: true,
      previewKind: 'activity',
      previewTitle: this.data.activityFormTitle,
      previewTypeLabel: this.data.activityFormType || '活动',
      previewBlocks: blocks,
      previewEditorHtml: '',
      previewSource: this.data.activityFormSource || ''
    })
  },
  closeContentPreview: function() {
    this.setData({ showContentPreview: false })
  },
  importFileToTable: function() {
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
              self._processImportedTextToTable(text)
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
          }).then(function(parseRes) {
            wx.hideLoading()
            if (parseRes.result && parseRes.result.success) {
              self._processImportedTextToTable(parseRes.result.content)
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
  _processImportedTextToTable: formOps.processImportedTextToTable,
  showAttachmentDialog: function() {
    var self = this
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success: function(res) {
        var file = res.tempFiles[0]
        wx.showLoading({ title: '上传附件中...' })
        var cloudPath = 'attachments/' + Date.now() + '_' + file.name
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: file.path
        }).then(function(uploadRes) {
          wx.hideLoading()
          var sizeKb = (file.size / 1024).toFixed(1)
          var sizeText = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB'
          var block = {
            type: 'attachment',
            name: file.name,
            url: uploadRes.fileID,
            size: file.size,
            sizeText: sizeText
          }
          self._insertFormBlock(block, { toast: '附件上传成功' })
        }).catch(function(err) {
          wx.hideLoading()
          wx.showToast({ title: '附件上传失败', icon: 'none' })
          console.error(err)
        })
      }
    })
  },
  showLinkDialog: function() {
    var self = this
    wx.showModal({
      title: '添加超链接',
      content: '',
      placeholderText: '请输入链接地址（以 http 或 https 开头）',
      editable: true,
      success: function(resUrl) {
        if (resUrl.confirm && resUrl.content && resUrl.content.trim()) {
          var url = resUrl.content.trim()
          if (!/^https?:\/\//i.test(url)) {
            wx.showToast({ title: '链接需以 http 或 https 开头', icon: 'none' })
            return
          }
          wx.showModal({
            title: '链接文字说明',
            content: '',
            placeholderText: '请输入链接显示的文字说明',
            editable: true,
            success: function(resText) {
              if (resText.confirm) {
                var text = (resText.content || '').trim() || '快捷链接'
                var isVideo = /v\.qq\.com|bilibili\.com|video|youtube/i.test(url)
                var block = { type: 'link', text: text, url: url, isVideo: isVideo }
                self._insertFormBlock(block, { toast: '超链接已添加' })
              }
            }
          })
        }
      }
    })
  },
  showDividerDialog: function() {
    // 先落草稿再插分割线，顺序与所见一致
    this._insertFormBlock({ type: 'divider' }, { toast: '已添加分割线' })
  },
  submitAnnouncement: function() {
    var self = this
    if (self.data.submitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    var title = self.data.formTitle.trim(), content = self.data.formContent.trim()
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return }
    if (self.data.formRichContent.length === 0 && !content) {
      wx.showToast({ title: '请输入内容', icon: 'none' }); return
    }
    self.setData({ submitting: true })
    var richContent = (self.data.formRichContent || []).slice()
    if (content) {
      // 编辑中的块插回原位；否则新文字落到文末
      var draftBlock = {
        type: 'text', content: content, html: self.data.formHtml || '', style: self.data.currentFontStyle,
        weight: self.data.currentFontWeight, size: self.data.currentFontSize, color: self.data.currentFontColor,
        fontFamily: self.data.currentFontFamily
      }
      var editIdx = self._formEditIdx
      if (typeof editIdx === 'number' && editIdx >= 0 && editIdx <= richContent.length) {
        richContent.splice(editIdx, 0, draftBlock)
      } else {
        richContent.push(draftBlock)
      }
      self._formEditIdx = null
    }
    var finalContent = richEditor.buildHtmlFromRichContent(richContent)

    var data = {
      title: title,
      content: finalContent,
      richContent: richContent,
      source: self.data.formSource.trim(),
      type: self.data.formType,
      subType: self.data.formType === 'event' ? self.data.formSubType : '',
      collabLogo: (self.data.formType === 'event' && self.data.formSubType === 'collab') ? self.data.formCollabLogo.trim() : '',
      pinned: self.data.formPinned,
      startDate: self.data.formStartDate,
      startTime: self.data.formStartTime || '',
      endDate: self.data.formEndDate,
      endTime: self.data.formEndTime || '',
      updateTime: db.serverDate()
    }
    var promise
    if (self.data.editingItem) {
      promise = db.collection('announcements').doc(self.data.editingItem._id).update({ data: data })
    } else {
      data.createTime = db.serverDate()
      data.author = app.globalData.userInfo ? app.globalData.userInfo.nickName : 'Admin'
      promise = db.collection('announcements').add({ data: data })
    }
    var editItemId = self.data.editingItem ? self.data.editingItem._id : null
    promise.then(function(res) {
      self.setData({ submitting: false, showModal: false, editingItem: null, formHtml: '' });
      self._clearAnnounceDraft()
      wx.showToast({ title: '操作成功', icon: 'success' });
      self.loadAnnouncements();
      self.pushSubscribe('announcement', notify.smartTruncate(title, 20), notify.smartTruncate(content || title, 20));
      var docId = editItemId || (res && res._id)
      if (docId) self.setData({ _lastDocId: docId, _lastDocTitle: title, _lastDocContent: content || title })
    }).catch(function(err) {
      console.error('发布公告失败:', err);
      self.setData({ submitting: false });
      wx.showToast({ title: '操作失败: ' + (err.errMsg || '未知错误'), icon: 'none' });
    });
  },
  deleteAnnouncement: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '删除公告',
      content: '确定删除该公告？',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteAnnouncement',
            data: { docId: item._id }
          }).then(function(result) {
            if (result.result && result.result.success) {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadAnnouncements()
            } else {
              wx.showToast({ title: result.result ? result.result.error : '删除失败', icon: 'none' })
            }
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },
  togglePinnedStatus: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    db.collection('announcements').doc(item._id).update({ data: { pinned: !item.pinned } }).then(function() { self.loadAnnouncements() }).catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
  },

  banUser: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '封禁用户',
      content: '确定封禁该用户？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').doc(item._id).update({ data: { banned: true } })
            .then(function() {
              wx.showToast({ title: '已封禁', icon: 'success' })
              self.loadUsers()
            })
            .catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
        }
      }
    })
  },
  unbanUser: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    db.collection('users').doc(item._id).update({ data: { banned: false } }).then(function() { wx.showToast({ title: '已解封', icon: 'success' }); self.loadUsers() }).catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
  },
  deleteUser: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '删除用户',
      content: '确定删除该用户数据？',
      success: function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteUser',
            data: { userId: item._id }
          }).then(function(result) {
            if (result.result && result.result.success) {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadUsers()
            } else {
              wx.showToast({ title: result.result ? result.result.error : '删除失败', icon: 'none' })
            }
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },
  setEditor: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '设为小编',
      content: '确定将该用户设为小编？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').doc(item._id).update({ data: { role: 'editor', title: '🌟 小编', titleColor: '#00d4ff' } })
            .then(function() {
              wx.showToast({ title: '已设为小编', icon: 'success' })
              self.loadUsers()
            })
            .catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
        }
      }
    })
  },
  removeEditor: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '取消小编',
      content: '确定取消该用户的小编身份？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').doc(item._id).update({ data: { role: '', title: '', titleColor: '' } })
            .then(function() {
              wx.showToast({ title: '已取消', icon: 'success' })
              self.loadUsers()
            })
            .catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
        }
      }
    })
  },
  
  onBallImgInput: function(e) {
    var idx = e.currentTarget.dataset.idx;
    var val = e.detail.value;
    var field = 'ballsConfig[' + idx + '].img';
    this.setData({ [field]: val });
  },
  
  loadBallsConfig: function() {
    var self = this;
    if (!db) return;
    var defaultBalls = [
      {id:1,name:'普通咕噜球',color:'#999',icon:'⚪',count:0,freeCount:0,desc:'基础捕捉率',price:0},
      {id:2,name:'高级咕噜球',color:'#1565c0',icon:'🔵',count:0,freeCount:0,desc:'捕捉率+30%',price:12000},
      {id:3,name:'国王球',color:'#f57f17',icon:'👑',count:0,freeCount:0,desc:'100%捕捉，必定了不起',price:0},
      {id:4,name:'美妙球',color:'#e91e63',icon:'💚',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:5,name:'好战球',color:'#d32f2f',icon:'⚔️',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:6,name:'光合球',color:'#2e7d32',icon:'🌿',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:7,name:'网兜球',color:'#388e3c',icon:'🪢',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:8,name:'暗星球',color:'#37474f',icon:'🌙',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:9,name:'奇趣球',color:'#ff6b6b',icon:'🎯',count:0,freeCount:0,desc:'100%捕捉，资质随机',price:80000},
      {id:10,name:'补光球',color:'#ffd93d',icon:'💡',count:0,freeCount:0,desc:'100%捕捉，资质随机',price:80000},
      {id:11,name:'棱镜球',color:'#a855f7',icon:'💎',count:0,freeCount:0,desc:'100%捕捉，必定了不起，完美无瑕，天赋随机，炫彩颜色粒子随机',price:0},
      {id:12,name:'织梦棱镜球',color:'#ec4899',icon:'🔮',count:0,freeCount:0,desc:'100%捕捉，必定了不起，完美无瑕，天赋随机，炫彩粒子为当前赛季主题颜色统一',price:800},
      {id:13,name:'狂欢棱镜球',color:'#f472b6',icon:'🎆',count:0,freeCount:0,desc:'狂欢系+70%',price:800},
      {id:14,name:'变幻球',color:'#06b6d4',icon:'🌀',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:15,name:'绝缘球',color:'#8b5cf6',icon:'🛡️',count:0,freeCount:0,desc:'绝缘精灵+45%',price:3000},
      {id:16,name:'调温球',color:'#f97316',icon:'🌡️',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:17,name:'淘沙球',color:'#d4a017',icon:'🏖️',count:0,freeCount:0,desc:'提升对应属性50%捕捉概率',price:3000},
      {id:18,name:'童话球',color:'#f472b6',icon:'🧚',count:0,freeCount:0,desc:'童话系+70%',price:800,img:'https://img.remit.ee/api/file/CAACAgUAAyEGAASHRsPbAAEYB8ZqaEBixsb7T3jYYu7SRMZ1uJv9MgAC2yUAAqj4SVcLsuCtMJ10xj0E.webp'}
    ];
    db.collection('site_config').doc('ball_images').get().then(res => {
      if(res.data && res.data.balls) {
        var cloudBalls = res.data.balls;
        var cloudMap = {};
        for (var i = 0; i < cloudBalls.length; i++) { cloudMap[String(cloudBalls[i].id)] = cloudBalls[i]; }
        var merged = [];
        for (var j = 0; j < defaultBalls.length; j++) {
          merged.push(cloudMap[String(defaultBalls[j].id)] || defaultBalls[j]);
        }
        // 追加不在默认列表中的云端自定义球
        var defaultIds = {};
        for (var k = 0; k < defaultBalls.length; k++) { defaultIds[String(defaultBalls[k].id)] = true; }
        for (var m = 0; m < cloudBalls.length; m++) {
          if (!defaultIds[String(cloudBalls[m].id)]) {
            merged.push(cloudBalls[m]);
          }
        }
        // 旧数据：特殊球 CNY 曾记在 price，拆到 cnyPrice
        for (var n = 0; n < merged.length; n++) {
          var mb = merged[n];
          if (mb.isSpecial && !mb.isBuy && !mb.cnyPrice && mb.price) {
            merged[n] = Object.assign({}, mb, { cnyPrice: mb.price, price: 0 });
          } else if (mb.cnyPrice == null) {
            merged[n] = Object.assign({}, mb, { cnyPrice: 0 });
          }
        }
        self.setData({ ballsConfig: merged });
      } else {
        self.setData({ ballsConfig: defaultBalls });
      }
    }).catch(err => {
      self.setData({ ballsConfig: defaultBalls });
    });
  },
  
  
    openBallModal: function(e) {

      var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item || null : null;
      if (item) {
        // 旧数据迁移：特殊球曾把 CNY 记在 price 里
        var price = item.price || 0;
        var cnyPrice = item.cnyPrice || 0;
        if (item.isSpecial && !item.isBuy && !item.cnyPrice && price) {
          cnyPrice = price;
          price = 0;
        }
        this.setData({
          editingBall: item,
          ballForm: {
            id: item.id || '',
            name: item.name || '',
            isBuy: item.isBuy || false,
            isCraft: item.isCraft || false,
            isSpecial: item.isSpecial || false,
            isActivity: item.isActivity || false,
            price: price,
            cnyPrice: cnyPrice,
              craftMaterials: item.craftMaterials || '',
            desc: item.desc || item.rate || '',
            source: item.source || '',
            img: item.img || '',
            color: item.color || '',
            icon: item.icon || ''
          },
          showBallModal: true
        });
      } else {
        this.setData({
          editingBall: null,
          ballForm: {
            id: 'ball_' + Date.now(),
            name: '',
            isBuy: false,
            isCraft: false,
            isSpecial: false,
            isActivity: false,
            price: 0,
            cnyPrice: 0,
              craftMaterials: '',
            desc: '',
            source: '',
            img: '',
            color: '',
            icon: ''
          },
          showBallModal: true
        });
      }
    },
    
    closeBallModal: function() {
      this.setData({ showBallModal: false });
    },
    onBallFormInput: function(e) {
      var field = e.currentTarget.dataset.field;
      var val = e.detail.value;
      // 洛克贝为整数；CNY 自由输入（含小数），确认时再解析
      if (field === 'price') val = parseInt(val) || 0;
      this.setData({ ['ballForm.' + field]: val });
    },
    onBallFormSwitch: function(e) {
      var field = e.currentTarget.dataset.field;
      var val = e.detail.value;
      this.setData({ ['ballForm.' + field]: val });
    },
    confirmBallForm: function() {
      var form = this.data.ballForm;
      if (!form.name) {
        wx.showToast({ title: '请输入名称', icon: 'none' });
        return;
      }
      // CNY 与洛克贝各自独立，不做换算
      var cnyRaw = form.cnyPrice;
      form.cnyPrice = (cnyRaw === '' || cnyRaw === null || cnyRaw === undefined) ? 0 : (parseFloat(cnyRaw) || 0);
      form.price = parseInt(form.price) || 0;
      var balls = this.data.ballsConfig;
      if (this.data.editingBall) {
        var fid = form.id;
        for (var i = 0; i < balls.length; i++) {
          if (String(balls[i].id) === String(fid)) {
            balls[i] = Object.assign({}, balls[i], form);
            break;
          }
        }
      } else {
        balls.push(Object.assign({}, form, { count: 0, freeCount: 0 }));
      }
      this.setData({
        ballsConfig: balls,
        showBallModal: false
      });
      wx.showToast({ title: '请记得点击保存修改到云端', icon: 'none' });
    },
    deleteBall: function(e) {
      var self = this;
      var id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '提示',
        content: '确定要删除这个道具球吗？',
        success: function(res) {
          if (res.confirm) {
            var rid = String(id);
            var balls = self.data.ballsConfig.filter(function(b) { return String(b.id) !== rid; });
            self.setData({ ballsConfig: balls });
            wx.showToast({ title: '请记得点击保存修改到云端', icon: 'none' });
          }
        }
      });
    },

    saveBallsConfig: function() {
    var self = this;
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return; }
    var balls = self.data.ballsConfig || [];
    if (!balls.length) {
      wx.showToast({ title: '列表为空，未保存', icon: 'none' });
      return;
    }
    self.setData({ ballsSubmitting: true });
    // 先读云端再合并写入，避免本地列表不全时把已新增的球覆盖丢失
    db.collection('site_config').doc('ball_images').get().then(function(res) {
      var cloudBalls = (res.data && res.data.balls) ? res.data.balls : [];
      var byId = {};
      var i;
      for (i = 0; i < balls.length; i++) {
        byId[String(balls[i].id)] = balls[i];
      }
      var merged = balls.slice();
      for (i = 0; i < cloudBalls.length; i++) {
        var cid = String(cloudBalls[i].id);
        if (!byId[cid]) {
          // 云端有、本地没有：保留，防止误删/加载失败后保存丢球
          merged.push(cloudBalls[i]);
          byId[cid] = cloudBalls[i];
        }
      }
      return merged;
    }).catch(function() {
      return balls;
    }).then(function(merged) {
      var customCount = 0, specialCount = 0, buyCount = 0, craftCount = 0, activityCount = 0;
      for (var i = 0; i < merged.length; i++) {
        var b = merged[i];
        if (b.isSpecial) specialCount++;
        if (b.isBuy) buyCount++;
        if (b.isCraft) craftCount++;
        if (b.isActivity) activityCount++;
        if (String(b.id).indexOf('ball_') === 0) customCount++;
      }
      return db.collection('site_config').doc('ball_images').set({
        data: { balls: merged }
      }).then(function() {
        wx.setStorageSync('balls_config_updated', true);
        self.setData({ ballsSubmitting: false, ballsConfig: merged });
        wx.showModal({
          title: '已保存到云端',
          content: '共 ' + merged.length + ' 种球\n自定义 ' + customCount + ' · 购买 ' + buyCount + ' · 合成 ' + craftCount + ' · 特殊 ' + specialCount + ' · 活动 ' + activityCount + '\n捕捉统计将自动同步',
          showCancel: false,
          confirmText: '知道了'
        });
      });
    }).catch(err => {
      self.setData({ ballsSubmitting: false });
      var msg = (err && (err.errMsg || err.message)) || '未知错误';
      wx.showModal({
        title: '保存失败',
        content: '未能写入云端：' + msg + '\n请检查网络/云环境后重试',
        showCancel: false
      });
    });
  },

  // ─── 异色精灵预设（捕捉统计目标精灵） ───
  loadShinyPets: function() {
    var self = this;
    if (!db) return;
    db.collection('site_config').doc('shiny_pets').get().then(function(res) {
      var list = (res.data && res.data.pets) || [];
      var seasons = (res.data && res.data.seasons) || ['S1', 'S2', 'S3', 'S4'];
      self.setData({ shinyPets: list, petSeasons: seasons });
    }).catch(function() {
      self.setData({ shinyPets: [], petSeasons: ['S1', 'S2', 'S3', 'S4'] });
    });
  },
  // 赛季分类：新增 / 重命名 / 删除（同时改到引用该赛季的精灵）
  openSeasonModal: function(e) {
    var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item : null;
    this.setData({
      editingSeason: item || null,
      seasonFormName: item ? String(item) : '',
      showSeasonModal: true
    });
  },
  closeSeasonModal: function() {
    this.setData({ showSeasonModal: false });
  },
  onSeasonNameInput: function(e) {
    this.setData({ seasonFormName: e.detail.value });
  },
  confirmSeasonForm: function() {
    var self = this;
    var name = (self.data.seasonFormName || '').trim();
    if (!name) { wx.showToast({ title: '请输入赛季名称', icon: 'none' }); return; }
    var seasons = (self.data.petSeasons || []).slice();
    var editing = self.data.editingSeason;
    if (editing) {
      var oldName = String(editing);
      if (name !== oldName && seasons.indexOf(name) >= 0) {
        wx.showToast({ title: '已存在同名赛季', icon: 'none' }); return;
      }
      for (var i = 0; i < seasons.length; i++) {
        if (String(seasons[i]) === oldName) { seasons[i] = name; break; }
      }
      // 同步更新引用旧名的精灵
      var pets = (self.data.shinyPets || []).map(function(p) {
        if (String(p.season) === oldName) return Object.assign({}, p, { season: name });
        return p;
      });
      self.setData({ petSeasons: seasons, shinyPets: pets, showSeasonModal: false });
    } else {
      if (seasons.indexOf(name) >= 0) { wx.showToast({ title: '已存在同名赛季', icon: 'none' }); return; }
      seasons.push(name);
      self.setData({ petSeasons: seasons, showSeasonModal: false });
    }
    wx.showToast({ title: '请记得保存到云端', icon: 'none' });
  },
  deleteSeason: function(e) {
    var self = this;
    var name = String(e.currentTarget.dataset.item);
    var seasons = (self.data.petSeasons || []);
    if (seasons.length <= 1) { wx.showToast({ title: '至少保留一个赛季', icon: 'none' }); return; }
    var used = 0;
    var pets = self.data.shinyPets || [];
    for (var i = 0; i < pets.length; i++) if (String(pets[i].season) === name) used++;
    wx.showModal({
      title: '删除赛季',
      content: used > 0 ? ('有 ' + used + ' 只精灵使用「' + name + '」，删除后将改为第一个赛季。确定？') : ('确定删除赛季「' + name + '」？'),
      success: function(res) {
        if (!res.confirm) return;
        var next = seasons.filter(function(s) { return String(s) !== name; });
        var fallback = next[0] || 'S1';
        var newPets = pets.map(function(p) {
          if (String(p.season) === name) return Object.assign({}, p, { season: fallback });
          return p;
        });
        self.setData({ petSeasons: next, shinyPets: newPets });
        wx.showToast({ title: '请记得保存到云端', icon: 'none' });
      }
    });
  },
  openPetModal: function(e) {
    var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item || null : null;
    var seasons = this.data.petSeasons && this.data.petSeasons.length ? this.data.petSeasons : ['S1', 'S2', 'S3', 'S4'];
    if (item) {
      var sIdx = seasons.indexOf(item.season || seasons[0]);
      this.setData({
        editingPet: item,
        petSeasonIndex: sIdx >= 0 ? sIdx : 0,
        petForm: {
          id: item.id || '',
          name: item.name || '',
          season: item.season || seasons[0],
          img: item.img || ''
        },
        showPetModal: true
      });
    } else {
      this.setData({
        editingPet: null,
        petSeasonIndex: 0,
        petForm: { id: 'pet_' + Date.now(), name: '', season: seasons[0], img: '' },
        showPetModal: true
      });
    }
  },
  closePetModal: function() {
    this.setData({ showPetModal: false });
  },
  onPetFormInput: function(e) {
    var field = e.currentTarget.dataset.field;
    this.setData({ ['petForm.' + field]: e.detail.value });
  },
  onPetSeasonChange: function(e) {
    var idx = Number(e.detail.value) || 0;
    var seasons = this.data.petSeasons || ['S1', 'S2', 'S3', 'S4'];
    this.setData({ petSeasonIndex: idx, 'petForm.season': seasons[idx] || seasons[0] || 'S1' });
  },
  confirmPetForm: function() {
    var form = this.data.petForm;
    if (!form.name || !String(form.name).trim()) {
      wx.showToast({ title: '请输入精灵名称', icon: 'none' });
      return;
    }
    form.name = String(form.name).trim();
    form.season = form.season || 'S1';
    form.img = form.img || '';
    var pets = (this.data.shinyPets || []).slice();
    if (this.data.editingPet) {
      var fid = form.id;
      for (var i = 0; i < pets.length; i++) {
        if (String(pets[i].id) === String(fid)) {
          pets[i] = Object.assign({}, pets[i], form);
          break;
        }
      }
    } else {
      pets.push(Object.assign({}, form));
    }
    this.setData({ shinyPets: pets, showPetModal: false });
    wx.showToast({ title: '请记得点击保存修改到云端', icon: 'none' });
  },
  deletePet: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个异色精灵吗？',
      success: function(res) {
        if (res.confirm) {
          var rid = String(id);
          var pets = (self.data.shinyPets || []).filter(function(p) { return String(p.id) !== rid; });
          self.setData({ shinyPets: pets });
          wx.showToast({ title: '请记得点击保存修改到云端', icon: 'none' });
        }
      }
    });
  },
  saveShinyPets: function() {
    var self = this;
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return; }
    var pets = self.data.shinyPets || [];
    var seasons = self.data.petSeasons && self.data.petSeasons.length ? self.data.petSeasons : ['S1', 'S2', 'S3', 'S4'];
    self.setData({ shinyPetSubmitting: true });
    db.collection('site_config').doc('shiny_pets').set({
      data: { pets: pets, seasons: seasons, updateTime: db.serverDate() }
    }).then(function() {
      wx.setStorageSync('shiny_pets_updated', true);
      self.setData({ shinyPetSubmitting: false });
      var bySeason = {};
      for (var i = 0; i < pets.length; i++) {
        var s = pets[i].season || '?';
        bySeason[s] = (bySeason[s] || 0) + 1;
      }
      var lines = [];
      for (var j = 0; j < seasons.length; j++) {
        lines.push(seasons[j] + ' ' + (bySeason[seasons[j]] || 0));
      }
      wx.showModal({
        title: '已保存到云端',
        content: '共 ' + pets.length + ' 只异色精灵 · ' + seasons.length + ' 个赛季\n' + lines.join(' · ') + '\n捕捉统计目标精灵将自动同步',
        showCancel: false,
        confirmText: '知道了'
      });
    }).catch(function(err) {
      self.setData({ shinyPetSubmitting: false });
      var msg = (err && (err.errMsg || err.message)) || '未知错误';
      wx.showModal({ title: '保存失败', content: '未能写入云端：' + msg, showCancel: false });
    });
  },

  refreshData: function() {
    this.setData({ loading: true })
    var tab = this.data.activeTab
    if (tab === 'announce') this.loadAnnouncements()
    else if (tab === 'activity') this.loadAdminActivities()
    else if (tab === 'subscribe') this.loadSubscribers()
    else if (tab === 'users') this.loadUsers()
    else if (tab === 'stats') this.loadStats()
    else if (tab === 'pages') this.loadPageConfigs()
    else if (tab === 'balls') { this.loadBallsConfig(); this.loadShinyPets() }
  },
  pushSubscribe: function(type, title, content) {
    var pages = {
      announcement: '/pages/index/index',
      activity: '/pages/activity/activity',
      merchant: '/pages/merchant/merchant'
    }
    notify.pushToSubscribers(type, title, content, pages[type] || '/pages/index/index', null, null, function(err, result) {
      if (err) {
        console.error('推送失败:', err)
        return
      }
      var sent = (result && result.sent != null) ? result.sent : 0
      wx.showToast({ title: sent > 0 ? ('已推送，' + sent + '人') : '已提交（无订阅）', icon: 'none' })
    })
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date)
    var rel = i18n.formatRelativeTime(d.getTime())
    if (rel) return rel
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  },
  loadAdminActivities: function() {
    var self = this
    var deletedIds = self.data.deletedLocalIds || []
    var localList = activitiesData.filter(function(item) { return deletedIds.indexOf(item.id) === -1 })
    var localMapped = localList.map(function(item) {
      return { _id: 'local_' + item.id, localId: item.id, title: item.title, content: item.desc, type: item.type, pinned: item.status === '置顶', start: item.start, end: item.end, image: '', timeStr: '', isCloud: false }
    })
    if (!db) { self.setData({ adminActivities: localMapped, loading: false }); return }
    db.collection('announcements').where({ type: 'event' }).orderBy('createTime', 'desc').limit(50).get()
      .then(function(res) {
        var cloudActivities = (res.data || []).map(function(item) {
          return {
            _id: item._id,
            title: item.title,
            content: item.content,
            richContent: item.richContent || [],
            subType: item.subType || '',
            collabLogo: item.collabLogo || '',
            type: item.type || '活动',
            pinned: item.pinned,
            start: item.start || item.startDate || '',
            end: item.end || item.endDate || '',
            startDate: item.startDate || item.start || '',
            endDate: item.endDate || item.end || '',
            image: item.image || '',
            source: item.source || '',
            timeStr: self.formatTime(item.createTime),
            isCloud: true
          }
        })
        self.setData({ adminActivities: localMapped.concat(cloudActivities), loading: false })
      })
      .catch(function() {
        self.setData({ adminActivities: localMapped, loading: false })
      })
  },
  loadSubscribers: function() {
    var self = this
    var config = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, merchant: true }
    self.setData({ subscribeConfig: config })
    if (!db) return
    if (this.subscribersWatcher) {
      this.subscribersWatcher.close()
    }
    this.setData({ loading: true })
    this.subscribersWatcher = db.collection('subscribers').orderBy('createTime', 'desc').limit(100).watch({
      onChange: function(snapshot) {
        var list = snapshot.docs || []
        for (var i = 0; i < list.length; i++) list[i].timeStr = self.formatTime(list[i].createTime)
        self.setData({ subscribers: list, loading: false })
      },
      onError: function(err) {
        console.error('Watch subscribers error', err)
        self.setData({ loading: false })
      }
    })
  },
  toggleSubscribeType: function(e) {
    var type = e.currentTarget.dataset.type
    var config = this.data.subscribeConfig
    config[type] = !config[type]
    this.setData({ subscribeConfig: config })
    wx.setStorageSync('subscribe_config', config)
    wx.showToast({ title: config[type] ? '已开启' : '已关闭', icon: 'success' })
  },
  openActivityModal: function(e) {
    var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item || null : null
    var richContent = []
    var source = ''
    var activityFormContent = ''
    var activityFormHtml = ''
    if (item && item.richContent && item.richContent.length > 0) {
      richContent = item.richContent
    } else if (item && item.content) {
      // 旧数据无 richContent：只放进编辑器，避免再拼一个 text 块导致内容重复
      activityFormContent = item.content
      activityFormHtml = item.content
    }
    if (item && item.source) {
      source = item.source
    }
    // 新建时尝试恢复未提交草稿
    if (!item) {
      var adraft = this._restoreActivityDraft()
      if (adraft) {
        var selfA = this
        wx.showModal({
          title: '发现未发布草稿',
          content: '标题：' + (adraft.activityFormTitle || '（无标题）'),
          confirmText: '恢复草稿',
          cancelText: '不用，新建',
          success: function(mr) {
            if (mr.confirm) {
              selfA.setData({
                showActivityModal: true,
                activityEditingItem: null,
                activityFormTitle: adraft.activityFormTitle || '',
                activityFormContent: adraft.activityFormContent || '',
                activityFormHtml: adraft.activityFormHtml || '',
                activityFormType: adraft.activityFormType || '活动',
                activityFormStatus: adraft.activityFormStatus || '进行中',
                activityFormStart: adraft.activityFormStart || '',
                activityFormStartTime: adraft.activityFormStartTime || '',
                activityFormEnd: adraft.activityFormEnd || '',
                activityFormEndTime: adraft.activityFormEndTime || '',
                activityFormSource: adraft.activityFormSource || '',
                activityRichContent: adraft.activityRichContent || []
              })
            } else {
              selfA._clearActivityDraft()
              selfA.setData({
                showActivityModal: true, activityEditingItem: null,
                activityFormTitle: '', activityFormContent: '', activityFormHtml: '',
                activityFormType: '活动', activityFormStatus: '进行中',
                activityFormStart: '', activityFormStartTime: '',
                activityFormEnd: '', activityFormEndTime: '',
      activityFormSource: '', activityRichContent: []
              })
            }
          }
        })
        return
      }
    }
    this._activityEditIdx = null
    this.setData({
      showActivityModal: true,
      activityEditingItem: item,
      activityFormTitle: item ? item.title : '',
      activityFormContent: activityFormContent,
      activityFormHtml: activityFormHtml,
      activityFormType: item ? (item.type || '活动') : '活动',
      activityFormStatus: item ? (item.pinned ? '置顶' : '进行中') : '进行中',
      activityFormStart: item ? (item.start || item.startDate || '') : '',
      activityFormStartTime: item ? (item.startTime || '') : '',
      activityFormEnd: item ? (item.end || item.endDate || '') : '',
      activityFormEndTime: item ? (item.endTime || '') : '',
      activityFormSource: source,
      activityRichContent: richContent,
      // 重置编辑器样式状态，防止上次编辑残留
      activityFontStyle: 'normal',
      activityFontWeight: 'normal',
      activityFontSize: 28,
      activityFontColor: '#ffffff',
      activityFontFamily: 'sans-serif',
      activityUnderline: false,
      activityStrike: false,
      activityHeader: 0,
      activityAlign: '',
      showActivitySizePicker: false,
      showActivityColorPicker: false,
      showActivityFontFamilyPicker: false
    })
  },
  closeActivityModal: function() {
    this._saveActivityDraft()
    this.setData({ showActivityModal: false })
  },
  // ── 活动草稿：防误关丢失 ──
  _saveActivityDraft: function() {
    var d = this.data
    if (d.activityEditingItem) return
    var has = d.activityFormTitle || d.activityFormContent || (d.activityRichContent && d.activityRichContent.length)
    if (!has) { try { wx.removeStorageSync('admin_draft_activity') } catch (e) {} return }
    try {
      wx.setStorageSync('admin_draft_activity', {
        activityFormTitle: d.activityFormTitle,
        activityFormContent: d.activityFormContent,
        activityFormHtml: d.activityFormHtml,
        activityFormType: d.activityFormType,
        activityFormStatus: d.activityFormStatus,
        activityFormStart: d.activityFormStart,
        activityFormStartTime: d.activityFormStartTime,
        activityFormEnd: d.activityFormEnd,
        activityFormEndTime: d.activityFormEndTime,
        activityFormSource: d.activityFormSource,
        activityRichContent: d.activityRichContent
      })
    } catch (e) {}
  },
  _restoreActivityDraft: function() {
    var draft = null
    try { draft = wx.getStorageSync('admin_draft_activity') } catch (e) {}
    return draft || null
  },
  _clearActivityDraft: function() {
    try { wx.removeStorageSync('admin_draft_activity') } catch (e) {}
  },
  showActivityMusicDialog: function() {
    var self = this
    wx.getClipboardData({
      success: function(cb) {
        var clipText = (cb.data || '').trim()
        wx.showModal({
          title: '添加音乐',
          content: clipText || '',
          placeholderText: '粘贴歌曲分享文本（支持网易云/QQ音乐等）',
          editable: true,
          success: function(resShare) {
            var shareText = (resShare.confirm ? resShare.content : clipText).trim()
            if (!shareText) return
            var cleanedUrl = extractCleanURL(shareText)
            if (cleanedUrl) {
              var url = convertMusicUrl(cleanedUrl)
              wx.showModal({
                title: '输入歌曲名称',
                content: '',
                placeholderText: '歌名 - 歌手',
                editable: true,
                success: function(nameRes) {
                  var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : shareText.substring(0, 20)
                    self._askForCover(function(cover) {
                      self._addActivityMusicBlock(self, { type: 'music', name: name || '推荐单曲', url: url, cover: cover })
                    })
                  }
                })
            } else {
              wx.showToast({ title: '未找到有效的音乐链接', icon: 'none' })
            }
          }
        })
      },
      fail: function() {
        wx.showModal({
          title: '添加音乐',
          content: '',
          placeholderText: '粘贴歌曲分享文本',
          editable: true,
          success: function(resShare) {
            if (resShare.confirm && resShare.content && resShare.content.trim()) {
              var shareText = resShare.content.trim()
              var cleanedUrl = extractCleanURL(shareText)
              if (cleanedUrl) {
                var url = convertMusicUrl(cleanedUrl)
                wx.showModal({
                  title: '输入歌曲名称',
                  content: '',
                  placeholderText: '歌名 - 歌手',
                  editable: true,
                  success: function(nameRes) {
                    var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : shareText.substring(0, 20)
                      self._askForCover(function(cover) {
                        self._addActivityMusicBlock(self, { type: 'music', name: name || '推荐单曲', url: url, cover: cover })
                      })
                    }
                  })
              } else {
                wx.showToast({ title: '未找到有效的音乐链接', icon: 'none' })
              }
            }
          }
        })
      }
    })
  },
  _addActivityMusicBlock: function(self, block) {
    self._insertActivityBlock(block, { stripUrls: block.url ? [block.url] : [], toast: '已添加: ' + block.name })
  },
  _showVideoDialogFallback: function() {
    var self = this
    wx.showModal({
      title: '添加视频',
      content: '',
      placeholderText: '粘贴视频链接（支持微博/哔哩哔哩）',
      editable: true,
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          var url = extractCleanURL(res.content.trim())
          if (!url) { wx.showToast({ title: '请输入有效链接', icon: 'none' }); return }
          var videoInfo = parseVideoUrl(url)
          if (!videoInfo) {
            wx.showToast({ title: '未识别视频链接', icon: 'none' })
            return
          }
          wx.showModal({
            title: '视频标题（可选）',
            content: '',
            placeholderText: '输入视频标题',
            editable: true,
            success: function(nameRes) {
              var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
              var block = { type: 'video', platform: videoInfo.platform, platformName: videoInfo.platformName, name: name, url: videoInfo.url, vid: videoInfo.id }
              self._insertFormBlock(block, { stripUrls: [videoInfo.url], toast: '已添加: ' + videoInfo.platformName + '视频' })
            }
          })
        }
      }
    })
  },
  _isImageUrl: function(url) {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)(\?|$)/i.test(url) || /^cloud:\/\//i.test(url) || /^https?:\/\/.*(img|image|photo|pic|picture)/i.test(url)
  },
  showImageBlockDialog: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照', '从剪贴板粘贴', '输入图片链接'],
      success: function(res) {
        if (res.tapIndex === 2) {
          wx.getClipboardData({
            success: function(cb) {
              var text = (cb.data || '').trim()
              if (text && self._isImageUrl(text)) {
                self._insertFormBlock({ type: 'image', url: text }, { toast: '已添加图片' })
              } else if (text) {
                wx.showModal({
                  title: '剪贴板内容',
                  content: text.substring(0, 60),
                  confirmText: '添加',
                  success: function(mr) {
                    if (mr.confirm) {
                      self._insertFormBlock({ type: 'image', url: text }, { toast: '已添加图片' })
                    }
                  }
                })
              } else {
                wx.showToast({ title: '剪贴板无内容', icon: 'none' })
              }
            },
            fail: function() {
              wx.showToast({ title: '读取剪贴板失败', icon: 'none' })
            }
          })
        } else if (res.tapIndex === 3) {
          wx.showModal({
            title: '输入图片链接',
            content: '',
            editable: true,
            placeholderText: '粘贴图片URL地址',
            success: function(urlRes) {
              if (urlRes.confirm && urlRes.content && urlRes.content.trim()) {
                self._insertFormBlock({ type: 'image', url: urlRes.content.trim() }, { toast: '已添加图片' })
              }
            }
          })
        } else {
          var sourceType = res.tapIndex === 0 ? ['album'] : ['camera']
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: sourceType,
            success: function(imgRes) {
              var filePath = imgRes.tempFilePaths[0]
              wx.showLoading({ title: '上传中...' })
              var ext = filePath.split('.').pop() || 'jpg'
              var cloudPath = 'richtext/' + Date.now() + '.' + ext
              wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
                .then(function(uploadRes) {
                  wx.hideLoading()
                  self._insertFormBlock({ type: 'image', url: uploadRes.fileID }, { toast: '已添加图片' })
                })
                .catch(function() {
                  wx.hideLoading()
                  wx.showToast({ title: '上传失败', icon: 'none' })
                })
            }
          })
        }
      }
    })
  },
  showActivityImageBlockDialog: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照', '从剪贴板粘贴', '输入图片链接'],
      success: function(res) {
        if (res.tapIndex === 2) {
          wx.getClipboardData({
            success: function(cb) {
              var text = (cb.data || '').trim()
              if (text && self._isImageUrl(text)) {
                self._insertActivityBlock({ type: 'image', url: text }, { toast: '已添加图片' })
              } else if (text) {
                wx.showModal({
                  title: '剪贴板内容',
                  content: text.substring(0, 60),
                  confirmText: '添加',
                  success: function(mr) {
                    if (mr.confirm) {
                      self._insertActivityBlock({ type: 'image', url: text }, { toast: '已添加图片' })
                    }
                  }
                })
              } else {
                wx.showToast({ title: '剪贴板无内容', icon: 'none' })
              }
            },
            fail: function() {
              wx.showToast({ title: '读取剪贴板失败', icon: 'none' })
            }
          })
        } else if (res.tapIndex === 3) {
          wx.showModal({
            title: '输入图片链接',
            content: '',
            editable: true,
            placeholderText: '粘贴图片URL地址',
            success: function(urlRes) {
              if (urlRes.confirm && urlRes.content && urlRes.content.trim()) {
                self._insertActivityBlock({ type: 'image', url: urlRes.content.trim() }, { toast: '已添加图片' })
              }
            }
          })
        } else {
          var sourceType = res.tapIndex === 0 ? ['album'] : ['camera']
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: sourceType,
            success: function(imgRes) {
              var filePath = imgRes.tempFilePaths[0]
              wx.showLoading({ title: '上传中...' })
              var ext = filePath.split('.').pop() || 'jpg'
              var cloudPath = 'richtext/' + Date.now() + '.' + ext
              wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
                .then(function(uploadRes) {
                  wx.hideLoading()
                  self._insertActivityBlock({ type: 'image', url: uploadRes.fileID }, { toast: '已添加图片' })
                })
                .catch(function() {
                  wx.hideLoading()
                  wx.showToast({ title: '上传失败', icon: 'none' })
                })
            }
          })
        }
      }
    })
  },
  showActivityVideoDialog: function() {
    var self = this
    wx.getClipboardData({
      success: function(cb) {
        var clipText = (cb.data || '').trim()
        var defaultContent = clipText ? extractCleanURL(clipText) : ''
        wx.showModal({
          title: '添加视频',
          content: defaultContent,
          placeholderText: '粘贴视频链接（支持微博/哔哩哔哩）',
          editable: true,
          success: function(res) {
            var inputUrl = (res.confirm ? (res.content || defaultContent) : defaultContent).trim()
            if (!inputUrl) return
            if (!/^https?:\/\//i.test(inputUrl)) {
              inputUrl = extractCleanURL(inputUrl)
            }
            if (!inputUrl) { wx.showToast({ title: '请输入有效链接', icon: 'none' }); return }
            var videoInfo = parseVideoUrl(inputUrl)
            if (!videoInfo) {
              if (/^https?:\/\//i.test(inputUrl)) {
                wx.showModal({
                  title: '视频标题（可选）',
                  content: '',
                  placeholderText: '输入视频标题',
                  editable: true,
                  success: function(nameRes) {
                    var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
                    self._askForCover(function(cover) {
                      var block = { type: 'video', platform: 'other', platformName: '其他', name: name, url: inputUrl, vid: '', cover: cover }
                      self._insertActivityBlock(block, { stripUrls: [inputUrl], toast: '已添加视频' })
                    })
                  }
                })
              } else {
                wx.showToast({ title: '未识别视频链接', icon: 'none' })
              }
              return
            }
            wx.showModal({
              title: '视频标题（可选）',
              content: '',
              placeholderText: '输入视频标题',
              editable: true,
              success: function(nameRes) {
                var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
                self._askForCover(function(cover) {
                  var block = { type: 'video', platform: videoInfo.platform, platformName: videoInfo.platformName, name: name, url: videoInfo.url, vid: videoInfo.id, cover: cover }
                  self._insertActivityBlock(block, { stripUrls: [videoInfo.url], toast: '已添加: ' + videoInfo.platformName + '视频' })
                })
              }
            })
          }
        })
      },
      fail: function() {
        wx.showModal({
          title: '添加视频',
          content: '',
          placeholderText: '粘贴视频链接（支持微博/哔哩哔哩）',
          editable: true,
          success: function(res) {
            if (res.confirm && res.content && res.content.trim()) {
              var url = extractCleanURL(res.content.trim())
              if (!url) { wx.showToast({ title: '请输入有效链接', icon: 'none' }); return }
              var videoInfo = parseVideoUrl(url)
              if (!videoInfo) { wx.showToast({ title: '未识别视频链接', icon: 'none' }); return }
                  wx.showModal({
                    title: '视频标题（可选）',
                    content: '',
                    placeholderText: '输入视频标题',
                    editable: true,
                    success: function(nameRes) {
                      var name = (nameRes.confirm && nameRes.content) ? nameRes.content.trim() : ''
                      self._askForCover(function(cover) {
                        var block = { type: 'video', platform: videoInfo.platform, platformName: videoInfo.platformName, name: name, url: videoInfo.url, vid: videoInfo.id, cover: cover }
                        self._insertActivityBlock(block, { stripUrls: [videoInfo.url], toast: '已添加: ' + videoInfo.platformName + '视频' })
                      })
                    }
                  })
            }
          }
        })
      }
    })
  },
  _addActivityVideoBlock: function(self, videoInfo, name) {
    var block = { type: 'video', platform: videoInfo.platform, platformName: videoInfo.platformName, name: name || '', url: videoInfo.url, vid: videoInfo.id }
    self._insertActivityBlock(block, { stripUrls: [videoInfo.url], toast: '已添加: ' + videoInfo.platformName + '视频' })
  },
  onActivityTitleInput: function(e) { this.setData({ activityFormTitle: e.detail.value }) },
  onActivityContentInput: function(e) { this.setData({ activityFormContent: e.detail.value }) },
  onActivityEditorReady: function() {
    var self = this
    wx.createSelectorQuery().in(this).select('#activityEditor').context(function(res) {
      self.activityEditorCtx = res.context
      if (!self.activityEditorCtx) return
      if (self.data.activityFormContent) {
        self.activityEditorCtx.setContents({
          html: self.data.activityFormHtml || self.data.activityFormContent
        })
      } else {
        // 弹窗复用编辑器实例时清空残留内容
        self.activityEditorCtx.clear()
      }
    }).exec()
  },
  onActivityEditorInput: function(e) {
    var text = e.detail.text || ''
    if (text.endsWith('\n')) {
      text = text.slice(0, -1)
    }
    this.setData({ 
      activityFormContent: text,
      activityFormHtml: e.detail.html || ''
    })
  },
  onActivityEditorStatusChange: function(e) {
    var formats = e.detail || {}
    this.setData({
      activityFontWeight: formats.bold ? 'bold' : 'normal',
      activityFontStyle: formats.italic ? 'italic' : 'normal',
      activityFontColor: formats.color || '#ffffff',
      activityFontFamily: formats.fontFamily || 'sans-serif',
      activityUnderline: formats.underline || false,
      activityStrike: formats.strike || false,
      activityHeader: formats.header || 0,
      activityAlign: formats.align || ''
    })
  },
  onActivityTypeInput: function(e) { this.setData({ activityFormType: e.detail.value }) },
  onActivityStartInput: function(e) { this.setData({ activityFormStart: e.detail.value }) },
  onActivityEndInput: function(e) { this.setData({ activityFormEnd: e.detail.value }) },
  onActivityStartChange: function(e) { this.setData({ activityFormStart: e.detail.value }) },
    onActivityStartTimeChange: function(e) { this.setData({ activityFormStartTime: e.detail.value }) },
    onActivityEndTimeChange: function(e) { this.setData({ activityFormEndTime: e.detail.value }) },

  onActivityEndChange: function(e) { this.setData({ activityFormEnd: e.detail.value }) },
  onActivitySourceInput: function(e) { this.setData({ activityFormSource: e.detail.value }) },
  onActivityStatusChange: function(e) { var statuses = ['进行中','即将开始','置顶']; this.setData({ activityFormStatus: statuses[e.detail.value] }) },
  _autoCommitActivityText: activityOps.autoCommitText,
  toggleActivityBold: activityOps.toggleBold,
  toggleActivityItalic: activityOps.toggleItalic,
  activityToggleUnderline: activityOps.toggleUnderline,
  activityToggleStrike: activityOps.toggleStrike,
  activityToggleHeader2: activityOps.toggleHeader2,
  activityToggleHeader3: activityOps.toggleHeader3,
  setActivityFontSize: activityOps.setFontSize,
  setActivityFontColor: activityOps.setFontColor,
  setActivityFontFamily: activityOps.setFontFamily,
  showActivityFontSizePicker: activityOps.showFontSizePicker,
  showActivityFontColorPicker: activityOps.showFontColorPicker,
  showActivityFontFamilyPicker: activityOps.showFontFamilyPicker,
  addActivityRichTextBlock: activityOps.addRichTextBlock,
  addActivityRichQuoteBlock: activityOps.addRichQuoteBlock,
  removeActivityRichBlock: activityOps.removeRichBlock,
  editActivityRichBlock: function(e) {
    var idx = e.currentTarget.dataset.idx
    var block = this.data.activityRichContent[idx]
    var richContent = this.data.activityRichContent
    if (block.type === 'swiper') {
      var self = this;
      var itemList = [];
      for (var i = 0; i < block.urls.length; i++) {
        if (i < 5) itemList.push('删除第 ' + (i+1) + ' 张');
      }
      if (block.urls.length > 5) itemList.push('删除最后一张 (第' + block.urls.length + '张)');
      wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
          var deleteIdx = res.tapIndex;
          if (deleteIdx === 5) deleteIdx = block.urls.length - 1;
          block.urls.splice(deleteIdx, 1);
          if (block.urls.length === 0) richContent.splice(idx, 1);
          self.setData({ activityRichContent: richContent });
          wx.showToast({ title: '已删除图片', icon: 'success' });
        }
      });
      return;
    }
    // 引用块原地编辑，避免拉进编辑器后丢失 quote 类型
    if (block.type === 'quote') {
      var self2 = this
      wx.showModal({
        title: '编辑引用',
        content: block.content || '',
        editable: true,
        placeholderText: '输入引用内容',
        success: function(mr) {
          if (mr.confirm && mr.content !== undefined) {
            var rc = self2.data.activityRichContent.slice()
            rc[idx] = Object.assign({}, block, { content: mr.content })
            self2.setData({ activityRichContent: rc })
            wx.showToast({ title: '已更新引用', icon: 'success' })
          }
        }
      })
      return
    }
    richContent.splice(idx, 1)
    // 记录原位置：改完落块时插回原处，而不是沉到文末
    this._activityEditIdx = idx
    this.setData({
      activityRichContent: richContent,
      activityFormContent: block.html || block.content,
      activityFormHtml: block.html || '',
      activityFontStyle: block.style || 'normal',
      activityFontWeight: block.weight || 'normal',
      activityFontSize: block.size || 28,
      activityFontColor: block.color || '#ffffff',
      activityFontFamily: block.fontFamily || 'sans-serif'
    })
    if (this.activityEditorCtx) {
      this.activityEditorCtx.setContents({
        html: block.html || block.content
      })
    }
  },
  importActivityFileToTable: function() {
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
              self._processActivityImportedTextToTable(text)
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
          }).then(function(parseRes) {
            wx.hideLoading()
            if (parseRes.result && parseRes.result.success) {
              self._processActivityImportedTextToTable(parseRes.result.content)
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
  _processActivityImportedTextToTable: activityOps.processImportedTextToTable,
  showActivityAttachmentDialog: function() {
    var self = this
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success: function(res) {
        var file = res.tempFiles[0]
        wx.showLoading({ title: '上传附件中...' })
        var cloudPath = 'attachments/' + Date.now() + '_' + file.name
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: file.path
        }).then(function(uploadRes) {
          wx.hideLoading()
          var sizeKb = (file.size / 1024).toFixed(1)
          var sizeText = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB'
          var block = {
            type: 'attachment',
            name: file.name,
            url: uploadRes.fileID,
            size: file.size,
            sizeText: sizeText
          }
          self._insertActivityBlock(block, { toast: '附件上传成功' })
        }).catch(function(err) {
          wx.hideLoading()
          wx.showToast({ title: '附件上传失败', icon: 'none' })
          console.error(err)
        })
      }
    })
  },
  showActivityLinkDialog: function() {
    var self = this
    wx.showModal({
      title: '添加超链接',
      content: '',
      placeholderText: '请输入链接地址（以 http 或 https 开头）',
      editable: true,
      success: function(resUrl) {
        if (resUrl.confirm && resUrl.content && resUrl.content.trim()) {
          var url = resUrl.content.trim()
          if (!/^https?:\/\//i.test(url)) {
            wx.showToast({ title: '链接需以 http 或 https 开头', icon: 'none' })
            return
          }
          wx.showModal({
            title: '链接文字说明',
            content: '',
            placeholderText: '请输入链接显示的文字说明',
            editable: true,
            success: function(resText) {
              if (resText.confirm) {
                var text = (resText.content || '').trim() || '快捷链接'
                var isVideo = /v\.qq\.com|bilibili\.com|video|youtube/i.test(url)
                var block = { type: 'link', text: text, url: url, isVideo: isVideo }
                self._insertActivityBlock(block, { toast: '超链接已添加' })
              }
            }
          })
        }
      }
    })
  },
  showActivityDividerDialog: function() {
    // 先落草稿再插分割线，顺序与所见一致
    this._insertActivityBlock({ type: 'divider' }, { toast: '已添加分割线' })
  },
          submitActivity: function() {
    var self = this
    if (self.data.activitySubmitting) return
    var title = self.data.activityFormTitle.trim()
    var content = self.data.activityFormContent.trim()
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return }
    self.setData({ activitySubmitting: true })
    var richContent = (self.data.activityRichContent || []).slice()
    if (content) {
      // 编辑中的块插回原位；否则新文字落到文末
      var draftBlock = {
        type: 'text', content: content, html: self.data.activityFormHtml || '', style: self.data.activityFontStyle,
        weight: self.data.activityFontWeight || 'normal', size: self.data.activityFontSize || 28, color: self.data.activityFontColor || '#ffffff',
        fontFamily: self.data.activityFontFamily || 'sans-serif'
      }
      var editIdx = self._activityEditIdx
      if (typeof editIdx === 'number' && editIdx >= 0 && editIdx <= richContent.length) {
        richContent.splice(editIdx, 0, draftBlock)
      } else {
        richContent.push(draftBlock)
      }
      self._activityEditIdx = null
    }
    var finalContent = richEditor.buildHtmlFromRichContent(richContent)

    var data = {
      title: title, content: finalContent, type: 'event',
      pinned: self.data.activityFormStatus === '置顶',
      start: self.data.activityFormStart, end: self.data.activityFormEnd,
      startDate: self.data.activityFormStart || '',
      startTime: self.data.activityFormStartTime || '',
      endDate: self.data.activityFormEnd || '',
      endTime: self.data.activityFormEndTime || '',
      source: self.data.activityFormSource,
      richContent: richContent,
      updateTime: db.serverDate()
    }
    var actEditItemId = self.data.activityEditingItem ? self.data.activityEditingItem._id : null
    var promise = self.data.activityEditingItem
      ? db.collection('announcements').doc(self.data.activityEditingItem._id).update({ data: data })
      : (data.createTime = db.serverDate(), data.author = app.globalData.userInfo ? app.globalData.userInfo.nickName : 'Admin', db.collection('announcements').add({ data: data }))
    promise.then(function(res) {
      self.setData({ activitySubmitting: false, showActivityModal: false, activityEditingItem: null, activityFormHtml: '' });
      self._clearActivityDraft()
      wx.showToast({ title: '操作成功', icon: 'success' });
      self.loadAdminActivities();
      self.pushSubscribe('activity', notify.smartTruncate(title, 20), notify.smartTruncate(content, 20));
      var actDocId = actEditItemId || (res && res._id)
      if (actDocId) self.setData({ _lastDocId: actDocId, _lastDocTitle: title, _lastDocContent: content || title })
    }).catch(function() {
      self.setData({ activitySubmitting: false });
      wx.showToast({ title: '操作失败', icon: 'none' });
    });
  },
  toggleActivityPinned: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    if (!item.isCloud) { wx.showToast({ title: '本地活动无法置顶', icon: 'none' }); return }
    db.collection('announcements').doc(item._id).update({ data: { pinned: !item.pinned } }).then(function() { self.loadAdminActivities() }).catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
  },
  deleteActivity: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    var label = item.isCloud ? '该云端活动' : '该本地活动'
    wx.showModal({ title: '删除活动', content: '确定删除' + label + '？',
      success: function(res) {
        if (res.confirm) {
          if (item.isCloud) {
            db.collection('announcements').doc(item._id).remove()
              .then(function() { wx.showToast({ title: '已删除', icon: 'success' }); self.loadAdminActivities() })
              .catch(function() { wx.showToast({ title: '删除失败', icon: 'none' }) })
          } else {
            var deletedIds = self.data.deletedLocalIds.concat([item.localId])
            self.setData({ deletedLocalIds: deletedIds })
            wx.setStorageSync('deleted_local_activities', deletedIds)
            wx.showToast({ title: '已删除', icon: 'success' })
            self.loadAdminActivities()
          }
        }
      }
    })
  },
  deleteSubscriber: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({ title: '删除订阅', content: '确定删除该订阅记录？',
      success: function(res) {
        if (res.confirm) {
          db.collection('subscribers').doc(item._id).remove()
            .then(function() { wx.showToast({ title: '已删除', icon: 'success' }); self.loadSubscribers() })
            .catch(function() { wx.showToast({ title: '删除失败', icon: 'none' }) })
        }
      }
    })
  },
      testPush: function(e) {
      var type = e.currentTarget.dataset.type
      var self = this
      var testTitle = notify.pushI18n('testPush', '测试推送')
      var testContent = notify.pushI18n('testPushContent', '这是一条测试消息')
      var confirmText = notify.pushI18n('testPushConfirm', '将发送一条测试推送，是否继续？')
      wx.showModal({ title: testTitle, content: confirmText,
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({ title: notify.pushI18n('submitting', '发送中...') })
            notify.pushToSubscribers(type, notify.smartTruncate(testTitle, 20), notify.smartTruncate(testContent, 20), null, null, null, function(err, result) {
              wx.hideLoading()
              if (err) {
                wx.showToast({ title: '推送失败，请重试', icon: 'none' })
                return
              }
              var sent = (result && result.sent != null) ? result.sent : 0
              wx.showToast({ title: sent > 0 ? ('已推送，' + sent + '人') : '已提交（无订阅）', icon: 'success' })
              if (self.loadSubscribers) self.loadSubscribers()
            })
          }
        }
      })
    },
  
  undo: formOps.undo,
  alignLeft: formOps.alignLeft,
  alignCenter: formOps.alignCenter,
  alignRight: formOps.alignRight,
  activityUndo: activityOps.undo,
  activityAlignLeft: activityOps.alignLeft,
  activityAlignCenter: activityOps.alignCenter,
  activityAlignRight: activityOps.alignRight,

  editMediaCover: function(e) {
    var self = this;
    var idx = e.currentTarget.dataset.idx;
    var target = e.currentTarget.dataset.target;
    self._askForCover(function(cover) {
      if (cover === undefined) return;
      if (target === 'activity') {
        var richContent = self.data.activityRichContent;
        if (richContent[idx]) {
          richContent[idx].cover = cover;
          self.setData({ activityRichContent: richContent });
        }
      } else {
        var richContent = self.data.formRichContent;
        if (richContent[idx]) {
          richContent[idx].cover = cover;
          self.setData({ formRichContent: richContent });
        }
      }
    });
  },
  
  _askForCover: function(callback) {
    wx.showActionSheet({
      itemList: ['从相册上传封面', '粘贴图片链接', '不添加封面'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(imgRes) {
              wx.showLoading({ title: '上传中...' })
              var ext = imgRes.tempFilePaths[0].split('.').pop() || 'jpg'
              wx.cloud.uploadFile({ cloudPath: 'cover/' + Date.now() + '.' + ext, filePath: imgRes.tempFilePaths[0] })
                .then(function(uploadRes) {
                  wx.hideLoading()
                  callback(uploadRes.fileID)
                })
                .catch(function() {
                  wx.hideLoading()
                  wx.showToast({ title: '上传失败', icon: 'none' })
                  callback('')
                })
            },
            fail: function() { callback('') }
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '输入图片链接',
            editable: true,
            success: function(urlRes) {
              callback((urlRes.confirm && urlRes.content) ? urlRes.content.trim() : '')
            },
            fail: function() { callback('') }
          })
        } else {
          callback('')
        }
      },
      fail: function() { callback('') }
    })
  },
  showActivitySwiperDialog: function() {
    var self = this;
    wx.showModal({
      title: '创建/追加滚动图(活动)',
      content: '',
      editable: true,
      placeholderText: '请输入单张滚动图片URL...',
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          var url = res.content.trim();
          var richContent = self.data.activityRichContent || [];
          // 追加到上一个轮播：不动编辑器草稿，避免把轮播拆开
          if (richContent.length > 0 && richContent[richContent.length - 1].type === 'swiper') {
            richContent[richContent.length - 1].urls.push(url);
            self.setData({ activityRichContent: richContent });
            wx.showToast({ title: '已追加滚动图', icon: 'success' });
          } else {
            self._insertActivityBlock({ type: 'swiper', urls: [url] }, { toast: '已添加滚动图' });
          }
        }
      }
    });
  },

  showSwiperDialog: function() {
    var self = this;
    wx.showModal({
      title: '添加/追加滚动图',
      content: '',
      editable: true,
      placeholderText: '请输入单张滚动图片URL...',
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          var url = res.content.trim();
          var richContent = self.data.formRichContent || [];
          // 追加到上一个轮播：不动编辑器草稿，避免把轮播拆开
          if (richContent.length > 0 && richContent[richContent.length - 1].type === 'swiper') {
            richContent[richContent.length - 1].urls.push(url);
            self.setData({ formRichContent: richContent });
            wx.showToast({ title: '已追加滚动图', icon: 'success' });
          } else {
            self._insertFormBlock({ type: 'swiper', urls: [url] }, { toast: '已添加滚动图' });
          }
        }
      }
    });
  },

  // ── Swarm Locations ──
  closeSwarmModal: function() {
    this.setData({ showSwarmModal: false })
  },
  openSwarmLocationModal: function() {
    this.setData({ showSwarmModal: true, swarmLocationInput: '' })
  },
  deleteSwarmLocation: function(e) {
    var idx = e.currentTarget.dataset.index
    var list = this.data.swarmLocations.slice()
    list.splice(idx, 1)
    var self = this
    self.setData({ swarmLocations: list })
    if (!db) return
    db.collection('swarm_config').doc('locations').get()
      .then(function() {
        return db.collection('swarm_config').doc('locations').update({ data: { locations: list } })
      })
      .catch(function() {
        return db.collection('swarm_config').add({ data: { _id: 'locations', locations: list } })
      })
  },
  onSwarmInput: function(e) {
    this.setData({ swarmLocationInput: e.detail.value })
  },
  saveSwarmLocation: function() {
    var val = (this.data.swarmLocationInput || '').trim()
    if (!val) return
    var list = this.data.swarmLocations.slice()
    list.push(val)
    var self = this
    self.setData({ swarmLocations: list, showSwarmModal: false, swarmLocationInput: '' })
    if (!db) return
    db.collection('swarm_config').doc('locations').get()
      .then(function() {
        return db.collection('swarm_config').doc('locations').update({ data: { locations: list } })
      })
      .catch(function() {
        return db.collection('swarm_config').add({ data: { _id: 'locations', locations: list } })
      })
  },

  // ── Site Config ──
  toggleShowLogShareBtn: function() {
    var newVal = !this.data.showLogShareBtn
    wx.setStorageSync('show_log_share_btn', newVal)
    this.setData({ showLogShareBtn: newVal })
  },
  onLoginLogoInput: function(e) {
    this.setData({ 'siteConfig.loginLogoUrl': e.detail.value })
  },
  saveSiteConfig: function() {
    var self = this
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    db.collection('site_config').doc('login').get()
      .then(function() {
        return db.collection('site_config').doc('login').update({
          data: { loginLogoUrl: self.data.siteConfig.loginLogoUrl, updateTime: db.serverDate() }
        })
      })
      .catch(function() {
        return db.collection('site_config').add({
          data: { _id: 'login', loginLogoUrl: self.data.siteConfig.loginLogoUrl, updateTime: db.serverDate() }
        })
      })
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },

})

function autoTranslate(docId, title, content) {
  if (!wx.cloud) return
  wx.cloud.callFunction({
    name: 'translateText',
    data: { text: title, from: 'zh', targets: ['en', 'ja', 'ko'] }
  }).then(function(titleRes) {
    var data = buildTranslateFields(titleRes.result.translations, 'title')
    return wx.cloud.callFunction({
      name: 'translateText',
      data: { text: content.substring(0, 500), from: 'zh', targets: ['en', 'ja', 'ko'] }
    }).then(function(contentRes) {
      Object.assign(data, buildTranslateFields(contentRes.result.translations, 'content'))
      var _db = wx.cloud.database()
      _db.collection('announcements').doc(docId).update({ data: data }).catch(function() {})
    })
  }).catch(function() {})
}

function buildTranslateFields(translations, prefix) {
  var data = {}
  if (!translations) return data
  for (var lang in translations) {
    if (translations[lang]) data[prefix + '_' + lang] = translations[lang]
  }
  return data
}