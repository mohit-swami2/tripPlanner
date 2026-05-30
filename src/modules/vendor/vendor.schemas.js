const { z } = require('zod');
const { VENDOR_TYPE } = require('../../shared/utils/constants');
const { listQuerySchema } = require('../../shared/validators/common.schemas');

const createVendorSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(VENDOR_TYPE),
    pricing: z.number().nonnegative().optional(),
    contactInfo: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updateVendorSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: createVendorSchema.shape.body.partial(),
});

const listVendorSchema = listQuerySchema;

module.exports = { createVendorSchema, updateVendorSchema, listVendorSchema };
