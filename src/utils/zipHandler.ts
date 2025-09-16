import { Project, ProjectConfig } from '../types';

export class ZipHandler {
  // 保存项目为文件夹格式（可用于重新打开编辑）
  static async saveProject(project: Project): Promise<Blob> {
    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    // 添加完整的项目信息
    zip.file('project.json', JSON.stringify({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }, null, 2));

    // 添加项目配置文件
    if (project.config) {
      zip.file('config.json', JSON.stringify(project.config, null, 2));
    }

    // 保存用户主题CSS（如果存在）
    if (project.theme) {
      zip.file('theme.css', project.theme);
    }

    // 添加幻灯片HTML文件
    for (const slide of project.slides) {
      zip.file(`slides/${slide.name}.html`, slide.html);

      // 添加资源文件
      for (const asset of slide.assets) {
        if (asset.content) {
          const assetPath = `slides/${slide.name}_assets/${asset.filename}`;
          zip.file(assetPath, asset.content);
        }
      }
    }

    // 添加项目说明文件
    zip.file('README.txt', `PPT项目文件 - ${project.name}

这是一个用PPT演示系统创建的项目文件。

包含内容：
- project.json: 项目基本信息
- config.json: 项目配置和主题设置
- theme.css: 自定义主题样式
- slides/: 幻灯片HTML文件目录
- slides/*_assets/: 幻灯片资源文件目录

使用方法：
1. 在PPT演示系统中选择"打开文件夹"
2. 选择包含这些文件的文件夹
3. 系统将自动加载项目

创建时间：${project.createdAt}
最后修改：${project.updatedAt}`);

    return zip.generateAsync({ type: 'blob' });
  }

  // 导出项目为独立播放包
  static async exportProject(project: Project): Promise<Blob> {
    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    // 添加幻灯片HTML文件
    for (const slide of project.slides) {
      zip.file(`slides/${slide.name}.html`, this.processHtmlForExport(slide.html, project));

      // 添加资源文件
      for (const asset of slide.assets) {
        if (asset.content) {
          const assetPath = `slides/${slide.name}_assets/${asset.filename}`;
          zip.file(assetPath, asset.content);
        }
      }
    }

    // 生成独立播放器页面
    const playerHtml = this.generateStandalonePlayer(project);
    zip.file('index.html', playerHtml);

    // 添加播放说明
    zip.file('播放说明.txt', `${project.name} - 独立播放包

这个播放包可以在任何现代浏览器中直接播放，无需安装其他软件。

使用方法：
1. 解压这个压缩包到任意文件夹
2. 双击打开 index.html 文件
3. 使用方向键或界面按钮控制播放

功能特点：
- 完整的翻页功能
- 支持全屏播放
- 键盘快捷键控制
- 响应式设计，支持各种设备

注意事项：
- 请确保所有文件都在同一文件夹中
- 建议使用Chrome、Firefox、Safari或Edge浏览器
- 播放时需要网络连接以加载外部资源（如果有）

创建时间：${new Date().toLocaleString()}`);

    return zip.generateAsync({ type: 'blob' });
  }

