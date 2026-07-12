const fs = require('fs');
let code = fs.readFileSync('pages/catch/catch.js', 'utf8');

// Replace loadHistory logic to use deep clone and fix wealthSet check
code = code.replace(
  /var initial = wx\.getStorageSync\('initial_wealth'\)\|\|0[\s\S]*?var activeBalls = activeBallsList\.filter\(function\(b\)\{ return b\.count > 0 \}\)\r?\n\s*var pity = wx\.getStorageSync\('pity_count'\) \|\| 0\r?\n\s*this\.updatePity\(pity\)\r?\n\s*var rate = this\.calcSuccessRate\(\)\r?\n\s*var title = this\.calcTitle\(rate, carnivalCount \+ luckyBoxCount, totalCatches\)\r?\n\s*this\.setData\(\{[\s\S]*?wealthSet: initial > 0,[\s\S]*?canStartCapture: initial > 0 && activeBalls\.length > 0,/m,
  `var initialRaw = wx.getStorageSync('initial_wealth')
    var wealthSet = (initialRaw !== '' && initialRaw !== undefined && initialRaw !== null)
    var initial = wealthSet ? parseInt(initialRaw) : 0
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
    var activeBallsList = JSON.parse(JSON.stringify(this.data.balls))
    var savedBalls = wx.getStorageSync('catch_balls')
    if (savedBalls && Array.isArray(savedBalls)) {
      for (var i = 0; i < activeBallsList.length; i++) {
        for (var j = 0; j < savedBalls.length; j++) {
          if (activeBallsList[i].id === savedBalls[j].id) {
            activeBallsList[i].count = savedBalls[j].count || 0;
            activeBallsList[i].freeCount = savedBalls[j].freeCount || 0;
            break;
          }
        }
      }
      this.setData({ balls: activeBallsList })
    }
    var activeBalls = activeBallsList.filter(function(b){ return b.count > 0 })
    var pity = wx.getStorageSync('pity_count') || 0
    this.updatePity(pity)
    var rate = this.calcSuccessRate()
    var title = this.calcTitle(rate, carnivalCount + luckyBoxCount, totalCatches)
    this.setData({
      history: (wx.getStorageSync('catch_history')||[]).slice(0,20).map(function(item){ if(typeof item.ballIcon === 'undefined') item.ballIcon = (item.icon || ''); return item; }),
      initialWealth: initial,
      totalGains: gains,
      totalCosts: costs,
      accumulatedWealth: accumulated,
      totalWealth: initial + accumulated,
      wealthSet: wealthSet,
      totalCatches: totalCatches,
      successCatches: successCatches,
      successRate: rate,
      carnivalCount: carnivalCount,
      luckyBoxCount: luckyBoxCount,
      hasActiveBalls: activeBalls.length > 0,
      canStartCapture: wealthSet && activeBalls.length > 0,`
);

fs.writeFileSync('pages/catch/catch.js', code, 'utf8');
console.log('Fixed catch.js (part 2)');
