const Faq = require('./faq.model');
const { buildQueryFilter, facetPaginate } = require('../../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../../shared/utils/pagination');

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Faq);
  if (publicOnly) match.isEnabled = true;
  const sortStageFaq = sortBy === 'createdAt' ? { order: 1, createdAt: -1 } : sortStage;
  const [result] = await Faq.aggregate(facetPaginate({ match, sortStage: sortStageFaq, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const bulkUpsert = async (faqs = []) => {
  const results = [];
  for (const item of faqs) {
    if (item._id) {
      const updated = await Faq.findOneAndUpdate({ _id: item._id, isDeleted: false }, item, { new: true });
      if (updated) results.push(updated);
    } else {
      results.push(await Faq.create(item));
    }
  }
  return results;
};

const create = (data) => Faq.create(data);

const update = async (id, data) => {
  const faq = await Faq.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  if (!faq) throw { status: 404, message: 'FAQ not found' };
  return faq;
};

const softDelete = async (id) => {
  const faq = await Faq.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!faq) throw { status: 404, message: 'FAQ not found' };
  return faq;
};

module.exports = { list, bulkUpsert, create, update, softDelete };
