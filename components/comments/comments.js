var app = getApp()
var db = null
var cloudUrl = require('../../utils/cloudUrl')

Component({
  properties: {
    pageType: { type: String, value: '' },
    pageId: { type: String, value: '' }
  },
  data: {
    comments: [],
    loading: false,
    submitting: false,
    showInput: false,
    inputValue: '',
    rating: 0,
    replyTo: null,
    avgRating: 0,
    totalCount: 0,
    currentPage: 0,
    hasMore: true,
    pageSize: 20,
    images: [],
    uploading: false
  },
  lifetimes: {
    attached: function() {
      if (wx.cloud) {
        db = wx.cloud.database()
      }
      this.loadComments(true)
    }
  },
  methods: {
    loadComments: function(refresh) {
      var self = this
      if (self.data.loading) return
      if (!db) {
        self.setData({ loading: false })
        return
      }
      var page = refresh ? 0 : self.data.currentPage
      self.setData({ loading: true })
      db.collection('comments')
        .where({ pageType: self.data.pageType, pageId: self.data.pageId })
        .orderBy('createTime', 'desc')
        .skip(page * self.data.pageSize)
        .limit(self.data.pageSize)
        .get()
        .then(function(res) {
          var list = res.data || []
          var comments = refresh ? list : self.data.comments.concat(list)
          var totalCount = comments.length
          var totalRating = 0
          var ratingCount = 0
          for (var i = 0; i < comments.length; i++) {
            if (comments[i].rating > 0) {
              totalRating += comments[i].rating
              ratingCount++
            }
            comments[i].timeStr = self.formatTime(comments[i].createTime)
            comments[i].liked = false
            if (comments[i].likes && app.globalData.userInfo) {
              for (var j = 0; j < comments[i].likes.length; j++) {
                if (comments[i].likes[j] === app.globalData.userInfo.nickName) {
                  comments[i].liked = true
                  break
                }
              }
            }
          }
          self.setData({
            comments: comments,
            loading: false,
            currentPage: page + 1,
            hasMore: list.length >= self.data.pageSize,
            totalCount: totalCount,
            avgRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0'
          })
          var allIDs = []
          for (var ci = 0; ci < comments.length; ci++) {
            if (cloudUrl.isCloudUrl(comments[ci].userAvatar)) allIDs.push(comments[ci].userAvatar)
            if (comments[ci].images) { for (var qi = 0; qi < comments[ci].images.length; qi++) { if (cloudUrl.isCloudUrl(comments[ci].images[qi])) allIDs.push(comments[ci].images[qi]) } }
          }
          if (allIDs.length > 0) {
            var uniqueIDs = []
            var seen = {}
            for (var ri = 0; ri < allIDs.length; ri++) { if (!seen[allIDs[ri]]) { seen[allIDs[ri]] = true; uniqueIDs.push(allIDs[ri]) } }
            wx.cloud.getTempFileURL({ fileList: uniqueIDs }).then(function(urlRes) {
              var urlMap = {}
              if (urlRes.fileList) { for (var si = 0; si < urlRes.fileList.length; si++) { if (urlRes.fileList[si].tempFileURL) urlMap[urlRes.fileList[si].fileID] = urlRes.fileList[si].tempFileURL } }
              var updated = self.data.comments
              for (var ti = 0; ti < updated.length; ti++) {
                if (urlMap[updated[ti].userAvatar]) updated[ti].userAvatar = urlMap[updated[ti].userAvatar]
                if (updated[ti].images) { for (var ui = 0; ui < updated[ti].images.length; ui++) { if (urlMap[updated[ti].images[ui]]) updated[ti].images[ui] = urlMap[updated[ti].images[ui]] } }
              }
              self.setData({ comments: updated })
            })
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
    toggleInput: function() {
      if (!app.globalData.userInfo) {
        wx.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      this.setData({ showInput: !this.data.showInput, replyTo: null, inputValue: '', images: [] })
    },
    onInput: function(e) {
      this.setData({ inputValue: e.detail.value })
    },
    onRating: function(e) {
      this.setData({ rating: e.currentTarget.dataset.val })
    },
    chooseImage: function() {
      var self = this
      if (self.data.images.length >= 9) {
        wx.showToast({ title: '最多上传9张图片', icon: 'none' })
        return
      }
      wx.chooseMedia({
        count: 9 - self.data.images.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var newImages = res.tempFiles.map(function(f) { return f.tempFilePath })
          self.setData({ images: self.data.images.concat(newImages) })
        }
      })
    },
    removeImage: function(e) {
      var idx = e.currentTarget.dataset.idx
      var images = this.data.images
      images.splice(idx, 1)
      this.setData({ images: images })
    },
    previewImage: function(e) {
      var src = e.currentTarget.dataset.src
      wx.previewImage({ urls: this.data.images, current: src })
    },
    uploadImages: function() {
      var self = this
      var images = self.data.images
      if (images.length === 0) return Promise.resolve([])
      self.setData({ uploading: true })
      var tasks = images.map(function(path, i) {
        var ext = path.split('.').pop() || 'jpg'
        var cloudPath = 'comments/' + Date.now() + '_' + i + '.' + ext
        return wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: path })
      })
      return Promise.all(tasks).then(function(res) {
        self.setData({ uploading: false })
        return res.map(function(r) { return r.fileID })
      }).catch(function() {
        self.setData({ uploading: false })
        return []
      })
    },
    submitComment: function() {
      var self = this
      if (self.data.submitting) return
      var content = self.data.inputValue.trim()
      if (!content && self.data.images.length === 0) {
        wx.showToast({ title: '请输入评论内容', icon: 'none' })
        return
      }
      if (!db || !app.globalData.userInfo) return
      self.setData({ submitting: true })
      self.uploadImages().then(function(fileIDs) {
        var commentData = {
          pageType: self.data.pageType,
          pageId: self.data.pageId,
          content: content,
          rating: self.data.rating,
          userName: app.globalData.userInfo.nickName,
          userAvatar: app.globalData.userInfo.avatarUrl,
          replyTo: self.data.replyTo,
          images: fileIDs,
          likes: [],
          createTime: db.serverDate()
        }
        return db.collection('comments').add({ data: commentData })
      }).then(function() {
        self.setData({ submitting: false, showInput: false, inputValue: '', rating: 0, replyTo: null, images: [] })
        wx.showToast({ title: '评论成功', icon: 'success' })
        self.loadComments(true)
      }).catch(function() {
        self.setData({ submitting: false })
        wx.showToast({ title: '评论失败', icon: 'none' })
      })
    },
    replyToComment: function(e) {
      if (!app.globalData.userInfo) {
        wx.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      var item = e.currentTarget.dataset.item
      this.setData({ showInput: true, replyTo: item._id, inputValue: '', images: [] })
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
      }
      db.collection('comments').doc(item._id).update({ data: { likes: likes } })
        .then(function() {
          self.loadComments(true)
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
    }
  }
})