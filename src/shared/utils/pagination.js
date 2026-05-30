const getPaginationOptions = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' || query.sortOrder === '1' ? 1 : -1;
  const skip = (page - 1) * limit;
  return { page, limit, sortBy, sortOrder, skip, sortStage: { [sortBy]: sortOrder } };
};

const buildPaginationExtras = ({ page, limit, sortBy, sortOrder, total }) => ({
  page,
  limit,
  sort: sortBy,
  sortOrder: sortOrder === 1 ? 'asc' : 'desc',
  total,
  totalPages: Math.ceil(total / limit) || 0,
});

module.exports = { getPaginationOptions, buildPaginationExtras };
