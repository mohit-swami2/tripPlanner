const { Router } = require('express');
const inquiryController = require('../../../controllers/admin/inquiry.controller');

const router = Router();

router.get('/', inquiryController.getInquiries);
router.patch('/:id/status', inquiryController.updateInquiryStatus);

module.exports = router;
