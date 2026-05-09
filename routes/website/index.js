const { Router } = require('express');
const inquiryRoutes = require('./inquiry.routes');

const router = Router();

router.use('/inquiries', inquiryRoutes);
// add other website routes here...

module.exports = router;
