const inquiryService = require('../../services/inquiry.service');

const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({
      status: 'success',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry
};
