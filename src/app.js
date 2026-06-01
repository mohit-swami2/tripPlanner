const {
  registerPlugins,
  logConnectionState,
  registerAdminFindOneLogging,
  printStartupDiagnostics,
  getDbDiagnostics,
} = require('./shared/db/database');
const { startup } = require('./shared/utils/debugLogger');

registerPlugins();
printStartupDiagnostics();

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const corsMiddleware = require('./shared/middleware/cors');
const logger = require('./shared/middleware/logger');
const apiRequestLogger = require('./shared/middleware/apiRequestLogger');
const ensureDbConnection = require('./shared/middleware/ensureDbConnection');
const errorHandler = require('./shared/middleware/errorHandler');
const { sendSuccess } = require('./shared/utils/response');
const adminRoutes = require('./routes/admin');
const websiteRoutes = require('./routes/website');

startup('Express app — building');
logConnectionState('app-init');

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(logger);
app.use(apiRequestLogger);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(process.cwd(), 'public')));

/** No DB required — reports process health only. */
app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  sendSuccess(res, 200, 'Server is running OK', [
    {
      status: 'healthy',
      db: {
        readyState: dbState,
        connected: dbState === 1,
        name: mongoose.connection.name || null,
      },
    },
  ]);
});

/** Diagnostics — runs through ensureDbConnection on /api/debug/db mount below. */
const debugDbHandler = (_req, res) => {
  sendSuccess(res, 200, 'Database diagnostics', [getDbDiagnostics()]);
};
app.get('/api/debug/db', ensureDbConnection, debugDbHandler);
app.get('/debug/db', ensureDbConnection, debugDbHandler);

/**
 * All API routes: wait for MongoDB before handlers (Vercel + local).
 */
app.use(ensureDbConnection);

const mountAdmin = (base) => app.use(base, adminRoutes);
const mountWebsite = (base) => app.use(base, websiteRoutes);

mountAdmin('/api/admin');
mountAdmin('/admin');
mountAdmin('/api/v1/admin');

mountWebsite('/api/website');
mountWebsite('/api/v1/website');

app.use((req, _res, next) => {
  next({ status: 404, message: `Can't find ${req.originalUrl} on this server` });
});

app.use(errorHandler);

registerAdminFindOneLogging();

startup('Express app — ready', {
  routeMounts: ['/api/admin', '/api/v1/website', '/health'],
  dbStrategy: 'ensureDbConnection middleware (serverless-safe)',
});

module.exports = app;
