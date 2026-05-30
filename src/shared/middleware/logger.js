const morgan = require('morgan');

const format =
  process.env.NODE_ENV === 'production'
    ? ':remote-addr :method :url :status :res[content-length] - :response-time ms'
    : 'dev';

const logger = morgan(format);

module.exports = logger;
