var app = getApp()
var eggData = {
  "types": [
    {
      "id": 1,
      "name": "普通蛋",
      "color": "#999",
      "icon": "🥚",
      "desc": "最常见的精灵蛋",
      "prob": "75%",
      "bonus": "�?
    },
    {
      "id": 2,
      "name": "火系�?,
      "color": "#d32f2f",
      "icon": "🔥",
      "desc": "孵化出火系精�?,
      "prob": "15%",
      "bonus": "火系攻击+3%"
    },
    {
      "id": 3,
      "name": "水系�?,
      "color": "#1565c0",
      "icon": "💧",
      "desc": "孵化出水系精�?,
      "prob": "15%",
      "bonus": "水系攻击+3%"
    },
    {
      "id": 4,
      "name": "草系�?,
      "color": "#2e7d32",
      "icon": "🌿",
      "desc": "孵化出草系精�?,
      "prob": "15%",
      "bonus": "草系攻击+3%"
    },
    {
      "id": 5,
      "name": "电系�?,
      "color": "#f57f17",
      "icon": "�?,
      "desc": "孵化出电系精�?,
      "prob": "10%",
      "bonus": "电系攻击+5%"
    },
    {
      "id": 6,
      "name": "冰系�?,
      "color": "#00838f",
      "icon": "❄️",
      "desc": "孵化出冰系精�?,
      "prob": "10%",
      "bonus": "冰系攻击+5%"
    },
    {
      "id": 7,
      "name": "龙系�?,
      "color": "#4527a0",
      "icon": "🐉",
      "desc": "孵化出龙系精�?,
      "prob": "5%",
      "bonus": "全属�?5%"
    },
    {
      "id": 8,
      "name": "恶系�?,
      "color": "#37474f",
      "icon": "👿",
      "desc": "孵化出恶系精�?,
      "prob": "10%",
      "bonus": "恶系攻击+5%"
    },
    {
      "id": 9,
      "name": "飞行�?,
      "color": "#388e3c",
      "icon": "🕊�?,
      "desc": "孵化出飞行系精灵",
      "prob": "10%",
      "bonus": "速度+5%"
    },
    {
      "id": 10,
      "name": "格斗�?,
      "color": "#d84315",
      "icon": "👊",
      "desc": "孵化出格斗系精灵",
      "prob": "10%",
      "bonus": "攻击+5%"
    }
  ],
  "eggItems": [
    {
      "name": "普通蛋",
      "rarity": "普�?,
      "icon": "🥚"
    },
    {
      "name": "火系�?,
      "rarity": "普�?,
      "icon": "🔥"
    },
    {
      "name": "水系�?,
      "rarity": "普�?,
      "icon": "💧"
    },
    {
      "name": "草系�?,
      "rarity": "普�?,
      "icon": "🌿"
    },
    {
      "name": "电系�?,
      "rarity": "普�?,
      "icon": "�?
    },
    {
      "name": "冰系�?,
      "rarity": "普�?,
      "icon": "❄️"
    },
    {
      "name": "龙系�?,
      "rarity": "稀�?,
      "icon": "🐉"
    },
    {
      "name": "恶系�?,
      "rarity": "普�?,
      "icon": "👿"
    },
    {
      "name": "飞行�?,
      "rarity": "普�?,
      "icon": "🕊�?
    },
    {
      "name": "格斗�?,
      "rarity": "普�?,
      "icon": "👊"
    },
    {
      "name": "岩石�?,
      "rarity": "普�?,
      "icon": "🪨"
    },
    {
      "name": "钢系�?,
      "rarity": "稀�?,
      "icon": "⚙️"
    },
    {
      "name": "妖精�?,
      "rarity": "稀�?,
      "icon": "🧚"
    },
    {
      "name": "超能力蛋",
      "rarity": "稀�?,
      "icon": "🔮"
    },
    {
      "name": "鬼系�?,
      "rarity": "稀�?,
      "icon": "👻"
    },
    {
      "name": "毒系�?,
      "rarity": "普�?,
      "icon": "☠️"
    },
    {
      "name": "地面�?,
      "rarity": "普�?,
      "icon": "⛰️"
    },
    {
      "name": "虫系�?,
      "rarity": "普�?,
      "icon": "🐛"
    },
    {
      "name": "闪光�?,
      "rarity": "传说",
      "icon": "�?
    },
    {
      "name": "异色�?,
      "rarity": "传说",
      "icon": "🌈"
    }
  ],
  "sizes": [
    {
      "id": 1,
      "name": "大块�?,
      "icon": "💪",
      "color": "#d32f2f",
      "desc": "体型较大的精灵蛋，孵化出的精灵体型偏�?,
      "prob": "10%",
      "bonus": "生命�?5%"
    },
    {
      "id": 2,
      "name": "小块�?,
      "icon": "👶",
      "color": "#1a6d37",
      "desc": "体型较小的精灵蛋，孵化出的精灵体型偏�?,
      "prob": "10%",
      "bonus": "速度+5%"
    },
    {
      "id": 3,
      "name": "炫彩�?,
      "icon": "🌈",
      "color": "#9c27b0",
      "desc": "稀有炫彩外观的精灵蛋，有概率孵出闪光精�?,
      "prob": "5%",
      "bonus": "全属�?3%"
    },
    {
      "id": 4,
      "name": "普通蛋",
      "icon": "🥚",
      "color": "#999",
      "desc": "最常见的精灵蛋",
      "prob": "75%",
      "bonus": "�?
    }
  ],
  "pets": [
    {
      "name": "迪莫",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "喵喵",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "喵呜",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔力�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火花",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "焰火",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火神",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水蓝�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "波波�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水灵",
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "蓬松的样�?
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "紧实的样�?
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "急急急鸭"
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "等一等鸭"
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "起来�?
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "燃了�?
    },
    {
      "name": "板板�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "咔咔�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "水泡�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "锥尾�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "铃兰�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花影羚羊",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪绒�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "冬羽雀",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "岚鸟",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "小灵�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "幻灵�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "幻影灵菇",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "石肤�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?,
        "大地�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "石刺�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?,
        "大地�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "石冠王蜥",
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?,
        "大地�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "布是�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "布是�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "布克棱岩",
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "恶魔�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "叮叮恶魔",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "毛毛",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "爬爬",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "化蝶",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": "平常的样�?
    },
    {
      "name": "幽影�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小鼠�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "燕尾�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "卷胡巨獭",
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "矿晶�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "晶石�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": "西瓜碧玺的样�?
    },
    {
      "name": "奇丽�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "奇丽�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "奇丽�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "丢丢",
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "草地附近的样�?
    },
    {
      "name": "卡卡�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "草地附近的样�?
    },
    {
      "name": "卡瓦�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "草地附近的样�?
    },
    {
      "name": "护主�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "音速犬",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绿耳松�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "抱枕松鼠",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蹦床松鼠",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "嘟嘟�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "嘟嘟�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小灵�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "暗影灵面",
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "睁眼的样�?
    },
    {
      "name": "幽冥�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "睁眼的样�?
    },
    {
      "name": "梦游",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "穿旧睡衣的样�?
    },
    {
      "name": "梦悠�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "穿旧睡衣的样�?
    },
    {
      "name": "兽花�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伏地�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "贪食�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "巨噬针鼹",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蹦蹦种子",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "海神球形�?
    },
    {
      "name": "蹦蹦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "海神球形�?
    },
    {
      "name": "蹦蹦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "海神球形�?
    },
    {
      "name": "电咩�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "粉咩�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "电球咩咩",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蒲公�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蒲公英娃�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊贝�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊贝粉粉",
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "白发懒人",
      "type1": "普�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "动力�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "瞌睡�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海盔�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "刺盔�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "千棘�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "菊花�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "星光能量的样�?
    },
    {
      "name": "星光�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "星光能量的样�?
    },
    {
      "name": "一窝蜂",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "黄蜂�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花魁蜂后",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小夜",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "紫夜",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "朔夜伊芙",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "乖乖�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蓝珠天鹅",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "翠顶夫人",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "黑羽夫人",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "锤头�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绿草精灵",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔草巫灵",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "记忆�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "咔咔羽毛",
      "type1": "�?,
      "type2": "普�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "咔咔雀",
      "type1": "�?,
      "type2": "普�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "咔咔�?,
      "type1": "�?,
      "type2": "普�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小草�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "草衣�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花衣�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绿翼�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔翼�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔眷�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "阿米亚特",
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "阿米�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "罗隐",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "风铃�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蓝蝶�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "彩蝶�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "石石",
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "巨灵�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "仪使�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "仪式之星",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "仪式巨像",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "大地�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小独角兽",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "巨灵�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "白金独角�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "巨灵�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "旋叶�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "植物�?
      ],
      "hasShiny": false,
      "variant": "金黄的样�?
    },
    {
      "name": "蓬叶�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "植物�?
      ],
      "hasShiny": false,
      "variant": "金黄的样�?
    },
    {
      "name": "风滚暮虫",
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "植物�?
      ],
      "hasShiny": false,
      "variant": "金黄的样�?
    },
    {
      "name": "小黑�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "黑猫巫师",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "忽幽�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "影狸",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "多多",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "多啦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古啦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "哭哭�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "怖须�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "怖哭�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "恶魔�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小电企鹅",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "电企�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪豆�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪蛮�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪巨�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "呼呼�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "獠牙�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雪娃�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "冰封怨灵",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪灵",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "大耳帽�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "帽兜娃娃",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雪影娃娃",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "权杖-�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "权杖-�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "灵狐",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "九尾�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "尖嘴狐仙",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "里奥",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "灵羽勇士",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣羽翼王",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "松仔",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "松叶�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "针叶巡林",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小勇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "炽焰�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "炽心勇狮",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水滴�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水蛇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "游蛇魔使",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "公平�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小怂猫",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "怒目怂猫",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小狮�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": "崖间地的样子"
    },
    {
      "name": "神圣狮鹫",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": "崖间地的样子"
    },
    {
      "name": "皇家狮鹫",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": "崖间地的样子"
    },
    {
      "name": "圆眼蜘蛛",
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "尖角蜘蛛",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "芋香巨角�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "波波�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "大地�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "消波�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "大地�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "嗜波�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "大地�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "菇菇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "多菇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "九幽�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "斑斑",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "斑枭",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "草头�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "卷毛�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海豹战士",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海豹船长",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "号儿�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圆号�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "甜田�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "壳乙�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "卡洛�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "棋棋",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋骑�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋齐�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋祈�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋绮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "奔波�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "流浪�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "呆小�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "舞动路路",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "白发路路",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "逗�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "气球�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "梦想三三",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花怨鳗",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "鳗尾�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊雷�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊兰亚龙",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "拉特",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "酷拉",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "闪电�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "刺电�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "荆棘电环",
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小箱�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "妖精�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "迷迷箱�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "妖精�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古钟�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "寒音�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "动物�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?
    },
    {
      "name": "矮脚爬爬",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "恶魔红钻",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火尾瓦特",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火尾战士",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "烈火守护",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "里拉�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海枝�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "碧蓝珊瑚"
    },
    {
      "name": "多西",
      "type1": "机械",
      "type2": "�?,
      "group": [
        "巨灵�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "库多�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "巨灵�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "波多�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "巨灵�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小翼�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "翼龙",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "电动长颈�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "奔乐�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "爵士�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "缇塔",
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "声波缇塔",
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小鹬",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "鄙目�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "高脚�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "脆筒甜甜",
      "type1": "�?,
      "type2": "",
      "group": [
        "软体�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "香草甜甜",
      "type1": "�?,
      "type2": "",
      "group": [
        "软体�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣代甜甜",
      "type1": "�?,
      "type2": "",
      "group": [
        "软体�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "刺轮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "上弦的样�?
    },
    {
      "name": "月亮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "上弦的样�?
    },
    {
      "name": "豆丁�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨龙�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "快鳍�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨龙�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "龙鱼",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨龙�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "胆小鳗鱼",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "闪电鳗鱼",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "翡翠水母",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "琉璃水母",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "裘洛",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "裘力",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "裘卡",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "可爱�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "炽热�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火焰�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "布鲁�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪顶布鲁�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "冰钻布鲁�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "治愈�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "红丝�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "红绒十字",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "乌达",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "极昼的样�?
    },
    {
      "name": "迷你�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "极昼的样�?
    },
    {
      "name": "乌拉�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "极昼的样�?
    },
    {
      "name": "螺旋帕帕",
      "type1": "机械",
      "type2": "�?,
      "group": [
        "天空�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "帕帕斯卡",
      "type1": "机械",
      "type2": "�?,
      "group": [
        "天空�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "机械方方",
      "type1": "机械",
      "type2": "",
      "group": [
        "拟人�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "多彩方方",
      "type1": "机械",
      "type2": "",
      "group": [
        "拟人�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "立方�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "拟人�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "可立�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "晕晕�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绅士�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "武者鸡",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "优优",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绒光优优",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "噼啪�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "深蓝�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "格兰种子",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "格兰�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "格兰�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "地鼠",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "枯水期的样子"
    },
    {
      "name": "遁鼠",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "枯水期的样子"
    },
    {
      "name": "遁地�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "枯水期的样子"
    },
    {
      "name": "墨鱿�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "混乱鱿彩",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "秩序鱿墨",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?,
        "软体�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小甲�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "铠甲�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣剑侍从",
      "type1": "机械",
      "type2": "",
      "group": [
        "巨灵�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣剑-X",
      "type1": "机械",
      "type2": "",
      "group": [
        "巨灵�?,
        "机械�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "吸泥�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "泥吼�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "天空�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "大头骨龙",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "寂灭骨龙",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?,
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "厉毒小萝",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "厉毒修萝",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "拟人�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小帕�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "帕尔萨斯",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "龙息帕尔",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "毛头小蛛",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "捕尘长绒",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "食尘短绒",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画精�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画像守护",
      "type1": "普�?,
      "type2": "",
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画间法师�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画间沉铁�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "书魔�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "书卷守护",
      "type1": "普�?,
      "type2": "",
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古卷执政�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古卷匣魔�?,
      "type1": "普�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绒绒",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小绒�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "绒仙�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "犀角鸟",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "光纤�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "疾光千兽",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "果冻",
      "type1": "�?,
      "type2": "",
      "group": [
        "海洋�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "抹茶布丁",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?,
        "魔力�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "椰浆布丁",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "熔岩布丁",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "星尘�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "落星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "陨星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "双灯�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "利灯�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "月牙雪熊",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "巨灵�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "嗜光嗡嗡",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "窃光�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "柴渣�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "燃薪�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?,
        "植物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "空空�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "魔力�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "夜宿�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "魔力�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "夜枭",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?,
        "魔力�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "粉粉�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "软体�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小皮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "软体�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "贝瑟",
      "type1": "机械",
      "type2": "�?,
      "group": [
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "贝加�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "贝古�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "粉星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "粉耳星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "落陨星兔",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "布瓜�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "上岸�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火红�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雅丹�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "春团",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "春兔",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "春花�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?,
        "妖精�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "幽星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "曜星�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "暮星�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?,
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "钨丝贝贝",
      "type1": "机械",
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "辉光幕机",
      "type1": "机械",
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "机幕方舟",
      "type1": "机械",
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "凡雀",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "紫翎�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "凡鹰",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小雪�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雪�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "爆焰�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "爆焰喷喷",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "猴麦�?,
      "type1": "普�?,
      "type2": "机械",
      "group": [
        "动物�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "音碟�?,
      "type1": "普�?,
      "type2": "机械",
      "group": [
        "动物�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "加油海葵",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "加油�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "两栖�?,
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小丑豆豆",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小丑�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小丑公爵",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "烟花�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "机械�?,
        "魔力�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "烟花伯爵",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "机械�?,
        "魔力�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "咕咕�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "咕德帽帽",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "炫光迪迪",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "大地�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "霹雳迪迪",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?,
        "大地�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小鼓�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "动物�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "巨鼓�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "动物�?,
        "机械�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "牵线木偶",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "帅帅魔偶",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?,
        "拟人�?
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "学院呱呱",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": ""
    }
  ],
  "mounts": [
    {
      "pet": "极光迪莫",
      "mount": "光翼飞行",
      "bonus": "飞行速度+25%",
      "req": "等级30以上"
    },
    {
      "pet": "烈焰火羽",
      "mount": "火焰冲锋",
      "bonus": "移动速度+30%",
      "req": "等级35以上"
    },
    {
      "pet": "水翼精灵",
      "mount": "水翼滑行",
      "bonus": "水中移动速度+40%",
      "req": "等级35以上"
    },
    {
      "pet": "草叶精灵",
      "mount": "藤蔓滑翔",
      "bonus": "采集速度+20%",
      "req": "等级30以上"
    },
    {
      "pet": "齿轮小子",
      "mount": "机甲合体",
      "bonus": "防御+15%",
      "req": "等级40以上"
    },
    {
      "pet": "上岸�?,
      "mount": "蛙跳飞行",
      "bonus": "跳跃高度+50%",
      "req": "等级30以上"
    }
  ],
  "api": {
    "url": "https://roco.gptvip.chat/api/magic-egg-lookup",
    "source": "https://wiki.biligame.com/rocom",
    "license": "CC BY-NC-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
  }
}
var petImgMap = {
  '迪莫': 'JL dimo', '喵喵': 'JL miaomiao', '喵呜': 'JL miaowu', '魔力�?: 'JL molimiao',
  '火花': 'JL huohua', '焰火': 'JL yanhuo', '火神': 'JL huoshen',
  '水蓝�?: 'JL shuilanlan', '波波�?: 'JL bobola', '水灵': 'JL shuiling',
  '鸭吉�?: 'JL yajiji', '板板�?: 'JL banbanke', '咔咔�?: 'JL kakake', '水泡�?: 'JL shuipaoke',
  '锥尾�?: 'JL youlingyang', '铃兰�?: 'JL lanlingyang', '花影羚羊': 'JL guimeilingyang',
  '雪绒�?: 'JL xuerongniao_dong', '冬羽雀': 'JL dongyuque', '岚鸟': 'JL lanniao',
  '小灵�?: 'JL xiaolinggu', '幻灵�?: 'JL youlinggu', '幻影灵菇': 'JL lunhuilinggu',
  '石肤�?: 'JL huociyanxiyi', '石刺�?: 'JL conglinluxiyi', '石冠王蜥': 'JL shihuacixiyi',
  '布是�?: 'JL xiaobushi', '布是�?: 'JL bulaishi', '布克棱岩': 'JL bulaikeyan',
  '恶魔�?: 'JL emoding', '叮叮恶魔': 'JL dingdingemo',
  '毛毛': 'JL maomao', '爬爬': 'JL papa', '化蝶': 'JL huadie',
  '幽影�?: 'JL youlingshu',
  '小鼠�?: 'JL xiaoshulan', '燕尾�?: 'JL dashulan', '卷胡巨獭': 'JL jushulan',
  '矿晶�?: 'JL kuangjingchong', '晶石�?: 'JL jingshiwo',
  '奇丽�?: 'JL qilicao', '奇丽�?: 'JL qiliye', '奇丽�?: 'JL qilihua',
  '丢丢': 'JL diudiu', '卡卡�?: 'JL kakachong', '卡瓦�?: 'JL kawachong',
  '护主�?: 'JL huzhuquan', '音速犬': 'JL yinsuquan',
  '绿耳松�?: 'JL lversongshu', '抱枕松鼠': 'JL baozhensongshu', '蹦床松鼠': 'JL bengchuangsongshu',
  '嘟嘟�?: 'JL duudbao', '嘟嘟�?: 'JL duudguo',
  '小灵�?: 'JL xiaoyoulinglian', '暗影灵面': 'JL youlinglian', '幽冥�?: 'JL youmingzhiyan',
  '梦游': 'JL menhyou', '梦悠�?: 'JL mengyouyou',
  '兽花�?: 'JL shouhualei',
  '伏地�?: 'JL fudishou', '贪食�?: 'JL shiyishou', '巨噬针鼹': 'JL wanzuishou',
  '蹦蹦种子': 'JL bengbengzhongzi', '蹦蹦�?: 'JL bengbengcao', '蹦蹦�?: 'JL bengbenghua',
  '电咩�?: 'JL dianmieemie', '粉咩�?: 'JL fenmieemie', '电球咩咩': 'JL dianqiumieemie',
  '蒲公�?: 'JL pugongying', '蒲公英娃�?: 'JL pugongyingwawa',
  '伊贝�?: 'JL yibeier', '伊贝粉粉': 'JL yibeifenfen',
  '白发懒人': 'JL baifalanren', '动力�?: 'JL dongliyuan', '瞌睡�?: 'JL keshuiwang',
  '海盔�?: 'JL haikuichong', '刺盔�?: 'JL cikuichong', '千棘�?: 'JL qianjikuichong',
  '菊花�?: 'JL juhuali',
  '小星�?: 'JL xiaoxingguang', '星光�?: 'JL xingguangshi',
  '一窝蜂': 'JL yiwofeng', '黄蜂�?: 'JL huangfenghou', '花魁蜂后': 'JL huakuifenghou',
  '小夜': 'JL xiaoye', '紫夜': 'JL ziye', '朔夜伊芙': 'JL shuoyeifu',
  '乖乖�?: 'JL guaiguaimeng', '蓝珠天鹅': 'JL lanzhutianer', '翠顶夫人': 'JL cuidingfuren', '黑羽夫人': 'JL heiyufuren', '锤头�?: 'JL chuitoumeng',
  '绿草精灵': 'JL lvcaojingling', '魔草巫灵': 'JL mocaowuling',
  '记忆�?: 'JL jiyishi',
  '咔咔羽毛': 'JL kakayumao', '咔咔雀': 'JL kakaque', '咔咔�?: 'JL kakaniao',
  '小草�?: 'JL xiaocaochong', '草衣�?: 'JL caoyichong', '花衣�?: 'JL huayidie',
  '绿翼�?: 'JL lvyiniao', '魔翼�?: 'JL moyiniao', '魔眷�?: 'JL mojuanniao',
  '爆焰�?: 'JL baoyanzai', '爆焰喷喷': 'JL baoyanpenpen',
  '猴麦�?: 'JL houmaizai', '音碟�?: 'JL yindiehou',
  '加油海葵': 'JL jiayouhaikui', '加油�?: 'JL jiayouxie',
  '小丑豆豆': 'JL xiaochoudoudou', '小丑�?: 'JL xiaochoutu', '小丑公爵': 'JL xiaochougongjue',
  '烟花�?: 'JL yianhuatuan', '烟花伯爵': 'JL yianhuabojue',
  '咕咕�?: 'JL gugumao', '咕德帽帽': 'JL gudemama',
  '炫光迪迪': 'JL xuanguangdidi', '霹雳迪迪': 'JL pilididi',
  '小鼓�?: 'JL xiaoguxiang', '巨鼓�?: 'JL juguxiang',
  '牵线木偶': 'JL qianxianmuou', '帅帅魔偶': 'JL shuaishuaimuou',
  '学院呱呱': 'JL xueyuanguagua',
  '布瓜�?: 'JL buguake', '上岸�?: 'JL shanganwa',
  '火红�?: 'JL huohongwei', '雅丹�?: 'JL yadanbin',
  '小雪�?: 'JL xiaoxueren', '雪�?: 'JL xueguai',
  '乌达': 'JL wuda', '迷你�?: 'JL miniwu', '乌拉�?: 'JL wulata',
  '多灵': 'JL duoling', '多灵�?: 'JL duolingzhu',
  '圣剑侍从': 'JL shengjianshicong', '圣剑-X': 'JL shengjianX',
  '枫枫迪迪': 'JL xuanguangdidi'
}
var db = null

function getEggImgUrl(name, variant) {
  var fullPetMap = require('../egg/fullPetMap.js');
  var fullName = variant ? name + '�? + variant + '�? : name;
  if (fullPetMap[fullName]) return fullPetMap[fullName];
  if (fullPetMap[name]) return fullPetMap[name];
  var fn = petImgMap[name];
  if (fn) {
    if (variant) return 'https://wiki.biligame.com/rocom/Special:FilePath/精灵_头像_' + fullName + '.png';
    return 'https://wiki.biligame.com/rocom/Special:FilePath/' + fn + '.png';
  }
  return 'https://wiki.biligame.com/rocom/Special:FilePath/精灵_头像_' + fullName + '.png';
}

Page({
  data: {
    fullFilteredPets: [],
    displayCount: 50,
    pets: [],
    filteredPets: [],
    groups: [],
    activeGroup: '',
    searchKeyword: '',
    showSuggest: false,
    suggestList: [],
    selectedPet: null,
    loading: true,
    // 模拟器数�?
    activeTab: 'search',
    motherPet: null,
    fatherPet: null,
    compatibleFathers: [],
    selectingRole: 'mother',
    simSearchKeyword: '',
    simFilteredPets: [],
    isCompatible: false,
    sharedGroups: [],
    offspringName: '',
    eggGroupColors: {
      '无法孵蛋': '#999999',
      '动物�?: '#d32f2f',
      '拟人�?: '#fdd835',
      '巨灵�?: '#5c6bc0',
      '魔力�?: '#d84315',
      '天空�?: '#42a5f5',
      '两栖�?: '#26a69a',
      '植物�?: '#66bb6a',
      '大地�?: '#8d6e63',
      '妖精�?: '#ec4899',
      '昆虫�?: '#7cb342',
      '软体�?: '#ff7043',
      '机械�?: '#90a4ae',
      '海洋�?: '#00838f',
      '巨龙�?: '#4527a0'
    },
    eggTypeEmoji: {
      '�?: '🔥', '�?: '💧', '�?: '🌿', '�?: '�?, '�?: '❄️',
      '�?: '🐉', '�?: '👿', '飞行': '🕊�?, '格斗': '👊', '�?: '☠️',
      '地面': '⛰️', '岩石': '🪨', '�?: '👻', '�?: '⚙️', '妖精': '🧚',
      '超能�?: '🔮', '�?: '🐛', '普�?: '�?
    },
    eggTypeColors: {
      '�?: '#ff7043', '�?: '#29b6f6', '�?: '#66bb6a', '�?: '#fdd835',
      '�?: '#26c6da', '�?: '#7e57c2', '�?: '#455a64', '飞行': '#42a5f5',
      '格斗': '#ef5350', '�?: '#ab47bc', '地面': '#8d6e63', '岩石': '#78909c',
      '�?: '#5c6bc0', '�?: '#90a4ae', '妖精': '#f48fb1', '超能�?: '#ec407a',
      '�?: '#7cb342', '普�?: '#ffa726'
    }
  },
  onReachBottom: function() {
    if (this.data.fullFilteredPets && this.data.displayCount < this.data.fullFilteredPets.length) {
      this.data.displayCount += 50;
      this.setData({
        filteredPets: this.data.fullFilteredPets.slice(0, this.data.displayCount)
      });
    }
  },
  onLoad: function(options) {
    this.loadLocalFallbackData()
    this.loadData()
  },
  loadData: function() {
    var self = this
    // We already loaded local data, but we can set loading to true in background if we want,
    // or just let it query silently. Let's keep loading: false so users don't see a blocker if local data is ready.
    if (wx.cloud) {
      db = wx.cloud.database()
      wx.cloud.callFunction({
        name: 'eggQuery',
        data: { action: 'groups' }
      }).then(function(res) {
        if (res.result && res.result.success && res.result.data && res.result.data.length > 0) {
          self.data.fullFilteredPets = pets;
      self.data.displayCount = 50;
      self.setData({ groups: res.result.data })
        }
      }).catch(function() {
        // Already has local fallback, no need to force reload
      })
      wx.cloud.callFunction({
        name: 'eggQuery',
        data: { action: 'query' }
      }).then(function(res) {
        if (res.result && res.result.success && res.result.data && res.result.data.length > 0) {
          var pets = res.result.data
          for (var i = 0; i < pets.length; i++) {
            if (pets[i].group) {
              pets[i].groupStr = pets[i].group.join(', ')
            } else {
              pets[i].groupStr = ''
            }
            pets[i].imgUrl = getEggImgUrl(pets[i].name, pets[i].variant)
          }
          self.fullPets = pets;
      self.setData({ petNames: pets.map(p => p.variant ? p.name + "�? + p.variant + "�? : p.name), filteredPets: pets.slice(0, 50), simFilteredPets: pets, loading: false })
        }
      }).catch(function() {
        // Already has local fallback, no need to force reload
      })
    }
  },
  loadLocalFallbackData: function() {
    if ((this.fullPets && this.fullPets.length) > 0) return // 避免重复加载
    var self = this
    var localPets = eggData.pets || []
    var processedPets = []
    
    for (var i = 0; i < localPets.length; i++) {
      var p = Object.assign({}, localPets[i])
      // 兼容 data.pets 中没�?types 数组的情�?
      if (!p.types) {
        p.types = []
        if (p.type1) p.types.push(p.type1)
        if (p.type2) p.types.push(p.type2)
      }
      p.groupStr = p.group ? p.group.join(', ') : ''
      p.imgUrl = getEggImgUrl(p.name, p.variant)
      processedPets.push(p)
    }

    // 动态生成本地蛋组信�?
    var groupsMap = {}
    for (var i = 0; i < processedPets.length; i++) {
      var gList = processedPets[i].group || []
      for (var j = 0; j < gList.length; j++) {
        var gName = gList[j]
        groupsMap[gName] = (groupsMap[gName] || 0) + 1
      }
    }
    
    var groups = []
    for (var name in groupsMap) {
      groups.push({ name: name, count: groupsMap[name] })
    }
    // 按照数量排序蛋组
    groups.sort(function(a, b) { return b.count - a.count })

    self.fullPets = processedPets;
    self.data.fullFilteredPets = processedPets;
    self.data.displayCount = 50;
    self.setData({
      petNames: processedPets.map(p => p.variant ? p.name + "�? + p.variant + "�? : p.name),
      filteredPets: processedPets.slice(0, 50),
      groups: groups,
      loading: false
    })
  },
  onSearchInput: function(e) {
    var keyword = e.detail.value.trim()
    this.setData({ searchKeyword: keyword })
    if (keyword) {
      this.doSearch(keyword)
    } else {
      this.setData({ showSuggest: false, suggestList: [] })
      this.filterByGroup()
    }
  },
  doSearch: function(keyword) {
    var self = this
    var results = []
    var pets = self.fullPets
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].name.indexOf(keyword) >= 0) {
        results.push(pets[i])
      }
    }
    self.setData({ showSuggest: true, suggestList: results.slice(0, 10) })
    if (results.length > 0) {
      self.setData({ filteredPets: results.slice(0, 50), activeGroup: '' })
    }
  },
  selectSuggest: function(e) {
    var item = e.currentTarget.dataset.item
    this.data.fullFilteredPets = [item]
    ;
    this.data.displayCount = 50;
    this.setData({
      selectedPet: item,
      searchKeyword: item.name,
      showSuggest: false,
      suggestList: [],
      filteredPets: [item]
    .slice(0, 50)})
  },
  clearSearch: function() {
    this.data.fullFilteredPets = pets ;
    this.data.displayCount = 50;
    this.setData({ searchKeyword: '', showSuggest: false, suggestList: [], selectedPet: null })
    this.filterByGroup()
  },
  selectGroup: function(e) {
    var group = e.currentTarget.dataset.group
    this.setData({ activeGroup: group, searchKeyword: '', selectedPet: null, showSuggest: false })
    this.filterByGroup()
  },
  filterByGroup: function() {
    var self = this
    var group = self.data.activeGroup
    var pets = self.fullPets
    if (!group) {
      self.setData({ filteredPets: pets.slice(0, 50)})
      return
    }
    var filtered = []
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].group && pets[i].group.indexOf(group) >= 0) {
        filtered.push(pets[i])
      }
    }
    self.data.fullFilteredPets = filtered;
      self.data.displayCount = 50;
      self.setData({ filteredPets: filtered.slice(0, 50)})
  },
  selectPet: function(e) {
    var item = e.currentTarget.dataset.item
    var self = this
    
    // 如果已经选中了该精灵，则取消选中
    if (this.data.selectedPet && this.data.selectedPet.name === item.name) {
      this.data.fullFilteredPets = filtered;
    this.data.displayCount = 50;
    this.setData({ selectedPet: null })
      this.filterByGroup()
      return
    }

    this.setData({ selectedPet: item })
    
    // 孵蛋反查逻辑：显示同蛋组的所有精�?
    if (item.group && item.group.length > 0) {
      var filtered = []
      var pets = self.fullPets
      for (var i = 0; i < pets.length; i++) {
        // 检查是否有交集蛋组
        var hasCommonGroup = false
        if (pets[i].group) {
          for (var j = 0; j < item.group.length; j++) {
            if (pets[i].group.indexOf(item.group[j]) >= 0) {
              hasCommonGroup = true
              break
            }
          }
        }
        if (hasCommonGroup) {
          filtered.push(pets[i])
        }
      }
      this.setData({ filteredPets: filtered.slice(0, 50), activeGroup: '' })
      
      wx.showToast({
        title: '已筛选同蛋组对象',
        icon: 'none',
        duration: 1500
      })
    }
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },

  // 模拟器方�?
  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },
  onMotherPickerChange: function(e) {
    var index = e.detail.value
    var pet = this.fullPets[index]
    this.selectMotherPet(pet)
  },
  onFatherPickerChange: function(e) {
    var index = e.detail.value
    var pet = this.fullCompatibleFathers[index]
    this.setData({ fatherPet: pet })
    this.checkCompatibility()
  },
  selectMotherPet: function(item) {
    var self = this
    self.setData({
      motherPet: item,
      fatherPet: null,
      isCompatible: false,
      sharedGroups: [],
      offspringName: ''
    })
    // Compute compatible fathers
    var compatible = []
    var pets = self.fullPets
    for (var i = 0; i < pets.length; i++) {
      var other = pets[i]
      var overlap = false
      if (other.group && item.group) {
        for (var j = 0; j < item.group.length; j++) {
          if (other.group.indexOf(item.group[j]) >= 0) {
            overlap = true
            break
          }
        }
      }
      if (overlap) {
        compatible.push(other)
      }
    }
    self.setData({ compatibleFathers: compatible })
  },
  removePet: function(e) {
    var role = e.currentTarget.dataset.role
    if (role === 'mother') {
      this.setData({
        motherPet: null,
        fatherPet: null,
        compatibleFathers: [],
        isCompatible: false,
        sharedGroups: [],
        offspringName: ''
      })
    } else {
      this.setData({
        fatherPet: null,
        isCompatible: false,
        sharedGroups: [],
        offspringName: ''
      })
    }
  },
  getBabyForm: function(name) {
    var babymap = {
      '喵鸣': '喵喵', '魔力�?: '喵喵', '武斗酷猫': '喵喵',
      '焰火': '火花', '火神': '火花', '烈火战神': '火花',
      '波波�?: '水蓝�?, '水灵': '水蓝�?, '圣水守护': '水蓝�?,
      '火红�?: '火红�?, '雅丹�?: '火红�?,
      '小雪�?: '小雪�?, '雪�?: '小雪�?,
      '迷你�?: '乌达', '乌拉�?: '乌达',
      '多灵�?: '多灵',
      '圣剑-X': '圣剑侍从',
      '大块�?: '大块�?, '小块�?: '大块�?,
      '雪人呱呱': '呱呱', '逍遥呱呱': '呱呱', '武生呱呱': '呱呱', '文静呱呱': '呱呱', '学院呱呱': '呱呱',
      '爆焰喷喷': '爆焰�?,
      '音碟�?: '猴麦�?,
      '加油�?: '加油海葵',
      '小丑公爵': '小丑豆豆', '小丑�?: '小丑豆豆',
      '烟花伯爵': '烟花�?,
      '咕德帽幕': '咕咕�?,
      '霹雳迪迪': '炫光迪迪',
      '巨鼓�?: '小鼓�?,
      '帅帅魔偶': '牵线木偶',
    }
    return babymap[name] || name
  },
  checkCompatibility: function() {
    var self = this
    var mother = self.data.motherPet
    var father = self.data.fatherPet
    
    if (!mother || !father) return
    
    var shared = []
    if (mother.group && father.group) {
      for (var i = 0; i < mother.group.length; i++) {
        if (father.group.indexOf(mother.group[i]) >= 0) {
          shared.push(mother.group[i])
        }
      }
    }
    
    var isComp = shared.length > 0
    var baby = self.getBabyForm(mother.name)
    
    self.setData({
      isCompatible: isComp,
      sharedGroups: shared,
      offspringName: baby
    })
  },
  onShareAppMessage: function() {
    return { title: '洛手助手 - 精灵蛋培育模�?, path: '/pages/eggCalc/eggCalc', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 模拟精灵蛋培育，预测后代属�?, imageUrl: '/images/banner.webp' }
  }
})
