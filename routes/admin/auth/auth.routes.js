const { Router } = require('express');
const authController = require('../../../controllers/admin/auth.controller');
const { protect, restrictTo } = require('../../../middlewares/auth');

const router = Router();

// Public Routes
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Protected Routes
router.use(protect, restrictTo('admin'));
router.get('/profile', authController.getProfile);
router.patch('/profile', authController.updateProfile);

module.exports = router;
