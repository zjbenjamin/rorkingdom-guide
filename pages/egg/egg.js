var app = getApp()
var eggData = {
  "types": [
    {
      "id": 1,
      "name": "普通蛋",
      "color": "#999",
      "icon": "🥚",
      "desc": "包含基础属性精�?,
      "prob": "60%",
      "bonus": "�?
    },
    {
      "id": 2,
      "name": "神奇的蛋",
      "color": "#a855f7",
      "icon": "�?,
      "desc": "包含稀有属性及活动精灵",
      "prob": "25%",
      "bonus": "全属�?1%"
    },
    {
      "id": 3,
      "name": "炫彩�?,
      "color": "#ec4899",
      "icon": "🌈",
      "desc": "包含异色及高品质精灵",
      "prob": "10%",
      "bonus": "异色率提�?
    },
    {
      "id": 4,
      "name": "同乘�?,
      "color": "#f59e0b",
      "icon": "🏇",
      "desc": "包含可骑乘的精灵",
      "prob": "5%",
      "bonus": "骑乘加�?
    }
  ],
  "eggItems": [
    {
      "name": "普通蛋",
      "rarity": "普�?,
      "icon": "🥚"
    },
    {
      "name": "神奇的蛋",
      "rarity": "稀�?,
      "icon": "�?
    },
    {
      "name": "炫彩�?,
      "rarity": "传说",
      "icon": "🌈"
    },
    {
      "name": "同乘�?,
      "rarity": "传说",
      "icon": "🏇"
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
      "variant": "",
      "height": "0.54~0.78",
      "weight": "5.5~7",
      "minHeight": 0.54,
      "maxHeight": 0.78,
      "minWeight": 5.5,
      "maxWeight": 7
    },
    {
      "name": "喵喵",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.53~0.75",
      "weight": "3.62~4.6",
      "minHeight": 0.53,
      "maxHeight": 0.75,
      "minWeight": 3.62,
      "maxWeight": 4.6
    },
    {
      "name": "喵呜",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.65~0.92",
      "weight": "14.2~15.6",
      "minHeight": 0.65,
      "maxHeight": 0.92,
      "minWeight": 14.2,
      "maxWeight": 15.6
    },
    {
      "name": "魔力�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.5~2.15",
      "weight": "105~125",
      "minHeight": 1.5,
      "maxHeight": 2.15,
      "minWeight": 105,
      "maxWeight": 125
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
      "variant": "",
      "height": "0.53~0.71",
      "weight": "7.6~8.5",
      "minHeight": 0.53,
      "maxHeight": 0.71,
      "minWeight": 7.6,
      "maxWeight": 8.5
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
      "variant": "",
      "height": "0.82~1.1",
      "weight": "21~30.7",
      "minHeight": 0.82,
      "maxHeight": 1.1,
      "minWeight": 21,
      "maxWeight": 30.7
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
      "variant": "",
      "height": "1.52~2.18",
      "weight": "90.5~110",
      "minHeight": 1.52,
      "maxHeight": 2.18,
      "minWeight": 90.5,
      "maxWeight": 110
    },
    {
      "name": "水蓝�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.45~0.65",
      "weight": "2.85~4.21",
      "minHeight": 0.45,
      "maxHeight": 0.65,
      "minWeight": 2.85,
      "maxWeight": 4.21
    },
    {
      "name": "波波�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.72~1.03",
      "weight": "29.5~34",
      "minHeight": 0.72,
      "maxHeight": 1.03,
      "minWeight": 29.5,
      "maxWeight": 34
    },
    {
      "name": "水灵",
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.08~1.54",
      "weight": "77~85.5",
      "minHeight": 1.08,
      "maxHeight": 1.54,
      "minWeight": 77,
      "maxWeight": 85.5
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "蓬松的样�?,
      "height": "0.65~0.94",
      "weight": "15.8~19.2",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 15.8,
      "maxWeight": 19.2
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "紧实的样�?,
      "height": "0.65~0.94",
      "weight": "15.8~19.2",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 15.8,
      "maxWeight": 19.2
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "急急急鸭",
      "height": "0.65~0.94",
      "weight": "15.8~19.2",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 15.8,
      "maxWeight": 19.2
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "等一等鸭",
      "height": "0.65~0.94",
      "weight": "15.8~19.2",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 15.8,
      "maxWeight": 19.2
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "起来�?,
      "height": "0.65~0.94",
      "weight": "15.8~19.2",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 15.8,
      "maxWeight": 19.2
    },
    {
      "name": "鸭吉�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "燃了�?,
      "height": "0.65~0.94",
      "weight": "15.8~19.2",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 15.8,
      "maxWeight": 19.2
    },
    {
      "name": "板板�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "咔咔�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "水泡�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "锥尾�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.57~0.81",
      "weight": "13.3~16.5",
      "minHeight": 0.57,
      "maxHeight": 0.81,
      "minWeight": 13.3,
      "maxWeight": 16.5
    },
    {
      "name": "铃兰�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.7~1.01",
      "weight": "29~36",
      "minHeight": 0.7,
      "maxHeight": 1.01,
      "minWeight": 29,
      "maxWeight": 36
    },
    {
      "name": "花影羚羊",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.42~1.92",
      "weight": "76.9~98",
      "minHeight": 1.42,
      "maxHeight": 1.92,
      "minWeight": 76.9,
      "maxWeight": 98
    },
    {
      "name": "雪绒�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "冬羽雀",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "岚鸟",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "",
      "height": "0.43~0.61",
      "weight": "5.4~7.1",
      "minHeight": 0.43,
      "maxHeight": 0.61,
      "minWeight": 5.4,
      "maxWeight": 7.1
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
      "variant": "",
      "height": "0.64~0.92",
      "weight": "13.2~16.5",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 13.2,
      "maxWeight": 16.5
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
      "variant": "",
      "height": "0.92~1.32",
      "weight": "39.4~48.4",
      "minHeight": 0.92,
      "maxHeight": 1.32,
      "minWeight": 39.4,
      "maxWeight": 48.4
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
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "",
      "height": "0.42~0.6",
      "weight": "18.5~32.5",
      "minHeight": 0.42,
      "maxHeight": 0.6,
      "minWeight": 18.5,
      "maxWeight": 32.5
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
      "variant": "",
      "height": "0.93~1.34",
      "weight": "97.5~115",
      "minHeight": 0.93,
      "maxHeight": 1.34,
      "minWeight": 97.5,
      "maxWeight": 115
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
      "variant": "",
      "height": "1.75~2.5",
      "weight": "287~315",
      "minHeight": 1.75,
      "maxHeight": 2.5,
      "minWeight": 287,
      "maxWeight": 315
    },
    {
      "name": "恶魔�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.39~0.56",
      "weight": "3.6~5.2",
      "minHeight": 0.39,
      "maxHeight": 0.56,
      "minWeight": 3.6,
      "maxWeight": 5.2
    },
    {
      "name": "叮叮恶魔",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.78~1.12",
      "weight": "25~34",
      "minHeight": 0.78,
      "maxHeight": 1.12,
      "minWeight": 25,
      "maxWeight": 34
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
      "variant": "",
      "height": "0.31~0.45",
      "weight": "3~4.5",
      "minHeight": 0.31,
      "maxHeight": 0.45,
      "minWeight": 3,
      "maxWeight": 4.5
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
      "variant": "",
      "height": "0.35~0.51",
      "weight": "5.5~8.4",
      "minHeight": 0.35,
      "maxHeight": 0.51,
      "minWeight": 5.5,
      "maxWeight": 8.4
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
      "variant": "平常的样�?,
      "height": "0.76~1.08",
      "weight": "15.6~17.8",
      "minHeight": 0.76,
      "maxHeight": 1.08,
      "minWeight": 15.6,
      "maxWeight": 17.8
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
      "variant": "",
      "height": "0.64~0.92",
      "weight": "29.5~37.5",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 29.5,
      "maxWeight": 37.5
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
      "variant": "",
      "height": "0.37~0.53",
      "weight": "6.7~7.5",
      "minHeight": 0.37,
      "maxHeight": 0.53,
      "minWeight": 6.7,
      "maxWeight": 7.5
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
      "variant": "",
      "height": "0.61~0.88",
      "weight": "28.6~31.5",
      "minHeight": 0.61,
      "maxHeight": 0.88,
      "minWeight": 28.6,
      "maxWeight": 31.5
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
      "variant": "",
      "height": "0.76~1.08",
      "weight": "76.5~90",
      "minHeight": 0.76,
      "maxHeight": 1.08,
      "minWeight": 76.5,
      "maxWeight": 90
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
      "variant": "",
      "height": "0.54~0.77",
      "weight": "5.8~10.53",
      "minHeight": 0.54,
      "maxHeight": 0.77,
      "minWeight": 5.8,
      "maxWeight": 10.53
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
      "variant": "西瓜碧玺的样�?,
      "height": "1.03~1.35",
      "weight": "59.1~71.05",
      "minHeight": 1.03,
      "maxHeight": 1.35,
      "minWeight": 59.1,
      "maxWeight": 71.05
    },
    {
      "name": "奇丽�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.38~0.55",
      "weight": "4.1~5.7",
      "minHeight": 0.38,
      "maxHeight": 0.55,
      "minWeight": 4.1,
      "maxWeight": 5.7
    },
    {
      "name": "奇丽�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.62~0.89",
      "weight": "24~31",
      "minHeight": 0.62,
      "maxHeight": 0.89,
      "minWeight": 24,
      "maxWeight": 31
    },
    {
      "name": "奇丽�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.11~1.58",
      "weight": "42~58",
      "minHeight": 1.11,
      "maxHeight": 1.58,
      "minWeight": 42,
      "maxWeight": 58
    },
    {
      "name": "丢丢",
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "草地附近的样�?,
      "height": "0.35~0.51",
      "weight": "4.3~6.1",
      "minHeight": 0.35,
      "maxHeight": 0.51,
      "minWeight": 4.3,
      "maxWeight": 6.1
    },
    {
      "name": "卡卡�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "草地附近的样�?,
      "height": "0.53~0.76",
      "weight": "18.5~21.6",
      "minHeight": 0.53,
      "maxHeight": 0.76,
      "minWeight": 18.5,
      "maxWeight": 21.6
    },
    {
      "name": "卡瓦�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "草地附近的样�?,
      "height": "0.76~1.09",
      "weight": "29~35.85",
      "minHeight": 0.76,
      "maxHeight": 1.09,
      "minWeight": 29,
      "maxWeight": 35.85
    },
    {
      "name": "护主�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.64~0.92",
      "weight": "13.6~17.5",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 13.6,
      "maxWeight": 17.5
    },
    {
      "name": "音速犬",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.13~1.62",
      "weight": "39.5~51.5",
      "minHeight": 1.13,
      "maxHeight": 1.62,
      "minWeight": 39.5,
      "maxWeight": 51.5
    },
    {
      "name": "绿耳松�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.47~0.68",
      "weight": "3.5~6",
      "minHeight": 0.47,
      "maxHeight": 0.68,
      "minWeight": 3.5,
      "maxWeight": 6
    },
    {
      "name": "抱枕松鼠",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.6~0.84",
      "weight": "21.05~27.08",
      "minHeight": 0.6,
      "maxHeight": 0.84,
      "minWeight": 21.05,
      "maxWeight": 27.08
    },
    {
      "name": "蹦床松鼠",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.78~1.12",
      "weight": "47.5~68.4",
      "minHeight": 0.78,
      "maxHeight": 1.12,
      "minWeight": 47.5,
      "maxWeight": 68.4
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
      "variant": "",
      "height": "0.65~0.8",
      "weight": "48.5~56",
      "minHeight": 0.65,
      "maxHeight": 0.8,
      "minWeight": 48.5,
      "maxWeight": 56
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
      "variant": "",
      "height": "0.64~0.91",
      "weight": "67.9~89.2",
      "minHeight": 0.64,
      "maxHeight": 0.91,
      "minWeight": 67.9,
      "maxWeight": 89.2
    },
    {
      "name": "小灵�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.38~0.55",
      "weight": "0.1~0.55",
      "minHeight": 0.38,
      "maxHeight": 0.55,
      "minWeight": 0.1,
      "maxWeight": 0.55
    },
    {
      "name": "暗影灵面",
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "睁眼的样�?,
      "height": "0.75~0.86",
      "weight": "0.12~1.16",
      "minHeight": 0.75,
      "maxHeight": 0.86,
      "minWeight": 0.12,
      "maxWeight": 1.16
    },
    {
      "name": "幽冥�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "睁眼的样�?,
      "height": "1.55~1.65",
      "weight": "1.5~2.86",
      "minHeight": 1.55,
      "maxHeight": 1.65,
      "minWeight": 1.5,
      "maxWeight": 2.86
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
      "variant": "穿旧睡衣的样�?,
      "height": "0.5~0.6",
      "weight": "0.6~1.87",
      "minHeight": 0.5,
      "maxHeight": 0.6,
      "minWeight": 0.6,
      "maxWeight": 1.87
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
      "variant": "穿旧睡衣的样�?,
      "height": "1~1.2",
      "weight": "1.25~3.1",
      "minHeight": 1,
      "maxHeight": 1.2,
      "minWeight": 1.25,
      "maxWeight": 3.1
    },
    {
      "name": "兽花�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.38~0.45",
      "weight": "4.25~6.5",
      "minHeight": 0.38,
      "maxHeight": 0.45,
      "minWeight": 4.25,
      "maxWeight": 6.5
    },
    {
      "name": "伏地�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.52~0.74",
      "weight": "12.4~15.8",
      "minHeight": 0.52,
      "maxHeight": 0.74,
      "minWeight": 12.4,
      "maxWeight": 15.8
    },
    {
      "name": "贪食�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.84~1.21",
      "weight": "21.6~35.84",
      "minHeight": 0.84,
      "maxHeight": 1.21,
      "minWeight": 21.6,
      "maxWeight": 35.84
    },
    {
      "name": "巨噬针鼹",
      "type1": "普�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.52~1.79",
      "weight": "87.3~105",
      "minHeight": 1.52,
      "maxHeight": 1.79,
      "minWeight": 87.3,
      "maxWeight": 105
    },
    {
      "name": "蹦蹦种子",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "海神球形�?,
      "height": "0.46~0.67",
      "weight": "4.3~5.6",
      "minHeight": 0.46,
      "maxHeight": 0.67,
      "minWeight": 4.3,
      "maxWeight": 5.6
    },
    {
      "name": "蹦蹦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "海神球形�?,
      "height": "0.59~0.85",
      "weight": "34.3~42.9",
      "minHeight": 0.59,
      "maxHeight": 0.85,
      "minWeight": 34.3,
      "maxWeight": 42.9
    },
    {
      "name": "蹦蹦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "海神球形�?,
      "height": "1.33~1.9",
      "weight": "75~86",
      "minHeight": 1.33,
      "maxHeight": 1.9,
      "minWeight": 75,
      "maxWeight": 86
    },
    {
      "name": "电咩�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.58~0.83",
      "weight": "7.17~9.1",
      "minHeight": 0.58,
      "maxHeight": 0.83,
      "minWeight": 7.17,
      "maxWeight": 9.1
    },
    {
      "name": "粉咩�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.8~1.14",
      "weight": "15.3~18.6",
      "minHeight": 0.8,
      "maxHeight": 1.14,
      "minWeight": 15.3,
      "maxWeight": 18.6
    },
    {
      "name": "电球咩咩",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.13~1.62",
      "weight": "48.6~58",
      "minHeight": 1.13,
      "maxHeight": 1.62,
      "minWeight": 48.6,
      "maxWeight": 58
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
      "variant": "",
      "height": "0.3~0.5",
      "weight": "0.1~0.6",
      "minHeight": 0.3,
      "maxHeight": 0.5,
      "minWeight": 0.1,
      "maxWeight": 0.6
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
      "variant": "",
      "height": "0.7~1",
      "weight": "0.3~1.35",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 0.3,
      "maxWeight": 1.35
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
      "variant": "",
      "height": "0.44~0.62",
      "weight": "3.3~4.2",
      "minHeight": 0.44,
      "maxHeight": 0.62,
      "minWeight": 3.3,
      "maxWeight": 4.2
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
      "variant": "",
      "height": "1.03~1.47",
      "weight": "9.3~12.5",
      "minHeight": 1.03,
      "maxHeight": 1.47,
      "minWeight": 9.3,
      "maxWeight": 12.5
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
      "variant": "",
      "height": "0.72~1.03",
      "weight": "19.5~23.5",
      "minHeight": 0.72,
      "maxHeight": 1.03,
      "minWeight": 19.5,
      "maxWeight": 23.5
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
      "variant": "",
      "height": "1.2~1.71",
      "weight": "46.5~63.5",
      "minHeight": 1.2,
      "maxHeight": 1.71,
      "minWeight": 46.5,
      "maxWeight": 63.5
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
      "variant": "",
      "height": "1.61~2.31",
      "weight": "124.5~136.5",
      "minHeight": 1.61,
      "maxHeight": 2.31,
      "minWeight": 124.5,
      "maxWeight": 136.5
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
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "本来的样�?,
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "菊花�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.63~0.9",
      "weight": "4.2~5.8",
      "minHeight": 0.63,
      "maxHeight": 0.9,
      "minWeight": 4.2,
      "maxWeight": 5.8
    },
    {
      "name": "小星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "星光能量的样�?,
      "height": "0.78~1.12",
      "weight": "27.5~36.2",
      "minHeight": 0.78,
      "maxHeight": 1.12,
      "minWeight": 27.5,
      "maxWeight": 36.2
    },
    {
      "name": "星光�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "星光能量的样�?,
      "height": "1.08~1.54",
      "weight": "49.5~58.1",
      "minHeight": 1.08,
      "maxHeight": 1.54,
      "minWeight": 49.5,
      "maxWeight": 58.1
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
      "variant": "",
      "height": "0.37~0.52",
      "weight": "4~5.5",
      "minHeight": 0.37,
      "maxHeight": 0.52,
      "minWeight": 4,
      "maxWeight": 5.5
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
      "variant": "",
      "height": "0.81~1.16",
      "weight": "31.7~39.21",
      "minHeight": 0.81,
      "maxHeight": 1.16,
      "minWeight": 31.7,
      "maxWeight": 39.21
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
      "variant": "",
      "height": "0.83~1.19",
      "weight": "61.5~78.4",
      "minHeight": 0.83,
      "maxHeight": 1.19,
      "minWeight": 61.5,
      "maxWeight": 78.4
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
      "variant": "",
      "height": "0.51~0.73",
      "weight": "4.5~7.6",
      "minHeight": 0.51,
      "maxHeight": 0.73,
      "minWeight": 4.5,
      "maxWeight": 7.6
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
      "variant": "",
      "height": "0.72~1.03",
      "weight": "17.6~22.5",
      "minHeight": 0.72,
      "maxHeight": 1.03,
      "minWeight": 17.6,
      "maxWeight": 22.5
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
      "variant": "",
      "height": "1.06~1.51",
      "weight": "46.2~57.5",
      "minHeight": 1.06,
      "maxHeight": 1.51,
      "minWeight": 46.2,
      "maxWeight": 57.5
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
      "variant": "",
      "height": "0.46~0.67",
      "weight": "4.2~5.5",
      "minHeight": 0.46,
      "maxHeight": 0.67,
      "minWeight": 4.2,
      "maxWeight": 5.5
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
      "variant": "",
      "height": "0.88~1.03",
      "weight": "14.08~18.1",
      "minHeight": 0.88,
      "maxHeight": 1.03,
      "minWeight": 14.08,
      "maxWeight": 18.1
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
      "variant": "",
      "height": "1.2~1.34",
      "weight": "19.05~25.04",
      "minHeight": 1.2,
      "maxHeight": 1.34,
      "minWeight": 19.05,
      "maxWeight": 25.04
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
      "variant": "",
      "height": "1.25~1.4",
      "weight": "20.5~28.06",
      "minHeight": 1.25,
      "maxHeight": 1.4,
      "minWeight": 20.5,
      "maxWeight": 28.06
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
      "variant": "",
      "height": "1.09~1.56",
      "weight": "51.3~65.8",
      "minHeight": 1.09,
      "maxHeight": 1.56,
      "minWeight": 51.3,
      "maxWeight": 65.8
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
      "variant": "",
      "height": "0.71~1.01",
      "weight": "9.3~10.3",
      "minHeight": 0.71,
      "maxHeight": 1.01,
      "minWeight": 9.3,
      "maxWeight": 10.3
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
      "variant": "",
      "height": "0.74~1.05",
      "weight": "29~34",
      "minHeight": 0.74,
      "maxHeight": 1.05,
      "minWeight": 29,
      "maxWeight": 34
    },
    {
      "name": "记忆�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "大地�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.97~1.39",
      "weight": "90.2~112",
      "minHeight": 0.97,
      "maxHeight": 1.39,
      "minWeight": 90.2,
      "maxWeight": 112
    },
    {
      "name": "咔咔羽毛",
      "type1": "�?,
      "type2": "普�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.62~0.89",
      "weight": "2.62~3.9",
      "minHeight": 0.62,
      "maxHeight": 0.89,
      "minWeight": 2.62,
      "maxWeight": 3.9
    },
    {
      "name": "咔咔雀",
      "type1": "�?,
      "type2": "普�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.66~0.95",
      "weight": "13.8~18.5",
      "minHeight": 0.66,
      "maxHeight": 0.95,
      "minWeight": 13.8,
      "maxWeight": 18.5
    },
    {
      "name": "咔咔�?,
      "type1": "�?,
      "type2": "普�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.7~1",
      "weight": "27.5~33.72",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 27.5,
      "maxWeight": 33.72
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
      "variant": "",
      "height": "0.47~0.67",
      "weight": "2.1~3.4",
      "minHeight": 0.47,
      "maxHeight": 0.67,
      "minWeight": 2.1,
      "maxWeight": 3.4
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
      "variant": "",
      "height": "0.6~0.87",
      "weight": "7.2~8.6",
      "minHeight": 0.6,
      "maxHeight": 0.87,
      "minWeight": 7.2,
      "maxWeight": 8.6
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
      "variant": "",
      "height": "0.92~1.32",
      "weight": "19.6~23.4",
      "minHeight": 0.92,
      "maxHeight": 1.32,
      "minWeight": 19.6,
      "maxWeight": 23.4
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
      "variant": "",
      "height": "0.49~0.61",
      "weight": "3.6~4.8",
      "minHeight": 0.49,
      "maxHeight": 0.61,
      "minWeight": 3.6,
      "maxWeight": 4.8
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
      "variant": "",
      "height": "0.78~1.12",
      "weight": "8.85~13.8",
      "minHeight": 0.78,
      "maxHeight": 1.12,
      "minWeight": 8.85,
      "maxWeight": 13.8
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
      "variant": "",
      "height": "0.91~1.31",
      "weight": "19.8~24.5",
      "minHeight": 0.91,
      "maxHeight": 1.31,
      "minWeight": 19.8,
      "maxWeight": 24.5
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
      "variant": "",
      "height": "0.57~0.79",
      "weight": "38.5~49.2",
      "minHeight": 0.57,
      "maxHeight": 0.79,
      "minWeight": 38.5,
      "maxWeight": 49.2
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
      "variant": "",
      "height": "0.78~1.12",
      "weight": "94.2~143",
      "minHeight": 0.78,
      "maxHeight": 1.12,
      "minWeight": 94.2,
      "maxWeight": 143
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
      "variant": "",
      "height": "1.48~2.12",
      "weight": "290~305",
      "minHeight": 1.48,
      "maxHeight": 2.12,
      "minWeight": 290,
      "maxWeight": 305
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
      "variant": "",
      "height": "0.41~0.59",
      "weight": "13.07~16.8",
      "minHeight": 0.41,
      "maxHeight": 0.59,
      "minWeight": 13.07,
      "maxWeight": 16.8
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
      "variant": "",
      "height": "0.81~1.16",
      "weight": "34.82~48.6",
      "minHeight": 0.81,
      "maxHeight": 1.16,
      "minWeight": 34.82,
      "maxWeight": 48.6
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
      "variant": "",
      "height": "1.18~1.68",
      "weight": "80.5~96.5",
      "minHeight": 1.18,
      "maxHeight": 1.68,
      "minWeight": 80.5,
      "maxWeight": 96.5
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
      "variant": "",
      "height": "0.35~0.5",
      "weight": "61~75",
      "minHeight": 0.35,
      "maxHeight": 0.5,
      "minWeight": 61,
      "maxWeight": 75
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
      "variant": "",
      "height": "1.95~2.3",
      "weight": "205~240",
      "minHeight": 1.95,
      "maxHeight": 2.3,
      "minWeight": 205,
      "maxWeight": 240
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
      "variant": "",
      "height": "0.45~0.58",
      "weight": "19.05~35.05",
      "minHeight": 0.45,
      "maxHeight": 0.58,
      "minWeight": 19.05,
      "maxWeight": 35.05
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
      "variant": "",
      "height": "0.84~1.21",
      "weight": "72~87.5",
      "minHeight": 0.84,
      "maxHeight": 1.21,
      "minWeight": 72,
      "maxWeight": 87.5
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
      "variant": "",
      "height": "1.44~1.79",
      "weight": "198.05~253.07",
      "minHeight": 1.44,
      "maxHeight": 1.79,
      "minWeight": 198.05,
      "maxWeight": 253.07
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
      "variant": "",
      "height": "0.98~1.41",
      "weight": "41.5~55.6",
      "minHeight": 0.98,
      "maxHeight": 1.41,
      "minWeight": 41.5,
      "maxWeight": 55.6
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
      "variant": "",
      "height": "1.35~1.93",
      "weight": "94.5~105",
      "minHeight": 1.35,
      "maxHeight": 1.93,
      "minWeight": 94.5,
      "maxWeight": 105
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
      "variant": "金黄的样�?,
      "height": "0.1~0.15",
      "weight": "0.1~0.85",
      "minHeight": 0.1,
      "maxHeight": 0.15,
      "minWeight": 0.1,
      "maxWeight": 0.85
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
      "variant": "金黄的样�?,
      "height": "0.53~0.76",
      "weight": "0.65~1.68",
      "minHeight": 0.53,
      "maxHeight": 0.76,
      "minWeight": 0.65,
      "maxWeight": 1.68
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
      "variant": "金黄的样�?,
      "height": "0.6~0.7",
      "weight": "1.45~3.43",
      "minHeight": 0.6,
      "maxHeight": 0.7,
      "minWeight": 1.45,
      "maxWeight": 3.43
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
      "variant": "",
      "height": "0.55~0.65",
      "weight": "3.1~4.5",
      "minHeight": 0.55,
      "maxHeight": 0.65,
      "minWeight": 3.1,
      "maxWeight": 4.5
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
      "variant": "",
      "height": "0.85~0.97",
      "weight": "8.1~9.5",
      "minHeight": 0.85,
      "maxHeight": 0.97,
      "minWeight": 8.1,
      "maxWeight": 9.5
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
      "variant": "",
      "height": "0.76~1.09",
      "weight": "8.3~9.8",
      "minHeight": 0.76,
      "maxHeight": 1.09,
      "minWeight": 8.3,
      "maxWeight": 9.8
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
      "variant": "",
      "height": "1.11~1.59",
      "weight": "23.5~37.5",
      "minHeight": 1.11,
      "maxHeight": 1.59,
      "minWeight": 23.5,
      "maxWeight": 37.5
    },
    {
      "name": "多多",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.45~0.65",
      "weight": "14.6~18.6",
      "minHeight": 0.45,
      "maxHeight": 0.65,
      "minWeight": 14.6,
      "maxWeight": 18.6
    },
    {
      "name": "多啦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.58~0.83",
      "weight": "28.5~34.6",
      "minHeight": 0.58,
      "maxHeight": 0.83,
      "minWeight": 28.5,
      "maxWeight": 34.6
    },
    {
      "name": "古啦�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "拟人�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.69~0.99",
      "weight": "43.5~58.6",
      "minHeight": 0.69,
      "maxHeight": 0.99,
      "minWeight": 43.5,
      "maxWeight": 58.6
    },
    {
      "name": "哭哭�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.33~0.47",
      "weight": "1.8~3.2",
      "minHeight": 0.33,
      "maxHeight": 0.47,
      "minWeight": 1.8,
      "maxWeight": 3.2
    },
    {
      "name": "怖须�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.69~0.99",
      "weight": "8.72~15.6",
      "minHeight": 0.69,
      "maxHeight": 0.99,
      "minWeight": 8.72,
      "maxWeight": 15.6
    },
    {
      "name": "怖哭�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.23~1.76",
      "weight": "22.5~28.6",
      "minHeight": 1.23,
      "maxHeight": 1.76,
      "minWeight": 22.5,
      "maxWeight": 28.6
    },
    {
      "name": "恶魔�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.23~1.76",
      "weight": "74~92",
      "minHeight": 1.23,
      "maxHeight": 1.76,
      "minWeight": 74,
      "maxWeight": 92
    },
    {
      "name": "小电企鹅",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.44~0.56",
      "weight": "3.82~5.39",
      "minHeight": 0.44,
      "maxHeight": 0.56,
      "minWeight": 3.82,
      "maxWeight": 5.39
    },
    {
      "name": "电企�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.9~1.14",
      "weight": "14.6~26.9",
      "minHeight": 0.9,
      "maxHeight": 1.14,
      "minWeight": 14.6,
      "maxWeight": 26.9
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
      "variant": "",
      "height": "0.86~1.23",
      "weight": "9.5~12.5",
      "minHeight": 0.86,
      "maxHeight": 1.23,
      "minWeight": 9.5,
      "maxWeight": 12.5
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
      "variant": "",
      "height": "1.11~1.59",
      "weight": "59~76",
      "minHeight": 1.11,
      "maxHeight": 1.59,
      "minWeight": 59,
      "maxWeight": 76
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
      "variant": "",
      "height": "1.61~2.31",
      "weight": "156~187",
      "minHeight": 1.61,
      "maxHeight": 2.31,
      "minWeight": 156,
      "maxWeight": 187
    },
    {
      "name": "呼呼�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.52~0.75",
      "weight": "6.8~8.9",
      "minHeight": 0.52,
      "maxHeight": 0.75,
      "minWeight": 6.8,
      "maxWeight": 8.9
    },
    {
      "name": "獠牙�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.77~1.1",
      "weight": "52.8~67.4",
      "minHeight": 0.77,
      "maxHeight": 1.1,
      "minWeight": 52.8,
      "maxWeight": 67.4
    },
    {
      "name": "雪娃�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.29~0.42",
      "weight": "6.8~8.16",
      "minHeight": 0.29,
      "maxHeight": 0.42,
      "minWeight": 6.8,
      "maxWeight": 8.16
    },
    {
      "name": "冰封怨灵",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.96~1.37",
      "weight": "24.5~31.6",
      "minHeight": 0.96,
      "maxHeight": 1.37,
      "minWeight": 24.5,
      "maxWeight": 31.6
    },
    {
      "name": "雪灵",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.09~1.56",
      "weight": "56.4~68.4",
      "minHeight": 1.09,
      "maxHeight": 1.56,
      "minWeight": 56.4,
      "maxWeight": 68.4
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
      "variant": "",
      "height": "0.39~0.42",
      "weight": "8.39~10.7",
      "minHeight": 0.39,
      "maxHeight": 0.42,
      "minWeight": 8.39,
      "maxWeight": 10.7
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
      "variant": "",
      "height": "0.4~0.57",
      "weight": "19.05~26.8",
      "minHeight": 0.4,
      "maxHeight": 0.57,
      "minWeight": 19.05,
      "maxWeight": 26.8
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
      "variant": "",
      "height": "0.64~0.92",
      "weight": "31.8~36.6",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 31.8,
      "maxWeight": 36.6
    },
    {
      "name": "权杖-�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.45~0.55",
      "weight": "28.5~35.7",
      "minHeight": 0.45,
      "maxHeight": 0.55,
      "minWeight": 28.5,
      "maxWeight": 35.7
    },
    {
      "name": "权杖-�?,
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "灵狐",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.56~0.8",
      "weight": "7.4~8.9",
      "minHeight": 0.56,
      "maxHeight": 0.8,
      "minWeight": 7.4,
      "maxWeight": 8.9
    },
    {
      "name": "九尾�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.77~1.11",
      "weight": "13.08~21.05",
      "minHeight": 0.77,
      "maxHeight": 1.11,
      "minWeight": 13.08,
      "maxWeight": 21.05
    },
    {
      "name": "尖嘴狐仙",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.34~1.92",
      "weight": "69.5~78.5",
      "minHeight": 1.34,
      "maxHeight": 1.92,
      "minWeight": 69.5,
      "maxWeight": 78.5
    },
    {
      "name": "里奥",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.35~0.45",
      "weight": "4.8~5.9",
      "minHeight": 0.35,
      "maxHeight": 0.45,
      "minWeight": 4.8,
      "maxWeight": 5.9
    },
    {
      "name": "灵羽勇士",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.55~0.65",
      "weight": "11.5~14.2",
      "minHeight": 0.55,
      "maxHeight": 0.65,
      "minWeight": 11.5,
      "maxWeight": 14.2
    },
    {
      "name": "圣羽翼王",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "2.1~2.55",
      "weight": "195~296",
      "minHeight": 2.1,
      "maxHeight": 2.55,
      "minWeight": 195,
      "maxWeight": 296
    },
    {
      "name": "松仔",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.52~0.68",
      "weight": "6.25~7.85",
      "minHeight": 0.52,
      "maxHeight": 0.68,
      "minWeight": 6.25,
      "maxWeight": 7.85
    },
    {
      "name": "松叶�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.08~1.33",
      "weight": "19.09~28.06",
      "minHeight": 1.08,
      "maxHeight": 1.33,
      "minWeight": 19.09,
      "maxWeight": 28.06
    },
    {
      "name": "针叶巡林",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.86~2.14",
      "weight": "56.8~69.02",
      "minHeight": 1.86,
      "maxHeight": 2.14,
      "minWeight": 56.8,
      "maxWeight": 69.02
    },
    {
      "name": "小勇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.67~0.81",
      "weight": "8.5~12.05",
      "minHeight": 0.67,
      "maxHeight": 0.81,
      "minWeight": 8.5,
      "maxWeight": 12.05
    },
    {
      "name": "炽焰�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.12~1.45",
      "weight": "46.02~67.05",
      "minHeight": 1.12,
      "maxHeight": 1.45,
      "minWeight": 46.02,
      "maxWeight": 67.05
    },
    {
      "name": "炽心勇狮",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.78~1.97",
      "weight": "94.7~118.05",
      "minHeight": 1.78,
      "maxHeight": 1.97,
      "minWeight": 94.7,
      "maxWeight": 118.05
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
      "variant": "",
      "height": "0.53~0.69",
      "weight": "2.25~4.1",
      "minHeight": 0.53,
      "maxHeight": 0.69,
      "minWeight": 2.25,
      "maxWeight": 4.1
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
      "variant": "",
      "height": "0.94~1.2",
      "weight": "18.07~27.05",
      "minHeight": 0.94,
      "maxHeight": 1.2,
      "minWeight": 18.07,
      "maxWeight": 27.05
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
      "variant": "",
      "height": "2.15~3",
      "weight": "71.05~86.05",
      "minHeight": 2.15,
      "maxHeight": 3,
      "minWeight": 71.05,
      "maxWeight": 86.05
    },
    {
      "name": "公平�?,
      "type1": "普�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.45~0.6",
      "weight": "2.5~3.94",
      "minHeight": 0.45,
      "maxHeight": 0.6,
      "minWeight": 2.5,
      "maxWeight": 3.94
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
      "variant": "",
      "height": "0.59~0.84",
      "weight": "19.6~22.5",
      "minHeight": 0.59,
      "maxHeight": 0.84,
      "minWeight": 19.6,
      "maxWeight": 22.5
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
      "variant": "",
      "height": "1.3~1.65",
      "weight": "64.5~78.5",
      "minHeight": 1.3,
      "maxHeight": 1.65,
      "minWeight": 64.5,
      "maxWeight": 78.5
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
      "variant": "崖间地的样子",
      "height": "0.71~1.02",
      "weight": "11.5~17.5",
      "minHeight": 0.71,
      "maxHeight": 1.02,
      "minWeight": 11.5,
      "maxWeight": 17.5
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
      "variant": "崖间地的样子",
      "height": "1.01~1.44",
      "weight": "49.5~56.8",
      "minHeight": 1.01,
      "maxHeight": 1.44,
      "minWeight": 49.5,
      "maxWeight": 56.8
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
      "variant": "崖间地的样子",
      "height": "1.72~2.45",
      "weight": "125~170.5",
      "minHeight": 1.72,
      "maxHeight": 2.45,
      "minWeight": 125,
      "maxWeight": 170.5
    },
    {
      "name": "圆眼蜘蛛",
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.48~0.68",
      "weight": "3.5~5",
      "minHeight": 0.48,
      "maxHeight": 0.68,
      "minWeight": 3.5,
      "maxWeight": 5
    },
    {
      "name": "尖角蜘蛛",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.68~0.98",
      "weight": "7.75~9.6",
      "minHeight": 0.68,
      "maxHeight": 0.98,
      "minWeight": 7.75,
      "maxWeight": 9.6
    },
    {
      "name": "芋香巨角�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.9~1.29",
      "weight": "31.75~43.6",
      "minHeight": 0.9,
      "maxHeight": 1.29,
      "minWeight": 31.75,
      "maxWeight": 43.6
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
      "variant": "",
      "height": "0.32~0.42",
      "weight": "4.85~5.65",
      "minHeight": 0.32,
      "maxHeight": 0.42,
      "minWeight": 4.85,
      "maxWeight": 5.65
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
      "variant": "",
      "height": "0.68~0.82",
      "weight": "46.5~69.9",
      "minHeight": 0.68,
      "maxHeight": 0.82,
      "minWeight": 46.5,
      "maxWeight": 69.9
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
      "variant": "",
      "height": "1.2~1.6",
      "weight": "86.8~113",
      "minHeight": 1.2,
      "maxHeight": 1.6,
      "minWeight": 86.8,
      "maxWeight": 113
    },
    {
      "name": "菇菇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.25~0.35",
      "weight": "1.1~2.76",
      "minHeight": 0.25,
      "maxHeight": 0.35,
      "minWeight": 1.1,
      "maxWeight": 2.76
    },
    {
      "name": "多菇�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.6~0.7",
      "weight": "5.4~6.8",
      "minHeight": 0.6,
      "maxHeight": 0.7,
      "minWeight": 5.4,
      "maxWeight": 6.8
    },
    {
      "name": "九幽�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "植物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.55~1.65",
      "weight": "42~58",
      "minHeight": 1.55,
      "maxHeight": 1.65,
      "minWeight": 42,
      "maxWeight": 58
    },
    {
      "name": "斑斑",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.47~0.6",
      "weight": "4.79~6.17",
      "minHeight": 0.47,
      "maxHeight": 0.6,
      "minWeight": 4.79,
      "maxWeight": 6.17
    },
    {
      "name": "斑枭",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.68~0.81",
      "weight": "15.9~23.8",
      "minHeight": 0.68,
      "maxHeight": 0.81,
      "minWeight": 15.9,
      "maxWeight": 23.8
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
      "variant": "",
      "height": "0.5~0.72",
      "weight": "4.9~6.57",
      "minHeight": 0.5,
      "maxHeight": 0.72,
      "minWeight": 4.9,
      "maxWeight": 6.57
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
      "variant": "",
      "height": "0.9~1.29",
      "weight": "35.8~48.06",
      "minHeight": 0.9,
      "maxHeight": 1.29,
      "minWeight": 35.8,
      "maxWeight": 48.06
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
      "variant": "",
      "height": "0.64~0.92",
      "weight": "69.5~87.6",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 69.5,
      "maxWeight": 87.6
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
      "variant": "",
      "height": "1.26~1.8",
      "weight": "145~165",
      "minHeight": 1.26,
      "maxHeight": 1.8,
      "minWeight": 145,
      "maxWeight": 165
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
      "variant": "",
      "height": "0.31~0.42",
      "weight": "3.9~5.25",
      "minHeight": 0.31,
      "maxHeight": 0.42,
      "minWeight": 3.9,
      "maxWeight": 5.25
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
      "variant": "",
      "height": "0.79~0.98",
      "weight": "10.9~15.8",
      "minHeight": 0.79,
      "maxHeight": 0.98,
      "minWeight": 10.9,
      "maxWeight": 15.8
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
      "variant": "",
      "height": "0.41~0.58",
      "weight": "7.5~9.4",
      "minHeight": 0.41,
      "maxHeight": 0.58,
      "minWeight": 7.5,
      "maxWeight": 9.4
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
      "variant": "",
      "height": "0.68~0.97",
      "weight": "11.05~19.04",
      "minHeight": 0.68,
      "maxHeight": 0.97,
      "minWeight": 11.05,
      "maxWeight": 19.04
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
      "variant": "",
      "height": "0.7~1",
      "weight": "21.4~25.6",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 21.4,
      "maxWeight": 25.6
    },
    {
      "name": "棋棋",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子",
      "height": "0.35~0.47",
      "weight": "10.7~14.5",
      "minHeight": 0.35,
      "maxHeight": 0.47,
      "minWeight": 10.7,
      "maxWeight": 14.5
    },
    {
      "name": "棋骑�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子",
      "height": "0.98~1.35",
      "weight": "43.06~60.09",
      "minHeight": 0.98,
      "maxHeight": 1.35,
      "minWeight": 43.06,
      "maxWeight": 60.09
    },
    {
      "name": "棋齐�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子",
      "height": "1.45~1.71",
      "weight": "58.01~70.05",
      "minHeight": 1.45,
      "maxHeight": 1.71,
      "minWeight": 58.01,
      "maxWeight": 70.05
    },
    {
      "name": "棋祈�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子",
      "height": "0.98~1.35",
      "weight": "38.07~47.05",
      "minHeight": 0.98,
      "maxHeight": 1.35,
      "minWeight": 38.07,
      "maxWeight": 47.05
    },
    {
      "name": "棋绮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "妖精�?
      ],
      "hasShiny": false,
      "variant": "白子",
      "height": "1.66~1.81",
      "weight": "30.01~41.02",
      "minHeight": 1.66,
      "maxHeight": 1.81,
      "minWeight": 30.01,
      "maxWeight": 41.02
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
      "variant": "",
      "height": "0.46~0.6",
      "weight": "3.71~6.4",
      "minHeight": 0.46,
      "maxHeight": 0.6,
      "minWeight": 3.71,
      "maxWeight": 6.4
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
      "variant": "",
      "height": "0.88~1.23",
      "weight": "59.6~74.3",
      "minHeight": 0.88,
      "maxHeight": 1.23,
      "minWeight": 59.6,
      "maxWeight": 74.3
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
      "variant": "",
      "height": "0.58~0.83",
      "weight": "4.5~5.8",
      "minHeight": 0.58,
      "maxHeight": 0.83,
      "minWeight": 4.5,
      "maxWeight": 5.8
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
      "variant": "",
      "height": "0.69~0.99",
      "weight": "7.4~9.1",
      "minHeight": 0.69,
      "maxHeight": 0.99,
      "minWeight": 7.4,
      "maxWeight": 9.1
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
      "variant": "",
      "height": "0.89~1.27",
      "weight": "15.5~21.6",
      "minHeight": 0.89,
      "maxHeight": 1.27,
      "minWeight": 15.5,
      "maxWeight": 21.6
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
      "variant": "",
      "height": "0.3~0.4",
      "weight": "0.45~1.53",
      "minHeight": 0.3,
      "maxHeight": 0.4,
      "minWeight": 0.45,
      "maxWeight": 1.53
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
      "variant": "",
      "height": "0.41~0.59",
      "weight": "0.95~2.15",
      "minHeight": 0.41,
      "maxHeight": 0.59,
      "minWeight": 0.95,
      "maxWeight": 2.15
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
      "variant": "",
      "height": "1.18~1.45",
      "weight": "12.04~19.04",
      "minHeight": 1.18,
      "maxHeight": 1.45,
      "minWeight": 12.04,
      "maxWeight": 19.04
    },
    {
      "name": "花怨鳗",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.58~0.68",
      "weight": "2.9~4",
      "minHeight": 0.58,
      "maxHeight": 0.68,
      "minWeight": 2.9,
      "maxWeight": 4
    },
    {
      "name": "鳗尾�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.79~0.92",
      "weight": "19.8~36.5",
      "minHeight": 0.79,
      "maxHeight": 0.92,
      "minWeight": 19.8,
      "maxWeight": 36.5
    },
    {
      "name": "伊雷�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.72~0.94",
      "weight": "27.2~34",
      "minHeight": 0.72,
      "maxHeight": 0.94,
      "minWeight": 27.2,
      "maxWeight": 34
    },
    {
      "name": "伊兰亚龙",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨龙�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
    },
    {
      "name": "拉特",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.49~0.61",
      "weight": "7.7~8.6",
      "minHeight": 0.49,
      "maxHeight": 0.61,
      "minWeight": 7.7,
      "maxWeight": 8.6
    },
    {
      "name": "酷拉",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.99~1.24",
      "weight": "19.5~23.5",
      "minHeight": 0.99,
      "maxHeight": 1.24,
      "minWeight": 19.5,
      "maxWeight": 23.5
    },
    {
      "name": "闪电�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.37~0.46",
      "weight": "2.4~3.1",
      "minHeight": 0.37,
      "maxHeight": 0.46,
      "minWeight": 2.4,
      "maxWeight": 3.1
    },
    {
      "name": "刺电�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.58~0.73",
      "weight": "10.16~16.74",
      "minHeight": 0.58,
      "maxHeight": 0.73,
      "minWeight": 10.16,
      "maxWeight": 16.74
    },
    {
      "name": "荆棘电环",
      "type1": "�?,
      "type2": "",
      "group": [
        "魔力�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.78~0.98",
      "weight": "29.5~34.3",
      "minHeight": 0.78,
      "maxHeight": 0.98,
      "minWeight": 29.5,
      "maxWeight": 34.3
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
      "variant": "",
      "height": "0.34~0.46",
      "weight": "4.45~6.81",
      "minHeight": 0.34,
      "maxHeight": 0.46,
      "minWeight": 4.45,
      "maxWeight": 6.81
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
      "variant": "",
      "height": "0.64~0.72",
      "weight": "18.02~24.4",
      "minHeight": 0.64,
      "maxHeight": 0.72,
      "minWeight": 18.02,
      "maxWeight": 24.4
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
      "variant": "本来的样�?,
      "height": "0.95~1.1",
      "weight": "6.9~7.8",
      "minHeight": 0.95,
      "maxHeight": 1.1,
      "minWeight": 6.9,
      "maxWeight": 7.8
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
      "variant": "本来的样�?,
      "height": "1.85~2",
      "weight": "65~78",
      "minHeight": 1.85,
      "maxHeight": 2,
      "minWeight": 65,
      "maxWeight": 78
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
      "variant": "",
      "height": "0.28~0.44",
      "weight": "3.3~4.2",
      "minHeight": 0.28,
      "maxHeight": 0.44,
      "minWeight": 3.3,
      "maxWeight": 4.2
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
      "variant": "",
      "height": "1.32~1.55",
      "weight": "42.5~62",
      "minHeight": 1.32,
      "maxHeight": 1.55,
      "minWeight": 42.5,
      "maxWeight": 62
    },
    {
      "name": "火尾瓦特",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.64~0.92",
      "weight": "18.5~21.2",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 18.5,
      "maxWeight": 21.2
    },
    {
      "name": "火尾战士",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.76~1.09",
      "weight": "48.5~58.6",
      "minHeight": 0.76,
      "maxHeight": 1.09,
      "minWeight": 48.5,
      "maxWeight": 58.6
    },
    {
      "name": "烈火守护",
      "type1": "�?,
      "type2": "",
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.99~1.42",
      "weight": "76.5~87.5",
      "minHeight": 0.99,
      "maxHeight": 1.42,
      "minWeight": 76.5,
      "maxWeight": 87.5
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
      "variant": "",
      "height": "0.94~1.1",
      "weight": "38.6~49.5",
      "minHeight": 0.94,
      "maxHeight": 1.1,
      "minWeight": 38.6,
      "maxWeight": 49.5
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
      "variant": "碧蓝珊瑚",
      "height": "0.75~0.85",
      "weight": "3.51~6.82",
      "minHeight": 0.75,
      "maxHeight": 0.85,
      "minWeight": 3.51,
      "maxWeight": 6.82
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
      "variant": "",
      "height": "0.65~0.94",
      "weight": "5.7~7.1",
      "minHeight": 0.65,
      "maxHeight": 0.94,
      "minWeight": 5.7,
      "maxWeight": 7.1
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
      "variant": "",
      "height": "0.99~1.42",
      "weight": "115.8~175.02",
      "minHeight": 0.99,
      "maxHeight": 1.42,
      "minWeight": 115.8,
      "maxWeight": 175.02
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
      "variant": "",
      "height": "1.43~2.05",
      "weight": "265~295",
      "minHeight": 1.43,
      "maxHeight": 2.05,
      "minWeight": 265,
      "maxWeight": 295
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
      "variant": "",
      "height": "0.61~0.87",
      "weight": "25.1~36.5",
      "minHeight": 0.61,
      "maxHeight": 0.87,
      "minWeight": 25.1,
      "maxWeight": 36.5
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
      "variant": "",
      "height": "1.79~1.99",
      "weight": "240~265",
      "minHeight": 1.79,
      "maxHeight": 1.99,
      "minWeight": 240,
      "maxWeight": 265
    },
    {
      "name": "电动长颈�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.7~1",
      "weight": "29.8~36.8",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 29.8,
      "maxWeight": 36.8
    },
    {
      "name": "奔乐�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.85~1.22",
      "weight": "68~77.5",
      "minHeight": 0.85,
      "maxHeight": 1.22,
      "minWeight": 68,
      "maxWeight": 77.5
    },
    {
      "name": "爵士�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.38~1.98",
      "weight": "135~185.06",
      "minHeight": 1.38,
      "maxHeight": 1.98,
      "minWeight": 135,
      "maxWeight": 185.06
    },
    {
      "name": "缇塔",
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.65~0.75",
      "weight": "38.2~45.2",
      "minHeight": 0.65,
      "maxHeight": 0.75,
      "minWeight": 38.2,
      "maxWeight": 45.2
    },
    {
      "name": "声波缇塔",
      "type1": "机械",
      "type2": "",
      "group": [
        "机械�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.05~1.2",
      "weight": "71.5~78.5",
      "minHeight": 1.05,
      "maxHeight": 1.2,
      "minWeight": 71.5,
      "maxWeight": 78.5
    },
    {
      "name": "小鹬",
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.25~0.36",
      "weight": "1.4~2.2",
      "minHeight": 0.25,
      "maxHeight": 0.36,
      "minWeight": 1.4,
      "maxWeight": 2.2
    },
    {
      "name": "鄙目�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.67~0.96",
      "weight": "6.75~8.9",
      "minHeight": 0.67,
      "maxHeight": 0.96,
      "minWeight": 6.75,
      "maxWeight": 8.9
    },
    {
      "name": "高脚�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "天空�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.81~1.16",
      "weight": "18~24.91",
      "minHeight": 0.81,
      "maxHeight": 1.16,
      "minWeight": 18,
      "maxWeight": 24.91
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
      "variant": "",
      "height": "0.3~0.4",
      "weight": "1.8~3.8",
      "minHeight": 0.3,
      "maxHeight": 0.4,
      "minWeight": 1.8,
      "maxWeight": 3.8
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
      "variant": "",
      "height": "0.4~0.6",
      "weight": "5.15~7.8",
      "minHeight": 0.4,
      "maxHeight": 0.6,
      "minWeight": 5.15,
      "maxWeight": 7.8
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
      "variant": "",
      "height": "0.7~1",
      "weight": "16.5~22.75",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 16.5,
      "maxWeight": 22.75
    },
    {
      "name": "刺轮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "上弦的样�?,
      "height": "0.18~0.31",
      "weight": "2.7~4",
      "minHeight": 0.18,
      "maxHeight": 0.31,
      "minWeight": 2.7,
      "maxWeight": 4
    },
    {
      "name": "月亮�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "上弦的样�?,
      "height": "1.85~2.1",
      "weight": "137.5~182.4",
      "minHeight": 1.85,
      "maxHeight": 2.1,
      "minWeight": 137.5,
      "maxWeight": 182.4
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
      "variant": "",
      "height": "0.31~0.44",
      "weight": "1.2~3.4",
      "minHeight": 0.31,
      "maxHeight": 0.44,
      "minWeight": 1.2,
      "maxWeight": 3.4
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
      "variant": "",
      "height": "0.27~0.39",
      "weight": "14.5~16.8",
      "minHeight": 0.27,
      "maxHeight": 0.39,
      "minWeight": 14.5,
      "maxWeight": 16.8
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
      "variant": "",
      "height": "0.69~0.99",
      "weight": "39.5~44.5",
      "minHeight": 0.69,
      "maxHeight": 0.99,
      "minWeight": 39.5,
      "maxWeight": 44.5
    },
    {
      "name": "胆小鳗鱼",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.74~1.07",
      "weight": "17.5~26.85",
      "minHeight": 0.74,
      "maxHeight": 1.07,
      "minWeight": 17.5,
      "maxWeight": 26.85
    },
    {
      "name": "闪电鳗鱼",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.83~1.19",
      "weight": "68.9~76.5",
      "minHeight": 0.83,
      "maxHeight": 1.19,
      "minWeight": 68.9,
      "maxWeight": 76.5
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
      "variant": "",
      "height": "0.49~0.7",
      "weight": "31.5~36.8",
      "minHeight": 0.49,
      "maxHeight": 0.7,
      "minWeight": 31.5,
      "maxWeight": 36.8
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
      "variant": "",
      "height": "0.9~1.28",
      "weight": "48~53",
      "minHeight": 0.9,
      "maxHeight": 1.28,
      "minWeight": 48,
      "maxWeight": 53
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
      "variant": "",
      "height": "0.7~1",
      "weight": "7.5~12.5",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 7.5,
      "maxWeight": 12.5
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
      "variant": "",
      "height": "0.81~1.16",
      "weight": "14.07~18.02",
      "minHeight": 0.81,
      "maxHeight": 1.16,
      "minWeight": 14.07,
      "maxWeight": 18.02
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
      "variant": "",
      "height": "1.25~1.79",
      "weight": "49.5~58.6",
      "minHeight": 1.25,
      "maxHeight": 1.79,
      "minWeight": 49.5,
      "maxWeight": 58.6
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
      "variant": "",
      "height": "0.69~0.98",
      "weight": "21~31.5",
      "minHeight": 0.69,
      "maxHeight": 0.98,
      "minWeight": 21,
      "maxWeight": 31.5
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
      "variant": "",
      "height": "0.71~1.02",
      "weight": "46.5~63.5",
      "minHeight": 0.71,
      "maxHeight": 1.02,
      "minWeight": 46.5,
      "maxWeight": 63.5
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
      "variant": "",
      "height": "1.68~1.9",
      "weight": "124.5~136.5",
      "minHeight": 1.68,
      "maxHeight": 1.9,
      "minWeight": 124.5,
      "maxWeight": 136.5
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
      "variant": "",
      "height": "0.53~0.76",
      "weight": "2.4~4.6",
      "minHeight": 0.53,
      "maxHeight": 0.76,
      "minWeight": 2.4,
      "maxWeight": 4.6
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
      "variant": "",
      "height": "0.58~0.83",
      "weight": "12.8~15.6",
      "minHeight": 0.58,
      "maxHeight": 0.83,
      "minWeight": 12.8,
      "maxWeight": 15.6
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
      "variant": "",
      "height": "1.21~1.72",
      "weight": "49.5~58.6",
      "minHeight": 1.21,
      "maxHeight": 1.72,
      "minWeight": 49.5,
      "maxWeight": 58.6
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
      "variant": "",
      "height": "0.57~0.82",
      "weight": "12.03~14.42",
      "minHeight": 0.57,
      "maxHeight": 0.82,
      "minWeight": 12.03,
      "maxWeight": 14.42
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
      "variant": "",
      "height": "0.68~0.97",
      "weight": "22.4~28.6",
      "minHeight": 0.68,
      "maxHeight": 0.97,
      "minWeight": 22.4,
      "maxWeight": 28.6
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
      "variant": "",
      "height": "1.04~1.49",
      "weight": "32.5~36.8",
      "minHeight": 1.04,
      "maxHeight": 1.49,
      "minWeight": 32.5,
      "maxWeight": 36.8
    },
    {
      "name": "乌达",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "极昼的样�?,
      "height": "0.44~0.58",
      "weight": "4.6~6.1",
      "minHeight": 0.44,
      "maxHeight": 0.58,
      "minWeight": 4.6,
      "maxWeight": 6.1
    },
    {
      "name": "迷你�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "极昼的样�?,
      "height": "0.97~1.2",
      "weight": "27.9~39.1",
      "minHeight": 0.97,
      "maxHeight": 1.2,
      "minWeight": 27.9,
      "maxWeight": 39.1
    },
    {
      "name": "乌拉�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "巨灵�?
      ],
      "hasShiny": false,
      "variant": "极昼的样�?,
      "height": "1.85~2.1",
      "weight": "48.8~63.29",
      "minHeight": 1.85,
      "maxHeight": 2.1,
      "minWeight": 48.8,
      "maxWeight": 63.29
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
      "variant": "",
      "height": "0.35~0.45",
      "weight": "2.08~4.35",
      "minHeight": 0.35,
      "maxHeight": 0.45,
      "minWeight": 2.08,
      "maxWeight": 4.35
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
      "variant": "",
      "height": "1.05~1.47",
      "weight": "48.7~60.1",
      "minHeight": 1.05,
      "maxHeight": 1.47,
      "minWeight": 48.7,
      "maxWeight": 60.1
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
      "variant": "",
      "height": "0.42~0.6",
      "weight": "8~11",
      "minHeight": 0.42,
      "maxHeight": 0.6,
      "minWeight": 8,
      "maxWeight": 11
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
      "variant": "",
      "height": "0.68~0.97",
      "weight": "23.77~34.6",
      "minHeight": 0.68,
      "maxHeight": 0.97,
      "minWeight": 23.77,
      "maxWeight": 34.6
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
      "variant": "",
      "height": "1.78~2.01",
      "weight": "106.5~139.07",
      "minHeight": 1.78,
      "maxHeight": 2.01,
      "minWeight": 106.5,
      "maxWeight": 139.07
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
      "variant": "",
      "height": "0.39~0.56",
      "weight": "4.6~7.4",
      "minHeight": 0.39,
      "maxHeight": 0.56,
      "minWeight": 4.6,
      "maxWeight": 7.4
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
      "variant": "",
      "height": "0.68~0.91",
      "weight": "12.03~18.06",
      "minHeight": 0.68,
      "maxHeight": 0.91,
      "minWeight": 12.03,
      "maxWeight": 18.06
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
      "variant": "",
      "height": "1.31~1.87",
      "weight": "46.8~58.2",
      "minHeight": 1.31,
      "maxHeight": 1.87,
      "minWeight": 46.8,
      "maxWeight": 58.2
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
      "variant": "",
      "height": "1.46~2.09",
      "weight": "46.8~58.2",
      "minHeight": 1.46,
      "maxHeight": 2.09,
      "minWeight": 46.8,
      "maxWeight": 58.2
    },
    {
      "name": "优优",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.38~0.56",
      "weight": "3.03~4.1",
      "minHeight": 0.38,
      "maxHeight": 0.56,
      "minWeight": 3.03,
      "maxWeight": 4.1
    },
    {
      "name": "绒光优优",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.69~0.85",
      "weight": "13.5~19.6",
      "minHeight": 0.69,
      "maxHeight": 0.85,
      "minWeight": 13.5,
      "maxWeight": 19.6
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
      "variant": "",
      "height": "2~2.15",
      "weight": "89.5~127.5",
      "minHeight": 2,
      "maxHeight": 2.15,
      "minWeight": 89.5,
      "maxWeight": 127.5
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
      "variant": "",
      "height": "2~2.65",
      "weight": "645~700",
      "minHeight": 2,
      "maxHeight": 2.65,
      "minWeight": 645,
      "maxWeight": 700
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
      "variant": "",
      "height": "0.4~0.57",
      "weight": "3.5~5.4",
      "minHeight": 0.4,
      "maxHeight": 0.57,
      "minWeight": 3.5,
      "maxWeight": 5.4
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
      "variant": "",
      "height": "0.48~0.68",
      "weight": "6.5~7.8",
      "minHeight": 0.48,
      "maxHeight": 0.68,
      "minWeight": 6.5,
      "maxWeight": 7.8
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
      "variant": "",
      "height": "0.81~1.16",
      "weight": "12.5~16.5",
      "minHeight": 0.81,
      "maxHeight": 1.16,
      "minWeight": 12.5,
      "maxWeight": 16.5
    },
    {
      "name": "地鼠",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "枯水期的样子",
      "height": "0.46~0.66",
      "weight": "1.8~2.85",
      "minHeight": 0.46,
      "maxHeight": 0.66,
      "minWeight": 1.8,
      "maxWeight": 2.85
    },
    {
      "name": "遁鼠",
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "枯水期的样子",
      "height": "0.48~0.69",
      "weight": "3.4~4.8",
      "minHeight": 0.48,
      "maxHeight": 0.69,
      "minWeight": 3.4,
      "maxWeight": 4.8
    },
    {
      "name": "遁地�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": false,
      "variant": "枯水期的样子",
      "height": "0.64~0.92",
      "weight": "6.4~7.5",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 6.4,
      "maxWeight": 7.5
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
      "variant": "",
      "height": "0.35~0.46",
      "weight": "3.25~5.02",
      "minHeight": 0.35,
      "maxHeight": 0.46,
      "minWeight": 3.25,
      "maxWeight": 5.02
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
      "variant": "",
      "height": "1.36~1.54",
      "weight": "36.9~48.2",
      "minHeight": 1.36,
      "maxHeight": 1.54,
      "minWeight": 36.9,
      "maxWeight": 48.2
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
      "variant": "",
      "height": "1.59~1.72",
      "weight": "45.6~60.1",
      "minHeight": 1.59,
      "maxHeight": 1.72,
      "minWeight": 45.6,
      "maxWeight": 60.1
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
      "variant": "",
      "height": "0.48~0.68",
      "weight": "6.5~8.4",
      "minHeight": 0.48,
      "maxHeight": 0.68,
      "minWeight": 6.5,
      "maxWeight": 8.4
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
      "variant": "",
      "height": "1.17~1.68",
      "weight": "83~96",
      "minHeight": 1.17,
      "maxHeight": 1.68,
      "minWeight": 83,
      "maxWeight": 96
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
      "variant": "",
      "height": "0.94~1.18",
      "weight": "115.7~173.6",
      "minHeight": 0.94,
      "maxHeight": 1.18,
      "minWeight": 115.7,
      "maxWeight": 173.6
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
      "variant": "",
      "height": "1.83~2.07",
      "weight": "481~658",
      "minHeight": 1.83,
      "maxHeight": 2.07,
      "minWeight": 481,
      "maxWeight": 658
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
      "variant": "",
      "height": "0.55~0.71",
      "weight": "9.5~12.5",
      "minHeight": 0.55,
      "maxHeight": 0.71,
      "minWeight": 9.5,
      "maxWeight": 12.5
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
      "variant": "",
      "height": "1.05~1.45",
      "weight": "21.5~32.5",
      "minHeight": 1.05,
      "maxHeight": 1.45,
      "minWeight": 21.5,
      "maxWeight": 32.5
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
      "variant": "",
      "height": "0.85~1",
      "weight": "18.6~33.5",
      "minHeight": 0.85,
      "maxHeight": 1,
      "minWeight": 18.6,
      "maxWeight": 33.5
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
      "variant": "",
      "height": "2.25~2.45",
      "weight": "85.7~105",
      "minHeight": 2.25,
      "maxHeight": 2.45,
      "minWeight": 85.7,
      "maxWeight": 105
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
      "variant": "",
      "height": "0.55~0.65",
      "weight": "8.73~14.92",
      "minHeight": 0.55,
      "maxHeight": 0.65,
      "minWeight": 8.73,
      "maxWeight": 14.92
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
      "variant": "",
      "height": "1.45~1.55",
      "weight": "33.75~41.6",
      "minHeight": 1.45,
      "maxHeight": 1.55,
      "minWeight": 33.75,
      "maxWeight": 41.6
    },
    {
      "name": "小帕�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.64~0.92",
      "weight": "9.4~13.6",
      "minHeight": 0.64,
      "maxHeight": 0.92,
      "minWeight": 9.4,
      "maxWeight": 13.6
    },
    {
      "name": "帕尔萨斯",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.33~1.58",
      "weight": "46.5~61.5",
      "minHeight": 1.33,
      "maxHeight": 1.58,
      "minWeight": 46.5,
      "maxWeight": 61.5
    },
    {
      "name": "龙息帕尔",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.93~2.4",
      "weight": "96.5~115",
      "minHeight": 1.93,
      "maxHeight": 2.4,
      "minWeight": 96.5,
      "maxWeight": 115
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
      "variant": "",
      "height": "0.3~0.45",
      "weight": "0.95~2",
      "minHeight": 0.3,
      "maxHeight": 0.45,
      "minWeight": 0.95,
      "maxWeight": 2
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
      "variant": "",
      "height": "1.15~1.45",
      "weight": "2.35~4.19",
      "minHeight": 1.15,
      "maxHeight": 1.45,
      "minWeight": 2.35,
      "maxWeight": 4.19
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
      "variant": "",
      "height": "0.75~0.9",
      "weight": "2.65~5.15",
      "minHeight": 0.75,
      "maxHeight": 0.9,
      "minWeight": 2.65,
      "maxWeight": 5.15
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
      "variant": "",
      "height": "0.28~0.38",
      "weight": "0.99~2.21",
      "minHeight": 0.28,
      "maxHeight": 0.38,
      "minWeight": 0.99,
      "maxWeight": 2.21
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
      "variant": "",
      "height": "0.49~0.6",
      "weight": "5.85~6.9",
      "minHeight": 0.49,
      "maxHeight": 0.6,
      "minWeight": 5.85,
      "maxWeight": 6.9
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
      "variant": "",
      "height": "2.08~2.45",
      "weight": "46.05~58.1",
      "minHeight": 2.08,
      "maxHeight": 2.45,
      "minWeight": 46.05,
      "maxWeight": 58.1
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
      "variant": "",
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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
      "variant": "",
      "height": "0.3~0.41",
      "weight": "2.28~3.86",
      "minHeight": 0.3,
      "maxHeight": 0.41,
      "minWeight": 2.28,
      "maxWeight": 3.86
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
      "variant": "",
      "height": "0.82~1.01",
      "weight": "9.8~14.8",
      "minHeight": 0.82,
      "maxHeight": 1.01,
      "minWeight": 9.8,
      "maxWeight": 14.8
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
      "variant": "",
      "height": "1.91~2.21",
      "weight": "98.8~135.5",
      "minHeight": 1.91,
      "maxHeight": 2.21,
      "minWeight": 98.8,
      "maxWeight": 135.5
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
      "variant": "",
      "height": "1.87~2.15",
      "weight": "119.5~180.5",
      "minHeight": 1.87,
      "maxHeight": 2.15,
      "minWeight": 119.5,
      "maxWeight": 180.5
    },
    {
      "name": "绒绒",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.29~0.35",
      "weight": "1~2.5",
      "minHeight": 0.29,
      "maxHeight": 0.35,
      "minWeight": 1,
      "maxWeight": 2.5
    },
    {
      "name": "小绒�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.59~0.84",
      "weight": "7.6~9.2",
      "minHeight": 0.59,
      "maxHeight": 0.84,
      "minWeight": 7.6,
      "maxWeight": 9.2
    },
    {
      "name": "绒仙�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.25~1.65",
      "weight": "37.5~42.8",
      "minHeight": 1.25,
      "maxHeight": 1.65,
      "minWeight": 37.5,
      "maxWeight": 42.8
    },
    {
      "name": "犀角鸟",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.32~0.4",
      "weight": "9.6~11.5",
      "minHeight": 0.32,
      "maxHeight": 0.4,
      "minWeight": 9.6,
      "maxWeight": 11.5
    },
    {
      "name": "光纤�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.7~0.85",
      "weight": "31.5~37.8",
      "minHeight": 0.7,
      "maxHeight": 0.85,
      "minWeight": 31.5,
      "maxWeight": 37.8
    },
    {
      "name": "疾光千兽",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.75~2.1",
      "weight": "112.9~165",
      "minHeight": 1.75,
      "maxHeight": 2.1,
      "minWeight": 112.9,
      "maxWeight": 165
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
      "variant": "",
      "height": "0.3~0.36",
      "weight": "4.35~5.6",
      "minHeight": 0.3,
      "maxHeight": 0.36,
      "minWeight": 4.35,
      "maxWeight": 5.6
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
      "variant": "",
      "height": "0.39~0.51",
      "weight": "6.21~7.9",
      "minHeight": 0.39,
      "maxHeight": 0.51,
      "minWeight": 6.21,
      "maxWeight": 7.9
    },
    {
      "name": "椰浆布丁",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.39~0.51",
      "weight": "6.21~7.9",
      "minHeight": 0.39,
      "maxHeight": 0.51,
      "minWeight": 6.21,
      "maxWeight": 7.9
    },
    {
      "name": "熔岩布丁",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.39~0.51",
      "weight": "6.21~7.9",
      "minHeight": 0.39,
      "maxHeight": 0.51,
      "minWeight": 6.21,
      "maxWeight": 7.9
    },
    {
      "name": "星尘�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.15~0.2",
      "weight": "0.45~1.4",
      "minHeight": 0.15,
      "maxHeight": 0.2,
      "minWeight": 0.45,
      "maxWeight": 1.4
    },
    {
      "name": "落星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.35~0.4",
      "weight": "1.25~2.25",
      "minHeight": 0.35,
      "maxHeight": 0.4,
      "minWeight": 1.25,
      "maxWeight": 2.25
    },
    {
      "name": "陨星�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "昆虫�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.65~0.8",
      "weight": "5.6~6.8",
      "minHeight": 0.65,
      "maxHeight": 0.8,
      "minWeight": 5.6,
      "maxWeight": 6.8
    },
    {
      "name": "双灯�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.5~0.72",
      "weight": "14.9~17.8",
      "minHeight": 0.5,
      "maxHeight": 0.72,
      "minWeight": 14.9,
      "maxWeight": 17.8
    },
    {
      "name": "利灯�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "海洋�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.62~0.89",
      "weight": "26.8~31.5",
      "minHeight": 0.62,
      "maxHeight": 0.89,
      "minWeight": 26.8,
      "maxWeight": 31.5
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
      "variant": "",
      "height": "1.25~1.45",
      "weight": "76.5~92.5",
      "minHeight": 1.25,
      "maxHeight": 1.45,
      "minWeight": 76.5,
      "maxWeight": 92.5
    },
    {
      "name": "嗜光嗡嗡",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.24~0.32",
      "weight": "1.46~3.05",
      "minHeight": 0.24,
      "maxHeight": 0.32,
      "minWeight": 1.46,
      "maxWeight": 3.05
    },
    {
      "name": "窃光�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "昆虫�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.53~0.66",
      "weight": "7.05~9.62",
      "minHeight": 0.53,
      "maxHeight": 0.66,
      "minWeight": 7.05,
      "maxWeight": 9.62
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
      "variant": "",
      "height": "0.45~0.55",
      "weight": "14.5~18.6",
      "minHeight": 0.45,
      "maxHeight": 0.55,
      "minWeight": 14.5,
      "maxWeight": 18.6
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
      "variant": "",
      "height": "1.1~1.25",
      "weight": "72.5~87.5",
      "minHeight": 1.1,
      "maxHeight": 1.25,
      "minWeight": 72.5,
      "maxWeight": 87.5
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
      "variant": "",
      "height": "0.43~0.61",
      "weight": "5.6~8.7",
      "minHeight": 0.43,
      "maxHeight": 0.61,
      "minWeight": 5.6,
      "maxWeight": 8.7
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
      "variant": "",
      "height": "0.82~1.18",
      "weight": "27.6~34.3",
      "minHeight": 0.82,
      "maxHeight": 1.18,
      "minWeight": 27.6,
      "maxWeight": 34.3
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
      "variant": "",
      "height": "1.45~2.07",
      "weight": "58.6~66.5",
      "minHeight": 1.45,
      "maxHeight": 2.07,
      "minWeight": 58.6,
      "maxWeight": 66.5
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
      "variant": "",
      "height": "0.53~0.76",
      "weight": "2.1~3",
      "minHeight": 0.53,
      "maxHeight": 0.76,
      "minWeight": 2.1,
      "maxWeight": 3
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
      "variant": "",
      "height": "0.7~1",
      "weight": "6.4~8.12",
      "minHeight": 0.7,
      "maxHeight": 1,
      "minWeight": 6.4,
      "maxWeight": 8.12
    },
    {
      "name": "贝瑟",
      "type1": "机械",
      "type2": "�?,
      "group": [
        "机械�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.57~0.82",
      "weight": "24.5~34.6",
      "minHeight": 0.57,
      "maxHeight": 0.82,
      "minWeight": 24.5,
      "maxWeight": 34.6
    },
    {
      "name": "贝加�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "机械�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.9~1.2",
      "weight": "87.6~97.5",
      "minHeight": 0.9,
      "maxHeight": 1.2,
      "minWeight": 87.6,
      "maxWeight": 97.5
    },
    {
      "name": "贝古�?,
      "type1": "机械",
      "type2": "�?,
      "group": [
        "机械�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.55~1.8",
      "weight": "248~286",
      "minHeight": 1.55,
      "maxHeight": 1.8,
      "minWeight": 248,
      "maxWeight": 286
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
      "variant": "",
      "height": "0.39~0.5",
      "weight": "9.8~12.8",
      "minHeight": 0.39,
      "maxHeight": 0.5,
      "minWeight": 9.8,
      "maxWeight": 12.8
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
      "variant": "",
      "height": "0.55~0.75",
      "weight": "16.82~23.81",
      "minHeight": 0.55,
      "maxHeight": 0.75,
      "minWeight": 16.82,
      "maxWeight": 23.81
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
      "variant": "",
      "height": "0.55~0.75",
      "weight": "16.82~23.81",
      "minHeight": 0.55,
      "maxHeight": 0.75,
      "minWeight": 16.82,
      "maxWeight": 23.81
    },
    {
      "name": "布瓜�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.32~0.51",
      "weight": "0.45~1.65",
      "minHeight": 0.32,
      "maxHeight": 0.51,
      "minWeight": 0.45,
      "maxWeight": 1.65
    },
    {
      "name": "上岸�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "两栖�?
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.65~0.87",
      "weight": "5.8~8.1",
      "minHeight": 0.65,
      "maxHeight": 0.87,
      "minWeight": 5.8,
      "maxWeight": 8.1
    },
    {
      "name": "火红�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.72~0.98",
      "weight": "17.5~30.5",
      "minHeight": 0.72,
      "maxHeight": 0.98,
      "minWeight": 17.5,
      "maxWeight": 30.5
    },
    {
      "name": "雅丹�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "动物�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.7~2.06",
      "weight": "49.5~71.2",
      "minHeight": 1.7,
      "maxHeight": 2.06,
      "minWeight": 49.5,
      "maxWeight": 71.2
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
      "variant": "",
      "height": "0.35~0.51",
      "weight": "2.1~3.6",
      "minHeight": 0.35,
      "maxHeight": 0.51,
      "minWeight": 2.1,
      "maxWeight": 3.6
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
      "variant": "",
      "height": "0.61~0.87",
      "weight": "6.8~8.5",
      "minHeight": 0.61,
      "maxHeight": 0.87,
      "minWeight": 6.8,
      "maxWeight": 8.5
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
      "variant": "",
      "height": "0.85~1.15",
      "weight": "18.5~33.5",
      "minHeight": 0.85,
      "maxHeight": 1.15,
      "minWeight": 18.5,
      "maxWeight": 33.5
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
      "variant": "",
      "height": "0.4~0.55",
      "weight": "0.6~1.65",
      "minHeight": 0.4,
      "maxHeight": 0.55,
      "minWeight": 0.6,
      "maxWeight": 1.65
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
      "variant": "",
      "height": "0.88~1.05",
      "weight": "3~4.5",
      "minHeight": 0.88,
      "maxHeight": 1.05,
      "minWeight": 3,
      "maxWeight": 4.5
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
      "variant": "",
      "height": "1.85~2.05",
      "weight": "7.5~10.5",
      "minHeight": 1.85,
      "maxHeight": 2.05,
      "minWeight": 7.5,
      "maxWeight": 10.5
    },
    {
      "name": "钨丝贝贝",
      "type1": "机械",
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.54~0.73",
      "weight": "9.7~14.8",
      "minHeight": 0.54,
      "maxHeight": 0.73,
      "minWeight": 9.7,
      "maxWeight": 14.8
    },
    {
      "name": "辉光幕机",
      "type1": "机械",
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.03~1.41",
      "weight": "31.5~57.6",
      "minHeight": 1.03,
      "maxHeight": 1.41,
      "minWeight": 31.5,
      "maxWeight": 57.6
    },
    {
      "name": "机幕方舟",
      "type1": "机械",
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.68~2.01",
      "weight": "128~237",
      "minHeight": 1.68,
      "maxHeight": 2.01,
      "minWeight": 128,
      "maxWeight": 237
    },
    {
      "name": "凡雀",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.35~0.5",
      "weight": "3.08~6",
      "minHeight": 0.35,
      "maxHeight": 0.5,
      "minWeight": 3.08,
      "maxWeight": 6
    },
    {
      "name": "紫翎�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "0.65~0.85",
      "weight": "13.04~20.5",
      "minHeight": 0.65,
      "maxHeight": 0.85,
      "minWeight": 13.04,
      "maxWeight": 20.5
    },
    {
      "name": "凡鹰",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "1.64~2.23",
      "weight": "46.35~68.27",
      "minHeight": 1.64,
      "maxHeight": 2.23,
      "minWeight": 46.35,
      "maxWeight": 68.27
    },
    {
      "name": "小雪�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.75~0.94",
      "weight": "43.3~87.5",
      "minHeight": 0.75,
      "maxHeight": 0.94,
      "minWeight": 43.3,
      "maxWeight": 87.5
    },
    {
      "name": "雪�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.75~2.33",
      "weight": "120~187.4",
      "minHeight": 1.75,
      "maxHeight": 2.33,
      "minWeight": 120,
      "maxWeight": 187.4
    },
    {
      "name": "爆焰�?,
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.65~0.85",
      "weight": "21~38.5",
      "minHeight": 0.65,
      "maxHeight": 0.85,
      "minWeight": 21,
      "maxWeight": 38.5
    },
    {
      "name": "爆焰喷喷",
      "type1": "�?,
      "type2": "�?,
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": true,
      "variant": "",
      "height": "1.65~1.81",
      "weight": "47.5~69.5",
      "minHeight": 1.65,
      "maxHeight": 1.81,
      "minWeight": 47.5,
      "maxWeight": 69.5
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
      "variant": "",
      "height": "0.57~0.79",
      "weight": "8.4~17.6",
      "minHeight": 0.57,
      "maxHeight": 0.79,
      "minWeight": 8.4,
      "maxWeight": 17.6
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
      "variant": "",
      "height": "0.77~1.08",
      "weight": "23.1~40.8",
      "minHeight": 0.77,
      "maxHeight": 1.08,
      "minWeight": 23.1,
      "maxWeight": 40.8
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
      "variant": "",
      "height": "0.35~0.47",
      "weight": "2.9~4.15",
      "minHeight": 0.35,
      "maxHeight": 0.47,
      "minWeight": 2.9,
      "maxWeight": 4.15
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
      "variant": "",
      "height": "0.51~0.78",
      "weight": "6.75~11.7",
      "minHeight": 0.51,
      "maxHeight": 0.78,
      "minWeight": 6.75,
      "maxWeight": 11.7
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
      "variant": "",
      "height": "0.48~0.65",
      "weight": "4.85~6.35",
      "minHeight": 0.48,
      "maxHeight": 0.65,
      "minWeight": 4.85,
      "maxWeight": 6.35
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
      "variant": "",
      "height": "0.78~0.96",
      "weight": "11.75~14.75",
      "minHeight": 0.78,
      "maxHeight": 0.96,
      "minWeight": 11.75,
      "maxWeight": 14.75
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
      "variant": "",
      "height": "1.24~1.63",
      "weight": "38.5~47.6",
      "minHeight": 1.24,
      "maxHeight": 1.63,
      "minWeight": 38.5,
      "maxWeight": 47.6
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
      "variant": "",
      "height": "0.33~0.5",
      "weight": "5.05~6.32",
      "minHeight": 0.33,
      "maxHeight": 0.5,
      "minWeight": 5.05,
      "maxWeight": 6.32
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
      "variant": "",
      "height": "0.6~0.88",
      "weight": "10.5~22.5",
      "minHeight": 0.6,
      "maxHeight": 0.88,
      "minWeight": 10.5,
      "maxWeight": 22.5
    },
    {
      "name": "咕咕�?,
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.38~0.55",
      "weight": "2.18~5.76",
      "minHeight": 0.38,
      "maxHeight": 0.55,
      "minWeight": 2.18,
      "maxWeight": 5.76
    },
    {
      "name": "咕德帽帽",
      "type1": "�?,
      "type2": "",
      "group": [
        "妖精�?
      ],
      "hasShiny": true,
      "variant": "",
      "height": "0.69~0.96",
      "weight": "7.68~14.3",
      "minHeight": 0.69,
      "maxHeight": 0.96,
      "minWeight": 7.68,
      "maxWeight": 14.3
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
      "variant": "",
      "height": "0.47~0.68",
      "weight": "26~37.1",
      "minHeight": 0.47,
      "maxHeight": 0.68,
      "minWeight": 26,
      "maxWeight": 37.1
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
      "variant": "",
      "height": "1.6~1.87",
      "weight": "66.8~89.3",
      "minHeight": 1.6,
      "maxHeight": 1.87,
      "minWeight": 66.8,
      "maxWeight": 89.3
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
      "variant": "",
      "height": "0.64~0.83",
      "weight": "5.16~8.3",
      "minHeight": 0.64,
      "maxHeight": 0.83,
      "minWeight": 5.16,
      "maxWeight": 8.3
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
      "variant": "",
      "height": "0.93~1.2",
      "weight": "35.6~59.1",
      "minHeight": 0.93,
      "maxHeight": 1.2,
      "minWeight": 35.6,
      "maxWeight": 59.1
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
      "variant": "",
      "height": "0.63~0.91",
      "weight": "5.97~8.7",
      "minHeight": 0.63,
      "maxHeight": 0.91,
      "minWeight": 5.97,
      "maxWeight": 8.7
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
      "variant": "",
      "height": "0.89~1.27",
      "weight": "15.1~21.2",
      "minHeight": 0.89,
      "maxHeight": 1.27,
      "minWeight": 15.1,
      "maxWeight": 21.2
    },
    {
      "name": "学院呱呱",
      "type1": "�?,
      "type2": "",
      "group": [
        "无法孵蛋"
      ],
      "hasShiny": false,
      "variant": "",
      "height": "",
      "weight": "",
      "minHeight": 0,
      "maxHeight": 0,
      "minWeight": 0,
      "maxWeight": 0
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

var db = null

var typeClassMap = {
  '�?: 'grass', '�?: 'fire', '�?: 'water', '�?: 'electric',
  '�?: 'light', '普�?: 'normal', '机械': 'machinery', '�?: 'ice',
  '�?: 'dragon', '�?: 'dark', '飞行': 'flying', '�?: 'magic',
  '格斗': 'fight', '岩石': 'rock', '�?: 'steel', '妖精': 'fairy',
  '超能�?: 'psychic', '�?: 'ghost', '�?: 'poison', '地面': 'ground',
  '�?: 'bug', '�?: 'martial', '�?: 'shadow', '�?: 'cute',
  '�?: 'wing', '�?: 'darkness', '�?: 'stone'
}

function getEggImgUrl(name, variant) {
  var fullPetMap = require('./fullPetMap.js');
  var fullName = variant ? name + '�? + variant + '�? : name;
  if (fullPetMap[fullName]) return fullPetMap[fullName];
  if (fullPetMap[name]) return fullPetMap[name];
  return 'https://wiki.biligame.com/rocom/Special:FilePath/精灵_头像_' + fullName + '.png';
}

var localPets = eggData.pets.map(function(p) {
  var copy = Object.assign({}, p)
  var mountNames = eggData.mounts.map(function(m) { return m.pet })
  
  if (mountNames.indexOf(p.name) >= 0) {
    copy.egg = '同乘�?
  } else if (p.hasShiny) {
    copy.egg = '炫彩�?
  } else if (['�?, '�?, '�?, '�?, '�?, '�?, '机械', '�?, '�?, '�?, '妖精', '超能�?, '�?].indexOf(p.type1) >= 0) {
    copy.egg = '神奇的蛋'
  } else {
    copy.egg = '普通蛋'
  }
  
  copy.type1_class = typeClassMap[p.type1] || 'default'
  copy.type2_class = typeClassMap[p.type2] || ''
  copy.imgUrl = getEggImgUrl(p.name, p.variant)
  return copy
})

Page({
  data: {
    types: eggData.types,
    sizes: eggData.sizes,
    pets: localPets,
    mounts: eggData.mounts,
    filteredPets: localPets,
    search: '',
    activeTab: 'lookup', // 'rule', 'pool', 'lookup', 'overview'
    isAdmin: false,
    maintenance: false,
    useCustom: false,
    customContent: '',
    showModal: false,
    editingField: '',
    editValue: '',
    submitting: false,
    queryType: '',
    queryResults: [],
    lookupHeight: '',
    lookupWeight: '',
    lookupEggName: '全部',
    lookupEggIndex: 0,
    lookupResults: [],
    hasSearched: false,
    selectedLookupPet: null,
    eggNameList: ['全部', '普通蛋', '神奇的蛋', '炫彩�?, '同乘�?]
  },
  onShow: function() {
    if (wx.cloud) db = wx.cloud.database()
    this.checkAdmin()
    this.loadConfig()
    this.filterPets()
  },
  switchTab: function(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },
  onSearch: function(e) {
    this.setData({ search: e.detail.value })
    this.filterPets()
  },
  filterPets: function() {
    var s = this.data.search.trim().toLowerCase()
    if (!s) {
      this.setData({ filteredPets: this.data.pets })
      return
    }
    var filtered = this.data.pets.filter(function(p) {
      var nameMatch = p.name.toLowerCase().indexOf(s) >= 0
      var type1Match = p.type1 && p.type1.toLowerCase().indexOf(s) >= 0
      var type2Match = p.type2 && p.type2.toLowerCase().indexOf(s) >= 0
      var eggMatch = p.egg && p.egg.toLowerCase().indexOf(s) >= 0
      var groupMatch = p.group && p.group.some(function(g) { return g.toLowerCase().indexOf(s) >= 0 })
      var variantMatch = p.variant && p.variant.toLowerCase().indexOf(s) >= 0
      return nameMatch || type1Match || type2Match || eggMatch || groupMatch || variantMatch
    })
    this.setData({ filteredPets: filtered })
  },
  checkAdmin: function() {
    var self = this
    if (!db) return
    var userInfo = app.globalData.userInfo
    var saved = wx.getStorageSync('user_info')
    if (!userInfo && saved) userInfo = saved
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            if (userRes.data.length > 0) {
              self.setData({ isAdmin: true })
            }
          })
      })
      .catch(function(e) { console.error(e) })
  },
  loadConfig: function() {
    var self = this
    if (!db) return
    db.collection('page_config').doc('egg').get()
      .then(function(res) {
        var d = res.data
        self.setData({
          maintenance: d.maintenance || false,
          useCustom: d.useCustom || false,
          customContent: d.customContent || ''
        })
      })
      .catch(function(e) { console.error(e) })
  },
  toggleMaintenance: function() {
    var self = this
    if (!db) return
    var newVal = !self.data.maintenance
    db.collection('page_config').doc('egg').get()
      .then(function() {
        return db.collection('page_config').doc('egg').update({
          data: { maintenance: newVal, updateTime: db.serverDate() }
        })
      })
      .catch(function() {
        return db.collection('page_config').add({
          data: { _id: 'egg', maintenance: newVal, useCustom: false, customContent: '', updateTime: db.serverDate() }
        })
      })
      .then(function() {
        self.setData({ maintenance: newVal })
        wx.showToast({ title: newVal ? '已下�? : '已上�?, icon: 'success' })
      })
  },
  toggleMode: function() {
    var self = this
    if (!db) return
    var newMode = !self.data.useCustom
    db.collection('page_config').doc('egg').get()
      .then(function() {
        return db.collection('page_config').doc('egg').update({
          data: { useCustom: newMode, updateTime: db.serverDate() }
        })
      })
      .catch(function() {
        return db.collection('page_config').add({
          data: { _id: 'egg', useCustom: newMode, customContent: '', updateTime: db.serverDate() }
        })
      })
      .then(function() {
        self.setData({ useCustom: newMode })
        wx.showToast({ title: newMode ? '已切换为自定�? : '已切换为默认', icon: 'success' })
      })
  },
  onEdit: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.currentTarget.dataset.value || ''
    this.setData({ showModal: true, editingField: field, editValue: value })
  },
  onEditInput: function(e) { this.setData({ editValue: e.detail.value }) },
  saveEdit: function() {
    var self = this
    if (!db) { wx.showToast({ title: '云环境未就绪', icon: 'none' }); return }
    if (self.data.submitting) return
    var value = self.data.editValue.trim()
    if (!value) { wx.showToast({ title: '请输入内�?, icon: 'none' }); return }
    self.setData({ submitting: true })
    var updateData = {}
    updateData[self.data.editingField] = value
    updateData.updateTime = db.serverDate()
    db.collection('page_config').doc('egg').update({ data: updateData })
      .then(function() {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadConfig()
      })
      .catch(function() {
        return db.collection('page_config').add({
          data: { _id: 'egg', maintenance: false, useCustom: false, customContent: '', updateTime: db.serverDate() }
        }).then(function() {
          return db.collection('page_config').doc('egg').update({ data: updateData })
        })
      })
      .then(function() {
        self.setData({ submitting: false, showModal: false })
        wx.showToast({ title: '保存成功', icon: 'success' })
        self.loadConfig()
      })
      .catch(function() {
        self.setData({ submitting: false })
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
  },
  closeModal: function() { this.setData({ showModal: false }) },
  preventClose: function() {},
  queryEggType: function(e) {
    var type = e.currentTarget.dataset.type
    if (type === this.data.queryType) {
      this.setData({ queryType: '', queryResults: [] })
      return
    }
    var pets = this.data.pets
    var results = []
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].type1 === type || pets[i].type2 === type) {
        results.push(pets[i])
      }
    }
    this.setData({ queryType: type, queryResults: results })
  },
  copySourceLink: function() {
    wx.setClipboardData({
      data: 'https://wiki.biligame.com/rocom/%E5%AD%B5%E8%9B%8B%E6%9F%A5%E8%AF%A2',
      success: function() {
        wx.showToast({ title: '链接已复�?, icon: 'success' })
      }
    })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  onLookupHeightInput: function(e) {
    this.setData({ lookupHeight: e.detail.value })
  },
  onLookupWeightInput: function(e) {
    this.setData({ lookupWeight: e.detail.value })
  },
    onLookupEggChange: function(e) {
    var idx = parseInt(e.detail.value)
    this.setData({ 
      lookupEggIndex: idx,
      lookupEggName: this.data.eggNameList[idx] 
    })
  },
  onLookupClear: function() {
    this.setData({
      lookupHeight: '',
      lookupWeight: '',
      lookupEggName: '全部',
      lookupEggIndex: 0,
      lookupResults: [],
      hasSearched: false,
      selectedLookupPet: null
    })
  },
  onLookupSearch: function() {
    var hStr = this.data.lookupHeight.trim().replace(',', '.')
    var wStr = this.data.lookupWeight.trim().replace(',', '.')
    var selectedEgg = this.data.lookupEggName
    
    if (!hStr && !wStr) {
      wx.showToast({
        title: '请输入身高或体重进行查询',
        icon: 'none'
      })
      return
    }
    
    var hVal = parseFloat(hStr)
    var wVal = parseFloat(wStr)
    
    var queryH = !isNaN(hVal)
    var queryW = !isNaN(wVal)
    
    var pets = this.data.pets
    var results = []
    
    // 使用范围比例容差�?0%），�?WIKI 匹配逻辑一�?
    var tolerancePct = 0.3
    
    for (var i = 0; i < pets.length; i++) {
      var p = pets[i]
      var matchH = true
      var matchW = true
      var matchEgg = true
      var score = 0 // 越小越精�?
      
      if (queryH) {
        if (typeof p.minHeight !== 'number' || typeof p.maxHeight !== 'number' || p.minHeight === 0) {
          matchH = false
        } else {
          var hRange = p.maxHeight - p.minHeight
          var hEps = hRange * tolerancePct
          matchH = (hVal >= p.minHeight - hEps && hVal <= p.maxHeight + hEps)
          if (matchH) {
            var hCenter = (p.minHeight + p.maxHeight) / 2
            score += Math.abs(hVal - hCenter) / (hRange || 1)
          }
        }
      }
      
      if (queryW) {
        if (typeof p.minWeight !== 'number' || typeof p.maxWeight !== 'number' || p.minWeight === 0) {
          matchW = false
        } else {
          var wRange = p.maxWeight - p.minWeight
          var wEps = wRange * tolerancePct
          matchW = (wVal >= p.minWeight - wEps && wVal <= p.maxWeight + wEps)
          if (matchW) {
            var wCenter = (p.minWeight + p.maxWeight) / 2
            score += Math.abs(wVal - wCenter) / (wRange || 1)
          }
        }
      }
      
      if (selectedEgg !== '全部') {
        matchEgg = (p.egg === selectedEgg)
      }
      
      if (matchH && matchW && matchEgg) {
        p._matchScore = score
        results.push(p)
      }
    }
    
    // 按匹配精度排序（分数越低越精确）
    results.sort(function(a, b) { return a._matchScore - b._matchScore })
    
    this.setData({
      lookupResults: results,
      hasSearched: true,
      selectedLookupPet: null
    })
  },
  selectLookupPet: function(e) {
    var self = this
    var item = e.currentTarget.dataset.item
    if (!item) return
    
    // 选中/取消选中
    var isSelected = self.data.selectedLookupPet && self.data.selectedLookupPet.name === item.name
    if (isSelected) {
      self.setData({ selectedLookupPet: null })
      return
    }
    
    self.setData({ selectedLookupPet: item })
    
    // 保存到本地存�?
    var syncData = {
      petName: item.name,
      petType1: item.type1,
      petType2: item.type2 || '',
      egg: item.egg || '普通蛋',
      group: item.group || [],
      height: item.height || '',
      weight: item.weight || '',
      minHeight: item.minHeight || 0,
      maxHeight: item.maxHeight || 0,
      minWeight: item.minWeight || 0,
      maxWeight: item.maxWeight || 0,
      queryHeight: self.data.lookupHeight || '',
      queryWeight: self.data.lookupWeight || '',
      queryEgg: self.data.lookupEggName || '全部',
      timestamp: Date.now()
    }
    
    // 保存到本�?
    var records = wx.getStorageSync('egg_lookup_records') || []
    records.unshift(syncData)
    // 只保留最�?00条记�?
    if (records.length > 100) records = records.slice(0, 100)
    wx.setStorageSync('egg_lookup_records', records)
    
    // 尝试同步到云端（不阻塞用户操作）
    if (db) {
      db.collection('egg_lookup_records').add({
        data: syncData
      }).catch(function() {
        // 云端同步失败，静默处�?
        console.log('Cloud sync failed, data saved locally')
      })
    }
    
    // 显示感谢提示
    wx.showModal({
      title: '感谢反馈 🎉',
      content: '你选择的�? + item.name + '」已记录，数据将用于优化反查精准度！',
      showCancel: false,
      confirmText: '好的',
      confirmColor: '#00d4ff'
    })
  },
  onShareAppMessage: function() {
    return { title: '洛手助手 - 孵蛋查询', path: '/pages/egg/egg', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 洛克王国精灵图鉴及孵蛋查�?, imageUrl: '/images/banner.webp' }
  }
})
