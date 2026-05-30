const EmailTemplate = require('./emailTemplate.model');
const { buildQueryFilter, facetPaginate } = require('../../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../../shared/utils/pagination');

const list = async (query) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, EmailTemplate);
  const [result] = await EmailTemplate.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const create = (data) => EmailTemplate.create(data);

const update = async (id, data) => {
  const tpl = await EmailTemplate.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  if (!tpl) throw { status: 404, message: 'Template not found' };
  return tpl;
};

const softDelete = async (id) => {
  const tpl = await EmailTemplate.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!tpl) throw { status: 404, message: 'Template not found' };
  return tpl;
};

module.exports = { list, create, update, softDelete };
