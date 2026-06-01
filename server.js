const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const {
  connectDatabase,
  logStartupEnvironment,
  logConnectionState,
  registerPlugins,
} = require('./src/shared/db/database');
const { startup, error: logError } = require('./src/shared/utils/debugLogger');

logStartupEnvironment();
registerPlugins();

const app = require('./src/app');

const start = async () => {
  startup('server initialization — start');

  if (!process.env.MONGO_URI) {
    const err = new Error('MONGO_URI is not set in .env');
    logError('server initialization failed', err);
    throw err;
  }
  if (!process.env.JWT_SECRET) {
    const err = new Error('JWT_SECRET is not set in .env');
    logError('server initialization failed', err);
    throw err;
  }

  if (process.env.NODE_ENV !== 'test') {
    try {
      await connectDatabase();
      startup('database connection phase — completed');
    } catch (err) {
      logError('database connection phase — failed', err);
      throw err;
    }
  }

  logConnectionState('before-http-listen');

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    startup('HTTP server listening', { port, mongooseReady: true });
  });
};

if (require.main === module) {
  start().catch((err) => {
    logError('fatal startup error', err);
    process.exit(1);
  });
} else {
  startup('server.js loaded as module (e.g. Vercel import)', {
    note: 'connectDatabase runs only when start() is invoked; check [DB] logs on first request if not connected',
  });
}

module.exports = app;
