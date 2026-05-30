const multer = require('multer');
const path = require('path');

const memoryStorage = multer.memoryStorage();

const maxSizeMb = Number(process.env.PROFILE_IMAGE_MAX_SIZE_MB) || 5;

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Invalid file type'));
  },
});

module.exports = { upload };
