const Vendor = require('./vendor.model');
const { buildQueryFilter, facetPaginate } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');

const list = async (query) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Vendor);
  const [result] = await Vendor.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const create = (data) => Vendor.create(data);

const update = async (id, data) => {
  const vendor = await Vendor.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  if (!vendor) throw { status: 404, message: 'Vendor not found' };
  return vendor;
};

const softDelete = async (id) => {
  const vendor = await Vendor.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!vendor) throw { status: 404, message: 'Vendor not found' };
  return vendor;
};

const getById = async (id) => {
  const vendor = await Vendor.findOne({ _id: id, isDeleted: false });
  if (!vendor) throw { status: 404, message: 'Vendor not found' };
  return vendor;
};

module.exports = { list, create, update, softDelete, getById };
