const app = getApp()
var db = null
var notify = require('../../utils/notify')
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')
var cloudUrl = require('../../utils/cloudUrl')

Page({
  behaviors: [i18nBehavior, require('../../utils/padLayoutBehavior')],
  data: {
    isAdmin: false,
    subscribed: false,
    activeSwarms: [],
    upcomingSwarms: [],
    showModal: false,
    editingId: null,
    editingIndex: null,
    editingSource: '',
    formMode: 'single',
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
    this._startCountdownTimer()
  },
  onHide: function() {
    this._stopCountdownTimer()
  },
  onUnload: function() {
    this._stopCountdownTimer()
  },
  _startCountdownTimer: function() {
    var self = this
    self._stopCountdownTimer()
    self.updateCountdowns()
    self._countdownTimer = setInterval(function() {
      self.updateCountdowns()
    }, 1000)
  },
  _stopCountdownTimer: function() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer)
      this._countdownTimer = null
    }
  },
  // 绑定活动日历倒计时：出没中显示剩余倒计时，即将出没显示距开始倒计时
  updateCountdowns: function() {
    var now = Date.now()
    var activeList = this.data.activeSwarms || []
    var upcomingList = this.data.upcomingSwarms || []
    var changed = false
    var patch = {}
    if (activeList.length) {
      var nextActive = activeList.map(function(item) {
        var endTs = item.endTs || 0
        var text = ''
        if (endTs && endTs < 8000000000000000 && endTs > now) {
          text = i18n.formatCountdown(endTs - now, 'countdownRemain', 'countdownEnded') || ''
        }
        if (item.countdownText !== text) {
          changed = true
          return Object.assign({}, item, { countdownText: text })
        }
        return item
      })
      if (changed) patch.activeSwarms = nextActive
    }
    var upChanged = false
    if (upcomingList.length) {
      var nextUp = upcomingList.map(function(item) {
        var startTs = item.startTs || 0
        var text = ''
        if (startTs && startTs > now) {
          var prefix = (startTs - now) < 86400000 ? 'countdownOnline' : 'countdownToStart'
          text = i18n.formatCountdown(startTs - now, prefix, 'countdownEnded') || ''
        }
        if (item.countdownText !== text) {
          upChanged = true
          return Object.assign({}, item, { countdownText: text })
        }
        return item
      })
      if (upChanged) {
        changed = true
        patch.upcomingSwarms = nextUp
      }
    }
    if (changed) this.setData(patch)
  },
  // 点击精灵卡片展开/收起简介
  toggleDesc: function(e) {
    var source = e.currentTarget.dataset.source
    var index = Number(e.currentTarget.dataset.index)
    var key = source === 'active' ? 'activeSwarms' : 'upcomingSwarms'
    var list = this.data[key]
    if (!list || !list[index]) return
    list[index].descExpanded = !list[index].descExpanded
    var patch = {}
    patch[key] = list
    this.setData(patch)
  },
  noop: function() {},
  onFormModeChange: function(e) {
    this.setData({ formMode: e.currentTarget.dataset.mode || 'single' })
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
  _parseCalDay: function(str) {
    var m = String(str || '').match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/)
    if (!m) return null
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10))
  },
  _matchPresetPet: function(title, pets) {
    if (!title || !pets || !pets.length) return null
    var t = String(title).trim()
    if (!t) return null
    var tClean = t.replace(/^异色/, '').trim()
    for (var i = 0; i < pets.length; i++) {
      var pName = String(pets[i].name || '').trim()
      if (!pName) continue
      if (pName === t || pName.replace(/^异色/, '').trim() === tClean) return pets[i]
    }
    for (var j = 0; j < pets.length; j++) {
      var pName2 = String(pets[j].name || '').trim()
      var pClean2 = pName2.replace(/^异色/, '').trim()
      if (!pClean2) continue
      if (tClean.indexOf(pClean2) !== -1 || pClean2.indexOf(tClean) !== -1) return pets[j]
    }
    return null
  },
  _matchSwarmDoc: function(title, swarmDocs) {
    if (!title || !swarmDocs || !swarmDocs.length) return null
    var t = String(title).trim().replace(/^异色/, '').trim()
    if (!t) return null
    for (var i = 0; i < swarmDocs.length; i++) {
      var sName = String(swarmDocs[i].name || '').trim().replace(/^异色/, '').trim()
      if (!sName) continue
      if (sName === t || sName.indexOf(t) !== -1 || t.indexOf(sName) !== -1) return swarmDocs[i]
    }
    return null
  },
  loadSwarms: function() {
    var self = this
    if (!db) return
    var pSwarms = db.collection('swarms').orderBy('createTime', 'desc').limit(50).get().catch(function() { return { data: [] } })
    var pSeasons = db.collection('calendar_seasons').orderBy('start', 'desc').limit(20).get().catch(function() { return { data: [] } })
    var pPets = db.collection('site_config').doc('shiny_pets').get().catch(function() { return null })

    Promise.all([pSwarms, pSeasons, pPets]).then(function(results) {
      var swarmDocs = (results[0] && results[0].data) || []
      var seasons = (results[1] && results[1].data) || []
      var petRes = results[2]
      var presetPets = (petRes && petRes.data && petRes.data.pets) ? petRes.data.pets : (wx.getStorageSync('shiny_pets') || [])

      var now = new Date()
      var chosenSeason = null
      var bestSeason = null
      for (var sIdx = 0; sIdx < seasons.length; sIdx++) {
        var sd = self._parseCalDay(seasons[sIdx].start)
        var ed = self._parseCalDay(seasons[sIdx].end)
        if (!sd || !ed) continue
        var edLast = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 23, 59, 59)
        if (now >= sd && now <= edLast) { chosenSeason = seasons[sIdx]; break }
        var diff = Math.abs(sd - now)
        if (!bestSeason || diff < bestSeason.diff) bestSeason = { diff: diff, s: seasons[sIdx] }
      }
      if (!chosenSeason && bestSeason) chosenSeason = bestSeason.s

      var calSpawnItems = []
      if (chosenSeason && Array.isArray(chosenSeason.items)) {
        for (var cIdx = 0; cIdx < chosenSeason.items.length; cIdx++) {
          var cit = chosenSeason.items[cIdx]
          if (cit && cit.group === 'spawn' && cit.title && cit.start) {
            calSpawnItems.push(cit)
          }
        }
      }

      var list = []
      if (calSpawnItems.length > 0) {
        // 优先绑定活动日历倒计时里的「大量出没」排期 + 管理后台捕捉预设精灵图
        for (var k = 0; k < calSpawnItems.length; k++) {
          var calIt = calSpawnItems[k]
          var matchedPet = self._matchPresetPet(calIt.title, presetPets)
          var matchedDoc = self._matchSwarmDoc(calIt.title, swarmDocs)
          var iconUrls = []
          if (Array.isArray(calIt.icons) && calIt.icons.length) {
            iconUrls = calIt.icons.filter(Boolean)
          } else if (Array.isArray(calIt.images) && calIt.images.length) {
            iconUrls = calIt.images.filter(Boolean)
          } else if (calIt.icon) {
            iconUrls = [calIt.icon]
          }
          if (!iconUrls.length && matchedPet) {
            if (Array.isArray(matchedPet.imgs) && matchedPet.imgs.length) iconUrls = matchedPet.imgs.filter(Boolean)
            else if (matchedPet.img) iconUrls = [matchedPet.img]
          }
          if (!iconUrls.length && matchedDoc) {
            if (Array.isArray(matchedDoc.images) && matchedDoc.images.length) iconUrls = matchedDoc.images.filter(Boolean)
            else if (matchedDoc.image) iconUrls = [matchedDoc.image]
          }
          var baseObj = matchedDoc ? Object.assign({}, matchedDoc) : {
            _id: '',
            id: 'cal_spawn_' + k,
            location: '大世界',
            forms: [],
            desc: ''
          }
          baseObj.id = baseObj._id || ('cal_spawn_' + k)
          baseObj.name = calIt.title
          baseObj.startDate = calIt.start
          baseObj.endDate = calIt.end || (chosenSeason && chosenSeason.end) || ''
          baseObj.startTime = baseObj.startTime || '00:00'
          baseObj.endTime = baseObj.endTime || '23:59'
          if (iconUrls.length) {
            baseObj.image = iconUrls[0]
            baseObj.images = iconUrls
          }
          baseObj.fromCalendar = true
          list.push(baseObj)
        }
      } else {
        list = swarmDocs.map(function(d) {
          var copy = Object.assign({}, d)
          var matchedPet = self._matchPresetPet(copy.name, presetPets)
          if (matchedPet && !copy.image && matchedPet.img) {
            copy.image = matchedPet.img
          }
          return copy
        })
      }

      cloudUrl.convertList(list, ['image', 'images'], function(convertedList) {
        var finalList = convertedList || list
        var active = []
        var upcoming = []
        var nowMs = now.getTime()

        finalList.forEach(function(item) {
          if (!item.images || !Array.isArray(item.images) || !item.images.length) {
            item.images = item.image ? [item.image] : []
          } else if (item.image && item.images[0] !== item.image) {
            item.images[0] = item.image
          }
          if (!item.forms || !Array.isArray(item.forms)) {
            item.forms = []
          }
          item.forms = item.forms.map(function(f) {
            if (typeof f === 'string') {
              return { label: f, image: '', note: '', isShiny: f.indexOf('异色') >= 0 }
            }
            var label = f.label || ''
            return {
              label: label,
              image: f.image || '',
              note: f.note || f.desc || '',
              isShiny: label.indexOf('异色') >= 0
            }
          })
          var startStr = item.startDate ? item.startDate.replace(/-/g, '/') + ' ' + (item.startTime || '00:00:00') : null
          var endStr = item.endDate ? item.endDate.replace(/-/g, '/') + ' ' + (item.endTime || '23:59:59') : null
          var start = startStr ? new Date(startStr) : new Date(0)
          var end = endStr ? new Date(endStr) : new Date(8640000000000000)
          item.startTs = start.getTime()
          item.endTs = end.getTime()
          item.countdownText = ''
          item.descExpanded = false

          if (now >= start && now <= end) {
            item.statusInfo = { statusClass: 'status-active', statusText: i18n.i18n[i18n.getLanguage()].swarmActive || '出没中' }
            if (item.endTs < 8000000000000000 && item.endTs > nowMs) {
              item.countdownText = i18n.formatCountdown(item.endTs - nowMs, 'countdownRemain', 'countdownEnded') || ''
            }
            active.push(item)
          } else if (now < start) {
            item.statusInfo = { statusClass: 'status-upcoming', statusText: i18n.i18n[i18n.getLanguage()].swarmUpcoming || '未开始' }
            var diff = start.getTime() - nowMs
            if (diff > 0) {
              var prefix = diff < 86400000 ? 'countdownOnline' : 'countdownToStart'
              item.countdownText = i18n.formatCountdown(diff, prefix, 'countdownEnded') || ''
            }
            upcoming.push(item)
          } else {
            item.statusInfo = { statusClass: 'status-ended', statusText: i18n.i18n[i18n.getLanguage()].countdownEnded || '已结束' }
            if (self.data.isAdmin) {
              upcoming.push(item)
            }
          }
        })

        function byStart(a, b) {
          return (a.startTs || 0) - (b.startTs || 0)
        }
        active.sort(byStart)
        upcoming.sort(function(a, b) {
          var aEnded = a.statusInfo && a.statusInfo.statusClass === 'status-ended'
          var bEnded = b.statusInfo && b.statusInfo.statusClass === 'status-ended'
          if (aEnded !== bEnded) return aEnded ? 1 : -1
          return byStart(a, b)
        })

        self.setData({ activeSwarms: active, upcomingSwarms: upcoming })
        self._startCountdownTimer()
      })
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
      formMode: 'single',
      form: { name: '', location: '', startDate: '', startTime: '', endDate: '', endTime: '', image: '', form1Label: '', form1Image: '', form1Note: '', form2Label: '', form2Image: '', form2Note: '', desc: '', status: 0 },
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
      formMode: forms.length > 0 ? 'multi' : 'single',
      form: {
        name: item.name || '',
        location: item.location || '',
        startDate: item.startDate || '',
        startTime: item.startTime || '',
        endDate: item.endDate || '',
        endTime: item.endTime || '',
        image: item.image || '',
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

    var formMode = self.data.formMode || 'single'
    var images = []
    var forms = []
    if (formMode === 'multi') {
      // 多形态：形态1 / 形态2
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
      for (var fi = 0; fi < forms.length; fi++) {
        if (forms[fi].image && images.indexOf(forms[fi].image) === -1) {
          images.push(forms[fi].image)
        }
      }
    } else {
      // 单形态：精灵图片URL
      if ((f.image || '').trim()) images.push(f.image.trim())
    }

    // 新增：保存=草稿(status 0)，发布=上线(status 1)
    // 编辑：保存不动 status（避免已上线被改回草稿导致到点不自动推），发布才置 1
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
      updateTime: db.serverDate()
    }
    if (publish || !self.data.editingId) {
      dataToSave.status = publish ? 1 : 0
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
        wx.cloud.callFunction({ name: 'sendSubscribe', data: { checkSwarm: true } }).then(function(res) {
          console.log('大量出没推送结果', res && res.result)
        }).catch(function(err) {
          console.error('大量出没推送失败', err)
        })
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
