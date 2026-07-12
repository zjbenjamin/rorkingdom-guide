const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const db = cloud.database()
    
    const openid = wxContext.OPENID || ''
    if (openid) {
      const userRes = await db.collection('users').where({ _openid: openid }).get()
      if (userRes.data.length > 0 && userRes.data[0].province) {
        return { province: userRes.data[0].province }
      }
    }
    
    return { province: '' }
  } catch (e) {
    console.error('获取归属地失败:', e)
    return { province: '' }
  }
}
