---
feature: perf-optimization
status: designed
updated: 2026-09-17
branch: perf/optimization
commits: 
---

# 小程序整体性能优化

## Report

## [S1] Problem
小程序在启动、页面切换、网络请求、包体积四个方面存在性能瓶颈，影响用户体验。

## [S2] Design

### 启动加载速度
- 登录页 `onLoad` 中 6 个云函数调用全部同步触发，改为关键路径优先 + 延迟加载
- `merchant.js` 的 `loadConfig` 在 `onShow` 每次触发，加节流
- 管理员检测结果缓存到 storage，避免每次进页面都调云函数

### 网络请求优化
- `notify.js` 的 `getSubscriptionStatus` 和 `login.js` 的 `getOpenId` 各自独立调 `login` 云函数，统一走 `getOpenId` 缓存
- `admin.js` 的 `checkAdmin` 和 `merchant.js` 的 `checkAdmin` 重复调用，统一走 `utils/admin.js`
- `merchant.js` 中 `checkSubscription` + `checkAdmin` + `loadConfig` 三个独立调用，合并为串行链

### 页面切换流畅度
- `merchant.wxss` 存在 80+ 个死 CSS 选择器（约 2000 行），删除可减少样式解析
- `catch.js` 的 `loadHistory` 每次 `onShow` 全量重新计算，加缓存
- 地图页 `filteredMarkers` 在每次筛选时全量重算，改为增量更新

### 包体积优化
- 删除 `merchant.wxss` 中的死 CSS（约占 40%）
- 删除 `swarm.wxss` 中未使用的 `.pet-select-row` 等选择器
- 删除未使用的 `fix_*.js` 脚本文件

## [S3] Out of Scope
- 不改动业务逻辑
- 不改动云数据库结构
- 不改动推送模板
- 不改动地图瓦片加载

## Tasks
- [ ] T1: 登录页 onLoad 云函数调用优化——缓存 openid + 延迟非关键调用 — acceptance: 登录页首次加载减少 2-3 个云函数调用 (covers: S2)
- [ ] T2: notify.js getSubscriptionStatus 走 getOpenId 缓存 — acceptance: 不再独立调 login 云函数 (covers: S2; depends: T1)
- [ ] T3: merchant.js checkAdmin 统一走 utils/admin.js + 缓存 — acceptance: 管理员检测使用统一函数 (covers: S2)
- [ ] T4: merchant.js loadConfig 加 onShow 节流 — acceptance: 短时间内多次 onShow 只发一次请求 (covers: S2)
- [ ] T5: 删除 merchant.wxss 死 CSS — acceptance: 未使用的选择器被移除，文件体积减少 (covers: S2)
- [ ] T6: 删除 swarm.wxss 死 CSS — acceptance: 未使用的选择器被移除 (covers: S2; depends: T5)
- [ ] T7: 删除未使用的 fix_*.js 脚本文件 — acceptance: 文件不存在 (covers: S2)
- [ ] T8: catch.js loadHistory 加缓存 — acceptance: 重复调用时使用缓存数据 (covers: S2; depends: T1)
- [ ] T9: 地图页筛选增量更新 — acceptance: 筛选时只更新变化的标记 (covers: S2)
