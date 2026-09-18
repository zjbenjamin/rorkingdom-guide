---
feature: perf-optimization
status: delivered
updated: 2026-09-18
branch: master
commits: 2ad78d4..8e8a9bc
---

# 小程序整体性能优化

## Report

**What was built** —
启动/网络：openid 统一缓存、地图节流防抖、捕捉统计 TTL。包体积三轮：
1. 删除 wiki/证书/脚本等脏文件并配置 `packOptions.ignore`，业务主包约 531KB；
2. 压缩主包图片至约 358KB（banner/avatar/logo/balls）；
3. IDE 仍报 3931KB：根因是项目根 `.worktrees/`（约 4.8MB）被打进主包。已将 ignore 增加 `.worktrees/.agents/aliyun-push-server/node_modules/data`，并把 worktree 迁至 `F:\rorkingdom-worktrees\`；`historyCache` 下沉到 `pages/catch/`，删除无引用的 `utils/pets.js`、`utils/translate.js`。

最终主包候选 **341.37KB**（36 文件），≤400KB 且 ≤1536KB。

**Verification** —
- 主包候选独立复核：36 文件 / 349563B / **341.37KB**（≤400KB、≤1536KB PASS）
- 项目根无 `.worktrees`；`git worktree list` 指向 `F:/rorkingdom-worktrees/*`
- `pages/catch/historyCache.js` 与 API 完整；全库无 `utils/historyCache|pets|translate` 引用
- `project.config.json` 25 条 ignore，含 folder `.worktrees`
- Review：无 critical；用户 WIP（activity.js/admin.wxml）未纳入本提交

**Journey log** —
- 微信主包按**项目根全部未 ignore 文件**计数，不是业务代码体积
- 隐藏目录（`.worktrees`）必须 packOptions ignore，且最好移出项目根
- packOptions folder 值：带前导 `.`、无尾斜杠（如 `.worktrees`）
- 主包内仅被分包 require 的 JS 会触发质量检测，应放进对应分包
- 上传前请**完全重启/重新导入**开发者工具项目，避免旧缓存统计

## [S1] Problem

合并清理后 IDE 仍上传失败：`main package source size 3931KB exceed max limit 2048KB`，质量检测「主包应小于 1.5M」未通过，并提示主包存在未使用 JS：`utils/historyCache.js`。

根因：微信开发者工具会把项目根目录下所有未 ignore 的文件计入主包。`.worktrees/`（约 4.8MB）不在 ignore 中。

## [S2] Design

- `packOptions.ignore` 增加 folder：`.worktrees`、`.agents`、`aliyun-push-server`、`node_modules`、`data`。
- worktree 迁出项目根：`F:\rorkingdom-guide\.worktrees\*` → `F:\rorkingdom-worktrees\*`。
- `utils/historyCache.js` → `pages/catch/historyCache.js`；`catch.js` 改 `require('./historyCache')`。
- 删除无引用主包 JS：`utils/pets.js`、`utils/translate.js`。
- `.gitignore` 补充 `.worktrees/`、`data/`。
- 验收：主包候选 ≤400KB 且 ≤1536KB；项目根无 `.worktrees`。

## [S3] Out of Scope

- i18n 拆分/CDN；map 分包压缩；admin/swarm 占位图；GitHub 推送；IDE 内实际点上传（需用户本地执行）。

## Tasks
- [x] T11: 排除 .worktrees 并下沉 historyCache — acceptance: packOptions 含相关 folder ignore；worktree 已迁出；historyCache 在 pages/catch；主包候选 ≤400KB（covers: S2）
- [x] T12: 校验、review 并 finalize spec — acceptance: 体积与引用校验通过；spec delivered；实现在 master（covers: S2; depends: T11）
