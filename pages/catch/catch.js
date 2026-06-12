var app = getApp()
Page({
  data: {
    buildTime: '',
    balls: [{id:1,name:'普通咕噜球',color:'#999',count:1,rate:'基础捕捉率'},{id:2,name:'高级咕噜球',color:'#1565c0',count:1,rate:'捕捉率+30%'},{id:3,name:'国王球',color:'#f57f17',count:1,rate:'100%捕捉'},{id:4,name:'美妙球',color:'#e91e63',count:1,rate:'特定精灵+50%'},{id:5,name:'好战球',color:'#d32f2f',count:1,rate:'战斗精灵+40%'},{id:6,name:'光合球',color:'#2e7d32',count:1,rate:'草系精灵+45%'},{id:7,name:'网兜球',color:'#388e3c',count:1,rate:'飞行精灵+35%'},{id:8,name:'暗星球',color:'#37474f',count:1,rate:'恶系精灵+40%'}],
    totalCatches: 0, successCatches: 0, history: [], result: '', expanded: false,
    rocoCoins: 0, coinInput: '',
    initialWealth: 0, wealthInput: '',
    costInput: '', gainInput: '',
    encounterTab: 'shiny', shinyCount: 0, carnivalCount: 0, nightmareCount: 0,
    specialTab: 'buy', specialBall: '高级咕噜球',
    specialBalls: ['国王球','棱镜球','光合球','好战球','网兜球','暗星球','美妙球'],
    craftBalls: ['国王球','棱镜球','光合球','好战球','网兜球','暗星球','美妙球'],
    specialCount: '', specialHistory: []
  },
  onShow: function() {
    var n = new Date()
    this.setData({
      buildTime: n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0')
    })
    this.loadHistory()
  },
  loadHistory: function() {
    this.setData({
      history: (wx.getStorageSync('catch_history')||[]).slice(0,20),
      rocoCoins: wx.getStorageSync('roco_coins')||0,
      initialWealth: wx.getStorageSync('initial_wealth')||0,
      shinyCount: wx.getStorageSync('shiny_count')||0,
      carnivalCount: wx.getStorageSync('carnival_count')||0,
      nightmareCount: wx.getStorageSync('nightmare_count')||0
    })
  },
  onResult: function(e) {
    var r = e.currentTarget.dataset.r
    if (r === 'pause') {
      var self = this
      wx.showModal({ title: '⏸️ 暂时中止', content: '确定记录本次捕捉数据并复制到剪贴板吗？', confirmText: '确认', success: function(res) { if (res.confirm) { self.onRecord(); wx.showToast({ title: '已记录并复制', icon: 'success' }) } } })
    } else {
      this.setData({ result: r })
    }
  },
  onToggle: function() { this.setData({ expanded: !this.data.expanded }) },
  onAdd: function(e) { var b = this.data.balls.slice(); b[e.currentTarget.dataset.i].count++; this.setData({ balls: b }) },
  onSub: function(e) { var b = this.data.balls.slice(); if (b[e.currentTarget.dataset.i].count > 1) b[e.currentTarget.dataset.i].count--; this.setData({ balls: b }) },
  onRecord: function() {
    var balls = this.data.balls, result = this.data.result
    var used = balls.filter(function(b){ return b.count > 1 })
    var total = 0
    for (var i = 0; i < used.length; i++) total += used[i].count - 1
    if (!used.length && result) total = 1
    var successTotal = this.data.totalSuccess + (result === 'success' ? total : 0)
    wx.setStorageSync('total_success', successTotal)
    var record = { time: new Date().toLocaleTimeString(), balls: used.map(function(b){ return b.name+'x'+(b.count-1) }).join(', ')||'未使用球', result: result==='success'?'成功':result==='miss'?'歪了':result==='pause'?'中止':'未知', total: total }
    var h = [record].concat(this.data.history).slice(0, 20)
    wx.setStorageSync('catch_history', h)
    this.setData({ balls: balls.map(function(b){ return {id:b.id,name:b.name,color:b.color,count:1,rate:b.rate} }), totalCatches: this.data.totalCatches+total, successCatches: this.data.successCatches+(result==='success'?total:0), history: h, result: '' })
    wx.showToast({ title: '✅ 记录成功', icon: 'success' })
  },
  onClearHistory: function() { var self=this; wx.showModal({ title:'清空', content:'确定清空？', success:function(r){ if(r.confirm){ wx.removeStorageSync('catch_history'); self.setData({history:[],totalCatches:0,successCatches:0}) } } }) },
  onEncounterTab: function(e) { this.setData({ encounterTab: e.currentTarget.dataset.t }) },
  onAddShiny: function() { var c=this.data.shinyCount+1; wx.setStorageSync('shiny_count',c); this.setData({shinyCount:c}); wx.showToast({title:'🔴 异色 +1',icon:'none'}) },
  onAddCarnival: function() { var c=this.data.carnivalCount+1; wx.setStorageSync('carnival_count',c); this.setData({carnivalCount:c}); wx.showToast({title:'🌟 狂欢时刻 +1',icon:'none'}) },
  onAddNightmare: function() { var c=this.data.nightmareCount+1; wx.setStorageSync('nightmare_count',c); this.setData({nightmareCount:c}); wx.showToast({title:'☠️ 噩梦污染 +1',icon:'none'}) },
  onClearShiny: function() { wx.removeStorageSync('shiny_count'); this.setData({shinyCount:0}) },
  onClearCarnival: function() { wx.removeStorageSync('carnival_count'); this.setData({carnivalCount:0}) },
  onClearNightmare: function() { wx.removeStorageSync('nightmare_count'); this.setData({nightmareCount:0}) },
  onCoinInput: function(e) { this.setData({ coinInput: e.detail.value }) },
  onAddCoins: function() { var v=parseInt(this.data.coinInput); if(!v||v<=0)return; var c=this.data.rocoCoins+v; wx.setStorageSync('roco_coins',c); this.setData({rocoCoins:c,coinInput:''}); wx.showToast({title:'已记录',icon:'success'}) },
  onWealthInput: function(e) { this.setData({ wealthInput: e.detail.value }) },
  onSetWealth: function() { var v=parseInt(this.data.wealthInput); if(!v||v<0)return; wx.setStorageSync('initial_wealth',v); this.setData({initialWealth:v,wealthInput:''}); wx.showToast({title:'已设置',icon:'success'}) },
  onCostInput: function(e) { this.setData({ costInput: e.detail.value }) },
  onGainInput: function(e) { this.setData({ gainInput: e.detail.value }) },
  onSpecialTab: function(e) { var tab=e.currentTarget.dataset.t; this.setData({ specialTab:tab, specialBall:tab==='buy'?'高级咕噜球':'国王球', specialBalls:tab==='buy'?this.data.specialBalls:this.data.craftBalls }) },
  onSpecialBall: function(e) { this.setData({ specialBall: this.data.specialBalls[e.detail.value] }) },
  onSpecialCount: function(e) { this.setData({ specialCount: e.detail.value }) },
  onAddSpecial: function() { var v=parseInt(this.data.specialCount); if(!v||v<=0)return; var t=this.data.specialTab==='buy'?'购买':'合成'; var h=[{type:t,ball:this.data.specialBall,count:v,time:new Date().toLocaleString()}].concat(this.data.specialHistory).slice(0,50); wx.setStorageSync('special_history',h); this.setData({specialHistory:h,specialCount:''}); wx.showToast({title:'已记录',icon:'success'}) },
  onClearSpecial: function() { wx.removeStorageSync('special_history'); this.setData({specialHistory:[]}) },
  onExport: function() {
    var t='洛克王国：世界 捕捉统计\n总捕捉:'+this.data.totalCatches+' 成功:'+this.data.successCatches+'\n洛克贝财富初始值:'+this.data.initialWealth+'\n累计洛克贝:'+this.data.rocoCoins+'\n\n--- 奇遇事件统计 ---\n🔴 异色:'+this.data.shinyCount+'次\n🌟 狂欢时刻:'+this.data.carnivalCount+'次\n☠️ 噩梦污染:'+this.data.nightmareCount+'次\n🎯 总奇遇:'+(this.data.shinyCount+this.data.carnivalCount+this.data.nightmareCount)+'次\n\n--- 捕捉记录 ---\n'
    for(var i=0;i<this.data.history.length;i++){var r=this.data.history[i];t+=r.time+' '+r.result+' '+r.balls+'\n'}
    wx.setClipboardData({data:t,success:function(){wx.showToast({title:'已复制',icon:'success'})}})
  },
  onShare: function() { wx.showShareMenu({withShareTicket:true,menus:['shareAppMessage','shareTimeline']}) },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
