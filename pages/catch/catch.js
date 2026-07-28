var app = getApp()
var imageConfig = require('../../config/images');
var levelUtil = require('../../utils/level')
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
    buildTime: '', sysVersion: '初始化中...', showLogShareBtn: true,
    balls: [
      {id:1,name:'普通咕噜球',color:'#999',icon:'⚪',count:0,freeCount:0,rate:'基础捕捉率',price:0},
      {id:2,name:'高级咕噜球',color:'#1565c0',icon:'🔵',count:0,freeCount:0,rate:'捕捉率+30%',price:12000},
      {id:3,name:'国王球',color:'#f57f17',icon:'👑',count:0,freeCount:0,rate:'100%捕捉，必定了不起',price:0},
      {id:4,name:'美妙球',color:'#e91e63',icon:'💚',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:5,name:'好战球',color:'#d32f2f',icon:'⚔️',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:6,name:'光合球',color:'#2e7d32',icon:'🌿',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:7,name:'网兜球',color:'#388e3c',icon:'🪢',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:8,name:'暗星球',color:'#37474f',icon:'🌙',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:9,name:'奇趣球',color:'#ff6b6b',icon:'🎯',count:0,freeCount:0,rate:'100%捕捉，资质随机',price:80000},
      {id:10,name:'补光球',color:'#ffd93d',icon:'💡',count:0,freeCount:0,rate:'100%捕捉，资质随机',price:80000},
      {id:11,name:'棱镜球',color:'#a855f7',icon:'💎',count:0,freeCount:0,rate:'100%捕捉，必定了不起，完美无瑕，天赋随机，炫彩颜色粒子随机',price:0},
      {id:12,name:'织梦棱镜球',color:'#ec4899',icon:'🔮',count:0,freeCount:0,rate:'100%捕捉，必定了不起，完美无瑕，天赋随机，炫彩粒子为当前赛季主题颜色统一',price:800},
      {id:13,name:'狂欢棱镜球',color:'#f472b6',icon:'🎆',count:0,freeCount:0,rate:'狂欢系+70%',price:800},
      {id:14,name:'变幻球',color:'#06b6d4',icon:'🌀',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:15,name:'绝缘球',color:'#8b5cf6',icon:'🛡️',count:0,freeCount:0,rate:'绝缘精灵+45%',price:3000},
      {id:16,name:'调温球',color:'#f97316',icon:'🌡️',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:17,name:'淘沙球',color:'#d4a017',icon:'🏖️',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000}
    ],
    selectedBall: null, selectedBallCount: 0, expandedBallIndex: -1,
    totalCatches: 0, successCatches: 0, successRate: 0, pityCount: 0, pityHint: '基础概率', history: [], result: '',
    initialWealth: 0, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: 0,
    coinInput: '', wealthSet: false,
    costInput: '', gainInput: '',
    petNameInput: '', catchCount: 1,
    encounterTab: 'luckybox', carnivalCount: 0, luckyBoxCount: 0,
    specialTab: 'buy', specialBall: '高级咕噜球',
    specialBalls: ['绝缘球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','奇趣球','补光球','国王球','棱镜球','织梦棱镜球','狂欢棱镜球','淘沙球'],
    craftBalls: ['国王球','绝缘球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','棱镜球','淘沙球'],
    attributeBalls: ['绝缘球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','淘沙球'],
    specialCount: '', specialHistory: [],
    totalBallUsed: 0,
    hasActiveBalls: false,
    ballDecrease: {},
    showFairytaleParticles: false,
    canStartCapture: false,
    showResultBallModal: false,
    resultType: '',
    resultBall: '',
    resultBallCount: '',
    resultBallList: [],
    resultGainInput: '', resultPetName: '', resultPetImageUrl: '',
    resultRemark: '',
    costMode: 'auto',
    gemCost: 0,
    cnyCost: '0',
    userTitle: '😐 平民',
    titleColor: 'rgba(255,255,255,0.5)',
    showBallCheckModal: false,
    ballCheckRecords: [],
    captureAnim: false,
    autoResetPity: false,
    quickRecordMode: false,
    showWealthAdjustModal: false,
    adjustType: 'add',
    adjustAmount: '',
    adjustRemark: '',
    resultMultiBalls: [],
    checkMultiBalls: [],
    brushMode: 'single',
    resultMixedPets: [{ name: '' }],
    resultMixedPetNames: [],
    resultTargetPet: '',
    showMoreFields: false,
    captureStartTime: 0
  },
  saveBallsToStorage: function(balls) {
    if (balls) {
      wx.setStorageSync('catch_balls', balls.map(function(b) {
        return { id: b.id, count: b.count, freeCount: b.freeCount, img: b.img || '' };
      }));
    }
  },
  onLoad: function() {
    this.fetchCloudBalls();
    this.preloadBallImages();
  },
  preloadBallImages: function() {
    var urls = [];
    var balls = this.data.balls || [];
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].img && balls[i].img.indexOf('http') === 0) urls.push(balls[i].img);
    }
    // 预加载球图片到本地缓存
    for (var j = 0; j < urls.length; j++) {
      wx.getImageInfo({ src: urls[j] });
    }
  },
    fetchCloudBalls: function() {
    this.setData({ sysVersion: '获取云端数据...' });
    if (wx.cloud) {
      wx.cloud.database().collection('site_config').doc('ball_images').get().then(res => {
        if (res.data && res.data.balls && res.data.balls.length > 0) {
          this.syncBallsConfig(res.data.balls);
        } else {
          this.syncBallsConfig(this.data.balls); // use default if DB empty
        }
        this.setData({ sysVersion: '已实时同步 | ' + formatTimeShort() });
      }).catch(err => {
        this.syncBallsConfig(this.data.balls);
        this.setData({ sysVersion: '离线模式(使用缓存)' });
      });
    } else {
      this.syncBallsConfig(this.data.balls);
      this.setData({ sysVersion: '离线模式' });
    }
  },
  syncBallsConfig: function(cloudBalls) {
    var self = this;
    var localBalls = wx.getStorageSync('catch_balls') || [];
    var localMap = {};
    for (var i = 0; i < localBalls.length; i++) {
      localMap[localBalls[i].id] = localBalls[i];
    }
    
    var mergedBalls = [];
    var specialBalls = [];
    var craftBalls = [];
    
    for (var j = 0; j < cloudBalls.length; j++) {
      var cb = cloudBalls[j];
      var lb = localMap[cb.id] || { count: 0, freeCount: 0 };
      var rateDesc = cb.desc || cb.rate || '';
      mergedBalls.push({
        id: cb.id,
        name: cb.name,
        color: cb.color || '#ffffff',
        icon: cb.icon || '⚪',
        count: lb.count || 0,
        freeCount: lb.freeCount || 0,
        rate: rateDesc,
        price: cb.price || 0,
        img: cb.img || lb.img || '',
        source: cb.source || ''
      });
      if (cb.isBuy) specialBalls.push(cb.name);
      if (cb.isCraft) craftBalls.push(cb.name);
    }
    
    self.setData({
      balls: mergedBalls,
      specialBalls: specialBalls.length > 0 ? specialBalls : self.data.specialBalls,
      craftBalls: craftBalls.length > 0 ? craftBalls : self.data.craftBalls
    });
    wx.setStorageSync('catch_balls', mergedBalls);
    self.loadHistory();
    self.calcTotalBallUsed();
  },
  toggleBallDesc: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.expandedBallIndex === index) {
      this.setData({ expandedBallIndex: -1 });
    } else {
      this.setData({ expandedBallIndex: index });
    }
  },
  onShow: function() {
    var n = new Date()
    this.setData({
      buildTime: formatTime(n)
    })
    if (wx.getStorageSync('balls_config_updated')) {
      wx.removeStorageSync('balls_config_updated');
      this.fetchCloudBalls();
    }
    this.loadHistory()
    this.calcTotalBallUsed()
  },
  updatePity: function(pity) {
    var hint = ''
    var emoji = ''
    if (pity === 0) { hint = '迪莫的亲吻'; emoji = '👑' }
    else if (pity <= 10) { hint = '星辰塔庇护'; emoji = '✨' }
    else if (pity <= 20) { hint = '魔法阵共鸣'; emoji = '🍀' }
    else if (pity <= 30) { hint = '光之蔓延'; emoji = '🌟' }
    else if (pity <= 40) { hint = '魔法学院日常'; emoji = '😐' }
    else if (pity <= 50) { hint = '威廉古堡迷雾'; emoji = '🌫️' }
    else if (pity <= 60) { hint = '恩佐在靠近'; emoji = '🔥' }
    else if (pity <= 70) { hint = '咕噜球在颤抖'; emoji = '🌅' }
    else if (pity <= 75) { hint = '捕捉光环闪烁'; emoji = '⏳' }
    else { hint = '绝对捕捉时刻！'; emoji = '⚡' }
    this.setData({ pityCount: pity, pityHint: hint, pityEmoji: emoji })
    wx.setStorageSync('pity_count', pity)
  },
  loadHistory: function() {
    var wealthIsSet = wx.getStorageSync('wealth_is_set') === true;
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
          var profitRate = initial > 0 ? ((accumulated / initial) * 100).toFixed(1) : (accumulated > 0 ? '100.0' : '0.0')
      var rate = this.calcSuccessRate()
    var title = this.calcTitle(rate, carnivalCount + luckyBoxCount, totalCatches)
    var rawHistory = (wx.getStorageSync('catch_history')||[]).slice(0,20);
    this.setData({
      history: rawHistory,
      initialWealth: initial,
      totalGains: gains,
      totalCosts: costs,
      accumulatedWealth: accumulated,
      totalWealth: initial + accumulated,
      wealthSet: wealthIsSet,
        profitRate: profitRate,
      totalCatches: totalCatches,
      successCatches: successCatches,
      successRate: rate,
      carnivalCount: carnivalCount,
      luckyBoxCount: luckyBoxCount,
      hasActiveBalls: activeBalls.length > 0,
      canStartCapture: wealthIsSet && activeBalls.length > 0,
      userTitle: title.name,
      titleColor: title.color,
      ballCheckRecords: wx.getStorageSync('ball_check_records') || [],
      usedBallTotal: wx.getStorageSync('used_ball_total') || 0,
      autoResetPity: wx.getStorageSync('auto_reset_pity') || false,
      quickRecordMode: wx.getStorageSync('quick_record_mode') || false,
      specialHistory: wx.getStorageSync('special_history') || []
    })
    this.updateGemCost()
  },

  onResultMultiBallRemainInput: function(e) {
    var idx = e.currentTarget.dataset.index;
    var arr = this.data.resultMultiBalls;
    arr[idx].remain = e.detail.value;
    this.setData({ resultMultiBalls: arr });
  },
  onBrushModeSwitch: function(e) {
    var mode = e.currentTarget.dataset.mode;
    var update = { brushMode: mode };
    if (mode === 'mixed' && this.data.resultPetName) {
      // 单刷→混刷：携带精灵名到混刷列表第一项
      update.resultMixedPets = [{ name: this.data.resultPetName }];
      update.resultMixedPetNames = [this.data.resultPetName];
    } else if (mode === 'single' && this.data.resultTargetPet) {
      // 混刷→单刷：携带目标精灵到单刷名
      update.resultPetName = this.data.resultTargetPet;
    }
    this.setData(update);
  },
  _refreshMixedPetNames: function() {
    var names = [];
    var arr = this.data.resultMixedPets || [];
    for (var i = 0; i < arr.length; i++) {
      var n = (arr[i].name || '').trim();
      if (n) names.push(n);
    }
    this.setData({ resultMixedPetNames: names });
  },
  onMixedPetNameInput: function(e) {
    var idx = e.currentTarget.dataset.index;
    var arr = this.data.resultMixedPets;
    arr[idx].name = e.detail.value;
    this.setData({ resultMixedPets: arr });
    this._refreshMixedPetNames();
  },
  onAddMixedPet: function() {
    var arr = this.data.resultMixedPets;
    arr.push({ name: '' });
    this.setData({ resultMixedPets: arr });
  },
  onRemoveMixedPet: function(e) {
    var idx = e.currentTarget.dataset.index;
    var arr = this.data.resultMixedPets;
    arr.splice(idx, 1);
    this.setData({ resultMixedPets: arr });
    this._refreshMixedPetNames();
  },
  onToggleMoreFields: function() {
    this.setData({ showMoreFields: !this.data.showMoreFields });
  },
  onTargetPetInput: function(e) {
    this.setData({ resultTargetPet: e.detail.value });
  },
  onCheckMultiBallRemainInput: function(e) {
    var idx = e.currentTarget.dataset.index;
    var arr = this.data.checkMultiBalls;
    arr[idx].remain = e.detail.value;
    this.setData({ checkMultiBalls: arr });
  },
  onLongResult: function(e) { this.onResult(e) },
    var r = e.currentTarget.dataset.r
    var self = this
    if (r === 'success') {
      self.setData({ captureAnim: true })
      setTimeout(function() { self.setData({ captureAnim: false }) }, 600)
    } else if (r === 'miss') {
      self.setData({ missAnim: true })
      setTimeout(function() { self.setData({ missAnim: false }) }, 600)
    }
    // 自适应同步仓库中购买/合成过的球
    var history = self.data.specialHistory || [];
    var purchased = {};
    for (var h = 0; h < history.length; h++) { purchased[history[h].ball] = true; }
    var items = [];
    // 计算各球累计购买/合成总量
    var totalBought = {};
    for (var h2 = 0; h2 < history.length; h2++) {
      var bh = history[h2];
      totalBought[bh.ball] = (totalBought[bh.ball] || 0) + bh.count;
    }
    // 上次盘点剩余
    var lastCheck = {};
    var checkRecords = self.data.ballCheckRecords || [];
    for (var cr = checkRecords.length - 1; cr >= 0; cr--) {
      var rc = checkRecords[cr];
      if (lastCheck[rc.ball] === undefined) lastCheck[rc.ball] = rc.remaining;
    }
    for (var i = 0; i < self.data.balls.length; i++) {
      var b = self.data.balls[i];
      if (purchased[b.name]) {
        var lastR = lastCheck[b.name];
        items.push({ name: b.name, remain: lastR !== undefined ? String(lastR) : '', currentCount: totalBought[b.name] || b.count || 0 });
      }
    }
    // 自动计时：从首次点击奇遇到现在
    var autoElapsed = '';
    if (self.data.captureStartTime) {
      var el = Math.floor((Date.now() - self.data.captureStartTime) / 1000);
      var eh = Math.floor(el / 3600);
      var em = Math.floor((el % 3600) / 60);
      var es = el % 60;
      autoElapsed = (eh > 0 ? eh + '小时' : '') + (em > 0 ? em + '分' : '') + es + '秒 (自动)';
    }
    self.setData({
      showResultBallModal: true,
      resultType: r,
      resultMultiBalls: items,
      resultRemark: '',
      brushMode: 'single',
      resultMixedPets: [{ name: '' }],
      resultMixedPetNames: [],
      resultTargetPet: '',
      showMoreFields: false,
      resultElapsedTime: autoElapsed
    })
    this.setData({ lastUsedBallImageUrl: '' })
  },
  onResultBallChange: function(e) {
    this.setData({ resultBall: this.data.resultBallList[e.detail.value] })
  },
  onResultBallCountInput: function(e) {
    this.setData({ resultBallCount: e.detail.value })
  },
  onResultGainInput: function(e) {
    this.setData({ resultGainInput: e.detail.value })
  },
    onResultPetNameInput: function(e) {
    this.setData({ resultPetName: e.detail.value })
  },
  onResultPetImageUrlInput: function(e) {
    this.setData({ resultPetImageUrl: e.detail.value })
  },
  onResultElapsedTimeInput: function(e) {
    this.setData({ resultElapsedTime: e.detail.value })
  },
  onResultRemarkInput: function(e) {
    this.setData({ resultRemark: e.detail.value })
  },
  closeResultBallModal: function() {
    this.setData({ showResultBallModal: false })
  },
  onContinuePityChange: function(e) {
    this.setData({ continuePity: e.detail.value })
  },
  onResultBallConfirm: function() {
    var self = this;
    var r = self.data.resultType;
    var gainVal = parseInt(self.data.resultGainInput) || 0;
    var multi = self.data.resultMultiBalls || [];
    
    // 收集混刷精灵名称
    var resultMixedPetNames = '';
    if (self.data.brushMode === 'mixed') {
      var mixedNames = [];
      var mixedArr = self.data.resultMixedPets || [];
      for (var p = 0; p < mixedArr.length; p++) {
        var n = (mixedArr[p].name || '').trim();
        if (n) mixedNames.push(n);
      }
      resultMixedPetNames = mixedNames.join(', ');
    }
    
    // 结果目标精灵: 单刷= petName, 混刷= picker选择
    var resultTargetPet = '';
    if (self.data.brushMode === 'mixed') {
      resultTargetPet = self.data.resultTargetPet || '';
    } else {
      resultTargetPet = self.data.resultPetName || '';
    }
    
    self.setData({ showResultBallModal: false, result: r, resultGainInput: '' });
    
    var balls = self.data.balls.slice();
    var totalUsedCount = 0;
    var usedBallNames = [];
    
    for (var m = 0; m < multi.length; m++) {
      var item = multi[m];
      if (!item.name) continue;
      // 未输入剩余则取上次盘点值
      var remainVal = item.remain;
      if (remainVal === '' || remainVal === null) {
        var lastCheck = {};
        var checkRecords = self.data.ballCheckRecords || [];
        for (var cr = checkRecords.length - 1; cr >= 0; cr--) {
          var rc = checkRecords[cr];
          if (lastCheck[rc.ball] === undefined) lastCheck[rc.ball] = rc.remaining;
        }
        remainVal = lastCheck[item.name];
        if (remainVal === undefined) remainVal = 0;
      }
      var remainingCount = parseInt(remainVal);
      if (isNaN(remainingCount) || remainingCount < 0) remainingCount = 0;
      
      for (var i = 0; i < balls.length; i++) {
        if (balls[i].name === item.name) {
          var oldCount = item.currentCount || balls[i].count;
          var newCount = remainingCount;
          if (newCount > oldCount) newCount = oldCount;
          var usedCount = oldCount - newCount;
          
          balls[i].count = newCount;
          totalUsedCount += usedCount;
          usedBallNames.push(balls[i].name + 'x' + usedCount);
          if (usedCount > 0) {
            if(!self._lastUsedBallImg && balls[i].img) self._lastUsedBallImg = balls[i].img;
            var freeConsume = Math.min(usedCount, balls[i].freeCount);
            balls[i].freeCount = Math.max(0, balls[i].freeCount - freeConsume);
          }
          break;
        }
      }
    }
    
    var totalBallUsed = 0;
    for (var j = 0; j < balls.length; j++) totalBallUsed += balls[j].count;
    var newUsedBallTotal = self.data.usedBallTotal + totalUsedCount;
    wx.setStorageSync('used_ball_total', newUsedBallTotal);
    var hasActive = false;
    for (var k = 0; k < balls.length; k++) { if (balls[k].count > 0) { hasActive = true; break; } }
    self.saveBallsToStorage(balls);
    
    var lastUsedStr = usedBallNames.join(', ');
    // 自动计时：如果用户没有手动修改，则保持自动计算结果
    var resultElapsedAuto = (self.data.resultElapsedTime || '').indexOf('(自动)') >= 0;
    var resultElapsedTime = self.data.resultElapsedTime || '';
    if (!resultElapsedTime || resultElapsedTime.indexOf('(自动)') >= 0) {
      if (self.data.captureStartTime) {
        var elapsed = Math.floor((Date.now() - self.data.captureStartTime) / 1000);
        var h = Math.floor(elapsed / 3600);
        var m = Math.floor((elapsed % 3600) / 60);
        var s = elapsed % 60;
        resultElapsedTime = (h > 0 ? h + '小时' : '') + (m > 0 ? m + '分' : '') + s + '秒';
        resultElapsedAuto = true;
      }
    } else if (resultElapsedTime) {
      resultElapsedTime = resultElapsedTime.replace(' (自动)', '');
      resultElapsedAuto = false;
    }
    self.setData({ balls: balls, totalBallUsed: totalBallUsed, usedBallTotal: newUsedBallTotal, hasActiveBalls: hasActive, canStartCapture: self.data.wealthSet && hasActive, lastUsedCount: totalUsedCount, lastUsedBallName: lastUsedStr });
    if (gainVal !== 0) {
      var newGains = self.data.totalGains + gainVal
      wx.setStorageSync('total_gains', newGains)
      var newAccumulated = newGains - self.data.totalCosts
      self.setData({ totalGains: newGains, accumulatedWealth: newAccumulated, totalWealth: self.data.initialWealth + newAccumulated })
      self.updateGemCost()
    }
    if (self.data.result === 'success') {
      self.onRecordClear();
    } else {
      wx.showActionSheet({
        itemList: ['继续累计（保留本次数据）', '清除本次捕捉（重新开始）'],
        success: function(res) {
          if (res.tapIndex === 0) {
            self.onRecordContinue()
          } else {
            self.onRecordClear()
          }
        },
        fail: function() {}
      })
    }
  },
  onRecordContinue: function() {
    var self = this
    var balls = self.data.balls
    var result = self.data.result
          var usedStr = self.data.lastUsedBallName && self.data.lastUsedBallName.length > 2 ? self.data.lastUsedBallName : '未使用球';
      var totalBallCost = 0; // 费用已在购买时扣除，此处不再重复计费
      var catchCount = 1
      var newTotalCatches = self.data.totalCatches + catchCount
      var newSuccessCatches = self.data.successCatches + (result === 'success' ? catchCount : 0)
      var newCosts = self.data.totalCosts // 保持不变
      wx.setStorageSync('total_catches', newTotalCatches)
      wx.setStorageSync('success_catches', newSuccessCatches)
      var accumulated = self.data.totalGains - newCosts
      var resultText = result === 'success' ? '异色捕获成功' : '歪了'
      var remark = self.data.resultRemark || ''
      var totalEncountersForRecord = self.data.carnivalCount + self.data.luckyBoxCount;
      var record = { time: formatTimeShort(), balls: usedStr, result: resultText, remark: remark, total: catchCount, cost: 0, pet: self.data.resultPetName || '', petImageUrl: self.data.resultPetImageUrl || '', resultRaw: result, elapsedTimeText: resultElapsedTime ? '耗时: ' + resultElapsedTime : '', ballImageUrl: self._lastUsedBallImg || '', encounters: totalEncountersForRecord, brushMode: self.data.brushMode || 'single', mixedPets: resultMixedPetNames || '', targetPet: resultTargetPet || '', carnivalCount: self.data.carnivalCount || 0, luckyBoxCount: self.data.luckyBoxCount || 0, pityBefore: self.data.pityCount || 0, elapsedAuto: resultElapsedAuto || false }
      if (resultElapsedTime) self.setData({ resultElapsedTime: resultElapsedTime, resultElapsedAuto: resultElapsedAuto })
      
      self.setData({ lastUsedBallName: '', lastUsedCount: 0 }); // reset
    var h = [record].concat(self.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    var isShiny = (result === 'success' || result === 'miss');
      if (isShiny && self.data.autoResetPity) {
        if (result === 'miss' && self.data.continuePity) {
          var currentPity = wx.getStorageSync('pity_count') || 0;
          self.updatePity(currentPity + 1);
        } else {
          self.updatePity(0);
        }
      }
    var usedCount = self.data.lastUsedCount || 0
    var newUsedBallTotal = self.data.usedBallTotal + usedCount
    wx.setStorageSync('used_ball_total', newUsedBallTotal)
    self.setData({
      totalCatches: newTotalCatches,
      successCatches: newSuccessCatches,
      totalCosts: newCosts,
      accumulatedWealth: accumulated,
      totalWealth: self.data.initialWealth + accumulated,
      history: h,
      result: '',
      usedBallTotal: newUsedBallTotal
    })
    self.updateSuccessRate()
    self.updateGemCost()
    var toastMsg = totalBallCost > 0 ? '✅ 记录成功 消耗💵' + totalBallCost : '✅ 记录成功'
    if (isShiny) toastMsg = '✨ 捕获成功！消耗💵' + totalBallCost
    wx.showToast({ title: toastMsg, icon: 'none' })
  },
  onRecordClear: function() {
    var self = this
    var balls = self.data.balls
    var result = self.data.result
          var usedStr = self.data.lastUsedBallName && self.data.lastUsedBallName.length > 2 ? self.data.lastUsedBallName : '未使用球';
      var totalBallCost = 0;
      var catchCount = 1
      var newTotalCatches = self.data.totalCatches + catchCount
      var newSuccessCatches = self.data.successCatches + (result === 'success' ? catchCount : 0)
      var newCosts = self.data.totalCosts // 保持不变
      wx.setStorageSync('total_catches', newTotalCatches)
      wx.setStorageSync('success_catches', newSuccessCatches)
      var accumulated = self.data.totalGains - newCosts
      var resultText = result === 'success' ? '异色捕获成功' : '歪了'
      var remark = self.data.resultRemark || ''
      var totalEncountersForRecord = self.data.carnivalCount + self.data.luckyBoxCount;
      var record = { time: formatTimeShort(), balls: usedStr, result: resultText, remark: remark, total: catchCount, cost: 0, pet: self.data.resultPetName || '', petImageUrl: self.data.resultPetImageUrl || '', resultRaw: result, elapsedTimeText: resultElapsedTime ? '耗时: ' + resultElapsedTime : '', ballImageUrl: self._lastUsedBallImg || '', encounters: totalEncountersForRecord, brushMode: self.data.brushMode || 'single', mixedPets: resultMixedPetNames || '', targetPet: resultTargetPet || '', carnivalCount: self.data.carnivalCount || 0, luckyBoxCount: self.data.luckyBoxCount || 0, pityBefore: self.data.pityCount || 0, elapsedAuto: resultElapsedAuto || false }
      if (resultElapsedTime) self.setData({ resultElapsedTime: resultElapsedTime, resultElapsedAuto: resultElapsedAuto })
      
      self.setData({ lastUsedBallName: '', lastUsedCount: 0 }); // reset
    var h = [record].concat(self.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    var isShiny = (result === 'success' || result === 'miss');
      if (isShiny && self.data.autoResetPity) {
        if (result === 'miss' && self.data.continuePity) {
          var currentPity = wx.getStorageSync('pity_count') || 0;
          self.updatePity(currentPity + 1);
        } else {
          self.updatePity(0);
        }
      } else {
        var currentPity = wx.getStorageSync('pity_count') || 0;
        self.updatePity(currentPity + 1);
      }
    
    // Do NOT clear global inventory (balls array).
    wx.removeStorageSync('carnival_count');
    wx.removeStorageSync('lucky_box_count');
    self.setData({
      carnivalCount: 0,
      luckyBoxCount: 0,
      totalCatches: newTotalCatches,
      successCatches: newSuccessCatches,
      totalCosts: newCosts,
      accumulatedWealth: accumulated,
      totalWealth: self.data.initialWealth + accumulated,
      history: h,
      result: '',
      selectedBall: null
    })
    self.updateSuccessRate()
    self.updateGemCost()
    var toastMsg = totalBallCost > 0 ? '✅ 已记录并清除球数据 消耗💵' + totalBallCost : '✅ 已记录并清除球数据'
    wx.showToast({ title: toastMsg, icon: 'none' })
  },
  
    onGenerateImage: function() {
    var self = this;
    wx.showLoading({ title: '生成高阶战报中...' });
    
    const query = wx.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) {
        wx.hideLoading();
        if(self.copyToClipboard) self.copyToClipboard();
        wx.showToast({ title: '生成图片失败，已为您复制文本', icon: 'none' });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      
      const width = 400;
      let height = 700;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, '#0f172a');
      grd.addColorStop(1, '#000000');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      const orb = ctx.createRadialGradient(width, 0, 10, width, 0, 350);
      orb.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
      orb.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, width, height);
      
      const roundRect = (x, y, w, h, r, fill, stroke) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
      };

      ctx.fillStyle = '#00d4ff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('异色捕捉统计战报', width / 2 + 20, 50);
      ctx.textAlign = 'left';

      roundRect(20, 80, width - 40, 140, 12, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)');
      
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('生成时间', 40, 115);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(self.data.buildTime, 40, 135);

      let totalEncounters = self.data.carnivalCount + self.data.luckyBoxCount;
      if (totalEncounters === 0 && self.data.history && self.data.history.length > 0 && self.data.history[0].encounters !== undefined) { totalEncounters = self.data.history[0].encounters; }
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('累计奇遇', width/2 + 20, 115);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(totalEncounters + ' 次', width/2 + 20, 135);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText('欧皇评级', 40, 175);
      ctx.fillStyle = '#ffab40';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText((self.data.userTitle || '').replace(/[^\u4e00-\u9fa5]/g, ''), 40, 195);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('总盈亏', width/2 + 20, 175);
      if (self.data.accumulatedWealth === 0 || self.data.accumulatedWealth === '0') {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('不允透露', width/2 + 20, 195);
      } else {
        ctx.fillStyle = self.data.accumulatedWealth >= 0 ? '#4ade80' : '#f87171';
        ctx.fillText((self.data.accumulatedWealth >= 0 ? '+' : '') + self.data.accumulatedWealth, width/2 + 42, 195);
      }

      // ── 预计算画布高度 ──
      var hasHistory = self.data.history && self.data.history.length > 0;
      var last = null;
      if (hasHistory) {
        for (var li = 0; li < self.data.history.length; li++) {
          if (self.data.history[li].result !== '微调') { last = self.data.history[li]; break; }
        }
      }
      var parsedBalls = [];
      var remarkOffset = 0;
      var ballGridHeight = 0;
      
      if (last) {
        var ballsRaw = (last.balls || '').replace(/^\[盘点\]\s*/, '').replace(/^📋\s*/, '').replace(/[✨🌟💰💫📋]/g, '').trim();
        if (ballsRaw && ballsRaw !== '未使用球') {
          var parts = ballsRaw.split(',');
          for (var bi = 0; bi < parts.length; bi++) {
            var part = parts[bi].trim();
            if (!part) continue;
            var count = 0;
            var name = part;
            var remainMatch = part.match(/^(.+?)剩余(\d+)/);
            if (remainMatch) { name = remainMatch[1].trim(); count = parseInt(remainMatch[2]) || 0; }
            else {
              var xMatch = part.match(/^(.+?)\s*x(\d+)(?:\s*个)?$/);
              if (xMatch) { name = xMatch[1].trim(); count = parseInt(xMatch[2]) || 0; }
            }
            var ballImg = '';
            var allBalls = self.data.balls || [];
            for (var bj = 0; bj < allBalls.length; bj++) {
              if (allBalls[bj].name === name) { ballImg = allBalls[bj].img || ''; break; }
            }
            parsedBalls.push({ name: name, count: count, img: ballImg });
          }
        }
        var remark = last.remark;
        if (!remark && (last.result||'').indexOf('(') > -1) {
          var rIdx = (last.result||'').indexOf('(');
          remark = (last.result||'').substring(rIdx + 1).replace(/\)+$/, '').trim();
        }
        if (remark) remarkOffset = Math.min(2, Math.ceil(remark.length / 26)) * 18;
        var ballRows = parsedBalls.length > 0 ? Math.ceil(parsedBalls.length / 2) : 0;
        ballGridHeight = ballRows * 28;
      }
      
      height = Math.max(700, (hasHistory ? 680 : 0) + ballGridHeight + remarkOffset + 60);
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // 内容缩放系数：超长内容时所有图标等比缩小
      var imgScale = height > 700 ? Math.max(0.6, 1 - (height - 700) / 800) : 1;
      
      var loadImg = function(url, onLoad) {
        if (!url) return;
        wx.getImageInfo({ src: url,
          success: function(info) {
            var img = canvas.createImage(); img.src = info.path;
            img.onload = function() { onLoad(img); };
            img.onerror = function() {};
          },
          fail: function() {}
        });
      };
      
      // 背景
      var bgGrd = ctx.createLinearGradient(0, 0, 0, height);
      bgGrd.addColorStop(0, '#0d1117'); bgGrd.addColorStop(1, '#010409');
      ctx.fillStyle = bgGrd; ctx.fillRect(0, 0, width, height);
      
      // ═══ 头部 ═══
      ctx.fillStyle = '#e6edf3';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('异色捕捉统计战报', width / 2 + 20, 50); ctx.textAlign = 'left';
      loadImg('https://patchwiki.biligame.com/images/rocom/2/2e/buxc6y4s0r7d8ix03zzkahnk4h8urtv.png', function(img) {
        var s = Math.round(28 * imgScale);
        ctx.drawImage(img, width / 2 - 110, 26 + (28-s)/2, s, s);
      });
      roundRect(20, 80, width - 40, 140, 14, 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.06)');
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('生成时间', 36, 115); ctx.fillStyle = '#e6edf3'; ctx.font = '13px sans-serif'; ctx.fillText(self.data.buildTime, 36, 135);
      var totalE = self.data.carnivalCount + self.data.luckyBoxCount;
      if (totalE === 0 && last && last.encounters !== undefined) totalE = last.encounters;
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText('累计奇遇', width/2 + 16, 115);
      ctx.fillStyle = '#e6edf3'; ctx.font = '13px sans-serif'; ctx.fillText(totalE + ' 次', width/2 + 16, 135);
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText('欧皇评级', 36, 175);
      ctx.fillStyle = '#ffab40'; ctx.font = 'bold 14px sans-serif';
      ctx.fillText((self.data.userTitle||'').replace(/[^\u4e00-\u9fa5]/g, ''), 36, 195);
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('总盈亏', width/2 + 16, 175);
      if (self.data.accumulatedWealth === 0 || self.data.accumulatedWealth === '0') {
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText('不允透露', width/2 + 16, 195);
      } else {
        var isGain = self.data.accumulatedWealth >= 0;
        ctx.fillStyle = isGain ? '#3fb950' : '#f85149';
        ctx.fillText((isGain ? '盈利' : '亏损') + Math.abs(self.data.accumulatedWealth), width/2 + 16, 195);
      }
      
      // ═══ 历史记录 ═══
      if (last) {
        var boxH = 370 + ballGridHeight + remarkOffset;
        roundRect(20, 240, width - 40, boxH, 12, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
        
        // 🚀 最新记录 + 标签
        ctx.fillStyle = '#e6edf3';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('最新记录', 36, 280);
        
        var brushMode = last.brushMode || 'single';
        ctx.font = '11px sans-serif';
        var tagW = ctx.measureText(brushMode === 'mixed' ? '混刷' : '单刷').width + 14;
        var tagX = width - 40 - tagW;
        if (brushMode === 'mixed') {
          roundRect(tagX, 264, tagW, 20, 4, 'rgba(224,64,251,0.08)', 'rgba(224,64,251,0.2)');
          ctx.fillStyle = '#d2a8ff';
        } else {
          roundRect(tagX, 264, tagW, 20, 4, 'rgba(125,200,255,0.08)', 'rgba(125,200,255,0.2)');
          ctx.fillStyle = '#79c0ff';
        }
        ctx.fillText(brushMode === 'mixed' ? '混刷' : '单刷', tagX + 7, 279);
        ctx.font = '13px sans-serif';
        
        // 状态 + 混刷列表同行
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('状态', 36, 320);
        var resText = last.result || '未知';
        ctx.fillStyle = last.resultRaw === 'success' ? '#4ade80' : (last.resultRaw === 'miss' ? '#f87171' : '#ffffff');
        ctx.fillText(resText.indexOf('(')>-1 ? resText.substring(0, resText.indexOf('(')).trim() : resText, 80, 320);
        
        // 混刷列表在状态行右侧
        if (brushMode === 'mixed' && last.mixedPets) {
          ctx.font = '11px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.textAlign = 'right';
          var maxW = width - 40 - 80 - 12;
          var mixedText = last.mixedPets;
          while (ctx.measureText(mixedText).width > maxW && mixedText.length > 3) {
            mixedText = mixedText.substring(0, mixedText.length - 1);
          }
          if (mixedText !== last.mixedPets) mixedText += '…';
          ctx.fillText(mixedText, width - 40, 320);
          ctx.textAlign = 'left';
          ctx.font = '14px sans-serif';
        }
        
        // 备注
        var remarkRender = last.remark || '';
        if (!remarkRender && (last.result||'').indexOf('(')>-1) {
          remarkRender = (last.result||'').substring((last.result||'').indexOf('(')+1).replace(/\)+$/, '').trim();
        }
        if (remarkRender) {
          var rlines = [];
          var rt = remarkRender;
          var maxR = 2;
          while (rt.length > 0 && rlines.length < maxR) {
            if (rt.length <= 26) { rlines.push(rt); break; }
            rlines.push(rt.substring(0, 26)); rt = rt.substring(26);
          }
          rlines.forEach(function(line, i) {
            ctx.font = '12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.42)';
            ctx.fillText('· ' + line, 55, 342 + i * 18);
            ctx.font = '14px sans-serif';
          });
        }

        // 精灵名称（显示捕获/歪了的那只）
        var petNameY = 372 + remarkOffset;
        ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif';
        ctx.fillText('精灵名称', 36, petNameY);
        
        var resultPet = last.targetPet || last.pet || '';
        if (resultPet) {
          ctx.fillStyle = (last.resultRaw === 'success' ? '#4ade80' : (last.resultRaw === 'miss' ? '#f87171' : '#ffffff'));
          ctx.fillText(resultPet, 106, petNameY);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillText('未填写', 106, petNameY);
        }

        if (last.elapsedTimeText) {
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('捕捉耗时', width/2 - 4, petNameY);
          ctx.fillStyle = '#ffffff';
          var et = last.elapsedTimeText.replace('耗时: ', '').trim() || '未知';
          if (last.elapsedAuto) et += ' (仅供参考)';
          ctx.font = '12px sans-serif';
          var maxEtW = width - 40 - (width/2 + 70) - 4;
          if (ctx.measureText(et).width > maxEtW) {
            while (et.length > 2 && ctx.measureText(et + '…').width > maxEtW) et = et.slice(0, -1);
            et += '…';
          }
          ctx.fillText(et, width/2 + 70, petNameY);
          ctx.font = '14px sans-serif';
        }

        // ── 消耗球类 ──
        var ballSectionY = 412 + remarkOffset;
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('消耗球类', 36, ballSectionY);
        
        if (parsedBalls.length === 1) {
          // 单球：内联显示「消耗球类: [icon] 球名 x N 个」
          var ball = parsedBalls[0];
          var inlineY = ballSectionY + 14;
          var inlineX = 106;
          if (ball.img) {
            var bs = Math.round(20 * imgScale);
            loadImg(ball.img, function(ix, iy, s) { return function(img) {
              ctx.drawImage(img, ix, iy - 16, s, s);
            }; }(inlineX, inlineY, bs));
            inlineX += 26;
          }
          ctx.font = '14px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(ball.name, inlineX, inlineY);
          var nw = ctx.measureText(ball.name).width;
          ctx.font = 'bold 14px sans-serif';
          ctx.fillStyle = ball.count > 0 ? '#00d4ff' : 'rgba(255,255,255,0.35)';
          ctx.fillText('  x ' + ball.count + ' 个', inlineX + nw, inlineY);
        } else if (parsedBalls.length > 1) {
          var colW = (width - 90) / 2;
          for (var bj = 0; bj < parsedBalls.length; bj++) {
            var ball = parsedBalls[bj];
            var col = bj % 2;
            var row = Math.floor(bj / 2);
            var bx = 48 + col * colW;
            var by = ballSectionY + 16 + row * 28;
            
            if (ball.img) {
              var bs = Math.round(20 * imgScale);
              loadImg(ball.img, function(bx, by, bs) { return function(img) {
                ctx.drawImage(img, bx, by - 2, bs, bs);
              }; }(bx, by, bs));
            }
            var textX = bx + (ball.img ? 26 : 0);
            
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText(ball.name, textX - 4, by + 14);
            
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = ball.count > 0 ? '#00d4ff' : 'rgba(255,255,255,0.35)';
            var countStr = 'x ' + ball.count + ' 个';
            var nameW = ctx.measureText(ball.name).width;
            ctx.fillText(countStr, textX + nameW, by + 14);
          }
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillText('未使用球', 106, ballSectionY + 16);
        }

        var petImgY = ballSectionY + ballGridHeight + 40;
        if (parsedBalls.length === 0) petImgY = ballSectionY + 35;
        
        var petSize = Math.round(110 * imgScale);
        var badgeSize = Math.round(28 * imgScale);
        
        // 只有填写了精灵图片链接时才显示图片和角标
        if (last.petImageUrl && last.petImageUrl.length > 5) {
          loadImg(last.petImageUrl, function(img) {
            ctx.drawImage(img, 50, petImgY, petSize, petSize);
          });
          if (last.resultRaw === 'miss' || last.resultRaw === 'success') {
            var badgeUrl = last.resultRaw === 'miss'
              ? 'https://patchwiki.biligame.com/images/rocom/4/4f/20dseynhfc393c6jys1rnwhwwf94xvv.png'
              : 'https://patchwiki.biligame.com/images/rocom/2/2e/buxc6y4s0r7d8ix03zzkahnk4h8urtv.png';
            loadImg(badgeUrl, function(img) {
              ctx.drawImage(img, 50 + petSize - badgeSize + 8, petImgY - 8, badgeSize, badgeSize);
            });
          }
        }
        
      }

      // ───────────────── 底部签名栏 ─────────────────
      var dividerY = height - 70;
      ctx.beginPath();
      ctx.moveTo(20, dividerY);
      ctx.lineTo(width - 20, dividerY);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      var footerY = dividerY + 18;
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px sans-serif';
      ctx.fillText('由 洛手助手 提供技术支持', 24, footerY);
      ctx.fillText('开发者：R O C K', 24, footerY + 14);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = '9px sans-serif';
      ctx.fillText('数据仅供参考', 24, footerY + 26);

      // 右侧：用户水印
      var userInfo = wx.getStorageSync('user_info');
      if (userInfo && userInfo.avatarUrl && userInfo.nickName) {
          var uid = wx.getStorageSync('game_uid');
          ctx.textAlign = 'right';
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.font = '10px sans-serif';
          var nickText = '@' + userInfo.nickName;
          var nickW = ctx.measureText(nickText).width;
          ctx.fillText(nickText, width - 24, footerY);
          if (uid) {
              ctx.fillStyle = 'rgba(255,255,255,0.18)';
              ctx.font = '9px sans-serif';
              ctx.fillText('UID: ' + uid, width - 24, footerY + 14);
          }
          ctx.textAlign = 'left';
          // 头像水印（自适应昵称宽度）
          loadImg(userInfo.avatarUrl, function(img) {
            ctx.save();
            ctx.beginPath();
            var avX = width - 24 - nickW - 20;
            ctx.arc(avX + 8, footerY - 6, 8, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, avX, footerY - 14, 16, 16);
            ctx.restore();
          });
      }

      
      setTimeout(function() {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: width,
          height: height,
          destWidth: width * dpr,
          destHeight: height * dpr,
          canvas: canvas,
          success(res) {
            wx.hideLoading();
            wx.previewImage({ urls: [res.tempFilePath] });
          },
          fail() {
            wx.hideLoading();
            wx.showToast({ title: '图片生成失败', icon: 'none' });
          }
        });
      }, 3000);
    });
  },
  copyToClipboard: function() {
    var history = this.data.history || [];
    if (history.length === 0) return;
    var last = history[0];
    let totalEncounters = this.data.carnivalCount + this.data.luckyBoxCount;
    if (totalEncounters === 0 && history && history.length > 0 && history[0].encounters !== undefined) {
      totalEncounters = history[0].encounters;
    }
    
    var brushLabel = (last.brushMode === 'mixed') ? '【模式】混刷\n' : '【模式】单刷\n';
    var petDisplay = last.brushMode === 'mixed' && last.mixedPets
      ? '【精灵】' + last.mixedPets + '\n'
      : '【精灵】' + (last.pet || '未填写') + '\n';
    
    var text = '🎯 洛手助手捕捉战报\n' +
               '【时间】' + (last.date || '') + '\n' +
               '【状态】' + (last.result || '未知') + '\n' +
               brushLabel +
               petDisplay +
               '【消耗】' + (last.balls || '未使用球') + '\n' +
               '【耗时】' + (last.elapsedTimeText ? last.elapsedTimeText.replace('耗时: ', '') : '未知') + '\n\n' +
               '📊 累计统计\n' +
               '【同频】' + this.data.buildTime + '\n' +
               '【奇遇】' + (this.data.carnivalCount + this.data.luckyBoxCount) + ' 次\n' +
               '【欧气】' + (this.data.userTitle || '').replace(/[^\u4e00-\u9fa5]/g, '') + '\n' +
               '【盈亏】' + ((this.data.accumulatedWealth === 0 || this.data.accumulatedWealth === '0') ? '不允透露' : ((this.data.accumulatedWealth >= 0 ? '+' : '') + this.data.accumulatedWealth + ' 洛克贝'));
               
    wx.setClipboardData({
      data: text,
      success: function() {
        wx.showToast({ title: '已复制文本战报' });
      }
    });
  },
  
  calcSuccessRate: function() {
    var total = this.data.totalCatches || 0;
    var success = this.data.successCatches || 0;
    var encounters = this.data.luckyBoxCount || 0;
    var guaranteed = Math.floor(total / 80);
    var effectiveSuccess = success + Math.max(0, guaranteed - encounters);
    if (total === 0) return 0
    var rate = Math.round(effectiveSuccess / total * 100)
    return Math.min(rate, 100)
  },
  updateSuccessRate: function() {
    var initial = this.data.initialWealth || 0;
    var accumulated = this.data.accumulatedWealth || 0;
    var profitRate = initial > 0 ? ((accumulated / initial) * 100).toFixed(1) : (accumulated > 0 ? '100.0' : '0.0');
    var rate = this.calcSuccessRate();
    var title = this.calcTitle(rate, this.data.carnivalCount + this.data.luckyBoxCount, this.data.totalCatches);
    this.setData({ successRate: rate, userTitle: title.name, titleColor: title.color, profitRate: profitRate });
  },
  calcTitle: function(rate, encounters, totalCatches) {
    if (totalCatches >= 500 && rate >= 60) return { name: '🎯 传奇捕宠达人', color: '#00d4ff' }
    if (encounters >= 10 && rate >= 50) return { name: '🌟 幻兽缔结者', color: '#e040fb' }
    if (rate >= 80) return { name: '👑 圣龙骑士', color: '#ffab40' }
    if (rate >= 60) return { name: '✨ 皇家魔法师', color: '#9945ff' }
    if (rate >= 45) return { name: '🍀 幸运小洛克', color: '#34c759' }
    if (rate >= 30) return { name: '😐 魔法学徒', color: 'rgba(255,255,255,0.5)' }
    if (rate >= 20) return { name: '🌫️ 误入暗黑基地', color: '#ff9800' }
    return { name: '💀 黑衣人附体', color: '#ff4757' }
  },
  calcTotalBallUsed: function() {
    var total = 0
    for (var i = 0; i < this.data.balls.length; i++) {
      total += this.data.balls[i].count
    }
    var used = wx.getStorageSync('used_ball_total') || 0
    this.setData({ totalBallUsed: total, usedBallTotal: used })
  },
  syncUserLevel: function(captureCount) {
    if (!wx.cloud || !app.globalData.userInfo) return
    var db = wx.cloud.database()
    var loginDays = wx.getStorageSync('login_days') || []
    var gameUid = wx.getStorageSync('game_uid') || ''
    var hasUid = !!gameUid
    var level = levelUtil.calcLevel(loginDays.length, hasUid, captureCount)
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { level: level, captureCount: captureCount, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function(e) { console.error(e) })
    }).catch(function(e) { console.error(e) })
  },
  onUndo: function() {
    var self = this;
    var history = self.data.history;
    if (!history || history.length === 0) return;
    
    wx.showModal({
      title: '撤销最新记录',
      content: '确定要撤销最新的一条记录吗？将恢复洛克贝和咕噜球（保底进度可能无法精确恢复）。',
      success: function(res) {
        if (res.confirm) {
          var last = history[0];
    let totalEncounters = self.data.carnivalCount + self.data.luckyBoxCount;
    if (totalEncounters === 0 && history && history.length > 0 && history[0].encounters !== undefined) {
      totalEncounters = history[0].encounters;
    }
          var newHistory = history.slice(1);
          
          var catchCount = last.total || 0;
          var newTotalCatches = Math.max(0, self.data.totalCatches - catchCount);
          var isSuccess = last.result && (last.result.indexOf('成功') >= 0 || last.result === '奇遇');
          var newSuccessCatches = Math.max(0, self.data.successCatches - (isSuccess ? catchCount : 0));
          
          var cost = last.cost || 0;
          var newCosts = Math.max(0, self.data.totalCosts - cost);
          
          var balls = self.data.balls.slice();
          var ballUsedCount = 0;
          
          if (last.balls && last.balls.indexOf('🌟') >= 0) {
            var newCarnival = Math.max(0, self.data.carnivalCount - (last.total || 1));
            wx.setStorageSync('carnival_count', newCarnival);
            self.setData({ carnivalCount: newCarnival });
          } else if (last.balls && last.balls.indexOf('🎁') >= 0) {
            var newLucky = Math.max(0, self.data.luckyBoxCount - (last.total || 1));
            wx.setStorageSync('lucky_box_count', newLucky);
            self.setData({ luckyBoxCount: newLucky });
          } else if (last.carnivalCount !== undefined || last.luckyBoxCount !== undefined) {
            // 捕获记录：恢复被 onRecordClear 清掉的奇遇次数
            var restoreCarnival = last.carnivalCount || 0;
            var restoreLucky = last.luckyBoxCount || 0;
            wx.setStorageSync('carnival_count', restoreCarnival);
            wx.setStorageSync('lucky_box_count', restoreLucky);
            self.setData({ carnivalCount: restoreCarnival, luckyBoxCount: restoreLucky });
          } else if (last.balls && last.balls !== '未使用球' && last.balls.indexOf('充值') === -1 && last.balls.indexOf('购买') === -1) {
            var ballParts = last.balls.replace(/^\[盘点\]\s*/, '').replace(/^📋\s*/, '').split(', ');
            for (var i = 0; i < ballParts.length; i++) {
              var ballStr = ballParts[i].trim();
              var bName = '', bCount = 0;
              // 匹配 "name剩余N" 格式
              var remMatch = ballStr.match(/^(.+?)剩余(\d+)/);
              if (remMatch) { bName = remMatch[1].trim(); bCount = parseInt(remMatch[2]) || 0; }
              else {
                // 匹配 "name xN" 或 "namexN" 格式
                var xMatch = ballStr.match(/^(.+?)\s*x(\d+)/);
                if (xMatch) { bName = xMatch[1].trim(); bCount = parseInt(xMatch[2]) || 0; }
              }
              if (!isNaN(bCount) && bCount > 0) {
                ballUsedCount += bCount;
                for (var j = 0; j < balls.length; j++) {
                  if (balls[j].name === bName) { balls[j].count += bCount; break; }
                }
              }
            }
          }
          
          var newUsedBallTotal = Math.max(0, self.data.usedBallTotal - ballUsedCount);
          var newTotalBallUsed = Math.max(0, self.data.totalBallUsed - ballUsedCount);
          
          // 回退保底进度（用记录中的原始值精准恢复）
          if (last.pityBefore !== undefined) {
            self.updatePity(last.pityBefore);
          } else {
            var newPity = Math.max(0, self.data.pityCount - catchCount);
            self.updatePity(newPity);
          }
          
          wx.setStorageSync('catch_history', newHistory);
          wx.setStorageSync('total_catches', newTotalCatches);
          wx.setStorageSync('success_catches', newSuccessCatches);
          wx.setStorageSync('total_costs', newCosts);
          wx.setStorageSync('used_ball_total', newUsedBallTotal);
          
          self.saveBallsToStorage(balls);
          
          var hasActive = false;
          for (var i = 0; i < balls.length; i++) { if (balls[i].count > 0) { hasActive = true; break; } }
          
          self.setData({
            history: newHistory,
            totalCatches: newTotalCatches,
            successCatches: newSuccessCatches,
            totalCosts: newCosts,
            accumulatedWealth: self.data.totalGains - newCosts,
            totalWealth: self.data.initialWealth + (self.data.totalGains - newCosts),
            usedBallTotal: newUsedBallTotal,
            totalBallUsed: newTotalBallUsed,
            balls: balls,
            hasActiveBalls: hasActive,
            canStartCapture: self.data.wealthSet && hasActive
          });
          
          self.updateSuccessRate();
          wx.showToast({ title: '已撤销', icon: 'success' });
        }
      }
    });
  },
  onClearHistory: function() { var self=this; wx.showModal({ title:'清空', content:'确定清空？', success:function(r){ if(r.confirm){ wx.removeStorageSync('catch_history'); wx.removeStorageSync('total_catches'); wx.removeStorageSync('success_catches'); self.setData({history:[],totalCatches:0,successCatches:0}) } } }) },
  
  onEncounterTab: function(e) { this.setData({ encounterTab: e.currentTarget.dataset.t }) },
  addEncounterRecord: function(type, icon, count) {
    var record = { time: formatTimeShort(), balls: type, result: '奇遇', total: 1, icon: icon, count: count, pityBefore: this.data.pityCount || 0 }
    var h = [record].concat(this.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    this.setData({ history: h })
    
    var currentPity = wx.getStorageSync('pity_count') || 0
    var newPity = Math.min(80, currentPity + 1)
    this.updatePity(newPity)
    this.updateSuccessRate()
    
    var totalEncounters = this.data.carnivalCount + this.data.luckyBoxCount
    if (totalEncounters > 0 && totalEncounters % 10 === 0) {
      this.triggerFairytaleParticles()
      var self = this
      setTimeout(function() { self.showBallCheckModal() }, 800)
    }
  },
  onClearPity: function() {
    if (this.data.autoResetPity) {
      wx.showToast({ title: '自动重置开启中，不可手动清空', icon: 'none' });
      return;
    }
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
    // 长时无操作(>30min)则重置计时
    if (self.data.captureStartTime && Date.now() - self.data.captureStartTime > 1800000) {
      self.setData({ captureStartTime: 0 });
    }
    if (!self.data.captureStartTime) self.setData({ captureStartTime: Date.now() });
    var c = self.data.carnivalCount + 1
    var tc = self.data.totalCatches + 1
    var sc = self.data.successCatches + 1
    wx.setStorageSync('carnival_count', c)
    wx.setStorageSync('total_catches', tc)
    wx.setStorageSync('success_catches', sc)
    self.setData({ carnivalCount: c, totalCatches: tc, successCatches: sc, captureAnim: true })
    setTimeout(function() { self.setData({ captureAnim: false }) }, 600)
    self.addEncounterRecord('🌟 精灵童话绘本', '🌟', c)
    self.triggerFairytaleParticles()
    wx.showToast({ title: '🌟 精灵童话绘本', icon: 'none' })
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
          title: '精灵童话绘本',
          content: '使用 ' + ball.name + ' 触发精灵童话绘本',
          editable: true,
          placeholderText: '输入捕捉数量(默认1)',
          success: function(modalRes) {
            if (modalRes.confirm) {
              if (!self.data.captureStartTime) self.setData({ captureStartTime: Date.now() });
              var count = parseInt(modalRes.content) || 1
              var c = self.data.carnivalCount + 1
              var tc = self.data.totalCatches + count
              var sc = self.data.successCatches + count
              wx.setStorageSync('carnival_count', c)
              wx.setStorageSync('total_catches', tc)
              wx.setStorageSync('success_catches', sc)
              var balls = self.data.balls.slice()
              balls[res.tapIndex].count += count
              self.setData({ carnivalCount: c, totalCatches: tc, successCatches: sc, balls: balls, captureAnim: true })
              setTimeout(function() { self.setData({ captureAnim: false }) }, 600)
              self.addEncounterRecord('🌟 精灵童话绘本(' + ball.name + ')', '🌟', c)
              self.calcTotalBallUsed()
              wx.showToast({ title: '🌟 精灵童话绘本 使用' + ball.name + ' x' + count, icon: 'none' })
            }
          }
        })
      }
    })
  },
  
  onAddLuckyBox: function() {
    var self = this
    if (self.data.captureStartTime && Date.now() - self.data.captureStartTime > 1800000) {
      self.setData({ captureStartTime: 0 });
    }
    if (!self.data.captureStartTime) self.setData({ captureStartTime: Date.now() });
    var c = self.data.luckyBoxCount + 1
    var tc = self.data.totalCatches + 1
    var sc = self.data.successCatches + 1
    wx.setStorageSync('lucky_box_count', c)
    wx.setStorageSync('total_catches', tc)
    wx.setStorageSync('success_catches', sc)
    self.setData({ luckyBoxCount: c, totalCatches: tc, successCatches: sc })
    self.addEncounterRecord('🎁 精灵童话书', '🎁', c)
    wx.showToast({ title: '🎁 精灵童话书', icon: 'none' })
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
          title: '精灵童话书',
          content: '使用 ' + ball.name + ' 触发幸运盒',
          editable: true,
          placeholderText: '输入捕捉数量(默认1)',
          success: function(modalRes) {
            if (modalRes.confirm) {
              if (!self.data.captureStartTime) self.setData({ captureStartTime: Date.now() });
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
              self.addEncounterRecord('🎁 精灵童话书(' + ball.name + ')', '🎁', c)
              self.calcTotalBallUsed()
              wx.showToast({ title: '🎁 精灵童话书 使用' + ball.name + ' x' + count, icon: 'none' })
            }
          }
        })
      }
    })
  },
  onClearEncounter: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['清除精灵童话绘本', '清除精灵童话书', '清除所有异色统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '清除精灵童话绘本',
            content: '确定清除精灵童话绘本统计？',
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
            title: '清除精灵童话书',
            content: '确定清除精灵童话书统计？',
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
            content: '确定清除所有异色统计？包括精灵童话绘本和精灵童话书',
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
    // 只列出在咕噜球仓库中购买或合成过的球，并附带当前库存和上次记录
    var history = this.data.specialHistory || [];
    var purchasedBalls = {};
    for (var h = 0; h < history.length; h++) {
      purchasedBalls[history[h].ball] = true;
    }
    // 获取各球上次记录的剩余量
    var ballCheckRecords = this.data.ballCheckRecords || [];
    var lastRemaining = {};
    for (var r = ballCheckRecords.length - 1; r >= 0; r--) {
      var rec = ballCheckRecords[r];
      if (lastRemaining[rec.ball] === undefined) {
        lastRemaining[rec.ball] = rec.remaining;
      }
    }
    var items = [];
    for (var i = 0; i < this.data.balls.length; i++) {
      var ball = this.data.balls[i];
      if (purchasedBalls[ball.name]) {
        items.push({
          name: ball.name,
          remain: '',
          currentCount: ball.count,
          lastRemaining: lastRemaining[ball.name] !== undefined ? lastRemaining[ball.name] : -1
        });
      }
    }
    this.setData({
      showBallCheckModal: true,
      checkMultiBalls: items
    })
  },
  closeBallCheckModal: function() {
    this.setData({ showBallCheckModal: false })
  },
  onBallCheckConfirm: function() {
    var self = this;
    var multi = self.data.checkMultiBalls || [];
    var balls = self.data.balls.slice();
    var totalDiff = 0;
    var newRecords = [];
    var historyText = [];
    
    for (var m = 0; m < multi.length; m++) {
        var item = multi[m];
        var bName = item.name;
        if (!bName || item.remain === '' || item.remain === null) continue;
        var remaining = parseInt(item.remain);
        if (isNaN(remaining) || remaining < 0) remaining = 0;
        
        newRecords.push({ time: formatTime(), ball: bName, remaining: remaining });
        historyText.push(bName + '剩余' + remaining);
        
        for (var i = 0; i < balls.length; i++) {
          if (balls[i].name === bName) {
            var diff = balls[i].count - remaining;
            if (diff < 0) diff = 0; // 防止输入大于当前库存导致球数虚增
            if (diff > 0) {
              totalDiff += diff;
              var freeConsume = Math.min(diff, balls[i].freeCount);
              balls[i].freeCount = Math.max(0, balls[i].freeCount - freeConsume);
            }
            balls[i].count = remaining;
            break;
          }
        }
      }
    
    if (historyText.length === 0) {
      wx.showToast({ title: '请选择球类型', icon: 'none' }); return;
    }
    
    var records = self.data.ballCheckRecords.concat(newRecords);
    wx.setStorageSync('ball_check_records', records);
    
    var round = 1;
    var oldHistory = self.data.history || [];
    for (var ri = 0; ri < oldHistory.length; ri++) {
      if (oldHistory[ri].result === '盘点') round++;
    }
    var historyRecord = { time: formatTimeShort(), balls: '[盘点] ' + historyText.join(', '), result: '盘点', round: round, total: 0, cost: 0, pet: '' };
    var h = [historyRecord].concat(self.data.history).slice(0, 20);
    wx.setStorageSync('catch_history', h);
    
    var totalBallUsed = 0;
    for (var j = 0; j < balls.length; j++) totalBallUsed += balls[j].count;
    var hasActive = false;
    for (var k = 0; k < balls.length; k++) { if (balls[k].count > 0) { hasActive = true; break; } }
    
    var newUsedBallTotal = self.data.usedBallTotal + totalDiff;
    if (totalDiff > 0) wx.setStorageSync('used_ball_total', newUsedBallTotal);
    
    self.setData({
      showBallCheckModal: false,
      ballCheckRecords: records,
      history: h,
      balls: balls,
      totalBallUsed: totalBallUsed,
      usedBallTotal: newUsedBallTotal,
      hasActiveBalls: hasActive,
      canStartCapture: self.data.wealthSet && hasActive
    });
    self.saveBallsToStorage(balls);
    wx.showToast({ title: '已记录盘点', icon: 'success' });
  },
  
  triggerFairytaleParticles: function() {
    var self = this
    self.setData({ showFairytaleParticles: true })
    setTimeout(function() { self.setData({ showFairytaleParticles: false }) }, 4000)
  },
  onResetBalls: function() {
    var self = this
    wx.showModal({
      title: '重置特殊事件统计',
      content: '将重置所有咕噜球数量、购买/合成记录、使用球总数。此操作不可撤销',
      success: function(res) {
        if (res.confirm) {
          var balls = self.data.balls.map(function(b) {
            return { id: b.id, name: b.name, color: b.color, count: 0, freeCount: 0, rate: b.rate, price: b.price }
          })
          wx.removeStorageSync('special_history')
          wx.removeStorageSync('used_ball_total')
          self.setData({
            balls: balls,
            hasActiveBalls: false,
            totalBallUsed: 0,
            usedBallTotal: 0,
            specialHistory: [],
            selectedBall: null,
            selectedBallCount: 0, expandedBallIndex: -1,
            ballDecrease: {},
            canStartCapture: false
          })
          wx.showToast({ title: '已重置', icon: 'success' })
        }
      }
    })
  },
  preventClose: function() {},
  toggleAutoResetPity: function() {
    var val = !this.data.autoResetPity
    this.setData({ autoResetPity: val })
    wx.setStorageSync('auto_reset_pity', val)
    wx.showToast({ title: val ? '已开启自动重置' : '已切换手动重置', icon: 'none' })
  },
  toggleQuickRecord: function() {
    var val = !this.data.quickRecordMode
    this.setData({ quickRecordMode: val })
    wx.setStorageSync('quick_record_mode', val)
    wx.showToast({ title: val ? '自动扣费已开启' : '已切换为手动扣费', icon: 'none' })
  },
  openWealthAdjustModal: function(e, typeOverride) {
    var type = 'add';
    if (typeOverride && typeof typeOverride === 'string') {
      type = typeOverride;
    } else if (e && e.currentTarget && e.currentTarget.dataset.type) {
      type = e.currentTarget.dataset.type;
    }
    this.setData({ showWealthAdjustModal: true, adjustType: type, adjustAmount: '', adjustRemark: '' })
  },
  closeWealthAdjustModal: function() {
    this.setData({ showWealthAdjustModal: false })
  },
  onAdjustTypeSwitch: function(e) {
    this.setData({ adjustType: e.currentTarget.dataset.type })
  },
  onAdjustAmountInput: function(e) {
    this.setData({ adjustAmount: e.detail.value })
  },
  onAdjustRemarkInput: function(e) {
    this.setData({ adjustRemark: e.detail.value })
  },
  onConfirmAdjustWealth: function() {
      var self = this
      var amount = parseInt(self.data.adjustAmount)
      if (isNaN(amount) || amount <= 0) {
        wx.showToast({ title: '无效金额', icon: 'none' })
        return
      }
      var isEncounter10 = self.data.adjustType === 'encounter10'
      var isAdd = self.data.adjustType === 'add' || isEncounter10
      var adjustVal = isAdd ? amount : -amount
      var newGains = self.data.totalGains + (isAdd ? amount : 0)
      var newCosts = self.data.totalCosts + (isAdd ? 0 : amount)
      wx.setStorageSync('total_gains', newGains)
      wx.setStorageSync('total_costs', newCosts)
      var accumulated = newGains - newCosts
      var remark = self.data.adjustRemark
      
      var ballsText = isAdd ? ('💰 增加资产 +' + amount) : '💸 减少资产';
      if (isEncounter10) {
        ballsText = '✨ 十次奇遇收益 +' + amount;
        remark = '';
      }
      var record = { time: formatTimeShort(), balls: ballsText + (remark ? '(' + remark + ')' : ''), result: isEncounter10 ? '奇遇' : '微调', total: 0, cost: isAdd ? 0 : amount, pet: '' }
      var h = [record].concat(self.data.history).slice(0, 20)
      wx.setStorageSync('catch_history', h)
      self.setData({
      showWealthAdjustModal: false,
      totalGains: newGains,
      totalCosts: newCosts,
      accumulatedWealth: accumulated,
      totalWealth: self.data.initialWealth + accumulated,
      history: h
    })
    self.updateGemCost()
    wx.showToast({ title: (isAdd ? '增加' : '减少') + ' 💵' + amount, icon: 'none' })
  },
  onWealthInput: function(e) { this.setData({ coinInput: e.detail.value }) },
  onSetWealth: function() {
    var self = this
    if (self.data.wealthSet) {
      wx.showToast({title:'初始值已设置，无法修改',icon:'none'})
      return
    }
    var v = parseInt(self.data.coinInput)
    if (isNaN(v) || v < 0) return
    wx.setStorageSync('initial_wealth', v)
    wx.setStorageSync('total_gains', 0)
    wx.setStorageSync('total_costs', 0)
      wx.setStorageSync('wealth_is_set', true)
    self.setData({ initialWealth: v, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: v, wealthSet: true, coinInput: '', canStartCapture: self.data.hasActiveBalls })
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
    var oldCount = balls[self.data.selectedBall].count
    var oldFree = balls[self.data.selectedBall].freeCount
    balls[self.data.selectedBall].count = count
    var diff = oldCount - count
    if (diff > 0) {
      var freeConsume = Math.min(diff, oldFree)
      balls[self.data.selectedBall].freeCount = oldFree - freeConsume
    } else {
      balls[self.data.selectedBall].freeCount = oldFree
    }
    var cost = ball.price * count
    var newCosts = self.data.totalCosts + cost
    var totalBallUsed = 0
    for (var i = 0; i < balls.length; i++) totalBallUsed += balls[i].count
    var hasActive = false
    for (var i = 0; i < balls.length; i++) { if (balls[i].count > 0) { hasActive = true; break } }
    var decrease = diff > 0 ? (function() { var d = {}; d[self.data.selectedBall] = diff; return d })() : {}
    var usedInc = diff > 0 ? diff : 0
    var newUsedBallTotal = self.data.usedBallTotal + usedInc
    if (usedInc > 0) wx.setStorageSync('used_ball_total', newUsedBallTotal)
    if (cost > 0) {
      wx.setStorageSync('total_costs', newCosts)
      var accumulated = self.data.totalGains - newCosts
      self.saveBallsToStorage(balls);
      self.setData({
        balls: balls,
        hasActiveBalls: hasActive,
        totalBallUsed: totalBallUsed,
        usedBallTotal: newUsedBallTotal,
        totalCosts: newCosts,
        accumulatedWealth: accumulated,
        totalWealth: self.data.initialWealth + accumulated,
        selectedBall: null,
        selectedBallCount: 0, expandedBallIndex: -1,
        ballDecrease: decrease
      })
      self.updateGemCost()
      wx.showToast({title: ball.name + ' x' + count + ' 消耗💵' + cost + '洛克贝',icon:'none'})
    } else {
      self.saveBallsToStorage(balls);
      self.setData({
        balls: balls,
        hasActiveBalls: hasActive,
        totalBallUsed: totalBallUsed,
        usedBallTotal: newUsedBallTotal,
        selectedBall: null,
        selectedBallCount: 0, expandedBallIndex: -1,
        ballDecrease: decrease
      })
      wx.showToast({title: ball.name + ' x' + count + ' (免费)',icon:'none'})
    }
    if (Object.keys(decrease).length > 0) {
      setTimeout(function() { self.setData({ ballDecrease: {} }) }, 2500)
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
    var ballPrice = 0, ballIcon = '', ballImg = '';
    for (var i = 0; i < self.data.balls.length; i++) {
      if (self.data.balls[i].name === ballName) {
        ballPrice = self.data.balls[i].price;
        ballIcon = self.data.balls[i].icon || '';
        ballImg = self.data.balls[i].img || '';
        break;
      }
    }
    var totalCost = 0;
    if (t === '购买' && self.data.quickRecordMode) {
      totalCost = ballPrice * v;
    }
    var newCosts = self.data.totalCosts + totalCost
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = self.data.totalGains - newCosts
    var h = [{type: t, ball: ballName, count: v, cost: totalCost, time: formatTime(), icon: ballIcon, img: ballImg}].concat(self.data.specialHistory).slice(0, 50)
    wx.setStorageSync('special_history', h)
    var balls = self.data.balls.slice()
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].name === ballName) {
        balls[i].count += v
        if (t === '合成') balls[i].freeCount += v
        break
      }
    }
    var totalBallUsed = 0
    for (var i = 0; i < balls.length; i++) totalBallUsed += balls[i].count
    var hasActive = false
    for (var i = 0; i < balls.length; i++) { if (balls[i].count > 0) { hasActive = true; break } }
    self.saveBallsToStorage(balls);
      self.setData({ specialHistory: h, specialCount: '', balls: balls, totalBallUsed: totalBallUsed, totalCosts: newCosts, accumulatedWealth: accumulated, totalWealth: self.data.initialWealth + accumulated, hasActiveBalls: hasActive, canStartCapture: self.data.wealthSet && hasActive })
    self.updateGemCost()
    wx.showToast({title: totalCost > 0 ? t + ballName + ' +' + v + ' 消耗💵' + totalCost : t + ballName + ' +' + v, icon: 'none'})
  },

  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },

  onShareAppMessage: function () {
    return {
      title: '捕捉统计 - 洛克王国向导',
      path: '/pages/catch/catch'
    }
  },
  onShareTimeline: function () {
    return {
      title: '捕捉统计 - 洛克王国向导'
    }
  }

})

