const app = getApp()
var db = null
var notify = require('../../utils/notify')
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')

Page({
  behaviors: [i18nBehavior],
  data: {
    isAdmin: false,
    subscribed: false,
    activeSwarms: [],
    upcomingSwarms: [],
    showModal: false,
    editingId: null,
    editingIndex: null,
    editingSource: '',
    locationOptions: [],
    saving: false,
    canPublish: false,
    form: {
      name: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      image: '',
      imagesText: '',
      form1Label: '',
      form1Image: '',
      form1Note: '',
      form2Label: '',
      form2Image: '',
      form2Note: '',
      desc: '',
      status: 0
    }
  },
  onLoad: function() {
    this._refreshI18n()
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadLocationOptions()
    this.loadSwarms()
    var self = this
    notify.getSubscriptionStatus(function(err, status) {
      if (status && status.announcement) {
        self.setData({ subscribed: true })
      }
    })
  },
  onShow: function() {
    if (wx.cloud && !db) db = wx.cloud.database()
  },
  checkAdmin: function() {
    var self = this
    if (!wx.cloud) return
    if (wx.getStorageSync('is_admin_user')) {
      self.setData({ isAdmin: true })
    }
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var currentOpenid = res.result.openid || (res.result.userInfo && res.result.userInfo.openId)
      db.collection('admin_config').doc('admin').get()
        .then(function(adminRes) {
          if (adminRes.data.openid === currentOpenid) {
            wx.setStorageSync('is_admin_user', true)
            self.setData({ isAdmin: true })
          } else {
            wx.removeStorageSync('is_admin_user')
            self.setData({ isAdmin: false })
          }
        }).catch(function(e) { console.error(e) })
    }).catch(function(e) { console.error(e) })
  },
  loadLocationOptions: function() {
    var self = this
    if (!db) return
    db.collection('swarm_config').doc('locations').get().then(function(res) {
      if (res.data && res.data.locations) {
        self.setData({ locationOptions: res.data.locations })
      }
    }).catch(function(e) { console.error(e) })
  },
  loadSwarms: function() {
    var self = this
    if (!db) return
    db.collection('swarms').orderBy('createTime', 'desc').limit(50).get().then(function(res) {
      var list = res.data || []
      var active = []
      var upcoming = []
      var now = new Date()
      
      list.forEach(function(item) {
        // 确保 images 和 forms 字段存在
        if (!item.images || !Array.isArray(item.images)) {
          item.images = item.image ? [item.image] : []
        }
        if (!item.forms || !Array.isArray(item.forms)) {
          item.forms = []
        }
        // compute status
        var startStr = item.startDate ? item.startDate.replace(/-/g, '/') + ' ' + (item.startTime || '00:00:00') : null
        var endStr = item.endDate ? item.endDate.replace(/-/g, '/') + ' ' + (item.endTime || '23:59:59') : null
        var start = startStr ? new Date(startStr) : new Date(0)
        var end = endStr ? new Date(endStr) : new Date(8640000000000000)
        
        if (now >= start && now <= end) {
          item.statusInfo = { statusClass: 'status-active', statusText: i18n.i18n[i18n.getLanguage()].swarmActive || '出没中' }
          active.push(item)
        } else if (now < start) {
          item.statusInfo = { statusClass: 'status-upcoming', statusText: i18n.i18n[i18n.getLanguage()].swarmUpcoming || '未开始' }
          upcoming.push(item)
        } else {
          item.statusInfo = { statusClass: 'status-ended', statusText: i18n.i18n[i18n.getLanguage()].countdownEnded || '已结束' }
          // We can push to upcoming for admin to see, or a separate ended list.
          if (self.data.isAdmin) {
             upcoming.push(item)
          }
        }
      })
      
      self.setData({ activeSwarms: active, upcomingSwarms: upcoming })
    }).catch(function(e) { console.error(e) })
  },
  
  // Modal handlers
  openAddModal: function() {
    this._editingOld = null
    this.setData({
      showModal: true,
      editingId: null,
      editingIndex: null,
      editingSource: '',
      form: { name: '', location: '', startDate: '', startTime: '', endDate: '', endTime: '', image: '', imagesText: '', form1Label: '', form1Image: '', form1Note: '', form2Label: '', form2Image: '', form2Note: '', desc: '', status: 0 },
      canPublish: false
    })
  },
  closeModal: function() {
    this.setData({ showModal: false })
  },
  preventClose: function() {},
  
  openEditModal: function(e) {
    var index = e.currentTarget.dataset.index
    var source = e.currentTarget.dataset.source
    var item = source === 'active' ? this.data.activeSwarms[index] : this.data.upcomingSwarms[index]
    var forms = (item.forms || []).map(function(f) {
      if (typeof f === 'string') return { label: f, image: '', note: '' }
      return { label: f.label || '', image: f.image || '', note: f.note || f.desc || '' }
    })
    this.setData({
      showModal: true,
      editingId: item._id,
      editingIndex: index,
      editingSource: source,
      form: {
        name: item.name || '',
        location: item.location || '',
        startDate: item.startDate || '',
        startTime: item.startTime || '',
        endDate: item.endDate || '',
        endTime: item.endTime || '',
        image: item.image || '',
        imagesText: (item.images && item.images.length > 0) ? item.images.join('\n') : (item.image || ''),
        form1Label: forms[0] ? forms[0].label : '',
        form1Image: forms[0] ? forms[0].image : '',
        form1Note: forms[0] ? forms[0].note : '',
        form2Label: forms[1] ? forms[1].label : '',
        form2Image: forms[1] ? forms[1].image : '',
        form2Note: forms[1] ? forms[1].note : '',
        desc: item.desc || '',
        status: item.status || 0
      }
    })
    this._editingOld = {
      startDate: item.startDate || '',
      startTime: item.startTime || '',
      status: item.status || 0,
      pushed: item.pushed
    }
    this.checkCanPublish()
  },
  
  // Form input handlers
  onFormInput: function(e) {
    var field = e.currentTarget.dataset.field
    var val = e.detail.value
    var form = this.data.form
    form[field] = val
    this.setData({ form: form })
    this.checkCanPublish()
  },
  onImagesTextInput: function(e) {
    var form = this.data.form
    form.imagesText = e.detail.value
    this.setData({ form: form })
  },
  onLocationChange: function(e) {
    var idx = e.detail.value
    var loc = this.data.locationOptions[idx]
    var form = this.data.form
    form.location = loc
    this.setData({ form: form })
    this.checkCanPublish()
  },
  onStartDateChange: function(e) {
    var form = this.data.form
    form.startDate = e.detail.value
    // If the selected startDate is later than the current endDate, auto-update endDate
    if (!form.endDate || form.startDate > form.endDate) {
      form.endDate = form.startDate
    }
    this.setData({ form: form })
    this.checkCanPublish()
  },
  onStartTimeChange: function(e) {
    var form = this.data.form
    form.startTime = e.detail.value
    this.setData({ form: form })
    this.checkCanPublish()
  },
  onEndDateChange: function(e) {
    var form = this.data.form
    form.endDate = e.detail.value
    this.setData({ form: form })
  },
  onEndTimeChange: function(e) {
    var form = this.data.form
    form.endTime = e.detail.value
    this.setData({ form: form })
  },
  checkCanPublish: function() {
    var f = this.data.form
    this.setData({ canPublish: !!(f.name.trim()) })
  },
  
  previewImage: function(e) {
    var src = e.currentTarget.dataset.src
    var urls = e.currentTarget.dataset.urls
    if (src) {
      wx.previewImage({ current: src, urls: urls && urls.length > 0 ? urls : [src] })
    }
  },
  
  // 保存：只写库，不推送
  saveFormOnly: function() {
    this._doSave(false)
  },
  // 发布：上线，并在预设时间到点（正在出没）后自动推送
  saveForm: function() {
    this._doSave(true)
  },

  _doSave: function(publish) {
    var self = this
    if (!self.data.canPublish && publish) return
    var f = self.data.form
    if (!f.name.trim()) {
      wx.showToast({ title: '请填写名称', icon: 'none' })
      return
    }

    self.setData({ saving: true })

    var imagesText = (f.imagesText || '').trim()
    var images = imagesText ? imagesText.split('\n').map(function(s){return s.trim()}).filter(function(s){return s}) : (f.image ? [f.image.trim()] : [])
    // 双形态：各自 label / image / note
    var forms = []
    if ((f.form1Label || '').trim() || (f.form1Image || '').trim() || (f.form1Note || '').trim()) {
      forms.push({
        label: (f.form1Label || '').trim(),
        image: (f.form1Image || '').trim(),
        note: (f.form1Note || '').trim()
      })
    }
    if ((f.form2Label || '').trim() || (f.form2Image || '').trim() || (f.form2Note || '').trim()) {
      forms.push({
        label: (f.form2Label || '').trim(),
        image: (f.form2Image || '').trim(),
        note: (f.form2Note || '').trim()
      })
    }
    // 形态图并入展示图列表（去重）
    for (var fi = 0; fi < forms.length; fi++) {
      if (forms[fi].image && images.indexOf(forms[fi].image) === -1) {
        images.push(forms[fi].image)
      }
    }

    // 保存 = 草稿（status 0），发布 = 上线（status 1）
    var dataToSave = {
      name: (f.name || '').trim(),
      location: (f.location || '').trim(),
      startDate: f.startDate || '',
      startTime: f.startTime || '',
      endDate: f.endDate || '',
      endTime: f.endTime || '',
      image: images[0] || '',
      images: images,
      forms: forms,
      desc: (f.desc || '').trim(),
      status: publish ? 1 : 0,
      updateTime: db.serverDate()
    }

    var promise
    if (self.data.editingId) {
      if (publish) {
        // 发布：开始时间变更或已到点时重置推送标记，到点/立即可推
        var old = self._editingOld || {}
        var oldStart = (old.startDate || '') + ' ' + (old.startTime || '')
        var newStart = (dataToSave.startDate || '') + ' ' + (dataToSave.startTime || '')
        var startTs = self._parseCnTime(dataToSave.startDate, dataToSave.startTime)
        var started = startTs ? Date.now() >= startTs : true
        if (oldStart !== newStart || started) {
          dataToSave.pushed = false
        }
      }
      // 保存不动 pushed，不触发推送
      promise = db.collection('swarms').doc(self.data.editingId).update({ data: dataToSave })
    } else {
      dataToSave.createTime = db.serverDate()
      if (publish) dataToSave.pushed = false
      promise = db.collection('swarms').add({ data: dataToSave })
    }

    promise.then(function() {
      self._editingOld = null
      self.setData({ saving: false, showModal: false })
      if (!publish) {
        wx.showToast({ title: '已保存（不推送）', icon: 'success' })
        self.loadSwarms()
        return
      }
      // 仅发布才检查/推送
      var startTs = self._parseCnTime(dataToSave.startDate, dataToSave.startTime)
      var started = startTs ? Date.now() >= startTs : true
      wx.showToast({ title: started ? '已发布，正在推送通知' : '已发布，到点自动推送', icon: 'success' })
      self.loadSwarms()
      if (started && wx.cloud) {
        wx.cloud.callFunction({ name: 'sendSubscribe', data: { checkSwarm: true } }).catch(function() {})
      }
    }).catch(function(err) {
      self.setData({ saving: false })
      wx.showModal({ title: '保存失败', content: err.message || JSON.stringify(err), showCancel: false })
    })
  },

  // 北京时间日期+时间 → 毫秒时间戳（与云函数口径一致）
  _parseCnTime: function(dateStr, timeStr) {
    if (!dateStr) return 0
    var s = dateStr.replace(/-/g, '/') + ' ' + (timeStr || '00:00:00')
    var parts = s.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/)
    if (!parts) return 0
    return Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4] - 8, +parts[5], +(parts[6] || 0))
  },
  
  deleteSwarm: function(e) {
    var self = this
    var index = e.currentTarget.dataset.index
    var source = e.currentTarget.dataset.source
    var item = source === 'active' ? this.data.activeSwarms[index] : this.data.upcomingSwarms[index]
    
    wx.showModal({
      title: '删除',
      content: '确定要删除这条记录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' })
          db.collection('swarms').doc(item._id).remove().then(function() {
            wx.hideLoading()
            wx.showToast({ title: '已删除', icon: 'success' })
            self.loadSwarms()
          }).catch(function() {
            wx.hideLoading()
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },
  
  toggleSubscribe: function() {
    var self = this
    notify.requestAndSave(['announcement'], function(err, result) {
      if (err) {
        if (!err.noConfig) {
          wx.showToast({ title: '订阅失败', icon: 'none' })
        }
        return
      }
      if (result && result.announcement === 'accept') {
        wx.showToast({ title: '订阅成功', icon: 'success' })
        self.setData({ subscribed: true })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '大量出没监控 - 洛克王国向导',
      path: '/pages/swarm/swarm'
    }
  },
  onShareTimeline: function () {
    return {
      title: '大量出没监控 - 洛克王国向导'
    }
  }

})
