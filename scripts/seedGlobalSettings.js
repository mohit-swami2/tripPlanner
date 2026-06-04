const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const GlobalSetting = require('../src/modules/globalSetting/globalSetting.model');
const { DEFAULTS } = require('../src/modules/globalSetting/globalSetting.constants');

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set in .env');

  await mongoose.connect(process.env.MONGO_URI);
  await GlobalSetting.findOneAndUpdate(
    { key: 'app' },
    { key: 'app', ...DEFAULTS },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('Global settings seeded:', DEFAULTS);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
