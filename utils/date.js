function formatFull(date) {
  if (!date) date = new Date()
  if (typeof date === 'string' || typeof date === 'number') date = new Date(date)
  var utc = date.getTime() + date.getTimezoneOffset() * 60000
  var shanghai = new Date(utc + 8 * 3600000)
  var y = shanghai.getFullYear()
  var m = String(shanghai.getMonth() + 1).padStart(2, '0')
  var day = String(shanghai.getDate()).padStart(2, '0')
  var h = String(shanghai.getHours()).padStart(2, '0')
  var min = String(shanghai.getMinutes()).padStart(2, '0')
  var s = String(shanghai.getSeconds()).padStart(2, '0')
  return y + '-' + m + '-' + day + ' ' + h + ':' + min + ':' + s
}

function formatShort(date) {
  if (!date) date = new Date()
  if (typeof date === 'string' || typeof date === 'number') date = new Date(date)
  var utc = date.getTime() + date.getTimezoneOffset() * 60000
  var shanghai = new Date(utc + 8 * 3600000)
  return String(shanghai.getHours()).padStart(2, '0') + ':' + String(shanghai.getMinutes()).padStart(2, '0') + ':' + String(shanghai.getSeconds()).padStart(2, '0')
}

function formatNotify(date) {
  if (!date) date = new Date()
  var y = date.getFullYear()
  var m = String(date.getMonth() + 1).padStart(2, '0')
  var d = String(date.getDate()).padStart(2, '0')
  var h = String(date.getHours()).padStart(2, '0')
  var min = String(date.getMinutes()).padStart(2, '0')
  return y + '-' + m + '-' + d + ' ' + h + ':' + min
}

function formatRelative(date) {
  if (!date) return ''
  var d = new Date(date)
  var now = new Date()
  var diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 2592000000) return Math.floor(diff / 86400000) + '天前'
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}

module.exports = {
  formatFull: formatFull,
  formatShort: formatShort,
  formatNotify: formatNotify,
  formatRelative: formatRelative
}