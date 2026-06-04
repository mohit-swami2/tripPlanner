const mongoose = require('mongoose');
const { PACKAGE_STATUS, CODE_PREFIX } = require('../../shared/utils/constants');
const { generateCode } = require('../../shared/utils/codeGenerator');

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activity: { type: String, required: true },
    location: String,
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    summary: String,
    description: String,
    highlights: { type: [String], default: [] },
    groupSize: String,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    included: { type: [String], default: [] },
    images: { type: [String], default: [] },
    itinerary: { type: [itineraryDaySchema], default: [] },
    status: { type: String, enum: PACKAGE_STATUS, default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.pre('validate', async function () {
  if (!this.code) this.code = await generateCode(mongoose.model('Package'), CODE_PREFIX.PACKAGE);
});

module.exports = mongoose.model('Package', packageSchema);
