const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const invoiceService = require('./invoice.service');

const getByTrip = catchAsync(async (req, res, next) => {
  try {
    const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const invoice = await invoiceService.generateForTrip(req.params.tripId, base);
    sendSuccess(res, 200, 'Invoice generated', [
      { pdfUrl: invoice.pdfUrl, invoiceNo: invoice.invoiceNo, invoice },
    ]);
  } catch (e) {
    next(e);
  }
});

module.exports = { getByTrip };
