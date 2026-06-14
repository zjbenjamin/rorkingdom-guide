var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')

Page({
  data: {
    isAdmin: false,
    loading: true,
    activeTab: 'announce',
    announcements: [],
    systemUpdates: [],
    posts: [],
    users: [],
    stats: { totalUsers: 0, totalPosts: 0, todayPosts: 0 },
    showModal: false,
    showBannerModal: false,
    editingItem: null,
    formTitle: '',
    formContent: '',
    formType: 'notice',
    formPinned: false,
    formImage: '',
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
    showSystemModal: false,
    systemEditingItem: null,
    systemFormTitle: '',
    systemFormContent: '',
    systemFormVersion: '',
    systemFormType: 'feature',
    systemSubmitting: false
  },
  onLoad: function() {
    if (wx.cloud) db = wx.cloud.database()
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
        db.collection('users').get()
          .then(function(userRes) {
            for (var i = 0; i < userRes.data.length; i++) {
              if (userRes.data[i]._openid === adminOpenid) {
                self.setData({ isAdmin: true })
                self.loadData()
                return
              }
            }
            self.setData({ isAdmin: false, loading: false })
          })
      })
      .catch(function() { self.setData({ isAdmin: false, loading: false }) })
  },
  loadData: function() {
    this.loadAnnouncements()
    this.loadSystemUpdates()
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
    else if (tab === 'system') this.loadSystemUpdates()
    else if (tab === 'posts') this.loadPosts()
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
  loadSystemUpdates: function() {
    var self = this
    if (!db) return
    db.collection('announcements').where({ type: 'system' }).orderBy('createTime', 'desc').limit(50).get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) list[i].timeStr = self.formatTime(list[i].createTime)
        self.setData({ systemUpdates: list })
      })
      .catch(function() {})
  },
  openSystemModal: function(e) {
    var item = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.item || null : null
    this.setData({
      showSystemModal: true,
      systemEditingItem: item,
      systemFormTitle: item ? item.title : '',
      systemFormContent: item ? item.content : '',
      systemFormVersion: item ? (item.version || '') : '',
      systemFormType: item ? (item.updateType || 'feature') : 'feature'
    })
  },
  closeSystemModal: function() {
    this.setData({ showSystemModal: false })
  },
  onSystemTitleInput: function(e) { this.setData({ systemFormTitle: e.detail.value }) },
  onSystemContentInput: function(e) { this.setData({ systemFormContent: e.detail.value }) },
  onSystemVersionInput: function(e) { this.setData({ systemFormVersion: e.detail.value }) },
  onSystemTypeChange: function(e) {
    var types = ['feature', 'fix', 'improve', 'notice']
    this.setData({ systemFormType: types[e.detail.value] })
  },
  submitSystemUpdate: function() {
    var self = this
    if (self.data.systemSubmitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    var title = self.data.systemFormTitle.trim()
    var content = self.data.systemFormContent.trim()
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return }
    if (!content) { wx.showToast({ title: '请输入内容', icon: 'none' }); return }
    self.setData({ systemSubmitting: true })
    var data = {
      title: title,
      content: content,
      version: self.data.systemFormVersion.trim(),
      updateType: self.data.systemFormType,
      type: 'system',
      updateTime: db.serverDate()
    }
    var promise
    if (self.data.systemEditingItem) {
      promise = db.collection('announcements').doc(self.data.systemEditingItem._id).update({ data: data })
    } else {
      data.createTime = db.serverDate()
      data.author = app.globalData.userInfo ? app.globalData.userInfo.nickName : 'Admin'
      promise = db.collection('announcements').add({ data: data })
    }
    promise.then(function() {
      self.setData({ systemSubmitting: false, showSystemModal: false, systemEditingItem: null })
      wx.showToast({ title: '操作成功', icon: 'success' })
      self.loadSystemUpdates()
      wx.cloud.callFunction({
        name: 'sendSubscribe',
        data: {
          type: 'system',
          title: title,
          content: content.substring(0, 20),
          page: '/pages/index/index'
        }
      }).catch(function() {})
    }).catch(function(err) {
      console.error('发布系统更新失败:', err)
      self.setData({ systemSubmitting: false })
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },
  deleteSystemUpdate: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '删除系统更新',
      content: '确定删除该条系统更新？',
      success: function(res) {
        if (res.confirm) {
          db.collection('announcements').doc(item._id).remove()
            .then(function() {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadSystemUpdates()
            })
        }
      }
    })
  },
  loadPosts: function() {
    var self = this
    if (!db) return
    db.collection('comments').orderBy('createTime', 'desc').limit(50).get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) {
          list[i].timeStr = self.formatTime(list[i].createTime)
          list[i].liked = false
          if (list[i].likes && app.globalData.userInfo) {
            for (var j = 0; j < list[i].likes.length; j++) {
              if (list[i].likes[j] === app.globalData.userInfo.nickName) { list[i].liked = true; break }
            }
          }
        }
        self.setData({ posts: list, loading: false })
        var allIDs = []
        for (var p = 0; p < list.length; p++) {
          if (cloudUrl.isCloudUrl(list[p].userAvatar)) allIDs.push(list[p].userAvatar)
          if (list[p].images) {
            for (var q = 0; q < list[p].images.length; q++) {
              if (cloudUrl.isCloudUrl(list[p].images[q])) allIDs.push(list[p].images[q])
            }
          }
        }
        if (allIDs.length > 0) {
          var uniqueIDs = []
          var seen = {}
          for (var r = 0; r < allIDs.length; r++) { if (!seen[allIDs[r]]) { seen[allIDs[r]] = true; uniqueIDs.push(allIDs[r]) } }
          wx.cloud.getTempFileURL({ fileList: uniqueIDs }).then(function(urlRes) {
            var urlMap = {}
            if (urlRes.fileList) { for (var s = 0; s < urlRes.fileList.length; s++) { if (urlRes.fileList[s].tempFileURL) urlMap[urlRes.fileList[s].fileID] = urlRes.fileList[s].tempFileURL } }
            var updated = self.data.posts
            for (var t = 0; t < updated.length; t++) {
              if (urlMap[updated[t].userAvatar]) updated[t].userAvatar = urlMap[updated[t].userAvatar]
              if (updated[t].images) { for (var u = 0; u < updated[t].images.length; u++) { if (urlMap[updated[t].images[u]]) updated[t].images[u] = urlMap[updated[t].images[u]] } }
            }
            self.setData({ posts: updated })
          })
        }
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
    var stats = { totalUsers: 0, totalPosts: 0, todayPosts: 0 }
    var done = 0
    db.collection('users').count().then(function(r) { stats.totalUsers = r.total; done++; if (done >= 3) self.setData({ stats: stats, loading: false }) })
    db.collection('comments').count().then(function(r) { stats.totalPosts = r.total; done++; if (done >= 3) self.setData({ stats: stats, loading: false }) })
    var today = new Date(); today.setHours(0,0,0,0)
    db.collection('comments').where({ createTime: db.command.gte(today) }).count()
      .then(function(r) { stats.todayPosts = r.total; done++; if (done >= 3) self.setData({ stats: stats, loading: false }) })
      .catch(function() { done++; if (done >= 3) self.setData({ stats: stats, loading: false }) })
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
      editorMode: 'simple'
    })
  },
  closeModal: function() {
    this.setData({ showModal: false })
  },
  preventClose: function() {},
  onTitleInput: function(e) { this.setData({ formTitle: e.detail.value }) },
  onContentInput: function(e) { this.setData({ formContent: e.detail.value }) },
  onImageInput: function(e) { this.setData({ formImage: e.detail.value }) },
  onSourceInput: function(e) { this.setData({ formSource: e.detail.value }) },
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
      wx.cloud.callFunction({
        name: 'sendSubscribe',
        data: {
          type: 'announcement',
          title: title,
          content: (content || title).substring(0, 20),
          page: '/pages/index/index'
        }
      }).catch(function() {})
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
          db.collection('announcements').doc(item._id).remove()
            .then(function() {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadAnnouncements()
            })
        }
      }
    })
  },
  togglePinnedStatus: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    db.collection('announcements').doc(item._id).update({ data: { pinned: !item.pinned } }).then(function() { self.loadAnnouncements() })
  },
  deletePost: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '删除帖子',
      content: '确定删除该帖子？',
      success: function(res) {
        if (res.confirm) {
          db.collection('comments').doc(item._id).remove()
            .then(function() {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadPosts()
            })
        }
      }
    })
  },
  togglePostPinned: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    db.collection('comments').doc(item._id).update({ data: { pinned: !item.pinned } }).then(function() { self.loadPosts() })
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
        }
      }
    })
  },
  unbanUser: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    db.collection('users').doc(item._id).update({ data: { banned: false } }).then(function() { wx.showToast({ title: '已解封', icon: 'success' }); self.loadUsers() })
  },
  deleteUser: function(e) {
    var self = this, item = e.currentTarget.dataset.item
    wx.showModal({
      title: '删除用户',
      content: '确定删除该用户数据？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').doc(item._id).remove()
            .then(function() {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadUsers()
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
          db.collection('users').doc(item._id).update({ data: { role: 'editor' } })
            .then(function() {
              wx.showToast({ title: '已设为小编', icon: 'success' })
              self.loadUsers()
            })
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
          db.collection('users').doc(item._id).update({ data: { role: '' } })
            .then(function() {
              wx.showToast({ title: '已取消', icon: 'success' })
              self.loadUsers()
            })
        }
      }
    })
  },
  refreshData: function() {
    this.setData({ loading: true })
    var tab = this.data.activeTab
    if (tab === 'announce') this.loadAnnouncements()
    else if (tab === 'system') this.loadSystemUpdates()
    else if (tab === 'posts') this.loadPosts()
    else if (tab === 'users') this.loadUsers()
    else if (tab === 'stats') this.loadStats()
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date), now = new Date(), diff = now - d
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  }
})