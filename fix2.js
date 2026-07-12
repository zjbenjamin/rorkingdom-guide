const fs = require('fs');
let lines = fs.readFileSync('F:/rorkingdom-guide/pages/merchant/merchant.js', 'utf8').split('\n');

let startSerialize = lines.findIndex(l => l.includes('function serializeItem(item)'));
let endSerialize = lines.findIndex((l, i) => i > startSerialize && l.includes('}'));

let newSerializeCode = `function serializeItem(item) {
  var effect = (item.effect || '').toString().replace(/\\n/g, '\\\\n')
  var name = (item.name || '').toString().replace(/\\|/g, '')
  return name + '|' + (item.price || 0) + '|' + effect + '|' + (item.rarity || '普通') + '|' + (item.source || '远行商人') + '|' + (item.image || '') + '|' + (item.limitCount || '') + '|' + (item.offlineDate || '') + '|' + (item.offlineTimeStr || '')
}`.split('\n');

lines.splice(startSerialize, endSerialize - startSerialize + 1, ...newSerializeCode);

let startParse = lines.findIndex(l => l.includes('parseItems: function(text) {'));
let endParse = lines.findIndex((l, i) => i > startParse && l.includes('return items'));

let newParseCode = `  parseItems: function(text) {
    if (!text) return []
    var lines = text.split('\\n')
    var items = []
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue
      var parts = line.split('|')
      if (parts.length >= 2) {
        items.push({
          id: i + 1,
          name: (parts[0] || '').trim(),
          price: parseInt(parts[1]) || 0,
          effect: parts[2] ? parts[2].trim().replace(/\\\\n/g, '\\n') : '',
          rarity: parts[3] ? parts[3].trim() : '普通',
          source: (parts.length > 4) ? parts[4].trim() : '远行商人',
          image: (parts.length > 5) ? parts[5].trim() : undefined,
          limitCount: (parts.length > 6) ? parts[6].trim() : undefined,
          offlineDate: (parts.length > 7) ? parts[7].trim() : undefined,
          offlineTimeStr: (parts.length > 8) ? parts[8].trim() : undefined
        })
      }
    }
    `.split('\n');

lines.splice(startParse, endParse - startParse, ...newParseCode);

fs.writeFileSync('F:/rorkingdom-guide/pages/merchant/merchant.js', lines.join('\n'), 'utf8');
console.log('Replaced serializeItem and parseItems correctly!');
