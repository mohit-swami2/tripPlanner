const { Router } = require('express');
const controller = require('./content.controller');

const router = Router();
router.use((req, _res, next) => {
  req.publicCms = true;
  next();
});
router.get('/:section', controller.getBySection);

module.exports = router;
