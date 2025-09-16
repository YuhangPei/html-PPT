# 创新科技产品发布会

## 项目说明

这是一个完整的PPT演示文稿项目，展示了我们的AI智能解决方案。项目包含5个幻灯片页面，涵盖了产品介绍的完整流程。

## 项目结构

```
example-presentation/
├── theme.css              # 全局主题样式
├── config.json            # 项目配置文件
├── README.md              # 项目说明
├── slides/                # 幻灯片页面
│   ├── 01-封面.html
│   ├── 02-目录.html
│   ├── 03-产品概述.html
│   ├── 04-市场分析.html
│   └── 05-感谢页.html
└── assets/                # 资源文件
    └── images/            # 图片资源
```

## 使用说明

### 1. 修改主题色彩

编辑 `theme.css` 文件中的CSS变量来改变整体色彩：

```css
:root {
  --primary-color: #1976d2;     /* 修改主色调 */
  --secondary-color: #dc004e;   /* 修改次色调 */
  --accent-color: #00bcd4;      /* 修改强调色 */
}
```

### 2. 切换主题

在HTML文件的 `<html>` 标签中添加主题属性：

```html
<html data-theme="dark">    <!-- 深色主题 -->
<html data-theme="minimal">  <!-- 简约主题 -->
<html data-theme="business"> <!-- 商务主题 -->
```

### 3. 添加新幻灯片

1. 在 `slides/` 文件夹中创建新的HTML文件
2. 按数字顺序命名，如 `06-新页面.html`
3. 使用以下模板：

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
    </style>
</head>
<body>
    <div class="container">
        <!-- 页面内容 -->
        <h1>标题</h1>
        <p>内容...</p>
    </div>
</body>
</html>
```

### 4. 添加资源文件

将图片、视频等文件放入 `assets/` 文件夹，然后在HTML中引用：

```html
<img src="../assets/images/logo.png" alt="Logo">
```

## 部署说明

### 打包项目

在项目根目录执行：

```bash
zip -r presentation.zip .
```

### 上传系统

将生成的 `presentation.zip` 文件上传到PPT演示系统中。

## 自定义样式

### 使用CSS变量

在HTML中可以直接使用预定义的CSS变量：

```html
<h1 style="color: var(--primary-color);">标题</h1>
<div style="background-color: var(--surface-color);">
    内容
</div>
```

### 添加页面特定样式

在每个HTML文件的 `<style>` 标签中添加自定义样式：

```css
.page-header {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: var(--text-accent);
    padding: 40px;
    border-radius: 12px;
}
```

## 注意事项

1. 确保所有资源文件路径正确
2. 使用相对路径引用CSS和资源文件
3. 保持HTML结构简洁，专注于内容
4. 避免使用复杂的JavaScript
5. 测试不同主题下的显示效果

## 技术支持

如有问题，请联系技术支持团队。

---

*此项目由创新科技有限公司提供*