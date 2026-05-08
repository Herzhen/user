global.crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ quiet: true });
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/image');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

// 静态文件托管，让上传的图片可访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 提供静态 HTML 页面（用于 Speed Insights）
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/user', userRoutes);

app.get('/status', (req, res) => {
  res.json({ status: '后端运行中' });
});

// multer 错误处理
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: '文件大小不能超过5MB' });
  }
  if (err.message === '只允许上传图片文件') {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`服务已启动: http://localhost:${PORT}`);
});