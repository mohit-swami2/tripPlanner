const { z } = require('zod');
const { SEO_PAGE_CATEGORY, SEO_PAGE_STATUS } = require('../../shared/utils/constants');
const { listQuerySchema, objectId } = require('../../shared/validators/common.schemas');

const sectionSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).default([]),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const internalLinkSchema = z.object({
  href: z.string().min(1),
  anchor: z.string().min(1),
});

const seoPageBody = z.object({
  slug: z.string().min(2),
  category: z.enum(SEO_PAGE_CATEGORY),
  path: z.string().min(1),
  metaTitle: z.string().min(10).max(70),
  metaDescription: z.string().min(50).max(170),
  primaryKeyword: z.string().optional(),
  h1: z.string().min(3),
  intro: z.string().min(10),
  sections: z.array(sectionSchema).optional(),
  faqs: z.array(faqSchema).optional(),
  internalLinks: z.array(internalLinkSchema).optional(),
  schemaTypes: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  status: z.enum(SEO_PAGE_STATUS).optional(),
  isEnabled: z.coerce.boolean().optional(),
});

const createSeoPageSchema = z.object({ body: seoPageBody });

const updateSeoPageSchema = z.object({
  params: z.object({ id: objectId }),
  body: seoPageBody.partial(),
});

const seoPageIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

const seoPageSlugParamSchema = z.object({
  params: z.object({
    category: z.enum(SEO_PAGE_CATEGORY),
    slug: z.string().min(2),
  }),
});

const listSeoPageSchema = listQuerySchema.extend({
  category: z.enum(SEO_PAGE_CATEGORY).optional(),
  status: z.enum(SEO_PAGE_STATUS).optional(),
  isEnabled: z.coerce.boolean().optional(),
  h1: z.string().optional(),
  slug: z.string().optional(),
});

module.exports = {
  createSeoPageSchema,
  updateSeoPageSchema,
  seoPageIdParamSchema,
  seoPageSlugParamSchema,
  listSeoPageSchema,
};
