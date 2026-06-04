const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const { upload } = require('../../../shared/middleware/upload');
const controller = require('./masterBanner.controller');
const schemas = require('./masterBanner.schemas');

const router = Router();

router.get('/', validate(schemas.listBannerSchema), controller.list);
router.post('/', upload.single('file'), validate(schemas.saveBannerSchema), controller.save);
router.patch('/sequence', validate(schemas.reorderBannersSchema), controller.reorder);
router.patch('/:id/status', validate(schemas.statusBannerSchema), controller.setStatus);
router.patch('/:id', upload.single('file'), validate(schemas.updateBannerSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
