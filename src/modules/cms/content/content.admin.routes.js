const { Router } = require('express');
const { validate } = require('../../../shared/middleware/validate');
const controller = require('./content.controller');
const schemas = require('./content.schemas');

const router = Router();
router.get('/', controller.list);
router.put('/', validate(schemas.saveCmsSchema), controller.save);

module.exports = router;
