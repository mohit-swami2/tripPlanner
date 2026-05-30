const Admin = require('../../modules/admin/admin.model');

const updateLastActive = async (req, _res, next) => {
  if (req.admin?._id) {
    Admin.findByIdAndUpdate(req.admin._id, { lastActive: Date.now() }).exec();
  }
  next();
};

module.exports = updateLastActive;
