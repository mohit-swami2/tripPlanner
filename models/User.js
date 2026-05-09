const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  hashedPassword: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String },
  lastActive: { type: Date, default: Date.now },
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('hashedPassword')) return;
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.hashedPassword);
};

module.exports = mongoose.model('User', UserSchema);
