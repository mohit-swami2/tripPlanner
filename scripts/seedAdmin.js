require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../src/modules/admin/admin.model');
const EmailTemplate = require('../src/modules/cms/emailTemplate/emailTemplate.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: 'mohit@mailinator.com' });
  if (!existing) {
    await Admin.create({
      name: 'Super Admin',
      email: 'mohit@mailinator.com',
      hashedPassword: '123123123',
    });
    console.log('Super Admin seeded');
  }

  const templates = [
    {
      name: 'Forgot Password',
      slug: 'forgot-password',
      subject: 'Password Reset - TripPlanner',
      description: '<p>Hi {{name}},</p><p>Reset your password: <a href="{{resetURL}}">Click here</a></p>',
    },
    {
      name: 'New Enquiry',
      slug: 'enquiry-email',
      subject: 'New Trip Inquiry - TripPlanner',
      description:
        '<p>New inquiry {{inquiryCode}}</p><ul><li>{{customerName}}</li><li>{{contact}}</li><li>{{destinationInterest}}</li><li>{{travelDates}}</li></ul>',
    },
    {
      name: 'Contact Us',
      slug: 'contact-us-email',
      subject: 'New Contact Message - TripPlanner',
      description: '<p>From {{name}} ({{email}})</p><p>{{message}}</p>',
    },
  ];

  for (const t of templates) {
    const exists = await EmailTemplate.findOne({ slug: t.slug });
    if (!exists) {
      await EmailTemplate.create({ ...t, isEnabled: true });
      console.log(`Template ${t.slug} seeded`);
    }
  }

  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
