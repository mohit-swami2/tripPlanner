const { Router } = require('express');
const { protect } = require('../../shared/middleware/auth');
const updateLastActive = require('../../shared/middleware/lastActive');

const adminAuthRoutes = require('../../modules/admin/admin.routes');
const dashboardRoutes = require('../../modules/dashboard/dashboard.routes');
const inquiryRoutes = require('../../modules/inquiry/inquiry.admin.routes');
const vendorRoutes = require('../../modules/vendor/vendor.routes');
const tripRoutes = require('../../modules/trip/trip.routes');
const itineraryRoutes = require('../../modules/itinerary/itinerary.routes');
const paymentRoutes = require('../../modules/payment/payment.routes');
const invoiceRoutes = require('../../modules/invoice/invoice.routes');
const packageRoutes = require('../../modules/package/package.admin.routes');
const cmsRoutes = require('../../modules/cms/cms.admin.routes');
const contactRoutes = require('../../modules/contactUs/contactUs.admin.routes');
const uploadRoutes = require('../../modules/upload/upload.routes');

const router = Router();

router.use('/auth', adminAuthRoutes);

router.use(protect);
router.use(updateLastActive);

router.use('/dashboard', dashboardRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/vendors', vendorRoutes);
router.use('/trips', tripRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/payments', paymentRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/packages', packageRoutes);
router.use('/cms', cmsRoutes);
router.use('/contacts', contactRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
