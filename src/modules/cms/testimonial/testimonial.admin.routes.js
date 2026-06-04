const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const { upload } = require('../../../shared/middleware/upload');
const controller = require('./testimonial.controller');
const schemas = require('./testimonial.schemas');

const router = Router();
router.get('/', validate(schemas.listTestimonialSchema), controller.list);
router.post('/', upload.single('file'), validate(schemas.createTestimonialSchema), controller.create);
router.patch('/:id', upload.single('file'), validate(schemas.updateTestimonialSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
