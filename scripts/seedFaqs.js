/**
 * Seed homepage FAQs and CMS section heading.
 * Run: npm run seed:faqs
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('../src/modules/cms/faq/faq.model');
const CmsContent = require('../src/modules/cms/content/content.model');

const FAQ_ITEMS = [
  {
    question: 'How much does a Jaipur tour package cost?',
    answer:
      'TripPlanner Jaipur tour packages start from ₹4,000 per person for a 2-day trip including hotel, breakfast, AC cab, and guided sightseeing. Final price depends on hotel category, group size, and season.',
    order: 0,
  },
  {
    question: 'What is included in a Jaipur tour package?',
    answer:
      'Our standard packages include hotel stay, daily breakfast, AC cab with driver, entry tickets to major forts, and a local guide. Lunch, dinner, and personal expenses are not included unless specified.',
    order: 1,
  },
  {
    question: 'Why book with TripPlanner instead of a local travel agent?',
    answer:
      'Local agencies often add heavy markups on hotels and transport. TripPlanner is based in Malviya Nagar, Jaipur — we negotiate direct rates and pass the savings to you with transparent pricing.',
    order: 2,
  },
  {
    question: 'How do I book a Jaipur tour?',
    answer:
      'Fill out our enquiry form at tripplanner.swamimohit.in/travel-inquiry or call 9828854006. Share your dates, group size, and budget — we\'ll send a custom itinerary within 2 hours.',
    order: 3,
  },
  {
    question: 'Can I customise my Jaipur itinerary?',
    answer:
      'Yes. Every package is fully customisable — add extra days, upgrade hotels, include Pushkar or Ajmer, or plan a honeymoon or corporate outing.',
    order: 4,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const item of FAQ_ITEMS) {
    const existing = await Faq.findOne({ question: item.question, isDeleted: false });
    if (existing) {
      await Faq.updateOne({ _id: existing._id }, { ...item, isEnabled: true });
      console.log(`Updated FAQ: ${item.question.slice(0, 40)}…`);
    } else {
      await Faq.create({ ...item, isEnabled: true });
      console.log(`Created FAQ: ${item.question.slice(0, 40)}…`);
    }
  }

  await CmsContent.findOneAndUpdate(
    { section: 'FAQ', isDeleted: false },
    {
      section: 'FAQ',
      data: {
        title: 'Frequently Asked Questions',
        subtitle: 'Quick answers about Jaipur tour packages, booking, and what\'s included.',
      },
    },
    { upsert: true, new: true }
  );
  console.log('CMS FAQ section heading saved');

  console.log(`\nFAQs seeded: ${FAQ_ITEMS.length} items`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
