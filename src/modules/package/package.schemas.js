const { z } = require('zod');
const { PACKAGE_STATUS } = require('../../shared/utils/constants');
const { listQuerySchema } = require('../../shared/validators/common.schemas');

const dayItem = z.object({
  day: z.number().int().positive().optional(),
  title: z.string().optional(),
  activity: z.string().optional(),
  location: z.string().optional(),
});

const createPackageSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    price: z.number().nonnegative(),
    duration: z.string().min(2),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    itinerary: z.array(dayItem).optional(),
    status: z.enum(PACKAGE_STATUS).optional(),
  }),
});

const updatePackageSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: createPackageSchema.shape.body.partial(),
});

const listPackageSchema = listQuerySchema;

module.exports = { createPackageSchema, updatePackageSchema, listPackageSchema };
