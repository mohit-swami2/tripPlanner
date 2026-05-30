const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const dashboardService = require('./dashboard.service');

const overview = catchAsync(async (req, res) => {
  const data = await dashboardService.getOverview(req.query);
  sendSuccess(res, 200, 'Dashboard stats', [data]);
});

module.exports = { overview };
