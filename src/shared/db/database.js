const mongoose = require('mongoose');
const {
  startup,
  db,
  auth,
  error,
  getMongooseStateLabel,
  logMongoUriDiagnostics,
} = require('../utils/debugLogger');

let connectionEventsRegistered = false;
let queryDebugEnabled = false;
let pluginsRegistered = false;

const logConnectionState = (label) => {
  db(`connection state (${label})`, {
    readyState: mongoose.connection.readyState,
    state: getMongooseStateLabel(mongoose.connection.readyState),
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  });
};

const registerConnectionEvents = () => {
  if (connectionEventsRegistered) return;
  connectionEventsRegistered = true;

  mongoose.connection.on('connected', () => {
    db('mongoose event: connected');
    logConnectionState('connected-event');
  });

  mongoose.connection.on('open', () => {
    db('mongoose event: open');
  });

  mongoose.connection.on('disconnected', () => {
    db('mongoose event: disconnected');
    logConnectionState('disconnected-event');
  });

  mongoose.connection.on('reconnected', () => {
    db('mongoose event: reconnected');
    logConnectionState('reconnected-event');
  });

  mongoose.connection.on('error', (err) => {
    error('mongoose connection error event', err, {
      readyState: mongoose.connection.readyState,
    });
  });

  mongoose.connection.on('close', () => {
    db('mongoose event: close');
  });
};

const enableQueryDebug = () => {
  if (queryDebugEnabled || process.env.NODE_ENV === 'test') return;
  queryDebugEnabled = true;

  mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
    db('query', {
      collection: collectionName,
      method: methodName,
      argSummary:
        methodArgs.length > 0
          ? typeof methodArgs[0] === 'object'
            ? Object.keys(methodArgs[0] || {}).slice(0, 8)
            : String(methodArgs[0]).slice(0, 80)
          : null,
    });
  });
};

/**
 * Admin model maps to `users` collection — logs match User.findOne() debugging needs.
 */
const registerAdminFindOneLogging = () => {
  try {
    const Admin = require('../../modules/admin/admin.model');
    const schema = Admin.schema;

    if (schema.__findOneLoggingRegistered) return;
    schema.__findOneLoggingRegistered = true;

    schema.pre(/^findOne/, function preFindOne() {
      this._authFindOneStart = Date.now();
      auth('Admin.findOne (users collection) — query start', {
        filterKeys: this.getFilter ? Object.keys(this.getFilter() || {}) : [],
        hasSelect: Boolean(this._fields),
      });
    });

    schema.post(/^findOne/, function postFindOne(doc) {
      const durationMs = Date.now() - (this._authFindOneStart || Date.now());
      auth('Admin.findOne (users collection) — query complete', {
        found: Boolean(doc),
        durationMs,
        userId: doc?._id?.toString?.() ?? null,
        email: doc?.email ?? null,
      });
    });

  } catch (e) {
    db('could not register Admin findOne logging (model not loaded yet)', {
      message: e.message,
    });
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
        this._dbOpStart = Date.now();
        this._dbOpName = op;
        db('before database operation', {
          model: this.model?.modelName || schema.options?.collection || 'unknown',
          operation: op,
        });
      });

      schema.post(op, function postQuerySuccess(result) {
        db('after database operation — success', {
          model: this.model?.modelName || 'unknown',
          operation: this._dbOpName || op,
          durationMs: Date.now() - (this._dbOpStart || Date.now()),
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

let connectPromise = null;

const connectDatabase = async () => {
  registerPlugins();

  if (mongoose.connection.readyState === 1) {
    db('connectDatabase skipped — already connected');
    return mongoose.connection;
  }

  if (connectPromise) {
    db('connectDatabase — awaiting in-flight connection');
    return connectPromise;
  }

  logMongoUriDiagnostics();
  logConnectionState('before-connect');

  if (!process.env.MONGO_URI) {
    const err = new Error('MONGO_URI is not set');
    error('connectDatabase failed — missing MONGO_URI', err);
    throw err;
  }

  db('mongoose.connect — starting', {
    readyStateBefore: mongoose.connection.readyState,
  });

  connectPromise = mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      db('mongoose.connect — success', {
        readyState: mongoose.connection.readyState,
        state: getMongooseStateLabel(mongoose.connection.readyState),
        host: mongoose.connection.host,
        database: mongoose.connection.name,
      });
      logConnectionState('after-connect-success');
      registerAdminFindOneLogging();
      return conn;
    })
    .catch((err) => {
      error('mongoose.connect — failure', err, {
        readyState: mongoose.connection.readyState,
        state: getMongooseStateLabel(mongoose.connection.readyState),
      });
      logConnectionState('after-connect-failure');
      connectPromise = null;
      throw err;
    });

  return connectPromise;
};

const logStartupEnvironment = () => {
  startup('application bootstrap', {
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV || '(not set)',
    vercel: process.env.VERCEL || '0',
    vercelEnv: process.env.VERCEL_ENV || '(not set)',
    vercelRegion: process.env.VERCEL_REGION || '(not set)',
    isMainModule: require.main === module,
  });
};

module.exports = {
  connectDatabase,
  registerPlugins,
  registerAdminFindOneLogging,
  logConnectionState,
  logStartupEnvironment,
};
