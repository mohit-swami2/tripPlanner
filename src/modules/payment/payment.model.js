const mongoose = require('mongoose');
const { PAYMENT_TYPE, CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const paymentSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: PAYMENT_TYPE, required: true },
    notes: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

paymentSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Payment'), CODE_PREFIX.PAYMENT);
});

module.exports = mongoose.model('Payment', paymentSchema);
