const { Router } = require('express');
const inquiryController = require('../../controllers/website/inquiry.controller');
const { validate } = require('../../middlewares/validate');
const { createInquirySchema } = require('../../validations/inquiry.schema');

const router = Router();

router.post('/', validate(createInquirySchema), inquiryController.createInquiry);

module.exports = router;
