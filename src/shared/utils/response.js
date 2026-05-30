const sendSuccess = (res, statusCode, message, data = [], extras = {}) => {
  const payload = {
    success: true,
    message,
    data: Array.isArray(data) ? data : data ? [data] : [],
    ...extras,
  };
  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode, message, details = null) => {
  const payload = { success: false, message, data: [] };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
