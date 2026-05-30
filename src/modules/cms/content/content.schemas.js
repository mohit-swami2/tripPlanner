const { z } = require('zod');
const { CMS_SECTIONS } = require('../../../shared/utils/constants');

const saveCmsSchema = z.object({
  body: z.object({
    section: z.enum(CMS_SECTIONS),
    data: z.any(),
  }),
});

const getCmsSchema = z.object({
  params: z.object({ section: z.string().min(1) }),
});

module.exports = { saveCmsSchema, getCmsSchema };
