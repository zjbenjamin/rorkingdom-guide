var app = getApp()
var activitiesData = [
  { id: 1, title: '异色获取方法', type: '官方权威信息', subType: 'regular', collabLogo: '', status: '置顶', start: '', end: '', rewards: [], desc: '通过赛季奇遇、大世界遭遇、生蛋孵蛋、赛季商店兑换等方式获取异色精灵。' }
]
var cloudUrl = require('../../utils/cloudUrl')
var notify = require('../../utils/notify')
var mediaPlayer = require('../../utils/mediaPlayer')
var admin = require('../../utils/admin')
var db = null

function parseTextToRichContent(text) {
  if (!text) return [];
  var lines = text.split('\n');
  var richContent = [];
  var textBuffer = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) {
      if (textBuffer.length > 0) textBuffer.push('');
      continue;
    }

    var cleanLine = line.replace(/<[^>]+>/g, '').trim();
    // 过滤掉可能由admin.js自动生成的重复文�?
    if (cleanLine.indexOf('🎵 推荐单曲:') > -1 || cleanLine.indexOf('📺 视频:') > -1 || cleanLine.indexOf('🎬 视频:') > -1 || cleanLine.indexOf('口推荐单�?') > -1) {
      continue;
    }

    var urlMatch = cleanLine.match(/(https?:\/\/[^\s�?】\]》]+)/i);
    if (urlMatch) {
      var url = urlMatch[1].replace(/[,;!！。，；、]+$/, '');
      var isMusic = /music\.163\.com|163cn\.tv|y\.qq\.com/.test(url) || cleanLine.indexOf('单曲') > -1 || cleanLine.indexOf('音乐') > -1 || cleanLine.indexOf('生日祝福�?) > -1;
      var isVideo = /bilibili\.com|v\.qq\.com|weibo\.com|douyin\.com/.test(url) || cleanLine.indexOf('视频') > -1;

      if (isMusic || isVideo) {
        var name = cleanLine.replace(urlMatch[0], '').replace(/[()（）]/g, '').trim();
        name = name.replace(/^[🎵📺口]?\s*(视频：|视频:|推荐单曲：|推荐单曲:)/, '').trim();
        
        if (!name && textBuffer.length > 0) {
          var prevLine = textBuffer.pop().replace(/<[^>]+>/g, '').trim();
          name = prevLine.replace(/^[🎵📺口]?\s*(视频：|视频:|推荐单曲：|推荐单曲:)/, '').trim();
          if (!name) textBuffer.push(prevLine); 
        }
        
        if (!name) name = isMusic ? '推荐单曲' : '推荐视频';

        if (textBuffer.length > 0) {
          var t = textBuffer.join('\n').trim();
          if (t) richContent.push({ type: 'text', content: t, style: 'normal', weight: 'normal', size: 28, color: '#ffffff' });
          textBuffer = [];
        }

        if (isMusic) {
          var nMatch = url.match(/id=(\d+)/);
          if (nMatch && url.indexOf('163.com') > -1) url = 'https://music.163.com/song/media/outer/url?id=' + nMatch[1] + '.mp3';
          richContent.push({ type: 'music', name: name, url: url });
        } else {
          var platform = 'other', platformName = '其他';
          if (/bilibili\.com/.test(url)) { platform = 'bilibili'; platformName = 'B�?; }
          else if (/weibo\.com/.test(url)) { platform = 'weibo'; platformName = '微博'; }
          else if (/douyin\.com/.test(url)) { platform = 'douyin'; platformName = '抖音'; }
          richContent.push({ type: 'video', platform: platform, platformName: platformName, name: name, url: url, vid: '' });
        }
        continue;
      }
    }
    
    // Check if it's "视频：xxx" alone on a line without URL, likely matched with URL on next line
    if (cleanLine.indexOf('视频�?) === 0 || cleanLine.indexOf('口推荐单�?') === 0) {
      textBuffer.push(line);
    } else {
      textBuffer.push(line);
    }
  }

  if (textBuffer.length > 0) {
    var finalStr = textBuffer.join('\n').trim();
    if (finalStr) {
      richContent.push({ type: 'text', content: finalStr, style: 'normal', weight: 'normal', size: 28, color: '#ffffff' });
    }
  }
  return richContent;
}
Page({
  data: { theme: 'light', filtered: [], status: '全部', statuses: ['全部', '常规活动', '赛季活动', '联动活动'], expandedId: -1, isAdmin: false, showEditModal: false, editingItem: null, editTitle: '', editDesc: '', editStatus: '进行�?, editType: '', editRewards: '', editStart: '', editEnd: '', editImage: '', subscribedActivity: false, subscribeCount: 0, currentPlayUrl: '', isPlaying: false, showVideoPlayer: false, videoPlayerUrl: '', videoPlayerName: '', videoPlayerCover: '', videoPlayerOwner: '', videoPlayerDesc: '' },
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
    admin.checkAdmin(self, function(isAdmin) {
      if (isAdmin) self.setData({ isAdmin: true })
      self.sortActivities()
    })
  },
  sortActivities: function() {
    var self = this
    if (db && self.data.isAdmin) {
      db.collection('announcements').where({ type: 'event' }).orderBy('createTime', 'desc').limit(50).get()
        .then(function(res) {
          var cloudActivities = (res.data || []).map(function(item) {
            var richContent = item.richContent || [];
            
            // Clean up or auto-parse richContent
            if (richContent.length === 0 && item.content) {
              richContent = parseTextToRichContent(item.content);
            } else {
              // Also clean up any auto-generated text from admin.js in text blocks
              var newRich = [];
              for (var i = 0; i < richContent.length; i++) {
                if (richContent[i].type === 'text') {
                  var contentStr = richContent[i].html || richContent[i].content || '';
                  var parsedBlocks = parseTextToRichContent(contentStr);
                  newRich = newRich.concat(parsedBlocks);
                } else {
                  newRich.push(richContent[i]);
                }
              }
              richContent = newRich;
            }

            return { id: item._id, title: item.title, desc: item.content, status: item.pinned ? '置顶' : '进行�?, type: item.type || '', subType: item.subType || 'regular', collabLogo: item.collabLogo || '', rewards: item.rewards || [], start: item.start || '', end: item.end || '', image: item.image || '', richContent: richContent, isCloud: true }
          })
          var all = activitiesData.concat(cloudActivities)
          self._activities = all
          self.filterList()
          cloudUrl.convertList(all, 'image', function(converted) {
            self._activities = converted
            self.filterList()
          })
        })
        .catch(function() {
          self._activities = activitiesData
          self.filterList()
        })
    } else {
      self._activities = activitiesData
      self.filterList()
    }
  },
  filterList: function() {
    var sorted = (this._activities || []).slice()
    sorted.sort(function(a, b) {
      if (a.status === '置顶' && b.status !== '置顶') return -1
      if (a.status !== '置顶' && b.status === '置顶') return 1
      var statusOrder = { '进行�?: 0, '即将开�?: 1, '已结�?: 2 }
      var orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 3
      var orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 3
      if (orderA !== orderB) return orderA - orderB
      if (a.start && b.start) return b.start.localeCompare(a.start)
      return 0
    })
    
    var s = this.data.status
    var filtered = []
    if (s === '全部') {
      filtered = sorted
    } else {
      for (var i = 0; i < sorted.length; i++) {
        var subType = sorted[i].subType || 'regular'
        if (s === '常规活动' && subType === 'regular') filtered.push(sorted[i])
        else if (s === '赛季活动' && subType === 'season') filtered.push(sorted[i])
        else if (s === '联动活动' && subType === 'collab') filtered.push(sorted[i])
      }
    }

    this._activities = sorted
    this.setData({ filtered: filtered })
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
    this.setData({ showEditModal: true, editingItem: null, editTitle: '', editDesc: '', editStatus: '进行�?, editType: '活动', editRewards: '', editStart: '', editEnd: '', editImage: '' })
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
  onStatusChange: function(e) { var statuses = ['进行�?,'即将开�?,'置顶']; this.setData({ editStatus: statuses[e.detail.value] }) },
  chooseEditImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传�?..' })
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
        wx.showLoading({ title: '解析�?..' })
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
    if (!title) { wx.showToast({ title: '请输入标�?, icon: 'none' }); return }
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
            .then(function() { wx.showToast({ title: '已删�?, icon: 'success' }); self.sortActivities() })
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
    if (currentCount >= 99) { wx.showToast({ title: '已达上限99�?, icon: 'none' }); return }
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
          title: '通知已关�?,
          content: '您已关闭该类通知，请在小程序设置中手动开�?,
          confirmText: '去设�?,
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
        .catch(function(e) { console.error(e) })
    }).catch(function(e) { console.error(e) })
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
        wx.showToast({ title: '已添�?' + newCount + '/99)', icon: 'success' })
        self.checkSubscription()
      })
    })
  },
  _initBgAudio: function() { mediaPlayer.initBgAudio(this) },
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
        wx.showToast({ title: '链接已复�?, icon: 'success' })
      }
    })
  },
  preventClose: function() {},
  previewRichImage: function(e) {
    var src = e.currentTarget.dataset.src
    if (src) wx.previewImage({ urls: [src] })
  },
  closeVideoPlayer: function() {
    this.setData({
      showVideoPlayer: false,
      videoPlayerUrl: '',
      videoPlayerOriginalUrl: ''
    })
  },
  onVideoError: function(e) {
    var self = this
    console.error('Video play error:', e.detail ? e.detail.errMsg : e)
    wx.showModal({
      title: '播放失败',
      content: '视频播放失败（受限制或网络问题），建议复制原链接到浏览器或APP观看�?,
      confirmText: '复制链接',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm && self.data.videoPlayerOriginalUrl) {
          wx.setClipboardData({
            data: self.data.videoPlayerOriginalUrl,
            success: function() {
              wx.showToast({ title: '已复制链�?, icon: 'success' })
            }
          })
        }
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

    // 检测视频平台类�?
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

    wx.showLoading({ title: '解析视频�?..' })
    
    // 构造请求参数，优先提取 B�?bvid 以保证向后兼容，其他平台传整�?url
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
          var defaultTitle = isBilibili ? 'B站视�? : isWeibo ? '微博视频' : isDouyin ? '抖音视频' : isKuaishou ? '快手视频' : isXiaohongshu ? '小红书视�? : '在线视频'
          var videoTitle = name !== '视频' ? name : (data.title || defaultTitle)
          
          self.setData({
            videoPlayerUrl: data.videoUrl,
            videoPlayerName: videoTitle,
            videoPlayerCover: data.pic || '',
            videoPlayerOwner: data.ownerName || '',
            videoPlayerDesc: data.desc || '',
            videoPlayerOriginalUrl: url,
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
    var content = '该视频由于版权限制或解析失败，可复制链接观看�?
    if (reason) {
      content = '解析未成功（' + reason + '），可复制链接到浏览器或App中观看�?
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
              wx.showToast({ title: '链接已复�?, icon: 'success' })
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
              wx.showToast({ title: '已复制到剪贴�?, icon: 'success' })
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
    
    wx.showLoading({ title: '加载文件�?..' })
    
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
                    wx.showToast({ title: '链接已复�?, icon: 'success' })
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
    return { title: '洛手助手 - 活动日历', path: '/pages/activity/activity', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 洛克王国活动日历，不错过每个活动', imageUrl: '/images/banner.webp' }
  }
})
