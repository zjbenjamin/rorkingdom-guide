const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { docId } = event

  if (!docId) return { success: false, error: '缺少订阅ID' }

  const adminDoc = await db.collection('admin_config').doc('admin').get()
  const isAdmin = openid === adminDoc.data.openid

  const userDoc = await db.collection('users').where({ _openid: openid }).get()
  const isEditor = userDoc.data.length > 0 && userDoc.data[0].role === 'editor'

  if (!isAdmin && !isEditor) return { success: false, error: '无删除权限' }

  await db.collection('subscribers').doc(docId).remove()

  return { success: true }
}
