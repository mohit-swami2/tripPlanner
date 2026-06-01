const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const {
  connectDatabase,
  logStartupEnvironment,
  logConnectionState,
  registerPlugins,
  printStartupDiagnostics,
} = require('./src/shared/db/database');
const { startup, error: logError } = require('./src/shared/utils/debugLogger');

registerPlugins();
printStartupDiagnostics();
logStartupEnvironment();

const app = require('./src/app');

const start = async () => {
  startup('server initialization — start', { timestamp: new Date().toISOString() });

  if (!process.env.MONGO_URI) {
    const err = new Error('MONGO_URI is not set in .env');
    logError('server initialization failed', err, {
      errorMessage: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    throw err;
  }
  if (!process.env.JWT_SECRET) {
    const err = new Error('JWT_SECRET is not set in .env');
    logError('server initialization failed', err, {
      errorMessage: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    throw err;
  }

  if (process.env.NODE_ENV !== 'test') {
    try {
      await connectDatabase();
      startup('database connection phase — completed');
    } catch (err) {
      logError('database connection phase — failed', err, {
        errorMessage: err.message,
        errorName: err.name,
        stack: err.stack,
      });
      throw err;
    }
  }

  logConnectionState('before-http-listen');

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    startup('HTTP server listening', { port });
  });
};

if (require.main === module) {
  start().catch((err) => {
    logError('fatal startup error', err, {
      errorMessage: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    process.exit(1);
  });
} else {
  startup('server.js loaded as module (Vercel/serverless import)', {
    vercel: process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV,
    mongoUriExists: Boolean(process.env.MONGO_URI),
    note: 'If connectDatabase() is not awaited before requests, queries buffer and timeout after 10000ms — check GET /api/debug/db',
  });
}

module.exports = app;
