const { z } = require('zod');
const { PACKAGE_STATUS } = require('../../shared/utils/constants');
const { listQuerySchema, objectId } = require('../../shared/validators/common.schemas');

const itineraryItem = z.object({
  day: z.coerce.number().int().positive(),
  title: z.string().min(1),
  activity: z.string().min(1),
  location: z.string().optional(),
});

const packageBody = z.object({
  title: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  duration: z.string().min(2),
  summary: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string().min(1)).optional(),
  groupSize: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  included: z.array(z.string().min(1)).optional(),
  images: z.array(z.string()).optional(),
  itinerary: z.array(itineraryItem).optional(),
  status: z.enum(PACKAGE_STATUS).optional(),
});

const createPackageSchema = z.object({
  body: packageBody,
});

const updatePackageSchema = z.object({
  params: z.object({ id: objectId }),
  body: packageBody.partial(),
});

const packageIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

const listPackageSchema = listQuerySchema;

module.exports = {
  createPackageSchema,
  updatePackageSchema,
  packageIdParamSchema,
  listPackageSchema,
};
