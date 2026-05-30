const { z } = require('zod');
const { listQuerySchema } = require('../../../shared/validators/common.schemas');

const createTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    subject: z.string().min(2),
    description: z.string().min(2),
    isEnabled: z.boolean().optional(),
  }),
});

const updateTemplateSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: createTemplateSchema.shape.body.partial().omit({ slug: true }),
});

const listTemplateSchema = listQuerySchema;

module.exports = { createTemplateSchema, updateTemplateSchema, listTemplateSchema };
