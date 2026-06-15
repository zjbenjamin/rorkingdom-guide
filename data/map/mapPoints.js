var mapData = {
  categories: [
    {
      name: '地点',
      icon: '📍',
      items: [
        { id: 201, name: '庇护所', icon: '🏕️' },
        { id: 202, name: '传送点', icon: '🌀' },
        { id: 203, name: '炼金台', icon: '⚗️' },
        { id: 204, name: '副本', icon: '⚔️' },
        { id: 205, name: '服装店', icon: '👔' },
        { id: 206, name: '商店', icon: '🏪' },
        { id: 207, name: '扭蛋机', icon: '🎰' },
        { id: 208, name: '重量解谜', icon: '⚖️' },
        { id: 209, name: '小游戏', icon: '🎮' }
      ]
    },
    {
      name: '宝箱',
      icon: '📦',
      items: [
        { id: 301, name: '普通宝箱', icon: '📦' },
        { id: 302, name: '稀有宝箱', icon: '🎁' },
        { id: 303, name: '珍贵宝箱', icon: '💎' },
        { id: 304, name: '华丽宝箱', icon: '👑' },
        { id: 305, name: '普通系宝箱', icon: '📦' },
        { id: 306, name: '草系宝箱', icon: '🌿' },
        { id: 307, name: '火系宝箱', icon: '🔥' },
        { id: 308, name: '水系宝箱', icon: '💧' },
        { id: 309, name: '光系宝箱', icon: '✨' },
        { id: 310, name: '地系宝箱', icon: '⛰️' },
        { id: 311, name: '冰系宝箱', icon: '❄️' },
        { id: 312, name: '龙系宝箱', icon: '🐉' },
        { id: 313, name: '电系宝箱', icon: '⚡' },
        { id: 314, name: '毒系宝箱', icon: '☠️' },
        { id: 315, name: '虫系宝箱', icon: '🐛' },
        { id: 316, name: '武系宝箱', icon: '👊' },
        { id: 317, name: '翼系宝箱', icon: '🕊️' },
        { id: 318, name: '萌系宝箱', icon: '🧚' },
        { id: 319, name: '幽系宝箱', icon: '👻' },
        { id: 320, name: '恶系宝箱', icon: '👿' },
        { id: 321, name: '机械系宝箱', icon: '⚙️' },
        { id: 322, name: '幻系宝箱', icon: '🔮' }
      ]
    },
    {
      name: '收集',
      icon: '🎒',
      items: [
        { id: 801, name: '果实', icon: '🍎' },
        { id: 802, name: '眠枭之星（蓝）', icon: '⭐' },
        { id: 803, name: '眠枭之星（金）', icon: '🌟' },
        { id: 807, name: '可可果', icon: '🥥' },
        { id: 808, name: '无花果', icon: '🫒' },
        { id: 809, name: '魔力果', icon: '✨' },
        { id: 810, name: '乐谱', icon: '🎵' }
      ]
    },
    {
      name: '采集',
      icon: '🪓',
      items: [
        { id: 701, name: '黑晶琉璃', icon: '🖤' },
        { id: 702, name: '黄石榴石', icon: '💛' },
        { id: 703, name: '蓝晶碧玺', icon: '💙' },
        { id: 704, name: '紫莲刚玉', icon: '💜' },
        { id: 705, name: '向阳花', icon: '🌻' },
        { id: 706, name: '喵喵草', icon: '🐱' },
        { id: 707, name: '蓝掌', icon: '💙' },
        { id: 708, name: '睡铃', icon: '🔔' },
        { id: 709, name: '天使草', icon: '👼' },
        { id: 710, name: '石耳', icon: '🪨' },
        { id: 711, name: '伞伞菌', icon: '🍄' },
        { id: 712, name: '蜜黄菌', icon: '🍯' },
        { id: 713, name: '喷气菇', icon: '💨' },
        { id: 714, name: '凤眼莲', icon: '🌸' },
        { id: 715, name: '蜂窝', icon: '🐝' },
        { id: 716, name: '星霜花', icon: '❄️' },
        { id: 717, name: '荧光兰', icon: '🌈' },
        { id: 718, name: '大嘴花', icon: '🌺' },
        { id: 719, name: '流星兰', icon: '💫' },
        { id: 720, name: '紫晶菇', icon: '💜' },
        { id: 721, name: '海桑花', icon: '🌊' },
        { id: 723, name: '彩玉花', icon: '🌈' },
        { id: 724, name: '象牙花', icon: '🤍' },
        { id: 725, name: '风卷草', icon: '💨' },
        { id: 726, name: '海珊瑚', icon: '🪸' },
        { id: 727, name: '海神花', icon: '🔱' },
        { id: 728, name: '紫雀花', icon: '💜' },
        { id: 729, name: '恶魔雪茄', icon: '🚬' },
        { id: 730, name: '骨片', icon: '🦴' },
        { id: 731, name: '花星角', icon: '⭐' },
        { id: 732, name: '火焰花', icon: '🔥' },
        { id: 733, name: '雪菇', icon: '❄️' },
        { id: 734, name: '幽幽草', icon: '👻' },
        { id: 735, name: '幽幽鬼火', icon: '🔥' },
        { id: 736, name: '藻羽花', icon: '🌊' },
        { id: 737, name: '洋红珊瑚', icon: '🪸' },
        { id: 738, name: '杏黄贝', icon: '🐚' },
        { id: 739, name: '短木莲', icon: '🌳' }
      ]
    },
    {
      name: '任务',
      icon: '📋',
      items: [
        { id: 401, name: '拾遗任务', icon: '📝' },
        { id: 402, name: '奇谭任务', icon: '📖' },
        { id: 403, name: '旅途任务', icon: '🗺️' }
      ]
    },
    {
      name: '战斗',
      icon: '⚔️',
      items: [
        { id: 601, name: '露天挑战', icon: '🏟️' },
        { id: 602, name: '黑衣人', icon: '🖤' }
      ]
    },
    {
      name: '互动事件',
      icon: '🎯',
      items: [
        { id: 1001, name: '天气石像', icon: '🗿' },
        { id: 1002, name: '石碑', icon: '🪦' },
        { id: 1003, name: '火盆', icon: '🔥' },
        { id: 1004, name: '问答挑战', icon: '❓' }
      ]
    }
  ],
  source: 'https://wiki.biligame.com/rocom',
  license: 'CC BY-NC-SA 4.0'
}
module.exports = mapData
