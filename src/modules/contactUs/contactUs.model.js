const mongoose = require('mongoose');
const { CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const contactSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('ContactUs'), CODE_PREFIX.CONTACT);
});

module.exports = mongoose.model('ContactUs', contactSchema);
