const mongoose = require('mongoose');

const masterBannerSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    image: { type: String, required: true },
    linkUrl: { type: String, trim: true },
    sequence: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

masterBannerSchema.index({ sequence: 1, createdAt: -1 });

module.exports = mongoose.model('MasterBanner', masterBannerSchema);
