const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    hashedPassword: { type: String, required: true, select: false },
    profileImage: String,
    lastActive: { type: Date, default: Date.now },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'users' }
);

adminSchema.pre('save', async function () {
  if (!this.isModified('hashedPassword')) return;
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, 12);
});

adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.hashedPassword);
};

module.exports = mongoose.model('Admin', adminSchema);
