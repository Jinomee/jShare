# jShare - 文件共享应用

一个使用 Vue.js、Node.js 和 Express 构建的现代文件共享应用。具有实时文件共享、管理面板和用户管理功能。

## 功能特点

- 🚀 实时文件共享
- 📱 响应式设计
- 🔒 安全的文件处理
- 👥 用户管理
- 📊 管理面板
- 🌙 深色模式支持
- 🔄 实时更新

## 技术栈

- 前端：Vue.js, Tailwind CSS
- 后端：Node.js, Express
- 数据库：SQLite
- 实时通信：Socket.io
- 认证：JWT

## 环境要求

- Node.js (v14 或更高版本)
- npm (v6 或更高版本)

## 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/jshare.git
cd jshare
```

2. 安装依赖：
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. 配置环境变量：
```bash
# 后端 (.env)
cp backend/.env.example backend/.env
# 编辑 .env 文件进行配置
```

4. 启动开发服务器：
```bash
# 启动后端服务器
cd backend
npm run dev

# 启动前端服务器（新终端）
cd frontend
npm run serve
```

## 部署

### 后端部署

1. 构建前端：
```bash
cd frontend
npm run serve
```

2. 复制构建文件到后端公共目录：
```bash
cp -r frontend/dist/* backend/public/
```

3. 启动生产服务器：
```bash
cd backend
npm start
```

### 环境变量配置

在 backend 目录创建 `.env` 文件，包含以下变量：

```env
PORT=3000
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Nginx 配置（可选）

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加新特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 支持

如需支持，请在 GitHub 仓库中提交 issue。 