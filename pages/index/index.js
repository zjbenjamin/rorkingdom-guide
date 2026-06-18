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
    var adminFlag = wx.getStorageSync('admin_logged_in') || wx.getStorageSync('is_admin_user')
    if (adminFlag) {
      self.setData({ isAdmin: true })
      return
    }
    var userInfo = app.globalData.userInfo || wx.getStorageSync('user_info')
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            if (userRes.data.length > 0) {
              self.setData({ isAdmin: true })
              wx.setStorageSync('admin_logged_in', true)
              wx.setStorageSync('is_admin_user', true)
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
            videoPlayerDesc: (data.desc || '').substring(0, 60),
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
