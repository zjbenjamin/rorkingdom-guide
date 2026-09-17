var _historyCache = null
var _historyCacheTime = 0
var CACHE_TTL = 30000

function loadHistory(force) {
  var now = Date.now()
  if (!force && _historyCache && (now - _historyCacheTime) < CACHE_TTL) {
    return _historyCache
  }
  var wealthIsSet = wx.getStorageSync('wealth_is_set') === true
  var initial = wx.getStorageSync('initial_wealth')||0
  var gains = wx.getStorageSync('total_gains')||0
  var costs = wx.getStorageSync('total_costs')||0
  var accumulated = gains - costs
  var totalCatches = wx.getStorageSync('total_catches')||0
  var successCatches = wx.getStorageSync('success_catches')||0
  var carnivalCount = wx.getStorageSync('carnival_count')||0
  var luckyBoxCount = wx.getStorageSync('lucky_box_count')||0
  var encounters = luckyBoxCount
  var guaranteed = Math.floor(totalCatches / 80)
  var effectiveSuccess = successCatches + Math.max(0, guaranteed - encounters)
  var successRate = totalCatches > 0 ? Math.min(Math.round(effectiveSuccess / totalCatches * 100), 100) : 0
  var pity = wx.getStorageSync('pity_count') || 0
  var history = wx.getStorageSync('catch_history') || []
  var result = {
    wealthIsSet: wealthIsSet,
    initialWealth: initial,
    totalGains: gains,
    totalCosts: costs,
    accumulatedWealth: accumulated,
    totalCatches: totalCatches,
    successCatches: successCatches,
    successRate: successRate,
    carnivalCount: carnivalCount,
    luckyBoxCount: luckyBoxCount,
    pityCount: pity,
    history: history
  }
  _historyCache = result
  _historyCacheTime = now
  return result
}

function invalidateHistory() {
  _historyCache = null
  _historyCacheTime = 0
}

module.exports = { loadHistory: loadHistory, invalidateHistory: invalidateHistory }
