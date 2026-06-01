const jwt = require('jsonwebtoken');
const Admin = require('../../modules/admin/admin.model');
const { notDeleted } = require('../utils/notDeleted');
const { auth, error } = require('../utils/debugLogger');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    auth('protect — no token provided', { path: req.originalUrl });
    return next({ status: 401, message: 'You are not logged in. Please log in to get access.' });
  }

  try {
    auth('protect — verifying JWT', { path: req.originalUrl });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId || decoded.id;

    auth('protect — loading admin from users collection', { adminId: String(adminId) });
    const admin = await Admin.findOne({ _id: adminId, ...notDeleted }).select('-hashedPassword');

    if (!admin) {
      auth('protect — admin not found', { adminId: String(adminId) });
      return next({ status: 401, message: 'Admin no longer exists.' });
    }

    auth('protect — success', { adminId: String(admin._id), email: admin.email });
    req.admin = admin;
    req.user = { id: admin._id, adminId: admin._id, email: admin.email, role: 'admin' };
    next();
  } catch (err) {
    error('protect — JWT or admin lookup failed', err, { path: req.originalUrl });
    return next({ status: 401, message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
