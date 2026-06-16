var app = getApp()
var db = null
var notify = require('../../utils/notify')
var cloudUrl = require('../../utils/cloudUrl')
var imageConfig = require('../../config/images')

Page({
  data: {
    bannerUrl: '',
    bannerFallback: '',
    announcements: [],
    subscribeConfig: {},
    buildTime: '',
    currentPlayUrl: '',
    isPlaying: false,
    icp: '浙ICP备2026043884号',
    showVideoPlayer: false,
    videoPlayerUrl: '',
    videoPlayerName: '',
    videoPlayerCover: '',
    videoPlayerOwner: '',
    videoPlayerDesc: ''
  },
  onShow: function() {
    var self = this
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
    self.loadBanner()
    self.loadIcp()
    self.checkSubscription()
  },
  checkAdmin: function() {
    var self = this
    if (!db) return
    var adminFlag = wx.getStorageSync('admin_logged_in')
    self.setData({ isAdmin: !!adminFlag })
  },
  loadBanner: function() {
    var self = this
    if (!db) return
    db.collection('site_config').doc('banner').get()
      .then(function(res) {
        if (res.data && res.data.url && res.data.url !== 'none' && res.data.url.indexOf('example.com') === -1) {
          if (res.data.url.indexOf('cloud://') === 0) {
            wx.cloud.getTempFileURL({
              fileList: [res.data.url],
              success: function(fileRes) {
                if (fileRes.fileList && fileRes.fileList[0] && fileRes.fileList[0].tempFileURL) {
                  self.setData({ bannerUrl: fileRes.fileList[0].tempFileURL })
                }
              }
            })
          } else {
            self.setData({ bannerUrl: res.data.url })
          }
        }
      })
      .catch(function() {})
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
      .catch(function() {})
  },
  loadAnnouncements: function() {
    var self = this
    if (!db) return
    db.collection('announcements')
      .orderBy('pinned', 'desc')
      .orderBy('createTime', 'desc')
      .limit(10)
      .get()
      .then(function(res) {
        var list = res.data || []
        for (var i = 0; i < list.length; i++) {
          list[i].timeStr = self.formatTime(list[i].createTime)
        }
        self.setData({ announcements: list })
        cloudUrl.convertList(list, 'image', function(converted) {
          self.setData({ announcements: converted })
        })
      })
      .catch(function() {})
  },
  formatTime: function(date) {
    if (!date) return ''
    var d = new Date(date)
    var now = new Date()
    var diff = now - d
    if (diff < 86400000) return '今天'
    if (diff < 172800000) return '昨天'
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
    return (d.getMonth() + 1) + '/' + d.getDate()
  },
  go: function(e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
      fail: function(err) {
        console.error("导航失败 navigateTo failed:", err)
        // 尝试用 switchTab 兼容，以防某些页面被临时改为了 TabBar 页面
        wx.switchTab({
          url: url,
          fail: function(tabErr) {
            console.error("切换 TabBar 也失败 switchTab failed:", tabErr)
          }
        })
      }
    })
  },
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
        self.saveSubscription('announcement')
      } else if (result.announcement === 'reject') {
        wx.showToast({ title: '已拒绝通知', icon: 'none' })
      } else if (result.announcement === 'ban') {
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
  checkSubscription: function() {
    var self = this
    if (!db) return
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
        .catch(function() {})
    }).catch(function() {})
  },
  toggleBannerModal: function() {
    var self = this
    if (!self.data.isAdmin) return
    self.setData({ showBannerModal: !self.data.showBannerModal, bannerInput: self.data.bannerUrl || '' })
  },
  onBannerInput: function(e) { this.setData({ bannerInput: e.detail.value }) },
  chooseBannerImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        wx.cloud.uploadFile({
          cloudPath: 'banner/' + Date.now() + '.jpg',
          filePath: filePath
        }).then(function(uploadRes) {
          wx.hideLoading()
          self.setData({ bannerInput: uploadRes.fileID })
        }).catch(function() {
          wx.hideLoading()
          wx.showToast({ title: '上传失败', icon: 'none' })
        })
      }
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
      .catch(function() {
        return db.collection('site_config').add({ data: { _id: 'banner', url: url, updateTime: db.serverDate() } })
      })
      .then(function() {
        self.setData({ bannerSaving: false, showBannerModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadBanner()
      })
      .catch(function() {
        self.setData({ bannerSaving: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  preventClose: function() {},
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

    function fetchBilibiliStream(bvid) {
      wx.showLoading({ title: '解析中...' })
      wx.request({
        url: 'https://api.bilibili.com/x/web-interface/view?bvid=' + bvid,
        success: function(res) {
          if (res.data && res.data.code === 0 && res.data.data) {
            var info = res.data.data
            var cid = info.cid || (info.pages && info.pages[0] && info.pages[0].cid)
            var videoTitle = name !== '视频' ? name : (info.title || 'B站视频')
            var videoCover = info.pic || ''
            var videoOwner = (info.owner && info.owner.name) ? info.owner.name : ''
            var videoDesc = (info.desc || '').substring(0, 60)
            if (cid) {
              wx.request({
                url: 'https://api.bilibili.com/x/player/playurl?bvid=' + bvid + '&cid=' + cid + '&platform=html5&qn=80&fnval=1',
                success: function(streamRes) {
                  wx.hideLoading()
                  if (streamRes.data && streamRes.data.code === 0 && streamRes.data.data && streamRes.data.data.durl && streamRes.data.data.durl.length > 0) {
                    self.setData({
                      videoPlayerUrl: streamRes.data.data.durl[0].url,
                      videoPlayerName: videoTitle,
                      videoPlayerCover: videoCover,
                      videoPlayerOwner: videoOwner,
                      videoPlayerDesc: videoDesc,
                      showVideoPlayer: true
                    })
                  } else {
                    self._openVideoFallback(url)
                  }
                },
                fail: function() { wx.hideLoading(); self._openVideoFallback(url) }
              })
            } else {
              wx.hideLoading(); self._openVideoFallback(url)
            }
          } else {
            wx.hideLoading(); self._openVideoFallback(url)
          }
        },
        fail: function() { wx.hideLoading(); self._openVideoFallback(url) }
      })
    }

    // 尝试从 URL 提取 BV 号
    var bvMatch = url.match(/BV[a-zA-Z0-9]{10,}/)
    if (bvMatch) {
      fetchBilibiliStream(bvMatch[0])
      return
    }

    // b23.tv 短链接：先跟随重定向获取真实 URL
    var shortMatch = url.match(/b23\.tv\/([a-zA-Z0-9]+)/)
    if (shortMatch) {
      wx.showLoading({ title: '解析短链接...' })
      wx.request({
        url: url,
        success: function(redirectRes) {
          var finalUrl = redirectRes.request ? redirectRes.request.url || '' : ''
          // 或从 header 中获取
          if (!finalUrl && redirectRes.header && redirectRes.header.Location) {
            finalUrl = redirectRes.header.Location
          }
          var matched = finalUrl.match(/BV[a-zA-Z0-9]{10,}/)
          if (matched) {
            wx.hideLoading()
            fetchBilibiliStream(matched[0])
          } else {
            wx.hideLoading()
            self._openVideoFallback(url)
          }
        },
        fail: function() {
          wx.hideLoading()
          self._openVideoFallback(url)
        }
      })
      return
    }

    self._openVideoFallback(url)
  },
  _openVideoFallback: function(url) {
    wx.showModal({
      title: '无法解析视频流',
      content: 'B站以外平台或解析失败，将在浏览器打开',
      confirmText: '打开',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(url) })
        }
      }
    })
  },
  closeVideoPlayer: function() {
    this.setData({ showVideoPlayer: false, videoPlayerUrl: '', videoPlayerName: '', videoPlayerCover: '', videoPlayerOwner: '', videoPlayerDesc: '' })
  },
  previewRichImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src] })
  },
  onShareAppMessage: function() {
    return { title: '洛手助手BENJAMIN - 洛克王国攻略', path: '/pages/index/index', imageUrl: '/images/banner1.png' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手BENJAMIN - 精灵图鉴·捕捉统计·活动日历', imageUrl: '/images/banner1.png' }
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
  }
})
