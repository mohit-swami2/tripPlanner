const { z } = require('zod');
const { PAYMENT_TYPE } = require('../../shared/utils/constants');
const { listQuerySchema } = require('../../shared/validators/common.schemas');

const createPaymentSchema = z.object({
  body: z.object({
    tripId: z.string().regex(/^[a-f\d]{24}$/i),
    amount: z.number().positive(),
    type: z.enum(PAYMENT_TYPE),
    notes: z.string().optional(),
  }),
});

const listPaymentSchema = listQuerySchema;

module.exports = { createPaymentSchema, listPaymentSchema };
