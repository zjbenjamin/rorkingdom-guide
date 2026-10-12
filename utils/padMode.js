// Pad/手机布局模式：仅由按钮切换，默认手机，不做宽度自动适配
var STORAGE_KEY = 'pad_layout_mode'

function getMode() {
  try {
    var m = wx.getStorageSync(STORAGE_KEY)
    // 旧版 auto 一律视为手机：布局只随按钮切换
    return (m === 'pad') ? 'pad' : 'phone'
  } catch (e) {
    return 'phone'
  }
}

function setMode(mode) {
  var next = (mode === 'pad') ? 'pad' : 'phone'
  try { wx.setStorageSync(STORAGE_KEY, next) } catch (e) {}
  return next
}

// 仅由模式决定布局，不再按窗口宽度自动切换
function resolveLayout(mode) {
  return mode === 'pad' ? 'pad' : 'phone'
}

// 根节点 class：layout-pad + 可选 layout-wide（宽屏平板）；手机返回 layout-phone
function layoutClasses(mode, windowWidth) {
  if (resolveLayout(mode) !== 'pad') return 'layout-phone'
  return Number(windowWidth) >= 1024 ? 'layout-pad layout-wide' : 'layout-pad'
}

module.exports = {
  getMode: getMode,
  setMode: setMode,
  resolveLayout: resolveLayout,
  layoutClasses: layoutClasses
}
