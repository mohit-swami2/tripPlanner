const { z } = require('zod');
const { listQuerySchema } = require('../../../shared/validators/common.schemas');

const faqItem = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  order: z.number().int().optional(),
  isEnabled: z.boolean().optional(),
});

const createFaqSchema = z.object({
  body: faqItem.extend({
    isEnabled: z.boolean().optional(),
  }),
});

const upsertFaqSchema = z.object({
  body: z.object({
    faqs: z.array(faqItem).optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
    order: z.number().int().optional(),
    isEnabled: z.boolean().optional(),
  }),
});

const listFaqSchema = listQuerySchema;

const updateFaqSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: faqItem.partial(),
});

module.exports = { createFaqSchema, upsertFaqSchema, updateFaqSchema, listFaqSchema, faqItem };
