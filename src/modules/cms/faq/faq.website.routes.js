const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const controller = require('./faq.controller');
const schemas = require('./faq.schemas');

const router = Router();
router.use((req, _res, next) => {
  req.publicCms = true;
  next();
});
router.get('/', validate(schemas.listFaqSchema), controller.list);
router.get('/faqs', validate(schemas.listFaqSchema), controller.list);

module.exports = router;
