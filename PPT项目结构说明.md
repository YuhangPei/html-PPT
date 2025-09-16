# PPT项目文件结构规范

## 概述

本规范定义了一个标准的PPT项目文件结构，用户可以按照此结构创建自己的PPT文件夹，然后通过系统上传ZIP文件来创建演示文稿。

## 项目根目录结构

```
my-presentation/
├── theme.css              # 全局主题样式文件（必需）
├── slides/                # 幻灯片页面文件夹（必需）
├── assets/                # 资源文件文件夹（可选）
├── config.json            # 项目配置文件（可选）
└── README.md              # 项目说明文件（可选）
```

## 文件详细说明

### 1. theme.css - 全局主题样式

这是整个PPT项目的核心样式文件，定义了全局的颜色变量和基础样式。

**必须包含的CSS变量：**
```css
:root {
  /* 主要色彩 */
  --primary-color: #1976d2;     /* 主色调 - 标题、重点 */
  --secondary-color: #dc004e;   /* 次色调 - 强调、按钮 */
  --accent-color: #00bcd4;      /* 强调色 - 装饰、图标 */

  /* 背景色系 */
  --background-color: #ffffff;   /* 页面背景 */
  --surface-color: #f5f5f5;      /* 卡片/容器背景 */

  /* 文字色系 */
  --text-primary: #212121;       /* 主要文字 */
  --text-secondary: #757575;     /* 次要文字 */
  --text-accent: #ffffff;        /* 强调文字（有色背景上） */

  /* 边框和分割线 */
  --border-color: #e0e0e0;       /* 边框颜色 */

  /* 基础字体 */
  --font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}
```

**可选的主题切换：**
```css
/* 深色主题 */
[data-theme="dark"] {
  --primary-color: #90caf9;
  --secondary-color: #f48fb1;
  --background-color: #121212;
  --text-primary: #ffffff;
  /* ... 其他变量 */
}

/* 简约主题 */
[data-theme="minimal"] {
  --primary-color: #000000;
  --secondary-color: #666666;
  /* ... 其他变量 */
}
```

**基础样式：**
```css
/* 页面基础样式 */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.6;
}

/* 标题样式 */
h1, h2, h3, h4, h5, h6 {
  color: var(--primary-color);
  line-height: 1.2;
  margin-top: 0;
}

/* 基础文字样式 */
p {
  margin-bottom: 1em;
  color: var(--text-primary);
}

/* 链接样式 */
a {
  color: var(--primary-color);
  text-decoration: none;
}

/* 列表样式 */
ul, ol {
  padding-left: 20px;
}

/* 图片样式 */
img {
  max-width: 100%;
  height: auto;
}
```

### 2. slides/ - 幻灯片页面文件夹

每个HTML文件代表一页幻灯片，按数字顺序命名。

**文件命名规范：**
- `01-封面.html`
- `02-目录.html`
- `03-第一章.html`
- `04-第二章.html`
- ...
- `99-结束页.html`

**每页HTML的基本结构：**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
    <link rel="stylesheet" href="../theme.css">
    <style>
        /* 页面特定样式 */
        .page-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
    </style>
</head>
<body>
    <div class="page-content">
        <!-- 页面内容 -->
        <h1>页面标题</h1>
        <p>页面内容...</p>
    </div>
</body>
</html>
```

**HTML页面设计原则：**
- 每个HTML文件应该是独立的、完整的页面
- 使用相对路径引用theme.css：`../theme.css`
- 使用内联样式或页面特定的<style>标签
- 避免使用复杂的JavaScript，专注于内容展示
- 可以使用CSS变量：`color: var(--primary-color)`

### 3. assets/ - 资源文件文件夹

存放图片、视频、音频等资源文件。

**推荐结构：**
```
assets/
├── images/
│   ├── logo.png
│   ├── banner.jpg
│   └── charts/
│       ├── chart1.png
│       └── chart2.png
├── videos/
│   ├── demo.mp4
│   └── intro.mp4
├── audio/
│   ├── background.mp3
│   └── narration.mp3
└── documents/
    ├── manual.pdf
    └── report.pdf
