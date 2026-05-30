const Testimonial = require('./testimonial.model');
const { buildQueryFilter, facetPaginate } = require('../../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../../shared/utils/pagination');

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Testimonial);
  if (publicOnly) match.isEnabled = true;
  const [result] = await Testimonial.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const submit = (data) => Testimonial.create({ ...data, isEnabled: false });

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

module.exports = { list, submit, update, softDelete };
