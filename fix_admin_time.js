const fs = require('fs');
let code = fs.readFileSync('pages/admin/admin.js', 'utf8');

// 1. Add formStartTime and formEndTime to data
code = code.replace(
  /formStartDate: '',\s*formEndDate: '',/,
  "formStartDate: '',\n    formStartTime: '',\n    formEndDate: '',\n    formEndTime: '',"
);

// 2. Parse time in openModal
code = code.replace(
  /formStartDate: item \? \(item\.startDate \|\| ''\) : '',\s*formEndDate: item \? \(item\.endDate \|\| ''\) : ''/,
  `formStartDate: item && item.startDate ? item.startDate.split(' ')[0] : '',
      formStartTime: item && item.startDate && item.startDate.includes(' ') ? item.startDate.split(' ')[1] : '',
      formEndDate: item && item.endDate ? item.endDate.split(' ')[0] : '',
      formEndTime: item && item.endDate && item.endDate.includes(' ') ? item.endDate.split(' ')[1] : ''`
);

// 3. Add onStartTimeChange and onEndTimeChange
code = code.replace(
  /onStartDateChange: function\(e\) \{ this\.setData\(\{ formStartDate: e\.detail\.value \}\) \},\s*onEndDateChange: function\(e\) \{ this\.setData\(\{ formEndDate: e\.detail\.value \}\) \},/,
  `onStartDateChange: function(e) { this.setData({ formStartDate: e.detail.value }) },
  onStartTimeChange: function(e) { this.setData({ formStartTime: e.detail.value }) },
  onEndDateChange: function(e) { this.setData({ formEndDate: e.detail.value }) },
  onEndTimeChange: function(e) { this.setData({ formEndTime: e.detail.value }) },`
);

// 4. Update submitAnnouncement
code = code.replace(
  /startDate: self\.data\.formStartDate,\s*endDate: self\.data\.formEndDate,/,
  `startDate: (self.data.formStartDate && self.data.formStartTime) ? self.data.formStartDate + ' ' + self.data.formStartTime : self.data.formStartDate,
        endDate: (self.data.formEndDate && self.data.formEndTime) ? self.data.formEndDate + ' ' + self.data.formEndTime : self.data.formEndDate,`
);

fs.writeFileSync('pages/admin/admin.js', code, 'utf8');
console.log('Fixed admin time');