```

**文件引用方式：**
```html
<!-- 引用图片 -->
<img src="../assets/images/logo.png" alt="Logo">

<!-- 引用视频 -->
<video src="../assets/videos/demo.mp4" controls></video>

<!-- 引用音频 -->
<audio src="../assets/audio/background.mp3" controls></audio>
```

### 4. config.json - 项目配置文件

可选的配置文件，定义项目的基本信息。

```json
{
  "title": "我的演示文稿",
  "description": "这是一个关于PPT项目结构的演示",
  "author": "作者姓名",
  "version": "1.0.0",
  "created": "2024-01-01",
  "modified": "2024-01-15",
  "theme": "light",
  "settings": {
    "autoPlay": false,
    "loop": false,
    "showControls": true
  }
}
```

## 示例项目结构

```
product-launch/
├── theme.css
├── config.json
├── slides/
│   ├── 01-封面.html
│   ├── 02-目录.html
│   ├── 03-产品介绍.html
│   ├── 04-市场分析.html
│   ├── 05-竞争优势.html
│   ├── 06-发展计划.html
│   └── 07-感谢页.html
└── assets/
    ├── images/
    │   ├── logo.png
    │   ├── hero-image.jpg
    │   ├── product-shot.png
    │   └── charts/
    │       ├── market-share.png
    │       └── revenue-growth.png
    └── videos/
        └── product-demo.mp4
```

## 创建步骤

1. **创建项目文件夹**
   ```bash
   mkdir my-presentation
   cd my-presentation
   ```

2. **创建子文件夹**
   ```bash
   mkdir slides assets/images
   ```

3. **创建theme.css文件**
   - 复制上面的模板样式
   - 根据需要修改颜色变量

4. **创建幻灯片页面**
   - 在slides文件夹中创建HTML文件
   - 按顺序命名：01-xxx.html, 02-xxx.html...

5. **添加资源文件**
   - 将图片、视频等文件放入assets文件夹
   - 在HTML中正确引用资源

6. **创建config.json（可选）**
   - 定义项目基本信息

7. **测试页面**
   - 在浏览器中打开各个HTML文件
   - 确保样式和资源引用正确

8. **打包上传**
   ```bash
   # 在项目根目录执行
   zip -r my-presentation.zip .
   ```

## 最佳实践

### 1. 文件命名
- 使用有意义的文件名
- 保持命名一致性
- 避免使用特殊字符和空格

### 2. 图片优化
- 压缩图片文件大小
- 使用适当的图片格式
- 为图片添加alt属性

### 3. 样式设计
- 优先使用CSS变量
- 保持设计一致性
- 考虑响应式设计

### 4. 性能优化
- 控制文件大小
- 优化图片和视频
- 避免过度的动画效果

### 5. 兼容性
- 使用标准HTML5标签
- 测试主流浏览器兼容性
- 提供基本的降级方案

## 常见问题

### Q: 如何修改整体颜色主题？
A: 只需要修改theme.css中的CSS变量值，所有使用该变量的地方都会自动更新。

### Q: 如何添加新的幻灯片页面？
A: 在slides文件夹中创建新的HTML文件，按数字顺序命名，然后在其他页面添加链接。

### Q: 如何引用资源文件？
A: 使用相对路径，如`../assets/images/logo.png`。

### Q: 如何设置页面主题？
A: 在HTML标签中添加`data-theme`属性，如`<html data-theme="dark">`。

### Q: 如何控制页面切换？
A: 页面切换由系统控制，用户只需要专注于内容设计即可。

## 技术支持

如果遇到问题，请检查：
1. 文件路径是否正确
2. CSS变量是否正确定义
3. HTML语法是否正确
4. 资源文件是否存在

---

这个规范确保了PPT项目的结构清晰、易于维护，并且可以通过系统正确地导入和展示。