const DEFAULTS = {
  siteName: 'Jaipur Tourism',
  tagline: 'Discover the Pink City',
  contactEmail: 'hello@jaipurtourism.com',
  contactPhone: '+91 98765 43210',
  address: 'Jaipur, Rajasthan, India',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  defaultMetaTitle: 'Jaipur Tourism — Plan Your Royal Getaway',
  defaultMetaDescription:
    'Book curated heritage, adventure, and cultural experiences in Jaipur.',
  logo: '',
  favicon: '',
};

/** Only these fields are stored/returned — avoids mixing with other document data. */
const SETTINGS_FIELDS = [
  'siteName',
  'tagline',
  'contactEmail',
  'contactPhone',
  'address',
  'facebookUrl',
  'instagramUrl',
  'twitterUrl',
  'defaultMetaTitle',
  'defaultMetaDescription',
  'logo',
  'favicon',
];

/** S3 object keys only — presigned on GET, stored as keys on save. */
const S3_IMAGE_FIELDS = ['logo', 'favicon'];

module.exports = { DEFAULTS, SETTINGS_FIELDS, S3_IMAGE_FIELDS };
