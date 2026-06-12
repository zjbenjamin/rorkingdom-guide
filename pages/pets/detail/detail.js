const { petsData } = require('../../../data/pets')
Page({
  data: { pet: null, tab: 'info' },
  onLoad(o) { const p = petsData.find(x => x.id === parseInt(o.id)); if (p) { this.setData({ pet: p }); wx.setNavigationBarTitle({ title: p.name }) } },
  onTab(e) { this.setData({ tab: e.currentTarget.dataset.t }) },
  onCopy() { const p = this.data.pet; wx.setClipboardData({ data: `${p.name}\n类型:${p.type}\n种族值:${p.total}\nHP:${p.hp} 攻击:${p.attack} 防御:${p.defense}\n特攻:${p.spAtk} 特防:${p.spDef} 速度:${p.speed}\n技能:${p.skills.join(',')}` }) },
  onShareAppMessage() { return { title: this.data.pet.name, path: `/pages/pets/detail/detail?id=${this.data.pet.id}` } }
})
