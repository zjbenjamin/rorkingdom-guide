const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { postId } = event

  if (!postId) return { success: false, error: '缺少帖子ID' }

  const adminDoc = await db.collection('admin_config').doc('admin').get()
  const adminOpenid = adminDoc.data.openid
  if (openid !== adminOpenid) return { success: false, error: '无管理员权限' }

  const postDoc = await db.collection('comments').doc(postId).get()
  const post = postDoc.data

  if (post.images && post.images.length > 0) {
    const cloudImages = post.images.filter(url => url.startsWith('cloud://'))
    if (cloudImages.length > 0) {
      await cloud.deleteFile({ fileList: cloudImages }).catch(() => {})
    }
  }

  await db.collection('comments').doc(postId).remove()

  return { success: true }
}
