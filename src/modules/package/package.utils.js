const { isStoredObjectKey } = require('../../shared/utils/fileUrl');

const isStorableImage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  const v = value.trim();
  if (v.startsWith('blob:') || v.startsWith('data:')) return false;
  return isStoredObjectKey(v);
};

const parseJsonField = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }
    return value;
  }
  return value;
};

const sanitizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.filter(isStorableImage);
};

const sanitizePackagePayload = (data = {}) => {
  const payload = { ...data };
  if (payload.images !== undefined) payload.images = sanitizeImages(payload.images);
  if (payload.highlights !== undefined && !Array.isArray(payload.highlights)) {
    delete payload.highlights;
  }
  if (payload.included !== undefined && !Array.isArray(payload.included)) {
    delete payload.included;
  }
  if (payload.itinerary !== undefined && !Array.isArray(payload.itinerary)) {
    delete payload.itinerary;
  }
  return payload;
};

const buildPackageBodyFromRequest = async (req) => {
  const b = req.body || {};
  const body = {
    title: b.title,
    price: b.price,
    duration: b.duration,
    summary: b.summary,
    description: b.description,
    groupSize: b.groupSize,
    rating: b.rating,
    status: b.status,
    highlights: parseJsonField(b.highlights),
    included: parseJsonField(b.included),
    itinerary: parseJsonField(b.itinerary),
  };

  let images = parseJsonField(b.images);
  if (!Array.isArray(images)) images = images ? [images] : [];

  const files = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);
  else if (req.files && typeof req.files === 'object') {
    Object.values(req.files)
      .flat()
      .forEach((f) => files.push(f));
  }

  if (files.length) {
    const { persistUpload } = require('../../shared/utils/fileUrl');
    for (const file of files) {
      const key = await persistUpload(file);
      if (key) images.push(key);
    }
  }

  if (images.length) body.images = sanitizeImages(images);

  return sanitizePackagePayload(
    Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined && v !== ''))
  );
};

module.exports = {
  sanitizePackagePayload,
  sanitizeImages,
  isStorableImage,
  parseJsonField,
  buildPackageBodyFromRequest,
};
