const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc', '1', '-1']).optional().default('desc'),
});

const idParam = z.object({ params: z.object({ id: objectId }) });

const listQuerySchema = z.object({
  query: paginationQuery.extend({}).catchall(z.union([z.string(), z.number(), z.boolean()])),
});

module.exports = { objectId, paginationQuery, idParam, listQuerySchema };
