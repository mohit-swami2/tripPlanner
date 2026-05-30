const { Router } = require('express');
const controller = require('./dashboard.controller');

const router = Router();
router.get('/', controller.overview);

module.exports = router;
