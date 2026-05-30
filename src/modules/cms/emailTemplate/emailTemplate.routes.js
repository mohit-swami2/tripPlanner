const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const controller = require('./emailTemplate.controller');
const schemas = require('./emailTemplate.schemas');

const router = Router();
router.get('/', validate(schemas.listTemplateSchema), controller.list);
router.post('/', validate(schemas.createTemplateSchema), controller.create);
router.patch('/:id', validate(schemas.updateTemplateSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
