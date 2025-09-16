import { ProjectConfig } from '../types';

export class ThemeUtils {
  static generateThemeCss(themeColors: ProjectConfig['themeColors']): string {
    return `
/* PPT项目主题样式 - 基于配置的颜色 */

:root {
  /* 主要色彩 */
  --primary-color: ${themeColors.primaryColor};
  --secondary-color: ${themeColors.secondaryColor};
  --accent-color: ${themeColors.accentColor};

  /* 背景色系 */
  --background-color: ${themeColors.backgroundColor};
  --surface-color: ${themeColors.surfaceColor};

  /* 文字色系 */
  --text-primary: ${themeColors.textPrimary};
  --text-secondary: ${themeColors.textSecondary};

  /* 边框和分割线 */
  --border-color: ${themeColors.borderColor};

  /* 基础字体 */
  --font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

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

h1 { font-size: 2.5em; margin-bottom: 0.5em; }
h2 { font-size: 2em; margin-bottom: 0.5em; }
h3 { font-size: 1.5em; margin-bottom: 0.5em; }

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

a:hover {
  text-decoration: underline;
}

/* 列表样式 */
ul, ol {
  padding-left: 20px;
  margin-bottom: 1em;
}

li {
  margin-bottom: 0.5em;
}

/* 图片样式 */
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}

th, td {
  padding: 12px;
  border: 1px solid var(--border-color);
  text-align: left;
}

th {
  background-color: var(--surface-color);
  font-weight: bold;
}

/* 引用样式 */
blockquote {
  border-left: 4px solid var(--primary-color);
  padding-left: 20px;
  margin: 20px 0;
  font-style: italic;
  color: var(--text-secondary);
}

/* 按钮样式 */
.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  opacity: 0.9;
}

.button-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}

/* 卡片样式 */
.card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

/* 网格布局 */
.grid {
  display: grid;
  gap: 20px;
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 20px 15px;
  }

  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }

  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.2em; }
}
`;
  }

  static generateHtmlWithTheme(originalHtml: string, themeColors: ProjectConfig['themeColors']): string {
    const themeCss = this.generateThemeCss(themeColors);

    // 检查HTML是否已经有head标签
    if (originalHtml.includes('</head>')) {
      // 如果有head标签，在head中插入主题CSS
      return originalHtml.replace('</head>', `<style>${themeCss}</style></head>`);
    } else {
      // 如果没有head标签，在html内容前添加主题CSS
      return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>幻灯片预览</title>
  <style>${themeCss}</style>
</head>
<body>
  ${originalHtml}
</body>
</html>`;
    }
  }

  static generateHtmlWithUserTheme(originalHtml: string, userThemeCss: string): string {
    // 检查HTML是否已经有head标签
    if (originalHtml.includes('</head>')) {
      // 如果有head标签，在head中插入用户主题CSS
      return originalHtml.replace('</head>', `<style>${userThemeCss}</style></head>`);
    } else {
      // 如果没有head标签，在html内容前添加用户主题CSS
      return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>幻灯片预览</title>
  <style>${userThemeCss}</style>
</head>
<body>
  ${originalHtml}
</body>
</html>`;
    }
  }
}