const mongoose = require('mongoose');
const { PACKAGE_STATUS, CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const daySchema = new mongoose.Schema(
  { day: Number, title: String, activity: String, location: String },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: String,
    images: [String],
    itinerary: [daySchema],
    status: { type: String, enum: PACKAGE_STATUS, default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Package'), CODE_PREFIX.PACKAGE);
});

module.exports = mongoose.model('Package', packageSchema);
