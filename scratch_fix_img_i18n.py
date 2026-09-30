from pathlib import Path

p = Path(r"F:\rorkingdom-guide\pages\catch\catch.js")
t = p.read_text(encoding="utf-8")

old = """  _buildRecord: function(resultType) {
    var self = this;
    var result = resultType || self.data.result;
    var usedStr = self.data.lastUsedBallName && self.data.lastUsedBallName.length > 2 ? self.data.lastUsedBallName : '未使用球';
    var resultText = result === 'success' ? '异色捕获成功' : '歪了';
    var record = {
      time: formatTimeShort(), balls: usedStr, result: resultText,
      remark: self.data.resultRemark || '', total: 1, cost: 0,
      pet: self.data.resultPetName || '', petImageUrl: self.data.resultPetImageUrl || '',
      resultRaw: result, elapsedTimeText: self.data._resultElapsedTime ? '耗时: ' + self.data._resultElapsedTime : '',
      ballImageUrl: self._lastUsedBallImg || '',
      encounters: self.data.carnivalCount + self.data.luckyBoxCount,
      brushMode: self.data.brushMode || 'single',
      mixedPets: self.data._resultMixedPetNames || '', targetPet: self.data._resultTargetPet || '',
      carnivalCount: self.data.carnivalCount || 0, luckyBoxCount: self.data.luckyBoxCount || 0,
      pityBefore: self.data.pityCount || 0, elapsedAuto: self.data._resultElapsedAuto || false
    };
    return record;
  },"""

new = """  _buildRecord: function(resultType) {
    var self = this;
    var result = resultType || self.data.result;
    var usedStr = self.data.lastUsedBallName && self.data.lastUsedBallName.length > 2 ? self.data.lastUsedBallName : i18n.t('imgNoBallsUsed');
    var record = {
      time: formatTimeShort(), balls: usedStr,
      result: localizeResultText(result, result === 'success' ? '异色捕获成功' : '歪了'),
      remark: self.data.resultRemark || '', total: 1, cost: 0,
      pet: self.data.resultPetName || '', petImageUrl: self.data.resultPetImageUrl || '',
      resultRaw: result,
      elapsedSec: self.data._resultElapsedSec != null ? self.data._resultElapsedSec : null,
      elapsedTimeText: self.data._resultElapsedTime ? i18n.t('clipDuration') + ': ' + self.data._resultElapsedTime : '',
      ballImageUrl: self._lastUsedBallImg || '',
      encounters: self.data.carnivalCount + self.data.luckyBoxCount,
      brushMode: self.data.brushMode || 'single',
      mixedPets: self.data._resultMixedPetNames || '', targetPet: self.data._resultTargetPet || '',
      carnivalCount: self.data.carnivalCount || 0, luckyBoxCount: self.data.luckyBoxCount || 0,
      pityBefore: self.data.pityCount || 0, elapsedAuto: self.data._resultElapsedAuto || false
    };
    return record;
  },"""

if old not in t:
    raise SystemExit("buildRecord not found")
t = t.replace(old, new, 1)

# duration on image
old_et = "var et = last.elapsedTimeText.replace(/^耗时:\\s*/, '').trim() || i18n.t('imgUnknown');"
if old_et not in t:
    # try actual file content
    import re
    m = re.search(r"var et = last\.elapsedTimeText\.replace\([^)]+\)\.trim\(\)[^;]+;", t)
    print("et line:", m.group(0) if m else None)
    if m:
        t = t.replace(m.group(0), "var et = localizeElapsed(last) || i18n.t('imgUnknown');", 1)
else:
    t = t.replace(old_et, "var et = localizeElapsed(last) || i18n.t('imgUnknown');", 1)

# status on clipboard
t = t.replace(
    "(last.result || i18n.t('imgUnknown'))",
    "localizeResultText(last.resultRaw, last.result)",
)

# clipboard duration
t = t.replace(
    "(last.elapsedTimeText ? last.elapsedTimeText.replace(/^耗时:\\s*/, '') : i18n.t('imgUnknown'))",
    "(localizeElapsed(last) || i18n.t('imgUnknown'))",
)

p.write_text(t, encoding="utf-8")
print("ok")
