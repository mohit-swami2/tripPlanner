const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Fixed after creation, e.g., 'forgot-password'
  subject: { type: String, required: true },
  description: { type: String, required: true }, // HTML string
  isEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
