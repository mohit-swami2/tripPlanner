const { z } = require('zod');
const { listQuerySchema } = require('../../shared/validators/common.schemas');

const submitContactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(5),
  }),
});

const listContactSchema = listQuerySchema;

module.exports = { submitContactSchema, listContactSchema };
