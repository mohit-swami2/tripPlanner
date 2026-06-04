const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const { persistUpload, getFileUrl } = require('../../shared/utils/fileUrl');

const uploadFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next({ status: 400, message: 'No file uploaded' });

  const key = await persistUpload(req.file);
  const url = await getFileUrl(req, key);

  sendSuccess(res, 201, 'File uploaded', [{ key, url }]);
});

module.exports = { uploadFile };
