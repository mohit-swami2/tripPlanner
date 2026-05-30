const mongoose = require('mongoose');
const { TRIP_STATUS, CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const tripSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },
    customerName: { type: String, required: true },
    customerContact: String,
    totalCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingDues: { type: Number, default: 0 },
    status: { type: String, enum: TRIP_STATUS, default: 'Draft' },
    isEnabled: { type: Boolean, default: false },
    title: String,
    description: String,
    images: [String],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

tripSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Trip'), CODE_PREFIX.TRIP);
});

tripSchema.pre('save', function () {
  this.pendingDues = Math.max(0, (this.totalCost || 0) - (this.paidAmount || 0));
});

module.exports = mongoose.model('Trip', tripSchema);
