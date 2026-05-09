const { z } = require('zod');

const createInquirySchema = z.object({
  body: z.object({
    customerName: z.string({
      required_error: 'Customer name is required',
    }).min(2, 'Name must be at least 2 characters'),
    contact: z.string({
      required_error: 'Contact is required',
    }),
    destinationInterest: z.string({
      required_error: 'Destination interest is required',
    }),
    travelDates: z.string({
      required_error: 'Travel dates are required',
    }),
    status: z.enum(['pending', 'contacted', 'booked', 'cancelled']).optional().default('pending')
  }),
});

module.exports = { createInquirySchema };
