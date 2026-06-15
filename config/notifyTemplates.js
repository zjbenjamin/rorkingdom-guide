/**
 * 通知模板配置
 * 
 * ==================== 配置说明 ====================
 * 
 * 1. 登录微信公众平台 (mp.weixin.qq.com)
 * 2. 进入 功能 -> 订阅消息
 * 3. 选择"一次性订阅消息"
 * 4. 点击"选用"按钮，搜索并选择合适的模板
 * 5. 复制模板ID（格式如：kS3TnJXGQ1v3Lz5k6J8mN7pQrS4tU5vW）
 * 6. 替换下面对应的值
 * 
 * ==================== 推荐模板 ====================
 * 
 * 公告通知 (announcement):
 *   - 搜索关键词：通知、提醒、公告
 *   - 字段：通知类型、通知内容、通知时间
 * 
 * 活动提醒 (activity):
 *   - 搜索关键词：活动、日程、提醒
 *   - 字段：活动名称、活动时间、活动地点
 * 
 * 系统消息 (system):
 *   - 搜索关键词：系统、更新、维护
 *   - 字段：消息类型、消息内容、消息时间
 * 
 * 商人提醒 (merchant):
 *   - 搜索关键词：商品、上架、到货、购买
 *   - 字段：商品名称、价格、商品描述、上架时间
 * 
 * 互动通知 (interaction):
 *   - 搜索关键词：评论、回复、点赞、社交
 *   - 字段：互动内容、帖子内容、互动时间
 * 
 * ==================================================
 */

module.exports = {
  // 公告通知模板ID
  announcement: 'ZhxGKGtZi3uWIzFIQtxJrjK5XXLlwjXpEo7M0rBrfEs',
  
  // 活动提醒模板ID
  activity: 'hsIV8UY3gEeJnK4KNov09qRSfL196CyS5NzotPxz8hc',
  
  // 系统消息模板ID
  system: '46MLP0pv3NcTvZKAkrIApkj9DWvVQj_bR_mavRIzgf4',
  
  // 远行商人提醒模板ID
  merchant: 'lNJaEuu3rrWx4iU3xtCfnsAnlZzVf6lthZD8zraTw1Y',
  
  // 互动通知模板ID
  interaction: 'dfk9xCUuBSpqwJXHG0Cs_MkK9BQVxdYK_Cl3mzSAUi8'
}
