# -*- coding: utf-8 -*-
"""Extract fixed terms from i18n.js to seed the translation glossary."""
import re
import json

src = open('utils/i18n.js', encoding='utf-8').read()

blocks = {}
for lang in ['zh', 'en', 'ja', 'ko']:
    m = re.search(r"['\"]" + lang + r"['\"]:\s*\{(.*?)\n  \},", src, re.S)
    print(lang, 'block found:', bool(m), 'len:', len(m.group(1)) if m else 0)
    if m:
        body = m.group(1)
        pairs = re.findall(r"([A-Za-z0-9_]+):\s*'((?:\\'|[^'])*)'", body)
        blocks[lang] = dict(pairs)
        print('  keys:', len(blocks[lang]))

zh = blocks.get('zh', {})
en = blocks.get('en', {})
ja = blocks.get('ja', {})
ko = blocks.get('ko', {})

interest = [
    'appName', 'merchant', 'merchantShop', 'merchantTitle', 'merchantBusy',
    'petHandbook', 'swarm', 'swarmTitle', 'swarmSubtitle', 'swarmActive',
    'swarmActiveLabel', 'swarmBroadcast', 'swarmPreset', 'swarmAdminTitle',
    'currency', 'gemCurrency', 'priceRoco', 'rococoRecord', 'initialRococo',
    'accumulatedRococo', 'currentRococo',
    'ballsConfigTitle', 'ballBuy', 'ballCraft', 'noBallSelected', 'ballCost',
    'craftBall', 'selectBallType', 'expandView',
    'catchInitHint', 'catchSuccessBtn', 'catchWealthPanel', 'catchBallWarehouse',
    'catchCraftBall', 'catchCraftType', 'catchEmptyStock', 'catchModalResultTitle',
    'catchTargetPet', 'catchMixedList', 'catchAddPet',
    'imgTitle', 'imgPetName', 'clipTitle', 'clipPet',
    'skillSource', 'myUID', 'title5',
    'basicRate', 'boostRate', 'captureAll', 'guaranteedExcellent', 'perfect',
    'randomTalent', 'sparkleRandom', 'seasonTheme', 'boostAttr',
    'carnival', 'luckyBox', 'encounterHint', 'catchResult',
    'home', 'pets', 'activity', 'mine', 'guides', 'items', 'skills', 'catch',
    'egg', 'redeem', 'map', 'about', 'login', 'news',
    'itemHandbook', 'eggQuery', 'activityCalendar', 'catchStats', 'guideManual',
]

rows = []
for k in interest:
    rows.append({
        'key': k,
        'zh': zh.get(k, ''),
        'en': en.get(k, ''),
        'ja': ja.get(k, ''),
        'ko': ko.get(k, ''),
    })

for r in rows:
    if r['zh']:
        print(r['key'], '|', r['zh'], '|', r['en'], '|', r['ja'], '|', r['ko'])

with open('scratch_glossary_seed.json', 'w', encoding='utf-8') as f:
    json.dump({'rows': rows}, f, ensure_ascii=False, indent=2)
print('saved, rows=', len(rows), 'zh total keys', len(zh))
