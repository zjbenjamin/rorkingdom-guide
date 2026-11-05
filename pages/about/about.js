var app = getApp()
var db = null
var cloudUrl = require('../../utils/cloudUrl')
var admin = require('../../utils/admin')
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')

var todayStr = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')

var defaultChangelog = [
  { version: '2.1.0', date: todayStr, content: '【新增】活动日历「活动倒计时」板块：赛季时间轴 + 活动实时倒计时，仿官方日历海报风\n【新增】管理后台赛季日历：支持「版本周期性活动 / 大量出没 / 命定花种 / 常驻课题」四大分类，命定花种支持添加多组图片URL并同步展示\n【新增】数据联动：活动日历、大量出没、首页广播站与后台捕捉预设绑定，自动匹配精灵多图/图标并按倒计时日期实时同步\n【新增】咕噜球仓库配置：合成球支持可选消耗洛克贝（可填合成洛克贝单价）并同步至捕捉统计页面入库与结算\n【调整】捕捉统计：「月陨星」改为「龙骑士」，「月陨流星雨」改为「龙龙骰」（点击可自选词条骰子/异色骰子，剩余面板仅计入异色龙龙骰，可累计至2026-12-31，不占用保底和奇遇）\n【新增】捕捉统计：「这次歪了」改为「使用龙龙骰」，配备全屏骰子翻转与粒子动效；支持异色龙龙骰染色并在战报生成图中明示剩余龙龙骰数量，与棱镜球等契约球双胶囊自适应防溢出排版\n【优化】捕捉统计：洛克贝资产看板「资产微调」改为「现有资产」，展示上一次与本次输入洛克贝数值并自动计算增加值与减少值\n【优化】后台捕捉预设：异色精灵预设置顶，按赛季分类切换展示，支持精灵置顶、多图URL录入与赛季暂时隐藏\n【优化】活动日历：默认展示「进行中」活动并默认收起卡片，修复时间轴文字显示不全问题\n【新增】视频号链接识别：分享文案自动提取标题与作者，点击引导复制到微信观看\n【优化】更新用户服务协议与隐私保护指引\n更新：版号 2.1.0' },
  { version: '2.0.1', date: todayStr, content: '【修复】管理员新增/编辑兑换码弹窗错位，输入框叠在列表卡片上\n【修复】兑换码弹窗被底部 Dock 盖住、键盘弹出挡住按钮\n【修复】BV 号无法识别（大小写、空格、分享文案混杂均可解析）\n【优化】粘贴分享文案自动去掉多余文字与空格，抽出干净 BV 号/链接\n【优化】b23.tv 短链跳转后自动识别 BV 号\n更新：版号 2.0.1' },
  { version: '2.0.0', date: todayStr, content: '【新增】安卓 Pad 平板排版：顶栏/Dock/弹窗/网格专项适配，比例不再被拉爆\n【新增】我的页 Pad 模式切换：自动 / 平板 / 手机，即时生效并记住选择\n【新增】远行商人商品库支持预设限售数量，上架时自动带上\n【优化】快捷选择上架可批量填写限售数量，商品卡片显示「限N」\n【优化】上架/改期时间自动识别四个时段（08-12 / 12-16 / 16-20 / 20-24）\n【优化】弹窗改为居中卡片，富文本工具栏不再挤占输入区\n【修复】平板下顶栏文字逐字竖排、Dock 图标过大遮挡内容\n更新：版号 2.0.0' },
  { version: '1.9.0', date: todayStr, content: '【新增】远行商人上架商品自动匹配下架日期与时段（按游戏内日程）\n【优化】管理后台编辑器：工具栏按格式/插入分区，块支持上移下移\n【优化】插入图片/音乐/视频前自动落稿，正文顺序与所见一致\n【优化】编辑中的块改完插回原位，不再沉到文末\n【优化】首页远行商人卡片去掉底栏重复倒计时（商品行已有倒计时）\n【新增】公告/活动草稿自动保存，误关弹窗可恢复\n【修复】咕噜球库存为 0 仍显示卡片（仓库列表与盘点/结果弹窗）\n【修复】编辑器残留上次内容、开始/结束时间未保存、旧公告内容重复入块\n【修复】引用块编辑丢类型、删除块误清正在输入的文字\n更新：版号 1.9.0' },
  { version: '1.8.3', date: todayStr, content: '【新增】首页 ROCOKINGDOM 广播站：出没 / 商人上架同步\n【新增】广播站商品图、限售数量、下架倒计时，点开看简介\n【新增】首页头图多图自动轮播（后台页面管理编辑）\n【新增】CNY 按语言换算当地货币，时间按语言国家时区\n【新增】月陨流星雨可选是否异色\n【新增】关于页数据来源官方 Logo\n【优化】全局轻量过渡动画（低内存）\n【优化】远行商人洛克贝图标，生图与仓库展示\n【优化】仓库只显示手动入库的球\n【优化】国际版英日韩用词与国旗图\n【修复】页面状态管理按钮、通知设置可点击\n【修复】广播站空商品误显示、倒计时与商人页同步\n更新：版号 1.8.3' },
  { version: '1.8.2', date: todayStr, content: '【修复】管理后台新增球在捕捉统计中丢失（保存合并云端、库存按名称兜底）\n【修复】球卡片展开高度不齐，简介改为框内滑动\n更新：版号 1.8.2' },
  { version: '1.8.1', date: todayStr, content: '【新增】咕噜球 CNY 与洛克贝价格分离，可独立填写\n【新增】合成/特殊球支持「活动」获取（默认免费）\n【新增】大量出没双形态卡片，可左右滑动\n【新增】大量出没预设时间到点自动推送（发布推、保存不推）\n【优化】生成图总盈亏洛克贝标识\n【优化】公告多图完整比例展示，无背景框与指示点\n【修复】活动页联动 Logo 丢失、视频卡片变纯链接\n【修复】视频播放器标题/简介截断' },
  { version: '1.8.0', date: todayStr, content: '更新：隐私政策与用户协议\n优化：更新日志仅保留较近版本\n更新：版号 1.8.0' }
]

