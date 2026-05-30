const mongoose = require('mongoose');

const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    activity: { type: String, required: true },
    timing: String,
    location: String,
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    days: [daySchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
