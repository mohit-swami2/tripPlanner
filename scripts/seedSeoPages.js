const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const seoPageService = require('../src/modules/seoPage/seoPage.service');
const { SEO_PAGES_SEED } = require('./seoPagesSeedData');

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set in .env');

  await mongoose.connect(process.env.MONGO_URI);

  let count = 0;
  for (const page of SEO_PAGES_SEED) {
    await seoPageService.upsertBySlug(page.category, page.slug, page);
    count += 1;
    console.log(`Seeded: [${page.category}] ${page.slug}`);
  }

  console.log(`\nSEO pages seeded: ${count} pages`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
