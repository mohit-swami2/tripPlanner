const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const { upload } = require('../../shared/middleware/upload');
const { parsePackageBody } = require('./package.middleware');
const controller = require('./package.controller');
const schemas = require('./package.schemas');

const multipart = upload.fields([
  { name: 'file', maxCount: 10 },
  { name: 'files', maxCount: 10 },
]);

const router = Router();
router.get('/', validate(schemas.listPackageSchema), controller.list);
router.get('/:id', validate(schemas.packageIdParamSchema), controller.getOne);
router.post('/', multipart, parsePackageBody, validate(schemas.createPackageSchema), controller.create);
router.patch(
  '/:id',
  multipart,
  parsePackageBody,
  validate(schemas.updatePackageSchema),
  controller.update
);
router.delete('/:id', validate(schemas.packageIdParamSchema), controller.remove);

module.exports = router;
