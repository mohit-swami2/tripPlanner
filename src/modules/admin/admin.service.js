const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Admin = require('./admin.model');
const EmailTemplate = require('../cms/emailTemplate/emailTemplate.model');
const { sendMail } = require('../../shared/utils/mailer');
const { replacePlaceholders } = require('../../shared/utils/emailTemplate');
const { notDeleted } = require('../../shared/utils/notDeleted');

const signToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw { status: 500, message: 'JWT_SECRET is not configured' };
  }
  return jwt.sign({ adminId: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '10d',
  });
};

const login = async (email, password) => {
  const admin = await Admin.findOne({ email, ...notDeleted }).select('+hashedPassword');
  if (!admin || !(await admin.comparePassword(password))) {
    throw { status: 401, message: 'Incorrect email or password' };
  }
  return { admin, token: signToken(admin) };
};

const forgotPassword = async (email, resetBaseUrl) => {
  const admin = await Admin.findOne({ email, ...notDeleted });
  if (!admin) throw { status: 404, message: 'No admin found with that email' };

  const resetToken = crypto.randomBytes(32).toString('hex');
  admin.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  admin.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await admin.save({ validateBeforeSave: false });

  const template = await EmailTemplate.findOne({ slug: 'forgot-password', ...notDeleted });
  if (!template?.isEnabled) throw { status: 500, message: 'Password reset email unavailable' };

  const resetURL = `${resetBaseUrl}/${resetToken}`;
  const html = replacePlaceholders(template.description, { name: admin.name, resetURL });

  await sendMail({ to: admin.email, subject: template.subject, html });
  return true;
};

const resetPassword = async (token, password) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const admin = await Admin.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
    ...notDeleted,
  }).select('+hashedPassword');

  if (!admin) throw { status: 400, message: 'Token is invalid or has expired' };

  admin.hashedPassword = password;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();
  return { admin, token: signToken(admin) };
};

const getProfile = (adminId) => Admin.findOne({ _id: adminId, ...notDeleted }).select('-hashedPassword');

const updateProfile = (adminId, data) =>
  Admin.findOneAndUpdate({ _id: adminId, ...notDeleted }, data, { new: true, runValidators: true }).select(
    '-hashedPassword'
  );

const changePassword = async (adminId, currentPassword, newPassword) => {
  const admin = await Admin.findOne({ _id: adminId, ...notDeleted }).select('+hashedPassword');
  if (!admin || !(await admin.comparePassword(currentPassword))) {
    throw { status: 401, message: 'Current password is incorrect' };
  }
  admin.hashedPassword = newPassword;
  await admin.save();
  return admin;
};

const register = async (data) => {
  const exists = await Admin.findOne({ email: data.email });
  if (exists) throw { status: 400, message: 'Email already registered' };
  const admin = await Admin.create(data);
  return { admin, token: signToken(admin) };
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  register,
  signToken,
};
