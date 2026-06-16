Page({
  onLoad: function() {
    console.log("检测到访问已删除的页面，自动重定向至首页...");
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});