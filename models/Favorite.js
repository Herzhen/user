const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 同一用户对同一图片只能收藏一次
favoriteSchema.index({ user: 1, image: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);