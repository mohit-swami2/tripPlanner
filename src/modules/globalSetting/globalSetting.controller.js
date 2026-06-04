const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const { getFileUrl, isStoredObjectKey } = require('../../shared/utils/fileUrl');
const { S3_IMAGE_FIELDS } = require('./globalSetting.constants');
const service = require('./globalSetting.service');

/** Presign S3 keys only for logo/favicon — leave text/URLs untouched. */
const enrichS3ImagesForRead = async (req, settings) => {
  const out = { ...settings };
  await Promise.all(
    S3_IMAGE_FIELDS.map(async (field) => {
      const value = out[field];
      if (typeof value === 'string' && value && isStoredObjectKey(value)) {
        out[field] = await getFileUrl(req, value);
      }
    })
  );
  return out;
};

const getSettings = catchAsync(async (req, res) => {
  const settings = await service.getSettings();
  const data = await enrichS3ImagesForRead(req, settings);
  sendSuccess(res, 200, 'Global settings fetched', [data]);
});

const saveSettings = catchAsync(async (req, res) => {
  const settings = await service.saveSettings(req.body);
  sendSuccess(res, 200, 'Global settings saved', [settings]);
});

module.exports = { getSettings, saveSettings };
