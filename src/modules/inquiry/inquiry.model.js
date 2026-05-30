const mongoose = require('mongoose');
const { INQUIRY_STATUS, CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const inquirySchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    customerName: { type: String, required: true },
    contact: { type: String, required: true },
    destinationInterest: { type: String, required: true },
    travelDates: { type: Date, required: true },
    status: { type: String, enum: INQUIRY_STATUS, default: 'PENDING' },
    notes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

inquirySchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Inquiry'), CODE_PREFIX.INQUIRY);
});

module.exports = mongoose.model('Inquiry', inquirySchema);
