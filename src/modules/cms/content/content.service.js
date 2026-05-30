const CmsContent = require('./content.model');

const save = async ({ section, data }) => {
  const content = await CmsContent.findOneAndUpdate(
    { section, isDeleted: false },
    { section, data },
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
