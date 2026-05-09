const { Router } = require('express');
const { protect, restrictTo } = require('../../middlewares/auth');
const updateLastActive = require('../../middlewares/lastActive');

// Route modules
const authRoutes = require('./auth/auth.routes');
const inquiryRoutes = require('./inquiries/inquiry.routes');

const router = Router();

// Public Admin Routes (Login, Forgot Password)
router.use('/auth', authRoutes);

// Protected Admin Routes Setup
router.use(protect);
router.use(restrictTo('admin'));
router.use(updateLastActive); // Tracks last active timestamp for authenticated admins

// Mount Protected Sub-routers
const cmsRoutes = require('./cms');
router.use('/cms', cmsRoutes);
router.use('/inquiries', inquiryRoutes);

module.exports = router;
