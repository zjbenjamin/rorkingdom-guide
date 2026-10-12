---
feature: android-pad-layout
status: designed
updated: 2026-10-12
branch: feat/android-pad-layout
commits:
---

# Android Pad 平板排版

## Report

## [S1] Problem

安卓 Pad（微信小程序）上界面比例严重失真，几乎不可用：

1. **rpx 随屏幕宽度放大**：设计稿按 750rpx=手机宽，Pad 宽 1280–2560px 时 rpx 同步放大 1.7–3.4 倍。现有 `max-width: 960px` 只收窄容器，字号/图标仍是 rpx，导致「窄容器 + 巨字」。
2. **顶栏逐字竖排**（截图 1）：`洛手助手` 断成「洛手助/手」，`公告/管理/关于` 每字一行。根因是 flex 子项被压缩 + 部分文本 `word-break: break-all` + rpx 巨字溢出。
3. **Dock 巨大**（截图 1/3）：`72rpx` 图标在 2560px 宽屏上约 240px，遮挡内容。
4. **快捷入口/商品网格比例失衡**（截图 3）：列宽、间距、字号未按平板重排。
5. **公告发布弹窗**（截图 2/4）：工具按钮挤成多行，输入区高度占比过大。

手机端（<768px）现状正常，**不能改**。

## [S2] Design

### 总原则

- **手机排版零改动**：默认样式全部保留 rpx，平板规则只挂在根节点 class 上。
- **class 驱动平板样式**：根节点 `page` 由 Behavior 注入 `layout-pad`（可选 `layout-wide`），样式写成 `.layout-pad .foo` / `.layout-wide .foo`；不用 `@media` 做主路径，便于手动切换。
- **Pad 模式切换**（「我的」页）：`auto`（按宽度 ≥768 自动）/ `pad`（强制平板）/ `phone`（强制手机），存 `wx.setStorageSync('pad_layout_mode')`。
- **平板用 px 定尺寸**：`layout-pad` 内关键字号/图标/控件尺寸一律 px，切断 rpx 随屏宽放大。
- **内容限宽居中**：竖屏 ≤768px、横屏 ≤1080px；超宽屏不再拉伸。
- **禁止逐字换行**：顶栏、导航、按钮文本 `white-space: nowrap` + `flex-shrink`/ellipsis。
- **断点语义**：`layout-pad` 对应原 768px，`layout-wide` 对应原 1024px。

### 契约

**布局 class（utils/padMode.js + utils/padLayoutBehavior.js）**
- `getMode()/setMode(auto|pad|phone)`，`layoutClasses(mode, windowWidth)` → `''` | `'layout-pad'` | `'layout-pad layout-wide'`。
- Behavior 在 `attached`/`show`/`onWindowResize` 时刷新 `padLayoutClass`、`padMode`；各页根节点 `class="page {{padLayoutClass}}"`。
- Dock 组件 `styleIsolation: 'apply-shared'`，使 `.layout-pad .dock-*` 可覆盖。

**「我的」页显示设置**
- 三个选项按钮：自动 / 平板 / 手机；点选即 `setPadMode` 并立即生效（含当前页）。
- 文案走 i18n：`displayTitle/padModeLabel/padModeHint/padModeAuto/padModePad/padModePhone`（中英日韩）。

**尺寸契约（px，layout-pad 下）**

| 元素 | 手机 (rpx) | layout-pad | layout-wide |
|------|-----------|------------|-------------|
| 正文 | 26rpx | 15px | 15px |
| 次要文字 | 22rpx | 13px | 13px |
| 小字/角标 | 18–20rpx | 11–12px | 11–12px |
| 卡片标题 | 28–32rpx | 17px | 17px |
| 页面大标题 | 36–40rpx | 22px | 22px |
| Dock 图标 | 36rpx | 22px | 22px |
| Dock 格子 | 72rpx | 48px | 48px |
| 按钮高 | 64–96rpx | 40px | 40px |
| 卡片圆角 | 16–24rpx | 12px | 12px |
| 页边距 | 24rpx | 20px | 24px |
| 内容最大宽 | 100% | 768px | 1080px |
| 弹窗最大宽 | 100% | 640px | 720px |
| 快捷入口列数 | flex 25% | 3 | 4 |
| 商品网格列数 | 1–2 | 2 | 3 |

**顶栏（index `repo-header`）**
- `.layout-pad .repo-header-top` nowrap；`repo-owner/sep` 不缩，`repo-name` 可 ellipsis。
- tab 行 nowrap 可横滑；语言旗 `margin-left: auto`。

**弹窗**
- `.layout-pad .modal-mask` 改为居中（`align-items/justify-content: center`），`modal-box` 限宽 640/720px。
- 富文本 `.form-editor` 高 220px（min 200 / max 320），工具栏 `.tool-btn` 13px/32px。

**兼容**
- app.wxss 保留一条 `@media (min-width: 768px)` 仅作未挂 Behavior 页面的兜底字号。

## [S3] Out of Scope

- 手机（`phone` 模式 / 未挂 class）任何视觉/结构改动。
- 桌面端/浏览器 H5 专用布局。
- 深浅色主题。
- 商人预设数量、捕捉统计等业务功能（已在上一提交完成）。
- 各页业务交互逻辑（仅接 Behavior 与根节点 class）。

## Tasks

- [ ] T1: 全局平板尺寸帽（app.wxss → `.layout-pad`/`.layout-wide`）— acceptance: layout-pad 时正文 15px、卡片圆角 12px、按钮 40px 不按 rpx 放大；无 class 时与改前一致（covers: S2）
- [ ] T2: 顶栏防竖排（index 页 repo-header）— acceptance: layout-wide 下「洛手助手 / rorkingdom-guide Public」单行显示，tab 与语言旗同行不逐字换行（covers: S2; depends: T1）
- [ ] T3: Dock 固定尺寸 — acceptance: layout-pad 时 Dock 格 48px、图标 22px，不遮挡主体内容（covers: S2; depends: T1）
- [ ] T4: 内容限宽与网格重排 — acceptance: layout-pad 容器 ≤768px、layout-wide ≤1080px 居中；quick-nav 3/4 列；商品网格 2/3 列（covers: S2; depends: T1）
- [ ] T5: 弹窗与后台表单平板化 — acceptance: 公告弹窗居中 ≤720px，form-editor ≤320px，工具栏 32px 不挤占输入区，控件字号 ≥13px（covers: S2; depends: T1）
- [ ] T6: Pad 模式切换（我的页）— acceptance: 自动/平板/手机三选一，持久化并即时刷新当前布局 class；四语文案齐全（covers: S2）
- [ ] T7: 验证与评审 — acceptance: 花括号配对、node --check 通过、14 页均挂 class+Behavior；评审无 critical；文档定稿（covers: S2; depends: T1, T2, T3, T4, T5, T6）
