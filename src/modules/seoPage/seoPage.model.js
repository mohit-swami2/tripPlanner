const mongoose = require('mongoose');
const { SEO_PAGE_CATEGORY, SEO_PAGE_STATUS } = require('../../shared/utils/constants');

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    paragraphs: { type: [String], default: [] },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const internalLinkSchema = new mongoose.Schema(
  {
    href: { type: String, required: true },
    anchor: { type: String, required: true },
  },
  { _id: false }
);

const seoPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true },
    category: { type: String, enum: SEO_PAGE_CATEGORY, required: true },
    path: { type: String, required: true, trim: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    primaryKeyword: { type: String, default: '' },
    h1: { type: String, required: true },
    intro: { type: String, required: true },
    sections: { type: [sectionSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    internalLinks: { type: [internalLinkSchema], default: [] },
    schemaTypes: { type: [String], default: [] },
    excerpt: { type: String, default: '' },
    publishedAt: { type: Date },
    status: { type: String, enum: SEO_PAGE_STATUS, default: 'published' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

seoPageSchema.index({ slug: 1, category: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
seoPageSchema.index({ category: 1, status: 1, isDeleted: 1 });

module.exports = mongoose.model('SeoPage', seoPageSchema);
