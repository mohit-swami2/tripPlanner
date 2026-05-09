const sendResponse = (res, statusCode, message, data = null) => {
  const success = statusCode >= 200 && statusCode < 300;
  
  // Enforce array or object based on data type. 
  // If no data, default to empty object. If data is array, keep as array.
  const formattedData = Array.isArray(data) ? data : (data || {});

  return res.status(statusCode).json({
    success,
    message,
    data: formattedData,
    timestamp: new Date().toISOString()
  });
};

module.exports = sendResponse;
