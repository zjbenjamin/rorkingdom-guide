module.exports = {
  initBgAudio: function(page) {
    if (page._bgAudioInited) return
    page._bgAudioInited = true
    var bgAudio = wx.getBackgroundAudioManager()
    bgAudio.onPlay(function() { page.setData({ isPlaying: true }) })
    bgAudio.onPause(function() { page.setData({ isPlaying: false }) })
    bgAudio.onStop(function() { page.setData({ isPlaying: false, currentPlayUrl: '' }) })
    bgAudio.onEnded(function() { page.setData({ isPlaying: false, currentPlayUrl: '' }) })
    bgAudio.onError(function(res) {
      console.error('Audio play error:', res)
      page.setData({ isPlaying: false, currentPlayUrl: '' })
      wx.showModal({
        title: '播放失败',
        content: '音频加载失败(错误码 10001)。这可能是因为：\n1. 该歌曲属VIP或版权限制，无法直接播放外链；\n2. 微信开发者工具未开启"不校验合法域名"设置；\n建议复制链接到浏览器或音乐App中打开听歌。',
        showCancel: false
      })
    })
  },

  playSong: function(page, e) {
    this.initBgAudio(page)
    var url = e.currentTarget.dataset.url
    var name = e.currentTarget.dataset.name || '推荐单曲'

    var directUrl = null
    if (/\.(mp3|m4a|wav|aac|mp4|ogg)($|\?)/i.test(url)) {
      directUrl = url
    } else if (url.indexOf('163.com') > -1 || url.indexOf('163cn.tv') > -1) {
      var idMatch = url.match(/(?:id=|song\/)(\d+)/)
      if (idMatch && idMatch[1]) {
        directUrl = 'https://music.163.com/song/media/outer/url?id=' + idMatch[1] + '.mp3'
      }
    }

    if (directUrl) {
      this.playBgAudio(page, url, directUrl, name)
      return
    }

    var isQQ = /qq\.com|qqmusic/i.test(url)
    var isNetEase = /163\.com|163cn\.tv/i.test(url)
    if (isQQ || isNetEase) {
      wx.showLoading({ title: '加载音乐中...' })
      wx.cloud.callFunction({
        name: 'parseBilibili',
        data: { url: url },
        success: function(res) {
          wx.hideLoading()
          if (res.result && res.result.code === 0 && res.result.data && res.result.data.videoUrl) {
            var musicUrl = res.result.data.videoUrl
            var musicTitle = res.result.data.title || name
            this.playBgAudio(page, url, musicUrl, musicTitle)
          } else {
            this.playSongFallback(url)
          }
        }.bind(this),
        fail: function(err) {
          console.error('音乐解析失败:', err)
          wx.hideLoading()
          this.playSongFallback(url)
        }.bind(this)
      })
      return
    }

    this.playSongFallback(url)
  },

  playBgAudio: function(page, url, directUrl, name) {
    var bgAudio = wx.getBackgroundAudioManager()

    if (page.data.currentPlayUrl === url && page.data.isPlaying) {
      bgAudio.pause()
      page.setData({ isPlaying: false })
      return
    }

    page.setData({
      currentPlayUrl: url,
      isPlaying: true
    })

    bgAudio.title = name
    bgAudio.epname = '音乐分享'
    bgAudio.singer = '洛手助手'
    bgAudio.src = directUrl
  },

  playSongFallback: function(url) {
    wx.setClipboardData({
      data: url,
      success: function() {
        wx.showModal({
          title: '听歌链接已复制',
          content: '该音乐暂不支持在小程序内直接播放，已复制链接到剪贴板，请到浏览器或官方音乐APP中打开听歌！',
          showCancel: false
        })
      }
    })
  }
}
