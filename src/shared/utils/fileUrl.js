const path = require('path');

const getFileUrl = (req, relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/${relativePath.replace(/\\/g, '/')}`;
};

const persistUpload = (file, subfolder = 'uploads') => {
  if (!file?.buffer) return null;
  const fs = require('fs');
  const dir = path.join(process.cwd(), subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return path.join(subfolder, filename).replace(/\\/g, '/');
};

module.exports = { getFileUrl, persistUpload };
