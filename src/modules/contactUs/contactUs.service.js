const ContactUs = require('./contactUs.model');
const Admin = require('../admin/admin.model');
const EmailTemplate = require('../cms/emailTemplate/emailTemplate.model');
const { buildQueryFilter, facetPaginate } = require('../../shared/utils/queryBuilder');
const { getPaginationOptions, buildPaginationExtras } = require('../../shared/utils/pagination');
const { sendMail } = require('../../shared/utils/mailer');
const { replacePlaceholders } = require('../../shared/utils/emailTemplate');

const list = async (query) => {
  const { page, limit, sortBy, sortOrder, skip, sortStage } = getPaginationOptions(query);
  const match = buildQueryFilter(query, ContactUs);
  const [result] = await ContactUs.aggregate(facetPaginate({ match, sortStage, skip, limit }));
  const total = result?.total || 0;
  return { data: result?.data || [], ...buildPaginationExtras({ page, limit, sortBy, sortOrder, total }) };
};

const submit = async (data) => {
  const contact = await ContactUs.create(data);
  notifyAdmin(contact).catch(console.error);
  return contact;
};

const notifyAdmin = async (contact) => {
  const template = await EmailTemplate.findOne({ slug: 'contact-us-email', isDeleted: false });
  const admin = await Admin.findOne({ isDeleted: false });
  if (!template?.isEnabled || !admin) return;
  const html = replacePlaceholders(template.description, {
    name: contact.name,
    email: contact.email,
    message: contact.message,
  });
  await sendMail({ to: process.env.ADMIN_EMAIL || admin.email, subject: template.subject, html });
};

const softDelete = async (id) => {
  const item = await ContactUs.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!item) throw { status: 404, message: 'Contact not found' };
  return item;
};

module.exports = { list, submit, softDelete };
