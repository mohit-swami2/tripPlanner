const Itinerary = require('./itinerary.model');
const Trip = require('../trip/trip.model');

const create = async ({ tripId, days }) => {
  const trip = await Trip.findOne({ _id: tripId, isDeleted: false });
  if (!trip) throw { status: 404, message: 'Trip not found' };

  const existing = await Itinerary.findOne({ tripId, isDeleted: false });
  if (existing) {
    existing.days = days;
    await existing.save();
    return existing;
  }
  return Itinerary.create({ tripId, days });
};

const getByTrip = async (tripId) => {
  const itinerary = await Itinerary.findOne({ tripId, isDeleted: false });
  if (!itinerary) throw { status: 404, message: 'Itinerary not found' };
  return itinerary;
};

module.exports = { create, getByTrip };
