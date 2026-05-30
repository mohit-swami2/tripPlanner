const catchAsync = require('../../shared/utils/catchAsync');
const { sendSuccess } = require('../../shared/utils/response');
const contactService = require('./contactUs.service');

const list = catchAsync(async (req, res) => {
  const result = await contactService.list(req.query);
  const { data, ...extras } = result;
  sendSuccess(res, 200, 'Contacts fetched', data, extras);
});

const submit = catchAsync(async (req, res, next) => {
  try {
    await contactService.submit(req.body);
    sendSuccess(res, 201, 'Message sent successfully', []);
  } catch (e) {
    next(e);
  }
});

const remove = catchAsync(async (req, res, next) => {
  try {
    await contactService.softDelete(req.params.id);
    sendSuccess(res, 200, 'Contact deleted', []);
  } catch (e) {
    next(e);
  }
});

module.exports = { list, submit, remove };
