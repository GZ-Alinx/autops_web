# 权限管理平台开发底座

## 项目简介
这是一个基于Vue 3和Element Plus构建的权限管理平台开发底座，提供用户管理、角色管理、权限策略管理等功能，可作为各类系统的权限管理模块基础。

## 技术栈
- 前端框架：Vue 3
- 构建工具：Vite
- UI组件库：Element Plus
- 状态管理：Pinia
- 路由管理：Vue Router
- HTTP客户端：Axios

## 环境搭建
### 前提条件
- Node.js 16.0.0 或更高版本
- npm 8.0.0 或更高版本

### 安装依赖
```bash
# 克隆项目
git clone <项目仓库地址>

# 进入项目目录
cd autops_web

# 安装依赖
npm install
```

## 服务启动
### 开发环境启动
```bash
# 启动开发服务器，默认端口为5173
npm run dev
```
启动后，可通过浏览器访问 `http://localhost:5173` 查看应用。

### 预览生产环境构建
```bash
# 构建生产环境代码
npm run build

# 预览构建结果，默认端口为4173
npm run preview
```
预览时，可通过浏览器访问 `http://localhost:4173` 查看构建后的应用。

## 项目构建
### 生产环境构建
```bash
# 构建生产环境代码，输出到dist目录
npm run build
```
构建完成后，`dist` 目录下的文件可部署到服务器。

### 构建配置
构建配置文件位于项目根目录下的 `vite.config.js`，可根据需要修改配置。

## 项目结构
```
autops_web/
├── .env.development       # 开发环境变量
├── .gitignore             # Git忽略文件
├── index.html             # 入口HTML文件
├── package.json           # 项目依赖和脚本
├── public/                # 静态资源
├── src/                   # 源代码
│   ├── App.vue            # 根组件
│   ├── api/               # API接口封装
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── main.js            # 入口文件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── style.css          # 全局样式
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
└── vite.config.js         # Vite配置文件
```

## 功能模块
1. **用户管理**：用户的增删改查、角色分配
2. **角色管理**：角色的增删改查
3. **权限管理**：权限策略的添加、删除和查询
4. **仪表盘**：系统概览和用户活动统计

## 注意事项
1. 开发环境配置文件为 `.env.development`，可根据实际情况修改API地址等配置
2. 项目使用Vue 3的 `<script setup>` 语法，具体可参考 [Vue 3 文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)
3. 权限管理基于角色和资源路径的访问控制策略
