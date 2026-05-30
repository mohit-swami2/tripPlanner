const Payment = require('./payment.model');
const Trip = require('../trip/trip.model');
const { buildQueryFilter, facetPaginate } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');

const list = async (query) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Payment);
  const [result] = await Payment.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const create = async (data) => {
  const trip = await Trip.findOne({ _id: data.tripId, isDeleted: false });
  if (!trip) throw { status: 404, message: 'Trip not found' };

  const payment = await Payment.create(data);
  trip.paidAmount = (trip.paidAmount || 0) + data.amount;
  trip.pendingDues = Math.max(0, trip.totalCost - trip.paidAmount);
  await trip.save();
  return payment;
};

const listByTrip = (tripId) =>
  Payment.find({ tripId, isDeleted: false }).sort({ createdAt: -1 });

module.exports = { list, create, listByTrip };
