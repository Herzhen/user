/**
 * Speed Insights Demo Route
 * 
 * This route serves a simple HTML page to demonstrate that Speed Insights
 * is properly configured and working. The middleware will inject the
 * Speed Insights script into this HTML response.
 */

const express = require('express');
const router = express.Router();

router.get('/demo', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Speed Insights Demo - User API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      min-height: 100vh;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #667eea;
      margin-top: 0;
    }
    .badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      margin-left: 10px;
    }
    .info-box {
      background: #f3f4f6;
      border-left: 4px solid #667eea;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .api-list {
      list-style: none;
      padding: 0;
    }
    .api-list li {
      background: #f9fafb;
      margin: 8px 0;
      padding: 12px 16px;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }
    .api-list code {
      color: #667eea;
      font-weight: 600;
    }
    footer {
      margin-top: 40px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>
      🚀 Vercel Speed Insights
      <span class="badge">已启用</span>
    </h1>
    
    <div class="info-box">
      <strong>✅ Speed Insights 已成功配置</strong>
      <p>此页面已集成 Vercel Speed Insights，用于监测和分析网站性能指标（Core Web Vitals）。</p>
    </div>

    <h2>可用的 API 端点：</h2>
    <ul class="api-list">
      <li><code>POST /api/auth/register</code> - 用户注册</li>
      <li><code>POST /api/auth/login</code> - 用户登录</li>
      <li><code>GET /api/user/profile</code> - 获取用户资料</li>
      <li><code>POST /api/images/upload</code> - 上传图片</li>
      <li><code>GET /api/images</code> - 获取图片列表</li>
    </ul>

    <h2>Speed Insights 功能：</h2>
    <ul class="api-list">
      <li>📊 监测 Largest Contentful Paint (LCP)</li>
      <li>⚡ 监测 First Input Delay (FID)</li>
      <li>📐 监测 Cumulative Layout Shift (CLS)</li>
      <li>🔍 监测 First Contentful Paint (FCP)</li>
      <li>📈 实时性能数据分析</li>
    </ul>

    <div class="info-box">
      <strong>💡 提示：</strong>
      <p>性能数据将发送到 Vercel 仪表板，您可以在项目的 Speed Insights 部分查看详细报告。</p>
    </div>
  </div>

  <footer>
    <p>Powered by Vercel Speed Insights | User Management API</p>
  </footer>
</body>
</html>
  `);
});

module.exports = router;
