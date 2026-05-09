const fs = require('fs');
const path = require('path');
const AppError = require('../utils/AppError');

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5 * 1024 * 1024; // 5MB default
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads/';

const uploadFile = async (fileBuffer, originalName) => {
  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new AppError('File size exceeds the maximum limit', 400);
  }
  
  const fullUploadPath = path.resolve(process.cwd(), UPLOAD_PATH);
  
  // Ensure the directory exists
  if (!fs.existsSync(fullUploadPath)) {
    fs.mkdirSync(fullUploadPath, { recursive: true });
  }

  // Format: YYYYMMDD-HHMMSS-
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
  const timeStr = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
  const prefix = `${dateStr}-${timeStr}-`;
  
  const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
  const fileName = `${prefix}${sanitizedOriginalName}`;
  const filePath = path.join(fullUploadPath, fileName);
  
  // Write file asynchronously
  await fs.promises.writeFile(filePath, fileBuffer);
  
  // Return relative URL string, ensuring leading slash and correct formatting
  const relativeUrl = `/${UPLOAD_PATH}${fileName}`.replace(/\/{2,}/g, '/');
  
  return relativeUrl;
};

module.exports = { uploadFile };
