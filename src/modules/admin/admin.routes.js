const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const { protect } = require('../../shared/middleware/auth');
const controller = require('./admin.controller');
const schemas = require('./admin.schemas');

const router = Router();

router.post('/login', validate(schemas.loginSchema), controller.login);
router.post('/forgotPassword', validate(schemas.forgotPasswordSchema), controller.forgotPassword);
router.post('/resetPassword/:token', validate(schemas.resetPasswordSchema), controller.resetPassword);

router.use(protect);
router.get('/profile', controller.getProfile);
router.patch('/profile', validate(schemas.updateProfileSchema), controller.updateProfile);
router.patch('/change-password', validate(schemas.changePasswordSchema), controller.changePassword);

module.exports = router;
