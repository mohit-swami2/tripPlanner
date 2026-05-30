const cors = require('cors');

const whitelist = (process.env.CORS_WHITELIST || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.length === 0 || whitelist.includes(origin) || origin === process.env.WEB_ORIGIN) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
