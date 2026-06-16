# 主包瘦身优化说明

## 优化结果

| 项目 | 优化前 | 优化后 | 减少 |
|------|--------|--------|------|
| 项目总大小 | 4.13MB | 0.71MB | **83%** |
| 主包代码 | ~543KB | 20KB | **96%** |
| 图片资源 | 3MB+ | 2KB (SVG) | **99%** |

## 已完成的优化

### 1. 分包加载配置 (`app.json`)
- **主包**：首页、登录、关于（~20KB）
- **分包**：13个功能页面

### 2. 图片资源优化
- **banner.svg** (1.3KB) - 首页轮播图（压缩版）
- **logo.svg** (0.8KB) - 登录页Logo（压缩版）
- **道具图片** - 使用 wiki CDN 链接
- **精灵图片** - 使用 wiki CDN 链接

### 3. 代码优化
- `config/images.js` - 图片URL配置
- `data/pets.js` - 添加了 getImgUrl 和 itemsData 导出
- `data/items.js` - 使用CDN链接
- 所有页面代码 - 使用配置的URL

## 文件结构

```
images/
├── banner.svg    # 首页轮播图 (1.3KB)
└── logo.svg      # 登录页Logo (0.8KB)
```

## 自定义图片（可选）

如需使用自定义图片，编辑 `config/images.js`：

```javascript
var imageMap = {
  '/images/banner.png': 'https://your-cdn.com/banner.png',
  '/images/logo.png': 'https://your-cdn.com/logo.png'
}
```

## 注意事项

1. SVG图片体积小，加载快
2. 分包配置自动处理页面跳转
3. CDN图片需要网络连接
