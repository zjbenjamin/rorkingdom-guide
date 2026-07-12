const app = getApp()
var db = null

Page({
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
      desc: '',
      status: 0 // 0: unstarted/draft, 1: published/upcoming, 2: active
    }
  },
  onLoad: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadLocationOptions()
    this.loadSwarms()
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
      var currentOpenid = res.result.openid || res.result.userInfo.openId
      db.collection('admin_config').doc('admin').get()
        .then(function(adminRes) {
          if (adminRes.data.openid === currentOpenid) {
            wx.setStorageSync('is_admin_user', true)
            self.setData({ isAdmin: true })
          } else {
            wx.removeStorageSync('is_admin_user')
            self.setData({ isAdmin: false })
          }
        }).catch(function() {})
    }).catch(function() {})
  },
  loadLocationOptions: function() {
    var self = this
    if (!db) return
    db.collection('page_config').doc('swarm').get().then(function(res) {
      if (res.data && res.data.locations) {
        self.setData({ locationOptions: res.data.locations })
      }
    }).catch(function() {})
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
        // compute status
        var startStr = item.startDate ? item.startDate.replace(/-/g, '/') + ' ' + (item.startTime || '00:00:00') : null
        var endStr = item.endDate ? item.endDate.replace(/-/g, '/') + ' ' + (item.endTime || '23:59:59') : null
        var start = startStr ? new Date(startStr) : new Date(0)
        var end = endStr ? new Date(endStr) : new Date(8640000000000000)
        
        if (now >= start && now <= end) {
          item.statusInfo = { statusClass: 'status-active', statusText: '出没中' }
          active.push(item)
        } else if (now < start) {
          item.statusInfo = { statusClass: 'status-upcoming', statusText: '未开始' }
          upcoming.push(item)
        } else {
          item.statusInfo = { statusClass: 'status-ended', statusText: '已结束' }
          // We can push to upcoming for admin to see, or a separate ended list.
          if (self.data.isAdmin) {
             upcoming.push(item)
          }
        }
      })
      
      self.setData({ activeSwarms: active, upcomingSwarms: upcoming })
    }).catch(function() {})
  },
  
  // Modal handlers
  openAddModal: function() {
    this.setData({
      showModal: true,
      editingId: null,
      editingIndex: null,
      editingSource: '',
      form: { name: '', location: '', startDate: '', startTime: '', endDate: '', endTime: '', image: '', desc: '', status: 0 },
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
        desc: item.desc || '',
        status: item.status || 0
      }
    })
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
    if (src) {
      wx.previewImage({ urls: [src] })
    }
  },
  
  saveFormOnly: function() {
    this._doSave(false)
  },
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
    
    var dataToSave = {
      name: (f.name || '').trim(),
      location: (f.location || '').trim(),
      startDate: f.startDate || '',
      startTime: f.startTime || '',
      endDate: f.endDate || '',
      endTime: f.endTime || '',
      image: (f.image || '').trim(),
      desc: (f.desc || '').trim(),
      status: publish ? 1 : 0,
      updateTime: db.serverDate()
    }
    
    var promise
    if (self.data.editingId) {
      promise = db.collection('swarms').doc(self.data.editingId).update({ data: dataToSave })
    } else {
      dataToSave.createTime = db.serverDate()
      promise = db.collection('swarms').add({ data: dataToSave })
    }
    
    promise.then(function() {
      self.setData({ saving: false, showModal: false })
      wx.showToast({ title: '保存成功', icon: 'success' })
      self.loadSwarms()
    }).catch(function(err) {
      self.setData({ saving: false })
      wx.showModal({ title: '保存失败', content: err.message || JSON.stringify(err), showCancel: false })
    })
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
  }
})
