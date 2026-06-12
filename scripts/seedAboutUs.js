const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const CmsContent = require('../src/modules/cms/content/content.model');

const ABOUT_US_DATA = {
  title: 'About Jaipur',
  badgeLabel: 'Our Story',
  content:
    'Jaipur, the capital of Rajasthan, is a mesmerizing blend of rich history, vibrant culture, and architectural grandeur. Known as the Pink City for its distinctive terracotta-colored buildings, Jaipur is home to magnificent palaces, imposing forts, and bustling bazaars.',
  highlights: [
    'UNESCO World Heritage City',
    'Award-Winning Local Guides',
    'Personalized Experiences',
  ],
  stats: [
    { value: '15+', label: 'Years of Experience' },
    { value: '10K+', label: 'Happy Travelers' },
    { value: '50+', label: 'Curated Tours' },
  ],
  ctaLabel: 'Explore Our Packages',
  locationTitle: 'The Pink City',
  locationSubtitle: 'Rajasthan, India',
  locationRating: '4.9',
};

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set in .env');

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await CmsContent.findOne({ section: 'About Us', isDeleted: false });
  const existingImage =
    existing?.data && typeof existing.data === 'object' && typeof existing.data.imageUrl === 'string'
      ? existing.data.imageUrl.trim()
      : '';
  const data = {
    ...ABOUT_US_DATA,
    ...(existingImage ? { imageUrl: existingImage } : {}),
  };

  await CmsContent.findOneAndUpdate(
    { section: 'About Us', isDeleted: false },
    { section: 'About Us', data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('About Us CMS seeded:', data);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
