const jwt = require('jsonwebtoken');
const Admin = require('../../modules/admin/admin.model');
const { notDeleted } = require('../utils/notDeleted');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next({ status: 401, message: 'You are not logged in. Please log in to get access.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId || decoded.id;
    const admin = await Admin.findOne({ _id: adminId, ...notDeleted }).select('-hashedPassword');
    if (!admin) {
      return next({ status: 401, message: 'Admin no longer exists.' });
    }
    req.admin = admin;
    req.user = { id: admin._id, adminId: admin._id, email: admin.email, role: 'admin' };
    next();
  } catch (_) {
    return next({ status: 401, message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
