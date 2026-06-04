const multer = require('multer');
const path = require('path');

const memoryStorage = multer.memoryStorage();

const maxFileSize =
  Number(process.env.MAX_FILE_SIZE) ||
  (Number(process.env.PROFILE_IMAGE_MAX_SIZE_MB) || 5) * 1024 * 1024;

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: maxFileSize },
  fileFilter(_req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Invalid file type'));
  },
});

module.exports = { upload };
