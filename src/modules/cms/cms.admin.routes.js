const { Router } = require('express');
const emailTemplateRoutes = require('./emailTemplate/emailTemplate.routes');
const testimonialRoutes = require('./testimonial/testimonial.admin.routes');
const faqRoutes = require('./faq/faq.admin.routes');
const contentRoutes = require('./content/content.admin.routes');
const masterBannerRoutes = require('./masterBanner/masterBanner.admin.routes');

const router = Router();

router.use('/email-templates', emailTemplateRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/faqs', faqRoutes);
router.use('/master-banners', masterBannerRoutes);
router.use('/', contentRoutes);

module.exports = router;
