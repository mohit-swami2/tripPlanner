const Inquiry = require('./inquiry.model');
const Admin = require('../admin/admin.model');
const EmailTemplate = require('../cms/emailTemplate/emailTemplate.model');
const { buildQueryFilter, facetPaginate } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');
const { sendMail } = require('../../shared/utils/mailer');
const { replacePlaceholders } = require('../../shared/utils/emailTemplate');
const { notDeleted } = require('../../shared/utils/notDeleted');

const list = async (query) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, Inquiry);
  const [result] = await Inquiry.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const create = async (data) => {
  const inquiry = await Inquiry.create({ ...data, status: 'PENDING' });
  notifyAdmin(inquiry).catch(console.error);
  return inquiry;
};

const notifyAdmin = async (inquiry) => {
  const template = await EmailTemplate.findOne({ slug: 'enquiry-email', ...notDeleted });
  const admin = await Admin.findOne({ ...notDeleted });
  if (!template?.isEnabled || !admin) return;
  const html = replacePlaceholders(template.description, {
    customerName: inquiry.customerName,
    contact: inquiry.contact,
    destinationInterest: inquiry.destinationInterest,
    travelDates: new Date(inquiry.travelDates).toLocaleDateString(),
    inquiryCode: inquiry.code,
  });
  await sendMail({ to: process.env.ADMIN_EMAIL || admin.email, subject: template.subject, html });
};

const update = async (id, data) => {
  const inquiry = await Inquiry.findOneAndUpdate({ _id: id, ...notDeleted }, data, {
    new: true,
    runValidators: true,
  });
  if (!inquiry) throw { status: 404, message: 'Inquiry not found' };
  return inquiry;
};

const updateStatus = (id, status) => update(id, { status });

const getById = async (id) => {
  const inquiry = await Inquiry.findOne({ _id: id, ...notDeleted });
  if (!inquiry) throw { status: 404, message: 'Inquiry not found' };
  return inquiry;
};

const softDelete = async (id) => {
  const inquiry = await Inquiry.findOneAndUpdate({ _id: id, ...notDeleted }, { isDeleted: true }, { new: true });
  if (!inquiry) throw { status: 404, message: 'Inquiry not found' };
  return inquiry;
};

module.exports = { list, create, update, updateStatus, getById, softDelete };
