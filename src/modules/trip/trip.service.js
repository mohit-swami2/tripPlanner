const Trip = require('./trip.model');
const { buildQueryFilter, facetPaginate } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');
const { notDeleted } = require('../../shared/utils/notDeleted');

const list = async (query, { publicOnly = false } = {}) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Trip);
  if (publicOnly) match.isEnabled = true;

  const [result] = await Trip.aggregate([
    { $match: match },
    { $sort: sortStage },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'inquiries',
              localField: 'inquiryId',
              foreignField: '_id',
              as: 'inquiry',
            },
          },
          { $unwind: { path: '$inquiry', preserveNullAndEmptyArrays: true } },
        ],
        meta: [{ $count: 'total' }],
      },
    },
    { $project: { data: 1, total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] } } },
  ]);
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const create = async (data) => {
  const payload = { ...data };
  if (data.customerId) payload.inquiryId = data.customerId;
  return Trip.create(payload);
};

const update = async (id, data) => {
  const trip = await Trip.findOneAndUpdate({ _id: id, ...notDeleted }, data, { new: true, runValidators: true });
  if (!trip) throw { status: 404, message: 'Trip not found' };
  return trip;
};

const setEnabled = (id, isEnabled) => update(id, { isEnabled });

const getById = async (id, { publicOnly = false } = {}) => {
  const filter = { _id: id, ...notDeleted };
  if (publicOnly) filter.isEnabled = true;
  const trip = await Trip.findOne(filter).populate('inquiryId');
  if (!trip) throw { status: 404, message: 'Trip not found' };
  return trip;
};

const softDelete = async (id) => {
  const trip = await Trip.findOneAndUpdate({ _id: id, ...notDeleted }, { isDeleted: true, isEnabled: false }, { new: true });
  if (!trip) throw { status: 404, message: 'Trip not found' };
  return trip;
};

module.exports = { list, create, update, setEnabled, getById, softDelete };
