const inquiryService = require('../../services/inquiry.service');

const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await inquiryService.getInquiries();
    res.status(200).json({
      status: 'success',
      results: inquiries.length,
      data: { inquiries }
    });
  } catch (error) {
    next(error);
  }
};

const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiry = await inquiryService.updateInquiryStatus(id, status);
    
    res.status(200).json({
      status: 'success',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInquiries,
  updateInquiryStatus
};
