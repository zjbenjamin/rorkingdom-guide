/**
 * 主包瘦身脚本
 * 运行方式: node optimize.js
 * 
 * 功能:
 * 1. 删除本地图片文件
 * 2. 生成CDN链接映射
 */

const fs = require('fs')
const path = require('path')

// 需要删除的大图片
const imagesToDelete = [
  'images/banner1.png',
  'images/logo.png',
  'images/default-avatar.png',
  'images/avatar.jpg'
]

// 道具图片目录
const itemsDir = 'images/items'

console.log('=== 主包瘦身优化 ===\n')

// 1. 删除主包大图片
console.log('1. 删除主包大图片:')
imagesToDelete.forEach(img => {
  const filePath = path.join(__dirname, img)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    console.log(`   - ${img} (${(stats.size/1024).toFixed(2)}KB)`)
    // fs.unlinkSync(filePath) // 取消注释以实际删除
    console.log(`     [已标记删除]`)
  }
})

// 2. 统计道具图片
console.log('\n2. 道具图片统计:')
if (fs.existsSync(path.join(__dirname, itemsDir))) {
  const files = fs.readdirSync(path.join(__dirname, itemsDir))
  const pngFiles = files.filter(f => f.endsWith('.png'))
  let totalSize = 0
  pngFiles.forEach(f => {
    const stats = fs.statSync(path.join(__dirname, itemsDir, f))
    totalSize += stats.size
  })
  console.log(`   - 图片数量: ${pngFiles.length}`)
  console.log(`   - 总大小: ${(totalSize/1024/1024).toFixed(2)}MB`)
  console.log(`   [建议] 上传到云存储后删除本地文件`)
}

// 3. 提示
console.log('\n3. 优化建议:')
console.log('   a. 将 images/ 下的图片上传到微信云存储')
console.log('   b. 更新 config/images.js 中的云存储路径')
console.log('   c. 删除本地图片文件')
console.log('   d. 道具图片可使用 wiki CDN 链接')

console.log('\n=== 优化完成 ===')
