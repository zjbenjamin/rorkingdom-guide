# -*- coding: utf-8 -*-
"""Fix glossary: drop 至尊洛克; brand 洛克王国 -> ROCOKINGDOM in non-Chinese."""
from openpyxl import load_workbook
from openpyxl.styles import Font, Alignment

PATH = r'F:\rorkingdom-guide\翻译词库-洛克王国术语.xlsx'
wb = load_workbook(PATH)
ws = wb['词库']

# columns: 1=中文 2=zh-HK 3=zh-TW 4=English ... 18=Français
# Chinese variants stay Chinese; columns 4-18 become ROCOKINGDOM brand form.

def set_brand(row, zh, zh_hk, zh_tw, brand):
    ws.cell(row, 1).value = zh
    ws.cell(row, 2).value = zh_hk
    ws.cell(row, 3).value = zh_tw
    for col in range(4, 19):
        ws.cell(row, col).value = brand

# 1) Remove 至尊洛克 row
target = None
for r in range(2, ws.max_row + 1):
    if ws.cell(r, 1).value == '至尊洛克':
        target = r
        break
if target:
    ws.delete_rows(target)
    print('removed 至尊洛克 at row', target)
else:
    print('至尊洛克 not found')

# 2) Fix brand rows
fixes = {
    '洛克王国': ('洛克王国', '洛克王國', '洛克王國', 'ROCOKINGDOM'),
    '洛克王国手游': ('洛克王国手游', '洛克王國手遊', '洛克王國手遊', 'ROCOKINGDOM Mobile'),
    '洛克王国UID': ('洛克王国UID', '洛克王國UID', '洛克王國UID', 'ROCOKINGDOM UID'),
}
for r in range(2, ws.max_row + 1):
    key = ws.cell(r, 1).value
    if key in fixes:
        zh, hk, tw, brand = fixes[key]
        set_brand(r, zh, hk, tw, brand)
        print('fixed', key, '->', brand)

# 3) Also fix any residual 'Roco Kingdom' in non-zh columns of other rows
for r in range(2, ws.max_row + 1):
    for col in range(4, 19):
        v = ws.cell(r, col).value
        if v and 'Roco Kingdom' in str(v):
            ws.cell(r, col).value = str(v).replace('Roco Kingdom', 'ROCOKINGDOM')
            print('patched residual', r, col, ws.cell(r, col).value)

# 4) Update notes sheet
ws2 = wb['使用说明']
for r in range(1, ws2.max_row + 1):
    v = ws2.cell(r, 2).value
    if v and 'Roco Kingdom' in str(v):
        ws2.cell(r, 2).value = str(v).replace('Roco Kingdom', 'ROCOKINGDOM')
    if v and 'Roco Helper' in str(v):
        pass  # leave helper brand as-is unless asked
# refresh brand strategy note
for r in range(1, ws2.max_row + 1):
    if ws2.cell(r, 1).value == '品牌策略':
        ws2.cell(r, 2).value = (
            '游戏名：中文「洛克王国」，其他语言统一 ROCOKINGDOM。'
            'Roco Helper / Roco Coins / Roco Gems / Gulu Ball 等保持拉丁写法，不意译。'
        )
        print('updated 品牌策略')
    if ws2.cell(r, 1).value == '词条数':
        ws2.cell(r, 2).value = str(ws.max_row - 1)
        print('updated 词条数 ->', ws.max_row - 1)

wb.save(PATH)
print('saved', PATH)

# verify
wb2 = load_workbook(PATH)
ws = wb2['词库']
print('rows', ws.max_row)
for r in range(2, ws.max_row + 1):
    k = ws.cell(r, 1).value
    if k and ('洛克王国' in k or '至尊' in k or 'ROCOKINGDOM' in str(ws.cell(r, 4).value or '')):
        print(r, [ws.cell(r, c).value for c in range(1, 6)])
