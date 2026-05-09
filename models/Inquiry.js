const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contact: { type: String, required: true },
  destinationInterest: { type: String, required: true },
  travelDates: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'booked', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
