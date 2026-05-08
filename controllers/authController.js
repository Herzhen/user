const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getPhoneNumberByCode } = require('../utils/wechat');
// 注册
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: '用户名已存在' });
    }

    const user = await User.create({ username, password });

    res.status(201).json({
      message: '注册成功',
      userId: user._id,
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 登录
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 微信一键登录
exports.wechatPhoneLogin = async (req, res) => {
  const { code } = req.body; // 前端传 wx.getPhoneNumber 返回的 code

  if (!code) {
    return res.status(400).json({ message: '缺少参数code' });
  }

  try {
    // 1. 换取手机号
    const phone = await getPhoneNumberByCode(code);

    // 2. 查找用户，没有则自动注册
    let user = await User.findOne({ username: phone });
    if (!user) {
      // 自动注册：用户名=手机号，密码随机生成（用户以后只能通过一键登录/验证码登录）
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await User.create({
        username: phone,
        password: randomPassword,
      });
    }

    // 3. 生成 token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error('一键登录失败:', err.message);
    res.status(500).json({ message: '登录失败，请稍后重试' });
  }
};