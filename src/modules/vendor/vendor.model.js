const mongoose = require('mongoose');
const { VENDOR_TYPE, CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const vendorSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: VENDOR_TYPE, required: true },
    pricing: { type: Number, default: 0 },
    contactInfo: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

vendorSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Vendor'), CODE_PREFIX.VENDOR);
});

module.exports = mongoose.model('Vendor', vendorSchema);
