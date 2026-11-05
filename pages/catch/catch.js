var app = getApp()
var imageConfig = require('../../config/images');
var levelUtil = require('../../utils/level')
var i18n = require('../../utils/i18n')
var i18nBehavior = require('../../utils/i18nBehavior')

// ... (rest of file continues with formatTime, etc.)
// 评级标题：只去 emoji，保留中/英/日/韩文字
function stripTitleEmoji(s) {
  if (!s) return ''
  return String(s)
    .replace(/[\u2600-\u27BF\uFE0F\u200D]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// 捕捉结果按当前语言显示（记录里可能存的是中文）
function localizeResultText(raw, resultText) {
  var s = (resultText || '').trim()
  if (raw === 'success' || s.indexOf('异色捕获成功') >= 0 || s.indexOf('捕获成功') >= 0) {
    return i18n.t('catchModalResultTitle')
  }
  if (raw === 'miss' || s === '歪了') return i18n.t('catchResultMiss')
  if (s.indexOf('盘点') >= 0) return i18n.t('catchResultCheck')
  if (s.indexOf('龙龙骰') >= 0 || raw === 'use_dice') return '龙龙骰'
  if (s.indexOf('奇遇') >= 0 || raw === 'event') return i18n.t('catchResultEvent')
  if (s.indexOf('微调') >= 0) return i18n.t('imgAdjust')
  return s || i18n.t('imgUnknown')
}

// 耗时：优先用秒数按当前语言格式化
function localizeElapsed(rec) {
  if (rec && rec.elapsedSec != null && rec.elapsedSec !== '') {
    return i18n.formatDuration(Number(rec.elapsedSec) || 0)
  }
  if (rec && rec.elapsedTimeText) {
    return String(rec.elapsedTimeText).replace(/^(耗时|Duration|時間|소요 시간)\s*:?\s*/i, '').trim()
  }
  return ''
}

function formatTime(d) {
  if (!d) d = new Date()
  return i18n.formatDateTime(d) + ':' + (function() {
    var dd = d instanceof Date ? d : new Date(d)
    var utc = dd.getTime() + dd.getTimezoneOffset() * 60000
    var local = new Date(utc + i18n.getLangTzOffsetHours() * 3600000)
    return String(local.getSeconds()).padStart(2, '0')
  })()
}
function formatTimeShort(d) {
  if (!d) d = new Date()
  return i18n.formatTimeHMS(d)
}
Page({
  behaviors: [i18nBehavior, require('../../utils/padLayoutBehavior')],
  data: {
    buildTime: '', sysVersion: '初始化中...', showLogShareBtn: true,
    safeTop: 88,
    continuePity: false,
    missAnim: false,
    pinnedBallIndex: -1,
    pityEmoji: '',
    profitRate: 0,
    resultElapsedTime: '',
    usedBallTotal: 0,
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
      {id:17,name:'淘沙球',color:'#d4a017',icon:'🏖️',count:0,freeCount:0,rate:'提升对应属性50%捕捉概率',price:3000},
      {id:18,name:'童话球',color:'#f472b6',icon:'🧚',count:0,freeCount:0,rate:'童话系+70%',price:800,img:'https://img.remit.ee/api/file/CAACAgUAAyEGAASHRsPbAAEYB8ZqaEBixsb7T3jYYu7SRMZ1uJv9MgAC2yUAAqj4SVcLsuCtMJ10xj0E.webp'}
    ],
    selectedBall: null, selectedBallCount: 0, expandedBallIndex: -1,
    totalCatches: 0, successCatches: 0, successRate: 0, pityCount: 0, pityHint: '基础概率', history: [], result: '',
    initialWealth: 0, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: 0,
    coinInput: '', wealthSet: false,
    costInput: '', gainInput: '',
    petNameInput: '', catchCount: 1,
    encounterTab: 'luckybox', carnivalCount: 0, luckyBoxCount: 0,
    specialTab: 'buy', specialBall: '高级咕噜球',
    inboundMethod: 'default',
    selectedCraftCostRoco: false,
    selectedCraftPrice: 0,
    craftUseRoco: false,
    pickerBalls: [],
    specialBalls: ['绝缘球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','奇趣球','补光球','国王球','棱镜球','织梦棱镜球','狂欢棱镜球','淘沙球','童话球'],
    craftBalls: ['国王球','绝缘球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','棱镜球','淘沙球'],
    cnyBalls: [],
    attributeBalls: ['绝缘球','美妙球','好战球','光合球','网兜球','暗星球','调温球','变幻球','淘沙球','童话球'],
    specialCount: '', specialHistory: [],
    totalBallUsed: 0,
    hasActiveBalls: false,
    ballDecrease: {},
    showFairytaleParticles: false, showDiceParticles: false, diceAnim: false,
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
    adjustType: 'current',
    adjustAmount: '',
    adjustInputVal: 0,
    adjustIncreaseVal: 0,
    adjustDecreaseVal: 0,
    lastWealthAdjust: null,
    adjustRemark: '',
    resultMultiBalls: [],
    checkMultiBalls: [],
    sessionUsedText: '',
    brushMode: 'single',
    resultMixedPets: [{ name: '' }],
    resultMixedPetNames: [],
    resultTargetPet: '',
    showMoreFields: false,
    captureStartTime: 0,
    resultElapsedEdited: false,
    // 异色精灵预设（后台配置）
    shinyPets: [],
    petSeasonFilter: 'S1',
    shinyPetPickerList: [],
    petSeasons: ['S1', 'S2', 'S3', 'S4'],
    // 契约球：捕捉成功时选用
    contractBall: '',
    contractBallImg: '',
    contractBallIcon: '',
    contractBallPicker: [],
    // 异色龙龙骰染色状态
    sessionUsedDice: false,
    resultUsedDice: false,
  },
  // 计时：长时无操作(>30min)重置；未开始则从此刻起表，返回本次已耗秒数
  _touchCaptureClock: function() {
    var now = Date.now();
    var start = this.data.captureStartTime;
    if (start && now - start > 1800000) {
      this.setData({ captureStartTime: 0 });
      start = 0;
    }
    if (!start) {
      start = now;
      this.setData({ captureStartTime: start });
    }
    return Math.floor((now - start) / 1000);
  },
  _resetCaptureClock: function() {
    this._frozenElapsedSec = null;
    this.setData({ captureStartTime: 0 });
  },
  saveBallsToStorage: function(balls) {
    if (balls) {
      wx.setStorageSync('catch_balls', balls.map(function(b) {
        return { id: b.id, count: b.count, freeCount: b.freeCount, img: b.img || '' };
      }));
    }
  },
  // 自定义导航：让开微信胶囊（含翻译展开），否则右上角按钮点不到
  computeSafeTop: function() {
    var fallback = 88
    try {
      var winInfo = wx.getWindowInfo()
      var statusBarHeight = winInfo.statusBarHeight || 20
      var menuBtn = wx.getMenuButtonBoundingClientRect()
      if (menuBtn && menuBtn.bottom) return menuBtn.bottom + 8
      return statusBarHeight + 48
    } catch (e) {
      return fallback
    }
  },
  onLoad: function() {
    this.setData({ safeTop: this.computeSafeTop() })
    this.fetchCloudBalls();
    this.fetchShinyPets();
    this.preloadBallImages();
  },
  // 异色精灵预设：后台配置后同步到目标精灵选择（过滤暂时隐藏的赛季 + 置顶优先）
  fetchShinyPets: function() {
    var self = this;
    if (!wx.cloud) return;
    wx.cloud.database().collection('site_config').doc('shiny_pets').get().then(function(res) {
      var pets = (res.data && res.data.pets) || [];
      var allSeasons = (res.data && res.data.seasons) || ['S1', 'S2', 'S3', 'S4'];
      var hiddenSeasons = (res.data && res.data.hiddenSeasons) || [];
      var visibleSeasons = allSeasons.filter(function(s) { return hiddenSeasons.indexOf(s) === -1; });
      if (!visibleSeasons.length) visibleSeasons = allSeasons;
      self.setData({ shinyPets: pets, petSeasons: visibleSeasons });
      wx.setStorageSync('pet_hidden_seasons', hiddenSeasons);
      self.refreshShinyPetPicker();
    }).catch(function() {
      // 离线用缓存
      var cached = wx.getStorageSync('shiny_pets') || [];
      var cachedSeasons = wx.getStorageSync('pet_seasons') || ['S1', 'S2', 'S3', 'S4'];
      if (cached.length) {
        self.setData({ shinyPets: cached, petSeasons: cachedSeasons });
        self.refreshShinyPetPicker();
      }
    });
  },
  refreshShinyPetPicker: function() {
    var pets = this.data.shinyPets || [];
    var seasons = this.data.petSeasons || ['S1', 'S2', 'S3', 'S4'];
    var season = this.data.petSeasonFilter;
    if (!season || season === 'all' || seasons.indexOf(season) === -1) {
      season = seasons[0] || 'S1';
    }
    var matched = [];
    for (var i = 0; i < pets.length; i++) {
      if ((pets[i].season || seasons[0] || 'S1') === season) matched.push(pets[i]);
    }
    matched.sort(function(a, b) {
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    });
    var list = matched.map(function(p) { return p.name; });
    this.setData({ petSeasonFilter: season, shinyPetPickerList: list });
    wx.setStorageSync('shiny_pets', pets);
    wx.setStorageSync('pet_seasons', seasons);
  },
  onPetSeasonFilter: function(e) {
    var s = e.currentTarget.dataset.s;
    if (!s) return;
    this.setData({ petSeasonFilter: s });
    this.refreshShinyPetPicker();
  },
  // 选中预设：填入名称 + 图片URL；pickTarget 区分单刷目标 / 混刷目标
  onPickShinyPet: function(e) {
    var idx = e.currentTarget.dataset.index;
    var target = e.currentTarget.dataset.target || 'single';
    var seasons = this.data.petSeasons || ['S1', 'S2', 'S3', 'S4'];
    var season = this.data.petSeasonFilter || seasons[0] || 'S1';
    var pets = this.data.shinyPets || [];
    var list = [];
    for (var i = 0; i < pets.length; i++) {
      if ((pets[i].season || seasons[0] || 'S1') === season) list.push(pets[i]);
    }
    list.sort(function(a, b) {
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    });
    var pet = list[idx];
    if (!pet) return;
    if (target === 'mixed') {
      this.setData({ resultTargetPet: pet.name });
    } else {
      this.setData({ resultPetName: pet.name });
    }
    if (pet.img) this.setData({ resultPetImageUrl: pet.img });
    wx.showToast({ title: '已选择 ' + pet.name, icon: 'none' });
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
    var self = this;
    self.setData({ sysVersion: '获取云端数据...' });
    var defaultBalls = self.data.balls;
    if (wx.cloud) {
      wx.cloud.database().collection('site_config').doc('ball_images').get().then(res => {
        if (res.data && res.data.balls && res.data.balls.length > 0) {
          var cloudBalls = res.data.balls;
          var cloudMap = {};
          for (var i = 0; i < cloudBalls.length; i++) { cloudMap[String(cloudBalls[i].id)] = cloudBalls[i]; }
          var merged = [];
          var defaultIds = {};
          for (var j = 0; j < defaultBalls.length; j++) {
            defaultIds[String(defaultBalls[j].id)] = true;
            merged.push(cloudMap[String(defaultBalls[j].id)] || defaultBalls[j]);
          }
          // 云端自定义球（管理后台新增）必须并入，否则捕捉统计看不到
          for (var k = 0; k < cloudBalls.length; k++) {
            if (!defaultIds[String(cloudBalls[k].id)]) merged.push(cloudBalls[k]);
          }
          self.syncBallsConfig(merged);
        } else {
          self.syncBallsConfig(defaultBalls);
        }
        self.setData({ sysVersion: '已实时同步 | ' + formatTimeShort() });
      }).catch(err => {
        self.syncBallsConfig(defaultBalls);
        self.setData({ sysVersion: '离线模式(使用缓存)' });
      });
    } else {
      self.syncBallsConfig(defaultBalls);
      self.setData({ sysVersion: '离线模式' });
    }
  },
  syncBallsConfig: function(cloudBalls) {
    var self = this;
    var localBalls = wx.getStorageSync('catch_balls') || [];
    var localMap = {};
    var localByName = {};
    for (var i = 0; i < localBalls.length; i++) {
      var lbItem = localBalls[i];
      localMap[String(lbItem.id)] = lbItem;
      if (lbItem.name) localByName[lbItem.name] = lbItem;
    }

    var mergedBalls = [];
    var buyBalls = [];
    var craftBalls = [];
    var cnyBalls = [];
    // 活动赠：后台勾了「活动球」的都可免费入库（不限购买/合成/特殊）
    var craftActivityBalls = [];
    var cnyActivityBalls = [];

    for (var j = 0; j < cloudBalls.length; j++) {
      var cb = cloudBalls[j];
      // id 可能数字/字符串不一致，按 id + 名称兜底找回本地库存
      var lb = localMap[String(cb.id)] || localByName[cb.name] || { count: 0, freeCount: 0 };
      var rateDesc = cb.desc || cb.rate || '';
      // price=洛克贝、cnyPrice=CNY，互不换算；旧数据特殊球把 CNY 记在 price
      var rocoPrice = cb.price || 0;
      var cnyPrice = cb.cnyPrice || 0;
      if (cb.isSpecial && !cb.isBuy && !cb.cnyPrice && rocoPrice) {
        cnyPrice = rocoPrice;
        rocoPrice = 0;
      }
      var craftCostRoco = !!(cb.craftCostRoco || (cb.isCraft && cb.craftPrice > 0));
      var craftPrice = cb.craftPrice != null ? (parseInt(cb.craftPrice, 10) || 0) : (craftCostRoco ? (parseInt(cb.price, 10) || 0) : 0);
      if (cb.isCraft && !cb.isBuy) {
        rocoPrice = craftCostRoco ? craftPrice : 0;
      }
      mergedBalls.push({
        id: cb.id,
        name: cb.name,
        color: cb.color || '#ffffff',
        icon: cb.icon || '⚪',
        count: lb.count || 0,
        freeCount: lb.freeCount || 0,
        rate: rateDesc,
        price: rocoPrice,
        cnyPrice: cnyPrice,
        craftCostRoco: craftCostRoco,
        craftPrice: craftPrice,
        craftMaterials: cb.craftMaterials || '',
        // 按当前语言显示当地货币（CNY 自动换算）
        cnyDisplay: cnyPrice > 0 ? i18n.formatCny(cnyPrice) : '',
        img: cb.img || lb.img || '',
        source: cb.source || '',
        isBuy: !!cb.isBuy,
        isCraft: !!cb.isCraft,
        isSpecial: !!cb.isSpecial,
        isActivity: !!cb.isActivity,
        isCustom: String(cb.id).indexOf('ball_') === 0
      });
      if (cb.isBuy) buyBalls.push(cb.name);
      if (cb.isCraft) craftBalls.push(cb.name);
      if (cb.isSpecial) cnyBalls.push(cb.name);
      // 合成区活动赠：合成球 + 纯活动球
      if (cb.isCraft || (cb.isActivity && !cb.isSpecial && !cb.isBuy)) {
        if (craftActivityBalls.indexOf(cb.name) === -1) craftActivityBalls.push(cb.name);
      }
      // 特殊区「活动 · 赠」：所有勾了「活动球」的 + 兼容旧数据可可果球
      if (cb.isActivity || cb.name === '可可果球') {
        if (cnyActivityBalls.indexOf(cb.name) === -1) cnyActivityBalls.push(cb.name);
      }
    }

    self.setData({
      balls: mergedBalls,
      buyBalls: buyBalls.length > 0 ? buyBalls : (self.data.buyBalls || self.data.specialBalls || []),
      craftBalls: craftBalls.length > 0 ? craftBalls : self.data.craftBalls,
      cnyBalls: cnyBalls,
      craftActivityBalls: craftActivityBalls.length > 0 ? craftActivityBalls : (craftBalls.length ? craftBalls : self.data.craftBalls),
      cnyActivityBalls: cnyActivityBalls
    });
    // 刷新当前选择列表
    self.refreshBallPicker();
    wx.setStorageSync('catch_balls', mergedBalls);
    self.loadHistory();
    self.calcTotalBallUsed();
  },
  // 按板块 + 获取方式得到可选球列表
  getPickerBalls: function() {
    var d = this.data
    if (d.specialTab === 'buy') return d.buyBalls && d.buyBalls.length ? d.buyBalls : (d.specialBalls || [])
    if (d.specialTab === 'craft') return d.craftBalls
    // 特殊球：默认全部；「活动 · 赠」= 后台勾了「活动球」的
    return d.inboundMethod === 'activity'
      ? (d.cnyActivityBalls || [])
      : d.cnyBalls
  },
  _syncSelectedCraftBall: function(ballName) {
    var balls = this.data.balls || [];
    var b = null;
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].name === ballName) { b = balls[i]; break; }
    }
    var costRoco = !!(b && b.isCraft && b.craftCostRoco);
    var cPrice = costRoco ? (b.craftPrice || b.price || 0) : 0;
    this.setData({
      selectedCraftCostRoco: costRoco,
      selectedCraftPrice: cPrice,
      craftUseRoco: !!(costRoco && cPrice > 0)
    });
  },
  onToggleCraftUseRoco: function(e) {
    var use = e.currentTarget.dataset.use === '1';
    this.setData({ craftUseRoco: use });
  },
  refreshBallPicker: function() {
    var list = this.getPickerBalls() || []
    var first = list.length ? list[0] : ''
    var keep = this.data.specialBall
    var selected = (keep && list.indexOf(keep) >= 0) ? keep : first
    this.setData({
      pickerBalls: list,
      specialBall: selected
    })
    this._syncSelectedCraftBall(selected)
  },
  noop: function() {},
  toggleBallDesc: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.expandedBallIndex === index) {
      this.setData({ expandedBallIndex: -1 });
    } else {
      this.setData({ expandedBallIndex: index });
    }
  },
  onShow: function() {
    this._refreshI18n()
    var n = new Date()
    this.setData({
      buildTime: formatTime(n)
    })
    // 语言切换后刷新当地货币显示
    var balls = (this.data.balls || []).map(function(b) {
      var copy = Object.assign({}, b)
      copy.cnyDisplay = (copy.cnyPrice > 0) ? i18n.formatCny(copy.cnyPrice) : ''
      return copy
    })
    if (balls.length) this.setData({ balls: balls })
    if (wx.getStorageSync('balls_config_updated')) {
      wx.removeStorageSync('balls_config_updated');
      this.fetchCloudBalls();
    }
    if (wx.getStorageSync('shiny_pets_updated')) {
      wx.removeStorageSync('shiny_pets_updated');
      this.fetchShinyPets();
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
    var title = this.calcTitle(rate, luckyBoxCount, totalCatches)
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
      continuePity: wx.getStorageSync('continue_pity') || false,
      quickRecordMode: wx.getStorageSync('quick_record_mode') || false,
      specialHistory: wx.getStorageSync('special_history') || [],
      sessionUsedDice: !!wx.getStorageSync('session_used_dice'),
      lastWealthAdjust: wx.getStorageSync('last_wealth_adjust') || null
    })
    this.updateGemCost()
  },

  onResultMultiBallRemainInput: function(e) {
    var idx = e.currentTarget.dataset.index;
    var arr = this.data.resultMultiBalls.slice();
    var item = arr[idx] || {};
    var remainRaw = e.detail.value;
    var current = item.currentCount || 0;
    var usedDisplay = '';
    if (remainRaw !== '' && remainRaw !== null && remainRaw !== undefined) {
      var rem = parseInt(remainRaw);
      if (isNaN(rem) || rem < 0) rem = 0;
      var used = current - rem;
      usedDisplay = used > 0 ? used : 0;
    }
    arr[idx] = Object.assign({}, item, { remain: remainRaw, usedDisplay: usedDisplay });
    this.setData({ resultMultiBalls: arr });
  },
  onBrushModeSwitch: function(e) {
    var mode = e.currentTarget.dataset.mode;
    var update = { brushMode: mode };
    if (mode === 'mixed') {
      // 单刷目标 → 混刷的目标精灵（不是混刷名单）
      if (this.data.resultPetName) {
        update.resultTargetPet = this.data.resultPetName;
      }
      if (!this.data.resultMixedPets || !this.data.resultMixedPets.length) {
        update.resultMixedPets = [{ name: '' }];
        update.resultMixedPetNames = [];
      }
    } else if (mode === 'single' && this.data.resultTargetPet) {
      // 混刷目标 → 单刷精灵名
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
    var arr = this.data.checkMultiBalls.slice();
    var item = arr[idx] || {};
    var remainRaw = e.detail.value;
    var current = item.currentCount || 0;
    var usedDisplay = '';
    if (remainRaw !== '' && remainRaw !== null && remainRaw !== undefined) {
      var rem = parseInt(remainRaw);
      if (isNaN(rem) || rem < 0) rem = 0;
      var used = current - rem;
      usedDisplay = used > 0 ? used : 0;
    }
    arr[idx] = Object.assign({}, item, { remain: remainRaw, usedDisplay: usedDisplay });
    this.setData({ checkMultiBalls: arr });
  },
  onResult: function(e) {
    var r = e.currentTarget.dataset.r
    var self = this
    if (r === 'success') {
      self.setData({ captureAnim: true })
      setTimeout(function() { self.setData({ captureAnim: false }) }, 600)
    } else if (r === 'miss') {
      self.setData({ missAnim: true })
      setTimeout(function() { self.setData({ missAnim: false }) }, 600)
    }
    // 所有有库存的球都可填剩余（不限购买/合成记录，避免漏球）
    var items = [];
    for (var i = 0; i < self.data.balls.length; i++) {
      var b = self.data.balls[i];
      if (b.count > 0 || b.freeCount > 0) {
        items.push({ name: b.name, remain: '', usedDisplay: '', currentCount: b.count || 0, img: b.img || '', icon: b.icon || '' });
      }
    }
    // 自动计时：从首次点击奇遇到「点结果这一刻」定格（不含填表时间）
    var autoTag = i18n.i18n[i18n.getLanguage()].countdownAuto;
    var hadClock = !!self.data.captureStartTime;
    var elapsedSec = self._touchCaptureClock();
    // 之前没起过表（直接点结果）→ 不给自动值，避免显示「0秒(自动)」
    var autoElapsed = '';
    if (hadClock && elapsedSec >= 0) {
      self._frozenElapsedSec = elapsedSec;
      autoElapsed = i18n.formatDuration(elapsedSec) + ' ' + autoTag;
    } else {
      self._frozenElapsedSec = null;
    }
    // 契约球列表：捕捉成功时可选（仓库里有库存的球）
    var contractPicker = [];
    for (var ci = 0; ci < self.data.balls.length; ci++) {
      var cb = self.data.balls[ci];
      if (cb && cb.name && (cb.count > 0 || cb.freeCount > 0)) {
        contractPicker.push({ name: cb.name, img: cb.img || '', icon: cb.icon || '⚪' });
      }
    }
    self.setData({
      showResultBallModal: true,
      resultType: r,
      sessionUsedText: self._sessionUsedText() || '',
      resultMultiBalls: items,
      resultRemark: '',
      brushMode: 'single',
      resultMixedPets: [{ name: '' }],
      resultMixedPetNames: [],
      resultTargetPet: '',
      resultPetName: '',
      resultPetImageUrl: '',
      showMoreFields: false,
      resultElapsedTime: autoElapsed,
      resultElapsedEdited: false,
      contractBall: '',
      contractBallImg: '',
      contractBallIcon: '',
      contractBallPicker: contractPicker,
      resultUsedDice: !!self.data.sessionUsedDice
    })
    this.setData({ lastUsedBallImageUrl: '' })
  },
  onLongResult: function(e) { this.onResult(e) },
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
    this.setData({ resultElapsedTime: e.detail.value, resultElapsedEdited: true })
  },
  onResultRemarkInput: function(e) {
    this.setData({ resultRemark: e.detail.value })
  },
  // 契约球：捕捉成功后选用哪只球完成契约
  onPickContractBall: function(e) {
    var idx = e.currentTarget.dataset.index;
    var list = this.data.contractBallPicker || [];
    var ball = list[idx];
    if (!ball) return;
    if (this.data.contractBall === ball.name) {
      // 再点一次取消
      this.setData({ contractBall: '', contractBallImg: '', contractBallIcon: '' });
      return;
    }
    this.setData({ contractBall: ball.name, contractBallImg: ball.img || '', contractBallIcon: ball.icon || '⚪' });
    wx.showToast({ title: '契约球：' + ball.name, icon: 'none' });
  },
  onToggleResultUsedDice: function() {
    var next = !this.data.resultUsedDice;
    if (next && !this.data.sessionUsedDice && (this.data.carnivalCount || 0) <= 0) {
      wx.showToast({ title: '已标记为异色龙龙骰染色', icon: 'none' });
    }
    this.setData({ resultUsedDice: next });
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
    var usedBallsDetail = [];

    for (var m = 0; m < multi.length; m++) {
      var item = multi[m];
      if (!item.name) continue;
      // 填剩余数量：消耗 = 原库存 - 剩余；未填则跳过（不消耗）
      var remainVal = item.remain;
      if (remainVal === '' || remainVal === null || remainVal === undefined) {
        continue;
      }
      var remaining = parseInt(remainVal);
      if (isNaN(remaining) || remaining < 0) remaining = 0;

      for (var i = 0; i < balls.length; i++) {
        if (balls[i].name === item.name) {
          var oldCount = (item.currentCount != null && item.currentCount !== '') ? item.currentCount : balls[i].count;
          // 消耗 = 原库存 - 剩余；剩余更高视为补货，不记消耗
          var usedCount = oldCount - remaining;
          if (usedCount < 0) usedCount = 0;

          balls[i].count = remaining;
          totalUsedCount += usedCount;
          if (usedCount > 0) {
            usedBallNames.push(balls[i].name + 'x' + usedCount);
            if(!self._lastUsedBallImg && balls[i].img) self._lastUsedBallImg = balls[i].img;
            var freeConsume = Math.min(usedCount, balls[i].freeCount);
            balls[i].freeCount = Math.max(0, balls[i].freeCount - freeConsume);
            usedBallsDetail.push({ name: balls[i].name, count: usedCount, freeUsed: freeConsume });
          }
          break;
        }
      }
    }

    // 契约球：额外消耗 1 个（优先扣活动/免费额度）
    // 若该球已在表中填写剩余，则剩余即最终值，不再重复扣
    if (self.data.contractBall) {
      var contractRemainFilled = false;
      for (var cm = 0; cm < multi.length; cm++) {
        if (multi[cm].name === self.data.contractBall && multi[cm].remain !== '' && multi[cm].remain !== null && multi[cm].remain !== undefined) {
          contractRemainFilled = true;
          break;
        }
      }
      if (!contractRemainFilled) {
        for (var ci = 0; ci < balls.length; ci++) {
          if (balls[ci].name === self.data.contractBall) {
            if (balls[ci].count > 0) {
              balls[ci].count -= 1;
              totalUsedCount += 1;
              var contractFreeUsed = 0;
              if (balls[ci].freeCount > 0) {
                balls[ci].freeCount -= 1;
                contractFreeUsed = 1;
              }
              if (!self._lastUsedBallImg && balls[ci].img) self._lastUsedBallImg = balls[ci].img;
              var contractDetail = null;
              for (var di = 0; di < usedBallsDetail.length; di++) {
                if (usedBallsDetail[di].name === balls[ci].name) {
                  usedBallsDetail[di].count += 1;
                  usedBallsDetail[di].freeUsed += contractFreeUsed;
                  contractDetail = usedBallsDetail[di];
                  break;
                }
              }
              if (!contractDetail) {
                usedBallsDetail.push({ name: balls[ci].name, count: 1, freeUsed: contractFreeUsed });
              }
              var existed = false;
              for (var ui = 0; ui < usedBallNames.length; ui++) {
                if (usedBallNames[ui].indexOf(balls[ci].name) === 0) {
                  var m2 = usedBallNames[ui].match(/x(\d+)$/);
                  var prev = m2 ? parseInt(m2[1]) : 1;
                  usedBallNames[ui] = balls[ci].name + 'x' + (prev + 1);
                  existed = true;
                  break;
                }
              }
              if (!existed) usedBallNames.push(balls[ci].name + 'x1');
            }
            break;
          }
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
    // 自动计时：未手改则用「点结果那一刻」定格的耗时；手改则原样保存
    var autoTag = ' ' + i18n.i18n[i18n.getLanguage()].countdownAuto;
    var resultElapsedAuto = !self.data.resultElapsedEdited;
    var resultElapsedTime = (self.data.resultElapsedTime || '').replace(autoTag, '').trim();
    var resultElapsedSec = null;
    if (resultElapsedAuto) {
      if (self._frozenElapsedSec != null) {
        resultElapsedSec = self._frozenElapsedSec;
        resultElapsedTime = i18n.formatDuration(resultElapsedSec);
      } else {
        // 没有定格值（未起表 / 用户清空）→ 不写耗时
        resultElapsedAuto = false;
        resultElapsedTime = '';
      }
    }
    self._diceDeductedInModal = false;
    if (self.data.resultUsedDice && !self.data.sessionUsedDice && (self.data.carnivalCount || 0) > 0) {
      var nextDice = self.data.carnivalCount - 1;
      wx.setStorageSync('carnival_count', nextDice);
      self.setData({ carnivalCount: nextDice });
      self._diceDeductedInModal = true;
    }
    self.setData({ balls: balls, totalBallUsed: totalBallUsed, usedBallTotal: newUsedBallTotal, hasActiveBalls: hasActive, canStartCapture: self.data.wealthSet && hasActive, lastUsedCount: totalUsedCount, lastUsedBallName: lastUsedStr, _resultElapsedTime: resultElapsedTime, _resultElapsedSec: resultElapsedSec, _resultElapsedAuto: resultElapsedAuto, _resultMixedPetNames: resultMixedPetNames, _resultTargetPet: resultTargetPet });
    self._usedBallsDetail = usedBallsDetail;
    self._addSessionUsed(usedBallsDetail);
    self._resultGainVal = gainVal;
    if (gainVal !== 0) {
      var newGains = self.data.totalGains + gainVal
      wx.setStorageSync('total_gains', newGains)
      var newAccumulated = newGains - self.data.totalCosts
      self.setData({ totalGains: newGains, accumulatedWealth: newAccumulated, totalWealth: self.data.initialWealth + newAccumulated })
      self.updateGemCost()
    }
    if (self.data.result === 'success') {
      self.onRecordClear(r);
    } else {
      wx.showActionSheet({
        itemList: ['继续累计（保留本次数据）', '清除本次捕捉（重新开始）'],
        success: function(res) {
          if (res.tapIndex === 0) {
            self.onRecordContinue(r)
          } else {
            self.onRecordClear(r)
          }
        },
        fail: function() {}
      })
    }
  },
  _buildRecord: function(resultType) {
    var self = this;
    var result = resultType || self.data.result;
    // 展示用整场累计（含盘点段）；撤销用本段消耗
    var sessionList = self._sessionUsedList();
    var sessionText = self._sessionUsedText();
    var usedStr = sessionText || (self.data.lastUsedBallName && self.data.lastUsedBallName.length > 2 ? self.data.lastUsedBallName : i18n.t('imgNoBallsUsed'));
    var isUsedDice = !!self.data.resultUsedDice;
    var record = {
      time: formatTimeShort(), balls: usedStr,
      result: localizeResultText(result, result === 'success' ? '异色捕获成功' : '歪了'),
      remark: self.data.resultRemark || '',
      // 异色龙龙骰不占用保底和奇遇
      total: isUsedDice ? 0 : 1,
      cost: 0, gain: self._resultGainVal || 0,
      pet: self.data.resultPetName || '', petImageUrl: self.data.resultPetImageUrl || '',
      resultRaw: result,
      elapsedSec: self.data._resultElapsedSec != null ? self.data._resultElapsedSec : null,
      elapsedTimeText: self.data._resultElapsedTime ? i18n.t('clipDuration') + ': ' + self.data._resultElapsedTime : '',
      ballImageUrl: self._lastUsedBallImg || '',
      contractBall: self.data.contractBall || '',
      contractBallImg: self.data.contractBallImg || '',
      encounters: isUsedDice ? 0 : (self.data.luckyBoxCount || 0),
      brushMode: self.data.brushMode || 'single',
      mixedPets: self.data._resultMixedPetNames || '', targetPet: self.data._resultTargetPet || '',
      carnivalCount: self.data.carnivalCount || 0, luckyBoxCount: self.data.luckyBoxCount || 0,
      pityBefore: self.data.pityCount || 0, elapsedAuto: self.data._resultElapsedAuto || false,
      usedBalls: self._usedBallsDetail || [],
      sessionUsedBalls: sessionList,
      usedDice: isUsedDice,
      diceDeductedInModal: !!self._diceDeductedInModal
    };
    return record;
  },
  _saveRecordCore: function(record, isClear) {
    var self = this;
    var result = record.resultRaw;
    var isUsedDice = !!record.usedDice;
    var catchCount = isUsedDice ? 0 : (record.total || 0);
    var newTotalCatches = self.data.totalCatches + catchCount;
    var newSuccessCatches = self.data.successCatches + (result === 'success' ? catchCount : 0);
    var newCosts = self.data.totalCosts;
    var accumulated = self.data.totalGains - newCosts;
    wx.setStorageSync('total_catches', newTotalCatches);
    wx.setStorageSync('success_catches', newSuccessCatches);
    if (self.data._resultElapsedTime) self.setData({ resultElapsedTime: self.data._resultElapsedTime, resultElapsedAuto: self.data._resultElapsedAuto });
    self.setData({ lastUsedBallName: '', lastUsedCount: 0 });
    self._usedBallsDetail = [];
    self._resultGainVal = 0;
    var h = [record].concat(self.data.history).slice(0, 20);
    wx.setStorageSync('catch_history', h);
    var isShiny = (result === 'success' || result === 'miss');
    // 异色龙龙骰不占用保底：启用龙龙骰时不重置也不增加保底进度
    if (!isUsedDice) {
      if (isShiny && self.data.autoResetPity) {
        // 自动重置：成功清零；歪了看「继续连抓」，但选了「清除本次捕捉(重新开始)」则强制归零
        if (result === 'miss' && self.data.continuePity && !isClear) {
          self.updatePity((wx.getStorageSync('pity_count') || 0) + 1);
        } else {
          self.updatePity(0);
        }
      } else if (isShiny && !self.data.autoResetPity) {
        // 手动重置：成功清零；歪了按用户选择——清除则归零，继续累计则 +1
        if (isClear) {
          self.updatePity(0);
        } else {
          self.updatePity((wx.getStorageSync('pity_count') || 0) + 1);
        }
      } else {
        if (isClear) self.updatePity((wx.getStorageSync('pity_count') || 0) + 1);
      }
    }
    // used_ball_total 已在 onResultBallConfirm / onBallCheckConfirm 累加，这里不再重复计
    var updates = {
      totalCatches: newTotalCatches, successCatches: newSuccessCatches,
      totalCosts: newCosts, accumulatedWealth: accumulated,
      totalWealth: self.data.initialWealth + accumulated, history: h, result: ''
    };
    if (isClear) {
      // 异色龙龙骰不占用奇遇：仅非龙龙骰捕获结算时才清空奇遇次数
      if (!isUsedDice) {
        wx.removeStorageSync('lucky_box_count');
        updates.luckyBoxCount = 0;
      }
      wx.removeStorageSync('session_used_dice');
      self._clearSessionUsed();
      updates.selectedBall = null;
      updates.sessionUsedDice = false;
      updates.resultUsedDice = false;
    }
    self.setData(updates);
    // 「清除本次捕捉」= 本场结束，计时归零；「继续累计」= 同一场，接着计
    if (isClear) self._resetCaptureClock();
    self.updateSuccessRate();
    self.updateGemCost();
    wx.showToast({ title: isClear ? '✅ 已记录并清除球数据' : '✅ 记录成功', icon: 'none' });
  },
  onRecordContinue: function(resultType) {
    this._saveRecordCore(this._buildRecord(resultType), false);
  },
  onRecordClear: function(resultType) {
    this._saveRecordCore(this._buildRecord(resultType), true);
  },
  
  // 战报/文案只取真正的捕捉记录，跳过盘点/微调/奇遇
  _findLastCaptureRecord: function() {
    var hist = this.data.history || [];
    for (var i = 0; i < hist.length; i++) {
      var rec = hist[i];
      if (!rec) continue;
      if (rec.resultRaw === 'success' || rec.resultRaw === 'miss') return rec;
      var rs = rec.result || '';
      if (rs.indexOf('盘点') >= 0 || rs.indexOf('微调') >= 0 || rs.indexOf('奇遇') >= 0 || rs.indexOf('龙龙骰') >= 0) continue;
      if (rs.indexOf('成功') >= 0 || rs.indexOf('歪了') >= 0 || rs.indexOf('异色') >= 0) return rec;
    }
    return null;
  },
  onGenerateImage: function() {
    var self = this;
    wx.showLoading({ title: '生成高阶战报中...' });
    
    var query = wx.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec(function(res) {
      if (!res[0] || !res[0].node) {
        wx.hideLoading();
        if(self.copyToClipboard) self.copyToClipboard();
        wx.showToast({ title: '生成图片失败，已为您复制文本', icon: 'none' });
        return;
      }
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      var width = 400;
      
      // ─── 1. 数据计算 ───
      // 战报只取真正的捕捉记录（成功/歪了），跳过盘点/微调/奇遇事件
      var last = self._findLastCaptureRecord();
      var hasHistory = !!last;

      var allBalls = self.data.balls || [];
      // 消耗球类 = 本场累计（sessionUsedBalls）；旧记录回退本段 usedBalls / xN 文本
      // 注意：「剩余N」是库存快照不是消耗，绝不能当成已用
      var parsedBalls = [];
      var noBallsText = i18n.t('imgNoBallsUsed');
      var ballSource = (last && last.sessionUsedBalls && last.sessionUsedBalls.length) ? last.sessionUsedBalls
        : (last && last.usedBalls && last.usedBalls.length) ? last.usedBalls : null;
      if (ballSource) {
        for (var ubi = 0; ubi < ballSource.length; ubi++) {
          var ub = ballSource[ubi];
          if (!ub || !ub.name || !(ub.count > 0)) continue;
          var ubImg = '';
          for (var ubj = 0; ubj < allBalls.length; ubj++) {
            if (allBalls[ubj].name === ub.name) { ubImg = allBalls[ubj].img || ''; break; }
          }
          parsedBalls.push({ name: ub.name, count: ub.count, img: ubImg });
        }
      } else if (last && last.balls && last.balls !== noBallsText && last.balls !== '未使用球'
        && last.balls.indexOf('充值') === -1 && last.balls.indexOf('购买') === -1
        && last.balls.indexOf('🌟') === -1 && last.balls.indexOf('🎁') === -1 && last.balls.indexOf('🎲') === -1
        && last.balls.indexOf('💰') === -1 && last.balls.indexOf('💸') === -1 && last.balls.indexOf('✨') === -1
        && last.balls.indexOf('[盘点]') === -1 && last.balls.indexOf('剩余') === -1) {
        var ballParts = last.balls.replace(/^📋\s*/, '').split(', ');
        for (var bpi = 0; bpi < ballParts.length; bpi++) {
          var ballStr = ballParts[bpi].trim();
          if (!ballStr) continue;
          var bName = '', bCount = 0;
          // 只认 "name xN" 消耗格式
          var xMatch = ballStr.match(/^(.+?)\s*x(\d+)/);
          if (xMatch) { bName = xMatch[1].trim(); bCount = parseInt(xMatch[2]) || 0; }
          if (!bName || isNaN(bCount) || bCount <= 0) continue;
          var bImg = '';
          for (var bj = 0; bj < allBalls.length; bj++) {
            if (allBalls[bj].name === bName) { bImg = allBalls[bj].img || ''; break; }
          }
          parsedBalls.push({ name: bName, count: bCount, img: bImg });
        }
      }
      
      var remarkOffset = 0;
      if (last && last.remark) {
        remarkOffset = Math.min(2, Math.ceil(last.remark.length / 26)) * 18;
      } else if (last && (last.result||'').indexOf('(') > -1) {
        var rIdx = (last.result||'').indexOf('(');
        var remark = (last.result||'').substring(rIdx + 1).replace(/\)+$/, '').trim();
        remarkOffset = Math.min(2, Math.ceil(remark.length / 26)) * 18;
      }
      var ballRows = parsedBalls.length > 0 ? Math.ceil(parsedBalls.length / 2) : 0;
      var ballGridHeight = ballRows * 28;
      var height = Math.max(700, (hasHistory ? 680 : 0) + ballGridHeight + remarkOffset + 60);
      var imgScale = height > 700 ? Math.max(0.6, 1 - (height - 700) / 800) : 1;
      
      // ─── 2. 画布初始化 ───
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      var imgLoadCount = 0;
      var imgTotalCount = 0;
      var loadImg = function(url, onLoad) {
        if (!url) return;
        imgTotalCount++;
        var tryDraw = function(path) {
          var img = canvas.createImage();
          img.onload = function() { onLoad(img); imgLoadCount++; };
          img.onerror = function() {
            // 直接加载失败，尝试 getImageInfo 转格式
            wx.getImageInfo({ src: path, success: function(info) {
              var img2 = canvas.createImage(); img2.src = info.path;
              img2.onload = function() { onLoad(img2); imgLoadCount++; };
              img2.onerror = function() { imgLoadCount++; };
            }, fail: function() { imgLoadCount++; }});
          };
          img.src = path;
        };
        if (url.indexOf('cloud://') === 0) {
          wx.cloud.getTempFileURL({ fileList: [url], success: function(res) {
            if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
              tryDraw(res.fileList[0].tempFileURL);
            } else { imgLoadCount++; }
          }, fail: function() { imgLoadCount++; }});
        } else if (url.indexOf('http') === 0) {
          wx.downloadFile({ url: url, success: function(res) {
            if (res.statusCode === 200) { tryDraw(res.tempFilePath); }
            else { imgLoadCount++; }
          }, fail: function() { imgLoadCount++; }});
        } else {
          tryDraw(url);
        }
      };
      
      var saveCanvasRetries = 0;
      var saveCanvas = function() {
        if (imgLoadCount < imgTotalCount && saveCanvasRetries < 25) {
          saveCanvasRetries++;
          setTimeout(saveCanvas, 200);
          return;
        }
        wx.canvasToTempFilePath({
          x: 0, y: 0, width: width, height: height,
          destWidth: width * dpr, destHeight: height * dpr, canvas: canvas,
          success: function(res) { wx.hideLoading(); wx.previewImage({ urls: [res.tempFilePath] }); },
          fail: function() { wx.hideLoading(); wx.showToast({ title: '图片生成失败', icon: 'none' }); }
        });
      };
      
      var roundRect = function(x, y, w, h, r, fill, stroke) {
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
      
      // ─── 3. 背景 ───
      var bgGrd = ctx.createLinearGradient(0, 0, 0, height);
      bgGrd.addColorStop(0, '#0d1117'); bgGrd.addColorStop(1, '#010409');
      ctx.fillStyle = bgGrd; ctx.fillRect(0, 0, width, height);
      
      var orb = ctx.createRadialGradient(width, 0, 10, width, 0, 350);
      orb.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
      orb.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, width, height);
      
      // ─── 4. 标题 + 异色标（各语言整组居中、垂直对齐）───
      ctx.fillStyle = '#00d4ff';
      var titleText = i18n.t('imgTitle');
      ctx.font = 'bold 24px sans-serif';
      var titleW = ctx.measureText(titleText).width;
      var titleFontSize = titleW > width * 0.8 ? Math.floor(24 * width * 0.8 / titleW) : 24;
      // 图标随字号缩放，长短标题都不歪
      var iconSize = Math.max(20, Math.round(titleFontSize * 28 / 24));
      var gap = 12;
      var maxTitleW = Math.max(40, width - 24 - iconSize - gap);
      ctx.font = 'bold ' + titleFontSize + 'px sans-serif';
      titleW = ctx.measureText(titleText).width;
      if (titleW > maxTitleW) {
        titleFontSize = Math.max(14, Math.floor(titleFontSize * maxTitleW / titleW));
        ctx.font = 'bold ' + titleFontSize + 'px sans-serif';
        titleW = ctx.measureText(titleText).width;
        iconSize = Math.max(18, Math.round(titleFontSize * 28 / 24));
      }
      // 图标 + 文字作为一组水平居中，垂直中心同为 y=50
      var groupW = iconSize + gap + titleW;
      var iconX = Math.max(8, (width - groupW) / 2);
      var titleMidY = 50;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(titleText, iconX + iconSize + gap, titleMidY);
      ctx.textBaseline = 'alphabetic';
      loadImg('https://patchwiki.biligame.com/images/rocom/2/2e/buxc6y4s0r7d8ix03zzkahnk4h8urtv.png', function(img) {
        if (img) {
          try { ctx.drawImage(img, iconX, titleMidY - iconSize / 2, iconSize, iconSize); } catch (e) {}
        }
      });
      
      // ─── 5. 统计面板 ───
      roundRect(20, 80, width - 40, 140, 14, 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.06)');
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(i18n.t('imgGenTime'), 36, 115);
      ctx.fillStyle = '#e6edf3'; ctx.font = '13px sans-serif'; ctx.fillText(self.data.buildTime, 36, 135);
      
      var isDiceShiny = !!(last && (last.usedDice || self.data.sessionUsedDice || (self.data.history && self.data.history[0] && self.data.history[0].resultRaw === 'use_dice')));
      var remainDice = self.data.carnivalCount != null ? self.data.carnivalCount : (last && last.carnivalCount != null ? last.carnivalCount : 0);
      var totalE = self.data.luckyBoxCount || 0;
      if (totalE === 0 && last && last.encounters !== undefined && !isDiceShiny) totalE = last.encounters;
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(isDiceShiny ? '异色龙龙骰' : i18n.t('imgEncounters'), width/2 + 16, 115);
      if (isDiceShiny) {
        ctx.fillStyle = '#ffd54f'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('剩余 ' + remainDice + ' 个 · 不占保底', width/2 + 16, 135);
      } else {
        ctx.fillStyle = '#e6edf3'; ctx.font = '13px sans-serif'; ctx.fillText(totalE + ' ' + i18n.t('imgEncounterUnit'), width/2 + 16, 135);
      }
      
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText(i18n.t('imgLuckRating'), 36, 175);
      ctx.fillStyle = '#ffab40'; ctx.font = 'bold 14px sans-serif';
      ctx.fillText(stripTitleEmoji(self.data.userTitle || ''), 36, 195);
      
      ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText(i18n.t('imgProfitLoss'), width/2 + 16, 175);
      // 总盈亏数值 + 洛克贝标识
      var plX = width / 2 + 16;
      var plY = 195;
      var plIconSize = 14;
      var plTextX = plX + plIconSize + 5;
      loadImg('https://patchwiki.biligame.com/images/nrc/1/10/blxvp7k90uq3p8prz24feerler3yfsi.png', function(img) {
        if (img) {
          try { ctx.drawImage(img, plX, plY - plIconSize + 1, plIconSize, plIconSize); } catch (e) {}
        }
      });
      if (self.data.accumulatedWealth === 0 || self.data.accumulatedWealth === '0') {
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(i18n.t('imgBreakEven'), plTextX, plY);
      } else {
        var isGain = self.data.accumulatedWealth >= 0;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = isGain ? '#3fb950' : '#f85149';
        ctx.fillText((isGain ? i18n.t('imgProfit') : i18n.t('imgLoss')) + ' ' + Math.abs(self.data.accumulatedWealth), plTextX, plY);
      }
      
      // ─── 6. 历史记录详情 ───
      if (!last) { setTimeout(saveCanvas, 500); return; }
      
      var boxH = 370 + ballGridHeight + remarkOffset;
      roundRect(20, 240, width - 40, boxH, 12, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
      
      ctx.fillStyle = '#e6edf3';
      ctx.font = 'bold 16px sans-serif';
      var latestRecordTitle = i18n.t('imgLatestRecord');
      ctx.fillText(latestRecordTitle, 36, 280);
      var latestTitleEndX = 36 + ctx.measureText(latestRecordTitle).width;
      
      var brushMode = last.brushMode || 'single';
      var brushLabel = brushMode === 'mixed' ? i18n.t('imgMixed') : i18n.t('imgSingle');
      ctx.font = '11px sans-serif';
      var tagW = ctx.measureText(brushLabel).width + 14;
      var tagX = width - 40 - tagW;
      if (brushMode === 'mixed') {
        roundRect(tagX, 264, tagW, 20, 4, 'rgba(224,64,251,0.08)', 'rgba(224,64,251,0.2)');
        ctx.fillStyle = '#d2a8ff';
      } else {
        roundRect(tagX, 264, tagW, 20, 4, 'rgba(125,200,255,0.08)', 'rgba(125,200,255,0.2)');
        ctx.fillStyle = '#79c0ff';
      }
      ctx.fillText(brushLabel, tagX + 7, 279);
      if (isDiceShiny) {
        var diceTagLabel = '🎲 异色龙龙骰 (剩余' + remainDice + ')';
        ctx.font = 'bold 11px sans-serif';
        var diceTagW = ctx.measureText(diceTagLabel).width + 14;
        var diceTagX = tagX - diceTagW - 8;
        if (diceTagX < latestTitleEndX + 8) {
          diceTagLabel = '🎲 剩余' + remainDice;
          diceTagW = ctx.measureText(diceTagLabel).width + 14;
          diceTagX = tagX - diceTagW - 8;
        }
        roundRect(diceTagX, 264, diceTagW, 20, 4, 'rgba(251,191,36,0.16)', 'rgba(251,191,36,0.55)');
        ctx.fillStyle = '#ffd54f';
        ctx.fillText(diceTagLabel, diceTagX + 7, 279);
      }
      ctx.font = '13px sans-serif';
      
      ctx.fillStyle = '#94a3b8';
      var statusLabel = i18n.t('imgStatus');
      var statusLabelW = ctx.measureText(statusLabel).width;
      ctx.fillText(statusLabel, 36, 320);
      var resText = last.result || i18n.t('imgUnknown');
      ctx.fillStyle = last.resultRaw === 'success' ? '#4ade80' : (last.resultRaw === 'miss' ? '#f87171' : '#ffffff');
      var cleanRes = localizeResultText(last.resultRaw, resText);
      var statusValueX = 36 + statusLabelW + 10;
      ctx.fillText(cleanRes, statusValueX, 320);
      var statusEndX = statusValueX + ctx.measureText(cleanRes).width;
      if (isDiceShiny) {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#ffd54f';
        var diceInlineText = (brushMode === 'mixed' && last.mixedPets) ? ' · 🎲龙龙骰' : ' · 🎲异色龙龙骰染色';
        ctx.fillText(diceInlineText, statusEndX + 4, 320);
        statusEndX += 4 + ctx.measureText(diceInlineText).width;
        ctx.font = '13px sans-serif';
      }
      
      if (brushMode === 'mixed' && last.mixedPets) {
        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'right';
        var maxW = Math.max(48, width - 40 - statusEndX - 10);
        var mixedText = last.mixedPets;
        while (ctx.measureText(mixedText).width > maxW && mixedText.length > 2) {
          mixedText = mixedText.substring(0, mixedText.length - 1);
        }
        if (mixedText !== last.mixedPets) mixedText += '…';
        ctx.fillText(mixedText, width - 40, 320);
        ctx.textAlign = 'left';
        ctx.font = '14px sans-serif';
      }
      
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
      
      var petNameY = 372 + remarkOffset;
      ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif';
      ctx.fillText(i18n.t('imgPetName'), 36, petNameY);
      var resultPet = last.targetPet || last.pet || '';
      if (resultPet) {
        ctx.fillStyle = (last.resultRaw === 'success' ? '#4ade80' : (last.resultRaw === 'miss' ? '#f87171' : '#ffffff'));
        ctx.fillText(resultPet, 106, petNameY);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(i18n.t('imgNotFilled'), 106, petNameY);
      }
      
      var etFull = localizeElapsed(last);
      if (etFull) {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(i18n.t('imgCatchDuration'), width/2 - 4, petNameY);
        ctx.fillStyle = '#ffffff';
        var et = etFull || i18n.t('imgUnknown');
        if (last.elapsedAuto) et += ' ' + ((i18n.i18n[i18n.getLanguage()] || {}).countdownAuto || '(自动)');
        ctx.font = '12px sans-serif';
        var maxEtW = width - 40 - (width/2 + 70) - 4;
        if (ctx.measureText(et).width > maxEtW) {
          ctx.font = '11px sans-serif';
          maxEtW = width - 40 - (width/2 + 70) - 4;
        }
        if (ctx.measureText(et).width > maxEtW) {
          while (et.length > 2 && ctx.measureText(et + '…').width > maxEtW) et = et.slice(0, -1);
          et += '…';
        }
        ctx.fillText(et, width/2 + 70, petNameY);
        ctx.font = '14px sans-serif';
      }
      
      // ─── 7. 消耗球类 ───
      var ballSectionY = 412 + remarkOffset;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(i18n.t('imgBallsConsumed'), 36, ballSectionY);
      
      if (parsedBalls.length === 1) {
        var ball = parsedBalls[0];
        var inlineY = ballSectionY + 14;
        var inlineX = 106;
        if (ball.img) {
          var bs = Math.round(20 * imgScale);
          loadImg(ball.img, function(ix, iy, s) { return function(img) {
            ctx.drawImage(img, ix, iy - s + 3, s, s);
          }; }(inlineX, inlineY, bs));
          inlineX += bs + 6;
        }
        ctx.font = '14px sans-serif'; ctx.fillStyle = '#ffffff';
        var maxNameW = width - 40 - inlineX - 70;
        var drawName = ball.name;
        while (drawName.length > 1 && ctx.measureText(drawName).width > maxNameW) {
          drawName = drawName.slice(0, -1);
        }
        if (drawName !== ball.name) drawName += '…';
        ctx.fillText(drawName, inlineX, inlineY);
        var nw = ctx.measureText(drawName).width;
        ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = ball.count > 0 ? '#00d4ff' : 'rgba(255,255,255,0.35)';
        ctx.fillText('  x' + ball.count, inlineX + nw + 8, inlineY);
      } else if (parsedBalls.length > 1) {
        var colW = (width - 90) / 2;
        for (var bj = 0; bj < parsedBalls.length; bj++) {
          var ball = parsedBalls[bj];
          var col = bj % 2;
          var row = Math.floor(bj / 2);
          var bx = 48 + col * colW;
          var by = ballSectionY + 16 + row * 28;
          var textY = by + 14;
          if (ball.img) {
            var bs = Math.round(18 * imgScale);
            loadImg(ball.img, function(bx, textY, bs) { return function(img) {
              ctx.drawImage(img, bx, textY - bs + 2, bs, bs);
            }; }(bx, textY, bs));
          }
          var textX = bx + (ball.img ? bs + 4 : 0);
          ctx.font = '12px sans-serif'; ctx.fillStyle = '#e2e8f0';
          // 名称限宽，避免与数量/下一列重叠
          var maxNameW2 = colW - (ball.img ? bs + 4 : 0) - 56;
          var drawName2 = ball.name;
          while (drawName2.length > 1 && ctx.measureText(drawName2).width > maxNameW2) {
            drawName2 = drawName2.slice(0, -1);
          }
          if (drawName2 !== ball.name) drawName2 += '…';
          ctx.fillText(drawName2, textX, textY);
          var nameW = ctx.measureText(drawName2).width;
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = ball.count > 0 ? '#00d4ff' : 'rgba(255,255,255,0.35)';
          ctx.fillText('x' + ball.count, textX + nameW + 8, textY);
        }
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(i18n.t('imgNoBallsUsed'), 106, ballSectionY + 16);
      }
      
      var petImgY = ballSectionY + ballGridHeight + 40;
      if (parsedBalls.length === 0) petImgY = ballSectionY + 35;
      var petSize = Math.round(110 * imgScale);
      var badgeSize = Math.round(28 * imgScale);
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

      // 契约球 & 异色龙龙骰染色：独立胶囊条，排在精灵图右侧（毛玻璃）
      var hasPetImg = !!(last.petImageUrl && last.petImageUrl.length > 5);
      var rightPadX = hasPetImg ? (50 + petSize + 16) : 36;
      var rightW = width - rightPadX - 28;
      if (last.contractBall && isDiceShiny) {
        var capH = Math.max(46, Math.round(50 * imgScale));
        var gapY = 8;
        var totalCapH = capH * 2 + gapY;
        var topCapY = Math.max(petImgY - 4, petImgY + Math.round((petSize - totalCapH) / 2));
        var line1Offset = Math.round(capH * 0.38);
        var line2Offset = Math.round(capH * 0.76);
        // 1. 契约球胶囊（如棱镜球等）
        var ctLabel = i18n.t('imgContractBall') || '契约球';
        roundRect(rightPadX, topCapY, rightW, capH, capH / 2, 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.28)');
        var ctBallSize = Math.max(24, Math.round(28 * imgScale));
        var ctIconX = rightPadX + 10;
        var ctIconY = topCapY + Math.round((capH - ctBallSize) / 2);
        if (last.contractBallImg && last.contractBallImg.length > 5) {
          loadImg(last.contractBallImg, (function(ix, iy, sz) {
            return function(img) {
              try { ctx.drawImage(img, ix, iy, sz, sz); } catch (e) {}
            };
          })(ctIconX, ctIconY, ctBallSize));
        } else {
          ctx.font = '15px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.fillText('🔮', ctIconX + 2, topCapY + Math.round(capH / 2) + 5);
        }
        var ctTextX = ctIconX + ctBallSize + 8;
        var maxCapTextW = rightPadX + rightW - 12 - ctTextX;
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(ctLabel, ctTextX, topCapY + line1Offset);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        var ctName = last.contractBall;
        while (ctName.length > 1 && ctx.measureText(ctName).width > maxCapTextW) {
          ctName = ctName.slice(0, -1);
        }
        if (ctName !== last.contractBall) ctName += '…';
        ctx.fillText(ctName, ctTextX, topCapY + line2Offset);

        // 2. 异色龙龙骰染色胶囊
        var botCapY = topCapY + capH + gapY;
        roundRect(rightPadX, botCapY, rightW, capH, capH / 2, 'rgba(251,191,36,0.14)', 'rgba(251,191,36,0.48)');
        ctx.font = '17px sans-serif';
        ctx.fillStyle = '#ffd54f';
        ctx.fillText('🎲', ctIconX + 2, botCapY + Math.round(capH / 2) + 6);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(255,213,79,0.78)';
        var diceSubText = '染色方式 · 剩余 ' + remainDice + ' 个';
        if (ctx.measureText(diceSubText).width > maxCapTextW) {
          diceSubText = '剩余 ' + remainDice + ' 个';
        }
        ctx.fillText(diceSubText, ctTextX, botCapY + line1Offset);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#ffd54f';
        var diceMainText = '异色龙龙骰染色';
        while (diceMainText.length > 1 && ctx.measureText(diceMainText).width > maxCapTextW) {
          diceMainText = diceMainText.slice(0, -1);
        }
        ctx.fillText(diceMainText, ctTextX, botCapY + line2Offset);
      } else if (last.contractBall) {
        var ctLabel = i18n.t('imgContractBall') || '契约球';
        var ctPadX = rightPadX;
        var ctH = Math.max(54, Math.round(64 * imgScale));
        var ctY = petImgY + Math.round((petSize - ctH) / 2);
        var ctW = rightW;
        roundRect(ctPadX, ctY, ctW, ctH, ctH / 2, 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.28)');
        var ctBallSize = Math.max(28, Math.round(36 * imgScale));
        var ctIconX = ctPadX + 12;
        var ctIconY = ctY + Math.round((ctH - ctBallSize) / 2);
        if (last.contractBallImg && last.contractBallImg.length > 5) {
          loadImg(last.contractBallImg, (function(ix, iy, sz) {
            return function(img) {
              try { ctx.drawImage(img, ix, iy, sz, sz); } catch (e) {}
            };
          })(ctIconX, ctIconY, ctBallSize));
        } else {
          ctx.font = '16px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.fillText('🔮', ctIconX + 2, ctY + Math.round(ctH / 2) + 6);
        }
        var ctTextX = ctIconX + ctBallSize + 10;
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(ctLabel, ctTextX, ctY + Math.round(ctH * 0.36));
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        var ctNameMax = ctPadX + ctW - 14 - ctTextX;
        var ctName = last.contractBall;
        while (ctName.length > 1 && ctx.measureText(ctName).width > ctNameMax) {
          ctName = ctName.slice(0, -1);
        }
        if (ctName !== last.contractBall) ctName += '…';
        ctx.fillText(ctName, ctTextX, ctY + Math.round(ctH * 0.72));
      } else if (isDiceShiny) {
        var dcH = Math.max(54, Math.round(64 * imgScale));
        var dcY = petImgY + Math.round((petSize - dcH) / 2);
        roundRect(rightPadX, dcY, rightW, dcH, dcH / 2, 'rgba(251,191,36,0.14)', 'rgba(251,191,36,0.48)');
        var dcIconX = rightPadX + 14;
        ctx.font = '22px sans-serif';
        ctx.fillStyle = '#ffd54f';
        ctx.fillText('🎲', dcIconX, dcY + Math.round(dcH / 2) + 8);
        var dcTextX = dcIconX + 34;
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(255,213,79,0.75)';
        ctx.fillText('染色方式 · 剩余 ' + remainDice + ' 个', dcTextX, dcY + Math.round(dcH * 0.36));
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#ffd54f';
        ctx.fillText('异色龙龙骰染色', dcTextX, dcY + Math.round(dcH * 0.72));
      }
      
      // ─── 8. 底部签名 ───
      var dividerY = height - 70;
      ctx.beginPath(); ctx.moveTo(20, dividerY); ctx.lineTo(width - 20, dividerY);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke();
      
      var footerY = dividerY + 18;
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px sans-serif';
      ctx.fillText(i18n.t('imgFooterTech'), 24, footerY);
      ctx.fillText(i18n.t('imgFooterDev'), 24, footerY + 14);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.font = '9px sans-serif';
      ctx.fillText(i18n.t('imgFooterDisc'), 24, footerY + 26);
      
      var userInfo = wx.getStorageSync('user_info');
      if (userInfo && userInfo.avatarUrl && userInfo.nickName) {
        var uid = wx.getStorageSync('game_uid');
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px sans-serif';
        var nickText = '@' + userInfo.nickName;
        // 测量左侧文字宽度，避免重叠
        var leftTextW = ctx.measureText(i18n.t('imgFooterTech')).width;
        var nickW = ctx.measureText(nickText).width;
        if (leftTextW + nickW + 24 > width) {
          // 重叠则换行显示昵称
          ctx.fillText(nickText, width - 24, footerY + 14);
        } else {
          ctx.fillText(nickText, width - 24, footerY);
        }
        if (uid) {
          ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.font = '9px sans-serif';
          ctx.fillText(i18n.t('imgUID') + uid, width - 24, footerY + 14);
        }
        ctx.textAlign = 'left';
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
      
      setTimeout(saveCanvas, 500);
    });
  },
  copyToClipboard: function() {
    var last = this._findLastCaptureRecord();
    if (!last) return;
    let totalEncounters = this.data.luckyBoxCount || 0;
    if (totalEncounters === 0 && last.encounters !== undefined && !last.usedDice) {
      totalEncounters = last.encounters;
    }

    var brushLabel = last.brushMode === 'mixed' ? '【' + i18n.t('clipMode') + '】' + i18n.t('imgMixed') + '\n' : '【' + i18n.t('clipMode') + '】' + i18n.t('imgSingle') + '\n';
    var petDisplay = last.brushMode === 'mixed' && last.mixedPets
      ? '【' + i18n.t('clipPet') + '】' + last.mixedPets + '\n'
      : '【' + i18n.t('clipPet') + '】' + (last.pet || i18n.t('imgNotFilled')) + '\n';

    // 消耗展示：优先整场累计，避免把「剩余N」文案当成消耗
    var costText = '';
    var src = (last.sessionUsedBalls && last.sessionUsedBalls.length) ? last.sessionUsedBalls
      : (last.usedBalls && last.usedBalls.length) ? last.usedBalls : null;
    if (src && src.length) {
      var parts = [];
      for (var i = 0; i < src.length; i++) {
        if (src[i] && src[i].name && src[i].count > 0) parts.push(src[i].name + 'x' + src[i].count);
      }
      costText = parts.join(', ');
    }
    if (!costText) {
      var bt = last.balls || '';
      if (bt.indexOf('剩余') >= 0 || bt.indexOf('[盘点]') >= 0) costText = i18n.t('imgNoBallsUsed');
      else costText = bt || i18n.t('imgNoBallsUsed');
    }

    var isDiceClip = !!(last.usedDice || this.data.sessionUsedDice || (this.data.history && this.data.history[0] && this.data.history[0].resultRaw === 'use_dice'));
    var remainDiceClip = this.data.carnivalCount != null ? this.data.carnivalCount : (last.carnivalCount != null ? last.carnivalCount : 0);
    var text = i18n.t('clipTitle') + '\n' +
               '【' + i18n.t('clipTime') + '】' + (last.time || last.date || '') + '\n' +
               '【' + i18n.t('clipStatus') + '】' + localizeResultText(last.resultRaw, last.result) + (isDiceClip ? '（🎲异色龙龙骰染色 · 剩余' + remainDiceClip + '个）' : '') + '\n' +
               brushLabel +
               petDisplay +
               '【' + i18n.t('clipCost') + '】' + costText + '\n' +
               (last.contractBall ? '【' + (i18n.t('imgContractBall') || '契约球') + '】' + last.contractBall + '\n' : '') +
               '【' + i18n.t('clipDuration') + '】' + (localizeElapsed(last) || i18n.t('imgUnknown')) + '\n\n' +
               i18n.t('clipStats') + '\n' +
               '【' + i18n.t('clipTime') + '】' + this.data.buildTime + '\n' +
               '【' + (isDiceClip ? '异色龙龙骰' : i18n.t('clipEncounters')) + '】' + (isDiceClip ? ('剩余 ' + remainDiceClip + ' 个（不占保底与奇遇）') : (totalEncounters + ' ' + i18n.t('imgEncounterUnit'))) + '\n' +
               '【' + i18n.t('clipLuck') + '】' + stripTitleEmoji(this.data.userTitle || '') + '\n' +
               '【' + i18n.t('clipProfit') + '】' + ((this.data.accumulatedWealth === 0 || this.data.accumulatedWealth === '0') ? i18n.t('imgBreakEven') : ((this.data.accumulatedWealth >= 0 ? '+' : '') + this.data.accumulatedWealth + ' ' + i18n.t('currency')));
               
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
    var title = this.calcTitle(rate, this.data.luckyBoxCount, this.data.totalCatches);
    this.setData({ successRate: rate, userTitle: title.name, titleColor: title.color, profitRate: profitRate });
  },
  calcTitle: function(rate, encounters, totalCatches) {
    if (totalCatches >= 500 && rate >= 60) return { name: i18n.t('title1'), color: '#00d4ff' }
    if (encounters >= 10 && rate >= 50) return { name: i18n.t('title2'), color: '#e040fb' }
    if (rate >= 80) return { name: i18n.t('title3'), color: '#ffab40' }
    if (rate >= 60) return { name: i18n.t('title4'), color: '#9945ff' }
    if (rate >= 45) return { name: i18n.t('title5'), color: '#34c759' }
    if (rate >= 30) return { name: i18n.t('title6'), color: 'rgba(255,255,255,0.5)' }
    if (rate >= 20) return { name: i18n.t('title7'), color: '#ff9800' }
    return { name: i18n.t('title8'), color: '#ff4757' }
  },
  calcTotalBallUsed: function() {
    var total = 0
    for (var i = 0; i < this.data.balls.length; i++) {
      total += this.data.balls[i].count
    }
    var used = wx.getStorageSync('used_ball_total') || 0
    this.setData({ totalBallUsed: total, usedBallTotal: used })
  },
  // ─── 场次累计消耗：整场捕捉（含每10次盘点段）的总用量 ───
  _loadSessionUsed: function() {
    if (!this._sessionUsedBalls) {
      this._sessionUsedBalls = wx.getStorageSync('session_used_balls') || {};
    }
    return this._sessionUsedBalls;
  },
  _addSessionUsed: function(details) {
    if (!details || !details.length) return;
    var s = this._loadSessionUsed();
    for (var i = 0; i < details.length; i++) {
      var d = details[i];
      if (!d || !d.name || !(d.count > 0)) continue;
      if (!s[d.name]) s[d.name] = { name: d.name, count: 0, freeUsed: 0 };
      s[d.name].count += d.count;
      s[d.name].freeUsed = (s[d.name].freeUsed || 0) + (d.freeUsed || 0);
    }
    wx.setStorageSync('session_used_balls', s);
  },
  _subSessionUsed: function(details) {
    if (!details || !details.length) return;
    var s = this._loadSessionUsed();
    for (var i = 0; i < details.length; i++) {
      var d = details[i];
      if (!d || !d.name) continue;
      var cur = s[d.name];
      if (!cur) continue;
      cur.count = Math.max(0, cur.count - (d.count || 0));
      cur.freeUsed = Math.max(0, (cur.freeUsed || 0) - (d.freeUsed || 0));
      if (cur.count <= 0) delete s[d.name];
    }
    wx.setStorageSync('session_used_balls', s);
  },
  _clearSessionUsed: function() {
    this._sessionUsedBalls = {};
    wx.removeStorageSync('session_used_balls');
  },
  _restoreSessionUsed: function(list) {
    this._sessionUsedBalls = {};
    if (list && list.length) {
      for (var i = 0; i < list.length; i++) {
        var d = list[i];
        if (!d || !d.name || !(d.count > 0)) continue;
        this._sessionUsedBalls[d.name] = { name: d.name, count: d.count, freeUsed: d.freeUsed || 0 };
      }
    }
    wx.setStorageSync('session_used_balls', this._sessionUsedBalls);
  },
  _sessionUsedList: function() {
    var s = this._loadSessionUsed();
    var arr = [];
    for (var k in s) {
      if (s[k] && s[k].count > 0) arr.push({ name: s[k].name, count: s[k].count, freeUsed: s[k].freeUsed || 0 });
    }
    return arr;
  },
  _sessionUsedText: function() {
    var arr = this._sessionUsedList();
    if (!arr.length) return '';
    return arr.map(function(x) { return x.name + 'x' + x.count; }).join(', ');
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
    let totalEncounters = self.data.luckyBoxCount;
    if (totalEncounters === 0 && history && history.length > 0 && history[0].encounters !== undefined) {
      totalEncounters = history[0].encounters;
    }
          var newHistory = history.slice(1);

          var catchCount = last.total || 0;
          var newTotalCatches = Math.max(0, self.data.totalCatches - catchCount);
          var isSuccess = last.resultRaw === 'success' || (last.result && (last.result.indexOf('成功') >= 0 || last.result === '奇遇'));
          var newSuccessCatches = Math.max(0, self.data.successCatches - (isSuccess ? catchCount : 0));

          // 回滚洛克贝：成本按 cost 退，收益按 gain 退（捕获记录的奇遇收益 / 资产微调的增加额）
          var cost = last.cost || 0;
          var gain = last.gain || 0;
          var newCosts = Math.max(0, self.data.totalCosts - cost);
          var newGains = self.data.totalGains - gain;
          var newAccumulated = newGains - newCosts;

          var balls = self.data.balls.slice();
          var ballUsedCount = 0;
          var undoSessionDetails = [];

          // 盘点记录：按 checkDiffs 精准回滚到盘点前库存
          if (last.result === '盘点' && last.checkDiffs && last.checkDiffs.length) {
            for (var ci = 0; ci < last.checkDiffs.length; ci++) {
              var cd = last.checkDiffs[ci];
              if (!cd || !cd.name) continue;
              ballUsedCount += cd.count || 0;
              undoSessionDetails.push({ name: cd.name, count: cd.count || 0, freeUsed: cd.freeUsed || 0 });
              for (var cj = 0; cj < balls.length; cj++) {
                if (balls[cj].name === cd.name) {
                  balls[cj].count = cd.countBefore != null ? cd.countBefore : (balls[cj].count + (cd.count || 0));
                  if (cd.freeBefore != null) balls[cj].freeCount = cd.freeBefore;
                  else balls[cj].freeCount = (balls[cj].freeCount || 0) + (cd.freeUsed || 0);
                  break;
                }
              }
            }
          } else if (last.usedBalls && last.usedBalls.length) {
            // 优先用结构化 usedBalls 还原（含免费额度）
            for (var i = 0; i < last.usedBalls.length; i++) {
              var ub = last.usedBalls[i];
              var ubCount = ub.count || 0;
              var ubFree = ub.freeUsed || 0;
              if (ubCount <= 0 && ubFree <= 0) continue;
              ballUsedCount += ubCount;
              undoSessionDetails.push({ name: ub.name, count: ubCount, freeUsed: ubFree });
              for (var j = 0; j < balls.length; j++) {
                if (balls[j].name === ub.name) {
                  balls[j].count += ubCount;
                  balls[j].freeCount = (balls[j].freeCount || 0) + ubFree;
                  break;
                }
              }
            }
          } else if (last.balls && last.balls !== '未使用球' && last.result !== '龙龙骰'
            && last.balls.indexOf('充值') === -1 && last.balls.indexOf('购买') === -1
            && last.balls.indexOf('🌟') === -1 && last.balls.indexOf('🎁') === -1 && last.balls.indexOf('🎲') === -1
            && last.balls.indexOf('🔮') === -1 && last.balls.indexOf('🧪') === -1
            && last.balls.indexOf('💰') === -1 && last.balls.indexOf('💸') === -1 && last.balls.indexOf('✨') === -1
            && last.balls.indexOf('[盘点]') === -1) {
            // 旧记录：从文本还原数量（不含免费额度）；盘点文本格式是「剩余N」不能当已用量回滚
            var ballParts = last.balls.replace(/^📋\s*/, '').split(', ');
            for (var i = 0; i < ballParts.length; i++) {
              var ballStr = ballParts[i].trim();
              var bName = '', bCount = 0;
              var xMatch = ballStr.match(/^(.+?)\s*x(\d+)/);
              if (xMatch) { bName = xMatch[1].trim(); bCount = parseInt(xMatch[2]) || 0; }
              if (!isNaN(bCount) && bCount > 0) {
                ballUsedCount += bCount;
                undoSessionDetails.push({ name: bName, count: bCount, freeUsed: 0 });
                for (var j = 0; j < balls.length; j++) {
                  if (balls[j].name === bName) { balls[j].count += bCount; break; }
                }
              }
            }
          }

          // 回滚奇遇计数
          if (last.resultRaw === 'use_dice' || (last.balls && last.balls.indexOf('异色龙龙骰染色') >= 0)) {
            var restoredDice = self.data.carnivalCount + 1;
            wx.setStorageSync('carnival_count', restoredDice);
            wx.removeStorageSync('session_used_dice');
            self.setData({ carnivalCount: restoredDice, sessionUsedDice: false });
          } else if (last.usedDice) {
            if (last.diceDeductedInModal) {
              var restoredModalDice = self.data.carnivalCount + 1;
              wx.setStorageSync('carnival_count', restoredModalDice);
              self.setData({ carnivalCount: restoredModalDice });
            } else {
              wx.setStorageSync('session_used_dice', true);
              self.setData({ sessionUsedDice: true });
            }
          } else if (last.resultRaw === 'add_dice' || last.result === '龙龙骰' || (last.balls && last.balls.indexOf('🌟') >= 0)) {
            // 仅异色龙龙骰计入剩余面板，词条骰子撤销时不扣减
            if (last.balls && (last.balls.indexOf('异色') >= 0 || last.balls.indexOf('🌟') >= 0)) {
              var newCarnival = Math.max(0, self.data.carnivalCount - 1);
              wx.setStorageSync('carnival_count', newCarnival);
              self.setData({ carnivalCount: newCarnival });
            }
          } else if (last.balls && last.balls.indexOf('🎁') >= 0) {
            var newLucky = Math.max(0, self.data.luckyBoxCount - (last.total || 1));
            wx.setStorageSync('lucky_box_count', newLucky);
            self.setData({ luckyBoxCount: newLucky });
          } else if (!last.usedDice && (last.carnivalCount !== undefined || last.luckyBoxCount !== undefined)) {
            // 捕获记录：恢复被 onRecordClear 清掉的奇遇次数（龙龙骰持续累计不回退为旧快照）
            var restoreLucky = last.luckyBoxCount || 0;
            wx.setStorageSync('lucky_box_count', restoreLucky);
            self.setData({ luckyBoxCount: restoreLucky });
          }

          var newUsedBallTotal = Math.max(0, self.data.usedBallTotal - ballUsedCount);
          // 库存总数 = 回滚后各球剩余之和（不能用 totalBallUsed - usedCount，盘点回滚方向相反）
          var newTotalBallUsed = 0;
          for (var ti = 0; ti < balls.length; ti++) newTotalBallUsed += balls[ti].count;

          // 整场累计：撤销本段后恢复到记录时的累计再减本段
          if (undoSessionDetails.length) {
            if (last.sessionUsedBalls && last.sessionUsedBalls.length) {
              var restored = [];
              for (var si = 0; si < last.sessionUsedBalls.length; si++) {
                var su = last.sessionUsedBalls[si];
                if (!su || !su.name || !(su.count > 0)) continue;
                var seg = 0;
                for (var ui = 0; ui < undoSessionDetails.length; ui++) {
                  if (undoSessionDetails[ui].name === su.name) { seg = undoSessionDetails[ui].count || 0; break; }
                }
                var left = su.count - seg;
                if (left > 0) restored.push({ name: su.name, count: left, freeUsed: Math.max(0, (su.freeUsed || 0)) });
              }
              self._restoreSessionUsed(restored);
            } else {
              self._subSessionUsed(undoSessionDetails);
            }
          }

          // 回退保底进度（异色龙龙骰不占保底，撤销时不改动保底进度）
          if (!last.usedDice && last.resultRaw !== 'use_dice' && last.result !== '龙龙骰') {
            if (last.pityBefore !== undefined) {
              self.updatePity(last.pityBefore);
            } else {
              var newPity = Math.max(0, self.data.pityCount - catchCount);
              self.updatePity(newPity);
            }
          }

          wx.setStorageSync('catch_history', newHistory);
          wx.setStorageSync('total_catches', newTotalCatches);
          wx.setStorageSync('success_catches', newSuccessCatches);
          wx.setStorageSync('total_costs', newCosts);
          wx.setStorageSync('total_gains', newGains);
          wx.setStorageSync('used_ball_total', newUsedBallTotal);

          self.saveBallsToStorage(balls);

          var hasActive = false;
          for (var i = 0; i < balls.length; i++) { if (balls[i].count > 0) { hasActive = true; break; } }

          self.setData({
            history: newHistory,
            totalCatches: newTotalCatches,
            successCatches: newSuccessCatches,
            totalCosts: newCosts,
            totalGains: newGains,
            accumulatedWealth: newAccumulated,
            totalWealth: self.data.initialWealth + newAccumulated,
            usedBallTotal: newUsedBallTotal,
            totalBallUsed: newTotalBallUsed,
            balls: balls,
            hasActiveBalls: hasActive,
            canStartCapture: self.data.wealthSet && hasActive
          });

          self.updateSuccessRate();
          self.updateGemCost();
          wx.showToast({ title: '已撤销', icon: 'success' });
        }
      }
    });
  },
  onClearHistory: function() { var self=this; wx.showModal({ title:'清空', content:'确定清空？', success:function(r){ if(r.confirm){ wx.removeStorageSync('catch_history'); wx.removeStorageSync('total_catches'); wx.removeStorageSync('success_catches'); self.setData({history:[],totalCatches:0,successCatches:0}) } } }) },
  
  onEncounterTab: function(e) { this.setData({ encounterTab: e.currentTarget.dataset.t }) },
  addEncounterRecord: function(type, icon, count, skipPity) {
    var record = { time: formatTimeShort(), balls: type, result: skipPity ? '龙龙骰' : '奇遇', resultRaw: skipPity ? 'add_dice' : 'event', total: skipPity ? 0 : 1, icon: icon, count: count, pityBefore: this.data.pityCount || 0 }
    var h = [record].concat(this.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    this.setData({ history: h })
    
    if (!skipPity) {
      var currentPity = wx.getStorageSync('pity_count') || 0
      var newPity = Math.min(80, currentPity + 1)
      this.updatePity(newPity)
    }
    this.updateSuccessRate()
    
    var totalEncounters = this.data.luckyBoxCount || 0
    if (!skipPity && totalEncounters > 0 && totalEncounters % 10 === 0) {
      this.triggerFairytaleParticles()
      var self = this
      setTimeout(function() { self.showBallCheckModal() }, 800)
    }
  },
  onClearPity: function() {
    var self = this;
    var currentPity = this.data.pityCount;
    if (currentPity === 0) {
      wx.showToast({ title: '保底已是初始状态', icon: 'none' });
      return;
    }
    var doReset = function() {
      var luckText = '';
      if (currentPity >= 71) luckText = '非酋大保底';
      else if (currentPity >= 66) luckText = '基本必出';
      else if (currentPity >= 60) luckText = '大概率';
      else if (currentPity >= 58) luckText = '较高概率';
      else if (currentPity >= 41) luckText = '非酋';
      else if (currentPity >= 31) luckText = '大欧皇';
      else luckText = '超级欧皇';
      self.updatePity(0);
      wx.showToast({ title: '保底已重置 (' + luckText + ')', icon: 'none' });
    };
    if (this.data.autoResetPity) {
      wx.showModal({
        title: '手动重置保底',
        content: '自动重置已开启，确定要手动清空当前保底进度吗？',
        confirmText: '确定重置',
        success: function(res) { if (res.confirm) doReset(); }
      });
    } else {
      doReset();
    }
  },
  onAddCarnival: function() {
    var self = this
    var diceOptions = ['词条骰子', '异色骰子', '奇异骰子', '污染骰子']
    wx.showActionSheet({
      alertText: '请选择龙龙骰类型（仅异色计入面板，均不占保底/奇遇）',
      itemList: diceOptions,
      success: function(res) {
        var diceType = diceOptions[res.tapIndex] || '词条骰子'
        self._recordCarnival(diceType, '')
      }
    })
  },
  _recordCarnival: function(diceType, ballName) {
    var self = this
    var validTypes = ['词条骰子', '异色骰子', '奇异骰子', '污染骰子']
    var typeLabel = validTypes.indexOf(diceType) >= 0 ? diceType : (diceType === false ? '词条骰子' : '异色骰子')
    var isShinyDice = typeLabel === '异色骰子'
    var c = self.data.carnivalCount || 0
    if (isShinyDice) {
      c = c + 1
      wx.setStorageSync('carnival_count', c)
    }
    self.setData({ carnivalCount: c, diceAnim: true })
    setTimeout(function() { self.setData({ diceAnim: false }) }, 750)
    var iconMap = { '词条骰子': '🎲', '异色骰子': '🌟', '奇异骰子': '🔮', '污染骰子': '🧪' }
    var icon = iconMap[typeLabel] || '🎲'
    var label = icon + ' 龙龙骰·' + typeLabel + (ballName ? '(' + ballName + ')' : '')
    self.addEncounterRecord(label, icon, c, true)
    self.triggerDiceParticles()
    wx.showToast({ title: label + (isShinyDice ? '（异色龙龙骰+1）' : '（不计入面板）'), icon: 'none' })
  },
  onUseDice: function() {
    var self = this
    var currentDice = self.data.carnivalCount || 0
    if (currentDice <= 0) {
      wx.showToast({ title: '暂无可用龙龙骰', icon: 'none' })
      return
    }
    var c = currentDice - 1
    wx.setStorageSync('carnival_count', c)
    wx.setStorageSync('session_used_dice', true)
    var prevHistory = (self.data.history || []).slice()
    if (prevHistory.length > 0 && prevHistory[0].resultRaw === 'success' && !prevHistory[0].usedDice) {
      prevHistory[0] = Object.assign({}, prevHistory[0], { usedDice: true, encounters: 0 })
    }
    var record = {
      time: formatTimeShort(),
      balls: '🎲 异色龙龙骰染色 (剩余' + c + '，不占保底和奇遇)',
      result: '龙龙骰',
      resultRaw: 'use_dice',
      total: 0,
      icon: '🎲',
      count: c,
      pityBefore: self.data.pityCount || 0
    }
    var h = [record].concat(prevHistory).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    self.setData({ carnivalCount: c, history: h, sessionUsedDice: true, diceAnim: true })
    setTimeout(function() { self.setData({ diceAnim: false }) }, 750)
    self.triggerDiceParticles()
    self.updateSuccessRate()
    wx.showToast({ title: '🎲 已启用异色龙龙骰染色（不占保底和奇遇，剩余 ' + c + '）', icon: 'none' })
  },
  onCarnivalLongPress: function() {
    var self = this
    var diceOptions = ['词条骰子', '异色骰子', '奇异骰子', '污染骰子']
    var iconMap = { '词条骰子': '🎲', '异色骰子': '🌟', '奇异骰子': '🔮', '污染骰子': '🧪' }
    wx.showActionSheet({
      alertText: '请选择龙龙骰类型（仅异色计入面板，均不占保底/奇遇）',
      itemList: diceOptions,
      success: function(typeRes) {
        var diceType = diceOptions[typeRes.tapIndex] || '词条骰子'
        var isShinyDice = diceType === '异色骰子'
        var icon = iconMap[diceType] || '🎲'
        var ballNames = []
        for (var i = 0; i < self.data.balls.length; i++) {
          ballNames.push(self.data.balls[i].name)
        }
        wx.showActionSheet({
          itemList: ballNames,
          success: function(res) {
            var ball = self.data.balls[res.tapIndex]
            wx.showModal({
              title: '龙龙骰·' + diceType,
              content: '使用 ' + ball.name + ' 获得 ' + diceType + '（不占保底和奇遇）',
              editable: true,
              placeholderText: '输入数量(默认1)',
              success: function(modalRes) {
                if (modalRes.confirm) {
                  var count = parseInt(modalRes.content) || 1
                  var c = self.data.carnivalCount || 0
                  if (isShinyDice) {
                    c = c + 1
                    wx.setStorageSync('carnival_count', c)
                  }
                  var balls = self.data.balls.slice()
                  balls[res.tapIndex].count += count
                  self.saveBallsToStorage(balls)
                  self.setData({ carnivalCount: c, balls: balls, diceAnim: true })
                  setTimeout(function() { self.setData({ diceAnim: false }) }, 750)
                  var label = icon + ' 龙龙骰·' + diceType + '(' + ball.name + ')'
                  self.addEncounterRecord(label, icon, c, true)
                  self.triggerDiceParticles()
                  self.calcTotalBallUsed()
                  wx.showToast({ title: label + (isShinyDice ? '（异色龙龙骰+1）' : '（不计入面板）'), icon: 'none' })
                }
              }
            })
          }
        })
      }
    })
  },
  
  onAddLuckyBox: function() {
    var self = this
    self._touchCaptureClock()
    var c = self.data.luckyBoxCount + 1
    var tc = self.data.totalCatches + 1
    var sc = self.data.successCatches + 1
    wx.setStorageSync('lucky_box_count', c)
    wx.setStorageSync('total_catches', tc)
    wx.setStorageSync('success_catches', sc)
    self.setData({ luckyBoxCount: c, totalCatches: tc, successCatches: sc })
    self.addEncounterRecord('🎁 龙骑士', '🎁', c)
    wx.showToast({ title: '🎁 龙骑士', icon: 'none' })
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
          title: '龙骑士',
          content: '使用 ' + ball.name + ' 触发龙骑士',
          editable: true,
          placeholderText: '输入捕捉数量(默认1)',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self._touchCaptureClock();
              var count = parseInt(modalRes.content) || 1
              var c = self.data.luckyBoxCount + 1
              var tc = self.data.totalCatches + count
              var sc = self.data.successCatches + count
              wx.setStorageSync('lucky_box_count', c)
              wx.setStorageSync('total_catches', tc)
              wx.setStorageSync('success_catches', sc)
              var balls = self.data.balls.slice()
              balls[res.tapIndex].count += count
              self.saveBallsToStorage(balls)
              self.setData({ luckyBoxCount: c, totalCatches: tc, successCatches: sc, balls: balls })
              self.addEncounterRecord('🎁 龙骑士(' + ball.name + ')', '🎁', c)
              self.calcTotalBallUsed()
              wx.showToast({ title: '🎁 龙骑士 使用' + ball.name + ' x' + count, icon: 'none' })
            }
          }
        })
      }
    })
  },
  onClearEncounter: function() {
    var self = this
    wx.showActionSheet({
      itemList: ['清除龙龙骰', '清除龙骑士', '清除所有异色统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '清除龙龙骰',
            content: '确定清除龙龙骰统计？',
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
            title: '清除龙骑士',
            content: '确定清除龙骑士统计？',
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
            content: '确定清除所有异色统计？包括龙龙骰和龙骑士',
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
      if (purchasedBalls[ball.name] && (ball.count > 0 || ball.freeCount > 0)) {
        items.push({
          name: ball.name,
          remain: '',
          usedDisplay: '',
          currentCount: ball.count,
          img: ball.img || '',
          icon: ball.icon || '',
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
    var checkDiffs = [];

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
            var countBefore = balls[i].count;
            var freeBefore = balls[i].freeCount || 0;
            var diff = countBefore - remaining;
            if (diff < 0) diff = 0; // 防止输入大于当前库存导致球数虚增
            if (diff > 0) {
              totalDiff += diff;
              var freeConsume = Math.min(diff, freeBefore);
              balls[i].freeCount = Math.max(0, freeBefore - freeConsume);
              checkDiffs.push({ name: bName, count: diff, freeUsed: freeConsume, countBefore: countBefore, freeBefore: freeBefore });
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
    var historyRecord = { time: formatTimeShort(), balls: '[盘点] ' + historyText.join(', '), result: '盘点', round: round, total: 0, cost: 0, pet: '', checkDiffs: checkDiffs };
    var h = [historyRecord].concat(self.data.history).slice(0, 20);
    wx.setStorageSync('catch_history', h);

    var totalBallUsed = 0;
    for (var j = 0; j < balls.length; j++) totalBallUsed += balls[j].count;
    var hasActive = false;
    for (var k = 0; k < balls.length; k++) { if (balls[k].count > 0) { hasActive = true; break; } }

    var newUsedBallTotal = self.data.usedBallTotal + totalDiff;
    if (totalDiff > 0) wx.setStorageSync('used_ball_total', newUsedBallTotal);
    // 盘点段的消耗计入整场累计
    self._addSessionUsed(checkDiffs);

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
  triggerDiceParticles: function() {
    var self = this
    self.setData({ showDiceParticles: true })
    setTimeout(function() { self.setData({ showDiceParticles: false }) }, 2600)
  },
  onResetBalls: function() {
    var self = this
    wx.showModal({
      title: '重置特殊事件统计',
      content: '将重置所有咕噜球数量、购买/合成记录、使用球总数。此操作不可撤销',
      success: function(res) {
        if (res.confirm) {
          var balls = self.data.balls.map(function(b) {
            return { id: b.id, name: b.name, color: b.color, count: 0, freeCount: 0, rate: b.rate, price: b.price, cnyPrice: b.cnyPrice || 0, cnyDisplay: b.cnyDisplay || '', isBuy: b.isBuy, isCraft: b.isCraft, isSpecial: b.isSpecial, isActivity: b.isActivity, isCustom: b.isCustom, icon: b.icon, img: b.img, source: b.source }
          })
          wx.removeStorageSync('special_history')
          wx.removeStorageSync('used_ball_total')
          wx.removeStorageSync('ball_check_records')
          wx.removeStorageSync('session_used_balls')
          self._sessionUsedBalls = {}
          self.saveBallsToStorage(balls)
          self.setData({
            balls: balls,
            hasActiveBalls: false,
            totalBallUsed: 0,
            usedBallTotal: 0,
            specialHistory: [],
            ballCheckRecords: [],
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
    // 关闭自动重置时，连抓开关一并收起并复位，避免残留状态
    if (!val && this.data.continuePity) {
      this.setData({ autoResetPity: false, continuePity: false })
      wx.setStorageSync('auto_reset_pity', false)
      wx.setStorageSync('continue_pity', false)
    } else {
      this.setData({ autoResetPity: val })
      wx.setStorageSync('auto_reset_pity', val)
    }
    wx.showToast({ title: val ? '已开启自动重置' : '已切换手动重置', icon: 'none' })
  },
  toggleContinuePity: function() {
    var val = !this.data.continuePity
    this.setData({ continuePity: val })
    wx.setStorageSync('continue_pity', val)
    wx.showToast({ title: val ? '歪了继续累计保底' : '歪了重置保底', icon: 'none' })
  },
  toggleQuickRecord: function() {
    var val = !this.data.quickRecordMode
    this.setData({ quickRecordMode: val })
    wx.setStorageSync('quick_record_mode', val)
    wx.showToast({ title: val ? '自动扣费已开启' : '已切换为手动扣费', icon: 'none' })
  },
  openWealthAdjustModal: function(e, typeOverride) {
    var type = 'current';
    if (typeOverride && typeof typeOverride === 'string') {
      type = typeOverride;
    } else if (e && e.currentTarget && e.currentTarget.dataset.type) {
      type = e.currentTarget.dataset.type;
    }
    this.setData({
      showWealthAdjustModal: true,
      adjustType: type,
      adjustAmount: '',
      adjustInputVal: 0,
      adjustIncreaseVal: 0,
      adjustDecreaseVal: 0,
      adjustRemark: ''
    })
  },
  closeWealthAdjustModal: function() {
    this.setData({ showWealthAdjustModal: false })
  },
  onAdjustTypeSwitch: function(e) {
    this.setData({
      adjustType: e.currentTarget.dataset.type,
      adjustAmount: '',
      adjustInputVal: 0,
      adjustIncreaseVal: 0,
      adjustDecreaseVal: 0
    })
  },
  onAdjustAmountInput: function(e) {
    var raw = e.detail.value;
    var parsed = parseInt(raw, 10);
    if (raw === '' || isNaN(parsed) || parsed < 0) {
      this.setData({
        adjustAmount: raw,
        adjustInputVal: 0,
        adjustIncreaseVal: 0,
        adjustDecreaseVal: 0
      });
      return;
    }
    var prevWealth = this.data.totalWealth || 0;
    var diff = parsed - prevWealth;
    this.setData({
      adjustAmount: raw,
      adjustInputVal: parsed,
      adjustIncreaseVal: diff > 0 ? diff : 0,
      adjustDecreaseVal: diff < 0 ? Math.abs(diff) : 0
    });
  },
  onAdjustRemarkInput: function(e) {
    this.setData({ adjustRemark: e.detail.value })
  },
  onConfirmAdjustWealth: function() {
    var self = this
    var isEncounter10 = self.data.adjustType === 'encounter10'
    if (isEncounter10) {
      var amount = parseInt(self.data.adjustAmount, 10)
      if (isNaN(amount) || amount <= 0) {
        wx.showToast({ title: '无效金额', icon: 'none' })
        return
      }
      var newGains10 = self.data.totalGains + amount
      var newCosts10 = self.data.totalCosts
      wx.setStorageSync('total_gains', newGains10)
      var accumulated10 = newGains10 - newCosts10
      var initial10 = self.data.initialWealth || 0
      var profitRate10 = initial10 > 0 ? ((accumulated10 / initial10) * 100).toFixed(1) : (accumulated10 > 0 ? '100.0' : '0.0')
      var record10 = { time: formatTimeShort(), balls: '✨ 十次奇遇收益 +' + amount, result: '奇遇', total: 0, cost: 0, gain: amount, pet: '' }
      var h10 = [record10].concat(self.data.history).slice(0, 20)
      wx.setStorageSync('catch_history', h10)
      self.setData({
        showWealthAdjustModal: false,
        totalGains: newGains10,
        accumulatedWealth: accumulated10,
        totalWealth: initial10 + accumulated10,
        profitRate: profitRate10,
        history: h10
      })
      self.updateGemCost()
      wx.showToast({ title: '增加 💵' + amount, icon: 'none' })
      return
    }

    var newWealthVal = parseInt(self.data.adjustAmount, 10)
    if (self.data.adjustAmount === '' || isNaN(newWealthVal) || newWealthVal < 0) {
      wx.showToast({ title: '请输入有效的现有洛克贝数值', icon: 'none' })
      return
    }
    var prevWealth = self.data.totalWealth || 0
    var diff = newWealthVal - prevWealth
    if (diff === 0) {
      wx.showToast({ title: '现有洛克贝与上次一致，无需调整', icon: 'none' })
      self.setData({ showWealthAdjustModal: false })
      return
    }
    var incVal = diff > 0 ? diff : 0
    var decVal = diff < 0 ? Math.abs(diff) : 0
    var newGains = self.data.totalGains + incVal
    var newCosts = self.data.totalCosts + decVal
    wx.setStorageSync('total_gains', newGains)
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = newGains - newCosts
    var initial = self.data.initialWealth || 0
    var profitRate = initial > 0 ? ((accumulated / initial) * 100).toFixed(1) : (accumulated > 0 ? '100.0' : '0.0')
    var remark = (self.data.adjustRemark || '').trim()
    var ballsText = incVal > 0
      ? ('💰 现有资产 ' + prevWealth + '→' + newWealthVal + ' (增加+' + incVal + ')')
      : ('💸 现有资产 ' + prevWealth + '→' + newWealthVal + ' (减少-' + decVal + ')')
    var lastAdjust = {
      prevWealth: prevWealth,
      newWealth: newWealthVal,
      incVal: incVal,
      decVal: decVal,
      time: formatTimeShort()
    }
    wx.setStorageSync('last_wealth_adjust', lastAdjust)
    var record = {
      time: formatTimeShort(),
      balls: ballsText + (remark ? '(' + remark + ')' : ''),
      result: '微调',
      total: 0,
      cost: decVal,
      gain: incVal,
      pet: ''
    }
    var h = [record].concat(self.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    self.setData({
      showWealthAdjustModal: false,
      totalGains: newGains,
      totalCosts: newCosts,
      accumulatedWealth: accumulated,
      totalWealth: initial + accumulated,
      profitRate: profitRate,
      lastWealthAdjust: lastAdjust,
      history: h
    })
    self.updateGemCost()
    wx.showToast({
      title: incVal > 0 ? ('已更新 · 增加 +' + incVal) : ('已更新 · 减少 -' + decVal),
      icon: 'none'
    })
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
          wx.removeStorageSync('last_wealth_adjust')
          // 资产清空后必须同步关掉捕捉入口，否则按钮仍可点
          self.setData({ initialWealth: 0, totalGains: 0, totalCosts: 0, accumulatedWealth: 0, totalWealth: 0, lastWealthAdjust: null, wealthSet: false, canStartCapture: false })
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
    // CNY 按当前语言换算展示
    var cnyCost = i18n.formatCny(gemCost / 10)
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
    var cost = ball.isSpecial && !ball.isBuy ? 0 : (ball.price || 0) * count
    var newCosts = self.data.totalCosts + cost
    var totalBallUsed = 0
    for (var i = 0; i < balls.length; i++) totalBallUsed += balls[i].count
    var hasActive = false
    for (var i = 0; i < balls.length; i++) { if (balls[i].count > 0) { hasActive = true; break } }
    var decrease = diff > 0 ? (function() { var d = {}; d[self.data.selectedBall] = diff; return d })() : {}
    var usedInc = diff > 0 ? diff : 0
    var newUsedBallTotal = self.data.usedBallTotal + usedInc
    if (usedInc > 0) {
      wx.setStorageSync('used_ball_total', newUsedBallTotal)
      self._addSessionUsed([{ name: ball.name, count: usedInc, freeUsed: Math.min(usedInc, oldFree) }])
    }
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
  onSpecialTab: function(e) {
    var tab = e.currentTarget.dataset.t
    this.setData({
      specialTab: tab,
      inboundMethod: 'default'
    })
    this.refreshBallPicker()
  },
  onInboundMethod: function(e) {
    this.setData({ inboundMethod: e.currentTarget.dataset.m || 'default' })
    this.refreshBallPicker()
  },
  onSpecialBall: function(e) {
    var list = this.data.pickerBalls || this.getPickerBalls() || []
    var selected = list[e.detail.value]
    this.setData({ specialBall: selected })
    this._syncSelectedCraftBall(selected)
  },
  onSpecialCount: function(e) { this.setData({ specialCount: e.detail.value }) },
  onAddSpecial: function() {
    var self = this
    var v = parseInt(self.data.specialCount)
    if (!v || v <= 0) return
    var t = self.data.specialTab === 'buy' ? '购买' : (self.data.specialTab === 'craft' ? '合成' : '特殊')
    // 仅特殊球板块可选「活动」获取（免费）
    if (self.data.specialTab === 'cny' && self.data.inboundMethod === 'activity') {
      t = '活动'
    }
    var ballName = self.data.specialBall
    var ballPrice = 0, ballCraftCostRoco = false, ballCraftPrice = 0, ballIcon = '', ballImg = '';
    for (var i = 0; i < self.data.balls.length; i++) {
      if (self.data.balls[i].name === ballName) {
        ballPrice = self.data.balls[i].price || 0;
        ballCraftCostRoco = !!(self.data.balls[i].craftCostRoco);
        ballCraftPrice = self.data.balls[i].craftPrice || (ballCraftCostRoco ? ballPrice : 0) || 0;
        ballIcon = self.data.balls[i].icon || '';
        ballImg = self.data.balls[i].img || '';
        break;
      }
    }
    var isPaidCraft = (t === '合成' && self.data.craftUseRoco && ballCraftCostRoco && ballCraftPrice > 0);
    var totalCost = 0;
    var displayCost = 0;
    if (t === '购买' && self.data.quickRecordMode) {
      totalCost = ballPrice * v;
      displayCost = totalCost;
    } else if (isPaidCraft) {
      displayCost = ballCraftPrice * v;
      if (self.data.quickRecordMode) {
        totalCost = displayCost;
      }
    }
    var newCosts = self.data.totalCosts + totalCost
    wx.setStorageSync('total_costs', newCosts)
    var accumulated = self.data.totalGains - newCosts
    var h = [{type: t, ball: ballName, count: v, cost: totalCost, displayCost: displayCost, time: formatTime(), icon: ballIcon, img: ballImg}].concat(self.data.specialHistory).slice(0, 50)
    wx.setStorageSync('special_history', h)
    var balls = self.data.balls.slice()
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].name === ballName) {
        balls[i].count += v
        if ((t === '合成' && !isPaidCraft) || t === '活动') balls[i].freeCount += v
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

