from pathlib import Path

p = Path(r"F:\rorkingdom-guide\pages\merchant\merchant.wxml")
t = p.read_text(encoding="utf-8")
ICON = "https://patchwiki.biligame.com/images/nrc/1/10/blxvp7k90uq3p8prz24feerler3yfsi.png"

def price_view(cls, value, sm=False):
    icon_cls = "roco-icon sm" if sm else "roco-icon"
    return (
        f'<view class="{cls}">'
        f'<image class="{icon_cls}" src="{ICON}" mode="aspectFit" />'
        f"<text>{value}</text></view>"
    )

pairs = [
    (
        "<text class=\"item-price\">{{item.price}}{{t.currency || '洛克贝'}}</text>",
        price_view("item-price", "{{item.price}}"),
    ),
    (
        "<text class=\"sub-item-price\">{{item.price}}洛克贝</text>",
        price_view("sub-item-price", "{{item.price}}", sm=True),
    ),
    (
        "<text class=\"picker-card-price\">{{item.price}}{{t.currency || '洛克贝'}}</text>",
        price_view("picker-card-price", "{{item.price}}", sm=True),
    ),
]

for old, new in pairs:
    n = t.count(old)
    print("repl", n, old[:40])
    t = t.replace(old, new)

p.write_text(t, encoding="utf-8")
print("ok")
