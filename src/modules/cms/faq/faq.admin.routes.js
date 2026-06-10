const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const controller = require('./faq.controller');
const schemas = require('./faq.schemas');

const router = Router();
router.get('/', validate(schemas.listFaqSchema), controller.list);
router.post('/', validate(schemas.createFaqSchema), controller.create);
router.patch('/:id', validate(schemas.updateFaqSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
