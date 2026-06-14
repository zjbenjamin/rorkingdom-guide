const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function formatTime() {
  var d = new Date()
  var y = d.getFullYear()
  var m = String(d.getMonth() + 1).padStart(2, '0')
  var day = String(d.getDate()).padStart(2, '0')
  var h = String(d.getHours()).padStart(2, '0')
  var min = String(d.getMinutes()).padStart(2, '0')
  return y + '-' + m + '-' + day + ' ' + h + ':' + min
}

exports.main = async (event, context) => {
  const { type, title, content, touser, templateId, data, page } = event
  const wxContext = cloud.getWXContext()

  const TEMPLATE_IDS = {
    announcement: 'ZhxGKGtZi3uWIzFIQtxJrvfipuWgczL_tLwBRRKrdZ4',
    activity: 'Q3Z8_TsmfoPu3TiP24CYKYGISLFGiigaoUsYEIwpWzo',
    system: '46MLP0pv3NcTvZKAkrIAplKuo4hJhVMFDyPoGnjY7-o',
    merchant: 'lNJaEuu3rrWx4iU3xtCfnqzJAsZ83ILBWs0VI63h8Ps',
    interaction: '_m84sslh3ZvFj6UlEmDhlBzHSRzGUUr_qxRomEyQpds'
  }

  if (touser && templateId) {
    try {
      await cloud.openapi.subscribeMessage.send({
        touser: touser,
        templateId: templateId,
        page: page || '/pages/index/index',
        data: data || {
          thing1: { value: title || '新通知' },
          thing2: { value: content || '点击查看' },
          time3: { value: formatTime() }
        }
      })
      return { success: true, sent: 1 }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  const sendTemplateId = TEMPLATE_IDS[type]
  if (!sendTemplateId) return { success: false, error: '未知类型' }

  try {
    const db = cloud.database()
    const subscribers = await db.collection('subscribers')
      .where({ type: type, status: 'active' })
      .limit(100)
      .get()

    let sent = 0
    let failed = 0

    const defaultPage = type === 'announcement' ? '/pages/index/index' : 
                        type === 'activity' ? '/pages/activity/activity' :
                        type === 'system' ? '/pages/index/index' :
                        type === 'merchant' ? '/pages/merchant/merchant' : 
                        type === 'interaction' ? '/pages/community/community' :
                        '/pages/index/index'

    for (const sub of subscribers.data) {
      try {
        await cloud.openapi.subscribeMessage.send({
          touser: sub.openid,
          templateId: sendTemplateId,
          page: page || defaultPage,
          data: data || {
            thing1: { value: title || '新通知' },
            thing2: { value: content || '点击查看详细内容' },
            time3: { value: formatTime() }
          }
        })
        sent++
      } catch (e) {
        failed++
        if (e.errCode === 43101) {
          await db.collection('subscribers').doc(sub._id).update({
            data: { status: 'expired' }
          })
        }
      }
    }

    return { success: true, sent, failed, total: subscribers.data.length }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
