var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')

function getDeviceModel() {
  try {
    var info = wx.getSystemInfoSync()
    var model = info.model || ''
    if (model.indexOf('iPhone') >= 0) return 'iPhone'
    if (model.indexOf('HUAWEI') >= 0 || model.indexOf('Huawei') >= 0) return '华为'
    if (model.indexOf('Xiaomi') >= 0 || model.indexOf('Redmi') >= 0) return '小米'
    if (model.indexOf('OPPO') >= 0) return 'OPPO'
    if (model.indexOf('vivo') >= 0) return 'vivo'
    if (model.indexOf('Samsung') >= 0) return '三星'
    if (model.indexOf('Meizu') >= 0) return '魅族'
    if (model.indexOf('OnePlus') >= 0) return '一加'
    if (model.indexOf('Realme') >= 0) return 'realme'
    if (model.indexOf(' Honor') >= 0 || model.indexOf('Honor') >= 0) return '荣耀'
    if (model.indexOf('Mac') >= 0) return 'Mac'
    if (model.indexOf('Windows') >= 0) return 'Windows'
    if (model.indexOf('Linux') >= 0) return 'Linux'
    return ''
  } catch (e) {
    return ''
  }
}

Page({
  data: {
    comments: [],
    loading: false,
    hasMore: true,
    currentPage: 0,
    pageSize: 20,
    activeTab: 'all',
    showPostModal: false,
    postContent: '',
    imageUrlInput: '',
    posting: false,
    activeReplyPostId: '',
    replyContent: '',
    replying: false,
    replyTarget: null,
    userInfo: null,
    postImages: [],
    adminOpenid: '',
    userRoles: {},
    userTitles: {},
    titleColors: {},
    userUids: {},
    userBanned: {},
    isManager: false,
    showTitlePicker: false,
    selectedTitle: '',
    titleOptions: [
      { name: '👑 超级欧皇', color: '#ffab40' },
      { name: '✨ 欧皇', color: '#9945ff' },
      { name: '🍀 小欧皇', color: '#34c759' },
      { name: '😐 平民', color: 'rgba(255,255,255,0.5)' },
      { name: '😬 小非酋', color: '#ff9800' },
      { name: '💀 非酋', color: '#ff4757' },
      { name: '🎯 捕捉大师', color: '#00d4ff' },
      { name: '🌟 异色猎人', color: '#e040fb' },
      { name: '不显示头衔', color: 'transparent' }
    ],
    dataReady: false,
    deviceModel: '',
    province: '',
    showLocationTip: false,
    showCommunityNotice: true
  },
  onLoad: function() {
    var noticeClosed = wx.getStorageSync('community_notice_closed')
    if (noticeClosed) {
      this.setData({ showCommunityNotice: false })
    }
  },
  onShow: function() {
    var self = this
    self.setData({ userInfo: app.globalData.userInfo })
    if (wx.cloud) db = wx.cloud.database()
    if (!self.data.deviceModel) {
      self.setData({ deviceModel: getDeviceModel() })
    }
    self.refreshUserAvatar()
    if (!self.data.dataReady) {
      self.loadAdminConfig()
    } else {
      self.loadComments(true)
    }
    var locationAuth = wx.getStorageSync('location_auth')
    if (locationAuth === 'granted') {
      self.fetchProvince()
    } else if (locationAuth !== 'denied') {
      self.setData({ showLocationTip: true })
    }
  },
  onLocationAllow: function() {
    var self = this
    wx.setStorageSync('location_auth', 'granted')
    self.setData({ showLocationTip: false })
    self.fetchProvince()
  },
  onLocationDeny: function() {
    wx.setStorageSync('location_auth', 'denied')
    this.setData({ showLocationTip: false })
  },
  closeCommunityNotice: function() {
    wx.setStorageSync('community_notice_closed', true)
    this.setData({ showCommunityNotice: false })
  },
  toggleLocationSetting: function() {
    var self = this
    var locationAuth = wx.getStorageSync('location_auth')
    if (locationAuth === 'granted') {
      wx.showActionSheet({
        itemList: ['关闭归属地显示'],
        success: function(res) {
          if (res.tapIndex === 0) {
            wx.setStorageSync('location_auth', 'denied')
            self.setData({ province: '' })
          }
        }
      })
    } else {
      wx.showActionSheet({
        itemList: ['开启归属地显示'],
        success: function(res) {
          if (res.tapIndex === 0) {
            wx.setStorageSync('location_auth', 'granted')
            self.fetchProvince()
          }
        }
      })
    }
  },
  refreshUserAvatar: function() {
    var self = this
    if (!app.globalData.userInfo || !app.globalData.userInfo.nickName) return
    if (!db) return
    db.collection('users').where({ nickName: app.globalData.userInfo.nickName }).get()
      .then(function(res) {
        if (res.data.length > 0 && res.data[0].avatarUrl) {
          var cloudAvatar = res.data[0].avatarUrl
          var userInfo = app.globalData.userInfo
          if (cloudAvatar.indexOf('cloud://') === 0) {
            userInfo._cloudAvatar = cloudAvatar
            wx.cloud.getTempFileURL({ fileList: [cloudAvatar] })
              .then(function(urlRes) {
                if (urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL) {
                  var tempUrl = urlRes.fileList[0].tempFileURL
                  userInfo.avatarUrl = tempUrl
                  app.globalData.userInfo = userInfo
                  wx.setStorageSync('user_info', userInfo)
                  self.setData({ userInfo: userInfo })
                }
              })
          } else {
            userInfo.avatarUrl = cloudAvatar
            userInfo._cloudAvatar = cloudAvatar
            app.globalData.userInfo = userInfo
            wx.setStorageSync('user_info', userInfo)
            self.setData({ userInfo: userInfo })
          }
        }
      })
      .catch(function() {})
  },
  loadAdminConfig: function() {
    var self = this
    if (!db) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        self.setData({ adminOpenid: res.data.openid || '', dataReady: true })
        self.loadUserRoles()
      })
      .catch(function() {
        self.setData({ dataReady: true })
        self.loadComments(true)
      })
  },
  fetchProvince: function() {
    var self = this
    if (!wx.cloud || self.data.province) return
    
    wx.getLocation({
      type: 'gcj02',
      success: function(locRes) {
        console.log('获取到坐标:', locRes.latitude, locRes.longitude)
        wx.cloud.callFunction({
          name: 'getIpInfo',
          data: {
            latitude: locRes.latitude,
            longitude: locRes.longitude
          },
          timeout: 10000,
          success: function(res) {
            console.log('云函数返回:', JSON.stringify(res))
            if (res.result && res.result.province) {
              self.setData({ province: res.result.province })
              console.log('归属地:', res.result.province)
            } else {
              console.log('未获取到归属地')
            }
          },
          fail: function(err) {
            console.error('云函数调用失败:', err)
          }
        })
      },
      fail: function(err) {
        console.log('获取位置失败:', err)
        wx.setStorageSync('location_auth', 'denied')
      }
    })
  },
  loadUserRoles: function() {
    var self = this
    if (!db) return
    db.collection('users').get()
      .then(function(res) {
        var roles = {}
        var titles = {}
        var titleColors = {}
        var uids = {}
        var banned = {}
        var list = res.data || []
        for (var i = 0; i < list.length; i++) {
          var user = list[i]
          if (user._openid === self.data.adminOpenid) {
            roles[user.nickName] = 'developer'
          } else if (user.role === 'editor') {
            roles[user.nickName] = 'editor'
          }
          if (user.title) {
            titles[user.nickName] = user.title
            titleColors[user.nickName] = user.titleColor || ''
          }
          if (user.gameUid) {
            uids[user.nickName] = user.gameUid
          }
          if (user.banned) {
            banned[user.nickName] = true
          }
        }
        self.setData({ userRoles: roles, userTitles: titles, titleColors: titleColors, userUids: uids, userBanned: banned })
        self.checkManager()
        self.loadComments(true)
      })
      .catch(function() {
        self.loadComments(true)
      })
  },
  loadComments: function(refresh) {
    var self = this
    if (self.data.loading || !db) return
    var page = refresh ? 0 : self.data.currentPage
    self.setData({ loading: true })
    var query = db.collection('comments')
    if (self.data.activeTab === 'hot') {
      query = query.where({ replyTo: null }).orderBy('pinned', 'desc').orderBy('featured', 'desc').orderBy('likes', 'desc')
    } else if (self.data.activeTab === 'mine') {
      if (!app.globalData.userInfo) {
        self.setData({ loading: false, comments: [] })
        return
      }
      query = query.where({ replyTo: null, userName: app.globalData.userInfo.nickName })
      query = query.orderBy('createTime', 'desc')
    } else {
      query = query.where({ replyTo: null }).orderBy('createTime', 'desc')
    }
    query.skip(page * self.data.pageSize)
      .limit(self.data.pageSize)
      .get()
      .then(function(res) {
        var list = res.data || []
        var roles = self.data.userRoles
        var titles = self.data.userTitles
        var titleColors = self.data.titleColors || {}
        var uids = self.data.userUids
        var banned = self.data.userBanned || {}
        var daySet = {}
        for (var i = 0; i < list.length; i++) {
          list[i].timeStr = self.formatTime(list[i].createTime)
          list[i].liked = false
          list[i].replyCount = list[i].replyCount || 0
          list[i].inlineReplies = list[i].inlineReplies || []
          list[i].userRole = roles[list[i].userName] || ''
          list[i].userTitle = titles[list[i].userName] || ''
          list[i].titleColor = titleColors[list[i].userName] || ''
          list[i].gameUid = uids[list[i].userName] || ''
          list[i].userBanned = !!banned[list[i].userName]
          if (list[i].likes && app.globalData.userInfo) {
            for (var j = 0; j < list[i].likes.length; j++) {
              if (list[i].likes[j] === app.globalData.userInfo.nickName) {
                list[i].liked = true
                break
              }
            }
          }
          var d = new Date(list[i].createTime)
          var dayKey = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          if (!daySet[dayKey]) {
            list[i].isFirstToday = true
            daySet[dayKey] = true
          }
        }
        var comments = refresh ? list : self.data.comments.concat(list)
        self.setData({
          comments: comments,
          loading: false,
          currentPage: page + 1,
          hasMore: list.length >= self.data.pageSize
        })
        self.loadInlineReplies()
        var allFileIDs = []
        var imageRefs = []
        for (var p = 0; p < comments.length; p++) {
          if (cloudUrl.isCloudUrl(comments[p].userAvatar)) allFileIDs.push(comments[p].userAvatar)
          if (comments[p].images) {
            for (var q = 0; q < comments[p].images.length; q++) {
              if (cloudUrl.isCloudUrl(comments[p].images[q])) {
                allFileIDs.push(comments[p].images[q])
                imageRefs.push({ ci: p, ii: q, fid: comments[p].images[q] })
              }
            }
          }
        }
        if (allFileIDs.length > 0) {
          var uniqueIDs = []
          var seen = {}
          for (var r = 0; r < allFileIDs.length; r++) { if (!seen[allFileIDs[r]]) { seen[allFileIDs[r]] = true; uniqueIDs.push(allFileIDs[r]) } }
          wx.cloud.getTempFileURL({ fileList: uniqueIDs }).then(function(urlRes) {
            var urlMap = {}
            if (urlRes.fileList) { for (var s = 0; s < urlRes.fileList.length; s++) { if (urlRes.fileList[s].tempFileURL) urlMap[urlRes.fileList[s].fileID] = urlRes.fileList[s].tempFileURL } }
            var updated = self.data.comments
            for (var t = 0; t < updated.length; t++) {
              if (urlMap[updated[t].userAvatar]) updated[t].userAvatar = urlMap[updated[t].userAvatar]
            }
            for (var u = 0; u < imageRefs.length; u++) {
              var ref = imageRefs[u]
              if (urlMap[ref.fid] && updated[ref.ci] && updated[ref.ci].images) updated[ref.ci].images[ref.ii] = urlMap[ref.fid]
            }
            self.setData({ comments: updated })
          }).catch(function() {})
        }
      })
      .catch(function() {
        self.setData({ loading: false })
      })
  },
  loadMore: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadComments(false)
    }
  },
  loadInlineReplies: function() {
    var self = this
    if (!db) return
    var posts = self.data.comments
    if (!posts || posts.length === 0) return
    var postIds = []
    for (var i = 0; i < posts.length; i++) postIds.push(posts[i]._id)
    db.collection('comments').where({ replyTo: db.command.in(postIds) })
      .orderBy('createTime', 'asc').limit(100).get()
      .then(function(res) {
        var replies = res.data || []
        var roles = self.data.userRoles
        var grouped = {}
        for (var j = 0; j < replies.length; j++) {
          replies[j].timeStr = self.formatTime(replies[j].createTime)
          replies[j].userRole = roles[replies[j].userName] || ''
          var pid = replies[j].replyTo
          if (!grouped[pid]) grouped[pid] = []
          if (grouped[pid].length < 3) grouped[pid].push(replies[j])
        }
        var updated = self.data.comments.slice()
        for (var k = 0; k < updated.length; k++) {
          updated[k] = Object.assign({}, updated[k], { inlineReplies: grouped[updated[k]._id] || [] })
        }
        self.setData({ comments: updated })
        var avatarIDs = []
        for (var m = 0; m < replies.length; m++) {
          if (cloudUrl.isCloudUrl(replies[m].userAvatar)) avatarIDs.push(replies[m].userAvatar)
        }
        if (avatarIDs.length > 0) {
          var uniqueIDs = []
          var seen = {}
          for (var n = 0; n < avatarIDs.length; n++) { if (!seen[avatarIDs[n]]) { seen[avatarIDs[n]] = true; uniqueIDs.push(avatarIDs[n]) } }
          wx.cloud.getTempFileURL({ fileList: uniqueIDs }).then(function(urlRes) {
            var urlMap = {}
            if (urlRes.fileList) { for (var s = 0; s < urlRes.fileList.length; s++) { if (urlRes.fileList[s].tempFileURL) urlMap[urlRes.fileList[s].fileID] = urlRes.fileList[s].tempFileURL } }
            var cur = self.data.comments.slice()
            for (var t = 0; t < cur.length; t++) {
              if (cur[t].inlineReplies) {
                var newReplies = cur[t].inlineReplies.slice()
                for (var u = 0; u < newReplies.length; u++) {
                  if (urlMap[newReplies[u].userAvatar]) newReplies[u] = Object.assign({}, newReplies[u], { userAvatar: urlMap[newReplies[u].userAvatar] })
                }
                cur[t] = Object.assign({}, cur[t], { inlineReplies: newReplies })
              }
            }
            self.setData({ comments: cur })
          })
        }
      })
      .catch(function() {})
  },
  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab
    if (tab === this.data.activeTab) return
    this.setData({ activeTab: tab, comments: [], currentPage: 0, hasMore: true })
    this.loadComments(true)
  },
  openPostModal: function() {
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    this.setData({ showPostModal: true, postContent: '', postImages: [] })
  },
  closePostModal: function() {
    this.setData({ showPostModal: false })
  },
  preventClose: function() {},
  onAvatarError: function(e) {
    var idx = e.currentTarget.dataset.idx
    var type = e.currentTarget.dataset.type || 'comments'
    if (type === 'comments' && idx !== undefined) {
      var comments = this.data.comments
      if (comments[idx]) {
        comments[idx].userAvatar = '/images/default-avatar.png'
        this.setData({ comments: comments })
      }
    } else if (type === 'post') {
      var userInfo = this.data.userInfo
      if (userInfo) {
        userInfo.avatarUrl = '/images/default-avatar.png'
        this.setData({ userInfo: userInfo })
      }
    }
  },
  onPostInput: function(e) {
    this.setData({ postContent: e.detail.value })
  },
  onImageUrlInput: function(e) {
    this.setData({ imageUrlInput: e.detail.value })
  },
  addImageByUrl: function() {
    var self = this
    var url = self.data.imageUrlInput.trim()
    if (!url) { wx.showToast({ title: '请输入图片链接', icon: 'none' }); return }
    if (self.data.postImages.length >= 9) { wx.showToast({ title: '最多上传9张图片', icon: 'none' }); return }
    var images = self.data.postImages.concat([url])
    self.setData({ postImages: images, imageUrlInput: '' })
  },
  choosePostImage: function() {
    var self = this
    if (self.data.postImages.length >= 9) {
      wx.showToast({ title: '最多上传9张图片', icon: 'none' })
      return
    }
    wx.chooseImage({
      count: 9 - self.data.postImages.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var newImages = res.tempFilePaths
        self.setData({ postImages: self.data.postImages.concat(newImages) })
      },
      fail: function() {}
    })
  },
  removePostImage: function(e) {
    var idx = e.currentTarget.dataset.idx
    var images = this.data.postImages
    images.splice(idx, 1)
    this.setData({ postImages: images })
  },
  uploadImages: function(images) {
    if (images.length === 0) return Promise.resolve([])
    var urlImages = []
    var localImages = []
    for (var i = 0; i < images.length; i++) {
      if (images[i].indexOf('http') === 0 || images[i].indexOf('cloud://') === 0) {
        urlImages.push(images[i])
      } else {
        localImages.push(images[i])
      }
    }
    if (localImages.length === 0) return Promise.resolve(urlImages)
    var ts = Date.now()
    var tasks = localImages.map(function(path, i) {
      var ext = path.split('.').pop() || 'jpg'
      var cloudPath = 'community/' + ts + '_' + i + '.' + ext
      return wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: path })
    })
    return Promise.all(tasks).then(function(res) {
      var fileIDs = res.map(function(r) { return r.fileID })
      return urlImages.concat(fileIDs)
    }).catch(function() { return urlImages })
  },
  submitPost: function() {
    var self = this
    if (self.data.posting) return
    var content = self.data.postContent.trim()
    if (!content && self.data.postImages.length === 0) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    if (!app.globalData.userInfo) { wx.showToast({ title: '请先登录', icon: 'none' }); return }
    self.setData({ posting: true })
    var roles = self.data.userRoles
    var userRole = roles[app.globalData.userInfo.nickName] || ''
    var avatarUrl = app.globalData.userInfo._cloudAvatar || app.globalData.userInfo.avatarUrl
    self.uploadImages(self.data.postImages).then(function(fileIDs) {
      var loginDays = wx.getStorageSync('login_days') || []
      var userLevel = self.calcLevel(loginDays.length)
      var postData = {
        pageType: 'community',
        pageId: '',
        content: content,
        rating: 0,
        userName: app.globalData.userInfo.nickName,
        userAvatar: avatarUrl,
        userRole: userRole,
        userLevel: userLevel,
        replyTo: null,
        images: fileIDs,
        likes: [],
        replyCount: 0,
        device: userRole === 'developer' ? '' : self.data.deviceModel,
        location: self.data.province,
        createTime: db.serverDate()
      }
      return db.collection('comments').add({ data: postData })
    }).then(function() {
      self.setData({ posting: false, showPostModal: false, postContent: '', postImages: [] })
      wx.showToast({ title: '发布成功', icon: 'success' })
      self.loadComments(true)
    }).catch(function(err) {
      console.error('发布失败:', err)
      self.setData({ posting: false })
      wx.showToast({ title: '发布失败: ' + (err.errMsg || '未知错误'), icon: 'none' })
    })
  },
  toggleLike: function(e) {
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    if (!db) return
    var self = this
    var item = e.currentTarget.dataset.item
    var userName = app.globalData.userInfo.nickName
    var likes = item.likes || []
    var idx = likes.indexOf(userName)
    if (idx >= 0) {
      likes.splice(idx, 1)
    } else {
      likes.push(userName)
      if (item.userName !== userName) {
        notify.getOpenidByNickname(item.userName, function(targetOpenid) {
          if (targetOpenid) {
            notify.sendInteractionNotify(targetOpenid, 'like', {
              userName: userName,
              postContent: item.content
            })
          }
        })
      }
    }
    db.collection('comments').doc(item._id).update({ data: { likes: likes } })
      .then(function() {
        self.loadComments(true)
      })
  },
  toggleReplyBar: function(e) {
    var item = e.currentTarget.dataset.item
    if (!app.globalData.userInfo) { wx.showToast({ title: '请先登录', icon: 'none' }); return }
    var postId = this.data.activeReplyPostId === item._id ? '' : item._id
    this.setData({ activeReplyPostId: postId, replyContent: '', replyTarget: null })
  },
  setReplyTarget: function(e) {
    var item = e.currentTarget.dataset.item
    if (!app.globalData.userInfo || item.userName === app.globalData.userInfo.nickName) return
    this.setData({ replyTarget: { _id: item._id, userName: item.userName, content: item.content } })
  },
  clearReplyTarget: function() {
    this.setData({ replyTarget: null })
  },
  onReplyInput: function(e) {
    this.setData({ replyContent: e.detail.value })
  },
  submitReply: function() {
    var self = this
    if (self.data.replying) return
    var content = self.data.replyContent.trim()
    if (!content) { wx.showToast({ title: '请输入回复内容', icon: 'none' }); return }
    if (!db || !app.globalData.userInfo || !self.data.activeReplyPostId) return
    var postId = self.data.activeReplyPostId
    var post = null
    for (var i = 0; i < self.data.comments.length; i++) {
      if (self.data.comments[i]._id === postId) { post = self.data.comments[i]; break }
    }
    if (!post) return
    self.setData({ replying: true })
    var roles = self.data.userRoles
    var userRole = roles[app.globalData.userInfo.nickName] || ''
    var avatarUrl = app.globalData.userInfo._cloudAvatar || app.globalData.userInfo.avatarUrl
    var replyData = {
      pageType: post.pageType || 'community',
      pageId: post.pageId || '',
      content: content,
      rating: 0,
      userName: app.globalData.userInfo.nickName,
      userAvatar: avatarUrl,
      userRole: userRole,
      replyTo: postId,
      images: [],
      likes: [],
      replyCount: 0,
      device: userRole === 'developer' ? '' : self.data.deviceModel,
      location: self.data.province,
      createTime: db.serverDate()
    }
    db.collection('comments').add({ data: replyData })
      .then(function() {
        return db.collection('comments').doc(postId).update({
          data: { replyCount: (post.replyCount || 0) + 1 }
        })
      })
      .then(function() {
        var target = self.data.replyTarget
        self.setData({ replying: false, replyContent: '', replyTarget: null, activeReplyPostId: '' })
        wx.showToast({ title: '回复成功', icon: 'success' })
        self.loadComments(true)
        var notifyUser = target ? target.userName : post.userName
        var notifyContent = target ? target.content : post.content
        if (notifyUser !== app.globalData.userInfo.nickName) {
          notify.getOpenidByNickname(notifyUser, function(targetOpenid) {
            if (targetOpenid) {
              notify.sendInteractionNotify(targetOpenid, 'reply', {
                userName: app.globalData.userInfo.nickName,
                content: content,
                postContent: notifyContent
              })
            }
          })
        }
      })
      .catch(function() {
        self.setData({ replying: false })
        wx.showToast({ title: '回复失败', icon: 'none' })
      })
  },
  deletePost: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!app.globalData.userInfo) return
    var isAdmin = self.data.userRoles[app.globalData.userInfo.nickName] === 'developer' || self.data.userRoles[app.globalData.userInfo.nickName] === 'editor'
    var isOwner = item.userName === app.globalData.userInfo.nickName
    if (!isAdmin && !isOwner) return
    wx.showModal({
      title: '删除帖子',
      content: '确定要删除这条内容吗？',
      success: function(res) {
        if (res.confirm && db) {
          db.collection('comments').doc(item._id).remove()
            .then(function() {
              wx.showToast({ title: '已删除', icon: 'success' })
              self.loadComments(true)
            })
        }
      }
    })
  },
  goToPage: function(e) {
    var item = e.currentTarget.dataset.item
    if (item.pageType === 'pet' && item.pageId) {
      wx.navigateTo({ url: '/pages/pets/detail/detail?id=' + item.pageId })
    }
  },
  toggleTitlePicker: function() {
    if (!app.globalData.userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    this.setData({ showTitlePicker: !this.data.showTitlePicker })
  },
  selectTitle: function(e) {
    var self = this
    var title = e.currentTarget.dataset.title
    var color = e.currentTarget.dataset.color
    if (!db || !app.globalData.userInfo) return
    self.setData({ showTitlePicker: false })
    db.collection('users').where({ nickName: app.globalData.userInfo.nickName }).get()
      .then(function(res) {
        if (res.data.length > 0) {
          db.collection('users').doc(res.data[0]._id).update({
            data: { title: title, titleColor: color }
          }).then(function() {
            wx.showToast({ title: '头衔已更新', icon: 'success' })
            self.loadUserRoles()
          })
        }
      })
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date)
    var now = new Date()
    var diff = now - d
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
    if (diff < 2592000000) return Math.floor(diff / 86400000) + '天前'
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  },
  calcLevel: function(days) {
    if (days >= 365) return 10
    if (days >= 180) return 9
    if (days >= 120) return 8
    if (days >= 90) return 7
    if (days >= 60) return 6
    if (days >= 30) return 5
    if (days >= 15) return 4
    if (days >= 7) return 3
    if (days >= 3) return 2
    return 1
  },
  checkManager: function() {
    if (!app.globalData.userInfo) return
    var role = this.data.userRoles[app.globalData.userInfo.nickName] || ''
    this.setData({ isManager: role === 'developer' || role === 'editor' })
  },
  togglePin: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!db) return
    var newVal = !item.pinned
    db.collection('comments').doc(item._id).update({ data: { pinned: newVal } })
      .then(function() {
        wx.showToast({ title: newVal ? '已置顶' : '取消置顶', icon: 'success' })
        self.loadComments(true)
      })
  },
  toggleFeatured: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!db) return
    var newVal = !item.featured
    db.collection('comments').doc(item._id).update({ data: { featured: newVal } })
      .then(function() {
        wx.showToast({ title: newVal ? '已精选' : '取消精选', icon: 'success' })
        self.loadComments(true)
      })
  },
  banUser: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!db) return
    wx.showModal({
      title: '封禁用户',
      content: '确定封禁 ' + item.userName + ' ？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').where({ nickName: item.userName }).get()
            .then(function(r) {
              if (r.data.length > 0) {
                return db.collection('users').doc(r.data[0]._id).update({ data: { banned: true } })
              }
            })
            .then(function() {
              wx.showToast({ title: '已封禁', icon: 'success' })
              self.loadComments(true)
            })
        }
      }
    })
  },
  unbanUser: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!db) return
    db.collection('users').where({ nickName: item.userName }).get()
      .then(function(r) {
        if (r.data.length > 0) {
          return db.collection('users').doc(r.data[0]._id).update({ data: { banned: false } })
        }
      })
      .then(function() {
        wx.showToast({ title: '已解封', icon: 'success' })
        self.loadComments(true)
      })
  },
  setEditor: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!db) return
    wx.showModal({
      title: '设为小编',
      content: '确定将 ' + item.userName + ' 设为小编？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').where({ nickName: item.userName }).get()
            .then(function(r) {
              if (r.data.length > 0) {
                return db.collection('users').doc(r.data[0]._id).update({ data: { role: 'editor' } })
              }
            })
            .then(function() {
              wx.showToast({ title: '已设为小编', icon: 'success' })
              self.loadUserRoles()
            })
        }
      }
    })
  },
  removeEditor: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!db) return
    wx.showModal({
      title: '取消小编',
      content: '确定取消 ' + item.userName + ' 的小编身份？',
      success: function(res) {
        if (res.confirm) {
          db.collection('users').where({ nickName: item.userName }).get()
            .then(function(r) {
              if (r.data.length > 0) {
                return db.collection('users').doc(r.data[0]._id).update({ data: { role: '' } })
              }
            })
            .then(function() {
              wx.showToast({ title: '已取消', icon: 'success' })
              self.loadUserRoles()
            })
        }
      }
    })
  },
  previewImage: function(e) {
    var src = e.currentTarget.dataset.src
    var urls = e.currentTarget.dataset.urls || [src]
    wx.previewImage({
      current: src,
      urls: urls
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})