var app = getApp()
var imageConfig = require('../../config/images')
var levelUtil = require('../../utils/level')
var i18n = require('../../utils/i18n')
var i18nBehavior = require('../../utils/i18nBehavior')
var historyCache = require('./historyCache')

Page({
  behaviors: [i18nBehavior],
  data: {
    canStartCapture: false,
    sysVersion: '',
    buildTime: '',
    pityCount: 0,
    pityHint: '',
    pityEmoji: '',
    autoResetPity: false,
    continuePity: false,
    totalCatches: 0,
    successCatches: 0,
    successRate: 0,
    carnivalCount: 0,
    luckyBoxCount: 0,
    history: [],
    balls: [],
    totalBallUsed: 0,
    usedBallTotal: 0,
    accumulatedWealth: 0,
    totalWealth: 0,
    initialWealth: 0,
    wealthSet: false,
    showLogShareBtn: true,
    result: '',
    resultPetName: '',
    resultPetImageUrl: '',
    resultRemark: '',
    selectedBall: null,
    lastUsedBallName: '',
    lastUsedCount: 0,
    resultElapsedTime: '',
    resultElapsedAuto: false,
    _resultElapsedTime: '',
    _resultElapsedAuto: false,
    _resultMixedPetNames: '',
    _resultTargetPet: '',
    brushMode: 'single',
    userTitle: '',
    pityBefore: 0,
    itemSubStatus: {},
    totalItemSubs: 0,
    showResultBallModal: false,
    resultType: '',
    specialHistory: [],
    specialTab: 'buy',
    quickRecordMode: false,
    autoResetPity: false,
    continuePity: false,
    ballCheckRecords: [],
    encounterTab: 'carnival'
  },
  _needsRefresh: false,

  onLoad: function() {
    this._refreshI18n()
    this.loadData(true)
  },
  onShow: function() {
    if (this._needsRefresh) {
      this._needsRefresh = false
      this.loadData(true)
    } else {
      this.loadData(false)
    }
  },
  onHide: function() { this._needsRefresh = true },

  loadData: function(force) {
    var self = this
    var d = historyCache.loadHistory(force)
    var levelUtil = require('../../utils/level')
    var level = levelUtil.calcLevel(wx.getStorageSync('login_days') ? wx.getStorageSync('login_days').length : 0, d.wealthIsSet, d.totalCatches)
    self.setData({
      canStartCapture: true,
      sysVersion: 'S4',
      totalCatches: d.totalCatches,
      successCatches: d.successCatches,
      successRate: d.successRate,
      carnivalCount: d.carnivalCount,
      luckyBoxCount: d.luckyBoxCount,
      pityCount: d.pityCount,
      history: d.history,
      accumulatedWealth: d.accumulatedWealth,
      totalWealth: d.totalWealth,
      initialWealth: d.initialWealth,
      wealthSet: d.wealthIsSet,
      autoResetPity: wx.getStorageSync('auto_reset_pity') || false,
      continuePity: wx.getStorageSync('continue_pity') || false,
      showLogShareBtn: wx.getStorageSync('show_log_share_btn') !== false,
      specialHistory: wx.getStorageSync('special_history') || [],
      ballCheckRecords: wx.getStorageSync('ball_check_records') || [],
      usedBallTotal: wx.getStorageSync('used_ball_total') || 0,
      quickRecordMode: wx.getStorageSync('quick_record_mode') || false,
      userTitle: levelUtil.getLevelName(level)
    })
    self.updatePityDisplay(d.pityCount)
  },

  updatePityDisplay: function(pity) {
    var hint = '', emoji = ''
    if (pity === 0) { hint = i18n.t('catchPityReset') || '迪莫的亲吻'; emoji = '👑' }
    else if (pity <= 10) { hint = i18n.t('catchPityShield') || '星辰塔庇护'; emoji = '✨' }
    else if (pity <= 40) { hint = i18n.t('catchPityNormal') || '魔法学院日常'; emoji = '😐' }
    else if (pity <= 70) { hint = i18n.t('catchPityDanger') || '咕噜球在颤抖'; emoji = '🔥' }
    else { hint = i18n.t('catchPityMax') || '绝对捕捉时刻！'; emoji = '⚡' }
    this.setData({ pityCount: pity, pityHint: hint, pityEmoji: emoji })
  },

  onShareAppMessage: function() { return { title: '捕捉统计 - 洛克王国向导', path: '/pages/catch/catch' } },
  onShareTimeline: function() { return { title: '捕捉统计 - 洛克王国向导' } }
})

