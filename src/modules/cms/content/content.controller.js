const catchAsync = require('../../../shared/utils/catchAsync');
const { sendSuccess } = require('../../../shared/utils/response');
const { resolveFileUrlsDeep } = require('../../../shared/utils/fileUrl');
const service = require('./content.service');

const save = catchAsync(async (req, res, next) => {
  try {
    const content = await service.save(req.body);
    const data = await resolveFileUrlsDeep(req, content);
    sendSuccess(res, 200, 'CMS content saved', [data]);
  } catch (e) {
    next(e);
  }
});

const getBySection = catchAsync(async (req, res, next) => {
  try {
    const content = await service.getBySection(req.params.section, { publicOnly: req.publicCms === true });
    const resolved = await resolveFileUrlsDeep(req, content);
    sendSuccess(res, 200, 'Content fetched', [{ section: resolved.section, content: resolved.data }]);
  } catch (e) {
    next(e);
  }
});

const list = catchAsync(async (req, res) => {
  const items = await service.list();
  const data = await resolveFileUrlsDeep(req, items);
  sendSuccess(res, 200, 'CMS sections fetched', data);
});

module.exports = { save, getBySection, list };
