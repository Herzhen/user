const User = require('../models/User');
const Favorite = require('../models/Favorite');

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "'用户不存在'" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取当前用户收藏的图片列表
exports.getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.userId })
      .populate({
        path: 'image',
        populate: { path: 'user', select: 'username' },
      })
      .sort({ createdAt: -1 });

    // 提取图片信息
    const images = favorites.map(fav => fav.image).filter(Boolean);

    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};