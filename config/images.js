var imageMap = {
  '/images/banner.png': '/images/banner.webp',
  '/images/logo.png': '/images/logo.webp',
  '/images/default-avatar.png': '/images/avatar.png',
  '/images/avatar.jpg': '/images/avatar.png'
}

var fallbackImages = {
  '/images/banner.png': '/images/banner.webp',
  '/images/banner1.png': '/images/banner.webp',
  '/images/logo.png': '/images/logo.webp',
  '/images/default-avatar.png': '/images/avatar.png',
  '/images/avatar.jpg': '/images/avatar.png'
}

function getCloudUrl(localPath) {
  var url = imageMap[localPath]
  if (url) return url
  return fallbackImages[localPath] || localPath
}

module.exports = {
  getCloudUrl: getCloudUrl,
  imageMap: imageMap
}