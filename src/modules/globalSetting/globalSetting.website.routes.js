const { Router } = require('express');
const controller = require('./globalSetting.controller');

const router = Router();

router.get('/', controller.getSettings);

module.exports = router;
