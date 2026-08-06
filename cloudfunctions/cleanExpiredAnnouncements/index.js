const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const now = new Date()
  let deletedCount = 0
  let errorCount = 0

  try {
    // 查找所有已过期的公告（endDate < 当前时间）
    const expiredRes = await db.collection('announcements')
      .where({
        endDate: _.lt(now.toISOString().substring(0, 10))
      })
      .limit(100)
      .get()

    const expiredList = expiredRes.data || []
    console.log(`找到 ${expiredList.length} 条过期公告`)

    for (const item of expiredList) {
      try {
        // 删除关联的云存储文件
        if (item.image && item.image.startsWith('cloud://')) {
          await cloud.deleteFile({ fileList: [item.image] }).catch(err => {
            console.warn(`删除图片失败: ${item.image}`, err)
          })
        }

        // 删除公告记录
        await db.collection('announcements').doc(item._id).remove()
        deletedCount++
        console.log(`已删除公告: ${item._id} - ${item.title}`)
      } catch (err) {
        errorCount++
        console.error(`删除公告失败: ${item._id}`, err)
      }
    }

    return {
      success: true,
      deletedCount,
      errorCount,
      total: expiredList.length
    }
  } catch (err) {
    console.error('清理过期公告失败:', err)
    return {
      success: false,
      error: err.message,
      deletedCount,
      errorCount
    }
  }
}
