const DEFAULTS = {
  siteName: 'TripPlanner',
  tagline: 'Discover the Pink City',
  contactEmail: 'info@tripplanner.swamimohit.in',
  contactPhone: '+91 9828854006',
  address: 'TripPlanner, Malviya Nagar, Jaipur, Rajasthan 302017, India',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  defaultMetaTitle: 'Jaipur Tour Packages 2026 – Best Deals | TripPlanner',
  defaultMetaDescription:
    'Book Jaipur tour packages from ₹4,000 with hotels, sightseeing & guides. Malviya Nagar agency with honest pricing.',
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
