const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const Favorite = require('../models/Favorite');

// 上传图片
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "10000" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const category = req.body.category || null;
    const validCategories = ['A', 'B', 'C', 'D'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: "99999" });
    }
    const image = await Image.create({
      user: req.user.userId,
      imageUrl,
      title: req.body.title || '',
      category,
      
    });
    res.status(201).json({
      message: "上传成功",
      image: {
        id: image._id,
        url: imageUrl,
        title: image.title,
        category: image.category,
      
      },
    });
  } catch (err) {
    console.error("上传错误:", err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取所有图片
exports.getAllImages = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const images = await Image.find(filter)
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 修改分类
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const validCategories = ['A', 'B', 'C', 'D'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: '分类不合法' });
    }
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: '图片不存在' });
    if (image.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: '无权修改' });
    }
    image.category = category;
    await image.save();
    res.json({ message: '分类修改成功', image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 收藏
exports.favoriteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user.userId;
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ message: '图片不存在' });
    const existing = await Favorite.findOne({ user: userId, image: imageId });
    if (existing) return res.status(409).json({ message: '已经收藏过了' });
    await Favorite.create({ user: userId, image: imageId });
    res.json({ message: '收藏成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 取消收藏
exports.unfavoriteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.user.userId;
    const result = await Favorite.findOneAndDelete({ user: userId, image: imageId });
    if (!result) return res.status(404).json({ message: '未收藏该图片' });
    res.json({ message: '取消收藏成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除图片（需登录，仅上传者可以删除）
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: '"图片不存在"' });
    }

    // 只允许上传者删除
    // if (image.user.toString() !== req.user.userId) {
    //   return res.status(403).json({ message: '无权删除' });
    // }

    // 删除服务器上的物理文件
    const filePath = path.join(__dirname, '..', image.imageUrl); // 因为 imageUrl 是 /uploads/xxx
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除收藏相关记录
    await Favorite.deleteMany({ image: image._id });

    // 删除数据库记录
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除错误:', err);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 设置/取消推荐（需登录，仅上传者可以操作）
exports.toggleRecommend = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: '"图片不存在"' });
    }

    if (image.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "无权操作" });
    }

    // 切换状态（如果 req.body.recommend 明确传了 true/false 则按参数，否则取反）
    const newRecommend =
      req.body.recommend !== undefined ? req.body.recommend : !image.isRecommended;

    image.isRecommended = newRecommend;
    await image.save();

    res.json({
      message: newRecommend ? '已设为推荐' : '已取消推荐',
      image: {
        id: image._id,
        isRecommended: image.isRecommended,
      },
    });
  } catch (err) {
    console.error('推荐操作错误:', err);
    res.status(500).json({ message: "'服务器内部错误'" });
  }
};