Page({
  data: { buildTime: '', contact: 'flyzccboard@yeah.net' },
  onShow() {
    const n = new Date()
    this.setData({ buildTime: `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')} ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}` })
  },
  copyEmail() { wx.setClipboardData({ data: this.data.contact, success() { wx.showToast({ title: '已复制', icon: 'success' }) } }) },
  copyAll() {
    wx.setClipboardData({ data: `洛克王国：世界 攻略小程序\n版本: 1.0.0\n开发者: 浙里本杰明\n邮箱: ${this.data.contact}\n更新: ${this.data.buildTime}\n数据来源: https://rocom.qq.com/main/\n\n隐私政策:\n- 不收集个人信息\n- 不进行网络请求\n- 仅本地存储订阅偏好\n- 无第三方SDK` })
  },
  onShareAppMessage() { return { title: '洛克王国：世界攻略', path: '/pages/index/index' } }
})
