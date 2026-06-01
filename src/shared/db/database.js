const mongoose = require('mongoose');
const {
  startup,
  db,
  auth,
  query,
  warning,
  error,
  getMongooseStateLabel,
  logMongoUriDiagnostics,
  ts,
} = require('../utils/debugLogger');

let connectionEventsRegistered = false;
let queryDebugEnabled = false;
let pluginsRegistered = false;

/** Shared in-flight connect promise — safe for concurrent serverless invocations. */
let connectPromise = null;

const logConnectionState = (label) => {
  const readyState = mongoose.connection.readyState;
  db(`connection state (${label})`, {
    readyState,
    state: getMongooseStateLabel(readyState),
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    timestamp: ts(),
  });
};

const warnIfNotConnected = (context) => {
  const readyState = mongoose.connection.readyState;
  if (readyState !== 1) {
    warning('Database not connected before query execution', {
      ...context,
      readyState,
      state: getMongooseStateLabel(readyState),
      timestamp: ts(),
      nodeEnv: process.env.NODE_ENV || null,
      vercelEnv: process.env.VERCEL_ENV || null,
    });
  }
};

const registerConnectionEvents = () => {
  if (connectionEventsRegistered) return;
  connectionEventsRegistered = true;

  mongoose.connection.on('connected', () => {
    db('mongoose event: connected', { readyState: mongoose.connection.readyState });
    logConnectionState('connected-event');
  });

  mongoose.connection.on('open', () => {
    db('mongoose event: open');
  });

  mongoose.connection.on('disconnected', () => {
    db('mongoose event: disconnected');
    logConnectionState('disconnected-event');
  });

  mongoose.connection.on('reconnecting', () => {
    db('mongoose event: reconnecting');
    logConnectionState('reconnecting-event');
  });

  mongoose.connection.on('reconnected', () => {
    db('mongoose event: reconnected');
    logConnectionState('reconnected-event');
  });

  mongoose.connection.on('error', (err) => {
    error('mongoose event: error', err, {
      readyState: mongoose.connection.readyState,
      state: getMongooseStateLabel(mongoose.connection.readyState),
    });
  });

  mongoose.connection.on('close', () => {
    db('mongoose event: close');
  });
};

const enableQueryDebug = () => {
  if (queryDebugEnabled || process.env.NODE_ENV === 'test') return;
  queryDebugEnabled = true;

  mongoose.set('debug', (collectionName, methodName) => {
    const readyState = mongoose.connection.readyState;
    query('mongoose debug', {
      collection: collectionName,
      method: methodName,
      readyState,
      state: getMongooseStateLabel(readyState),
    });
    warnIfNotConnected({ queryName: `${collectionName}.${methodName}`, modelName: collectionName });
  });
};

const registerAdminFindOneLogging = () => {
  try {
    const Admin = require('../../modules/admin/admin.model');
    const schema = Admin.schema;

    if (schema.__userFindOneLoggingRegistered) return;
    schema.__userFindOneLoggingRegistered = true;

    schema.pre(/^findOne/, function preUserFindOne() {
      const readyState = mongoose.connection.readyState;
      this._userFindOneStart = Date.now();

      auth('About to execute User.findOne', {
        collection: 'users',
        model: 'Admin',
        readyState,
        state: getMongooseStateLabel(readyState),
        timestamp: ts(),
      });

      warnIfNotConnected({
        queryName: 'User.findOne',
        modelName: 'Admin',
        collection: 'users',
      });
    });

    schema.post(/^findOne/, function postUserFindOne(doc) {
      const durationMs = Date.now() - (this._userFindOneStart || Date.now());
      auth('User.findOne completed', {
        success: true,
        found: Boolean(doc),
        durationMs,
        readyState: mongoose.connection.readyState,
        timestamp: ts(),
      });
    });
  } catch (e) {
    db('User.findOne logging registration deferred', { message: e.message });
  }
};

const registerQueryLifecyclePlugins = () => {
  if (pluginsRegistered) return;
  pluginsRegistered = true;

  mongoose.plugin((schema) => {
    const ops = [
      'find',
      'findOne',
      'findOneAndUpdate',
      'findOneAndDelete',
      'countDocuments',
      'aggregate',
      'updateOne',
      'updateMany',
      'deleteOne',
      'deleteMany',
      'save',
    ];

    ops.forEach((op) => {
      schema.pre(op, function preQuery() {
        const modelName = this.model?.modelName || schema.options?.collection || 'unknown';
        const queryName = `${modelName}.${op}`;
        const readyState = mongoose.connection.readyState;

        this._dbOpStart = Date.now();
        this._dbOpName = op;

        query('before database query', {
          queryName,
          modelName,
          readyState,
          state: getMongooseStateLabel(readyState),
          timestamp: ts(),
        });

        warnIfNotConnected({ queryName, modelName });
      });

      schema.post(op, function postQuerySuccess(result) {
        const modelName = this.model?.modelName || 'unknown';
        const queryName = `${modelName}.${this._dbOpName || op}`;
        const durationMs = Date.now() - (this._dbOpStart || Date.now());

        query('after database query — success', {
          queryName,
          modelName,
          durationMs,
          readyState: mongoose.connection.readyState,
          resultHint: Array.isArray(result)
            ? { type: 'array', length: result.length }
            : result
              ? { type: 'document' }
              : { type: 'empty' },
        });
      });
    });
  });
};

