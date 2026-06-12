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
  sizes: [
    { id: 1, name: '大块头', icon: '💪', color: '#d32f2f', desc: '体型较大的精灵蛋，孵化出的精灵体型偏大', prob: '10%', bonus: '生命值+5%' },
    { id: 2, name: '小块头', icon: '👶', color: '#1a6d37', desc: '体型较小的精灵蛋，孵化出的精灵体型偏小', prob: '10%', bonus: '速度+5%' },
    { id: 3, name: '炫彩蛋', icon: '🌈', color: '#9c27b0', desc: '稀有炫彩外观的精灵蛋，有概率孵出闪光精灵', prob: '5%', bonus: '全属性+3%' },
    { id: 4, name: '普通蛋', icon: '🥚', color: '#999', desc: '最常见的精灵蛋', prob: '75%', bonus: '无' }
  ],
  pets: [
    { name: '迪莫', type: '光', egg: '普通蛋', loc: '魔法学院' },
    { name: '喵喵', type: '草', egg: '草系蛋', loc: '轻风山' },
    { name: '火花', type: '火', egg: '火系蛋', loc: '轻风山' },
    { name: '水蓝蓝', type: '水', egg: '水系蛋', loc: '轻风山' },
    { name: '齿轮小子', type: '机械', egg: '机械蛋', loc: '王国城堡' },
    { name: '上岸蛙', type: '幻', egg: '幻系蛋', loc: '采邑地' },
    { name: '极光迪莫', type: '普通', egg: '普通蛋', loc: '进化获得' },
    { name: '烈焰火羽', type: '火', egg: '火系蛋', loc: '进化获得' },
    { name: '水翼精灵', type: '水', egg: '水系蛋', loc: '进化获得' },
    { name: '草叶精灵', type: '草', egg: '草系蛋', loc: '进化获得' }
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
    source: 'https://github.com/OatmeaILL/zhenxun_roco_egg_query'
  }
}
module.exports = eggData
