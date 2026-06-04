const { Router } = require('express');
const { validate } = require('../../shared/middleware/validate');
const controller = require('./globalSetting.controller');
const schemas = require('./globalSetting.schemas');

const router = Router();

router.get('/', controller.getSettings);
router.put('/', validate(schemas.saveSettingsSchema), controller.saveSettings);

module.exports = router;
