const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const { resolveFileUrlsDeep } = require('../../shared/utils/fileUrl');
const seoPageService = require('./seoPage.service');

const withResolved = async (req, data) => resolveFileUrlsDeep(req, data);

const list = catchAsync(async (req, res) => {
  const publicOnly = req.publicSeoPages === true;
  const result = await seoPageService.list(req.query, { publicOnly });
  const data = await withResolved(req, result.data);
  const { data: _d, ...extras } = result;
  sendSuccess(res, 200, 'SEO pages fetched', data, extras);
});

const getOne = catchAsync(async (req, res, next) => {
  try {
    const data = await withResolved(req, await seoPageService.getById(req.params.id));
    sendSuccess(res, 200, 'SEO page fetched', [data]);
  } catch (e) {
    next(e);
  }
});

const getBySlug = catchAsync(async (req, res, next) => {
  try {
    const data = await withResolved(
      req,
      await seoPageService.getBySlug(req.params.category, req.params.slug, {
        publicOnly: req.publicSeoPages === true,
      })
    );
    sendSuccess(res, 200, 'SEO page fetched', [data]);
  } catch (e) {
    next(e);
  }
});

const create = catchAsync(async (req, res, next) => {
  try {
    const page = await seoPageService.create(req.body);
    const data = await withResolved(req, page);
    sendSuccess(res, 201, 'SEO page created', [data]);
  } catch (e) {
    next(e);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    if (!Object.keys(req.body || {}).length) {
      return next({ status: 400, message: 'No fields to update' });
    }
    const page = await seoPageService.update(req.params.id, req.body);
    const data = await withResolved(req, page);
    sendSuccess(res, 200, 'SEO page updated', [data]);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await seoPageService.softDelete(req.params.id);
    sendSuccess(res, 200, 'SEO page deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, getOne, getBySlug, create, update, remove };
