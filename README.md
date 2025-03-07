# AISO Web Admin

[![Vue](https://img.shields.io/badge/Vue-3.5.12-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-purple.svg)](https://vitejs.dev/)
[![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-4.2.5-blue.svg)](https://antdv.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 项目介绍

AISO Web Admin 是一个基于 Vue 3、TypeScript 和 Vite 构建的现代化后台管理系统模板。项目采用最新的前端技术栈，提供了丰富的功能组件和优秀的开发体验。通过集成 Ant Design Vue 组件库，实现了美观且功能丰富的用户界面，同时支持多语言切换、权限管理等企业级特性。

### ✨ 特性

- 🚀 采用 Vue 3 + TypeScript + Vite 开发，享受现代化开发体验
- 🎨 集成 Ant Design Vue，提供美观且功能丰富的UI组件
- 🌐 内置国际化支持，轻松实现多语言切换
- 📦 组件按需加载，优化打包体积
- 🔐 完善的权限管理系统
- 📊 集成多种数据可视化组件
- 🛠️ 丰富的开发工具和调试功能
- 📱 响应式设计，支持多端适配
- 🔥 热更新，提升开发效率
- 🎯 TypeScript 类型支持，代码更安全

## 💻 技术栈

- **核心框架**：Vue 3 - 渐进式 JavaScript 框架
- **开发语言**：TypeScript - 带类型定义的 JavaScript
- **构建工具**：Vite - 下一代前端构建工具
- **UI 框架**：Ant Design Vue - 企业级 Vue 组件库
- **状态管理**：Pinia - 直观、类型安全的状态管理
- **路由管理**：Vue Router - Vue.js 官方路由
- **数据可视化**：ECharts、AntV G2 - 强大的图表库
- **富文本编辑器**：Wang Editor - 现代化的富文本编辑器
- **代码编辑器**：Monaco Editor - VS Code 同款编辑器
- **工具库**：
  - dayjs - 轻量级日期处理库
  - axios - 基于 Promise 的 HTTP 客户端
  - VueUse - Vue 组合式 API 工具集

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- Yarn >= 4.6.0

### 安装依赖

```bash
yarn install
```

### 开发环境运行

```bash
yarn dev
```

### 生产环境构建

```bash
yarn build
```

## 📁 项目结构

```
src/
├── assets/        # 静态资源文件
├── core/          # 核心功能模块
│   ├── components/  # 公共组件
│   ├── router/     # 路由配置
│   ├── store/      # 状态管理
│   └── utils/      # 工具函数
├── locale/        # 国际化资源文件
├── services/      # API 服务接口
├── views/         # 页面组件
└── plugins/       # 插件配置
```

## 📖 开发指南

### 推荐的 IDE 配置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### TypeScript 支持

项目默认开启了 Volar 的 Take Over 模式，提供了完整的 TypeScript 类型支持。如需配置，请参考以下步骤：

1. 在 VS Code 命令面板中运行 `Extensions: Show Built-in Extensions`
2. 找到 `TypeScript and JavaScript Language Features`
3. 右键选择 `Disable (Workspace)`
4. 重新加载 VS Code

## 🤝 贡献指南

欢迎提交问题和改进建议！在提交 Pull Request 之前，请确保：

1. Fork 本仓库
2. 创建新的分支：`git checkout -b feature/your-feature`
3. 提交你的更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)
