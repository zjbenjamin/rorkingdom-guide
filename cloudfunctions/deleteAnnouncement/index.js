const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { docId } = event

  if (!docId) return { success: false, error: '缺少公告ID' }

  const adminDoc = await db.collection('admin_config').doc('admin').get()
  if (openid !== adminDoc.data.openid) return { success: false, error: '无管理员权限' }

  const doc = await db.collection('announcements').doc(docId).get()
  const item = doc.data

  if (item.image && item.image.startsWith('cloud://')) {
    await cloud.deleteFile({ fileList: [item.image] }).catch(() => {})
  }

  await db.collection('announcements').doc(docId).remove()

  return { success: true }
}