  static async importProject(zipFile: File): Promise<Project> {
    const JSZip = await import('jszip');
    const zip = await JSZip.default.loadAsync(zipFile);

    let projectConfig: ProjectConfig | undefined;
    let themeContent: string | undefined;
    let projectName = "未命名项目";

    // 尝试读取配置文件
    try {
      const configFile = zip.file('config.json');
      if (configFile) {
        projectConfig = JSON.parse(await configFile.async('text'));
        if (projectConfig?.title) {
          projectName = projectConfig.title;
        }
      }
    } catch (error) {
      console.warn('Failed to load config.json:', error);
    }

    // 读取主题文件内容
    try {
      const themeFile = zip.file('theme.css');
      if (themeFile) {
        themeContent = await themeFile.async('text');
      }
    } catch (error) {
      console.warn('Failed to load theme.css:', error);
    }

    // 尝试读取旧版本项目信息
    let projectInfo: any = {};
    try {
      const projectFile = zip.file('project.json');
      if (projectFile) {
        projectInfo = JSON.parse(await projectFile.async('text'));
        if (!projectName) {
          projectName = projectInfo.name || "未命名项目";
        }
      }
    } catch (error) {
      console.warn('Failed to load project.json:', error);
    }

    // 查找所有幻灯片
    const htmlFiles = Object.keys(zip.files).filter(filename =>
      filename.startsWith('slides/') &&
      filename.endsWith('.html') &&
      !filename.includes('_assets')
    );

    // 根据配置文件中的顺序来组织幻灯片
    const slides = [];

    if (projectConfig?.slides && projectConfig.slides.length > 0) {
      // 如果有配置文件，按照配置文件的顺序
      for (const slideConfig of projectConfig.slides) {
        const htmlFile = `slides/${slideConfig.file}`;
        const fileData = zip.file(htmlFile);

        if (fileData) {
          const htmlContent = await fileData.async('text');
          slides.push({
            id: Math.random().toString(36).substr(2, 9),
            name: slideConfig.title || slideConfig.file.replace('.html', ''),
            html: htmlContent,
            order: slides.length,
            assets: []
          });
        }
      }

      // 添加配置文件中未包含的幻灯片（按文件名排序）
      const configuredFiles = projectConfig.slides.map(s => s.file);
      const remainingFiles = htmlFiles.filter(file =>
        !configuredFiles.includes(file.replace('slides/', ''))
      ).sort();

      for (const htmlFile of remainingFiles) {
        const htmlContent = await zip.file(htmlFile)!.async('text');
        const slideName = htmlFile.replace('slides/', '').replace('.html', '');

        slides.push({
          id: Math.random().toString(36).substr(2, 9),
          name: slideName,
          html: htmlContent,
          order: slides.length,
          assets: []
        });
      }
    } else {
      // 如果没有配置文件，按文件名排序
      const sortedFiles = htmlFiles.sort();
      for (const htmlFile of sortedFiles) {
        const htmlContent = await zip.file(htmlFile)!.async('text');
        const slideName = htmlFile.replace('slides/', '').replace('.html', '');

        slides.push({
          id: Math.random().toString(36).substr(2, 9),
          name: slideName,
          html: htmlContent,
          order: slides.length,
          assets: []
        });
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: projectName,
      slides,
      createdAt: projectConfig ? new Date(projectConfig.created) : (projectInfo.createdAt ? new Date(projectInfo.createdAt) : new Date()),
      updatedAt: projectConfig ? new Date(projectConfig.modified) : (projectInfo.updatedAt ? new Date(projectInfo.updatedAt) : new Date()),
      config: projectConfig,
      theme: themeContent
    };
  }

  private static generateThemeCss(themeColors: ProjectConfig['themeColors']): string {
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

  static async importProjectFromFolder(files: FileList): Promise<Project> {
    let projectConfig: ProjectConfig | undefined;
    let themeContent: string | undefined;
    let projectName = "未命名项目";

    // 首先收集所有文件
    const htmlFiles: Array<{file: File, fileName: string}> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.toLowerCase();

      if (fileName === 'config.json') {
        try {
          const text = await file.text();
          projectConfig = JSON.parse(text);
          if (projectConfig?.title) {
            projectName = projectConfig.title;
          }
        } catch (error) {
          console.warn('Failed to parse config.json:', error);
        }
      } else if (fileName === 'theme.css') {
        try {
          themeContent = await file.text();
        } catch (error) {
          console.warn('Failed to read theme.css:', error);
        }
      } else if (fileName.endsWith('.html') && !fileName.includes('_assets')) {
        htmlFiles.push({file, fileName});
      }
    }

    // 根据配置文件中的顺序来组织幻灯片
    const slides = [];

    if (projectConfig?.slides && projectConfig.slides.length > 0) {
      // 如果有配置文件，按照配置文件的顺序
      for (const slideConfig of projectConfig.slides) {
        const fileData = htmlFiles.find(f => f.fileName === slideConfig.file.toLowerCase());

        if (fileData) {
          const htmlContent = await fileData.file.text();
          slides.push({
            id: Math.random().toString(36).substr(2, 9),
            name: slideConfig.title || slideConfig.file.replace('.html', ''),
            html: htmlContent,
            order: slides.length,
            assets: []
          });
        }
      }

      // 添加配置文件中未包含的幻灯片（按文件名排序）
      const configuredFiles = projectConfig.slides.map(s => s.file.toLowerCase());
      const remainingFiles = htmlFiles.filter(f =>
        !configuredFiles.includes(f.fileName)
      ).sort((a, b) => a.fileName.localeCompare(b.fileName));

      for (const {file, fileName} of remainingFiles) {
        try {
          const htmlContent = await file.text();
          const slideName = fileName.replace('.html', '');

          slides.push({
            id: Math.random().toString(36).substr(2, 9),
            name: slideName,
            html: htmlContent,
            order: slides.length,
            assets: []
          });
        } catch (error) {
          console.warn('Failed to read HTML file:', fileName, error);
        }
      }
    } else {
      // 如果没有配置文件，按文件名排序
      const sortedFiles = htmlFiles.sort((a, b) => a.fileName.localeCompare(b.fileName));
      for (const {file, fileName} of sortedFiles) {
        try {
          const htmlContent = await file.text();
          const slideName = fileName.replace('.html', '');

          slides.push({
            id: Math.random().toString(36).substr(2, 9),
            name: slideName,
            html: htmlContent,
            order: slides.length,
            assets: []
          });
        } catch (error) {
          console.warn('Failed to read HTML file:', fileName, error);
        }
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: projectName,
      slides,
      createdAt: projectConfig ? new Date(projectConfig.created) : new Date(),
      updatedAt: projectConfig ? new Date(projectConfig.modified) : new Date(),
      config: projectConfig,
      theme: themeContent
    };
  }

  private static processHtmlForExport(html: string, project: Project): string {
    // 处理HTML内容，移除对原始应用的依赖，添加独立播放支持
    let processedHtml = html;

    // 如果项目有主题配置，内联主题样式
    if (project.config?.themeColors) {
      const themeCss = this.generateThemeCss(project.config.themeColors);
      processedHtml = `
        ${processedHtml}
        <style>
          ${themeCss}
        </style>
      `;
    }

    // 如果有用户主题，优先使用用户主题
    if (project.theme) {
      processedHtml = `
        ${processedHtml}
        <style>
          ${project.theme}
        </style>
      `;
    }

    return processedHtml;
  }

  private static generateStandalonePlayer(project: Project): string {
    const slideFiles = project.slides.map(slide => `${slide.name}.html`).join("', '");

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name} - 独立播放器</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
            background: #1a1a1a;
            color: #ffffff;
            overflow: hidden;
            user-select: none;
        }

        .slide-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            background: #000;
        }

