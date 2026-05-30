const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./package.controller');
const schemas = require('./package.schemas');

const router = Router();
router.get('/', validate(schemas.listPackageSchema), controller.list);
router.get('/:id', validate(schemas.updatePackageSchema.pick({ params: true })), controller.getOne);
router.post('/', validate(schemas.createPackageSchema), controller.create);
router.patch('/:id', validate(schemas.updatePackageSchema), controller.update);
router.delete('/:id', validate(schemas.updatePackageSchema.pick({ params: true })), controller.remove);

module.exports = router;
