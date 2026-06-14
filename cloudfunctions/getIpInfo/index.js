const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const db = cloud.database()
    
    if (event.latitude && event.longitude) {
      const lat = event.latitude
      const lng = event.longitude
      
      try {
        const http = require('http')
        const result = await new Promise((resolve) => {
          const timer = setTimeout(() => resolve(''), 5000)
          http.get(`http://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`, { timeout: 5000 }, (res) => {
            let data = ''
            res.on('data', chunk => { data += chunk })
            res.on('end', () => {
              clearTimeout(timer)
              try {
                const info = JSON.parse(data)
                if (info.status === 0 && info.result) {
                  resolve(info.result.address_component.province || '')
                } else {
                  resolve('')
                }
              } catch (e) { resolve('') }
            })
          }).on('error', () => { clearTimeout(timer); resolve('') })
        })
        
        if (result) {
          return { province: result }
        }
      } catch (e) {
        console.error('经纬度转省份失败:', e)
      }
    }
    
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
