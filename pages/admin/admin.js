var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')
var activitiesData = [
  { id: 1, title: '异色获取方法', type: '官方权威信息', status: '置顶', start: '', end: '', rewards: [], desc: '通过赛季奇遇、大世界遭遇、生蛋孵蛋、赛季商店兑换等方式获取异色精灵。' }
]

function parseMusicShare(text) {
  if (!text) return { url: null, name: null };
  var url = null;
  var srcRegex = /src\s*=\s*['"]([^'"]+)['"]/i;
  var srcMatch = text.match(srcRegex);
  if (srcMatch) {
    url = srcMatch[1];
    if (url.indexOf('//') === 0) url = 'https:' + url;
  } else {
    var urlRegex = /(https?:\/\/[^\s'"<>）)】\]》]+)/i;
    var urlMatch = text.match(urlRegex);
    url = urlMatch ? urlMatch[1] : null;
  }

  if (url) {
    url = convertMusicUrl(url);
  }

  var name = null;

  var dotSpaceDot = text.match(/^(.+?)[\s]*[·\-—][\s]*(.+?)[\s]*$/);
  if (!dotSpaceDot) {
    var patterns = [
      /《([^》]+)》\s*[-\-—·]\s*(.+)/,
      /([^-—·]+)[\s]*[·\-—][\s]*(.+)/
    ];
    for (var p = 0; p < patterns.length; p++) {
      var m = text.match(patterns[p]);
      if (m && m[1] && m[2]) {
        var left = m[1].replace(/https?:\/\/[^\s]+/g, '').trim();
        var right = m[2].replace(/https?:\/\/[^\s]+/g, '').trim();
        if (left && right && left.length < 30 && right.length < 30) {
          var isPlatform = /网易云|QQ音乐|酷狗|酷我|虾米|spotify|apple/i.test(left) || /网易云|QQ音乐|酷狗|酷我|虾米|spotify|apple/i.test(right);
          if (!isPlatform) {
            name = left + ' - ' + right;
            break;
          }
        }
      }
    }
  }

  if (!name) {
    var bracketPatterns = [
      /《([^》]+)》/,
      /【([^】]+)】/,
      /「([^」]+)」/,
      /\[([^\]]+)\]/
    ];
    for (var i = 0; i < bracketPatterns.length; i++) {
      var match = text.match(bracketPatterns[i]);
      if (match && match[1].trim() && match[1].trim().length < 40) {
        name = match[1].trim();
        break;
      }
    }
  }

  return { url: url, name: name };
}

function convertMusicUrl(url) {
  if (!url) return url;
  url = url.replace(/[,;!！。，；、]+$/, '');
  var neteaseId = url.match(/(?:music\.163\.com\/.*[?&]id=|music\.163\.com\/song\/(?:media\/outer\/)?(?:\?id=)?|163cn\.tv\/\w+\/?.*?song\/?.*?[?&]id=|song\?id=)(\d+)/i);
  if (neteaseId && neteaseId[1]) {
    return 'https://music.163.com/song/media/outer/url?id=' + neteaseId[1] + '.mp3';
  }
  if (url.indexOf('163cn.tv') > -1 || url.indexOf('m.163.com') > -1) {
    return url;
  }
  return url;
}

function parseGuessedName(text, url) {
  if (!text) return '';
  var cleanText = text;
  if (url) {
    cleanText = cleanText.replace(url, '');
    var shortUrl = url.replace(/^https?:/, '');
    cleanText = cleanText.replace(shortUrl, '');
  }
  cleanText = cleanText.replace(/<[^>]+>/g, '');

  var keywords = [
    /分享.*?的单曲/g,
    /分享单曲/g,
    /分享.*?的歌/g,
    /来自@网易云音乐/g,
    /来自@QQ音乐/g,
    /来自@酷狗音乐/g,
    /来自@酷我音乐/g,
    /来自@/g,
    /QQ音乐/g,
    /网易云音乐/g,
    /酷狗音乐/g,
    /酷我音乐/g,
    /抖音/g,
    /快手/g,
    /微博/g,
    /朋友圈/g,
    /\[.*?链接\]/g,
    /\(.*?链接\)/g,
    /\(.*?复制.*?\)/g,
    /复制此链接/g,
    /打开.*?直接播放/g,
    /点击.*?听歌/g,
    /http[^\s]+/g,
    /\s*[-–—·]\s*网易云音乐/g,
    /\s*[-–—·]\s*QQ音乐/g,
    /\s*[-–—·]\s*酷狗音乐/g,
    /\s*[-–—·]\s*酷我音乐/g,
    /\[/g, /\]/g,
    /【/g, /】/g,
    /「/g, /」/g,
    /《/g, /》/g,
    /\(/g, /\)/g,
    /（/g, /）/g,
    /🎧/g, /🎵/g, /🎶/g, /🎸/g, /🎤/g, /🎼/g
  ];
  keywords.forEach(function(kw) {
    cleanText = cleanText.replace(kw, '');
  });
  cleanText = cleanText.replace(/^[:：\s,，\-——+··]+/g, '');
  cleanText = cleanText.replace(/[:：\s,，\-——+··]+$/g, '');
  cleanText = cleanText.replace(/\s{2,}/g, ' ');
  cleanText = cleanText.trim();
  if (cleanText && cleanText.length > 0 && cleanText.length < 50) {
    return cleanText;
  }
  return '';
}

Page({
  data: {
    isAdmin: false,
    loading: true,
    activeTab: 'announce',
    announcements: [],
    users: [],
    stats: { totalUsers: 0 },
    showModal: false,
    showBannerModal: false,
    editingItem: null,
    formTitle: '',
    formContent: '',
    formType: 'notice',
    formPinned: false,
    formImage: '',
    formStartDate: '',
    formEndDate: '',
    formRichContent: [],
    formSource: '',
    submitting: false,
    bannerUrl: '',
    bannerLoading: false,
    pageConfigs: [],
    editorMode: 'simple',
    currentFontSize: 28,
    currentFontColor: '#ffffff',
    currentFontStyle: 'normal',
    currentFontWeight: 'normal',
    fontSizeOptions: [20, 24, 28, 32, 36, 40, 48],
    fontColorOptions: [
      { name: '白色', value: '#ffffff' },
      { name: '青色', value: '#00d4ff' },
      { name: '紫色', value: '#9945ff' },
      { name: '绿色', value: '#00e676' },
      { name: '橙色', value: '#ffab40' },
      { name: '红色', value: '#ff4757' },
      { name: '黄色', value: '#ffd700' },
      { name: '灰色', value: 'rgba(255,255,255,0.5)' }
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
    activityFormImage: '',
    activityFormSource: '',
    activitySubmitting: false,
    activityEditorMode: 'simple',
    activityFontWeight: 'normal',
    activityFontStyle: 'normal',
    activityFontSize: 28,
    activityFontColor: '#ffffff',
    activityRichContent: [],
    showActivitySizePicker: false,
    showActivityColorPicker: false,
    adminActivities: [],
    localActivities: [],
    deletedLocalIds: [],
    subscribers: [],
    subscribeConfig: { announcement: true, activity: true, merchant: true }
  },
  onLoad: function() {
    if (wx.cloud) db = wx.cloud.database()
    var deletedIds = wx.getStorageSync('deleted_local_activities') || []
    this.setData({ deletedLocalIds: deletedIds })
    this.checkAdmin()
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
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            if (userRes.data.length > 0) {
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
  },
  loadBanner: function() {
    var self = this
    if (!db) return
    db.collection('site_config').doc('banner').get()
      .then(function(res) {
        self.setData({ bannerUrl: res.data.url || '' })
      })
      .catch(function() {})
  },
  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
    if (tab === 'announce') this.loadAnnouncements()
    else if (tab === 'activity') this.loadAdminActivities()
    else if (tab === 'subscribe') this.loadSubscribers()
    else if (tab === 'users') this.loadUsers()
    else if (tab === 'stats') this.loadStats()
    else if (tab === 'pages') this.loadPageConfigs()
  },
  loadAnnouncements: function() {
    var self = this
    if (!db) return
    db.collection('announcements').orderBy('createTime', 'desc').limit(50).get()
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
  onBannerInput: function(e) { this.setData({ bannerUrl: e.detail.value }) },
  saveBanner: function() {
    var self = this
    if (self.data.bannerLoading) return
    var url = self.data.bannerUrl.trim()
    if (!url) { wx.showToast({ title: '请输入图片链接', icon: 'none' }); return }
    self.setData({ bannerLoading: true })
    db.collection('site_config').doc('banner').get()
      .then(function() {
        return db.collection('site_config').doc('banner').update({ data: { url: url, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('site_config').add({ data: { _id: 'banner', url: url, updateTime: db.serverDate() } })
      })
      .then(function() {
        self.setData({ bannerLoading: false, showBannerModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
      })
      .catch(function() {
        self.setData({ bannerLoading: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  loadPageConfigs: function() {
    var self = this
    if (!db) return
    var pageList = [
      { id: 'merchant', name: '远行商人', icon: '🛒', maintenance: false, useCustom: false },
      { id: 'egg', name: '孵蛋查询', icon: '🥚', maintenance: false, useCustom: false }
    ]
    var done = 0
    for (var i = 0; i < pageList.length; i++) {
      (function(idx) {
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
  togglePageMaintenance: function(e) {
    var self = this
    var id = e.currentTarget.dataset.id
    if (!db) return
    db.collection('page_config').doc(id).get()
      .then(function(res) {
        var newVal = !res.data.maintenance
        return db.collection('page_config').doc(id).update({ data: { maintenance: newVal, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('page_config').add({ data: { _id: id, maintenance: true, useCustom: false, updateTime: db.serverDate() } })
      })
      .then(function() {
        wx.showToast({ title: '操作成功', icon: 'success' })
        self.loadPageConfigs()
      })
      .catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
  },
  togglePageCustom: function(e) {
    var self = this
    var id = e.currentTarget.dataset.id
    if (!db) return
    db.collection('page_config').doc(id).get()
      .then(function(res) {
        var newVal = !res.data.useCustom
        return db.collection('page_config').doc(id).update({ data: { useCustom: newVal, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('page_config').add({ data: { _id: id, useCustom: true, maintenance: false, updateTime: db.serverDate() } })
      })
      .then(function() {
        wx.showToast({ title: '操作成功', icon: 'success' })
        self.loadPageConfigs()
      })
      .catch(function() { wx.showToast({ title: '操作失败', icon: 'none' }) })
  },
  openModal: function(e) {
    var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item || null : null
    var richContent = []
    var source = ''
    if (item && item.richContent) {
      richContent = item.richContent
    } else if (item && item.content) {
      richContent = [{ type: 'text', content: item.content, style: 'normal', weight: 'normal', size: 28, color: '#ffffff' }]
    }
    if (item && item.source) {
      source = item.source
    }
    this.setData({
      showModal: true,
      editingItem: item,
      formTitle: item ? item.title : '',
      formContent: item ? item.content : '',
      formType: item ? item.type : 'notice',
      formPinned: item ? item.pinned : false,
      formImage: item ? (item.image || '') : '',
      formRichContent: richContent,
      formSource: source,
      formStartDate: item ? (item.startDate || '') : '',
      formEndDate: item ? (item.endDate || '') : '',
      editorMode: 'simple'
    })
  },
  closeModal: function() {
    this.setData({ showModal: false })
  },
  preventClose: function() {},
  showMusicDialog: function() {
    var self = this
    wx.showModal({
      title: '添加音乐',
      content: '',
      placeholderText: '粘贴歌曲分享文本（支持网易云/QQ音乐等）',
      editable: true,
      success: function(resShare) {
        if (resShare.confirm && resShare.content && resShare.content.trim()) {
          var shareText = resShare.content.trim()
          var parsed = parseMusicShare(shareText)
          
          if (!parsed.url) {
            var isUrl = /https?:\/\//i.test(shareText);
            if (!isUrl && shareText.length < 50) {
              wx.showModal({
                title: '输入歌曲链接',
                content: '',
                placeholderText: '请粘贴音乐播放链接',
                editable: true,
                success: function(resUrl) {
                  if (resUrl.confirm && resUrl.content && resUrl.content.trim()) {
                    var url = convertMusicUrl(resUrl.content.trim())
                    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                      wx.showToast({ title: '链接需以 http 或 https 开头', icon: 'none' })
                      return
                    }
                    self._addMusicBlock(self, { type: 'music', name: shareText, url: url })
                  }
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
  _addMusicBlock: function(self, block) {
    var richContent = (self.data.formRichContent || []).concat([block])
    self.setData({ formRichContent: richContent })
    wx.showToast({ title: '已添加: ' + block.name, icon: 'success' })
  },
  onTitleInput: function(e) { this.setData({ formTitle: e.detail.value }) },
  onContentInput: function(e) { this.setData({ formContent: e.detail.value }) },
  onImageInput: function(e) { this.setData({ formImage: e.detail.value }) },
  onSourceInput: function(e) { this.setData({ formSource: e.detail.value }) },
  onStartDateChange: function(e) { this.setData({ formStartDate: e.detail.value }) },
  onEndDateChange: function(e) { this.setData({ formEndDate: e.detail.value }) },
  onTypeChange: function(e) { var types = ['notice', 'update', 'event', 'tip']; this.setData({ formType: types[e.detail.value] }) },
  togglePinned: function() { this.setData({ formPinned: !this.data.formPinned }) },
  switchEditorMode: function() {
    var newMode = this.data.editorMode === 'simple' ? 'rich' : 'simple'
    this.setData({ editorMode: newMode })
  },
  toggleBold: function() {
    var newWeight = this.data.currentFontWeight === 'normal' ? 'bold' : 'normal'
    this.setData({ currentFontWeight: newWeight })
  },
  toggleItalic: function() {
    var newStyle = this.data.currentFontStyle === 'normal' ? 'italic' : 'normal'
    this.setData({ currentFontStyle: newStyle })
  },
  showFontSizePicker: function() {
    this.setData({ showSizePicker: !this.data.showSizePicker, showColorPicker: false })
  },
  showFontColorPicker: function() {
    this.setData({ showColorPicker: !this.data.showColorPicker, showSizePicker: false })
  },
  setFontSize: function(e) {
    var size = e.currentTarget.dataset.size
    this.setData({ currentFontSize: size, showSizePicker: false })
  },
  setFontColor: function(e) {
    var color = e.currentTarget.dataset.color
    this.setData({ currentFontColor: color, showColorPicker: false })
  },
  addRichTextBlock: function() {
    var content = this.data.formContent.trim()
    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    var block = {
      type: 'text',
      content: content,
      style: this.data.currentFontStyle,
      weight: this.data.currentFontWeight,
      size: this.data.currentFontSize,
      color: this.data.currentFontColor
    }
    var richContent = this.data.formRichContent.concat([block])
    this.setData({
      formRichContent: richContent,
      formContent: '',
      currentFontStyle: 'normal',
      currentFontWeight: 'normal',
      currentFontSize: 28,
      currentFontColor: '#ffffff'
    })
  },
  addRichQuoteBlock: function() {
    var content = this.data.formContent.trim()
    if (!content) {
      wx.showToast({ title: '请输入引用内容', icon: 'none' })
      return
    }
    var block = {
      type: 'quote',
      content: content,
      style: 'normal',
      weight: 'normal',
      size: 26,
      color: 'rgba(255,255,255,0.7)'
    }
    var richContent = this.data.formRichContent.concat([block])
    this.setData({
      formRichContent: richContent,
      formContent: ''
    })
  },
  removeRichBlock: function(e) {
    var idx = e.currentTarget.dataset.idx
    var richContent = this.data.formRichContent
    richContent.splice(idx, 1)
    this.setData({ formRichContent: richContent })
  },
  editRichBlock: function(e) {
    var idx = e.currentTarget.dataset.idx
    var block = this.data.formRichContent[idx]
    var richContent = this.data.formRichContent
    richContent.splice(idx, 1)
    this.setData({
      formRichContent: richContent,
      formContent: block.content,
      currentFontStyle: block.style || 'normal',
      currentFontWeight: block.weight || 'normal',
      currentFontSize: block.size || 28,
      currentFontColor: block.color || '#ffffff'
    })
  },
  chooseFormImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        var ext = filePath.split('.').pop() || 'jpg'
        var cloudPath = 'announcements/' + Date.now() + '.' + ext
        wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
          .then(function(uploadRes) {
            wx.hideLoading()
            self.setData({ formImage: uploadRes.fileID })
          })
          .catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          })
      }
    })
  },
  inputImageUrl: function() {
    var self = this
    wx.showModal({
      title: '输入图片链接',
      content: '',
      editable: true,
      placeholderText: '粘贴图片URL地址',
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          self.setData({ formImage: res.content.trim() })
        }
      }
    })
  },
  removeFormImage: function() {
    this.setData({ formImage: '' })
  },
  previewFormImage: function() {
    if (this.data.formImage) {
      wx.previewImage({ urls: [this.data.formImage] })
    }
  },
  importFile: function() {
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
              self.setData({ formContent: (self.data.formContent ? self.data.formContent + '\n' : '') + text.trim() })
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
          }).then(function(parseRes) {
            wx.hideLoading()
            if (parseRes.result && parseRes.result.success) {
              self.setData({ formContent: (self.data.formContent ? self.data.formContent + '\n' : '') + parseRes.result.content })
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
  submitAnnouncement: function() {
    var self = this
    if (self.data.submitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    var title = self.data.formTitle.trim(), content = self.data.formContent.trim()
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return }
    if (self.data.editorMode === 'rich') {
      if (self.data.formRichContent.length === 0 && !content) {
        wx.showToast({ title: '请输入内容', icon: 'none' }); return
      }
    } else {
      if (!content) { wx.showToast({ title: '请输入内容', icon: 'none' }); return }
    }
    self.setData({ submitting: true })
    var finalContent = content
    var richContent = []
    if (self.data.editorMode === 'rich') {
      if (content) {
        richContent = self.data.formRichContent.concat([{
          type: 'text', content: content, style: self.data.currentFontStyle,
          weight: self.data.currentFontWeight, size: self.data.currentFontSize, color: self.data.currentFontColor
        }])
      } else {
        richContent = self.data.formRichContent
      }
      var htmlParts = []
      for (var i = 0; i < richContent.length; i++) {
        var block = richContent[i]
        if (block.type === 'quote') {
          htmlParts.push('<blockquote style="border-left:4rpx solid rgba(0,212,255,0.3);padding-left:12rpx;color:rgba(255,255,255,0.7);font-size:26rpx;margin:12rpx 0;">' + block.content + '</blockquote>')
        } else if (block.type === 'music') {
          htmlParts.push('<p style="color:#00d4ff;font-size:26rpx;margin:12rpx 0;text-decoration:underline;">🎵 推荐单曲: ' + block.name + ' (' + block.url + ')</p>')
        } else {
          var style = 'font-size:' + block.size + 'rpx;color:' + block.color + ';'
          if (block.weight === 'bold') style += 'font-weight:bold;'
          if (block.style === 'italic') style += 'font-style:italic;'
          htmlParts.push('<p style="' + style + '">' + block.content + '</p>')
        }
      }
      finalContent = htmlParts.join('')
    }
    var data = {
      title: title,
      content: finalContent,
      richContent: self.data.editorMode === 'rich' ? richContent : [],
      source: self.data.formSource.trim(),
      type: self.data.formType,
      pinned: self.data.formPinned,
      image: self.data.formImage.trim(),
      startDate: self.data.formStartDate,
      endDate: self.data.formEndDate,
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
    promise.then(function() {
      self.setData({ submitting: false, showModal: false, editingItem: null })
      wx.showToast({ title: '操作成功', icon: 'success' })
      self.loadAnnouncements()
      self.pushSubscribe('announcement', title, (content || title).substring(0, 20))
    }).catch(function(err) {
      console.error('发布公告失败:', err)
      self.setData({ submitting: false })
      wx.showToast({ title: '操作失败: ' + (err.errMsg || '未知错误'), icon: 'none' })
    })
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
  refreshData: function() {
    this.setData({ loading: true })
    var tab = this.data.activeTab
    if (tab === 'announce') this.loadAnnouncements()
    else if (tab === 'activity') this.loadAdminActivities()
    else if (tab === 'subscribe') this.loadSubscribers()
    else if (tab === 'users') this.loadUsers()
    else if (tab === 'stats') this.loadStats()
  },
  pushSubscribe: function(type, title, content) {
    var pages = {
      announcement: '/pages/index/index',
      activity: '/pages/activity/activity',
      merchant: '/pages/merchant/merchant'
    }
    notify.pushToSubscribers(type, title, content, pages[type] || '/pages/index/index')
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date), now = new Date(), diff = now - d
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
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
          return { _id: item._id, title: item.title, content: item.content, type: item.type || '活动', pinned: item.pinned, start: item.start || '', end: item.end || '', image: item.image || '', timeStr: self.formatTime(item.createTime), isCloud: true }
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
    db.collection('subscribers').orderBy('createTime', 'desc').limit(100).get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) list[i].timeStr = self.formatTime(list[i].createTime)
        self.setData({ subscribers: list, loading: false })
      })
      .catch(function() { self.setData({ loading: false }) })
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
    if (item && item.richContent) {
      richContent = item.richContent
    } else if (item && item.content) {
      richContent = [{ type: 'text', content: item.content, style: 'normal', weight: 'normal', size: 28, color: '#ffffff' }]
    }
    if (item && item.source) {
      source = item.source
    }
    this.setData({
      showActivityModal: true,
      activityEditingItem: item,
      activityFormTitle: item ? item.title : '',
      activityFormContent: item ? item.content : '',
      activityFormType: item ? (item.type || '活动') : '活动',
      activityFormStatus: item ? (item.pinned ? '置顶' : '进行中') : '进行中',
      activityFormStart: item ? (item.start || '') : '',
      activityFormEnd: item ? (item.end || '') : '',
      activityFormImage: item ? (item.image || '') : '',
      activityFormSource: source,
      activityRichContent: richContent,
      activityEditorMode: 'simple'
    })
  },
  closeActivityModal: function() { this.setData({ showActivityModal: false }) },
  showActivityMusicDialog: function() {
    var self = this
    wx.showModal({
      title: '添加音乐',
      content: '',
      placeholderText: '粘贴歌曲分享文本（支持网易云/QQ音乐等）',
      editable: true,
      success: function(resShare) {
        if (resShare.confirm && resShare.content && resShare.content.trim()) {
          var shareText = resShare.content.trim()
          var parsed = parseMusicShare(shareText)
          
          if (!parsed.url) {
            var isUrl = /https?:\/\//i.test(shareText);
            if (!isUrl && shareText.length < 50) {
              wx.showModal({
                title: '输入歌曲链接',
                content: '',
                placeholderText: '请粘贴音乐播放链接',
                editable: true,
                success: function(resUrl) {
                  if (resUrl.confirm && resUrl.content && resUrl.content.trim()) {
                    var url = convertMusicUrl(resUrl.content.trim())
                    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                      wx.showToast({ title: '链接需以 http 或 https 开头', icon: 'none' })
                      return
                    }
                    self._addActivityMusicBlock(self, { type: 'music', name: shareText, url: url })
                  }
                }
              })
            } else {
              wx.showToast({ title: '未找到有效的音乐链接', icon: 'none' })
            }
            return
          }
          
          if (parsed.name) {
            self._addActivityMusicBlock(self, { type: 'music', name: parsed.name, url: parsed.url })
          } else {
            var guessedName = parseGuessedName(shareText, parsed.url)
            wx.showModal({
              title: '输入歌曲名称',
              content: guessedName || '',
              placeholderText: '歌名 - 歌手',
              editable: true,
              success: function(resName) {
                if (resName.confirm && resName.content && resName.content.trim()) {
                  self._addActivityMusicBlock(self, { type: 'music', name: resName.content.trim(), url: parsed.url })
                }
              }
            })
          }
        }
      }
    })
  },
  _addActivityMusicBlock: function(self, block) {
    var richContent = (self.data.activityRichContent || []).concat([block])
    self.setData({ activityRichContent: richContent })
    wx.showToast({ title: '已添加: ' + block.name, icon: 'success' })
  },
  onActivityTitleInput: function(e) { this.setData({ activityFormTitle: e.detail.value }) },
  onActivityContentInput: function(e) { this.setData({ activityFormContent: e.detail.value }) },
  onActivityTypeInput: function(e) { this.setData({ activityFormType: e.detail.value }) },
  onActivityStartInput: function(e) { this.setData({ activityFormStart: e.detail.value }) },
  onActivityEndInput: function(e) { this.setData({ activityFormEnd: e.detail.value }) },
  onActivityStartChange: function(e) { this.setData({ activityFormStart: e.detail.value }) },
  onActivityEndChange: function(e) { this.setData({ activityFormEnd: e.detail.value }) },
  onActivitySourceInput: function(e) { this.setData({ activityFormSource: e.detail.value }) },
  onActivityStatusChange: function(e) { var statuses = ['进行中','即将开始','置顶']; this.setData({ activityFormStatus: statuses[e.detail.value] }) },
  switchActivityEditorMode: function() {
    var newMode = this.data.activityEditorMode === 'simple' ? 'rich' : 'simple'
    this.setData({ activityEditorMode: newMode })
  },
  toggleActivityBold: function() {
    var newWeight = this.data.activityFontWeight === 'normal' ? 'bold' : 'normal'
    this.setData({ activityFontWeight: newWeight })
  },
  toggleActivityItalic: function() {
    var newStyle = this.data.activityFontStyle === 'normal' ? 'italic' : 'normal'
    this.setData({ activityFontStyle: newStyle })
  },
  showActivityFontSizePicker: function() {
    this.setData({ showActivitySizePicker: !this.data.showActivitySizePicker, showActivityColorPicker: false })
  },
  showActivityFontColorPicker: function() {
    this.setData({ showActivityColorPicker: !this.data.showActivityColorPicker, showActivitySizePicker: false })
  },
  setActivityFontSize: function(e) {
    var size = e.currentTarget.dataset.size
    this.setData({ activityFontSize: size, showActivitySizePicker: false })
  },
  setActivityFontColor: function(e) {
    var color = e.currentTarget.dataset.color
    this.setData({ activityFontColor: color, showActivityColorPicker: false })
  },
  addActivityRichTextBlock: function() {
    var content = this.data.activityFormContent.trim()
    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    var block = {
      type: 'text',
      content: content,
      style: this.data.activityFontStyle,
      weight: this.data.activityFontWeight,
      size: this.data.activityFontSize,
      color: this.data.activityFontColor
    }
    var richContent = this.data.activityRichContent.concat([block])
    this.setData({
      activityRichContent: richContent,
      activityFormContent: '',
      activityFontStyle: 'normal',
      activityFontWeight: 'normal',
      activityFontSize: 28,
      activityFontColor: '#ffffff'
    })
  },
  addActivityRichQuoteBlock: function() {
    var content = this.data.activityFormContent.trim()
    if (!content) {
      wx.showToast({ title: '请输入引用内容', icon: 'none' })
      return
    }
    var block = {
      type: 'quote',
      content: content,
      style: 'normal',
      weight: 'normal',
      size: 26,
      color: 'rgba(255,255,255,0.7)'
    }
    var richContent = this.data.activityRichContent.concat([block])
    this.setData({
      activityRichContent: richContent,
      activityFormContent: ''
    })
  },
  removeActivityRichBlock: function(e) {
    var idx = e.currentTarget.dataset.idx
    var richContent = this.data.activityRichContent
    richContent.splice(idx, 1)
    this.setData({ activityRichContent: richContent })
  },
  editActivityRichBlock: function(e) {
    var idx = e.currentTarget.dataset.idx
    var block = this.data.activityRichContent[idx]
    var richContent = this.data.activityRichContent
    richContent.splice(idx, 1)
    this.setData({
      activityRichContent: richContent,
      activityFormContent: block.content,
      activityFontStyle: block.style || 'normal',
      activityFontWeight: block.weight || 'normal',
      activityFontSize: block.size || 28,
      activityFontColor: block.color || '#ffffff'
    })
  },
  chooseActivityImage: function() {
    var self = this
    wx.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        var ext = filePath.split('.').pop() || 'jpg'
        wx.cloud.uploadFile({ cloudPath: 'activities/' + Date.now() + '.' + ext, filePath: filePath })
          .then(function(r) { wx.hideLoading(); self.setData({ activityFormImage: r.fileID }) })
          .catch(function() { wx.hideLoading(); wx.showToast({ title: '上传失败', icon: 'none' }) })
      }
    })
  },
  inputActivityImageUrl: function() {
    var self = this
    wx.showModal({ title: '输入图片链接', content: '', editable: true, placeholderText: '粘贴图片URL地址',
      success: function(res) { if (res.confirm && res.content && res.content.trim()) self.setData({ activityFormImage: res.content.trim() }) }
    })
  },
  removeActivityImage: function() { this.setData({ activityFormImage: '' }) },
  previewActivityImage: function() { if (this.data.activityFormImage) wx.previewImage({ urls: [this.data.activityFormImage] }) },
  submitActivity: function() {
    var self = this
    if (self.data.activitySubmitting) return
    var title = self.data.activityFormTitle.trim()
    var content = self.data.activityFormContent.trim()
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return }
    self.setData({ activitySubmitting: true })
    var finalContent = content
    var richContent = []
    if (self.data.activityEditorMode === 'rich') {
      if (content) {
        richContent = self.data.activityRichContent.concat([{
          type: 'text', content: content, style: self.data.activityFontStyle,
          weight: self.data.activityFontWeight, size: self.data.activityFontSize, color: self.data.activityFontColor
        }])
      } else {
        richContent = self.data.activityRichContent
      }
      var htmlParts = []
      for (var i = 0; i < richContent.length; i++) {
        var block = richContent[i]
        if (block.type === 'quote') {
          htmlParts.push('<blockquote style="border-left:4rpx solid rgba(0,212,255,0.3);padding-left:12rpx;color:rgba(255,255,255,0.7);font-size:26rpx;margin:12rpx 0;">' + block.content + '</blockquote>')
        } else if (block.type === 'music') {
          htmlParts.push('<p style="color:#00d4ff;font-size:26rpx;margin:12rpx 0;text-decoration:underline;">🎵 推荐单曲: ' + block.name + ' (' + block.url + ')</p>')
        } else {
          var style = 'font-size:' + block.size + 'rpx;color:' + block.color + ';'
          if (block.weight === 'bold') style += 'font-weight:bold;'
          if (block.style === 'italic') style += 'font-style:italic;'
          htmlParts.push('<p style="' + style + '">' + block.content + '</p>')
        }
      }
      finalContent = htmlParts.join('')
    }
    var data = {
      title: title, content: finalContent, type: 'event',
      pinned: self.data.activityFormStatus === '置顶',
      start: self.data.activityFormStart, end: self.data.activityFormEnd,
      image: self.data.activityFormImage, source: self.data.activityFormSource,
      richContent: self.data.activityEditorMode === 'rich' ? richContent : [],
      updateTime: db.serverDate()
    }
    var promise = self.data.activityEditingItem
      ? db.collection('announcements').doc(self.data.activityEditingItem._id).update({ data: data })
      : (data.createTime = db.serverDate(), data.author = app.globalData.userInfo ? app.globalData.userInfo.nickName : 'Admin', db.collection('announcements').add({ data: data }))
    promise.then(function() {
      self.setData({ activitySubmitting: false, showActivityModal: false, activityEditingItem: null })
      wx.showToast({ title: '操作成功', icon: 'success' })
      self.loadAdminActivities()
      self.pushSubscribe('activity', title, content.substring(0, 20))
    }).catch(function() { self.setData({ activitySubmitting: false }); wx.showToast({ title: '操作失败', icon: 'none' }) })
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
    var names = { announcement: '公告', activity: '活动', merchant: '商人' }
    var self = this
    wx.showModal({ title: '测试推送', content: '发送一条测试' + names[type] + '推送？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '发送中...' })
          wx.cloud.callFunction({
            name: 'sendSubscribe',
            data: {
              type: type,
              title: '测试推送',
              content: '这是一条测试推送消息'
            }
          }).then(function(httpRes) {
            wx.hideLoading()
            var result = httpRes.result
            var msg = result && result.sent > 0 ? '发送成功(' + result.sent + '条)' : (result && result.total === 0 ? '该类型无订阅者' : '发送失败')
            wx.showToast({ title: msg, icon: 'none' })
          }).catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '发送失败', icon: 'none' })
          })
        }
      }
    })
  }
})