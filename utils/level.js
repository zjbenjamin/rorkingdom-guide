function calcLevel(loginDays, hasUid, captureCount) {
  var baseLevel = 1
  if (loginDays >= 365) baseLevel = 10
  else if (loginDays >= 180) baseLevel = 9
  else if (loginDays >= 120) baseLevel = 8
  else if (loginDays >= 90) baseLevel = 7
  else if (loginDays >= 60) baseLevel = 6
  else if (loginDays >= 30) baseLevel = 5
  else if (loginDays >= 15) baseLevel = 4
  else if (loginDays >= 7) baseLevel = 3
  else if (loginDays >= 3) baseLevel = 2

  var uidBonus = hasUid ? 1 : 0
  var xpBonus = Math.floor((captureCount || 0) / 50)
  var totalLevel = Math.min(baseLevel + uidBonus + xpBonus, 20)

  return totalLevel
}

function calcNextLevelDays(level) {
  var thresholds = [3, 7, 15, 30, 60, 90, 120, 180, 365]
  if (level >= 10) return 0
  return thresholds[level - 1] || 3
}

function getLevelColor(level) {
  if (level >= 15) return { bg: 'linear-gradient(135deg, #ff4757, #ffab40, #00d4ff, #9945ff)', text: '#fff', border: '#ffab40' }
  if (level >= 12) return { bg: 'linear-gradient(135deg, #ffab40, #ff4757)', text: '#fff', border: '#ff4757' }
  if (level >= 10) return { bg: 'linear-gradient(135deg, #ffab40, #ffd700)', text: '#1a1040', border: '#ffab40' }
  if (level >= 8) return { bg: 'linear-gradient(135deg, #9945ff, #7c3aed)', text: '#fff', border: '#9945ff' }
  if (level >= 6) return { bg: 'linear-gradient(135deg, #00d4ff, #0099cc)', text: '#fff', border: '#00d4ff' }
  if (level >= 4) return { bg: 'linear-gradient(135deg, #00e676, #00c853)', text: '#fff', border: '#00e676' }
  if (level >= 2) return { bg: 'linear-gradient(135deg, #78909c, #546e7a)', text: '#fff', border: '#78909c' }
  return { bg: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.2)' }
}

function getLevelName(level) {
  if (level >= 15) return '至尊洛克'
  if (level >= 12) return '传说洛克'
  if (level >= 10) return '王国守护者'
  if (level >= 8) return '魔法大师'
  if (level >= 6) return '精灵研究员'
  if (level >= 4) return '高级魔法生'
  if (level >= 2) return '见习魔法生'
  return '小洛克'
}

function getLevelIcon(level) {
  if (level >= 15) return '👑'
  if (level >= 12) return '🌟'
  if (level >= 10) return '🏰'
  if (level >= 8) return '🔮'
  if (level >= 6) return '📖'
  if (level >= 4) return '✨'
  if (level >= 2) return '🎓'
  return '🐣'
}

function getNextXP(captureCount) {
  var current = captureCount % 50
  return 50 - current
}

function calcTotalXP(loginDays, hasUid, captureCount) {
  var loginXP = loginDays * 10
  var uidXP = hasUid ? 50 : 0
  var catchXP = captureCount * 5
  return loginXP + uidXP + catchXP
}

module.exports = {
  calcLevel: calcLevel,
  calcNextLevelDays: calcNextLevelDays,
  getLevelColor: getLevelColor,
  getLevelName: getLevelName,
  getLevelIcon: getLevelIcon,
  getNextXP: getNextXP,
  calcTotalXP: calcTotalXP
}
