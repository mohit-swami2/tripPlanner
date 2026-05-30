const Invoice = require('./invoice.model');
const Trip = require('../trip/trip.model');
const Payment = require('../payment/payment.model');

const generateForTrip = async (tripId, baseUrl) => {
  const trip = await Trip.findOne({ _id: tripId, isDeleted: false });
  if (!trip) throw { status: 404, message: 'Trip not found' };

  const payments = await Payment.find({ tripId, isDeleted: false });
  const lineItems = [
    { description: 'Trip Total', amount: trip.totalCost },
    ...payments.map((p) => ({ description: `${p.type} Payment (${p.code})`, amount: p.amount })),
  ];

  let invoice = await Invoice.findOne({ tripId, isDeleted: false });
  const payload = {
    tripId,
    lineItems,
    totalAmount: trip.totalCost,
    paidAmount: trip.paidAmount,
    pendingDues: trip.pendingDues,
    pdfUrl: `${baseUrl}/public/invoices/${trip.code}.pdf`,
  };

  if (invoice) {
    Object.assign(invoice, payload);
    await invoice.save();
  } else {
    invoice = await Invoice.create(payload);
  }
  return invoice;
};

module.exports = { generateForTrip };
