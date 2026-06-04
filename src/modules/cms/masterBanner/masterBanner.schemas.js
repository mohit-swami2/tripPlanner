const { z } = require('zod');
const { listQuerySchema, objectId } = require('../../../shared/validators/common.schemas');

const saveBannerBody = z.object({
  title: z.string().trim().min(1).optional(),
  linkUrl: z.string().trim().optional(),
  image: z.string().trim().min(1).optional(),
  sequence: z.coerce.number().int().min(0).optional(),
  isEnabled: z.coerce.boolean().optional(),
});

const saveBannerSchema = z.object({
  body: saveBannerBody,
});

const updateBannerSchema = z.object({
  params: z.object({ id: objectId }),
  body: saveBannerBody.partial(),
});

const reorderBannersSchema = z.object({
  body: z.object({
    orderedIds: z.array(objectId).min(1),
  }),
});

const statusBannerSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    isEnabled: z.coerce.boolean(),
  }),
});

const listBannerSchema = listQuerySchema;

module.exports = {
  saveBannerSchema,
  updateBannerSchema,
  reorderBannersSchema,
  statusBannerSchema,
  listBannerSchema,
};