        .slide-frame {
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        }

        /* 绘图画布 */
        .drawing-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        }

        .drawing-canvas.drawing-mode {
            pointer-events: all;
        }

        /* 工具栏 - 放在左下角 */
        .toolbar {
            position: fixed;
            bottom: 30px;
            left: 30px;
            display: flex;
            gap: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }

        .toolbar {
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }

        .toolbar:hover {
            opacity: 1;
        }

        .tool-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
            min-width: 80px;
            justify-content: center;
        }

        .tool-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        .tool-btn.active {
            background: #1976d2;
            border-color: #1976d2;
        }

        /* 颜色选择器默认隐藏，只在画笔工具激活时显示 */
        .color-picker-container {
            display: none;
        }

        .color-picker-container.show {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .color-picker {
            width: 30px;
            height: 30px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .color-picker:hover {
            transform: scale(1.1);
        }

        .color-picker.red { background: #f44336; }
        .color-picker.blue { background: #2196f3; }
        .color-picker.green { background: #4caf50; }
        .color-picker.yellow { background: #ff9800; }

        /* 左右翻页按钮 */
        .nav-left {
            position: fixed;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 18px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            opacity: 0.7;
            transition: all 0.3s ease;
        }

        .nav-left:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }

        .nav-right {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 18px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            opacity: 0.7;
            transition: all 0.3s ease;
        }

        .nav-right:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }

        /* 页码指示器 */
        .page-indicator {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            opacity: 0.7;
            font-size: 14px;
            transition: opacity 0.3s ease;
        }

        .page-indicator:hover {
            opacity: 1;
        }

        
        .progress-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 999;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transition: width 0.3s ease;
        }

        .fullscreen-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            z-index: 1000;
        }

        .loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 18px;
        }

        /* 红点样式 */
        .red-dot {
            position: absolute;
            width: 12px;
            height: 12px;
            background: #f44336;
            border: 2px solid #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 200;
            box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4); }
            50% { box-shadow: 0 2px 12px rgba(244, 67, 54, 0.8); }
            100% { box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4); }
        }

        /* 橡皮擦指示器 */
        .eraser-indicator {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 2px dashed rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 150;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.1);
        }

        .eraser-icon {
            position: absolute;
            width: 30px;
            height: 30px;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 151;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.9);
        }

        /* 侧边导航栏 */
        .side-nav {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 1000;
            transition: opacity 0.3s ease;
        }

        .side-nav:hover {
            opacity: 1 !important;
        }

        .side-nav.left-nav {
            left: 20px;
        }

        .side-nav.right-nav {
            right: 20px;
        }

        .side-nav button {
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            padding: 12px 16px;
            border-radius: 50%;
            color: #666;
            transition: all 0.2s ease;
            min-width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .side-nav button:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #333;
            transform: scale(1.1);
        }

        .side-nav button:active {
            transform: scale(0.95);
        }

        .side-nav button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        @media (max-width: 768px) {
            .side-nav {
                padding: 8px;
                gap: 8px;
            }

            .side-nav button {
                padding: 10px 14px;
                font-size: 24px;
                min-width: 40px;
                height: 40px;
            }

            .toolbar {
                bottom: 20px;
                left: 20px;
                padding: 8px 15px;
                gap: 8px;
            }

            .tool-btn {
                padding: 6px 12px;
                font-size: 12px;
                min-width: 60px;
            }
        }
    </style>
