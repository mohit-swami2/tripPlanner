const { Router } = require('express');
const inquiryRoutes = require('../../modules/inquiry/inquiry.website.routes');
const tripRoutes = require('../../modules/trip/trip.website.routes');
const packageRoutes = require('../../modules/package/package.website.routes');
const contactRoutes = require('../../modules/contactUs/contactUs.website.routes');
const testimonialRoutes = require('../../modules/cms/testimonial/testimonial.website.routes');
const faqRoutes = require('../../modules/cms/faq/faq.website.routes');
const cmsRoutes = require('../../modules/cms/content/content.website.routes');
const masterBannerRoutes = require('../../modules/cms/masterBanner/masterBanner.website.routes');
const globalSettingRoutes = require('../../modules/globalSetting/globalSetting.website.routes');

const router = Router();

router.use('/inquiries', inquiryRoutes);
router.use('/trips', tripRoutes);
router.use('/packages', packageRoutes);
router.use('/contact', contactRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/faqs', faqRoutes);
router.use('/cms', cmsRoutes);
router.use('/master-banners', masterBannerRoutes);
router.use('/settings', globalSettingRoutes);

module.exports = router;
