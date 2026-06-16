var app = getApp()
var eggData = {
  types: [
    { id: 1, name: '普通蛋', color: '#999', icon: '🥚', desc: '最常见的精灵蛋', prob: '75%', bonus: '无' },
    { id: 2, name: '火系蛋', color: '#d32f2f', icon: '🔥', desc: '孵化出火系精灵', prob: '15%', bonus: '火系攻击+3%' },
    { id: 3, name: '水系蛋', color: '#1565c0', icon: '💧', desc: '孵化出水系精灵', prob: '15%', bonus: '水系攻击+3%' },
    { id: 4, name: '草系蛋', color: '#2e7d32', icon: '🌿', desc: '孵化出草系精灵', prob: '15%', bonus: '草系攻击+3%' },
    { id: 5, name: '电系蛋', color: '#f57f17', icon: '⚡', desc: '孵化出电系精灵', prob: '10%', bonus: '电系攻击+5%' },
    { id: 6, name: '冰系蛋', color: '#00838f', icon: '❄️', desc: '孵化出冰系精灵', prob: '10%', bonus: '冰系攻击+5%' },
    { id: 7, name: '龙系蛋', color: '#4527a0', icon: '🐉', desc: '孵化出龙系精灵', prob: '5%', bonus: '全属性+5%' },
    { id: 8, name: '恶系蛋', color: '#37474f', icon: '👿', desc: '孵化出恶系精灵', prob: '10%', bonus: '恶系攻击+5%' },
    { id: 9, name: '飞行蛋', color: '#388e3c', icon: '🕊️', desc: '孵化出飞行系精灵', prob: '10%', bonus: '速度+5%' },
    { id: 10, name: '格斗蛋', color: '#d84315', icon: '👊', desc: '孵化出格斗系精灵', prob: '10%', bonus: '攻击+5%' }
  ],
  eggItems: [
    { name: '普通蛋', rarity: '普通', icon: '🥚' },
    { name: '火系蛋', rarity: '普通', icon: '🔥' },
    { name: '水系蛋', rarity: '普通', icon: '💧' },
    { name: '草系蛋', rarity: '普通', icon: '🌿' },
    { name: '电系蛋', rarity: '普通', icon: '⚡' },
    { name: '冰系蛋', rarity: '普通', icon: '❄️' },
    { name: '龙系蛋', rarity: '稀有', icon: '🐉' },
    { name: '恶系蛋', rarity: '普通', icon: '👿' },
    { name: '飞行蛋', rarity: '普通', icon: '🕊️' },
    { name: '格斗蛋', rarity: '普通', icon: '👊' },
    { name: '岩石蛋', rarity: '普通', icon: '🪨' },
    { name: '钢系蛋', rarity: '稀有', icon: '⚙️' },
    { name: '妖精蛋', rarity: '稀有', icon: '🧚' },
    { name: '超能力蛋', rarity: '稀有', icon: '🔮' },
    { name: '鬼系蛋', rarity: '稀有', icon: '👻' },
    { name: '毒系蛋', rarity: '普通', icon: '☠️' },
    { name: '地面蛋', rarity: '普通', icon: '⛰️' },
    { name: '虫系蛋', rarity: '普通', icon: '🐛' },
    { name: '闪光蛋', rarity: '传说', icon: '✨' },
    { name: '异色蛋', rarity: '传说', icon: '🌈' }
  ],
  sizes: [
    { id: 1, name: '大块头', icon: '💪', color: '#d32f2f', desc: '体型较大的精灵蛋，孵化出的精灵体型偏大', prob: '10%', bonus: '生命值+5%' },
    { id: 2, name: '小块头', icon: '👶', color: '#1a6d37', desc: '体型较小的精灵蛋，孵化出的精灵体型偏小', prob: '10%', bonus: '速度+5%' },
    { id: 3, name: '炫彩蛋', icon: '🌈', color: '#9c27b0', desc: '稀有炫彩外观的精灵蛋，有概率孵出闪光精灵', prob: '5%', bonus: '全属性+3%' },
    { id: 4, name: '普通蛋', icon: '🥚', color: '#999', desc: '最常见的精灵蛋', prob: '75%', bonus: '无' }
  ],
pets: [
    {
      "name": "迪莫",
      "type1": "光",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "喵喵",
      "type1": "草",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "喵呜",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔力猫",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火花",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "焰火",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火神",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水蓝蓝",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "波波拉",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水灵",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "鸭吉吉",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "蓬松的样子"
    },
    {
      "name": "鸭吉吉",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "紧实的样子"
    },
    {
      "name": "鸭吉吉",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "急急急鸭"
    },
    {
      "name": "鸭吉吉",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "等一等鸭"
    },
    {
      "name": "鸭吉吉",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "起来鸭"
    },
    {
      "name": "鸭吉吉",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "燃了鸭"
    },
    {
      "name": "板板壳",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "咔咔壳",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "水泡壳",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "锥尾羊",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "铃兰羊",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花影羚羊",
      "type1": "幽",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪绒鸟",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "冬羽雀",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "岚鸟",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "小灵菇",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "幻灵菇",
      "type1": "幽",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "幻影灵菇",
      "type1": "幽",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "石肤蜥",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "石刺蜥",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "石冠王蜥",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "布是石",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "布是岩",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "布克棱岩",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "恶魔叮",
      "type1": "恶",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "叮叮恶魔",
      "type1": "恶",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "毛毛",
      "type1": "虫",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "爬爬",
      "type1": "虫",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "化蝶",
      "type1": "虫",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "平常的样子"
    },
    {
      "name": "幽影树",
      "type1": "幽",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小鼠獭",
      "type1": "普通",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "燕尾獭",
      "type1": "普通",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "卷胡巨獭",
      "type1": "普通",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "矿晶虫",
      "type1": "光",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "晶石蜗",
      "type1": "光",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "西瓜碧玺的样子"
    },
    {
      "name": "奇丽草",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "奇丽叶",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "奇丽花",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "丢丢",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": "草地附近的样子"
    },
    {
      "name": "卡卡虫",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": "草地附近的样子"
    },
    {
      "name": "卡瓦重",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": "草地附近的样子"
    },
    {
      "name": "护主犬",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "音速犬",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绿耳松鼠",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "抱枕松鼠",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蹦床松鼠",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "嘟嘟煲",
      "type1": "毒",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "嘟嘟锅",
      "type1": "毒",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小灵面",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "暗影灵面",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "睁眼的样子"
    },
    {
      "name": "幽冥眼",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "睁眼的样子"
    },
    {
      "name": "梦游",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "穿旧睡衣的样子"
    },
    {
      "name": "梦悠悠",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "穿旧睡衣的样子"
    },
    {
      "name": "兽花蕾",
      "type1": "光",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伏地兽",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "贪食鼹",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "巨噬针鼹",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蹦蹦种子",
      "type1": "草",
      "type2": "毒",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": "海神球形态"
    },
    {
      "name": "蹦蹦草",
      "type1": "草",
      "type2": "毒",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": "海神球形态"
    },
    {
      "name": "蹦蹦花",
      "type1": "草",
      "type2": "毒",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": "海神球形态"
    },
    {
      "name": "电咩咩",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "粉咩咩",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "电球咩咩",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蒲公英",
      "type1": "草",
      "type2": "萌",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蒲公英娃娃",
      "type1": "草",
      "type2": "萌",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊贝儿",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊贝粉粉",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "白发懒人",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "动力猿",
      "type1": "普通",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "瞌睡王",
      "type1": "普通",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海盔虫",
      "type1": "水",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "刺盔虫",
      "type1": "水",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "千棘盔",
      "type1": "水",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "菊花梨",
      "type1": "萌",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小星光",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "星光能量的样子"
    },
    {
      "name": "星光狮",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "星光能量的样子"
    },
    {
      "name": "一窝蜂",
      "type1": "虫",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "黄蜂后",
      "type1": "虫",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花魁蜂后",
      "type1": "虫",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小夜",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "紫夜",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "朔夜伊芙",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "乖乖鹄",
      "type1": "翼",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蓝珠天鹅",
      "type1": "翼",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "翠顶夫人",
      "type1": "翼",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "黑羽夫人",
      "type1": "翼",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "锤头鹳",
      "type1": "翼",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绿草精灵",
      "type1": "草",
      "type2": "幻",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔草巫灵",
      "type1": "草",
      "type2": "幻",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "记忆石",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "咔咔羽毛",
      "type1": "翼",
      "type2": "普通",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "咔咔雀",
      "type1": "翼",
      "type2": "普通",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "咔咔鸟",
      "type1": "翼",
      "type2": "普通",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小草虫",
      "type1": "虫",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "草衣虫",
      "type1": "虫",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花衣蝶",
      "type1": "虫",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绿翼鸟",
      "type1": "萌",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔翼鸟",
      "type1": "萌",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "魔眷鸟",
      "type1": "萌",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "阿米亚特",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "阿米樱",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "罗隐",
      "type1": "地",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "风铃鲨",
      "type1": "水",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "蓝蝶鲨",
      "type1": "水",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "彩蝶鲨",
      "type1": "水",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "石石",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "巨灵石",
      "type1": "地",
      "type2": "幽",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "仪使者",
      "type1": "地",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "仪式之星",
      "type1": "地",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "仪式巨像",
      "type1": "地",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小独角兽",
      "type1": "光",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "白金独角兽",
      "type1": "光",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "旋叶虫",
      "type1": "普通",
      "type2": "虫",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "金黄的样子"
    },
    {
      "name": "蓬叶虫",
      "type1": "普通",
      "type2": "虫",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "金黄的样子"
    },
    {
      "name": "风滚暮虫",
      "type1": "普通",
      "type2": "虫",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "金黄的样子"
    },
    {
      "name": "小黑猫",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "黑猫巫师",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "忽幽狸",
      "type1": "幽",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "影狸",
      "type1": "幽",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "多多",
      "type1": "毒",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "多啦多",
      "type1": "毒",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古啦多",
      "type1": "毒",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "哭哭菇",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "怖须菇",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "怖哭菇",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "恶魔狼",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小电企鹅",
      "type1": "冰",
      "type2": "电",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "电企鹅",
      "type1": "冰",
      "type2": "电",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪豆丁",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪蛮人",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪巨人",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "呼呼猪",
      "type1": "冰",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "獠牙猪",
      "type1": "冰",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雪娃娃",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "冰封怨灵",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪灵",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "大耳帽兜",
      "type1": "冰",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "帽兜娃娃",
      "type1": "冰",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雪影娃娃",
      "type1": "冰",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "权杖-Ⅱ",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "权杖-Ⅴ",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "灵狐",
      "type1": "火",
      "type2": "冰",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "九尾狐",
      "type1": "火",
      "type2": "冰",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "尖嘴狐仙",
      "type1": "火",
      "type2": "冰",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "里奥",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "灵羽勇士",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣羽翼王",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "松仔",
      "type1": "草",
      "type2": "武",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "松叶羊",
      "type1": "草",
      "type2": "武",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "针叶巡林",
      "type1": "草",
      "type2": "武",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小勇狮",
      "type1": "火",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "炽焰狮",
      "type1": "火",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "炽心勇狮",
      "type1": "火",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水滴蛇",
      "type1": "水",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "水蛇锁",
      "type1": "水",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "游蛇魔使",
      "type1": "水",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "公平鸽",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小怂猫",
      "type1": "武",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "怒目怂猫",
      "type1": "武",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小狮鹫",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "崖间地的样子"
    },
    {
      "name": "神圣狮鹫",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "崖间地的样子"
    },
    {
      "name": "皇家狮鹫",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "崖间地的样子"
    },
    {
      "name": "圆眼蜘蛛",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "尖角蜘蛛",
      "type1": "虫",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "芋香巨角蛛",
      "type1": "虫",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "波波螺",
      "type1": "地",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "消波螺",
      "type1": "地",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "嗜波螺",
      "type1": "地",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "菇菇丁",
      "type1": "地",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "多菇丁",
      "type1": "地",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "九幽菇",
      "type1": "地",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "斑斑",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "斑枭",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "草头鸭",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "卷毛鸭",
      "type1": "草",
      "type2": "武",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海豹战士",
      "type1": "武",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海豹船长",
      "type1": "武",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "号儿鱼",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圆号鱼",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "甜田螺",
      "type1": "水",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "壳乙螺",
      "type1": "水",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "卡洛儿",
      "type1": "水",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "棋棋",
      "type1": "武",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋骑士",
      "type1": "武",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋齐垒",
      "type1": "武",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋祈督",
      "type1": "武",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "棋绮后",
      "type1": "武",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "白子"
    },
    {
      "name": "奔波鼠",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "流浪鼠",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "呆小路",
      "type1": "草",
      "type2": "萌",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "舞动路路",
      "type1": "草",
      "type2": "萌",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "白发路路",
      "type1": "草",
      "type2": "萌",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "逗逗",
      "type1": "萌",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "气球猫",
      "type1": "萌",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "梦想三三",
      "type1": "萌",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "花怨鳗",
      "type1": "地",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "鳗尾兽",
      "type1": "地",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊雷龙",
      "type1": "龙",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "伊兰亚龙",
      "type1": "龙",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "拉特",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "酷拉",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "闪电环",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "刺电环",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "荆棘电环",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小箱怪",
      "type1": "机械",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "迷迷箱怪",
      "type1": "机械",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古钟蛇",
      "type1": "萌",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "寒音蛇",
      "type1": "萌",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "本来的样子"
    },
    {
      "name": "矮脚爬爬",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "恶魔红钻",
      "type1": "虫",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火尾瓦特",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火尾战士",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "烈火守护",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "里拉鳐",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "海枝枝",
      "type1": "水",
      "type2": "幽",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "碧蓝珊瑚"
    },
    {
      "name": "多西",
      "type1": "机械",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "库多西",
      "type1": "机械",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "波多西",
      "type1": "机械",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小翼龙",
      "type1": "龙",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "翼龙",
      "type1": "龙",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "电动长颈鹿",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "奔乐鹿",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "爵士鹿",
      "type1": "电",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "缇塔",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "声波缇塔",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小鹬",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "鄙目鹬",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "高脚鹬",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "脆筒甜甜",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "香草甜甜",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣代甜甜",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "刺轮砣",
      "type1": "毒",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "上弦的样子"
    },
    {
      "name": "月亮砣",
      "type1": "毒",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "上弦的样子"
    },
    {
      "name": "豆丁鱼",
      "type1": "水",
      "type2": "龙",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "快鳍鱼",
      "type1": "水",
      "type2": "龙",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "龙鱼",
      "type1": "水",
      "type2": "龙",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "胆小鳗鱼",
      "type1": "电",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "闪电鳗鱼",
      "type1": "电",
      "type2": "水",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "翡翠水母",
      "type1": "水",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "琉璃水母",
      "type1": "水",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "裘洛",
      "type1": "毒",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "裘力",
      "type1": "毒",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "裘卡",
      "type1": "毒",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "可爱猿",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "炽热猿",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火焰猿",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "布鲁斯",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "雪顶布鲁斯",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "冰钻布鲁斯",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "治愈兔",
      "type1": "火",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "红丝绒",
      "type1": "火",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "红绒十字",
      "type1": "火",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "乌达",
      "type1": "恶",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "极昼的样子"
    },
    {
      "name": "迷你乌",
      "type1": "恶",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "极昼的样子"
    },
    {
      "name": "乌拉塔",
      "type1": "恶",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "极昼的样子"
    },
    {
      "name": "螺旋帕帕",
      "type1": "机械",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "帕帕斯卡",
      "type1": "机械",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "机械方方",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "多彩方方",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "立方人",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "可立鸡",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "晕晕鸡",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绅士鸡",
      "type1": "火",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "武者鸡",
      "type1": "火",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "优优",
      "type1": "地",
      "type2": "光",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绒光优优",
      "type1": "地",
      "type2": "光",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "噼啪鸟",
      "type1": "电",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "深蓝鲸",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "格兰种子",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "格兰花",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "格兰球",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "地鼠",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "枯水期的样子"
    },
    {
      "name": "遁鼠",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "枯水期的样子"
    },
    {
      "name": "遁地鼠",
      "type1": "地",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": "枯水期的样子"
    },
    {
      "name": "墨鱿士",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "混乱鱿彩",
      "type1": "幽",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "秩序鱿墨",
      "type1": "幽",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小甲虫",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "铠甲虫",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣剑侍从",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "圣剑-X",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "吸泥鸥",
      "type1": "地",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "泥吼牙",
      "type1": "地",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "大头骨龙",
      "type1": "龙",
      "type2": "幽",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "寂灭骨龙",
      "type1": "龙",
      "type2": "幽",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "厉毒小萝",
      "type1": "毒",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "厉毒修萝",
      "type1": "毒",
      "type2": "恶",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小帕尔",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "帕尔萨斯",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "龙息帕尔",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "毛头小蛛",
      "type1": "虫",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "捕尘长绒",
      "type1": "虫",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "食尘短绒",
      "type1": "虫",
      "type2": "地",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画精灵",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画像守护",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画间法师手",
      "type1": "普通",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "画间沉铁兽",
      "type1": "普通",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "书魔虫",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "书卷守护",
      "type1": "普通",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古卷执政官",
      "type1": "普通",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "古卷匣魔像",
      "type1": "普通",
      "type2": "武",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "绒绒",
      "type1": "光",
      "type2": "虫",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小绒茧",
      "type1": "光",
      "type2": "虫",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "绒仙子",
      "type1": "光",
      "type2": "虫",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "犀角鸟",
      "type1": "光",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "光纤兽",
      "type1": "光",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "疾光千兽",
      "type1": "光",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "果冻",
      "type1": "水",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "抹茶布丁",
      "type1": "水",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "椰浆布丁",
      "type1": "水",
      "type2": "冰",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "熔岩布丁",
      "type1": "水",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "星尘虫",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "落星虫",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "陨星虫",
      "type1": "虫",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "双灯鱼",
      "type1": "水",
      "type2": "电",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "利灯鱼",
      "type1": "水",
      "type2": "电",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "月牙雪熊",
      "type1": "冰",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "嗜光嗡嗡",
      "type1": "恶",
      "type2": "光",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "窃光蚊",
      "type1": "恶",
      "type2": "光",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "柴渣虫",
      "type1": "火",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "燃薪虫",
      "type1": "火",
      "type2": "草",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "空空颅",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "夜宿颅",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "夜枭",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "粉粉星",
      "type1": "电",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小皮球",
      "type1": "电",
      "type2": "幻",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "贝瑟",
      "type1": "机械",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "贝加尔",
      "type1": "机械",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "贝古斯",
      "type1": "机械",
      "type2": "火",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "粉星仔",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "粉耳星兔",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "落陨星兔",
      "type1": "幻",
      "type2": "幽",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "布瓜蝌",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "上岸蛙",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "火红尾",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雅丹鬃",
      "type1": "火",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "春团",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "春兔",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "春花兔",
      "type1": "草",
      "type2": "",
      "group": [
        "植物"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "幽星光",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "曜星光",
      "type1": "幻",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "暮星辰",
      "type1": "幻",
      "type2": "翼",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "钨丝贝贝",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "辉光幕机",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "机幕方舟",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "凡雀",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "紫翎鹰",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "凡鹰",
      "type1": "翼",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    },
    {
      "name": "小雪人",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "雪怪",
      "type1": "冰",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "爆焰仔",
      "type1": "火",
      "type2": "龙",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "爆焰喷喷",
      "type1": "火",
      "type2": "龙",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "猴麦仔",
      "type1": "普通",
      "type2": "机械",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "音碟吼",
      "type1": "普通",
      "type2": "机械",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "加油海葵",
      "type1": "水",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "加油蟹",
      "type1": "水",
      "type2": "萌",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小丑豆豆",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小丑兔",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小丑公爵",
      "type1": "恶",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "烟花团",
      "type1": "火",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "烟花伯爵",
      "type1": "火",
      "type2": "毒",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "咕咕帽",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "咕德帽帽",
      "type1": "幽",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "炫光迪迪",
      "type1": "电",
      "type2": "光",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "霹雳迪迪",
      "type1": "电",
      "type2": "光",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "小鼓象",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "巨鼓象",
      "type1": "机械",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "牵线木偶",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "帅帅魔偶",
      "type1": "幻",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": true,
      "variant": ""
    },
    {
      "name": "学院呱呱",
      "type1": "武",
      "type2": "",
      "group": [
        "怪兽"
      ],
      "hasShiny": false,
      "variant": ""
    }
  ],
  mounts: [
    { pet: '极光迪莫', mount: '光翼飞行', bonus: '飞行速度+25%', req: '等级30以上' },
    { pet: '烈焰火羽', mount: '火焰冲锋', bonus: '移动速度+30%', req: '等级35以上' },
    { pet: '水翼精灵', mount: '水翼滑行', bonus: '水中移动速度+40%', req: '等级35以上' },
    { pet: '草叶精灵', mount: '藤蔓滑翔', bonus: '采集速度+20%', req: '等级30以上' },
    { pet: '齿轮小子', mount: '机甲合体', bonus: '防御+15%', req: '等级40以上' },
    { pet: '上岸蛙', mount: '蛙跳飞行', bonus: '跳跃高度+50%', req: '等级30以上' }
  ],
  api: {
    url: 'https://roco.gptvip.chat/api/magic-egg-lookup',
    source: 'https://wiki.biligame.com/rocom',
    license: 'CC BY-NC-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans'
  }
}
var eggData = eggData

var petImgMap = {
  '迪莫': 'JL dimo', '喵喵': 'JL miaomiao', '喵呜': 'JL miaowu', '魔力猫': 'JL molimiao',
  '火花': 'JL huohua', '焰火': 'JL yanhuo', '火神': 'JL huoshen',
  '水蓝蓝': 'JL shuilanlan', '波波拉': 'JL bobola', '水灵': 'JL shuiling',
  '鸭吉集': 'JL yajiji', '板板壳': 'JL banbanke', '咔咔壳': 'JL kakake', '水泡壳': 'JL shuipaoke',
  '锥尾羊': 'JL youlingyang', '铃兰羊': 'JL lanlingyang', '花影羚羊': 'JL guimeilingyang',
  '雪绒鸟': 'JL xuerongniao_dong', '冬羽雀': 'JL dongyuque', '岚鸟': 'JL lanniao',
  '小灵菇': 'JL xiaolinggu', '幻灵菇': 'JL youlinggu', '幻影灵菇': 'JL lunhuilinggu',
  '石肤蜥': 'JL huociyanxiyi', '石刺蜥': 'JL conglinluxiyi', '石冠王蜥': 'JL shihuacixiyi',
  '布是石': 'JL xiaobushi', '布是岩': 'JL bulaishi', '布克棱岩': 'JL bulaikeyan',
  '恶魔叮': 'JL emoding', '叮叮恶魔': 'JL dingdingemo',
  '毛毛': 'JL maomao', '爬爬': 'JL papa', '化蝶': 'JL huadie',
  '幽影树': 'JL youlingshu',
  '小鼠獭': 'JL xiaoshulan', '燕尾獭': 'JL dashulan', '卷胡巨獭': 'JL jushulan',
  '矿晶虫': 'JL kuangjingchong', '晶石蜗': 'JL jingshiwo',
  '奇丽草': 'JL qilicao', '奇丽叶': 'JL qiliye', '奇丽花': 'JL qilihua',
  '丢丢': 'JL diudiu', '卡卡虫': 'JL kakachong', '卡瓦重': 'JL kawachong',
  '护主犬': 'JL huzhuquan', '音速犬': 'JL yinsuquan',
  '绿耳松鼠': 'JL lversongshu', '抱枕松鼠': 'JL baozhensongshu', '蹦床松鼠': 'JL bengchuangsongshu',
  '嘟嘟煲': 'JL duudbao', '嘟嘟锅': 'JL duudguo',
  '小灵面': 'JL xiaoyoulinglian', '暗影灵面': 'JL youlinglian', '幽冥眼': 'JL youmingzhiyan',
  '梦游': 'JL menhyou', '梦悠悠': 'JL mengyouyou',
  '兽花蕾': 'JL shouhualei',
  '伏地兽': 'JL fudishou', '贪食鼹': 'JL shiyishou', '巨噬针鼹': 'JL wanzuishou',
  '蹦蹦种子': 'JL bengbengzhongzi', '蹦蹦草': 'JL bengbengcao', '蹦蹦花': 'JL bengbenghua',
  '电咩咩': 'JL dianmieemie', '粉咩咩': 'JL fenmieemie', '电球咩咩': 'JL dianqiumieemie',
  '蒲公英': 'JL pugongying', '蒲公英娃娃': 'JL pugongyingwawa',
  '伊贝儿': 'JL yibeier', '伊贝粉粉': 'JL yibeifenfen',
  '白发懒人': 'JL baifalanren', '动力猿': 'JL dongliyuan', '瞌睡王': 'JL keshuiwang',
  '海盔虫': 'JL haikuichong', '刺盔虫': 'JL cikuichong', '千棘盔': 'JL qianjikuichong',
  '菊花梨': 'JL juhuali',
  '小星光': 'JL xiaoxingguang', '星光狮': 'JL xingguangshi',
  '一窝蜂': 'JL yiwofeng', '黄蜂后': 'JL huangfenghou', '花魁蜂后': 'JL huakuifenghou',
  '小夜': 'JL xiaoye', '紫夜': 'JL ziye', '朔夜伊芙': 'JL shuoyeifu',
  '乖乖鹲': 'JL guaiguaimeng', '蓝珠天鹅': 'JL lanzhutiane', '翠顶夫人': 'JL cuidingfuren', '黑羽夫人': 'JL heiyufuren', '锤头鹲': 'JL chuitoumeng',
  '绿草精灵': 'JL lvcaojingling', '魔草巫灵': 'JL mocaowuling',
  '记忆石': 'JL jiyishi',
  '咔咔羽毛': 'JL kakayumao', '咔咔雀': 'JL kakaque', '咔咔鸟': 'JL kakaniao',
  '小草虫': 'JL xiaocaochong', '草衣虫': 'JL caoyichong', '花衣蝶': 'JL huayidie',
  '绿翼鸟': 'JL lvyiniao', '魔翼鸟': 'JL moyiniao', '魔眷鸟': 'JL mojuanniao',
  '爆焰仔': 'JL baoyanzai', '爆焰喷喷': 'JL baoyanpenpen',
  '猴麦仔': 'JL houmaizai', '音碟吼': 'JL yindiehou',
  '加油海葵': 'JL jiayouhaikui', '加油蟹': 'JL jiayouxie',
  '小丑豆豆': 'JL xiaochoudoudou', '小丑兔': 'JL xiaochoutu', '小丑公爵': 'JL xiaochougongjue',
  '烟花团': 'JL yianhuatuan', '烟花伯爵': 'JL yianhuabojue',
  '咕咕帽': 'JL gugumao', '咕德帽帽': 'JL gudemama',
  '炫光迪迪': 'JL xuanguangdidi', '霹雳迪迪': 'JL pilididi',
  '小鼓象': 'JL xiaoguxiang', '巨鼓象': 'JL juguxiang',
  '牵线木偶': 'JL qianxianmuou', '帅帅魔偶': 'JL shuaishuaimuou',
  '学院呱呱': 'JL xueyuanguagua',
  '布瓜蝌': 'JL buguake', '上岸蛙': 'JL shanganwa',
  '火红尾': 'JL huohongwei', '雅丹鬃': 'JL yadanbin',
  '小雪人': 'JL xiaoxueren', '雪怪': 'JL xueguai',
  '乌达': 'JL wuda', '迷你乌': 'JL miniwu', '乌拉塔': 'JL wulata',
  '多灵': 'JL duoling', '多灵主': 'JL duolingzhu',
  '圣剑侍从': 'JL shengjianshicong', '圣剑-X': 'JL shengjianX',
  '枫枫迪迪': 'JL xuanguangdidi'
}
var db = null



var petImgMap = {
  '迪莫': 'JL dimo', '喵喵': 'JL miaomiao', '喵呜': 'JL miaowu', '魔力猫': 'JL molimiao',
  '火花': 'JL huohua', '焰火': 'JL yanhuo', '火神': 'JL huoshen',
  '水蓝蓝': 'JL shuilanlan', '波波拉': 'JL bobola', '水灵': 'JL shuiling',
  '鸭吉集': 'JL yajiji', '板板壳': 'JL banbanke', '咔咔壳': 'JL kakake', '水泡壳': 'JL shuipaoke',
  '锥尾羊': 'JL youlingyang', '铃兰羊': 'JL lanlingyang', '花影羚羊': 'JL guimeilingyang',
  '雪绒鸟': 'JL xuerongniao_dong', '冬羽雀': 'JL dongyuque', '岚鸟': 'JL lanniao',
  '小灵菇': 'JL xiaolinggu', '幻灵菇': 'JL youlinggu', '幻影灵菇': 'JL lunhuilinggu',
  '石肤蜥': 'JL huociyanxiyi', '石刺蜥': 'JL conglinluxiyi', '石冠王蜥': 'JL shihuacixiyi',
  '布是石': 'JL xiaobushi', '布是岩': 'JL bulaishi', '布克棱岩': 'JL bulaikeyan',
  '恶魔叮': 'JL emoding', '叮叮恶魔': 'JL dingdingemo',
  '毛毛': 'JL maomao', '爬爬': 'JL papa', '化蝶': 'JL huadie',
  '幽影树': 'JL youlingshu',
  '小鼠獭': 'JL xiaoshulan', '燕尾獭': 'JL dashulan', '卷胡巨獭': 'JL jushulan',
  '矿晶虫': 'JL kuangjingchong', '晶石蜗': 'JL jingshiwo',
  '奇丽草': 'JL qilicao', '奇丽叶': 'JL qiliye', '奇丽花': 'JL qilihua',
  '丢丢': 'JL diudiu', '卡卡虫': 'JL kakachong', '卡瓦重': 'JL kawachong',
  '护主犬': 'JL huzhuquan', '音速犬': 'JL yinsuquan',
  '绿耳松鼠': 'JL lversongshu', '抱枕松鼠': 'JL baozhensongshu', '蹦床松鼠': 'JL bengchuangsongshu',
  '嘟嘟煲': 'JL duudbao', '嘟嘟锅': 'JL duudguo',
  '小灵面': 'JL xiaoyoulinglian', '暗影灵面': 'JL youlinglian', '幽冥眼': 'JL youmingzhiyan',
  '梦游': 'JL menhyou', '梦悠悠': 'JL mengyouyou',
  '兽花蕾': 'JL shouhualei',
  '伏地兽': 'JL fudishou', '贪食鼹': 'JL shiyishou', '巨噬针鼹': 'JL wanzuishou',
  '蹦蹦种子': 'JL bengbengzhongzi', '蹦蹦草': 'JL bengbengcao', '蹦蹦花': 'JL bengbenghua',
  '电咩咩': 'JL dianmieemie', '粉咩咩': 'JL fenmieemie', '电球咩咩': 'JL dianqiumieemie',
  '蒲公英': 'JL pugongying', '蒲公英娃娃': 'JL pugongyingwawa',
  '伊贝儿': 'JL yibeier', '伊贝粉粉': 'JL yibeifenfen',
  '白发懒人': 'JL baifalanren', '动力猿': 'JL dongliyuan', '瞌睡王': 'JL keshuiwang',
  '海盔虫': 'JL haikuichong', '刺盔虫': 'JL cikuichong', '千棘盔': 'JL qianjikuichong',
  '菊花梨': 'JL juhuali',
  '小星光': 'JL xiaoxingguang', '星光狮': 'JL xingguangshi',
  '一窝蜂': 'JL yiwofeng', '黄蜂后': 'JL huangfenghou', '花魁蜂后': 'JL huakuifenghou',
  '小夜': 'JL xiaoye', '紫夜': 'JL ziye', '朔夜伊芙': 'JL shuoyeifu',
  '乖乖鹲': 'JL guaiguaimeng', '蓝珠天鹅': 'JL lanzhutiane', '翠顶夫人': 'JL cuidingfuren', '黑羽夫人': 'JL heiyufuren', '锤头鹲': 'JL chuitoumeng',
  '绿草精灵': 'JL lvcaojingling', '魔草巫灵': 'JL mocaowuling',
  '记忆石': 'JL jiyishi',
  '咔咔羽毛': 'JL kakayumao', '咔咔雀': 'JL kakaque', '咔咔鸟': 'JL kakaniao',
  '小草虫': 'JL xiaocaochong', '草衣虫': 'JL caoyichong', '花衣蝶': 'JL huayidie',
  '绿翼鸟': 'JL lvyiniao', '魔翼鸟': 'JL moyiniao', '魔眷鸟': 'JL mojuanniao',
  '爆焰仔': 'JL baoyanzai', '爆焰喷喷': 'JL baoyanpenpen',
  '猴麦仔': 'JL houmaizai', '音碟吼': 'JL yindiehou',
  '加油海葵': 'JL jiayouhaikui', '加油蟹': 'JL jiayouxie',
  '小丑豆豆': 'JL xiaochoudoudou', '小丑兔': 'JL xiaochoutu', '小丑公爵': 'JL xiaochougongjue',
  '烟花团': 'JL yianhuatuan', '烟花伯爵': 'JL yianhuabojue',
  '咕咕帽': 'JL gugumao', '咕德帽帽': 'JL gudemama',
  '炫光迪迪': 'JL xuanguangdidi', '霹雳迪迪': 'JL pilididi',
  '小鼓象': 'JL xiaoguxiang', '巨鼓象': 'JL juguxiang',
  '牵线木偶': 'JL qianxianmuou', '帅帅魔偶': 'JL shuaishuaimuou',
  '学院呱呱': 'JL xueyuanguagua',
  '布瓜蝌': 'JL buguake', '上岸蛙': 'JL shanganwa',
  '火红尾': 'JL huohongwei', '雅丹鬃': 'JL yadanbin',
  '小雪人': 'JL xiaoxueren', '雪怪': 'JL xueguai',
  '乌达': 'JL wuda', '迷你乌': 'JL miniwu', '乌拉塔': 'JL wulata',
  '多灵': 'JL duoling', '多灵主': 'JL duolingzhu',
  '圣剑侍从': 'JL shengjianshicong', '圣剑-X': 'JL shengjianX',
  '枫枫迪迪': 'JL xuanguangdidi'
}
var db = null

function getEggImgUrl(name) {
  var fn = petImgMap[name]
  if (!fn) return ''
  return 'https://wiki.biligame.com/rocom/Special:FilePath/' + fn + '.png'
}

Page({
  data: {
    pets: [],
    filteredPets: [],
    groups: [],
    activeGroup: '',
    searchKeyword: '',
    showSuggest: false,
    suggestList: [],
    selectedPet: null,
    loading: true,
    // 模拟器数据
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
      '怪兽': '#d32f2f', '虫': '#7cb342', '飞行': '#42a5f5', '毒': '#ab47bc',
      '地面': '#8d6e63', '岩石': '#78909c', '鬼': '#5c6bc0', '钢': '#90a4ae',
      '火': '#ff7043', '草': '#66bb6a', '电': '#fdd835', '龙': '#7e57c2',
      '水': '#29b6f6', '妖精': '#f48fb1', '格斗': '#ef5350', '冰': '#26c6da',
      '超能力': '#ec407a', '恶': '#455a64'
    },
    eggTypeEmoji: {
      '火': '🔥', '水': '💧', '草': '🌿', '电': '⚡', '冰': '❄️',
      '龙': '🐉', '恶': '👿', '飞行': '🕊️', '格斗': '👊', '毒': '☠️',
      '地面': '⛰️', '岩石': '🪨', '鬼': '👻', '钢': '⚙️', '妖精': '🧚',
      '超能力': '🔮', '虫': '🐛', '普通': '⭐'
    },
    eggTypeColors: {
      '火': '#ff7043', '水': '#29b6f6', '草': '#66bb6a', '电': '#fdd835',
      '冰': '#26c6da', '龙': '#7e57c2', '恶': '#455a64', '飞行': '#42a5f5',
      '格斗': '#ef5350', '毒': '#ab47bc', '地面': '#8d6e63', '岩石': '#78909c',
      '鬼': '#5c6bc0', '钢': '#90a4ae', '妖精': '#f48fb1', '超能力': '#ec407a',
      '虫': '#7cb342', '普通': '#ffa726'
    }
  },
  onLoad: function() {
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
            pets[i].imgUrl = getEggImgUrl(pets[i].name)
          }
          self.setData({ pets: pets, filteredPets: pets, simFilteredPets: pets, loading: false })
        }
      }).catch(function() {
        // Already has local fallback, no need to force reload
      })
    }
  },
  loadLocalFallbackData: function() {
    if (this.data.pets.length > 0) return // 避免重复加载
    var self = this
    var localPets = eggData.pets || []
    var processedPets = []
    
    for (var i = 0; i < localPets.length; i++) {
      var p = Object.assign({}, localPets[i])
      // 兼容 data.pets 中没有 types 数组的情况
      if (!p.types) {
        p.types = []
        if (p.type1) p.types.push(p.type1)
        if (p.type2) p.types.push(p.type2)
      }
      p.groupStr = p.group ? p.group.join(', ') : ''
      p.imgUrl = getEggImgUrl(p.name)
      processedPets.push(p)
    }

    // 动态生成本地蛋组信息
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

    self.setData({
      pets: processedPets,
      filteredPets: processedPets,
      simFilteredPets: processedPets,
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
    var pets = self.data.pets
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].name.indexOf(keyword) >= 0) {
        results.push(pets[i])
      }
    }
    self.setData({ showSuggest: true, suggestList: results.slice(0, 10) })
    if (results.length > 0) {
      self.setData({ filteredPets: results, activeGroup: '' })
    }
  },
  selectSuggest: function(e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      selectedPet: item,
      searchKeyword: item.name,
      showSuggest: false,
      suggestList: [],
      filteredPets: [item]
    })
  },
  clearSearch: function() {
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
    var pets = self.data.pets
    if (!group) {
      self.setData({ filteredPets: pets })
      return
    }
    var filtered = []
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].group && pets[i].group.indexOf(group) >= 0) {
        filtered.push(pets[i])
      }
    }
    self.setData({ filteredPets: filtered })
  },
  selectPet: function(e) {
    var item = e.currentTarget.dataset.item
    var self = this
    
    // 如果已经选中了该精灵，则取消选中
    if (this.data.selectedPet && this.data.selectedPet.name === item.name) {
      this.setData({ selectedPet: null })
      this.filterByGroup()
      return
    }

    this.setData({ selectedPet: item })
    
    // 孵蛋反查逻辑：显示同蛋组的所有精灵
    if (item.group && item.group.length > 0) {
      var filtered = []
      var pets = self.data.pets
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
      this.setData({ filteredPets: filtered, activeGroup: '' })
      
      wx.showToast({
        title: '已筛选同蛋组对象',
        icon: 'none',
        duration: 1500
      })
    }
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },

  // 模拟器方法
  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },
  onMotherPickerChange: function(e) {
    var index = e.detail.value
    var pet = this.data.pets[index]
    this.selectMotherPet(pet)
  },
  onFatherPickerChange: function(e) {
    var index = e.detail.value
    var pet = this.data.compatibleFathers[index]
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
    var pets = self.data.pets
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
      '喵鸣': '喵喵', '魔力猫': '喵喵', '武斗酷猫': '喵喵',
      '焰火': '火花', '火神': '火花', '烈火战神': '火花',
      '波波拉': '水蓝蓝', '水灵': '水蓝蓝', '圣水守护': '水蓝蓝',
      '火红尾': '火红尾', '雅丹鬃': '火红尾',
      '小雪人': '小雪人', '雪怪': '小雪人',
      '迷你乌': '乌达', '乌拉塔': '乌达',
      '多灵主': '多灵',
      '圣剑-X': '圣剑侍从',
      '大块头': '大块头', '小块头': '大块头',
      '雪人呱呱': '呱呱', '逍遥呱呱': '呱呱', '武生呱呱': '呱呱', '文静呱呱': '呱呱', '学院呱呱': '呱呱',
      '爆焰喷喷': '爆焰仔',
      '音碟吼': '猴麦仔',
      '加油蟹': '加油海葵',
      '小丑公爵': '小丑豆豆', '小丑兔': '小丑豆豆',
      '烟花伯爵': '烟花团',
      '咕德帽幕': '咕咕帽',
      '霹雳迪迪': '炫光迪迪',
      '巨鼓象': '小鼓象',
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
    return { title: '洛手助手 - 精灵蛋培育模拟', path: '/pages/eggCalc/eggCalc', imageUrl: '/images/banner1.png' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手 - 模拟精灵蛋培育，预测后代属性', imageUrl: '/images/banner1.png' }
  }
})
