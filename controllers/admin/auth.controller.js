const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../models/User');
const EmailTemplate = require('../../models/EmailTemplate');
const { sendEmail } = require('../../services/email.service');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendResponse = require('../../utils/response');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = signToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  sendResponse(res, statusCode, message, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+hashedPassword');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/admin/auth/resetPassword/${resetToken}`;

  const template = await EmailTemplate.findOne({ slug: 'forgot-password' });
  if (!template || !template.isEnabled) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Email service is currently unavailable or template missing.', 500));
  }

  const html = template.description.replace('{{resetURL}}', resetURL).replace('{{name}}', user.name);

  try {
    await sendEmail({
      to: user.email,
      subject: template.subject,
      html
    });

    sendResponse(res, 200, 'Token sent to email!');
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.hashedPassword = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// Profile Management
const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  sendResponse(res, 200, 'Profile fetched successfully', user);
});

const updateProfile = catchAsync(async (req, res, next) => {
  const { name, profileImage } = req.body; // Can be enhanced with file upload handling logic depending on router setup
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    ...(name && { name }),
    ...(profileImage && { profileImage })
  }, { new: true, runValidators: true });

  sendResponse(res, 200, 'Profile updated successfully', updatedUser);
});

module.exports = { login, forgotPassword, resetPassword, getProfile, updateProfile };
