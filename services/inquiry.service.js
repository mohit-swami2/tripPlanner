const Inquiry = require('../models/Inquiry');
const AppError = require('../utils/AppError');
const EmailTemplate = require('../models/EmailTemplate');
const { sendEmail } = require('./email.service');
const User = require('../models/User');

const createInquiry = async (data) => {
  try {
    const inquiry = await Inquiry.create(data);

    // Send notification to Admin asynchronously without awaiting it to block the response
    (async () => {
      try {
        const template = await EmailTemplate.findOne({ slug: 'enquiry-email' });
        const adminUser = await User.findOne({ role: 'admin' }); // Fetch the main admin

        if (template && template.isEnabled && adminUser) {
          let html = template.description
            .replace('{{customerName}}', inquiry.customerName)
            .replace('{{contact}}', inquiry.contact)
            .replace('{{destinationInterest}}', inquiry.destinationInterest)
            .replace('{{travelDates}}', new Date(inquiry.travelDates).toLocaleDateString());

          await sendEmail({
            to: adminUser.email,
            subject: template.subject,
            html
          });
        }
      } catch (err) {
        console.error('Failed to send admin enquiry notification:', err);
      }
    })();

    return inquiry;
  } catch (error) {
    throw new AppError('Failed to create inquiry', 500);
  }
};

const updateInquiryStatus = async (id, status) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }
    return inquiry;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update inquiry status', 500);
  }
};

const getInquiries = async () => {
  return Inquiry.find().sort({ createdAt: -1 });
};

module.exports = {
  createInquiry,
  updateInquiryStatus,
  getInquiries
};
