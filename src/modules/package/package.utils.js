const isStorableImage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  const v = value.trim();
  if (v.startsWith('blob:') || v.startsWith('data:')) return false;
  return true;
};

const sanitizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.filter(isStorableImage);
};

const sanitizePackagePayload = (data = {}) => {
  const payload = { ...data };
  if (payload.images !== undefined) payload.images = sanitizeImages(payload.images);
  return payload;
};

module.exports = { sanitizePackagePayload, sanitizeImages, isStorableImage };
