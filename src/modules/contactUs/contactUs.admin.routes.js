const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./contactUs.controller');
const schemas = require('./contactUs.schemas');

const router = Router();
router.get('/', validate(schemas.listContactSchema), controller.list);
router.delete('/:id', controller.remove);

module.exports = router;
