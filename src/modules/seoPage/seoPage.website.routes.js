const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./seoPage.controller');
const schemas = require('./seoPage.schemas');

const router = Router();

router.use((req, _res, next) => {
  req.publicSeoPages = true;
  next();
});

router.get('/', validate(schemas.listSeoPageSchema), controller.list);
router.get('/:category/:slug', validate(schemas.seoPageSlugParamSchema), controller.getBySlug);

module.exports = router;
