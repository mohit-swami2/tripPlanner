const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const { persistUpload, resolveFileUrlsDeep } = require('../../shared/utils/fileUrl');
const adminService = require('./admin.service');

const login = catchAsync(async (req, res, next) => {
  try {
    const { admin, token } = await adminService.login(req.body.email, req.body.password);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    sendSuccess(res, 200, 'Login successful', [
      { token, admin: { id: admin._id, name: admin.name, email: admin.email } },
    ]);
  } catch (e) {
    next(e);
  }
});

const forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const base = `${req.protocol}://${req.get('host')}/api/admin/auth/resetPassword`;
    await adminService.forgotPassword(req.body.email, base);
    sendSuccess(res, 200, 'Reset link sent to email', []);
  } catch (e) {
    next(e);
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  try {
    const { admin, token } = await adminService.resetPassword(req.params.token, req.body.password);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    sendSuccess(res, 200, 'Password updated successfully', [
      { token, admin: { id: admin._id, name: admin.name, email: admin.email } },
    ]);
  } catch (e) {
    next(e);
  }
});

const getProfile = catchAsync(async (req, res, next) => {
  const admin = await adminService.getProfile(req.admin._id);
  if (!admin) return next({ status: 404, message: 'Profile not found' });
  const data = await resolveFileUrlsDeep(req, admin);
  sendSuccess(res, 200, 'Profile fetched', [data]);
});

const updateProfile = catchAsync(async (req, res, next) => {
  const admin = await adminService.updateProfile(req.admin._id, req.body);
  const data = await resolveFileUrlsDeep(req, admin);
  sendSuccess(res, 200, 'Profile updated', [data]);
});

const uploadProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next({ status: 400, message: 'No file uploaded' });

  const profileImage = await persistUpload(req.file);
  const admin = await adminService.updateProfile(req.admin._id, { profileImage });
  const data = await resolveFileUrlsDeep(req, admin);
  sendSuccess(res, 200, 'Profile image uploaded', [data]);
});

const changePassword = catchAsync(async (req, res, next) => {
  try {
    await adminService.changePassword(req.admin._id, req.body.currentPassword, req.body.newPassword);
    sendSuccess(res, 200, 'Password changed successfully', []);
  } catch (e) {
    next(e);
  }
});

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
};
