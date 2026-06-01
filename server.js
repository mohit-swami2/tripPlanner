/**
 * Application entrypoint — works locally and on Vercel serverless.
 *
 * Database connection is NOT tied to require.main or listen().
 * All routes use ensureDbConnection middleware in src/app.js.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const {
  connectDatabase,
  logStartupEnvironment,
  registerPlugins,
  printStartupDiagnostics,
} = require('./src/shared/db/database');
const { startup, error: logError } = require('./src/shared/utils/debugLogger');

registerPlugins();
printStartupDiagnostics();
logStartupEnvironment();

const app = require('./src/app');

/**
 * Local development: start HTTP server.
 * Optional eager connect reduces latency on first request.
 */
const startLocalServer = async () => {
  startup('local HTTP server — starting');

  if (!process.env.MONGO_URI) {
    const err = new Error('MONGO_URI is not set in .env');
    logError('local server startup failed', err, {
      errorMessage: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    throw err;
  }

  if (process.env.NODE_ENV !== 'test') {
    try {
      await connectDatabase();
      startup('local server — eager database connect completed');
    } catch (err) {
      logError('local server — eager database connect failed', err, {
        errorMessage: err.message,
        errorName: err.name,
        stack: err.stack,
      });
      throw err;
    }
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    startup('HTTP server listening', { port, mode: 'local' });
  });
};

if (require.main === module) {
  startLocalServer().catch((err) => {
    logError('fatal local startup error', err, {
      errorMessage: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    process.exit(1);
  });
} else {
  startup('app exported for serverless (Vercel)', {
    vercel: process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV,
    mongoUriExists: Boolean(process.env.MONGO_URI),
    note: 'DB connects via ensureDbConnection middleware on each request that needs it',
  });
}

module.exports = app;
