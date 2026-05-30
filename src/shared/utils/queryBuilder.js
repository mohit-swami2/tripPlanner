const mongoose = require('mongoose');

const RESERVED = new Set(['page', 'limit', 'sortBy', 'sortOrder', 'sort', 'fields']);

const { notDeleted } = require('./notDeleted');

const buildQueryFilter = (query = {}, model) => {
  const filter = { ...notDeleted };
  if (!model?.schema?.paths) return filter;

  const paths = model.schema.paths;

  for (const [key, value] of Object.entries(query)) {
    if (RESERVED.has(key) || value === undefined || value === '') continue;
    const path = paths[key];
    if (!path) continue;

    const instance = path.instance;
    if (instance === 'String') {
      filter[key] = { $regex: value, $options: 'i' };
    } else if (instance === 'Number') {
      filter[key] = Number(value);
    } else if (instance === 'Boolean') {
      filter[key] = value === 'true' || value === true;
    } else if (instance === 'Date') {
      filter[key] = new Date(value);
    } else if (instance === 'ObjectID' && mongoose.Types.ObjectId.isValid(value)) {
      filter[key] = new mongoose.Types.ObjectId(value);
    } else if (path.enumValues?.length) {
      filter[key] = value;
    } else if (Array.isArray(value)) {
      filter[key] = { $in: value };
    } else {
      filter[key] = value;
    }
  }

  return filter;
};

const facetPaginate = ({ match, sortStage, skip, limit }) => [
  { $match: match },
  { $sort: sortStage },
  {
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      meta: [{ $count: 'total' }],
    },
  },
  {
    $project: {
      data: 1,
      total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
    },
  },
];

module.exports = { buildQueryFilter, facetPaginate, RESERVED };
