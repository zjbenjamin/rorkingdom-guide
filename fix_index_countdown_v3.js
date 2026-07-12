const fs = require('fs');
const path = 'pages/index/index.js';
let js = fs.readFileSync(path, 'utf8');

// 1. Add updateCountdowns method
const updateCountdownsFn = `
  updateCountdowns: function() {
    var list = this.data.announcements;
    if (!list || list.length === 0) return;
    var changed = false;
    var now = Date.now();
    for (var i = 0; i < list.length; i++) {
      if (list[i].autoOnlineTime && list[i].autoOnlineTime > now) {
        var diff = list[i].autoOnlineTime - now;
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        var display = '⏳ 距上线 ';
        if (d > 0) display += d + '天';
        if (h > 0 || d > 0) display += String(h).padStart(2, '0') + '小时';
        display += String(m).padStart(2, '0') + '分' + String(s).padStart(2, '0') + '秒';
        if (list[i].autoDeleteDisplay !== display) {
          list[i].autoDeleteDisplay = display;
          changed = true;
        }
      } else if (list[i].autoDeleteTime) {
        var diff = list[i].autoDeleteTime - now;
        if (diff > 0) {
          var d = Math.floor(diff / 86400000);
          var h = Math.floor((diff % 86400000) / 3600000);
          var m = Math.floor((diff % 3600000) / 60000);
          var s = Math.floor((diff % 60000) / 1000);
          var display = '⏳ 距下线 ';
          if (d > 0) display += d + '天';
          if (h > 0 || d > 0) display += String(h).padStart(2, '0') + '小时';
          display += String(m).padStart(2, '0') + '分' + String(s).padStart(2, '0') + '秒';
          if (list[i].autoDeleteDisplay !== display) {
            list[i].autoDeleteDisplay = display;
            changed = true;
          }
        } else {
          if (list[i].autoDeleteDisplay !== '✅ 已结束') {
            list[i].autoDeleteDisplay = '✅ 已结束';
            changed = true;
          }
        }
      } else {
        if (list[i].autoDeleteDisplay) {
          list[i].autoDeleteDisplay = '';
          changed = true;
        }
      }
    }
    if (changed) {
      this.setData({ announcements: list });
    }
  },
`;

if (!js.includes('updateCountdowns: function()')) {
  js = js.replace('  loadAnnouncements: function() {', updateCountdownsFn + '  loadAnnouncements: function() {');
}

// 2. Parse startDate/endDate in loadAnnouncements
const parseTimeLogic = `        for (var i = 0; i < list.length; i++) {
          list[i].timeStr = self.formatTime(list[i].createTime);
          if (list[i].startDate) {
            var sd = list[i].startDate.replace(/-/g, '/');
            if (sd.length <= 10) sd += ' 00:00:00';
            list[i].autoOnlineTime = new Date(sd).getTime();
          }
          if (list[i].endDate) {
            var ed = list[i].endDate.replace(/-/g, '/');
            if (ed.length <= 10) ed += ' 23:59:59';
            list[i].autoDeleteTime = new Date(ed).getTime();
          }
        }`;
js = js.replace(/for \(var i = 0; i < list\.length; i\+\+\) \{\s*list\[i\]\.timeStr = self\.formatTime\(list\[i\]\.createTime\)\s*\}/, parseTimeLogic);

// 3. Call updateCountdowns when announcements load
if (!js.includes('self.updateCountdowns()')) {
  js = js.replace('self.setData({ announcements: list })', 'self.setData({ announcements: list });\n        self.updateCountdowns();');
}

// 4. Timer in onShow
if (!js.includes('self.timerId = setInterval')) {
  js = js.replace('self.checkSubscription()\n  },', `self.checkSubscription()
    if (self.timerId) clearInterval(self.timerId);
    self.timerId = setInterval(function() {
      self.updateCountdowns();
    }, 1000);
  },`);
}

// 5. Clean up timer in onHide/onUnload
const hideUnloadCode = `
  onHide: function() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },
  onUnload: function() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },
`;
if (!js.includes('onHide: function()')) {
  js = js.replace('  onShow: function() {', hideUnloadCode + '  onShow: function() {');
}

fs.writeFileSync(path, js, 'utf8');
console.log('Fixed countdown logic entirely.');
