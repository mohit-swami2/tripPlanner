const MasterBanner = require('./masterBanner.model');
const { buildQueryFilter, facetPaginate } = require('../../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../../shared/utils/pagination');

const notDeleted = { isDeleted: false };

const getNextSequence = async () => {
  const last = await MasterBanner.findOne(notDeleted).sort({ sequence: -1 }).select('sequence').lean();
  return (last?.sequence ?? 0) + 1;
};

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip } = getPaginationOptions(query);
  const match = { ...buildQueryFilter(query, MasterBanner), ...notDeleted };
  if (publicOnly) match.isEnabled = true;

  const sortStage =
    sortBy === 'createdAt' ? { sequence: 1, createdAt: -1 } : { [sortBy]: sortOrder === 1 ? 1 : -1 };

  const [result] = await MasterBanner.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return {
    data: result?.data || [],
    ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }),
  };
};

const save = async (data) => {
  const payload = { ...data };
  if (payload.sequence == null) {
    payload.sequence = await getNextSequence();
  }
  if (payload.linkUrl === '') payload.linkUrl = undefined;
  return MasterBanner.create(payload);
};

const update = async (id, data) => {
  const payload = { ...data };
  if (payload.linkUrl === '') payload.linkUrl = undefined;

  const banner = await MasterBanner.findOneAndUpdate({ _id: id, ...notDeleted }, payload, {
    new: true,
    runValidators: true,
  });
  if (!banner) throw { status: 404, message: 'Master banner not found' };
  return banner;
};

const reorder = async (orderedIds) => {
  const existing = await MasterBanner.find({ _id: { $in: orderedIds }, ...notDeleted }).select('_id');
  if (existing.length !== orderedIds.length) {
    throw { status: 400, message: 'One or more banner IDs are invalid' };
  }

  const ops = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, ...notDeleted },
      update: { $set: { sequence: index + 1 } },
    },
  }));

  await MasterBanner.bulkWrite(ops);
  return MasterBanner.find(notDeleted).sort({ sequence: 1, createdAt: -1 });
};

const setStatus = async (id, isEnabled) => {
  const banner = await MasterBanner.findOneAndUpdate(
    { _id: id, ...notDeleted },
    { isEnabled },
    { new: true }
  );
  if (!banner) throw { status: 404, message: 'Master banner not found' };
  return banner;
};

const softDelete = async (id) => {
  const banner = await MasterBanner.findOneAndUpdate(
    { _id: id, ...notDeleted },
    { isDeleted: true },
    { new: true }
  );
  if (!banner) throw { status: 404, message: 'Master banner not found' };
  return banner;
};

module.exports = { list, save, update, reorder, setStatus, softDelete };
