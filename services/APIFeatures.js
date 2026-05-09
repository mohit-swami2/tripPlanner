const { z } = require('zod');

// Zod Schema to validate and transform standard pagination/sorting queries
const querySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default('1').transform(Number),
  limit: z.string().regex(/^\d+$/).optional().default('10').transform(Number),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc', '1', '-1']).optional().default('desc'),
}).passthrough(); // Allow dynamic filters

class APIFeatures {
  constructor(query, queryString, modelSchema) {
    this.query = query;
    this.queryString = queryString;
    this.modelSchema = modelSchema; // Mongoose schema for type checking
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'sortBy', 'sortOrder'];
    excludedFields.forEach(el => delete queryObj[el]);

    let filterObj = {};
    const schemaPaths = this.modelSchema ? this.modelSchema.paths : {};

    for (const key in queryObj) {
      if (schemaPaths[key]) {
        const type = schemaPaths[key].instance;
        if (type === 'String') {
          // Regex match for strings
          filterObj[key] = { $regex: queryObj[key], $options: 'i' };
        } else {
          // Exact match for other types (Numbers, ObjectIds, etc)
          filterObj[key] = queryObj[key];
        }
      } else {
        // Fallback if field isn't explicitly checked against schema
        filterObj[key] = queryObj[key];
      }
    }

    this.query = this.query.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryString.sortBy) {
      const sortBy = this.queryString.sortBy;
      const sortOrder = (this.queryString.sortOrder === 'asc' || this.queryString.sortOrder === '1') ? 1 : -1;
      this.query = this.query.sort({ [sortBy]: sortOrder });
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = { APIFeatures, querySchema };
