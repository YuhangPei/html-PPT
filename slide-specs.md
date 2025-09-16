# PPT幻灯片HTML规范文档

## 目录
1. [规范概述](#规范概述)
2. [全局CSS控制系统](#全局css控制系统)
3. [HTML结构规范](#html结构规范)
4. [CSS类命名规范](#css类命名规范)
5. [布局系统](#布局系统)
6. [颜色系统](#颜色系统)
7. [字体系统](#字体系统)
8. [组件规范](#组件规范)
9. [动画效果](#动画效果)
10. [响应式设计](#响应式设计)
11. [最佳实践](#最佳实践)
12. [模板文件](#模板文件)

## 规范概述

本规范旨在创建一套统一、灵活、可维护的HTML幻灯片系统，支持：

- **全局样式控制**：通过一个CSS文件统一控制所有幻灯片的风格
- **模块化设计**：每个幻灯片独立，但遵循统一的样式规范
- **易于定制**：提供多种预设主题，支持一键切换
- **响应式布局**：适配不同屏幕尺寸
- **可扩展性**：支持自定义组件和样式

## 全局CSS控制系统

### 1. 主题变量系统
使用CSS变量（Custom Properties）实现全局样式控制：

```css
/* 全局主题变量 */
:root {
  /* 颜色系统 */
  --primary-color: #1976d2;
  --secondary-color: #dc004e;
  --accent-color: #00bcd4;
  --background-color: #ffffff;
  --surface-color: #f5f5f5;
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-accent: #ffffff;

  /* 字体系统 */
  --font-family-primary: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  --font-family-secondary: 'Times New Roman', serif;
  --font-size-base: 16px;
  --font-size-h1: 2.5rem;
  --font-size-h2: 2rem;
  --font-size-h3: 1.5rem;
  --font-size-body: 1rem;

  /* 间距系统 */
  --spacing-unit: 8px;
  --spacing-xs: calc(var(--spacing-unit) * 0.5);  /* 4px */
  --spacing-sm: var(--spacing-unit);           /* 8px */
  --spacing-md: calc(var(--spacing-unit) * 1.5);  /* 12px */
  --spacing-lg: calc(var(--spacing-unit) * 2);    /* 16px */
  --spacing-xl: calc(var(--spacing-unit) * 3);    /* 24px */
  --spacing-xxl: calc(var(--spacing-unit) * 4);   /* 32px */

  /* 布局系统 */
  --container-width: 1200px;
  --container-padding: var(--spacing-lg);
  --border-radius: 8px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* 动画系统 */
  --transition-fast: 0.15s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. 主题预设
提供多种预设主题，通过修改根变量实现一键切换：

```css
/* 深色主题 */
[data-theme="dark"] {
  --background-color: #121212;
  --surface-color: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --primary-color: #90caf9;
  --secondary-color: #f48fb1;
}

/* 简约主题 */
[data-theme="minimal"] {
  --primary-color: #000000;
  --secondary-color: #666666;
  --background-color: #ffffff;
  --surface-color: #fafafa;
  --text-primary: #000000;
  --text-secondary: #666666;
}

/* 商务主题 */
[data-theme="business"] {
  --primary-color: #1a237e;
  --secondary-color: #c62828;
  --accent-color: #ffd600;
  --background-color: #f5f5f5;
  --surface-color: #ffffff;
  --text-primary: #263238;
  --text-secondary: #546e7a;
}
```

### 3. 全局样式文件结构
```
styles/
├── global.css           # 全局变量和基础样式
├── themes/             # 主题文件
│   ├── light.css      # 默认主题
│   ├── dark.css       # 深色主题
│   ├── minimal.css    # 简约主题
│   └── business.css   # 商务主题
├── components/        # 组件样式
│   ├── layout.css     # 布局组件
│   ├── typography.css # 文字样式
│   ├── buttons.css    # 按钮样式
│   └── cards.css      # 卡片样式
└── utilities/         # 工具类
    ├── spacing.css    # 间距工具类
    ├── colors.css     # 颜色工具类
    └── animations.css # 动画工具类
```

## HTML结构规范

### 1. 基础文档结构
```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>幻灯片标题 - 第1页</title>

    <!-- 全局样式 -->
    <link rel="stylesheet" href="styles/global.css">
    <link rel="stylesheet" href="styles/themes/light.css">

    <!-- 组件样式 -->
    <link rel="stylesheet" href="styles/components/layout.css">
    <link rel="stylesheet" href="styles/components/typography.css">

    <!-- 工具类 -->
    <link rel="stylesheet" href="styles/utilities/spacing.css">

    <!-- 页面特定样式（可选） -->
    <style>
        /* 页面特定的样式覆盖 */
    </style>
</head>
<body>
    <div class="slide slide-container">
        <header class="slide-header">
            <h1 class="slide-title">幻灯片标题</h1>
            <div class="slide-subtitle">副标题或描述</div>
        </header>

        <main class="slide-content">
            <!-- 主要内容区域 -->
        </main>

        <footer class="slide-footer">
            <div class="slide-page-number">1 / 10</div>
        </footer>
    </div>

    <!-- 交互脚本 -->
    <script src="scripts/interactions.js"></script>
</body>
</html>
```

### 2. 语义化结构要求
- 使用语义化HTML5标签
- 每个幻灯片必须有唯一的标题
- 合理的内容层级结构
- 适当的ARIA标签支持

## CSS类命名规范

### 1. 命名约定
采用BEM（Block Element Modifier）命名规范：

```css
/* 块（Block） */
.slide {}
.header {}
.content {}

/* 元素（Element） */
.slide__title {}
.slide__content {}
.header__logo {}

/* 修饰符（Modifier） */
.slide--highlight {}
.slide--dark {}
.button--primary {}
.button--large {}
```

### 2. 功能性类名
```css
/* 布局类 */
.container { max-width: var(--container-width); margin: 0 auto; padding: var(--container-padding); }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { align-items: center; justify-content: center; }
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }

/* 间距类 */
.mt-xs { margin-top: var(--spacing-xs); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.p-md { padding: var(--spacing-md); }
.px-xl { padding-left: var(--spacing-xl); padding-right: var(--spacing-xl); }

/* 文字类 */
.text-primary { color: var(--text-primary); }
.text-center { text-align: center; }
.font-bold { font-weight: bold; }
.text-lg { font-size: var(--font-size-h3); }

/* 显示类 */
.hidden { display: none; }
.visible { display: block; }
.invisible { visibility: hidden; }
```

### 3. 组件类名
```css
/* 标题组件 */
.slide-title {}
.slide-subtitle {}

/* 内容组件 */
.slide-text {}
.slide-list {}
.slide-image {}
.slide-quote {}

/* 布局组件 */
.slide-grid {}
.slide-columns {}
.slide-cards {}

/* 特殊组件 */
.slide-chart {}
.slide-code {}
.slide-table {}
```

## 布局系统

### 1. 网格系统
```css
.slide-grid {
    display: grid;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
}

.slide-grid--2cols {
    grid-template-columns: repeat(2, 1fr);
}

.slide-grid--3cols {
    grid-template-columns: repeat(3, 1fr);
}

.slide-grid--4cols {
    grid-template-columns: repeat(4, 1fr);
}

.slide-grid--responsive {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

### 2. 弹性布局
```css
.slide-columns {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
}

.slide-columns--equal {
    flex: 1 1 0;
}

.slide-columns--auto {
    flex: 0 0 auto;
}

.slide-columns--stretch {
    align-items: stretch;
}
```

### 3. 卡片布局
```css
.slide-card {
    background: var(--surface-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: var(--spacing-lg);
    transition: var(--transition-normal);
}

.slide-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}
```

## 颜色系统

### 1. 颜色变量
```css
:root {
    /* 主色调 */
    --color-blue-50: #e3f2fd;
    --color-blue-100: #bbdefb;
    --color-blue-200: #90caf9;
    --color-blue-300: #64b5f6;
    --color-blue-400: #42a5f5;
    --color-blue-500: #2196f3;
    --color-blue-600: #1e88e5;
    --color-blue-700: #1976d2;
    --color-blue-800: #1565c0;
    --color-blue-900: #0d47a1;

    /* 中性色 */
    --color-gray-50: #fafafa;
    --color-gray-100: #f5f5f5;
    --color-gray-200: #eeeeee;
    --color-gray-300: #e0e0e0;
    --color-gray-400: #bdbdbd;
    --color-gray-500: #9e9e9e;
    --color-gray-600: #757575;
    --color-gray-700: #616161;
    --color-gray-800: #424242;
    --color-gray-900: #212121;

    /* 状态色 */
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-error: #f44336;
    --color-info: #2196f3;
}
```

### 2. 颜色工具类
```css
.bg-primary { background-color: var(--primary-color); }
.bg-secondary { background-color: var(--secondary-color); }
.bg-accent { background-color: var(--accent-color); }
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-error { background-color: var(--color-error); }

.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--secondary-color); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }
```

## 字体系统

### 1. 字体层级
```css
/* 标题字体 */
.slide-title {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-h1);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    line-height: 1.2;
}

.slide-subtitle {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-h2);
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
    line-height: 1.3;
}

/* 正文字体 */
.slide-text {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-body);
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
}

/* 引用字体 */
.slide-quote {
    font-family: var(--font-family-secondary);
    font-size: calc(var(--font-size-body) * 1.2);
    font-style: italic;
    color: var(--text-secondary);
    line-height: 1.4;
}
```

### 2. 字体工具类
```css
.font-xs { font-size: 0.75rem; }
.font-sm { font-size: 0.875rem; }
.font-base { font-size: 1rem; }
.font-lg { font-size: 1.125rem; }
.font-xl { font-size: 1.25rem; }
.font-2xl { font-size: 1.5rem; }
.font-3xl { font-size: 1.875rem; }
.font-4xl { font-size: 2.25rem; }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.leading-tight { line-height: 1.25; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.75; }
```

## 组件规范

### 1. 标题组件
```html
<div class="slide-header">
    <h1 class="slide-title">主标题</h1>
    <p class="slide-subtitle">副标题描述</p>
</div>
```

### 2. 文本内容组件
```html
<div class="slide-content">
    <p class="slide-text">这是一段正文内容。</p>
    <ul class="slide-list">
        <li class="slide-list__item">列表项 1</li>
        <li class="slide-list__item">列表项 2</li>
        <li class="slide-list__item">列表项 3</li>
    </ul>
</div>
```

### 3. 图片组件
```html
<div class="slide-image-container">
    <img src="image.jpg" alt="描述文字" class="slide-image">
    <div class="slide-image__caption">图片说明文字</div>
</div>
```

### 4. 卡片组件
```html
<div class="slide-grid slide-grid--3cols">
    <div class="slide-card">
        <h3 class="slide-card__title">卡片标题</h3>
        <p class="slide-card__content">卡片内容</p>
    </div>
    <div class="slide-card">
        <h3 class="slide-card__title">卡片标题</h3>
        <p class="slide-card__content">卡片内容</p>
    </div>
    <div class="slide-card">
        <h3 class="slide-card__title">卡片标题</h3>
        <p class="slide-card__content">卡片内容</p>
    </div>
</div>
```

### 5. 表格组件
```html
<div class="slide-table-container">
    <table class="slide-table">
        <thead class="slide-table__head">
            <tr class="slide-table__row">
                <th class="slide-table__header">表头1</th>
                <th class="slide-table__header">表头2</th>
                <th class="slide-table__header">表头3</th>
            </tr>
        </thead>
        <tbody class="slide-table__body">
            <tr class="slide-table__row">
                <td class="slide-table__cell">数据1</td>
                <td class="slide-table__cell">数据2</td>
                <td class="slide-table__cell">数据3</td>
            </tr>
        </tbody>
    </table>
</div>
```

## 动画效果

### 1. 基础动画
```css
/* 淡入动画 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.slide-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

/* 滑入动画 */
@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.slide-slide-in {
    animation: slideIn 0.6s ease-out;
}

/* 缩放动画 */
@keyframes scaleIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.slide-scale-in {
    animation: scaleIn 0.4s ease-out;
}
```

### 2. 交互动画
```css
/* 悬停效果 */
.slide-card {
    transition: var(--transition-normal);
}

.slide-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* 点击效果 */
.slide-button {
    transition: var(--transition-fast);
}

.slide-button:active {
    transform: scale(0.98);
}

/* 焦点效果 */
.slide-button:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}
```

## 响应式设计

### 1. 媒体查询
```css
/* 小屏幕设备 */
@media (max-width: 768px) {
    .slide-grid--2cols {
        grid-template-columns: 1fr;
    }

    .slide-columns {
        flex-direction: column;
    }

    .slide-title {
        font-size: var(--font-size-h2);
    }
}

/* 中等屏幕设备 */
@media (min-width: 769px) and (max-width: 1024px) {
    .slide-grid--3cols {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 大屏幕设备 */
@media (min-width: 1025px) {
    .slide-container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### 2. 响应式类
```css
/* 响应式显示类 */
.hidden-mobile { display: block; }
.visible-mobile { display: none; }

@media (max-width: 768px) {
    .hidden-mobile { display: none; }
    .visible-mobile { display: block; }
}

/* 响应式文本大小 */
.text-responsive {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
}
```

## 最佳实践

### 1. 性能优化
- 使用CSS变量减少样式重复
- 避免过度嵌套选择器
- 使用will-change优化动画性能
- 优化图片资源大小

### 2. 可访问性
- 确保足够的颜色对比度
- 提供适当的ARIA标签
- 支持键盘导航
- 使用语义化HTML

### 3. 维护性
- 遵循命名规范
- 注释复杂样式
- 模块化组织代码
- 版本控制样式文件

### 4. 兼容性
- 测试主流浏览器
- 提供适当的降级方案
- 使用标准CSS属性
- 避免实验性特性

## 模板文件

详细的模板文件请参考：
- [HTML模板](template.html)
- [CSS全局样式](styles/global.css)
- [主题样式](styles/themes/)
- [组件样式](styles/components/)

---

## 版本历史

- v1.0.0 - 初始版本
- v1.1.0 - 添加深色主题支持
- v1.2.0 - 增强响应式设计

## 维护说明

- 定期更新浏览器兼容性
- 根据用户反馈优化规范
- 添加新的组件和样式
- 保持向后兼容性