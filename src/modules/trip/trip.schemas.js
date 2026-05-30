const { z } = require('zod');
const { TRIP_STATUS } = require('../../shared/utils/constants');
const { listQuerySchema } = require('../../shared/validators/common.schemas');

const createTripSchema = z.object({
  body: z.object({
    inquiryId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    customerId: z.string().optional(),
    customerName: z.string().min(2),
    customerContact: z.string().optional(),
    totalCost: z.number().nonnegative(),
    status: z.enum(TRIP_STATUS).optional(),
    isEnabled: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

const updateTripSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: createTripSchema.shape.body.partial(),
});

const updateTripEnableSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    isEnabled: z.boolean(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
});

const listTripSchema = listQuerySchema;

module.exports = {
  createTripSchema,
  updateTripSchema,
  updateTripEnableSchema,
  idParamSchema,
  listTripSchema,
};
