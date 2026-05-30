const Package = require('./package.model');
const { buildQueryFilter, facetPaginate } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Package);
  if (publicOnly) match.status = 'active';
  const [result] = await Package.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const create = (data) => Package.create(data);

const update = async (id, data) => {
  const pkg = await Package.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return pkg;
};

const softDelete = async (id) => {
  const pkg = await Package.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return pkg;
};

const getById = async (id, { publicOnly = false } = {}) => {
  const filter = { _id: id, isDeleted: false };
  if (publicOnly) filter.status = 'active';
  const pkg = await Package.findOne(filter);
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return pkg;
};

module.exports = { list, create, update, softDelete, getById };
