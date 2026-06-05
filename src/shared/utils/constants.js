const INQUIRY_STATUS = ['PENDING', 'DONE'];
const TRIP_STATUS = ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
const PAYMENT_TYPE = ['Token', 'Full', 'Partial'];
const VENDOR_TYPE = ['Hotel', 'Vehicle', 'Restaurant', 'Guide', 'Other'];
const PACKAGE_STATUS = ['active', 'inactive', 'draft'];
const CMS_SECTIONS = ['FAQ', 'About Us', 'Hero Section', 'Terms', 'Privacy'];
const SEO_PAGE_CATEGORY = ['jaipur', 'blog', 'about'];
const SEO_PAGE_STATUS = ['draft', 'published'];

module.exports = {
  INQUIRY_STATUS,
  TRIP_STATUS,
  PAYMENT_TYPE,
  VENDOR_TYPE,
  PACKAGE_STATUS,
  CMS_SECTIONS,
  SEO_PAGE_CATEGORY,
  SEO_PAGE_STATUS,
  CODE_PREFIX: {
    INQUIRY: 'INQ',
    VENDOR: 'VEN',
    TRIP: 'TRP',
    PACKAGE: 'PKG',
    PAYMENT: 'PAY',
    INVOICE: 'INV',
    CONTACT: 'CNT',
  },
};
