const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { action, keyword, group } = event
  const db = cloud.database()
  
  if (action === 'search') {
    const pets = await db.collection('egg_pets').limit(1000).get()
    const result = pets.data.filter(p => {
      return p.name.indexOf(keyword) >= 0 || 
             (p.group && p.group.some(g => g.indexOf(keyword) >= 0))
    })
    return { success: true, data: result }
  }
  
  if (action === 'query') {
    const pets = await db.collection('egg_pets').limit(1000).get()
    const result = group ? pets.data.filter(p => p.group && p.group.includes(group)) : pets.data
    return { success: true, data: result }
  }
  
  if (action === 'groups') {
    const pets = await db.collection('egg_pets').limit(1000).get()
    const groupMap = {}
    for (const p of pets.data) {
      if (p.group) {
        for (const g of p.group) {
          if (!groupMap[g]) groupMap[g] = 0
          groupMap[g]++
        }
      }
    }
    const groups = Object.keys(groupMap).map(name => ({ name, count: groupMap[name] }))
    groups.sort((a, b) => b.count - a.count)
    return { success: true, data: groups }
  }
  
  return { success: false, error: '未知操作' }
}
