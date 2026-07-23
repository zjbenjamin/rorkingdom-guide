var app = getApp()
var db = null
var cloudUrl = require('../../utils/cloudUrl')
var admin = require('../../utils/admin')

Page({
  data: {
    hasUpdate: false,
    updateReady: false,
    buildTime: '',
    contact: 'flyzccboard@yeah.net',
    uid: '476200',
    aboutData: {
      appName: '洛手助手洛手助手',
      version: wx.getStorageSync('about_version') || '',
      devName: '浙里本杰明',
      devAvatar: '/images/avatar.jpg',
      uid: '476200',
      contact: 'flyzccboard@yeah.net',
      icp: '浙ICP备2026043884号',
      gifts: ['免费领一测、二测、三测鸭蛋', '赐福奇袭固执罗隐'],
      platforms: [
        { name: 'QQ音乐/网易云', url: 'https://music.163.com/' },
        { name: 'B站/微博/抖音/快手/小红书/腾讯/YouTube', url: 'https://www.bilibili.com/' }
      ]
    },
    editMode: '',
    showModal: false,
    platformName: '',
    platformUrl: '',
    changelogList: [
      {
        version: '1.0.4',
        date: '2026-06-22',
        content: '新增：全局页面渐入动效体验\n优化：倒计时数据局部渲染，大幅提高性能\n优化：页面按钮和卡片增加物理点击反馈\n优化：启用分包静默预下载，实现多页面秒开'
      }
    ],
    showChangelogModal: false,
    changelogVersion: '',
    changelogDate: '',
    changelogContent: '',
    changelogEditIndex: -1,
    changelogSaving: false
  },
  onLoad() {
    if (wx.cloud) db = wx.cloud.database()
  },
  onShow() {
    var self = this
    var n = new Date()
    self.setData({
      buildTime: n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0')
    })
    self.loadAboutData()
    self.checkAdmin()
    self.checkUpdate()
  },
  parseChangelog(content) {
    if (!content) return []
    var lines = content.split('\n')
    var result = []
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue
      var type = 'opt'
      if (line.indexOf('新增：') === 0 || line.indexOf('+') === 0) {
        type = 'add'
      } else if (line.indexOf('下线：') === 0 || line.indexOf('-') === 0) {
        type = 'del'
      } else if (line.indexOf('优化：') === 0 || line.indexOf('*') === 0) {
        type = 'opt'
      } else if (line.indexOf('修复：') === 0) {
        type = 'fix'
      }
      result.push({ text: line, type: type })
    }
    return result
  },
  loadAboutData() {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function(res) {
        var defaults = self.data.aboutData
        var cloudData = res.data || {}
        var merged = {}
        for (var key in defaults) {
          if (key === 'gifts' || key === 'platforms') {
            merged[key] = cloudData[key] || defaults[key]
          } else {
            merged[key] = cloudData[key] !== undefined ? cloudData[key] : defaults[key]
          }
        }
        var changelogList = cloudData.changelogList || []
        for (var i = 0; i < changelogList.length; i++) {
          changelogList[i].lines = self.parseChangelog(changelogList[i].content || '')
        }
        self.setData({ 
          aboutData: merged,
          changelogList: changelogList,
          changelogLines: self.parseChangelog(merged.changelogContent || self.data.defaultChangelog)
        })
        if (merged.version) wx.setStorageSync('about_version', merged.version);
        if (cloudUrl.isCloudUrl(merged.devAvatar)) {
          cloudUrl.convertList([merged], 'devAvatar', function(converted) {
            self.setData({ 'aboutData.devAvatar': converted[0].devAvatar })
          })
        }
      })
      .catch(function(e) { console.error(e) })
  },
  checkAdmin() {
    var self = this
    admin.checkAdmin(self, function(isAdmin) {
      if (isAdmin) self.setData({ isAdmin: true })
    })
  },
  checkUpdate() {
    var self = this
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          self.setData({ hasUpdate: true })
        }
      })
      updateManager.onUpdateReady(function () {
        self.setData({ updateReady: true })
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用以应用更新？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        wx.showToast({ title: '新版本下载失败，请稍后重试', icon: 'none' })
      })
    }
  },
  triggerUpdate() {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.applyUpdate()
    }
  },
  manualCheckUpdate() {
    if (this.data.updateReady) {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否马上重启小程序？',
        success: function (res) {
          if (res.confirm) {
            wx.getUpdateManager().applyUpdate()
          }
        }
      })
    } else if (this.data.hasUpdate) {
      wx.showToast({ title: '新版本正在下载中，请稍后', icon: 'none' })
    } else {
      wx.showToast({ title: '当前已是最新版本', icon: 'none' })
    }
  },
  onEdit(e) {
    if (!this.data.isAdmin) return
    var field = e.currentTarget.dataset.field
    var value = e.currentTarget.dataset.value || ''
    var title = field === 'devName' ? '编辑开发者名称' : field === 'uid' ? '编辑UID' : field === 'version' ? '编辑版本号' : '编辑邮箱'
    this.setData({ showModal: true, editingField: field, editValue: value, editModalTitle: title, editMode: 'field' })
  },
  addGift() {
    this.setData({ showModal: true, editingField: 'gift', editValue: '', editModalTitle: '添加福利', editMode: 'addGift' })
  },
  deleteGift(e) {
    var self = this
    var idx = e.currentTarget.dataset.idx
    var gifts = (self.data.aboutData.gifts || []).slice()
    gifts.splice(idx, 1)
    self.setData({ 'aboutData.gifts': gifts })
    self.saveGifts(gifts)
  },
  saveGifts(gifts) {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: { gifts: gifts, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('about_config').add({ data: { _id: 'main', gifts: gifts, updateTime: db.serverDate() } })
      })
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  addPlatform() {
    this.setData({
      showModal: true,
      editingField: 'platform',
      platformName: '',
      platformUrl: '',
      editModalTitle: '添加应用平台',
      editMode: 'addPlatform'
    })
  },
  deletePlatform(e) {
    var self = this
    var idx = e.currentTarget.dataset.idx
    var platforms = (self.data.aboutData.platforms || []).slice()
    platforms.splice(idx, 1)
    self.setData({ 'aboutData.platforms': platforms })
    self.savePlatforms(platforms)
  },
  savePlatforms(platforms) {
    var self = this
    if (!db) return
    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: { platforms: platforms, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('about_config').add({ data: { _id: 'main', platforms: platforms, updateTime: db.serverDate() } })
      })
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' })
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  onPlatformNameInput(e) {
    this.setData({ platformName: e.detail.value })
  },
  onPlatformUrlInput(e) {
    this.setData({ platformUrl: e.detail.value })
  },
  copyPlatformUrl(e) {
    var item = e.currentTarget.dataset.item
    wx.setClipboardData({
      data: item.url,
      success() {
        wx.showToast({ title: '平台链接已复制', icon: 'success' })
      }
    })
  },
  onEditInput(e) {
    this.setData({ editValue: e.detail.value })
  },
  saveEdit() {
    var self = this
    if (self.data.submitting) return
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    self.setData({ submitting: true })

    if (self.data.editMode === 'addPlatform') {
      var name = (self.data.platformName || '').trim()
      var url = (self.data.platformUrl || '').trim()
      if (!name || !url) {
        wx.showToast({ title: '名称或链接不能为空', icon: 'none' })
        self.setData({ submitting: false })
        return
      }
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        wx.showToast({ title: '链接以http://或https://开头', icon: 'none' })
        self.setData({ submitting: false })
        return
      }
      var platforms = (self.data.aboutData.platforms || []).concat([{ name: name, url: url }])
      self.setData({ 'aboutData.platforms': platforms })
      self.savePlatforms(platforms)
      self.setData({ submitting: false, showModal: false })
      return
    }

    var value = self.data.editValue ? self.data.editValue.trim() : ''
    if (!value) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      self.setData({ submitting: false })
      return
    }

    if (self.data.editMode === 'addGift') {
      var gifts = (self.data.aboutData.gifts || []).concat([value])
      self.setData({ 'aboutData.gifts': gifts })
      self.saveGifts(gifts)
      self.setData({ submitting: false, showModal: false })
      return
    }

    var updateData = {}
    updateData[self.data.editingField] = value
    updateData.updateTime = db.serverDate()

    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: updateData })
      })
      .catch(function() {
        updateData._id = 'main'
        return db.collection('about_config').add({ data: updateData })
      })
      .then(function() {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadAboutData()
      })
      .catch(function(err) {
        console.error('保存失败详情:', err)
        self.setData({ submitting: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  closeModal() {
    this.setData({ showModal: false })
  },
  preventClose: function() {},
  
  // 更新日志管理
  openChangelogModal() {
    var today = new Date()
    var dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
    this.setData({
      showChangelogModal: true,
      changelogEditIndex: -1,
      changelogVersion: '',
      changelogDate: dateStr,
      changelogContent: ''
    })
  },
  editChangelog(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.changelogList[index]
    if (!item) return
    this.setData({
      showChangelogModal: true,
      changelogEditIndex: index,
      changelogVersion: item.version || '',
      changelogDate: item.date || '',
      changelogContent: item.content || ''
    })
  },
  closeChangelogModal() {
    this.setData({ showChangelogModal: false, changelogEditIndex: -1 })
  },
  onChangelogVersionInput(e) {
    this.setData({ changelogVersion: e.detail.value })
  },
  onChangelogDateChange(e) {
    this.setData({ changelogDate: e.detail.value })
  },
  onChangelogContentInput(e) {
    this.setData({ changelogContent: e.detail.value })
  },
  deleteChangelog(e) {
    var self = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除日志',
      content: '确定删除这条更新日志吗？',
      success: function(res) {
        if (res.confirm) {
          var list = self.data.changelogList.slice()
          list.splice(index, 1)
          self.saveChangelogList(list)
        }
      }
    })
  },
  saveChangelog() {
    var self = this
    if (self.data.changelogSaving) return
    var version = (self.data.changelogVersion || '').trim()
    var date = self.data.changelogDate
    var content = (self.data.changelogContent || '').trim()
    if (!version) {
      wx.showToast({ title: '请输入版本号', icon: 'none' })
      return
    }
    if (!date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    if (!content) {
      wx.showToast({ title: '请输入更新内容', icon: 'none' })
      return
    }
    self.setData({ changelogSaving: true })
    var list = self.data.changelogList.slice()
    var entry = { version: version, date: date, content: content }
    if (self.data.changelogEditIndex >= 0) {
      list[self.data.changelogEditIndex] = entry
    } else {
      list.unshift(entry)
    }
    self.saveChangelogList(list, function() {
      self.setData({ changelogSaving: false, showChangelogModal: false })
    })
  },
  saveChangelogList(list, callback) {
    var self = this
    if (!db) return
    for (var i = 0; i < list.length; i++) {
      list[i].lines = self.parseChangelog(list[i].content || '')
    }
    db.collection('about_config').doc('main').get()
      .then(function() {
        return db.collection('about_config').doc('main').update({ data: { changelogList: list, updateTime: db.serverDate() } })
      })
      .catch(function() {
        return db.collection('about_config').add({ data: { _id: 'main', changelogList: list, updateTime: db.serverDate() } })
      })
      .then(function() {
        self.setData({ changelogList: list })
        wx.showToast({ title: '已保存', icon: 'success' })
        if (callback) callback()
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' })
        self.setData({ changelogSaving: false })
      })
  },
  
  copyEmail() { wx.setClipboardData({ data: this.data.aboutData?.contact || this.data.contact, success() { wx.showToast({ title: '已复制', icon: 'success' }) } }) },
  copyUID() { wx.setClipboardData({ data: this.data.aboutData?.uid || this.data.uid, success() { wx.showToast({ title: '已复制', icon: 'success' }) } }) },
  onFeedback() {
    wx.showActionSheet({
      itemList: ['官方日志意见反馈 (自动跳转)', '复制开发者邮箱地址', '发送邮件反馈'],
      success: (res) => {
        if (res.tapIndex === 0) {
          var feedbackUrl = 'https://mp.weixin.qq.com/wxawap/wapreportwxadevlog?action=complain_feedback&appid=wxeddd39c667edfd84&embeddedappid=&hostappid=&pageid=&from=1&version_type=0&version_code=0&screenshot_localId=weixin%3A%2F%2Fresourceid%2F7d21fd11e29bb065c2f4c7669d7ff296&sessionid=&business_appid=&msgid=bab280da20e4d9f3d51d6203300fb1b1&public_lib_version=&public_lib_version_str=&template_id=ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs&roomId=#wechat_redirect'
          
          wx.navigateTo({
            url: '/pages/webview/webview?url=' + encodeURIComponent(feedbackUrl),
            fail: function() {
              // 自动跳转失败时（如本地开发者工具校验限制），降级为复制链接
              wx.setClipboardData({
                data: feedbackUrl,
                success() {
                  wx.showModal({
                    title: '反馈链接已复制',
                    content: '直接跳转失败。专属反馈链接已复制到您的剪贴板，您可以在微信聊天框中粘贴发送并点击打开。',
                    showCancel: false
                  })
                }
              })
            }
          })
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({ data: 'flyzccboard@yeah.net', success() { wx.showToast({ title: '邮箱已复制', icon: 'success' }) } })
        } else if (res.tapIndex === 2) {
          wx.setClipboardData({ data: 'flyzccboard@yeah.net', success() {
            wx.showModal({
              title: '发送邮件',
              content: '邮箱地址已复制到剪贴板\n\n请打开邮箱App，新建邮件发送至：\nflyzccboard@yeah.net',
              confirmText: '我知道了',
              showCancel: false
            })
          }})
        }
      }
    })
  },
  onShareAppMessage() { return { title: '洛手助手洛手助手', path: '/pages/index/index', imageUrl: '/images/banner1.png' } },
  onShareTimeline() { return { title: '洛手助手洛手助手 - 洛克王国攻略工具', imageUrl: '/images/banner1.png' } }
})