Page({
  behaviors: [i18nBehavior, require('../../utils/padLayoutBehavior')],
  data: {
    hasUpdate: false,
    updateReady: false,
    buildTime: '',
    contact: 'flyzccboard@yeah.net',
    uid: '476200',
    isAdmin: false,
    showLogShareBtn: true,
    aboutData: {
      appName: '洛手助手',
      version: i18n.i18n.zh.version || 'v2.1.0',
      versionNote: i18n.i18n.zh.versionNote || '',
      devName: '浙里本杰明',
      devAvatar: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEYA3JqaA4lW5JDNpmiDiR7kV6jjeMAAW0AAscgAAKo-ElXhfFJA7eEXyo9BA.jpeg',
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
    changelogList: [],
    showChangelogModal: false,
    changelogVersion: '',
    changelogDate: '',
    changelogContent: '',
    changelogEditIndex: -1,
    changelogSaving: false
  },
  onLoad() {
    this._refreshI18n()
    if (wx.cloud) db = wx.cloud.database()
    try { wx.removeStorageSync('about_version') } catch(e) {}
  },
  onShow() {
    var self = this
    var n = new Date()
    var showLogShareBtn = wx.getStorageSync('show_log_share_btn')
    if (showLogShareBtn === '') showLogShareBtn = true
    self.setData({
      showLogShareBtn: showLogShareBtn !== false,
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
      if (line.indexOf('新增：') === 0 || line.indexOf('【新增】') === 0 || line.indexOf('+') === 0) {
        type = 'add'
      } else if (line.indexOf('下线：') === 0 || line.indexOf('【下线】') === 0 || line.indexOf('-') === 0) {
        type = 'del'
      } else if (line.indexOf('优化：') === 0 || line.indexOf('【优化】') === 0 || line.indexOf('【调整】') === 0 || line.indexOf('*') === 0) {
        type = 'opt'
      } else if (line.indexOf('修复：') === 0 || line.indexOf('【修复】') === 0) {
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
          if (key === 'version') {
            merged[key] = i18n.i18n.zh.version || defaults[key]
          } else if (key === 'versionNote') {
            merged[key] = i18n.i18n.zh.versionNote || defaults[key]
          } else if (key === 'gifts' || key === 'platforms') {
            merged[key] = cloudData[key] || defaults[key]
          } else {
            merged[key] = cloudData[key] !== undefined ? cloudData[key] : defaults[key]
          }
        }
        // 云端已有 changelogList（含删空）则以云端为准；若本地 defaultChangelog 首条为新版本则自动置顶合并
        var changelogList = (cloudData.changelogList !== undefined && cloudData.changelogList !== null)
          ? cloudData.changelogList.slice()
          : defaultChangelog.slice()
        if (defaultChangelog.length > 0) {
          var latestDefault = defaultChangelog[0]
          var existsLatest = false
          for (var ci = 0; ci < changelogList.length; ci++) {
            if (changelogList[ci] && changelogList[ci].version === latestDefault.version) {
              changelogList[ci] = Object.assign({}, changelogList[ci], { content: latestDefault.content })
              existsLatest = true
              break
            }
          }
          if (!existsLatest) {
            changelogList.unshift(Object.assign({}, latestDefault))
          }
        }
        for (var i = 0; i < changelogList.length; i++) {
          changelogList[i].lines = self.parseChangelog(changelogList[i].content || '')
        }
        self.setData({ 
          aboutData: merged,
          changelogList: changelogList,
          changelogLines: self.parseChangelog(merged.changelogContent || self.data.defaultChangelog)
        })
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
  toggleShowLogShareBtn() {
    var newVal = !this.data.showLogShareBtn
    wx.setStorageSync('show_log_share_btn', newVal)
    this.setData({ showLogShareBtn: newVal })
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
  onShareAppMessage() { return { title: '洛手助手洛手助手', path: '/pages/index/index', imageUrl: '/images/banner.webp' } },
  onShareTimeline() { return { title: '洛手助手洛手助手 - 洛克王国攻略工具', imageUrl: '/images/banner.webp' } }
})