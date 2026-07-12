const fs = require('fs');

// 1. Fix index.wxml
let wxml = fs.readFileSync('pages/index/index.wxml', 'utf8');
wxml = wxml.replace(
  /<text class="announce-auto-delete" wx:if="\{\{item\.autoDeleteDisplay\}\}">.*?\{\{item\.autoDeleteDisplay\}\}<\/text>/g,
  '<text class="announce-auto-delete" wx:if="{{item.autoDeleteDisplay}}">{{item.autoDeleteDisplay}}</text>'
);
fs.writeFileSync('pages/index/index.wxml', wxml, 'utf8');

// 2. Fix index.js
let js = fs.readFileSync('pages/index/index.js', 'utf8');

// Fix loadAnnouncements to parse startDate and endDate
js = js.replace(
  /for \(var i = 0; i < list\.length; i\+\+\) \{\s*list\[i\]\.timeStr = self\.formatTime\(list\[i\]\.createTime\)\s*\}/,
  `for (var i = 0; i < list.length; i++) {
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
          }`
);

// Fix updateCountdowns logic
js = js.replace(
  /updateCountdowns: function\(\) \{[\s\S]*?self\.setData\(\{ announcements: list \}\);\s*\}\s*\},/m,
  `updateCountdowns: function() {
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
          // No start/end date, clear display if any
          if (list[i].autoDeleteDisplay) {
            list[i].autoDeleteDisplay = '';
            changed = true;
          }
        }
      }
      if (changed) {
        this.setData({ announcements: list });
      }
    },`
);

fs.writeFileSync('pages/index/index.js', js, 'utf8');
console.log('Fixed index countdown');
