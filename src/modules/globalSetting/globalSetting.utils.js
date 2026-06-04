const { DEFAULTS, SETTINGS_FIELDS, S3_IMAGE_FIELDS } = require('./globalSetting.constants');
const { isStoredObjectKey } = require('../../shared/utils/fileUrl');

const isStorableImage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  const v = value.trim();
  if (v.startsWith('blob:') || v.startsWith('data:')) return false;
  return isStoredObjectKey(v);
};

const pickSettingsFields = (source = {}) => {
  const out = {};
  for (const key of SETTINGS_FIELDS) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
};

const sanitizeSettingsPayload = (payload = {}) => {
  const picked = pickSettingsFields(payload);
  for (const field of S3_IMAGE_FIELDS) {
    if (picked[field] === '') picked[field] = '';
    else if (picked[field] !== undefined && !isStorableImage(picked[field])) {
      delete picked[field];
    }
  }
  return picked;
};

const toPublicShape = (doc) => {
  const base = { ...DEFAULTS };
  if (!doc) return base;
  for (const key of SETTINGS_FIELDS) {
    if (doc[key] !== undefined && doc[key] !== null) base[key] = doc[key];
  }
  return base;
};

module.exports = {
  pickSettingsFields,
  sanitizeSettingsPayload,
  toPublicShape,
  isStorableImage,
};
