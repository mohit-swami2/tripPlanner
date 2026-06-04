const Testimonial = require('./testimonial.model');
const { buildQueryFilter } = require('../../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../../shared/utils/pagination');
const { normalizeMongoDoc } = require('../../../shared/utils/serializeDoc');

const notDeleted = { isDeleted: false };

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip } = getPaginationOptions(query);
  const match = { ...buildQueryFilter(query, Testimonial), ...notDeleted };
  if (publicOnly) match.isEnabled = true;

  const sort = { [sortBy]: sortOrder === 1 ? 1 : -1 };

  const [rows, total] = await Promise.all([
    Testimonial.find(match).sort(sort).skip(skip).limit(limit).lean(),
    Testimonial.countDocuments(match),
  ]);

  return {
    data: rows.map(normalizeMongoDoc),
    ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }),
  };
};

const submit = (data) => Testimonial.create({ ...data, isEnabled: false });

const create = (data) =>
  Testimonial.create({
    ...data,
    isEnabled: data.isEnabled !== undefined ? data.isEnabled : true,
  });

const update = async (id, data) => {
  const item = await Testimonial.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  if (!item) throw { status: 404, message: 'Testimonial not found' };
  return item;
};

const softDelete = async (id) => {
  const item = await Testimonial.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!item) throw { status: 404, message: 'Testimonial not found' };
  return item;
};

module.exports = { list, submit, create, update, softDelete };
