import re
js_path = r'F:\rorkingdom-guide\pages\catch\catch.js'
wxml_path = r'F:\rorkingdom-guide\pages\catch\catch.wxml'
js = open(js_path, encoding='utf-8').read()
wxml = open(wxml_path, encoding='utf-8').read()
print('js_lines', js.count('\n') + 1)
print('braces', js.count('{') - js.count('}'))
print('parens', js.count('(') - js.count(')'))
methods = set(re.findall(r'([A-Za-z_][A-Za-z0-9_]*)\s*:\s*function', js))
handlers = set(re.findall(r'(?:bind|catch)[A-Za-z]+="([A-Za-z_][A-Za-z0-9_]*)"', wxml))
print('methods', len(methods), 'handlers', len(handlers))
print('missing', sorted(handlers - methods))
for name in ['fetchCloudBalls', 'syncBallsConfig', 'saveBallsToStorage', 'onResetBalls', 'loadData', 'onShow', 'onLoad']:
    print(name, 'OK' if name in methods or name + ': function' in js else 'MISSING')
# data keys vs wxml fields
data_m = re.search(r'data:\s*\{([\s\S]*?)\n  \},', js)
data_keys = set(re.findall(r'([A-Za-z_][A-Za-z0-9_]*)\s*:', data_m.group(1))) if data_m else set()
fields = set(re.findall(r'\{\{\s*([A-Za-z_][A-Za-z0-9_]*)', wxml))
ignore = {'item', 'index', 'idx', 'i', 'e', 'true', 'false', 'n'}
print('fields_missing_in_data', sorted(f for f in fields if f not in data_keys and f not in methods and f not in ignore)[:50])
