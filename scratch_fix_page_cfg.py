from pathlib import Path

p = Path(r"F:\rorkingdom-guide\pages\admin\admin.js")
t = p.read_text(encoding="utf-8")

start = t.find("    togglePageMaintenance: function(e) {")
if start < 0:
    start = t.find("togglePageMaintenance: function(e) {")
end_marker = "openModal: function(e) {"
end = t.find(end_marker)
if start < 0 or end < 0:
    raise SystemExit(f"markers not found {start} {end}")

new = '''    // 直连数据库写 page_config，不依赖云函数部署
    _savePageConfig: function(id, patch, okMsg) {
      var self = this
      if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
      var data = Object.assign({}, patch, { updateTime: db.serverDate() })
      db.collection('page_config').doc(id).set({ data: data })
        .then(function() {
          self.loadPageConfigs()
          wx.showToast({ title: okMsg || '设置成功', icon: 'success' })
        })
        .catch(function(err) {
          wx.showToast({ title: '保存失败：' + ((err && (err.errMsg || err.message)) || '请重试'), icon: 'none' })
        })
    },
    togglePageMaintenance: function(e) {
      var self = this
      var id = e.currentTarget.dataset.id
      if (id === 'captureImage') {
        var currentVal = wx.getStorageSync('show_log_share_btn') !== false
        var newVal = !currentVal
        wx.setStorageSync('show_log_share_btn', newVal)
        self.loadPageConfigs()
        wx.showToast({ title: newVal ? '已开启' : '已关闭', icon: 'success' })
        return
      }
      if (!db) return
      var list = self.data.pageConfigs || []
      var cur = false
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { cur = !!list[i].maintenance; break }
      }
      self._savePageConfig(id, { maintenance: !cur }, !cur ? '已设为维护中' : '已恢复运行')
    },
    togglePageCustom: function(e) {
      var self = this
      var id = e.currentTarget.dataset.id
      if (!db) return
      var list = self.data.pageConfigs || []
      var cur = false
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { cur = !!list[i].useCustom; break }
      }
      self._savePageConfig(id, { useCustom: !cur }, '自定义已' + (!cur ? '开启' : '关闭'))
    },
'''

t = t[:start] + new + t[end:]
p.write_text(t, encoding="utf-8")
print("ok")
