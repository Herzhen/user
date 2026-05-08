const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const imageController = require('../controllers/imageController');

// ---------- multer 配置 ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});
// ---------------------------------

// 路由
router.post('/upload', auth, upload.single('file'), imageController.uploadImage);
router.get('/', imageController.getAllImages);
router.put('/:id/category', auth, imageController.updateCategory);
router.post('/:id/favorite', auth, imageController.favoriteImage);
router.delete('/:id/favorite', auth, imageController.unfavoriteImage);
// 新增：删除图片（需登录）
router.delete('/:id', auth, imageController.deleteImage);

// 新增：设置/取消推荐（需登录）
router.put('/:id/recommend', auth, imageController.toggleRecommend);

module.exports = router;