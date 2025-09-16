# html-PPT

[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-007fff.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个功能强大的 Web 应用程序，用于创建、管理和演示 HTML 幻灯片。支持导入导出、实时编辑、全屏播放等丰富功能。

## ✨ 主要特性

### 🎨 幻灯片管理
- **多格式导入**：支持单个 HTML 文件、ZIP 项目包、文件夹导入
- **拖拽排序**：直观的拖拽界面重新排列幻灯片顺序
- **实时预览**：即时预览幻灯片效果，支持 16:9 和 4:3 比例
- **缩略图显示**：自动生成带主题样式的缩略图

### 🛠️ 编辑功能
- **源码编辑**：集成 Monaco 编辑器，支持 HTML 源码编辑和语法高亮
- **主题配置**：支持自定义项目主题色彩和样式
- **实时同步**：编辑内容即时反映在预览中

### 🎭 播放功能
- **全屏播放**：沉浸式全屏演示体验
- **绘制工具**：
  - 🖊️ 多色画笔工具
  - 🧽 橡皮擦（支持拖拽擦除）
  - 🔴 红点指示器（可开关）
  - 🗑️ 清除功能
- **多种控制方式**：
  - 鼠标点击导航按钮
  - 键盘快捷键控制
  - 触摸手势支持
  - 鼠标滚轮翻页

### 📦 导出功能
- **项目保存**：保存为可重新编辑的文件夹格式
- **独立播放器**：导出包含完整播放功能的独立 ZIP 包
- **完整功能**：导出的播放器支持所有编辑和导航功能
- **跨平台**：可在任何现代浏览器中运行

### 🎨 界面设计
- **现代 UI**：基于 Material-UI 的现代化界面设计
- **响应式布局**：完美适配桌面和移动设备
- **透明效果**：播放界面采用玻璃态设计，自动透明效果
- **多主题支持**：浅色、深色、简约、商务等多种主题

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/your-username/html-PPT.git
cd html-PPT

# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `build/` 目录中。

## 📖 使用指南

### 导入幻灯片

#### 方法一：导入 HTML 文件
1. 点击顶部工具栏的"导入HTML"按钮
2. 选择一个或多个 HTML 文件
3. 系统自动解析并创建幻灯片

#### 方法二：导入 ZIP 项目包
1. 点击"导入ZIP"按钮
2. 选择包含幻灯片项目的 ZIP 文件
3. 系统自动解压并加载项目配置

#### 方法三：打开文件夹
1. 点击"打开文件夹"按钮
2. 选择包含项目的文件夹（必须包含 `config.json`）
3. 系统读取项目结构和配置

### 项目配置

创建项目时可以配置以下选项：

- **项目信息**：标题、描述、作者、公司
- **主题色彩**：自定义主色、辅色、强调色等
- **播放设置**：自动播放、循环、控制按钮显示
- **幻灯片顺序**：按配置文件中的顺序排列

### 编辑幻灯片

#### 预览模式
- 点击左侧幻灯片列表中的任意幻灯片
- 右侧显示实时预览效果
- 支持切换 16:9 和 4:3 显示比例

#### 源码编辑模式
1. 点击预览面板右上角的"源码"按钮
2. 使用 Monaco 编辑器编辑 HTML 代码
3. 支持语法高亮、自动补全、错误检查
4. 按 `Ctrl+S` 保存更改

#### 快捷键（编辑器）
- `Ctrl+S`：保存更改
- `Ctrl+F`：查找
- `Ctrl+H`：替换
- `Ctrl+Z`：撤销
- `Ctrl+Y`：重做

### 播放控制

#### 开始播放
1. 导入幻灯片后，点击顶部"播放"按钮
2. 或使用键盘快捷键 `F` 进入全屏播放

#### 播放中的控制
- **鼠标控制**：
  - 点击左右两侧导航按钮翻页
  - 底部工具栏选择绘制工具
  - 滚轮上下滚动翻页

- **键盘快捷键**：
  - `←` / `→`：上一页 / 下一页
  - `空格`：下一页
  - `Home`：第一页
  - `End`：最后一页
  - `F`：全屏切换
  - `Esc`：退出播放
  - `D`：快速切换绘图工具
  - `Ctrl+C`：清除当前页绘制内容

- **触摸手势**：
  - 左右滑动：翻页
  - 点击：选择工具

#### 绘制工具使用
1. **画笔工具**：
   - 点击画笔按钮激活
   - 选择颜色（红、蓝、绿、黄、黑）
   - 在幻灯片上拖拽绘制

2. **橡皮擦工具**：
   - 点击橡皮擦按钮激活
   - 拖拽擦除绘制内容
   - 显示圆形指示器

3. **红点工具**：
   - 点击红点按钮开关功能
   - 双击幻灯片创建红点指示器
   - 再次点击按钮隐藏所有红点

4. **清除工具**：
   - 清除当前页所有绘制内容
   - 包括画笔痕迹和红点

### 导出功能

#### 项目保存（可编辑）
1. 完成编辑后，点击"保存项目"按钮
2. 生成 ZIP 文件，包含完整的项目结构
3. 可重新导入系统继续编辑

#### 独立播放器（分享用）
1. 点击"导出ZIP"按钮
2. 生成包含独立播放器的 ZIP 包
3. 解压后直接打开 `player.html` 即可播放
4. 支持完整的播放和绘制功能

## 📁 项目结构

```
html-PPT/
├── public/                    # 静态资源
│   └── index.html             # HTML 模板
├── src/                       # 源代码
│   ├── components/            # React 组件
│   │   ├── Header.tsx        # 顶部导航栏
│   │   ├── SlideList.tsx     # 幻灯片列表
│   │   ├── PreviewPanel.tsx  # 预览面板
│   │   ├── PlaybackModal.tsx # 播放模态框
│   │   └── ProjectConfigDialog.tsx # 项目配置对话框
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # 项目、幻灯片等类型
│   ├── utils/                # 工具函数
│   │   ├── slideParser.ts   # HTML 幻灯片解析器
│   │   ├── zipHandler.ts    # ZIP 文件处理
│   │   └── themeUtils.ts    # 主题样式工具
│   ├── App.tsx               # 主应用组件
│   ├── index.tsx             # 应用入口
│   └── styles/               # 样式文件
├── example-presentation/     # 示例项目
│   ├── config.json           # 项目配置
│   ├── theme.css             # 主题样式
│   ├── slides/               # 幻灯片文件
│   └── assets/               # 资源文件
├── package.json              # 项目配置
├── README.md                 # 项目说明
└── tsconfig.json            # TypeScript 配置
```

## 🎨 主题系统

### CSS 变量

项目使用 CSS 变量实现主题切换：

```css
:root {
  --primary-color: #1976d2;     /* 主色调 */
  --secondary-color: #dc004e;   /* 次色调 */
  --accent-color: #00bcd4;      /* 强调色 */
  --background-color: #ffffff;   /* 背景色 */
  --surface-color: #f5f5f5;      /* 表面色 */
  --text-primary: #212121;       /* 主要文字 */
  --text-secondary: #757575;     /* 次要文字 */
  --border-color: #e0e0e0;       /* 边框色 */
}
```

### 主题切换

支持多种主题模式：

```html
<!-- 深色主题 -->
<html data-theme="dark">

<!-- 简约主题 -->
<html data-theme="minimal">

<!-- 商务主题 -->
<html data-theme="business">
```

### 自定义主题

在 `theme.css` 中添加自定义主题：

```css
[data-theme="custom"] {
  --primary-color: #your-color;
  --secondary-color: #your-secondary-color;
  /* 其他变量... */
}
```

## 📱 示例项目

项目包含完整的示例演示 `example-presentation/`，展示了系统的所有功能：

### 项目结构
- **配置文件**：`config.json` - 项目信息和设置
- **主题样式**：`theme.css` - 全局样式和主题变量
- **幻灯片**：`slides/` - 5 个示例幻灯片页面
- **资源文件**：`assets/` - 图片和其他资源

### 使用示例
```bash
# 在应用中打开示例项目
1. 启动应用：npm start
2. 点击"打开文件夹"按钮
3. 选择 example-presentation 文件夹
4. 查看自动加载的项目配置和幻灯片
```

## 🔧 技术栈

- **前端框架**：React 18.2.0 + TypeScript 4.9.5
- **UI 组件库**：Material-UI (MUI) 7.3.2
- **代码编辑器**：Monaco Editor 4.7.0
- **文件处理**：JSZip 3.10.1
- **拖拽功能**：React DnD 16.0.1
- **构建工具**：Create React App 5.0.1
- **样式方案**：CSS + CSS-in-JS (Emotion)

## 🚀 部署指南

### 本地部署

```bash
# 构建项目
npm run build

# 使用 Python 简单服务器
cd build
python -m http.server 8080

# 或使用 Node.js serve
npx serve -s build -l 8080
```

### 服务器部署

1. **构建项目**：`npm run build`
2. **上传文件**：将 `build/` 目录内容上传到 Web 服务器
3. **配置路由**：确保服务器支持 HTML5 History API（React Router）

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. **Fork 项目**
2. **创建功能分支**：`git checkout -b feature/amazing-feature`
3. **提交更改**：`git commit -m 'Add amazing feature'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **提交 Pull Request**

### 开发规范

- 使用 TypeScript 编写类型安全的代码
- 遵循 ESLint 和 Prettier 代码规范
- 编写清晰的组件和函数文档
- 提交前运行测试确保功能正常

## 📝 更新日志

### v1.0.0 (2024-01-15)
- ✅ 初始版本发布
- ✅ 基础幻灯片管理功能
- ✅ 拖拽排序支持
- ✅ 全屏播放模式
- ✅ ZIP 导入导出
- ✅ 源码编辑器集成
- ✅ 绘制工具（画笔、橡皮擦、红点）
- ✅ 独立播放器导出
- ✅ 多主题支持
- ✅ 响应式设计

### 近期更新
- ✅ 添加文件夹导入功能
- ✅ 改进导出播放器界面
- ✅ 完善绘制工具功能
- ✅ 优化用户交互体验
- ✅ 修复已知问题和性能优化

## 🐛 问题反馈

如果您遇到问题或有改进建议，请：

1. 查看 [FAQ](docs/FAQ.md)
2. 搜索现有的 [Issues](https://github.com/your-username/html-PPT/issues)
3. 创建新的 Issue 描述问题

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://reactjs.org/) - 用户界面构建
- [Material-UI](https://mui.com/) - UI 组件库
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [JSZip](https://stuk.github.io/jszip/) - ZIP 文件处理

## 📞 联系我们

- **项目主页**：[GitHub Repository](https://github.com/your-username/html-PPT)
- **问题反馈**：[GitHub Issues](https://github.com/your-username/html-PPT/issues)
- **邮件联系**：your-email@example.com

---

**⭐ 如果这个项目对您有帮助，请给我们一个 Star！**