const { z } = require('zod');

const settingsBody = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  defaultMetaTitle: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

const saveSettingsSchema = z.object({
  body: settingsBody,
});

module.exports = { saveSettingsSchema, settingsBody };
