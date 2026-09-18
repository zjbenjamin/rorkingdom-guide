---
feature: perf-optimization
status: delivered
updated: 2026-09-18
branch: perf/optimization
commits: 2ad78d4..3ae0294
---

# 小程序整体性能优化

## Report

**What was built** —
启动加速与网络请求：openid 统一缓存（`utils/notify.js` `resolveOpenid`），登录/订阅/管理员检测复用；地图 `loadConfig` 10s 节流、绘制 16ms 防抖；捕捉统计 30s TTL（`utils/historyCache.js`）。

包体积：第一阶段删除非运行时文件（wiki/证书/脚本/根目录 md 等）并配置 `packOptions.ignore` + `.gitignore`，主包从上传失败的 2547KB 降到约 531KB。第二阶段按「主包硬预算 ≤1.5MB、交付目标 ≤400KB」主动压缩图片：banner 720×480/51KB、avatar 224×224/12KB、logo 192×192/8KB、balls 256×256/9KB；`about.wxml` 兜底改为 `/images/avatar.png`。最终主包候选 **358.3KB**（≤400KB，≤1536KB）。

**Verification** —
- 第一阶段：`git status` 确认脏文件删除；`project.config.json` JSON 合法且含 ignore 规则；主包 530.74KB < 2048KB
- 第二阶段：PIL 校验四张图尺寸/格式合法；主包独立复核 40 文件 / 366948B / **358.3KB**
- 目标 400KB：PASS（余量约 42KB）；硬预算 1536KB：PASS（余量约 1178KB）
- 运行时文件仍在：`app.*`、index/login/about、`utils/i18n.js`、banner/avatar/logo
- Review：无 critical；分享图路径仍指向存在的 `banner.webp`；`config/images.js` 与磁盘名一致

**Journey log** —
- 主包超限根因是 `packOptions.ignore` 为空 + 仓库根目录脏文件，不是业务代码体积
- 微信主包按源码目录计数：懒加载 `require` 不会减主包体积；i18n 拆分需上云或进分包才有效
- `pages/privacy/privacy.js` 内联隐私/协议文案，根目录 md 可安全移出包
- `about.wxml` 曾写死不存在的 `/images/avatar.jpg`，本地图片兜底应走磁盘真实路径或 `config/images.js`
- 次要遗留：`admin.wxml`/`swarm.wxml` 仍有缺失图片的裸路径兜底（分包内，非主包阻塞）

## [S1] Problem

上传失败：`main package source size 2547KB exceed max limit 2048KB`。清理后用户要求主包硬预算 **≤1.5MB（1536KB）**，并继续主动压缩以留功能余量（目标 ≤400KB）。

## [S2] Design

- 主包体积硬约束：≤1536KB；交付验收目标：≤400KB。
- 第一阶段：删除非运行时文件（`wiki_*`、`cert/`、`fix*.js`、根目录 md、`mapMarkers.js.bak` 等）；`project.config.json` `packOptions.ignore` 按 folder/suffix/prefix/file 排除；`.gitignore` 同步防回潮。
- 第二阶段图片压缩（主包 `images/` 约 252KB → 79KB）：
  - `banner.webp`：720×480 webp q65，约 51KB（分享卡/首页兜底）
  - `avatar.png`：224×224 JPEG（沿用既有「.png 内为 JPEG」形态），约 12KB
  - `logo.webp`：192×192 webp q65，约 8KB
  - `balls/luokebei_compressed.webp`：256×256 RGBA，约 9KB
- 引用：`pages/about/about.wxml` 兜底 `/images/avatar.png`；`config/images.js` 保留旧名映射。
- 不改动：i18n 四语言单文件（拆分不减主包计数，本轮 out of scope）；分包资源（如 map）走分包预算。

## [S3] Out of Scope

- i18n 云端化 / 语言包进分包；图片 CDN 化。
- map 等分包继续压缩。
- 分包内缺失占位图修复（admin/swarm）。
- 合并 master、IDE 真机上传。

## Tasks
- [x] T9: 压缩主包图片并修正 avatar 引用 — acceptance: 四张主包图片体积下降；`about.wxml` 兜底指向 `/images/avatar.png`；主包候选 ≤400KB 且 ≤1536KB（covers: S2）
- [x] T10: 校验体积、review 并 finalize spec — acceptance: 体积统计脚本通过；spec status=delivered、Report 更新、commits 记录实现区间（covers: S2; depends: T9）
