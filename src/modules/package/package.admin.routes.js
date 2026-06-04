const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./package.controller');
const schemas = require('./package.schemas');

const router = Router();
router.get('/', validate(schemas.listPackageSchema), controller.list);
router.get('/:id', validate(schemas.packageIdParamSchema), controller.getOne);
router.post('/', validate(schemas.createPackageSchema), controller.create);
router.patch('/:id', validate(schemas.updatePackageSchema), controller.update);
router.delete('/:id', validate(schemas.packageIdParamSchema), controller.remove);

module.exports = router;
