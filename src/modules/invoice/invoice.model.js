const mongoose = require('mongoose');
const { CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const invoiceSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    invoiceNo: { type: String, unique: true },
    pdfUrl: String,
    lineItems: [
      {
        description: String,
        amount: Number,
      },
    ],
    totalAmount: Number,
    paidAmount: Number,
    pendingDues: Number,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

invoiceSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Invoice'), CODE_PREFIX.INVOICE);
  if (!this.invoiceNo) this.invoiceNo = this.code;
});

module.exports = mongoose.model('Invoice', invoiceSchema);
