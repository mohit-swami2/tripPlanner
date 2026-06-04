const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const controller = require('./masterBanner.controller');
const schemas = require('./masterBanner.schemas');

const router = Router();

router.use((req, _res, next) => {
  req.publicCms = true;
  next();
});

router.get('/', validate(schemas.listBannerSchema), controller.list);

module.exports = router;
