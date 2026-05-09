// api/index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('../routes/auth');
const imageRoutes = require('../routes/image');
const userRoutes = require('../routes/user');

const app = express();

// 连接数据库（Vercel 冷启动时会重新连接，但建议使用缓存）
let isDBConnected = false;
app.use(async (req, res, next) => {
  if (!isDBConnected) {
    await connectDB();
    isDBConnected = true;
  }
  next();
});

app.use(cors());
app.use(express.json());

// 挂载路由
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/user', userRoutes);

// 健康检查
app.get('/api', (req, res) => res.json({ status: 'Vercel 运行正常' }));

// 导出为 Vercel Serverless Function
module.exports = app;