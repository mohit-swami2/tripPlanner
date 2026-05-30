const mongoose = require('mongoose');
const { CMS_SECTIONS } = require('../../../shared/utils/constants');

const contentSchema = new mongoose.Schema(
  {
    section: { type: String, enum: CMS_SECTIONS, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contentSchema.index({ section: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

module.exports = mongoose.model('CmsContent', contentSchema);
