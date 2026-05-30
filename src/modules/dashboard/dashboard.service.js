const Inquiry = require('../inquiry/inquiry.model');
const Trip = require('../trip/trip.model');
const Payment = require('../payment/payment.model');
const Package = require('../package/package.model');
const Contact = require('../contactUs/contactUs.model');

const getOverview = async (query = {}) => {
  const dateFilter = {};
  if (query.from || query.to) {
    dateFilter.createdAt = {};
    if (query.from) dateFilter.createdAt.$gte = new Date(query.from);
    if (query.to) dateFilter.createdAt.$lte = new Date(query.to);
  }

  const base = { isDeleted: false, ...dateFilter };

  const [inquiries, bookings, revenueAgg, packages, contacts] = await Promise.all([
    Inquiry.countDocuments({ ...base }),
    Trip.countDocuments({ ...base, status: { $in: ['Confirmed', 'In Progress', 'Completed'] } }),
    Payment.aggregate([
      { $match: { ...base } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Package.countDocuments({ isDeleted: false, status: 'active' }),
    Contact.countDocuments({ ...base }),
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  const inquiryByStatus = await Inquiry.aggregate([
    { $match: base },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return {
    stats: {
      inquiries,
      bookings,
      activePackages: packages,
      contacts,
    },
    revenue,
    inquiryByStatus,
  };
};

module.exports = { getOverview };
