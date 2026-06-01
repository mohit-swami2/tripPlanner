/**
 * Vercel-friendly structured logs (console.log → Function Logs).
 * Prefixes: [STARTUP] [DB] [API] [AUTH] [QUERY] [WARNING] [ERROR]
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'hashedpassword',
  'currentpassword',
  'newpassword',
  'token',
  'jwt',
  'smtp_pass',
  'smtp_user',
  'authorization',
  'cookie',
  'cookies',
]);

const ts = () => new Date().toISOString();

const format = (prefix, message, meta) => {
  const base = `[${prefix}] ${ts()} ${message}`;
  if (meta === undefined) return base;
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return `${base} ${String(meta)}`;
  }
};

const log = (prefix, message, meta) => {
  console.log(format(prefix, message, meta));
};

const logError = (prefix, message, err, meta) => {
  const payload = {
    ...meta,
    errorMessage: err?.message,
    errorName: err?.name,
    errorCode: err?.code,
    stack: err?.stack,
  };
  console.error(format(prefix, message, payload));
};

const startup = (message, meta) => log('STARTUP', message, meta);
const db = (message, meta) => log('DB', message, meta);
const api = (message, meta) => log('API', message, meta);
const auth = (message, meta) => log('AUTH', message, meta);
const query = (message, meta) => log('QUERY', message, meta);
const warning = (message, meta) => log('WARNING', message, meta);
const error = (message, err, meta) => logError('ERROR', message, err, meta);

const sanitizeBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  if (Array.isArray(body)) return body.map(sanitizeBody);
  const out = {};
  for (const [key, value] of Object.entries(body)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      out[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      out[key] = sanitizeBody(value);
    } else {
      out[key] = value;
    }
  }
  return out;
};

const getMongooseStateLabel = (state) => {
  const map = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };
  return map[state] ?? `unknown(${state})`;
};

/** Safe MongoDB URI diagnostics — never logs credentials or full URI. */
const logMongoUriDiagnostics = () => {
  const uri = process.env.MONGO_URI;
  db('MONGO_URI exists', {
    present: Boolean(uri),
    timestamp: ts(),
    nodeEnv: process.env.NODE_ENV || null,
    vercelEnv: process.env.VERCEL_ENV || null,
  });
  if (!uri) return;

  let hostHint = 'unknown';
  if (uri.startsWith('mongodb+srv://')) hostHint = 'mongodb+srv (Atlas)';
  else if (uri.startsWith('mongodb://')) hostHint = 'mongodb (standard)';

  const pathMatch = uri.match(/@[^/]+\/([^?]+)/);
  const dbName = pathMatch?.[1] ?? '(not parsed)';
  const hasDoubleSlash = /\.net\/\//.test(uri) || /localhost:\d+\/\//.test(uri);

  db('MONGO_URI diagnostics', {
    hostHint,
    uriLength: uri.length,
    databaseNameHint: dbName === '' ? '(empty — check for // before db name)' : dbName,
    hasDoubleSlashBeforeDbName: hasDoubleSlash,
    hasRetryWrites: uri.includes('retryWrites'),
  });

  if (hasDoubleSlash) {
    warning('Double slash before database name in MONGO_URI may cause Atlas connection failures');
  }

  if (dbName === '(not parsed)' || dbName === '') {
    warning(
      'MONGO_URI has no database name after host (e.g. ...mongodb.net/mydb) — add /tripPlanner before ?options'
    );
  }

  if (uri.length < 100) {
    warning('MONGO_URI is unusually short — verify username, password, host, and database name in Vercel env');
  }
};

module.exports = {
  startup,
  db,
  api,
  auth,
  query,
  warning,
  error,
  sanitizeBody,
  getMongooseStateLabel,
  logMongoUriDiagnostics,
  ts,
};
