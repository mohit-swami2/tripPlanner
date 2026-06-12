const CmsContent = require('./content.model');
const { extractObjectKey, isStoredObjectKey } = require('../../../shared/utils/fileUrl');

const sanitizeCmsData = (data) => {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  if (typeof out.imageUrl === 'string') {
    const value = out.imageUrl.trim();
    if (!value || value.startsWith('blob:') || value.startsWith('data:')) {
      delete out.imageUrl;
    } else if (value.startsWith('http://') || value.startsWith('https://')) {
      const key = extractObjectKey(value);
      out.imageUrl = isStoredObjectKey(key) ? key : value;
    }
  }
  return out;
};

const save = async ({ section, data }) => {
  const content = await CmsContent.findOneAndUpdate(
    { section, isDeleted: false },
    { section, data: sanitizeCmsData(data) },
    { new: true, upsert: true, runValidators: true }
  );
  return content;
};

const getBySection = async (section, { publicOnly = false } = {}) => {
  const content = await CmsContent.findOne({ section, isDeleted: false });
  if (!content && publicOnly) throw { status: 404, message: 'Content not found' };
  return content || { section, data: {} };
};

const list = () => CmsContent.find({ isDeleted: false });

module.exports = { save, getBySection, list };