const registerPlugins = () => {
  registerConnectionEvents();
  enableQueryDebug();
  registerQueryLifecyclePlugins();
};

const printStartupDiagnostics = () => {
  const readyState = mongoose.connection.readyState;
  startup('diagnostic block', {
    nodeVersion: process.version,
    mongooseVersion: mongoose.version,
    nodeEnv: process.env.NODE_ENV || '(not set)',
    vercelEnv: process.env.VERCEL_ENV || '(not set)',
    vercel: process.env.VERCEL || '0',
    mongoUriExists: Boolean(process.env.MONGO_URI),
    readyState,
    readyStateLabel: getMongooseStateLabel(readyState),
    timestamp: ts(),
  });
};

const getDbDiagnostics = () => {
  const readyState = mongoose.connection.readyState;
  return {
    readyState: getMongooseStateLabel(readyState),
    readyStateCode: readyState,
    connected: readyState === 1,
    mongooseVersion: mongoose.version,
    nodeVersion: process.version,
    mongoUriExists: Boolean(process.env.MONGO_URI),
    nodeEnv: process.env.NODE_ENV || null,
    vercelEnv: process.env.VERCEL_ENV || null,
    host: mongoose.connection.host || null,
    database: mongoose.connection.name || null,
    timestamp: ts(),
    connectInFlight: Boolean(connectPromise),
  };
};

/**
 * Serverless-safe MongoDB connect:
 * - Reuses open connection (readyState === 1)
 * - Deduplicates concurrent connect attempts via shared promise
 * - Does not disconnect between requests
 */
const connectDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    return mongoose.connection;
  }

  registerPlugins();

  const readyState = mongoose.connection.readyState;

  if (readyState === 1) {
    db('reusing cached MongoDB connection', {
      readyState,
      state: getMongooseStateLabel(readyState),
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      timestamp: ts(),
    });
    return mongoose.connection;
  }

  if (connectPromise) {
    db('connectDatabase — awaiting in-flight connection (concurrent-safe)', {
      readyState,
      state: getMongooseStateLabel(readyState),
      timestamp: ts(),
    });
    return connectPromise;
  }

  db('connection initialization started — creating new connection', {
    timestamp: ts(),
    mongoUriExists: Boolean(process.env.MONGO_URI),
    nodeEnv: process.env.NODE_ENV || null,
    vercelEnv: process.env.VERCEL_ENV || null,
    readyState,
  });

  logMongoUriDiagnostics();
  logConnectionState('before-connect');

  if (!process.env.MONGO_URI) {
    const err = new Error('MONGO_URI is not set');
    error('connectDatabase failed — missing MONGO_URI', err, {
      errorMessage: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    throw err;
  }

  connectPromise = (async () => {
    try {
      db('immediately before mongoose.connect()', {
        readyState: mongoose.connection.readyState,
        timestamp: ts(),
      });

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10,
      });

      db('immediately after successful mongoose.connect() — new connection established', {
        readyState: mongoose.connection.readyState,
        state: getMongooseStateLabel(mongoose.connection.readyState),
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        timestamp: ts(),
      });

      logConnectionState('after-connect-success');
      registerAdminFindOneLogging();
      return mongoose.connection;
    } catch (err) {
      error('mongoose.connect() failed', err, {
        errorMessage: err.message,
        errorName: err.name,
        stack: err.stack,
        readyState: mongoose.connection.readyState,
        state: getMongooseStateLabel(mongoose.connection.readyState),
        atlasReachabilityHint:
          'Check Atlas IP allowlist (0.0.0.0/0 for Vercel) and MONGO_URI in Vercel env vars',
      });
      logConnectionState('after-connect-failure');
      connectPromise = null;
      throw err;
    }
  })();

  return connectPromise;
};

/** Alias used by connection middleware. */
const ensureDatabaseConnection = connectDatabase;

const logStartupEnvironment = () => {
  printStartupDiagnostics();
  startup('application bootstrap', {
    nodeVersion: process.version,
    mongooseVersion: mongoose.version,
    nodeEnv: process.env.NODE_ENV || '(not set)',
    vercel: process.env.VERCEL || '0',
    vercelEnv: process.env.VERCEL_ENV || '(not set)',
    vercelRegion: process.env.VERCEL_REGION || '(not set)',
    mongoUriExists: Boolean(process.env.MONGO_URI),
    deploymentMode: process.env.VERCEL ? 'vercel-serverless' : 'node-process',
  });
};

module.exports = {
  connectDatabase,
  ensureDatabaseConnection,
  registerPlugins,
  registerAdminFindOneLogging,
  logConnectionState,
  logStartupEnvironment,
  printStartupDiagnostics,
  getDbDiagnostics,
  warnIfNotConnected,
};
