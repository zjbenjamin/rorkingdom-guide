const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { userId } = event

  if (!userId) return { success: false, error: '缺少用户ID' }

  const adminDoc = await db.collection('admin_config').doc('admin').get()
  if (openid !== adminDoc.data.openid) return { success: false, error: '无管理员权限' }

  if (userId === adminDoc.data._id) return { success: false, error: '不能删除管理员' }

  await db.collection('users').doc(userId).remove()

  return { success: true }
}
