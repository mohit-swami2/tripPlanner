const { z } = require('zod');

const dayItem = z.object({
  day: z.number().int().positive(),
  activity: z.string().min(1),
  timing: z.string().optional(),
  location: z.string().optional(),
});

const createItinerarySchema = z.object({
  body: z.object({
    tripId: z.string().regex(/^[a-f\d]{24}$/i),
    days: z.array(dayItem).min(1),
  }),
});

const updateItinerarySchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({ days: z.array(dayItem).min(1) }),
});

module.exports = { createItinerarySchema, updateItinerarySchema };
