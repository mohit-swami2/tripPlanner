require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const EmailTemplate = require('../models/EmailTemplate');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tripPlanner');

    // Create Super Admin
    const existingAdmin = await User.findOne({ email: 'mohit@mailinator.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: 'mohit@mailinator.com',
        hashedPassword: '123123123', // Mongoose pre-save hook handles hashing
        role: 'admin',
      });
      console.log('Super Admin seeded successfully!');
    } else {
      console.log('Super Admin already exists.');
    }

    // Create default email template for forgot password
    const existingTemplate = await EmailTemplate.findOne({ slug: 'forgot-password' });
    if (!existingTemplate) {
      await EmailTemplate.create({
        name: 'Forgot Password Template',
        slug: 'forgot-password',
        subject: 'Password Reset Request - Jaipur Tourism',
        description: '<p>Hi {{name}},</p><p>You requested a password reset. Please click <a href="{{resetURL}}">here</a> to reset it.</p>',
        isEnabled: true
      });
      console.log('Forgot Password Template seeded successfully!');
    } else {
      console.log('Email template already exists.');
    }

    // Create default email template for new inquiries
    const existingEnquiryTemplate = await EmailTemplate.findOne({ slug: 'enquiry-email' });
    if (!existingEnquiryTemplate) {
      await EmailTemplate.create({
        name: 'New Enquiry Notification',
        slug: 'enquiry-email',
        subject: 'New Enquiry Received - Jaipur Tourism',
        description: '<p>Hello Admin,</p><p>A new enquiry has been submitted on the website.</p><br/><ul><li><strong>Customer Name:</strong> {{customerName}}</li><li><strong>Contact:</strong> {{contact}}</li><li><strong>Destination Interest:</strong> {{destinationInterest}}</li><li><strong>Travel Dates:</strong> {{travelDates}}</li></ul><br/><p>Please review it in the admin dashboard.</p>',
        isEnabled: true
      });
      console.log('Enquiry Notification Template seeded successfully!');
    } else {
      console.log('Enquiry Notification Template already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAdmin();
