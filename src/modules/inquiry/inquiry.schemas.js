const { z } = require('zod');
const { INQUIRY_STATUS } = require('../../shared/utils/constants');
const { listQuerySchema } = require('../../shared/validators/common.schemas');

const createInquirySchema = z.object({
  body: z.object({
    customerName: z.string().min(2),
    contact: z.string().min(3),
    destinationInterest: z.string().min(2),
    travelDates: z.coerce.date(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
});

const updateInquirySchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    status: z.enum(INQUIRY_STATUS).optional(),
    notes: z.string().optional(),
  }),
});

const updateInquiryStatusSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    status: z.enum(INQUIRY_STATUS),
  }),
});

const listInquirySchema = listQuerySchema;

module.exports = {
  createInquirySchema,
  updateInquirySchema,
  updateInquiryStatusSchema,
  idParamSchema,
  listInquirySchema,
};
