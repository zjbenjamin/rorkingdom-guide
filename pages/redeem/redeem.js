const app = getApp()
var db = null
var i18nBehavior = require('../../utils/i18nBehavior')

Page({
  behaviors: [i18nBehavior],
  data: {
    isAdmin: false,
    maintenance: false,
    loading: false,
    codes: []
  },
  onLoad: function() {
    this._refreshI18n()
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.fetchCodes()
  },
  onShow: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
  },
  checkAdmin: function() {
    var self = this
    if (!wx.cloud) return
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var currentOpenid = res.result.openid || (res.result.userInfo && res.result.userInfo.openId)
      var db = wx.cloud.database()
      db.collection('admin_config').doc('admin').get()
        .then(function(adminRes) {
          var adminOpenid = adminRes.data.openid
          var adminOpenids = adminRes.data.openids || []
          if (currentOpenid && (currentOpenid === adminOpenid || adminOpenids.indexOf(currentOpenid) !== -1)) {
            wx.setStorageSync('is_admin_user', true)
            self.setData({ isAdmin: true })
          } else {
            wx.removeStorageSync('is_admin_user')
            self.setData({ isAdmin: false })
          }
        }).catch(function(e) { console.error(e) })
    }).catch(function(e) { console.error(e) })
  },
  
  fetchCodes: function() {
    var self = this;
    if (!db) return;
    self.setData({ loading: true });
    db.collection('redeem_codes').orderBy('createTime', 'desc').get()
      .then(function(res) {
        var codes = res.data || [];
        codes.forEach(function(c) {
          if (c.createTime) {
            var d = new Date(c.createTime);
            c.createTimeStr = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
          }
        });
        self.setData({ codes: codes, loading: false });
      })
      .catch(function() {
        self.setData({ loading: false });
      });
  },
  
  copyCode: function(e) {
    var code = e.currentTarget.dataset.code;
    if (!code) return;
    wx.setClipboardData({
      data: code,
      success: function() {
        wx.showToast({ title: '已复制兑换码', icon: 'success' });
      }
    });
  },
  
  addCode: function() {
    this.setData({
      showAddModal: true,
      editingId: '',
      formTitle: '',
      formCode: '',
      formRewards: '',
      formExpireTime: ''
    });
  },
  
  editCode: function(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      showAddModal: true,
      editingId: item._id,
      formTitle: item.title || '',
      formCode: item.code || '',
      formRewards: item.rewards || '',
      formExpireTime: item.expireTime || ''
    });
  },
  
  closeAddModal: function() {
    this.setData({ showAddModal: false });
  },
  
  onInputTitle: function(e) { this.setData({ formTitle: e.detail.value }); },
  onInputCode: function(e) { this.setData({ formCode: e.detail.value }); },
  onInputRewards: function(e) { this.setData({ formRewards: e.detail.value }); },
  onInputExpireTime: function(e) { this.setData({ formExpireTime: e.detail.value }); },
  
  submitAddCode: function() {
    var self = this;
    if (!db) return;
    var title = self.data.formTitle.trim();
    var code = self.data.formCode.trim();
    var rewards = self.data.formRewards.trim();
    var expireTime = self.data.formExpireTime.trim();
    
    if (!code) {
      wx.showToast({ title: '请填写兑换码', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中' });
    var dataObj = {
      title: title,
      code: code,
      rewards: rewards,
      expireTime: expireTime,
      isExpired: false
    };
    
    if (self.data.editingId) {
      db.collection('redeem_codes').doc(self.data.editingId).update({
        data: dataObj
      }).then(function() {
        wx.hideLoading();
        wx.showToast({ title: '修改成功', icon: 'success' });
        self.closeAddModal();
        self.fetchCodes();
      }).catch(function() {
        wx.hideLoading();
        wx.showToast({ title: '修改失败', icon: 'none' });
      });
    } else {
      dataObj.createTime = db.serverDate();
      db.collection('redeem_codes').add({
        data: dataObj
      }).then(function() {
        wx.hideLoading();
        wx.showToast({ title: '添加成功', icon: 'success' });
        self.closeAddModal();
        self.fetchCodes();
      }).catch(function() {
        wx.hideLoading();
        wx.showToast({ title: '添加失败', icon: 'none' });
      });
    }
  },
  
  deleteCode: function(e) {
    var self = this;
    if (!db) return;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除兑换码',
      content: '确定要删除这个兑换码吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          db.collection('redeem_codes').doc(id).remove()
            .then(function() {
              wx.hideLoading();
              wx.showToast({ title: '已删除', icon: 'success' });
              self.fetchCodes();
            })
            .catch(function() {
              wx.hideLoading();
              wx.showToast({ title: '删除失败', icon: 'none' });
            });
        }
      }
    });
  },
  
  toggleExpire: function(e) {
    var self = this;
    if (!db) return;
    var id = e.currentTarget.dataset.id;
    var expired = e.currentTarget.dataset.expired;
    wx.showLoading({ title: '设置中' });
    db.collection('redeem_codes').doc(id).update({
      data: { isExpired: !expired }
    }).then(function() {
      wx.hideLoading();
      self.fetchCodes();
    }).catch(function() {
      wx.hideLoading();
      wx.showToast({ title: '设置失败', icon: 'none' });
    });
  },

  onShareAppMessage: function () {
    return {
      title: 'CDK 兑换中心 - 洛克王国向导',
      path: '/pages/redeem/redeem'
    }
  },
  onShareTimeline: function () {
    return {
      title: 'CDK 兑换中心 - 洛克王国向导'
    }
  }

})
