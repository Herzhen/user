const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);


// 微信一键登录
router.post('/wechatPhoneLogin', authController.wechatPhoneLogin);

module.exports = router;