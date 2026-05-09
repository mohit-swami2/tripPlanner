const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  image: { type: String }, // Optional image
  isEnabled: { type: Boolean, default: false }, // Toggle for Admin
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
