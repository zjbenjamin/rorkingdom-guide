const app = getApp()
var db = null
var i18nBehavior = require('../../utils/i18nBehavior')
var i18n = require('../../utils/i18n')

function t(key, fallback) {
  var lang = i18n.getLanguage()
  var dict = i18n.i18n[lang] || i18n.i18n.zh
  return dict[key] || fallback || ''
}

Page({
  behaviors: [i18nBehavior, require('../../utils/padLayoutBehavior')],
  data: {
    isAdmin: false,
    maintenance: false,
    loading: false,
    codes: [],
    formExpireDate: '',
    formExpireTime: '',
    keyboardHeight: 0
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
  
  _parseExpireMs: function(expireStr) {
    var s = String(expireStr || '').trim();
    var m = s.match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?/);
    if (!m) return null;
    var y = parseInt(m[1], 10);
    var mo = parseInt(m[2], 10) - 1;
    var d = parseInt(m[3], 10);
    var hh = m[4] !== undefined ? parseInt(m[4], 10) : 23;
    var mm = m[5] !== undefined ? parseInt(m[5], 10) : 59;
    return new Date(y, mo, d, hh, mm, 59).getTime();
  },

  fetchCodes: function() {
    var self = this;
    if (!db) return;
    self.setData({ loading: true });
    var nowMs = Date.now();
    db.collection('redeem_codes').orderBy('createTime', 'desc').limit(100).get()
      .then(function(res) {
        var codes = res.data || [];
        codes.forEach(function(c) {
          var createMs = 0;
          if (c.createTime) {
            var d = new Date(c.createTime);
            createMs = d.getTime() || 0;
            c.createTimeStr = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
          }
          c._createMs = createMs;
          if (c.expireTime && c.expireTime.length >= 10) {
            var ed = c.expireTime.substring(0, 10);
            var et = c.expireTime.length > 11 ? ' ' + c.expireTime.substring(11, 16) : '';
            c.expireTimeStr = ed + et;
            var expMs = self._parseExpireMs(c.expireTime);
            if (expMs !== null && nowMs > expMs) {
              c.isExpired = true;
            }
          }
          c.isExpired = !!c.isExpired;
        });
        // 未过期兑换码自动置顶排在前面，同状态按创建时间倒序排列
        codes.sort(function(a, b) {
          if (a.isExpired !== b.isExpired) {
            return a.isExpired ? 1 : -1;
          }
          return (b._createMs || 0) - (a._createMs || 0);
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
        wx.showToast({ title: t('redeemCopyDone', '已复制'), icon: 'success' });
      }
    });
  },
  
  addCode: function() {
    this.setData({
      showAddModal: true,
      editingId: '',
      formCode: '',
      formRewards: '',
      formExpireDate: '',
      formExpireTime: '',
      keyboardHeight: 0
    });
  },
  
  editCode: function(e) {
    var item = e.currentTarget.dataset.item;
    var exp = (item.expireTime || '').trim();
    var expDate = '';
    var expTime = '';
    if (exp && exp.length >= 10) {
      expDate = exp.substring(0, 10);
      expTime = exp.length > 11 ? exp.substring(11, 16) : '';
    }
    this.setData({
      showAddModal: true,
      editingId: item._id,
      formCode: item.code || '',
      formRewards: item.rewards || '',
      formExpireDate: expDate,
      formExpireTime: expTime,
      keyboardHeight: 0
    });
  },
  
  closeAddModal: function() {
    this.setData({ showAddModal: false, keyboardHeight: 0 });
  },

  preventClose: function() {},

  onKeyboardHeight: function(e) {
    var h = (e.detail && e.detail.height) || 0;
    if (h !== this.data.keyboardHeight) {
      this.setData({ keyboardHeight: h });
    }
  },
  
  onInputCode: function(e) { this.setData({ formCode: e.detail.value }); },
  onInputRewards: function(e) { this.setData({ formRewards: e.detail.value }); },
  onExpireDateChange: function(e) { this.setData({ formExpireDate: e.detail.value }); },
  onExpireTimeChange: function(e) { this.setData({ formExpireTime: e.detail.value }); },
  
  submitAddCode: function() {
    var self = this;
    if (!db) return;
    var code = self.data.formCode.trim();
    var rewards = self.data.formRewards.trim();
    var expDate = self.data.formExpireDate;
    var expTime = self.data.formExpireTime;
    var expireTime = expDate ? (expDate + (expTime ? ' ' + expTime : '')) : '';
    
    if (!code) {
      wx.showToast({ title: t('redeemCodeRequired', '请填写兑换码'), icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: t('savingMsg', '保存中') });
    var dataObj = {
      code: code,
      rewards: rewards,
      expireTime: expireTime,
      isExpired: false
    };
    
    var isEdit = !!self.data.editingId;
    var promise = isEdit
      ? db.collection('redeem_codes').doc(self.data.editingId).update({ data: dataObj })
      : (dataObj.createTime = db.serverDate(), db.collection('redeem_codes').add({ data: dataObj }));
    
    promise.then(function() {
      wx.hideLoading();
      wx.showToast({ title: t(isEdit ? 'redeemEditSuccess' : 'redeemAddSuccess', isEdit ? '修改成功' : '添加成功'), icon: 'success' });
      self.closeAddModal();
      self.fetchCodes();
    }).catch(function() {
      wx.hideLoading();
      wx.showToast({ title: t(isEdit ? 'redeemEditFail' : 'redeemAddFail', isEdit ? '修改失败' : '添加失败'), icon: 'none' });
    });
  },
  
  deleteCode: function(e) {
    var self = this;
    if (!db) return;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: t('redeemDeleteTitle', '删除兑换码'),
      content: t('redeemDeleteConfirm', '确定要删除？'),
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: t('deletingMsg', '删除中') });
          db.collection('redeem_codes').doc(id).remove()
            .then(function() {
              wx.hideLoading();
              wx.showToast({ title: t('redeemDeleteSuccess', '已删除'), icon: 'success' });
              self.fetchCodes();
            })
            .catch(function() {
              wx.hideLoading();
              wx.showToast({ title: t('redeemDeleteFail', '删除失败'), icon: 'none' });
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
    wx.showLoading({ title: t('redeemSetExpire', '设置中') });
    db.collection('redeem_codes').doc(id).update({
      data: { isExpired: !expired }
    }).then(function() {
      wx.hideLoading();
      self.fetchCodes();
    }).catch(function() {
      wx.hideLoading();
      wx.showToast({ title: t('redeemSetFail', '设置失败'), icon: 'none' });
    });
  },

  onShareAppMessage: function () {
    return {
      title: '洛手助手 - 兑换码查询',
      path: '/pages/redeem/redeem'
    }
  },
  onShareTimeline: function () {
    return {
      title: '洛手助手 - 兑换码查询'
    }
  }

})
