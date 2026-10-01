/**
 * 富文本编辑器操作工厂
 * 公告（form*）与活动（activity*）两套编辑器的格式化/块操作逻辑完全同构，
 * 仅数据键名与 editorCtx 名不同。用一份实现 + 两份配置消除重复。
 */

/**
 * @param {Object} cfg
 *   ctxKey      editorCtx 的实例属性名，如 'editorCtx' / 'activityEditorCtx'
 *   listKey     块列表数据键，如 'formRichContent' / 'activityRichContent'
 *   contentKey  编辑器纯文本数据键，如 'formContent' / 'activityFormContent'
 *   htmlKey     编辑器 HTML 数据键，如 'formHtml' / 'activityFormHtml'
 *   font        样式态键名映射 { style, weight, size, color, family, underline, strike, header, align }
 *   picker      选择器显隐键名映射 { size, color, family }
 */
function createRichEditorOps(cfg) {
  var ctxKey = cfg.ctxKey
  var listKey = cfg.listKey
  var contentKey = cfg.contentKey
  var htmlKey = cfg.htmlKey
  var font = cfg.font
  var picker = cfg.picker

  function ctxOf(page) {
    return page[ctxKey]
  }

  function resetFont() {
    var u = {}
    u[font.style] = 'normal'
    u[font.weight] = 'normal'
    u[font.size] = 28
    u[font.color] = '#ffffff'
    u[font.family] = 'sans-serif'
    u[font.underline] = false
    u[font.strike] = false
    u[font.header] = 0
    u[font.align] = ''
    u[picker.size] = false
    u[picker.color] = false
    u[picker.family] = false
    return u
  }

  function appendBlock(page, block) {
    var list = (page.data[listKey] || []).concat([block])
    var u = {}
    u[listKey] = list
    return u
  }

  // 取出编辑器草稿并组成 text 块（无草稿返回 null）
  function buildDraftBlock(page) {
    var content = (page.data[contentKey] || '').trim()
    if (!content) return null
    return {
      type: 'text', content: content,
      html: page.data[htmlKey] || '',
      style: page.data[font.style],
      weight: page.data[font.weight],
      size: page.data[font.size],
      color: page.data[font.color],
      fontFamily: page.data[font.family]
    }
  }

  /**
   * 把编辑器草稿落成 text 块：
   * - 若正处于「编辑某个已存在块」状态（page[editIdxKey] 有值），插回原位，避免编辑后内容被挪到文末
   * - 否则追加到末尾
   * 落块后清空编辑器，返回是否落了块。
   */
  function commitDraft(page) {
    var draft = buildDraftBlock(page)
    if (!draft) return false
    var list = (page.data[listKey] || []).slice()
    var idx = page[cfg.editIdxKey]
    if (typeof idx === 'number' && idx >= 0 && idx <= list.length) {
      list.splice(idx, 0, draft)
      // 后续插入跟在这段后面
      page[cfg.editIdxKey] = idx + 1
    } else {
      list.push(draft)
      page[cfg.editIdxKey] = null
    }
    var u = {}
    u[listKey] = list
    u[contentKey] = ''
    u[htmlKey] = ''
    page.setData(u)
    var c = ctxOf(page)
    if (c) c.clear()
    return true
  }

  /**
   * 统一插入入口：先把编辑器草稿落成 text 块，再插入目标块。
   * 保证「先输入的文字 → 后插入的媒体」顺序与用户预期一致。
   * @param {Object} block   要插入的块
   * @param {Object} [opts]
   *   stripUrls: [url, ...]  落草稿前先从草稿中剔除这些 URL（媒体分享链接清理）
   *   toast: '已添加xx'       插入成功提示
   */
  function insertBlock(page, block, opts) {
    opts = opts || {}
    if (opts.stripUrls && opts.stripUrls.length) {
      var cleaned = page.data[contentKey] || ''
      for (var i = 0; i < opts.stripUrls.length; i++) {
        if (opts.stripUrls[i]) cleaned = cleaned.replace(opts.stripUrls[i], '')
      }
      var u0 = {}
      u0[contentKey] = cleaned.replace(/\s{2,}/g, ' ').trim()
      page.setData(u0)
    }
    // 先落草稿（会按编辑位/末尾插入），再放目标块
    commitDraft(page)
    var list = (page.data[listKey] || []).slice()
    var idx = page[cfg.editIdxKey]
    if (typeof idx === 'number' && idx >= 0 && idx <= list.length) {
      list.splice(idx, 0, block)
      page[cfg.editIdxKey] = idx + 1
    } else {
      list.push(block)
    }
    var u = {}
    u[listKey] = list
    page.setData(u)
    if (opts.toast) wx.showToast({ title: opts.toast, icon: 'success' })
  }

  return {
    __resetFont: resetFont,
    // 统一插入：先落草稿再追加块，保证文字段落在媒体之前
    insertBlock: function(block, opts) {
      insertBlock(this, block, opts)
    },

    toggleBold: function() {
      var c = ctxOf(this)
      if (c) c.format('bold')
    },
    toggleItalic: function() {
      var c = ctxOf(this)
      if (c) c.format('italic')
    },
    toggleUnderline: function() {
      var c = ctxOf(this)
      if (c) c.format('underline')
    },
    toggleStrike: function() {
      var c = ctxOf(this)
      if (c) c.format('strike')
    },
    toggleHeader2: function() {
      var c = ctxOf(this)
      if (c) c.format('header', 'H2')
    },
    toggleHeader3: function() {
      var c = ctxOf(this)
      if (c) c.format('header', 'H3')
    },
    setFontSize: function(e) {
      var size = e.currentTarget.dataset.size
      var u = {}
      u[picker.size] = false
      this.setData(u)
      var c = ctxOf(this)
      if (c) c.format('fontSize', (size / 2) + 'px')
    },
    setFontColor: function(e) {
      var color = e.currentTarget.dataset.color
      var u = {}
      u[picker.color] = false
      this.setData(u)
      var c = ctxOf(this)
      if (c) c.format('color', color)
    },
    setFontFamily: function(e) {
      var family = e.currentTarget.dataset.family
      var u = {}
      u[picker.family] = false
      this.setData(u)
      var c = ctxOf(this)
      if (c) c.format('fontFamily', family)
    },
    showFontSizePicker: function() {
      var u = {}
      u[picker.size] = !this.data[picker.size]
      u[picker.color] = false
      u[picker.family] = false
      this.setData(u)
    },
    showFontColorPicker: function() {
      var u = {}
      u[picker.color] = !this.data[picker.color]
      u[picker.size] = false
      u[picker.family] = false
      this.setData(u)
    },
    showFontFamilyPicker: function() {
      var u = {}
      u[picker.family] = !this.data[picker.family]
      u[picker.size] = false
      u[picker.color] = false
      this.setData(u)
    },
    undo: function() {
      var c = ctxOf(this)
      if (c) c.undo()
    },
    alignLeft: function() {
      var c = ctxOf(this)
      if (!c) return
      c.format('align', 'left')
      var u = {}
      u[font.align] = 'left'
      this.setData(u)
    },
    alignCenter: function() {
      var c = ctxOf(this)
      if (!c) return
      c.format('align', 'center')
      var u = {}
      u[font.align] = 'center'
      this.setData(u)
    },
    alignRight: function() {
      var c = ctxOf(this)
      if (!c) return
      c.format('align', 'right')
      var u = {}
      u[font.align] = 'right'
      this.setData(u)
    },

    // 把编辑器里尚未落块的纯文本提交为 text 块（可附带额外 setData）
    autoCommitText: function(updates) {
      commitDraft(this)
      if (updates) this.setData(updates)
    },

    // 把当前编辑器内容提交为 text 块并清空编辑器
    addRichTextBlock: function() {
      var self = this
      var c = ctxOf(self)
      if (!c) {
        // 编辑器未就绪时退回纯文本落块，避免按钮点了没反应
        if (!commitDraft(self)) wx.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      c.getContents({
        success: function(res) {
          var html = res.html
          var text = res.text.trim()
          if (!text) {
            wx.showToast({ title: '请输入内容', icon: 'none' })
            return
          }
          var block = {
            type: 'text',
            content: text,
            html: html,
            style: self.data[font.style],
            weight: self.data[font.weight],
            size: self.data[font.size],
            color: self.data[font.color],
            fontFamily: self.data[font.family]
          }
          // 按编辑位/末尾插入
          var list = (self.data[listKey] || []).slice()
          var idx = self[cfg.editIdxKey]
          if (typeof idx === 'number' && idx >= 0 && idx <= list.length) {
            list.splice(idx, 0, block)
            self[cfg.editIdxKey] = idx + 1
          } else {
            list.push(block)
            self[cfg.editIdxKey] = null
          }
          var u = {}
          u[listKey] = list
          u[contentKey] = ''
          u[htmlKey] = ''
          self.setData(u)
          c.clear()
        }
      })
    },

    // 把当前编辑器内容作为引用块提交
    addRichQuoteBlock: function() {
      var content = (this.data[contentKey] || '').trim()
      if (!content) {
        wx.showToast({ title: '请输入引用内容', icon: 'none' })
        return
      }
      var block = {
        type: 'quote',
        content: content,
        style: 'normal',
        weight: 'normal',
        size: 26,
        color: 'rgba(255,255,255,0.7)'
      }
      var list = (this.data[listKey] || []).slice()
      var idx = this[cfg.editIdxKey]
      if (typeof idx === 'number' && idx >= 0 && idx <= list.length) {
        list.splice(idx, 0, block)
        this[cfg.editIdxKey] = idx + 1
      } else {
        list.push(block)
        this[cfg.editIdxKey] = null
      }
      var u = {}
      u[listKey] = list
      u[contentKey] = ''
      u[htmlKey] = ''
      this.setData(u)
      var c = ctxOf(this)
      if (c) c.clear()
    },

    // 解析出的表格数据落块（先落草稿，保持顺序）
    processImportedTextToTable: function(text) {
      var tableData = cfg.parseTableInput(text)
      if (!tableData) {
        wx.showToast({ title: '未识别出表格数据，请确保文件内含有至少两行、每行使用分隔符的分隔内容', icon: 'none' })
        return
      }
      var block = {
        type: 'table',
        headers: tableData.headers,
        rows: tableData.rows,
        colCount: tableData.colCount,
        rowCount: tableData.rowCount
      }
      insertBlock(this, block, { toast: '表格导入成功' })
    },

    // 删除块；仅当被删媒体 URL 出现在编辑器草稿里时才顺带清理，不清空编辑器
    removeRichBlock: function(e) {
      var idx = e.currentTarget.dataset.idx
      var list = (this.data[listKey] || []).slice()
      var block = list[idx]
      list.splice(idx, 1)
      var u = {}
      u[listKey] = list
      if (block && (block.type === 'video' || block.type === 'music') && block.url) {
        u[contentKey] = (this.data[contentKey] || '').replace(block.url, '').replace(/\s{2,}/g, ' ').trim()
      }
      this.setData(u)
    },

    // 一次上移/下移一格
    moveRichBlockStep: function(e) {
      var idx = e.currentTarget.dataset.idx
      var dir = e.currentTarget.dataset.dir
      var list = (this.data[listKey] || []).slice()
      var to = idx + dir
      if (to < 0 || to >= list.length) return
      var block = list.splice(idx, 1)[0]
      list.splice(to, 0, block)
      var u = {}
      u[listKey] = list
      this.setData(u)
    }
  }
}

module.exports = {
  createRichEditorOps: createRichEditorOps
}
