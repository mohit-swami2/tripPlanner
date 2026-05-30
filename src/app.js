const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const corsMiddleware = require('./shared/middleware/cors');
const logger = require('./shared/middleware/logger');
const errorHandler = require('./shared/middleware/errorHandler');
const { sendSuccess } = require('./shared/utils/response');
const adminRoutes = require('./routes/admin');
const websiteRoutes = require('./routes/website');

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(logger);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.get('/health', (_req, res) => {
  sendSuccess(res, 200, 'Server is running OK', [{ status: 'healthy' }]);
});

const mountAdmin = (base) => app.use(base, adminRoutes);
const mountWebsite = (base) => app.use(base, websiteRoutes);

// Admin (new + legacy paths for old clients / Postman)
mountAdmin('/api/admin');
mountAdmin('/admin');
mountAdmin('/api/v1/admin');

// Website (new + legacy)
mountWebsite('/api/website');
mountWebsite('/api/v1/website');

app.use((req, _res, next) => {
  next({ status: 404, message: `Can't find ${req.originalUrl} on this server` });
});

app.use(errorHandler);

module.exports = app;
