---
feature: perf-optimization
status: delivered
updated: 2026-09-18
branch: perf/optimization
commits: 2ad78d4..4a1ee54
---

# 小程序整体性能优化

## Report

**What was built** —
启动加速：登录页 openid 缓存复用，延迟非关键云函数调用 300ms；notify/admin 走同一 openid 缓存；地图页 `loadConfig` 10s 节流、绘制 16ms 防抖。网络请求：`utils/notify.js` 的 `resolveOpenid` 统一 openid 缓存。页面流畅度：捕捉统计 30s TTL（`utils/historyCache.js`）。

包体积（上传超限修复）：主包曾 2547KB > 2048KB。删除非运行时文件（wiki HTML/JSON、证书、fix 脚本、根目录 md、`mapMarkers.js.bak` 等约 3.1MB），`project.config.json` 配置 `packOptions.ignore`（docs/cert/后缀/前缀），`.gitignore` 同步防回潮。删除后主包候选 38 文件 / 530.74KB，余量约 1517KB。运行时隐私/协议由 `pages/privacy/privacy.js` 内联文案承载，不依赖根目录 md。

**Verification** —
- 无关文件删除：`git status --short` 显示 wiki/cert/fix/md 等均为 `D`
- `project.config.json` JSON 可解析，`packOptions.ignore` 含 folder/suffix/prefix/file 规则
- 主包候选体积统计：38 文件，530.74KB < 2048KB
- 关键运行时文件仍在：`app.*`、index/login/about 四件套、`utils/i18n.js`、`utils/notify.js`、banner/avatar/logo
- Review：packOptions 规则与当前运行时无冲突；代码无引用已删文件；分包完整（含 `pages/map/mapMarkers.js`）

**Journey log** —
- merchant.wxss 死 CSS 清理脚本用 Python 正则匹配 WXML class，需在 worktree 环境运行
- `catch.js` 精简为使用 `historyCache`，需在真机验证捕捉流程完整性
- 主包超限根因是 `packOptions.ignore` 为空 + 仓库根目录脏文件，不是业务代码体积
- `pages/privacy/privacy.js` 内联隐私/协议文案，根目录 `PRIVACY.md`/`USER_AGREEMENT.md` 可安全移出包
- packOptions 前缀 `fix`/`test` 偏钝，今日无碰撞；后续若新增 fixture 命名需收紧

## [S1] Problem

上传失败：`main package source size 2547KB exceed max limit 2048KB`。主包混入大量非运行时文件（wiki HTML 约 3MB、证书/脚本/文档/备份），`project.config.json` 的 `packOptions.ignore` 为空，全部被打进主包。

## [S2] Design

- 删除仓库中与小程序运行无关的文件：`wiki_*.html`、`wiki_pet_map.json`、`all_images.json`、`fix*.js`、`find_dupes.ps1`、`cert/`、根目录 `*.cert`、`pages/map/mapMarkers.js.bak`、`OPTIMIZE.md`，以及仓库文档类 `PRIVACY.md` / `USER_AGREEMENT.md` / `README.md`（页内隐私文案走 `pages/privacy`，不依赖这些 md）。
- 在 `project.config.json` 的 `packOptions.ignore` 配置后缀/目录/前缀排除，防止后续开发再把文档、证书、wiki、脚本、备份打进主包。
- `.gitignore` 补充同类模式，降低误提交概率。
- 保留：`app.*`、主包三页（index/login/about）、`utils/`、`components/`、`config/`、`images/`（banner/avatar/logo/balls，约 252KB）、分包页面目录、`cloudfunctions/`（由 `cloudfunctionRoot` 排除）、`docs/compose/spec/`（Compose 规格，仅 ignore 不删）。
- 预期主包运行时源约 530KB，远低于 2048KB 上限。

## [S3] Out of Scope

- 图片 CDN 化、i18n 拆分、分包结构调整。
- 将 `perf/optimization` 上的改动合并 master（另行决策）。
- 微信开发者工具真机上传本身（本地校验体积后由用户在 IDE 执行）。

## Tasks
- [x] T7: 删除无关文件并配置 packOptions.ignore — acceptance: 无关文件从 perf-opt 工作区移除；`project.config.json` 含 ignore 规则；主包候选体积 < 2048KB（covers: S2）
- [x] T8: 校验体积并提交 spec — acceptance: 脚本统计主包候选 < 2048KB 且关键运行时文件仍在；spec status=delivered 且 Report 更新（covers: S2; depends: T7）
