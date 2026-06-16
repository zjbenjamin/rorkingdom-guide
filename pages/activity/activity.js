var app = getApp()
var activitiesData = [
  { id: 1, title: '异色获取方法', type: '官方权威信息', status: '置顶', start: '', end: '', rewards: [], desc: '通过赛季奇遇、大世界遭遇、生蛋孵蛋、赛季商店兑换等方式获取异色精灵。' }
]
var cloudUrl = require('../../utils/cloudUrl')
var notify = require('../../utils/notify')
var db = null
Page({
  data: { theme: 'light', activities: [], filtered: [], status: '全部', statuses: ['全部','进行中','置顶'], expandedId: -1, isAdmin: false, showEditModal: false, editingItem: null, editTitle: '', editDesc: '', editStatus: '进行中', editType: '', editRewards: '', editStart: '', editEnd: '', editImage: '', subscribedActivity: false, subscribeCount: 0, currentPlayUrl: '', isPlaying: false },
  onShow: function() {
    this.setData({ theme: app.globalData.theme })
    if (wx.cloud) db = wx.cloud.database()
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    this.setData({ subscribeConfig: subscribeConfig })
    this.checkAdmin()
    this.checkSubscription()

  },
  checkAdmin: function() {
    var self = this
    if (!db) { self.sortActivities(); return }
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) { self.setData({ isAdmin: false }); self.sortActivities(); return }
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            self.setData({ isAdmin: userRes.data.length > 0 })
            self.sortActivities()
          })
          .catch(function() { self.sortActivities() })
      })
      .catch(function() { self.sortActivities() })
  },
  sortActivities: function() {
    var self = this
    if (db && self.data.isAdmin) {
      db.collection('announcements').where({ type: 'event' }).orderBy('createTime', 'desc').limit(50).get()
        .then(function(res) {
          var cloudActivities = (res.data || []).map(function(item) {
            return { id: item._id, title: item.title, desc: item.content, status: item.pinned ? '置顶' : '进行中', type: item.type || '', rewards: item.rewards || [], start: item.start || '', end: item.end || '', image: item.image || '', isCloud: true }
          })
          var all = activitiesData.concat(cloudActivities)
          self.setData({ activities: all })
          self.filterList()
          cloudUrl.convertList(all, 'image', function(converted) {
            self.setData({ activities: converted })
            self.filterList()
          })
        })
        .catch(function() {
          self.setData({ activities: activitiesData })
          self.filterList()
        })
    } else {
      self.setData({ activities: activitiesData })
      self.filterList()
    }
  },
  filterList: function() {
    var sorted = this.data.activities.slice()
    sorted.sort(function(a, b) {
      if (a.status === '置顶' && b.status !== '置顶') return -1
      if (a.status !== '置顶' && b.status === '置顶') return 1
      var statusOrder = { '进行中': 0, '即将开始': 1, '已结束': 2 }
      var orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 3
      var orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 3
      if (orderA !== orderB) return orderA - orderB
      if (a.start && b.start) return b.start.localeCompare(a.start)
      return 0
    })
    var s = this.data.status
    var filtered = s === '全部' ? sorted : []
    if (s !== '全部') {
      for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].status === s) filtered.push(sorted[i])
      }
    }
    this.setData({ activities: sorted, filtered: filtered })
  },
  onStatus: function(e) {
    this.setData({ status: e.currentTarget.dataset.s })
    this.filterList()
  },
  onExpand: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({ expandedId: this.data.expandedId === id ? -1 : id })
  },
  onAddActivity: function() {
    this.setData({ showEditModal: true, editingItem: null, editTitle: '', editDesc: '', editStatus: '进行中', editType: '活动', editRewards: '', editStart: '', editEnd: '', editImage: '' })
  },
  onEditActivity: function(e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      showEditModal: true, editingItem: item,
      editTitle: item.title, editDesc: item.desc, editStatus: item.status,
      editType: item.type || '', editRewards: (item.rewards || []).join('\n'),
      editStart: item.start || '', editEnd: item.end || '', editImage: item.image || ''
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
  chooseEditImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        var ext = filePath.split('.').pop() || 'jpg'
        var cloudPath = 'activities/' + Date.now() + '.' + ext
        wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
          .then(function(uploadRes) {
            wx.hideLoading()
            self.setData({ editImage: uploadRes.fileID })
          })
          .catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          })
      }
    })
  },
  inputEditImageUrl: function() {
    var self = this
    wx.showModal({
      title: '输入图片链接',
      content: '',
      editable: true,
      placeholderText: '粘贴图片URL地址',
      success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          self.setData({ editImage: res.content.trim() })
        }
      }
    })
  },
  removeEditImage: function() {
    this.setData({ editImage: '' })
  },
  previewEditImage: function() {
    if (this.data.editImage) {
      wx.previewImage({ urls: [this.data.editImage] })
    }
  },
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
    var data = { title: title, content: desc, type: 'event', pinned: self.data.editStatus === '置顶', rewards: rewards, start: self.data.editStart, end: self.data.editEnd, image: self.data.editImage, updateTime: db.serverDate() }
    var promise = self.data.editingItem && self.data.editingItem.isCloud
      ? db.collection('announcements').doc(self.data.editingItem.id).update({ data: data })
      : (data.createTime = db.serverDate(), data.author = app.globalData.userInfo ? app.globalData.userInfo.nickName : 'Admin', db.collection('announcements').add({ data: data }))
    promise.then(function() {
      self.setData({ submitting: false, showEditModal: false, editingItem: null })
      wx.showToast({ title: '操作成功', icon: 'success' })
      self.sortActivities()
      notify.pushToSubscribers('activity', title, desc, '/pages/activity/activity')
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
    
    if (!directUrl) {
      wx.setClipboardData({
        data: url,
        success: function() {
          wx.showModal({
            title: '听歌链接已复制',
            content: '该平台暂不支持直接播放，已复制链接到剪贴板，请到浏览器或音乐App中打开！',
            showCancel: false
          })
        }
      })
      return
    }
    
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
    bgAudio.epname = '游戏原声'
    bgAudio.singer = '群星'
    bgAudio.src = directUrl
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
  onShareAppMessage: function() {
    return { title: '洛手助手 - 活动日历', path: '/pages/activity/activity', imageUrl: '/images/banner1.png' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 洛克王国活动日历，不错过每个活动', imageUrl: '/images/banner1.png' }
  }
})