</head>
<body>
    <div class="loading" id="loading">加载中...</div>

    <div class="slide-container" id="slideContainer">
        <iframe id="slideFrame" class="slide-frame" src="slides/${project.slides[0]?.name || ''}.html"></iframe>
        <canvas id="drawingCanvas" class="drawing-canvas"></canvas>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar" id="toolbar">
        <button class="tool-btn" id="penTool" onclick="setTool('pen')">
            ✏️ 画笔
        </button>
        <button class="tool-btn" id="eraserTool" onclick="setTool('eraser')">
            🧽 橡皮
        </button>
        <button class="tool-btn" id="clearTool" onclick="clearDrawing()">
            🗑️ 清除
        </button>
        <button class="tool-btn" id="redDotTool" onclick="toggleRedDot()">
            🔴 红点
        </button>
        <div class="color-picker-container" id="colorPickerContainer">
            <div class="color-picker red" onclick="setColor('#f44336')" title="红色"></div>
            <div class="color-picker blue" onclick="setColor('#2196f3')" title="蓝色"></div>
            <div class="color-picker green" onclick="setColor('#4caf50')" title="绿色"></div>
            <div class="color-picker yellow" onclick="setColor('#ff9800')" title="黄色"></div>
        </div>
    </div>

    <button class="fullscreen-btn" onclick="toggleFullscreen()" title="全屏">⛶</button>

    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>

    <!-- 左侧导航 -->
    <div class="side-nav left-nav">
        <button onclick="previousSlide()" title="上一页" ${project.slides.length <= 1 ? 'disabled' : ''}>‹</button>
        <button onclick="nextSlide()" title="下一页" ${project.slides.length <= 1 ? 'disabled' : ''}>›</button>
    </div>

    <!-- 右侧导航 -->
    <div class="side-nav right-nav">
        <button onclick="previousSlide()" title="上一页" ${project.slides.length <= 1 ? 'disabled' : ''}>‹</button>
        <button onclick="nextSlide()" title="下一页" ${project.slides.length <= 1 ? 'disabled' : ''}>›</button>
    </div>

    <!-- 页码指示器 -->
    <div class="page-indicator">
        <span id="currentSlide">1</span> / <span id="totalSlides">${project.slides.length}</span>
    </div>

    <!-- 鼠标位置指示器容器 -->
    <div id="mouseIndicator" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 199;">
        <!-- 红点和橡皮擦指示器将在这里动态创建 -->
    </div>

    <script>
        const slides = ['${slideFiles}'];
        let currentSlideIndex = 0;
        const slideFrame = document.getElementById('slideFrame');
        const loading = document.getElementById('loading');
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        const toolbar = document.getElementById('toolbar');
        const slideContainer = document.getElementById('slideContainer');
        const pageIndicator = document.querySelector('.page-indicator');
        const colorPickerContainer = document.getElementById('colorPickerContainer');
        const mouseIndicator = document.getElementById('mouseIndicator');

        // 绘图相关变量
        let isDrawing = false;
        let currentTool = 'pen';
        let currentColor = '#f44336';
        let isDrawingMode = false;
        let slideDrawings = {}; // 存储每页的绘图数据
        let redDots = []; // 存储红点数据
        let mousePosition = { x: 0, y: 0 };
        let showRedDot = true;
        let eraserIndicator = null;
        let eraserIcon = null;

        // 初始化画布
        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 3;
            ctx.strokeStyle = currentColor;
        }

        // 更新进度
        function updateProgress() {
            const progress = ((currentSlideIndex + 1) / slides.length) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }

        // 更新导航按钮状态
        function updateNavigationButtons() {
            const buttons = document.querySelectorAll('.side-nav button');
            buttons.forEach(button => {
                if (button.getAttribute('onclick') === 'previousSlide()') {
                    button.disabled = currentSlideIndex === 0;
                } else if (button.getAttribute('onclick') === 'nextSlide()') {
                    button.disabled = currentSlideIndex === slides.length - 1;
                }
            });
        }

        // 保存当前页的绘图
        function saveCurrentSlideDrawing() {
            const imageData = canvas.toDataURL();
            slideDrawings[currentSlideIndex] = {
                imageData: imageData,
                redDots: [...redDots]
            };
        }

        // 加载指定页的绘图
        function loadSlideDrawing(slideIndex) {
            clearCanvas();
            redDots = [];

            const drawing = slideDrawings[slideIndex];
            if (drawing) {
                const img = new Image();
                img.onload = function() {
                    ctx.drawImage(img, 0, 0);
                };
                img.src = drawing.imageData;

                // 恢复红点
                drawing.redDots.forEach(dot => {
                    createRedDot(dot.x, dot.y);
                });
            }
        }

        
        // 设置工具
        function setTool(tool) {
            // 如果点击的是当前已激活的工具，则取消绘图模式
            if (currentTool === tool && isDrawingMode) {
                isDrawingMode = false;
                currentTool = null;
                canvas.classList.remove('drawing-mode');
                canvas.style.cursor = 'default';
                document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
                colorPickerContainer.classList.remove('show');
                hideEraserIndicator();
                return;
            }

            currentTool = tool;
            document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tool + 'Tool').classList.add('active');

            if (tool === 'pen') {
                isDrawingMode = true;
                canvas.classList.add('drawing-mode');
                canvas.style.cursor = 'crosshair';
                colorPickerContainer.classList.add('show');
                hideEraserIndicator();
            } else if (tool === 'eraser') {
                isDrawingMode = true;
                canvas.classList.add('drawing-mode');
                canvas.style.cursor = 'grab';
                colorPickerContainer.classList.remove('show');
                showEraserIndicator();
            } else {
                isDrawingMode = false;
                canvas.classList.remove('drawing-mode');
                canvas.style.cursor = 'default';
                colorPickerContainer.classList.remove('show');
                hideEraserIndicator();
            }
        }

        // 设置颜色
        function setColor(color) {
            currentColor = color;
            ctx.strokeStyle = color;
        }

        // 切换红点显示
        function toggleRedDot() {
            showRedDot = !showRedDot;
            const redDotTool = document.getElementById('redDotTool');
            if (showRedDot) {
                redDotTool.classList.add('active');
            } else {
                redDotTool.classList.remove('active');
                // 隐藏所有现有红点
                document.querySelectorAll('.red-dot').forEach(dot => dot.remove());
            }
        }

        // 清除绘图
        function clearDrawing() {
            clearCanvas();
            redDots = [];
            saveCurrentSlideDrawing();
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 清除所有红点
            document.querySelectorAll('.red-dot').forEach(dot => dot.remove());
        }

        // 显示橡皮擦指示器
        function showEraserIndicator() {
            if (!eraserIndicator) {
                eraserIndicator = document.createElement('div');
                eraserIndicator.className = 'eraser-indicator';
                mouseIndicator.appendChild(eraserIndicator);
            }
            if (!eraserIcon) {
                eraserIcon = document.createElement('div');
                eraserIcon.className = 'eraser-icon';
                eraserIcon.textContent = '🧽';
                mouseIndicator.appendChild(eraserIcon);
            }
            updateEraserPosition();
        }

        // 隐藏橡皮擦指示器
        function hideEraserIndicator() {
            if (eraserIndicator) {
                eraserIndicator.remove();
                eraserIndicator = null;
            }
            if (eraserIcon) {
                eraserIcon.remove();
                eraserIcon = null;
            }
        }

        // 更新橡皮擦位置
        function updateEraserPosition() {
            if (eraserIndicator && eraserIcon) {
                eraserIndicator.style.left = mousePosition.x + 'px';
                eraserIndicator.style.top = mousePosition.y + 'px';
                eraserIcon.style.left = mousePosition.x + 'px';
                eraserIcon.style.top = mousePosition.y + 'px';
            }
        }

        // 创建红点
        function createRedDot(x, y) {
            const dot = document.createElement('div');
            dot.className = 'red-dot';
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            slideContainer.appendChild(dot);
            return dot;
        }

        // 绘图事件
        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        // 更新鼠标位置
        function updateMousePosition(e) {
            const rect = slideContainer.getBoundingClientRect();
            mousePosition.x = e.clientX - rect.left;
            mousePosition.y = e.clientY - rect.top;
            updateEraserPosition();
        }

        function startDrawing(e) {
            if (!isDrawingMode) return;

            const pos = getMousePos(e);

            if (currentTool === 'pen') {
                isDrawing = true;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            } else if (currentTool === 'eraser') {
                isDrawing = true;
                // 橡皮擦功能
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        function draw(e) {
            if (!isDrawing || !isDrawingMode) return;

            const pos = getMousePos(e);

            if (currentTool === 'pen') {
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            } else if (currentTool === 'eraser') {
                // 橡皮擦拖拽功能
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        }

        function stopDrawing() {
            if (isDrawing) {
                isDrawing = false;
                ctx.beginPath();
                saveCurrentSlideDrawing();
            }
        }

        // 显示幻灯片
        function showSlide(index) {
            if (index >= 0 && index < slides.length) {
                // 保存当前页的绘图
                saveCurrentSlideDrawing();

                loading.style.display = 'block';
                currentSlideIndex = index;

                slideFrame.onload = function() {
                    loading.style.display = 'none';
                    // 加载新页的绘图
                    loadSlideDrawing(index);
                };

                slideFrame.src = 'slides/' + slides[index];
                document.getElementById('currentSlide').textContent = index + 1;
                updateProgress();
                updateNavigationButtons();
            }
        }

        function nextSlide() {
            if (currentSlideIndex < slides.length - 1) {
                showSlide(currentSlideIndex + 1);
            }
        }

        function previousSlide() {
            if (currentSlideIndex > 0) {
                showSlide(currentSlideIndex - 1);
            }
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }

        // 事件监听
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // 触摸事件支持
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });

        // 鼠标移动监听
        slideContainer.addEventListener('mousemove', updateMousePosition);

        // 红点功能 - 双击创建红点
        slideContainer.addEventListener('dblclick', (e) => {
            if (e.target === slideContainer || e.target === canvas) {
                if (!showRedDot) return; // 如果红点功能关闭，则不创建

                const rect = slideContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const dot = createRedDot(x, y);
                redDots.push({x, y});
                saveCurrentSlideDrawing();
            }
        });

        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    previousSlide();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'Home':
                    showSlide(0);
                    break;
                case 'End':
                    showSlide(slides.length - 1);
                    break;
                case 'd':
                    // 快速切换绘图模式
                    if (currentTool === 'pen') {
                        setTool('eraser');
                    } else if (currentTool === 'eraser') {
                        // 如果当前是橡皮擦，点击橡皮擦按钮来取消绘图模式
                        setTool('eraser');
                    } else {
                        setTool('pen');
                    }
                    break;
                case 'c':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        clearDrawing();
                    }
                    break;
            }
        });

        // 鼠标滚轮控制
        let wheelTimeout;
        slideFrame.addEventListener('wheel', (e) => {
            e.preventDefault();
            clearTimeout(wheelTimeout);

            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }, 50);
        });

        // 触摸手势支持
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                previousSlide();
            }
        }

        // 窗口大小改变时重新调整画布
        window.addEventListener('resize', () => {
            const tempDrawings = {...slideDrawings};
            initCanvas();
            slideDrawings = tempDrawings;
            loadSlideDrawing(currentSlideIndex);
        });

        // 初始化
        window.addEventListener('load', () => {
            initCanvas();
            showSlide(0);

            // 更新按钮状态
            updateNavigationButtons();
        });

        // 防止iframe内部链接跳出
        slideFrame.addEventListener('load', function() {
            try {
                const iframeDoc = slideFrame.contentDocument || slideFrame.contentWindow.document;
                const links = iframeDoc.getElementsByTagName('a');
                for (let link of links) {
                    link.addEventListener('click', function(e) {
                        if (link.getAttribute('href').startsWith('#')) {
                            e.preventDefault();
                        }
                    });
                }
            } catch (e) {
                // 跨域限制，忽略错误
            }
        });
    </script>
</body>
</html>`;
  }
}