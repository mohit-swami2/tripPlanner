const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const controller = require('./testimonial.controller');
const schemas = require('./testimonial.schemas');

const router = Router();
router.get('/', validate(schemas.listTestimonialSchema), controller.list);
router.patch('/:id', validate(schemas.updateTestimonialSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
