var app = getApp()
function formatTime(d) {
  if (!d) d = new Date()
  var utc = d.getTime() + d.getTimezoneOffset() * 60000
  var shanghai = new Date(utc + 8 * 3600000)
  var y = shanghai.getFullYear()
  var m = String(shanghai.getMonth() + 1).padStart(2, '0')
  var day = String(shanghai.getDate()).padStart(2, '0')
  var h = String(shanghai.getHours()).padStart(2, '0')
  var min = String(shanghai.getMinutes()).padStart(2, '0')
  var s = String(shanghai.getSeconds()).padStart(2, '0')
  return y + '-' + m + '-' + day + ' ' + h + ':' + min + ':' + s
}
function formatTimeShort(d) {
  if (!d) d = new Date()
  var utc = d.getTime() + d.getTimezoneOffset() * 60000
  var shanghai = new Date(utc + 8 * 3600000)
  return String(shanghai.getHours()).padStart(2, '0') + ':' + String(shanghai.getMinutes()).padStart(2, '0') + ':' + String(shanghai.getSeconds()).padStart(2, '0')
}
Page({
  data: {
    buildTime: '',
    balls: [
      {id:1,name:'普通咕噜球',color:'#999',count:0,rate:'基础捕捉率',price:0},
      {id:2,name:'高级咕噜球',color:'#1565c0',count:0,rate:'捕捉率+30%',price:12000},
      {id:3,name:'国王球',color:'#f57f17',count:0,rate:'100%捕捉，必定了不起',price:0},
      {id:4,name:'美妙球',color:'#e91e63',count:0,rate:'提升对应属性50%捕捉概率',price:0},
      {id:5,name:'好战球',color:'#d32f2f',count:0,rate:'提升对应属性50%捕捉概率',price:0},
      {id:6,name:'光合球',color:'#2e7d32',count:0,rate:'提升对应属性50%捕捉概率',price:0},
      {id:7,name:'网兜球',color:'#388e3c',count:0,rate:'提升对应属性50%捕捉概率',price:0},
      {id:8,name:'暗星球',color:'#37474f',count:0,rate:'提升对应属性50%捕捉概率',price:0},
      {id:9,name:'奇趣球',color:'#ff6b6b',count:0,rate:'100%捕捉，资质随机',price:80000},
      {id:10,name:'补光球',color:'#ffd93d',count:0,rate:'100%捕捉，资质随机',price:80000},
      {id:11,name:'棱镜球',color:'#a855f7',count:0,rate:'100%捕捉，必定了不起，完美无瑕，天赋随机，炫彩颜色粒子随机',price:0},
      {id:12,name:'织梦棱镜球',color:'#ec4899',count:0,rate:'100%捕捉，必定了不起，完美无瑕，天赋随机，炫彩粒子为当前赛季主题颜色统一',price:800},
      {id:13,name:'狂欢棱镜球',color:'#f472b6',count:0,rate:'狂欢系+70%',price:800},
      {id:14,name:'变幻球',color:'#06b6d4',count:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:15,name:'绝缘球',color:'#8b5cf6',count:0,rate:'绝缘精灵+45%',price:3000},
      {id:16,name:'调温球',color:'#f97316',count:0,rate:'提升对应属性50%捕捉概率',price:3000}
    ],
    selectedBall: null, selectedBallCount: 0,
    totalCatches: 0, successCatches: 0, successRate: 0, pityCount: 0, pityHint: '基础概率', history: [], result: '', expanded: false,
    initialWealth: 0, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: 0,
    coinInput: '', wealthSet: false,
    costInput: '', gainInput: '',
    petNameInput: '', catchCount: 1,
    encounterTab: 'luckybox', carnivalCount: 0, luckyBoxCount: 0,
    specialTab: 'buy', specialBall: '高级咕噜球',
    specialBalls: ['美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','奇趣球','补光球','国王球','棱镜球','织梦棱镜球','狂欢棱镜球'],
    craftBalls: ['国王球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','棱镜球'],
    attributeBalls: ['美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球'],
    specialCount: '', specialHistory: [],
    totalBallUsed: 0,
    activeBalls: [],
    costMode: 'auto',
    gemCost: 0,
    cnyCost: '0',
    userTitle: '😐 平民',
    titleColor: 'rgba(255,255,255,0.5)',
    showBallCheckModal: false,
    ballCheckBall: '',
    ballCheckCount: '',
    ballCheckRecords: []
  },
  onShow: function() {
    var n = new Date()
    this.setData({
      buildTime: formatTime(n)
    })
    this.loadHistory()
    this.calcTotalBallUsed()
  },
  updatePity: function(pity) {
    var hint = ''
    var emoji = ''
    if (pity === 0) { hint = '欧皇附体'; emoji = '👑' }
    else if (pity <= 10) { hint = '人品爆发中'; emoji = '✨' }
    else if (pity <= 20) { hint = '运气不错哦'; emoji = '🍀' }
    else if (pity <= 30) { hint = '欧气满满'; emoji = '🌟' }
    else if (pity <= 40) { hint = '平平淡淡才是真'; emoji = '😐' }
    else if (pity <= 50) { hint = '有点非了...'; emoji = '😬' }
    else if (pity <= 60) { hint = '保底在向你招手'; emoji = '👀' }
    else if (pity <= 70) { hint = '马上就到了！'; emoji = '🔥' }
    else if (pity <= 75) { hint = '胜利在望！'; emoji = '⚡' }
    else { hint = '必出时刻！冲！'; emoji = '💥' }
    this.setData({ pityCount: pity, pityHint: hint, pityEmoji: emoji })
    wx.setStorageSync('pity_count', pity)
  },
  loadHistory: function() {
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
    var activeBalls = this.data.balls.filter(function(b){ return b.count > 0 })
    var pity = wx.getStorageSync('pity_count') || 0
    this.updatePity(pity)
    var rate = this.calcSuccessRate()
    var title = this.calcTitle(rate, carnivalCount + luckyBoxCount, totalCatches)
    this.setData({
      history: (wx.getStorageSync('catch_history')||[]).slice(0,20),
      initialWealth: initial,
      totalGains: gains,
      totalCosts: costs,
      accumulatedWealth: accumulated,
      totalWealth: initial + accumulated,
      wealthSet: initial > 0,
      totalCatches: totalCatches,
      successCatches: successCatches,
      successRate: rate,
      carnivalCount: carnivalCount,
      luckyBoxCount: luckyBoxCount,
      activeBalls: activeBalls,
      userTitle: title.name,
      titleColor: title.color,
      ballCheckRecords: wx.getStorageSync('ball_check_records') || []
    })
    this.updateGemCost()
  },
  onResult: function(e) {
    var r = e.currentTarget.dataset.r
    var self = this
    var resultText = r === 'success' ? '出异色了！' : '歪了...'
    var resultIcon = r === 'success' ? '✅' : '😵'
    var ballInfo = self.data.balls.filter(function(b) { return b.count > 0 })
    var ballText = ballInfo.length > 0 ? ballInfo.map(function(b) { return b.name + 'x' + b.count }).join(', ') : '未使用球'
    var totalCost = 0
    for (var i = 0; i < ballInfo.length; i++) totalCost += ballInfo[i].price * ballInfo[i].count

    wx.showActionSheet({
      itemList: ['继续累计（保留本次数据）', '清除本次捕捉（重新开始）'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.setData({ result: r })
          self.onRecordContinue()
        } else {
          self.setData({ result: r })
          self.onRecordClear()
        }
      },
      fail: function() {}
    })
  },
  onRecordContinue: function() {
    var self = this
    var balls = self.data.balls
    var result = self.data.result
    var used = balls.filter(function(b) { return b.count > 0 })
    var totalBallCost = 0
    for (var i = 0; i < used.length; i++) totalBallCost += used[i].price * used[i].count
    var catchCount = 1
    var newTotalCatches = self.data.totalCatches + catchCount
    var newSuccessCatches = self.data.successCatches + (result === 'success' ? catchCount : 0)
    var newCosts = self.data.totalCosts + totalBallCost
    wx.setStorageSync('total_catches', newTotalCatches)
    wx.setStorageSync('success_catches', newSuccessCatches)
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = self.data.totalGains - newCosts
    var resultText = result === 'success' ? '成功' : '歪了'
    var record = { time: formatTimeShort(), balls: used.map(function(b) { return b.name + 'x' + b.count }).join(', ') || '未使用球', result: resultText, total: catchCount, cost: totalBallCost, pet: '' }
    var h = [record].concat(self.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    var isShiny = (result === 'success' || result === 'miss')
    if (isShiny) self.updatePity(0)
    self.setData({
      totalCatches: newTotalCatches,
      successCatches: newSuccessCatches,
      totalCosts: newCosts,
      accumulatedWealth: accumulated,
      totalWealth: self.data.initialWealth + accumulated,
      history: h,
      result: ''
    })
    self.updateSuccessRate()
    self.updateGemCost()
    var toastMsg = totalBallCost > 0 ? '✅ 记录成功 消耗💵' + totalBallCost : '✅ 记录成功'
    if (isShiny) toastMsg = '出异色啦！消耗💵' + totalBallCost
    wx.showToast({ title: toastMsg, icon: 'none' })
  },
  onRecordClear: function() {
    var self = this
    var balls = self.data.balls
    var result = self.data.result
    var used = balls.filter(function(b) { return b.count > 0 })
    var totalBallCost = 0
    for (var i = 0; i < used.length; i++) totalBallCost += used[i].price * used[i].count
    var catchCount = 1
    var newTotalCatches = self.data.totalCatches + catchCount
    var newSuccessCatches = self.data.successCatches + (result === 'success' ? catchCount : 0)
    var newCosts = self.data.totalCosts + totalBallCost
    wx.setStorageSync('total_catches', newTotalCatches)
    wx.setStorageSync('success_catches', newSuccessCatches)
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = self.data.totalGains - newCosts
    var resultText = result === 'success' ? '成功' : '歪了'
    var record = { time: formatTimeShort(), balls: used.map(function(b) { return b.name + 'x' + b.count }).join(', ') || '未使用球', result: resultText, total: catchCount, cost: totalBallCost, pet: '' }
    var h = [record].concat(self.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    var isShiny = (result === 'success' || result === 'miss')
    if (isShiny) self.updatePity(0)
    var resetBalls = balls.map(function(b) { return { id: b.id, name: b.name, color: b.color, count: 0, rate: b.rate, price: b.price } })
    self.setData({
      balls: resetBalls,
      totalCatches: newTotalCatches,
      successCatches: newSuccessCatches,
      totalCosts: newCosts,
      accumulatedWealth: accumulated,
      totalWealth: self.data.initialWealth + accumulated,
      history: h,
      result: '',
      totalBallUsed: 0,
      selectedBall: null
    })
    self.updateSuccessRate()
    self.updateGemCost()
    var toastMsg = totalBallCost > 0 ? '✅ 已记录并清除球数据 消耗💵' + totalBallCost : '✅ 已记录并清除球数据'
    wx.showToast({ title: toastMsg, icon: 'none' })
  },
  showBallInputDialog: function() {
    var self = this
    var ballNames = []
    for (var i = 0; i < self.data.balls.length; i++) {
      ballNames.push(self.data.balls[i].name + '(' + self.data.balls[i].count + ')')
    }
    wx.showActionSheet({
      itemList: ballNames,
      success: function(res) {
        var idx = res.tapIndex
        var ball = self.data.balls[idx]
        wx.showModal({
          title: '记录 ' + ball.name,
          editable: true,
          placeholderText: '输入使用数量(当前:' + ball.count + ')',
          success: function(modalRes) {
            if (modalRes.confirm) {
              var count = parseInt(modalRes.content) || 0
              var balls = self.data.balls.slice()
              balls[idx].count += count
              var totalUsed = 0
              for (var i = 0; i < balls.length; i++) totalUsed += balls[i].count
              self.setData({ balls: balls, totalBallUsed: totalUsed })
              wx.showToast({title: ball.name + ' +' + count, icon: 'none'})
              self.onRecord()
            }
          }
        })
      },
      fail: function() {
        self.onRecord()
      }
    })
  },
  copyToClipboard: function() {
    var balls = this.data.balls, result = this.data.result
    var used = balls.filter(function(b){ return b.count > 0 })
    var ballText = used.map(function(b){ return b.name + 'x' + b.count }).join(', ') || '未使用球'
    var resultText = result === 'success' ? '成功' : result === 'miss' ? '歪了' : '中止'
    var total = 0
    var totalBallCost = 0
    for (var i = 0; i < used.length; i++) {
      total += used[i].count
      totalBallCost += used[i].price * used[i].count
    }
    var totalEncounters = this.data.carnivalCount + this.data.luckyBoxCount
    var petInfo = this.data.petNameInput ? '\n精灵名称：' + this.data.petNameInput : ''
    var text = '🎯 洛手助手捕捉记录\n' +
      '时间：' + formatTime() + '\n' +
      '结果：' + resultText + '\n' +
      '使用球：' + ballText + '\n' +
      '数量：' + total + '\n' +
      petInfo + '\n' +
      (totalBallCost > 0 ? '球消耗：💵' + totalBallCost + ' 洛克贝\n' : '') +
      '当前洛克贝：💵' + this.data.totalWealth + '\n' +
      '\n--- 奇遇事件 ---\n' +
      '🌟 狂欢时刻：' + this.data.carnivalCount + '次\n' +
      '🎁 惊喜幸运盒：' + this.data.luckyBoxCount + '次\n' +
      '🎯 触发奇遇事件次数：' + totalEncounters + '次'
    wx.setClipboardData({ data: text, success: function() { wx.showToast({ title: '已复制到剪贴板', icon: 'success' }) } })
    this.setData({ result: '' })
  },
  onToggle: function() { this.setData({ expanded: !this.data.expanded }) },
  onRecord: function() {
    var balls = this.data.balls, result = this.data.result
    var used = balls.filter(function(b){ return b.count > 0 })
    var totalBallCost = 0
    for (var i = 0; i < used.length; i++) {
      totalBallCost += used[i].price * used[i].count
    }
    var catchCount = this.data.catchCount || 1
    var newTotalCatches = this.data.totalCatches + catchCount
    var newSuccessCatches = this.data.successCatches + (result === 'success' ? catchCount : 0)
    var newCosts = this.data.totalCosts + totalBallCost
    wx.setStorageSync('total_catches', newTotalCatches)
    wx.setStorageSync('success_catches', newSuccessCatches)
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = this.data.totalGains - newCosts
    var petName = this.data.petNameInput || ''
    var resultText = result === 'success' ? '成功' : result === 'miss' ? '歪了' : '中止'
    if (petName) resultText += '(' + petName + ')'
    var record = { time: formatTimeShort(), balls: used.map(function(b){ return b.name+'x'+b.count }).join(', ')||'未使用球', result: resultText, total: catchCount, cost: totalBallCost, pet: petName }
    var h = [record].concat(this.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    
    var currentPity = this.data.pityCount;
    var luckText = '';
    if (currentPity >= 71) luckText = '非酋大保底';
    else if (currentPity >= 66) luckText = '基本必出';
    else if (currentPity >= 60) luckText = '大概率';
    else if (currentPity >= 58) luckText = '较高概率';
    else if (currentPity >= 41) luckText = '非酋';
    else if (currentPity >= 31) luckText = '大欧皇';
    else luckText = '超级欧皇';
    
    var isShiny = (result === 'success' || result === 'miss');
    if (isShiny) {
      this.updatePity(0);
    }
    
    this.setData({ balls: balls.map(function(b){ return {id:b.id,name:b.name,color:b.color,count:0,rate:b.rate,price:b.price} }), totalCatches: newTotalCatches, successCatches: newSuccessCatches, totalCosts: newCosts, accumulatedWealth: accumulated, totalWealth: this.data.initialWealth + accumulated, history: h, result: '', petNameInput: '', totalBallUsed: 0 })
    this.updateSuccessRate()
    this.updateGemCost()
    
    var toastMsg = totalBallCost > 0 ? '✅ 记录成功 消耗💵'+totalBallCost+'洛克贝' : '✅ 记录成功';
    if (isShiny) {
      toastMsg = '出异色啦！评价：' + luckText + (totalBallCost > 0 ? ' 消耗💵'+totalBallCost : '');
    }
    wx.showToast({ title: toastMsg, icon: 'none' })
  },
  calcSuccessRate: function() {
    var total = this.data.totalCatches || 0
    var success = this.data.successCatches || 0
    var encounters = this.data.luckyBoxCount
    var guaranteed = Math.floor(total / 80)
    var effectiveSuccess = success + Math.max(0, guaranteed - encounters)
    if (total === 0) return 0
    var rate = Math.round(effectiveSuccess / total * 100)
    return Math.min(rate, 100)
  },
  updateSuccessRate: function() {
    var rate = this.calcSuccessRate()
    var title = this.calcTitle(rate, this.data.carnivalCount + this.data.luckyBoxCount, this.data.totalCatches)
    this.setData({ successRate: rate, userTitle: title.name, titleColor: title.color })
  },
  calcTitle: function(rate, encounters, totalCatches) {
    if (totalCatches >= 500 && rate >= 60) return { name: '🎯 捕捉大师', color: '#00d4ff' }
    if (encounters >= 10 && rate >= 50) return { name: '🌟 异色猎人', color: '#e040fb' }
    if (rate >= 80) return { name: '👑 超级欧皇', color: '#ffab40' }
    if (rate >= 60) return { name: '✨ 欧皇', color: '#9945ff' }
    if (rate >= 45) return { name: '🍀 小欧皇', color: '#34c759' }
    if (rate >= 30) return { name: '😐 平民', color: 'rgba(255,255,255,0.5)' }
    if (rate >= 20) return { name: '😬 小非酋', color: '#ff9800' }
    return { name: '💀 非酋', color: '#ff4757' }
  },
  calcTotalBallUsed: function() {
    var total = 0
    for (var i = 0; i < this.data.balls.length; i++) {
      total += this.data.balls[i].count
    }
    this.setData({ totalBallUsed: total })
  },
  onClearHistory: function() { var self=this; wx.showModal({ title:'清空', content:'确定清空？', success:function(r){ if(r.confirm){ wx.removeStorageSync('catch_history'); wx.removeStorageSync('total_catches'); wx.removeStorageSync('success_catches'); self.setData({history:[],totalCatches:0,successCatches:0}) } } }) },
  onClearStats: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['清除所有捕捉统计', '清除奇遇事件统计', '清除所有数据'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '清除捕捉统计',
            content: '确定清除所有捕捉数据？此操作不可撤销',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('total_catches')
                wx.removeStorageSync('success_catches')
                wx.removeStorageSync('catch_history')
                wx.removeStorageSync('pity_count')
                self.setData({ totalCatches: 0, successCatches: 0, successRate: 0, history: [] })
                self.updatePity(0)
                wx.showToast({ title: '已清除', icon: 'success' })
              }
            }
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '清除奇遇事件',
            content: '确定清除所有奇遇事件统计？此操作不可撤销',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('carnival_count')
                wx.removeStorageSync('lucky_box_count')
                self.setData({ carnivalCount: 0, luckyBoxCount: 0 })
                self.updateSuccessRate()
                wx.showToast({ title: '已清除', icon: 'success' })
              }
            }
          })
        } else if (res.tapIndex === 2) {
          wx.showModal({
            title: '清除所有数据',
            content: '确定清除所有捕捉数据、奇遇事件和洛克贝记录？此操作不可撤销',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('total_catches')
                wx.removeStorageSync('success_catches')
                wx.removeStorageSync('catch_history')
                wx.removeStorageSync('carnival_count')
                wx.removeStorageSync('lucky_box_count')
                wx.removeStorageSync('initial_wealth')
                wx.removeStorageSync('total_gains')
                wx.removeStorageSync('total_costs')
                wx.removeStorageSync('pity_count')
                self.setData({
                  totalCatches: 0, successCatches: 0, successRate: 0, history: [],
                  carnivalCount: 0, luckyBoxCount: 0,
                  initialWealth: 0, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: 0, wealthSet: false
                })
                self.updatePity(0)
                wx.showToast({ title: '已清除所有数据', icon: 'success' })
              }
            }
          })
        }
      }
    })
  },
  onEncounterTab: function(e) { this.setData({ encounterTab: e.currentTarget.dataset.t }) },
  addEncounterRecord: function(type, icon, count) {
    var record = { time: formatTimeShort(), balls: type, result: '奇遇', total: 1, icon: icon, count: count }
    var h = [record].concat(this.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    this.setData({ history: h })
    
    var currentPity = wx.getStorageSync('pity_count') || 0
    var newPity = Math.min(80, currentPity + 1)
    this.updatePity(newPity)
    this.updateSuccessRate()
    
    var totalEncounters = this.data.carnivalCount + this.data.luckyBoxCount
    if (totalEncounters > 0 && totalEncounters % 10 === 0) {
      this.showBallCheckModal()
    }
  },
  onClearPity: function() {
    var currentPity = this.data.pityCount;
    var luckText = '';
    if (currentPity >= 71) luckText = '非酋大保底';
    else if (currentPity >= 66) luckText = '基本必出';
    else if (currentPity >= 60) luckText = '大概率';
    else if (currentPity >= 58) luckText = '较高概率';
    else if (currentPity >= 41) luckText = '非酋';
    else if (currentPity >= 31) luckText = '大欧皇';
    else luckText = '超级欧皇';
    
    this.updatePity(0)
    wx.showToast({ title: '保底已重置 (' + luckText + ')', icon: 'none' })
  },
  onAddCarnival: function() {
    var self = this
    var c = self.data.carnivalCount + 1
    var tc = self.data.totalCatches + 1
    var sc = self.data.successCatches + 1
    wx.setStorageSync('carnival_count', c)
    wx.setStorageSync('total_catches', tc)
    wx.setStorageSync('success_catches', sc)
    self.setData({ carnivalCount: c, totalCatches: tc, successCatches: sc })
    self.addEncounterRecord('🌟 狂欢时刻', '🌟', c)
    wx.showToast({ title: '🌟 狂欢时刻 +1', icon: 'none' })
  },
  onCarnivalLongPress: function() {
    var self = this
    var ballNames = []
    for (var i = 0; i < self.data.balls.length; i++) {
      ballNames.push(self.data.balls[i].name)
    }
    wx.showActionSheet({
      itemList: ballNames,
      success: function(res) {
        var ball = self.data.balls[res.tapIndex]
        wx.showModal({
          title: '狂欢时刻 +1',
          content: '使用 ' + ball.name + ' 触发狂欢时刻',
          editable: true,
          placeholderText: '输入捕捉数量(默认1)',
          success: function(modalRes) {
            if (modalRes.confirm) {
              var count = parseInt(modalRes.content) || 1
              var c = self.data.carnivalCount + 1
              var tc = self.data.totalCatches + count
              var sc = self.data.successCatches + count
              wx.setStorageSync('carnival_count', c)
              wx.setStorageSync('total_catches', tc)
              wx.setStorageSync('success_catches', sc)
              var balls = self.data.balls.slice()
              balls[res.tapIndex].count += count
              self.setData({ carnivalCount: c, totalCatches: tc, successCatches: sc, balls: balls })
              self.addEncounterRecord('🌟 狂欢时刻(' + ball.name + ')', '🌟', c)
              self.calcTotalBallUsed()
              wx.showToast({ title: '🌟 狂欢时刻 +1 使用' + ball.name + ' x' + count, icon: 'none' })
            }
          }
        })
      }
    })
  },
  onClearCarnival: function() { wx.removeStorageSync('carnival_count'); this.setData({carnivalCount:0}) },
  onAddLuckyBox: function() {
    var self = this
    var c = self.data.luckyBoxCount + 1
    var tc = self.data.totalCatches + 1
    var sc = self.data.successCatches + 1
    wx.setStorageSync('lucky_box_count', c)
    wx.setStorageSync('total_catches', tc)
    wx.setStorageSync('success_catches', sc)
    self.setData({ luckyBoxCount: c, totalCatches: tc, successCatches: sc })
    self.addEncounterRecord('🎁 惊喜幸运盒', '🎁', c)
    wx.showToast({ title: '🎁 惊喜幸运盒 +1', icon: 'none' })
  },
  onLuckyBoxLongPress: function() {
    var self = this
    var ballNames = []
    for (var i = 0; i < self.data.balls.length; i++) {
      ballNames.push(self.data.balls[i].name)
    }
    wx.showActionSheet({
      itemList: ballNames,
      success: function(res) {
        var ball = self.data.balls[res.tapIndex]
        wx.showModal({
          title: '惊喜幸运盒 +1',
          content: '使用 ' + ball.name + ' 触发幸运盒',
          editable: true,
          placeholderText: '输入捕捉数量(默认1)',
          success: function(modalRes) {
            if (modalRes.confirm) {
              var count = parseInt(modalRes.content) || 1
              var c = self.data.luckyBoxCount + 1
              var tc = self.data.totalCatches + count
              var sc = self.data.successCatches + count
              wx.setStorageSync('lucky_box_count', c)
              wx.setStorageSync('total_catches', tc)
              wx.setStorageSync('success_catches', sc)
              var balls = self.data.balls.slice()
              balls[res.tapIndex].count += count
              self.setData({ luckyBoxCount: c, totalCatches: tc, successCatches: sc, balls: balls })
              self.addEncounterRecord('🎁 惊喜幸运盒(' + ball.name + ')', '🎁', c)
              self.calcTotalBallUsed()
              wx.showToast({ title: '🎁 惊喜幸运盒 +1 使用' + ball.name + ' x' + count, icon: 'none' })
            }
          }
        })
      }
    })
  },
  onClearEncounter: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['清除狂欢时刻', '清除惊喜幸运盒', '清除所有异色统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '清除狂欢时刻',
            content: '确定清除狂欢时刻统计？',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('carnival_count')
                self.setData({ carnivalCount: 0 })
                self.updateSuccessRate()
                wx.showToast({ title: '已清除', icon: 'success' })
              }
            }
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '清除惊喜幸运盒',
            content: '确定清除惊喜幸运盒统计？',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('lucky_box_count')
                self.setData({ luckyBoxCount: 0 })
                self.updateSuccessRate()
                wx.showToast({ title: '已清除', icon: 'success' })
              }
            }
          })
        } else if (res.tapIndex === 2) {
          wx.showModal({
            title: '清除所有异色统计',
            content: '确定清除所有异色统计？包括狂欢时刻和惊喜幸运盒',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('carnival_count')
                wx.removeStorageSync('lucky_box_count')
                self.setData({ carnivalCount: 0, luckyBoxCount: 0 })
                self.updateSuccessRate()
                wx.showToast({ title: '已清除', icon: 'success' })
              }
            }
          })
        }
      }
    })
  },
  showBallCheckModal: function() {
    var allBalls = []
    for (var i = 0; i < this.data.balls.length; i++) {
      allBalls.push(this.data.balls[i].name)
    }
    this.setData({
      showBallCheckModal: true,
      ballCheckBall: allBalls[0] || '',
      ballCheckCount: '',
      ballCheckAllBalls: allBalls
    })
  },
  closeBallCheckModal: function() {
    this.setData({ showBallCheckModal: false })
  },
  onBallCheckBallChange: function(e) {
    this.setData({ ballCheckBall: this.data.ballCheckAllBalls[e.detail.value] })
  },
  onBallCheckCountInput: function(e) {
    this.setData({ ballCheckCount: e.detail.value })
  },
  onBallCheckConfirm: function() {
    var self = this
    var ballName = self.data.ballCheckBall
    var remaining = parseInt(self.data.ballCheckCount)
    if (!ballName) { wx.showToast({ title: '请选择球类型', icon: 'none' }); return }
    if (isNaN(remaining) || remaining < 0) { wx.showToast({ title: '请输入有效数量', icon: 'none' }); return }
    var record = { time: formatTime(), ball: ballName, remaining: remaining }
    var records = self.data.ballCheckRecords.concat([record])
    wx.setStorageSync('ball_check_records', records)
    self.setData({ showBallCheckModal: false, ballCheckRecords: records })
    wx.showToast({ title: '球剩余记录已保存', icon: 'success' })
  },
  onClearBallCheck: function() { wx.removeStorageSync('ball_check_records'); this.setData({ ballCheckRecords: [] }) },
  preventClose: function() {},
  onWealthInput: function(e) { this.setData({ coinInput: e.detail.value }) },
  onSetWealth: function() {
    var self = this
    if (self.data.wealthSet) {
      wx.showToast({title:'初始值已设置，无法修改',icon:'none'})
      return
    }
    var v = parseInt(self.data.coinInput)
    if (!v || v < 0) return
    wx.setStorageSync('initial_wealth', v)
    wx.setStorageSync('total_gains', 0)
    wx.setStorageSync('total_costs', 0)
    self.setData({ initialWealth: v, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: v, wealthSet: true, coinInput: '' })
    wx.showToast({title:'初始值已设置',icon:'success'})
  },
  onResetWealth: function() {
    var self = this
    wx.showModal({
      title: '撤销初始值',
      content: '确定要撤销初始值吗？撤销后累计数据将清空',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('initial_wealth')
          wx.removeStorageSync('total_gains')
          wx.removeStorageSync('total_costs')
          self.setData({ initialWealth: 0, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: 0, wealthSet: false })
          wx.showToast({title:'已撤销',icon:'success'})
        }
      }
    })
  },
  onAddCoins: function() {
    var self = this
    var v = parseInt(self.data.coinInput)
    if (!v) return
    var gains = self.data.totalGains + v
    wx.setStorageSync('total_gains', gains)
    var accumulated = gains - self.data.totalCosts
    self.setData({ totalGains: gains, accumulatedWealth: accumulated, totalWealth: self.data.initialWealth + accumulated, coinInput: '' })
    wx.showToast({title:'已记录',icon:'success'})
  },
  onRecordCost: function() {
    var self = this
    var v = parseInt(self.data.costInput)
    if (!v || v <= 0) return
    var costs = self.data.totalCosts + v
    wx.setStorageSync('total_costs', costs)
    var accumulated = self.data.totalGains - costs
    self.setData({ totalCosts: costs, accumulatedWealth: accumulated, totalWealth: self.data.initialWealth + accumulated, costInput: '' })
    self.updateGemCost()
    wx.showToast({title:'已记录消耗',icon:'success'})
  },
  onRecordGain: function() {
    var self = this
    var v = parseInt(self.data.gainInput)
    if (!v || v <= 0) return
    var gains = self.data.totalGains + v
    wx.setStorageSync('total_gains', gains)
    var accumulated = gains - self.data.totalCosts
    self.setData({ totalGains: gains, accumulatedWealth: accumulated, totalWealth: self.data.initialWealth + accumulated, gainInput: '' })
    wx.showToast({title:'已记录回顾',icon:'success'})
  },
  onCostInput: function(e) { this.setData({ costInput: e.detail.value }) },
  onGainInput: function(e) { this.setData({ gainInput: e.detail.value }) },
  onPetNameInput: function(e) { this.setData({ petNameInput: e.detail.value }) },
  onToggleCostMode: function() {
    var newMode = this.data.costMode === 'auto' ? 'manual' : 'auto'
    this.setData({ costMode: newMode })
    wx.showToast({title: newMode === 'auto' ? '自动计算模式' : '手动输入模式', icon: 'none'})
  },
  updateGemCost: function() {
    var gemCost = Math.ceil(this.data.totalCosts / 10)
    var cnyCost = (gemCost / 10).toFixed(1)
    this.setData({ gemCost: gemCost, cnyCost: cnyCost })
  },
  onSelectBall: function(e) {
    var idx = e.currentTarget.dataset.i
    var ball = this.data.balls[idx]
    this.setData({ selectedBall: idx, selectedBallCount: ball.count })
  },
  onBallCountInput: function(e) {
    this.setData({ selectedBallCount: parseInt(e.detail.value) || 0 })
  },
  onUseBall: function() {
    var self = this
    if (self.data.selectedBall === null) {
      wx.showToast({title:'请先选择咕噜球',icon:'none'})
      return
    }
    var ball = self.data.balls[self.data.selectedBall]
    var count = self.data.selectedBallCount
    if (count <= 0) {
      wx.showToast({title:'请输入使用数量',icon:'none'})
      return
    }
    var balls = self.data.balls.slice()
    balls[self.data.selectedBall].count = count
    var cost = ball.price * count
    var newCosts = self.data.totalCosts + cost
    var totalBallUsed = 0
    for (var i = 0; i < balls.length; i++) totalBallUsed += balls[i].count
    var activeBalls = balls.filter(function(b){ return b.count > 0 })
    if (cost > 0) {
      wx.setStorageSync('total_costs', newCosts)
      var accumulated = self.data.totalGains - newCosts
      self.setData({
        balls: balls,
        activeBalls: activeBalls,
        totalBallUsed: totalBallUsed,
        totalCosts: newCosts,
        accumulatedWealth: accumulated,
        totalWealth: self.data.initialWealth + accumulated,
        selectedBall: null,
        selectedBallCount: 0
      })
      self.updateGemCost()
      wx.showToast({title: ball.name + ' x' + count + ' 消耗💵' + cost + '洛克贝',icon:'none'})
    } else {
      self.setData({
        balls: balls,
        activeBalls: activeBalls,
        totalBallUsed: totalBallUsed,
        selectedBall: null,
        selectedBallCount: 0
      })
      wx.showToast({title: ball.name + ' x' + count + ' (免费)',icon:'none'})
    }
  },
  onSpecialTab: function(e) { var tab=e.currentTarget.dataset.t; this.setData({ specialTab:tab, specialBall:tab==='buy'?'高级咕噜球':'国王球', specialBalls:tab==='buy'?this.data.specialBalls:this.data.craftBalls }) },
  onSpecialBall: function(e) { this.setData({ specialBall: this.data.specialBalls[e.detail.value] }) },
  onSpecialCount: function(e) { this.setData({ specialCount: e.detail.value }) },
  onAddSpecial: function() {
    var self = this
    var v = parseInt(self.data.specialCount)
    if (!v || v <= 0) return
    var t = self.data.specialTab === 'buy' ? '购买' : '合成'
    var ballName = self.data.specialBall
    var ballPrice = 0
    for (var i = 0; i < self.data.balls.length; i++) {
      if (self.data.balls[i].name === ballName) {
        ballPrice = self.data.balls[i].price
        break
      }
    }
    var totalCost = ballPrice * v
    var newCosts = self.data.totalCosts + totalCost
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = self.data.totalGains - newCosts
    var h = [{type: t, ball: ballName, count: v, cost: totalCost, time: formatTime()}].concat(self.data.specialHistory).slice(0, 50)
    wx.setStorageSync('special_history', h)
    var balls = self.data.balls.slice()
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].name === ballName) {
        balls[i].count += v
        break
      }
    }
    var totalBallUsed = 0
    for (var i = 0; i < balls.length; i++) totalBallUsed += balls[i].count
    self.setData({ specialHistory: h, specialCount: '', balls: balls, expanded: true, totalBallUsed: totalBallUsed, totalCosts: newCosts, accumulatedWealth: accumulated, totalWealth: self.data.initialWealth + accumulated })
    self.updateGemCost()
    wx.showToast({title: totalCost > 0 ? t + ballName + ' +' + v + ' 消耗💵' + totalCost : t + ballName + ' +' + v, icon: 'none'})
  },
  onClearSpecial: function() { wx.removeStorageSync('special_history'); this.setData({specialHistory:[]}) },
  onClearSpecialStats: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['清空购买/合成记录', '重置所有球数量'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '清空记录',
            content: '确定清空所有购买/合成记录？',
            success: function(r) {
              if (r.confirm) {
                wx.removeStorageSync('special_history')
                self.setData({ specialHistory: [] })
                wx.showToast({ title: '已清空', icon: 'success' })
              }
            }
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '重置球数量',
            content: '确定重置所有球类型数量为0？',
            success: function(r) {
              if (r.confirm) {
                var balls = self.data.balls.slice()
                for (var i = 0; i < balls.length; i++) balls[i].count = 0
                self.setData({ balls: balls, totalBallUsed: 0 })
                wx.showToast({ title: '已重置', icon: 'success' })
              }
            }
          })
        }
      }
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
