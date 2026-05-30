const { z } = require('zod');
const { listQuerySchema } = require('../../../shared/validators/common.schemas');

const submitTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    rating: z.number().int().min(1).max(5),
    description: z.string().min(5),
    image: z.string().optional(),
  }),
});

const updateTestimonialSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    isEnabled: z.boolean().optional(),
    name: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    description: z.string().optional(),
  }),
});

const listTestimonialSchema = listQuerySchema;

module.exports = { submitTestimonialSchema, updateTestimonialSchema, listTestimonialSchema };
