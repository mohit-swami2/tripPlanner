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

const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    rating: z.coerce.number().int().min(1).max(5),
    description: z.string().min(5),
    image: z.string().trim().min(1).optional(),
    isEnabled: z.coerce.boolean().optional(),
  }),
});

const updateTestimonialSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    isEnabled: z.coerce.boolean().optional(),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    description: z.string().min(5).optional(),
    image: z.string().trim().min(1).optional(),
  }),
});

const listTestimonialSchema = listQuerySchema;

module.exports = {
  submitTestimonialSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  listTestimonialSchema,
};
