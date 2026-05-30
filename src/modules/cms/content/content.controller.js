const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const service = require('./content.service');

const save = catchAsync(async (req, res, next) => {
  try {
    const content = await service.save(req.body);
    sendSuccess(res, 200, 'CMS content saved', [content]);
  } catch (e) {
    next(e);
  }
});

const getBySection = catchAsync(async (req, res, next) => {
  try {
    const content = await service.getBySection(req.params.section, { publicOnly: req.publicCms === true });
    sendSuccess(res, 200, 'Content fetched', [{ section: content.section, content: content.data }]);
  } catch (e) {
    next(e);
  }
});

const list = catchAsync(async (_req, res) => {
  const items = await service.list();
  sendSuccess(res, 200, 'CMS sections fetched', items);
});

module.exports = { save, getBySection, list };
