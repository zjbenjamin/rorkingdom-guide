const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const MAX = 100

  let allUsers = []
  let offset = 0
  while (true) {
    const res = await db.collection('users').skip(offset).limit(MAX).get()
    allUsers = allUsers.concat(res.data)
    if (res.data.length < MAX) break
    offset += MAX
  }

  const openidMap = {}
  for (const user of allUsers) {
    const oid = user._openid
    if (!oid) continue
    if (!openidMap[oid]) {
      openidMap[oid] = []
    }
    openidMap[oid].push(user)
  }

  let deleted = 0
  let kept = 0

  for (const oid in openidMap) {
    const records = openidMap[oid]
    if (records.length <= 1) {
      kept++
      continue
    }
    records.sort((a, b) => {
      const ta = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
      const tb = b.lastLogin ? new Date(b.lastLogin).getTime() : 0
      return tb - ta
    })
    const keepRecord = records[0]
    for (let i = 1; i < records.length; i++) {
      await db.collection('users').doc(records[i]._id).remove()
      deleted++
    }
    kept++
  }

  return {
    totalRecords: allUsers.length,
    uniqueUsers: kept,
    deletedDuplicates: deleted
  }
}
