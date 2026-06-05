const SeoPage = require('./seoPage.model');
const { buildQueryFilter } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');
const { normalizeMongoDoc } = require('../../shared/utils/serializeDoc');

const notDeleted = { isDeleted: false };

const sanitizePayload = (data) => {
  const payload = { ...data };
  if (payload.slug) payload.slug = String(payload.slug).trim().toLowerCase();
  if (payload.path) payload.path = String(payload.path).trim();
  if (payload.status === 'published' && !payload.publishedAt) {
    payload.publishedAt = new Date();
  }
  return payload;
};

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip } = getPaginationOptions(query);
  const match = { ...buildQueryFilter(query, SeoPage), ...notDeleted };
  if (publicOnly) match.status = 'published';
  if (query.category) match.category = query.category;

  const sort = { [sortBy]: sortOrder === 1 ? 1 : -1 };

  const [rows, total] = await Promise.all([
    SeoPage.find(match).sort(sort).skip(skip).limit(limit).lean(),
    SeoPage.countDocuments(match),
  ]);

  return {
    data: rows.map(normalizeMongoDoc),
    ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }),
  };
};

const getBySlug = async (category, slug, { publicOnly = false } = {}) => {
  const filter = { category, slug: String(slug).trim().toLowerCase(), ...notDeleted };
  if (publicOnly) filter.status = 'published';
  const page = await SeoPage.findOne(filter).lean();
  if (!page) throw { status: 404, message: 'SEO page not found' };
  return normalizeMongoDoc(page);
};

const getById = async (id) => {
  const page = await SeoPage.findOne({ _id: id, ...notDeleted }).lean();
  if (!page) throw { status: 404, message: 'SEO page not found' };
  return normalizeMongoDoc(page);
};

const create = (data) => SeoPage.create(sanitizePayload(data));

const update = async (id, data) => {
  const page = await SeoPage.findOneAndUpdate(
    { _id: id, ...notDeleted },
    sanitizePayload(data),
    { new: true, runValidators: true }
  ).lean();
  if (!page) throw { status: 404, message: 'SEO page not found' };
  return normalizeMongoDoc(page);
};

const upsertBySlug = async (category, slug, data) => {
  const normalizedSlug = String(slug).trim().toLowerCase();
  const page = await SeoPage.findOneAndUpdate(
    { category, slug: normalizedSlug, ...notDeleted },
    sanitizePayload({ ...data, category, slug: normalizedSlug }),
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();
  return normalizeMongoDoc(page);
};

const softDelete = async (id) => {
  const page = await SeoPage.findOneAndUpdate(
    { _id: id, ...notDeleted },
    { isDeleted: true },
    { new: true }
  ).lean();
  if (!page) throw { status: 404, message: 'SEO page not found' };
  return normalizeMongoDoc(page);
};

module.exports = { list, getBySlug, getById, create, update, upsertBySlug, softDelete };
