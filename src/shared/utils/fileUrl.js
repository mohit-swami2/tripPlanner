const path = require('path');
const crypto = require('crypto');
const {
  isS3Configured,
  uploadObject,
  getPresignedGetUrl,
} = require('../services/s3');
const { normalizeMongoDoc } = require('./serializeDoc');

const getUploadPrefix = () => {
  const raw = (process.env.UPLOAD_PATH || 'uploads2/').replace(/\\/g, '/');
  const trimmed = raw.replace(/^\/+|\/+$/g, '');
  return trimmed || 'uploads2';
};

const sanitizeFilename = (name) =>
  String(name || 'file')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

const buildObjectKey = (originalName) => {
  const prefix = getUploadPrefix();
  const filename = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(originalName)}`;
  return `${prefix}/${filename}`;
};

const isStoredObjectKey = (value) =>
  typeof value === 'string' &&
  value.length > 0 &&
  !value.startsWith('http://') &&
  !value.startsWith('https://');

const getFileUrl = async (req, relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');

  if (isS3Configured()) {
    return getPresignedGetUrl(normalized);
  }

  const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/${normalized}`;
};

const persistUpload = async (file, subfolder) => {
  if (!file?.buffer) return null;

  const prefix = subfolder ? subfolder.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '') : getUploadPrefix();
  const filename = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(file.originalname)}`;
  const key = `${prefix}/${filename}`;

  if (isS3Configured()) {
    await uploadObject(key, file.buffer, file.mimetype);
    return key;
  }

  const fs = require('fs');
  const dir = path.join(process.cwd(), prefix);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return key;
};

const resolveFileUrlsDeep = async (req, data) => {
  if (data == null) return data;

  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => resolveFileUrlsDeep(req, item)));
  }

  if (typeof data === 'string' && isStoredObjectKey(data)) {
    return getFileUrl(req, data);
  }

  if (typeof data !== 'object') return data;

  const plain = normalizeMongoDoc(data);
  const entries = await Promise.all(
    Object.entries(plain).map(async ([key, value]) => [key, await resolveFileUrlsDeep(req, value)])
  );
  return Object.fromEntries(entries);
};

module.exports = {
  getUploadPrefix,
  buildObjectKey,
  getFileUrl,
  persistUpload,
  resolveFileUrlsDeep,
  isStoredObjectKey,
};
