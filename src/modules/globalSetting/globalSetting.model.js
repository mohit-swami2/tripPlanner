const mongoose = require('mongoose');

const globalSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'app' },
    siteName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    defaultMetaTitle: { type: String, default: '' },
    defaultMetaDescription: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

globalSettingSchema.statics.SETTINGS_KEY = 'app';

module.exports = mongoose.model('GlobalSetting', globalSettingSchema);
