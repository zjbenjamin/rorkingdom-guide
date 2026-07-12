const fs = require('fs');
let code = fs.readFileSync('pages/admin/admin.js', 'utf8');

// Replace chooseFormImage
code = code.replace(
  /chooseFormImage: function\(\) \{\s*var self = this\s*wx\.chooseImage\(\{\s*count: 1,\s*sizeType: \['compressed'\],\s*sourceType: \['album', 'camera'\],\s*success: function\(res\) \{\s*var filePath = res\.tempFilePaths\[0\]\s*wx\.showLoading\(\{ title: '.*?' \}\)\s*var ext = filePath\.split\('\.'\)\.pop\(\) \|\| 'jpg'\s*var cloudPath = 'announcements\/' \+ Date\.now\(\) \+ '\.' \+ ext\s*wx\.cloud\.uploadFile\(\{ cloudPath: cloudPath, filePath: filePath \}\)\s*\.then\(function\(uploadRes\) \{\s*wx\.hideLoading\(\)\s*self\.setData\(\{ formImage: uploadRes\.fileID \}\)\s*\}\)\s*\.catch\(function\(\) \{\s*wx\.hideLoading\(\)\s*wx\.showToast\(\{ title: '.*?', icon: 'none' \}\)\s*\}\)\s*\}\s*\}\)\s*\}/,
  `chooseFormImage: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['本地上传', '输入图片外链', '从剪贴板粘贴'],
      success: function(sheetRes) {
        if (sheetRes.tapIndex === 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
              var filePath = res.tempFilePaths[0]
              wx.showLoading({ title: '上传中...' })
              var ext = filePath.split('.').pop() || 'jpg'
              var cloudPath = 'announcements/' + Date.now() + '.' + ext
              wx.cloud.uploadFile({ cloudPath: cloudPath, filePath: filePath })
                .then(function(uploadRes) {
                  wx.hideLoading()
                  self.setData({ formImage: uploadRes.fileID })
                })
                .catch(function() {
                  wx.hideLoading()
                  wx.showToast({ title: '上传失败', icon: 'none' })
                })
            }
          })
        } else if (sheetRes.tapIndex === 1) {
          wx.showModal({
            title: '输入图片外链',
            content: '',
            placeholderText: '请输入阿里云等外链URL',
            editable: true,
            success: function(mres) {
              if (mres.confirm && mres.content.trim()) {
                self.setData({ formImage: mres.content.trim() })
              }
            }
          })
        } else if (sheetRes.tapIndex === 2) {
          wx.getClipboardData({
            success: function(cb) {
              var text = (cb.data || '').trim()
              if (text && self._isImageUrl && self._isImageUrl(text)) {
                self.setData({ formImage: text })
                wx.showToast({ title: '已粘贴', icon: 'success' })
              } else {
                wx.showToast({ title: '未发现有效图片链接', icon: 'none' })
              }
            }
          })
        }
      }
    })
  }`
);

// Replace chooseActivityFormImage
code = code.replace(
  /chooseActivityFormImage: function\(\) \{\s*var self = this\s*wx\.chooseImage\(\{ count: 1, sizeType: \['compressed'\], sourceType: \['album', 'camera'\],\s*success: function\(res\) \{\s*var filePath = res\.tempFilePaths\[0\]\s*wx\.showLoading\(\{ title: '.*?' \}\)\s*var ext = filePath\.split\('\.'\)\.pop\(\) \|\| 'jpg'\s*wx\.cloud\.uploadFile\(\{ cloudPath: 'activities\/' \+ Date\.now\(\) \+ '\.' \+ ext, filePath: filePath \}\)\s*\.then\(function\(r\) \{ wx\.hideLoading\(\); self\.setData\(\{ activityFormImage: r\.fileID \}\) \}\)\s*\.catch\(function\(\) \{ wx\.hideLoading\(\); wx\.showToast\(\{ title: '.*?', icon: 'none' \}\) \}\)\s*\}\s*\}\)\s*\}/,
  `chooseActivityFormImage: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['本地上传', '输入图片外链', '从剪贴板粘贴'],
      success: function(sheetRes) {
        if (sheetRes.tapIndex === 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
              var filePath = res.tempFilePaths[0]
              wx.showLoading({ title: '上传中...' })
              var ext = filePath.split('.').pop() || 'jpg'
              wx.cloud.uploadFile({ cloudPath: 'activities/' + Date.now() + '.' + ext, filePath: filePath })
                .then(function(r) { wx.hideLoading(); self.setData({ activityFormImage: r.fileID }) })
                .catch(function() { wx.hideLoading(); wx.showToast({ title: '上传失败', icon: 'none' }) })
            }
          })
        } else if (sheetRes.tapIndex === 1) {
          wx.showModal({
            title: '输入图片外链',
            content: '',
            placeholderText: '请输入阿里云等外链URL',
            editable: true,
            success: function(mres) {
              if (mres.confirm && mres.content.trim()) {
                self.setData({ activityFormImage: mres.content.trim() })
              }
            }
          })
        } else if (sheetRes.tapIndex === 2) {
          wx.getClipboardData({
            success: function(cb) {
              var text = (cb.data || '').trim()
              if (text && self._isImageUrl && self._isImageUrl(text)) {
                self.setData({ activityFormImage: text })
                wx.showToast({ title: '已粘贴', icon: 'success' })
              } else {
                wx.showToast({ title: '未发现有效图片链接', icon: 'none' })
              }
            }
          })
        }
      }
    })
  }`
);

fs.writeFileSync('pages/admin/admin.js', code, 'utf8');
console.log('Fixed admin image upload');
