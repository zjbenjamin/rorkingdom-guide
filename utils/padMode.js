// Pad/手机布局模式：auto（按宽度）| pad（强制平板）| phone（强制手机）
var STORAGE_KEY = 'pad_layout_mode'

function getMode() {
  try {
    var m = wx.getStorageSync(STORAGE_KEY)
    return (m === 'pad' || m === 'phone' || m === 'auto') ? m : 'auto'
  } catch (e) {
    return 'auto'
  }
}

function setMode(mode) {
  if (mode !== 'pad' && mode !== 'phone' && mode !== 'auto') mode = 'auto'
  try { wx.setStorageSync(STORAGE_KEY, mode) } catch (e) {}
  return mode
}

// 由模式 + 窗口宽度算出实际布局
function resolveLayout(mode, windowWidth) {
  var w = Number(windowWidth) || 0
  if (mode === 'pad') return 'pad'
  if (mode === 'phone') return 'phone'
  return w >= 768 ? 'pad' : 'phone'
}

// 根节点 class：layout-pad + 可选 layout-wide（横屏平板）；手机返回 layout-phone
function layoutClasses(mode, windowWidth) {
  var layout = resolveLayout(mode, windowWidth)
  if (layout !== 'pad') return 'layout-phone'
  return Number(windowWidth) >= 1024 ? 'layout-pad layout-wide' : 'layout-pad'
}

module.exports = {
  getMode: getMode,
  setMode: setMode,
  resolveLayout: resolveLayout,
  layoutClasses: layoutClasses
}
