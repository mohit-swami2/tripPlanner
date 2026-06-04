const Package = require('./package.model');
const { buildQueryFilter } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');
const { normalizeMongoDoc } = require('../../shared/utils/serializeDoc');
const { sanitizePackagePayload } = require('./package.utils');

const notDeleted = { isDeleted: false };

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip } = getPaginationOptions(query);
  const match = { ...buildQueryFilter(query, Package), ...notDeleted };
  if (publicOnly) match.status = 'active';

  const sort = { [sortBy]: sortOrder === 1 ? 1 : -1 };

  const [rows, total] = await Promise.all([
    Package.find(match).sort(sort).skip(skip).limit(limit).lean(),
    Package.countDocuments(match),
  ]);

  return {
    data: rows.map(normalizeMongoDoc),
    ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }),
  };
};

const create = (data) => Package.create(sanitizePackagePayload(data));

const update = async (id, data) => {
  const pkg = await Package.findOneAndUpdate(
    { _id: id, ...notDeleted },
    sanitizePackagePayload(data),
    { new: true, runValidators: true }
  ).lean();
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return normalizeMongoDoc(pkg);
};

const softDelete = async (id) => {
  const pkg = await Package.findOneAndUpdate(
    { _id: id, ...notDeleted },
    { isDeleted: true },
    { new: true }
  ).lean();
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return normalizeMongoDoc(pkg);
};

const getById = async (id, { publicOnly = false } = {}) => {
  const filter = { _id: id, ...notDeleted };
  if (publicOnly) filter.status = 'active';
  const pkg = await Package.findOne(filter).lean();
  if (!pkg) throw { status: 404, message: 'Package not found' };
  return normalizeMongoDoc(pkg);
};

module.exports = { list, create, update, softDelete, getById };
