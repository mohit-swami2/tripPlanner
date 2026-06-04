const GlobalSetting = require('./globalSetting.model');
const { DEFAULTS } = require('./globalSetting.constants');
const { sanitizeSettingsPayload, toPublicShape } = require('./globalSetting.utils');

const SETTINGS_KEY = GlobalSetting.SETTINGS_KEY;

const getSettings = async () => {
  let settings = await GlobalSetting.findOne({ key: SETTINGS_KEY, isDeleted: false }).lean();
  if (!settings) {
    const created = await GlobalSetting.create({ key: SETTINGS_KEY, ...DEFAULTS });
    return toPublicShape(created.toObject());
  }
  return toPublicShape(settings);
};

const saveSettings = async (payload) => {
  const update = sanitizeSettingsPayload(payload);
  if (!Object.keys(update).length) return getSettings();

  const settings = await GlobalSetting.findOneAndUpdate(
    { key: SETTINGS_KEY, isDeleted: false },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  ).lean();

  return toPublicShape(settings);
};

module.exports = { getSettings, saveSettings };
