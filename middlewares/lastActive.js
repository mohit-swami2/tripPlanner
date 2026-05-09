const User = require('../models/User');

const updateLastActive = async (req, res, next) => {
  if (req.user && req.user.id) {
    try {
      await User.findByIdAndUpdate(req.user.id, { lastActive: new Date() });
    } catch (err) {
      console.error('Error updating lastActive:', err);
    }
  }
  next();
};

module.exports = updateLastActive;
