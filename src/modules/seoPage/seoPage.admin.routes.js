const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./seoPage.controller');
const schemas = require('./seoPage.schemas');

const router = Router();

router.get('/', validate(schemas.listSeoPageSchema), controller.list);
router.get('/:id', validate(schemas.seoPageIdParamSchema), controller.getOne);
router.post('/', validate(schemas.createSeoPageSchema), controller.create);
router.patch('/:id', validate(schemas.updateSeoPageSchema), controller.update);
router.delete('/:id', validate(schemas.seoPageIdParamSchema), controller.remove);

module.exports = router;
