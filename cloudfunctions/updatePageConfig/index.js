const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { docId, updateData } = event
  try {
    const res = await db.collection('page_config').doc(docId).update({
      data: updateData
    })
    return { success: true, res }
  } catch (err) {
    try {
      const addRes = await db.collection('page_config').add({
        data: { _id: docId, ...updateData }
      })
      return { success: true, res: addRes }
    } catch (e) {
      return { success: false, error: e }
    }
  }
}
