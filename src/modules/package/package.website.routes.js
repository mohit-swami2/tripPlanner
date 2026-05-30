const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./package.controller');
const schemas = require('./package.schemas');

const router = Router();
router.use((req, _res, next) => {
  req.publicPackages = true;
  next();
});
router.get('/', validate(schemas.listPackageSchema), controller.list);
router.get('/:id', validate(schemas.updatePackageSchema.pick({ params: true })), controller.getOne);

module.exports = router;
