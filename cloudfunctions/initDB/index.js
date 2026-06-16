const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const collections = ['subscribers']
  const results = []

  for (const name of collections) {
    try {
      await db.createCollection(name)
      results.push({ name, status: 'created' })
    } catch (e) {
      if (e.errCode === -502005 || (e.message && e.message.indexOf('already exists') > -1)) {
        results.push({ name, status: 'already exists' })
      } else {
        results.push({ name, status: 'error', error: e.message })
      }
    }
  }

  return { success: true, results }
}
