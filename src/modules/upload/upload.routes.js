const { Router } = require('express');
const { upload } = require('../../shared/middleware/upload');
const controller = require('./upload.controller');

const router = Router();

router.post('/', upload.single('file'), controller.uploadFile);

module.exports = router;
