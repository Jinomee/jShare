# jShare - File Sharing Application

*English | [简体中文](README.zh-CN.md)*

A modern file sharing application built with Vue.js, Node.js, and Express. Features include real-time file sharing, admin panel, and user management.

## Features

- 🚀 Real-time file sharing
- 📱 Responsive design
- 🔒 Secure file handling
- 👥 User management
- 📊 Admin dashboard
- 🌙 Dark mode support
- 🔄 Real-time updates

## Tech Stack

- Frontend: Vue.js, Tailwind CSS
- Backend: Node.js, Express
- Database: SQLite
- Real-time: Socket.io
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jshare.git
cd jshare
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
cp backend/.env.example backend/.env
# Edit the .env file with your configuration
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm run serve
```

## Deployment

### Backend Deployment

1. Build the frontend:
```bash
cd frontend
npm run serve
```

2. Copy the built files to the backend public directory:
```bash
cp -r frontend/dist/* backend/public/
```

3. Start the production server:
```bash
cd backend
npm start
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Nginx Configuration (Optional)

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
