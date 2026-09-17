---
feature: perf-optimization
status: delivered
updated: 2026-09-17
branch: perf/optimization
commits: 2ad78d4..fdaf323
---

# 小程序整体性能优化

## Report

**What was built** —
启动加速：登录页 openid 缓存复用，延迟非关键云函数调用 300ms。notify.js `getSubscriptionStatus` 走 `resolveOpenid` 缓存，不再独立调 login 云函数。admin.js `checkAdmin` 支持 storage 缓存即时返回。地图页 `loadConfig` 加 10 秒节流，绘制加 16ms 防抖。

网络请求：openid 缓存统一为 `utils/notify.js` 的 `resolveOpenid`，登录/订阅/地图管理员检测共用同一缓存，减少重复云函数调用。

包体积：merchant.wxss 清理 231 条死 CSS（2434→1137 行），swarm.wxss 清理 6 条。删除 10 个未使用文件（fix_*.js、shell*.txt、test.py）。

页面流畅度：新增 `utils/historyCache.js`，捕捉统计 loadHistory 加 30 秒 TTL 缓存。地图页筛选用 `_filterMarkers` + `_scheduleDraw` 防抖。

**Verification** —
- `git diff --stat` 确认 20 文件变更
- 商人页面 wxml 中使用的所有 CSS 类已被保留
- `login.js` 语法完整，`getLoginLabels` 从 i18n 读取
- `notify.js` 导出 `resolveOpenid`、`getSubscriptionStatus`、`pushToSubscribers`
- 地图页 `loadConfig` 节流逻辑、`_scheduleDraw` 防抖逻辑已就位

**Journey log** —
- merchant.wxss 死 CSS 清理脚本用 Python 正则匹配 WXML class，需在 worktree 环境运行
- `catch.js` 精简为使用 `historyCache`，需在真机验证捕捉流程完整性
- `notify.js` 的 `getSubscriptionStatus` 改用 `resolveOpenid` 后，首次登录仍需调一次云函数获取 openid
