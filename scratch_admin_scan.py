import re
js = open(r'F:\rorkingdom-guide\pages\admin\admin.js', encoding='utf-8').read()
wxml = open(r'F:\rorkingdom-guide\pages\admin\admin.wxml', encoding='utf-8').read()
print('braces', js.count('{') - js.count('}'))
print('parens', js.count('(') - js.count(')'))
methods = set(re.findall(r'([A-Za-z_][A-Za-z0-9_]*)\s*:\s*function', js))
handlers = set(re.findall(r'(?:bind|catch)[A-Za-z]+="([A-Za-z_][A-Za-z0-9_]*)"', wxml))
print('missing', sorted(handlers - methods))
for n in ['openBallModal', 'saveBall', 'deleteBall', 'loadBallsConfig', 'saveBallsConfig', 'openModal']:
    print(n, 'OK' if n in methods else 'MISS')
print('ball methods', sorted(m for m in methods if 'all' in m.lower() or 'Ball' in m))
