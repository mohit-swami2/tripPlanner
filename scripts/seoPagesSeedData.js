/**
 * SEO pages seed data — mirrors TripPlannerFrontent/src/lib/seo/* content.
 * Run: npm run seed:seo-pages
 */

const UNIVERSAL_FAQS = [
  {
    question: 'How much does a Jaipur tour package cost?',
    answer:
      'TripPlanner Jaipur tour packages start from ₹4,000 per person for a 2-day trip including hotel, breakfast, AC cab, and guided sightseeing.',
  },
  {
    question: 'What is included in a Jaipur tour package?',
    answer:
      'Our standard packages include hotel stay, daily breakfast, AC cab with driver, entry tickets to major forts, and a local guide.',
  },
  {
    question: 'Why book with TripPlanner instead of a local travel agent?',
    answer:
      'Local agencies often add heavy markups. TripPlanner is based in Malviya Nagar, Jaipur — we negotiate direct rates and pass savings to you.',
  },
  {
    question: 'How do I book a Jaipur tour?',
    answer:
      'Fill out our enquiry form at tripplanner.swamimohit.in/travel-inquiry or call 9828854006.',
  },
  {
    question: 'Can I customise my Jaipur itinerary?',
    answer: 'Yes. Every package is fully customisable to your dates, hotel preferences, and group size.',
  },
];

const DEFAULT_LINKS = [
  { href: '/jaipur/jaipur-tour-packages/', anchor: 'Jaipur tour packages starting at ₹4,000' },
  { href: '/jaipur/places-to-visit-in-jaipur/', anchor: 'places to visit in Jaipur' },
  { href: '/travel-inquiry/', anchor: 'enquire about your Jaipur trip' },
];

const INFO_IMAGES = {
  'jaipur-tour-packages': 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=1600',
  'budget-trip-jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600',
  'jaipur-hotels': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600',
  'places-to-visit-in-jaipur': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1600',
  'jaipur-itinerary': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600',
  'best-time-to-visit-jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600',
  'jaipur-honeymoon-packages': 'https://images.unsplash.com/photo-1524492412937-336c9fd4e4f8?q=80&w=1600',
  'rajasthan-tour-packages': 'https://images.unsplash.com/photo-1474487548417-781cb5898fa0?q=80&w=1600',
};

function info(slug, data) {
  return {
    slug,
    category: 'info',
    path: `/jaipur/${slug}/`,
    status: 'published',
    isEnabled: true,
    publishedAt: new Date('2026-01-01'),
    faqs: UNIVERSAL_FAQS,
    internalLinks: DEFAULT_LINKS,
    schemaTypes: ['Product', 'FAQPage', 'BreadcrumbList'],
    image: INFO_IMAGES[slug] ?? '',
    ...data,
  };
}

const BLOG_IMAGES = {
  'jaipur-3-day-itinerary': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800',
  'top-10-places-to-visit-in-jaipur': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800',
  'best-hotels-in-jaipur-under-2000': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
  'delhi-to-jaipur-train-trip': 'https://images.unsplash.com/photo-1474487548417-781cb5898fa0?q=80&w=800',
  'famous-food-in-jaipur': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800',
};

function blog(slug, data) {
  return {
    slug,
    category: 'blog',
    path: `/blog/${slug}/`,
    status: 'published',
    isEnabled: true,
    faqs: [],
    schemaTypes: ['Article', 'BreadcrumbList'],
    image: BLOG_IMAGES[slug] ?? '',
    ...data,
  };
}

const SEO_PAGES_SEED = [
  info('jaipur-tour-packages', {
    metaTitle: 'Jaipur Tour Packages with Hotel 2026 | TripPlanner',
    metaDescription:
      'Jaipur tour packages with hotel, AC cab & guided sightseeing from ₹4,000. Honeymoon, family & group trips. Better value than local agencies. Book now.',
    primaryKeyword: 'jaipur tour packages with hotel',
    h1: 'Jaipur Tour Packages with Hotel — All-Inclusive from ₹4,000',
    intro:
      'Explore the Pink City with curated Jaipur tour packages that include hotels, AC cab, local guides, and fort sightseeing.',
    sections: [
      { title: "What's Included", paragraphs: ['Hotel, breakfast, AC cab, fort entry tickets, and local guide.'] },
      { title: 'Popular Packages', paragraphs: ['Jaipur Express from ₹4,000 · Pink City Classic from ₹6,500 · Royal Rajasthan from ₹9,500'] },
    ],
  }),
  info('budget-trip-jaipur', {
    metaTitle: 'Budget Trip Jaipur – Packages from ₹4,000 | TripPlanner',
    metaDescription: 'Plan a budget trip to Jaipur from ₹4,000. Cheap tour packages with hotels, fort visits & local guides.',
    primaryKeyword: 'budget trip jaipur',
    h1: 'Budget Trip to Jaipur — Packages Starting at ₹4,000',
    intro: 'Experience Jaipur without overspending. Honest prices with no inflated agency markups.',
    sections: [{ title: 'Budget Itinerary', paragraphs: ['2-day plan covering Amber Fort, City Palace, Hawa Mahal, and Nahargarh sunset.'] }],
  }),
  info('jaipur-hotels', {
    metaTitle: 'Jaipur Hotel Booking with Tour Packages | TripPlanner',
    metaDescription: 'Jaipur hotel booking bundled with tour packages from ₹4,000.',
    primaryKeyword: 'jaipur hotel booking',
    h1: 'Jaipur Hotel Booking with Tour Packages',
    intro: 'Book your Jaipur hotel together with a tour package for the best rates.',
    sections: [{ title: 'Hotel + Tour Combos', paragraphs: ['Bundle hotel with sightseeing from ₹4,000.'] }],
    schemaTypes: ['Hotel', 'FAQPage', 'BreadcrumbList'],
  }),
  info('places-to-visit-in-jaipur', {
    metaTitle: 'Places to Visit in Jaipur – Top Attractions | TripPlanner',
    metaDescription: 'Discover the best places to visit in Jaipur — Amber Fort, Hawa Mahal, City Palace & more.',
    primaryKeyword: 'places to visit in jaipur',
    h1: 'Places to Visit in Jaipur — Complete Sightseeing Guide',
    intro: 'Must-visit attractions in the Pink City.',
    sections: [{ title: 'Top Attractions', paragraphs: ['Amber Fort, Hawa Mahal, City Palace, Jantar Mantar, Nahargarh Fort, and more.'] }],
    schemaTypes: ['TouristAttraction', 'FAQPage', 'BreadcrumbList'],
  }),
  info('jaipur-itinerary', {
    metaTitle: 'Jaipur Itinerary 3 Days – Perfect Trip Plan | TripPlanner',
    metaDescription: 'Follow our Jaipur itinerary for 3 days covering forts, bazaars & local food.',
    primaryKeyword: 'jaipur itinerary 3 days',
    h1: 'Jaipur Itinerary for 3 Days — Perfect Trip Plan',
    intro: 'A day-by-day plan for your Jaipur trip.',
    sections: [{ title: '3-Day Plan', paragraphs: ['Day 1: Old City · Day 2: Forts · Day 3: Culture & departure'] }],
    schemaTypes: ['FAQPage', 'BreadcrumbList'],
  }),
  info('best-time-to-visit-jaipur', {
    metaTitle: 'Best Time to Visit Jaipur – Season Guide 2026 | TripPlanner',
    metaDescription: 'Find the best time to visit Jaipur — weather, festivals & crowd tips.',
    primaryKeyword: 'best time to visit jaipur',
    h1: 'Best Time to Visit Jaipur — Month-by-Month Guide',
    intro: 'Peak season, summer, and monsoon travel tips for Jaipur.',
    sections: [{ title: 'Peak Season', paragraphs: ['October to February — pleasant weather at 15–25°C.'] }],
    schemaTypes: ['FAQPage', 'BreadcrumbList'],
  }),
  ...['delhi', 'mumbai', 'gurgaon', 'noida', 'ahmedabad', 'pune', 'bangalore', 'hyderabad'].map((city) => {
    const slug = city === 'delhi' ? 'jaipur-weekend-trip-from-delhi' : `jaipur-trip-from-${city}`;
    const name = city.charAt(0).toUpperCase() + city.slice(1);
    return info(slug, {
      metaTitle: `Jaipur Trip from ${name} – Packages 2026 | TripPlanner`,
      metaDescription: `Jaipur trip from ${name} with packages from ₹4,000. Hotels, sightseeing & transfers included.`,
      primaryKeyword: `jaipur trip from ${city}`,
      h1: `Jaipur Trip from ${name} — Tour Packages`,
      intro: `All-inclusive Jaipur packages for travellers from ${name}, from ₹4,000.`,
      sections: [{ title: 'Trip Plan', paragraphs: [`Custom ${name} to Jaipur packages with hotel, AC cab, and guided tours.`] }],
    });
  }),
  info('jaipur-honeymoon-packages', {
    metaTitle: 'Jaipur Honeymoon Packages – Couples 2026 | TripPlanner',
    metaDescription: 'Romantic Jaipur honeymoon packages from ₹4,000.',
    primaryKeyword: 'jaipur honeymoon package',
    h1: 'Jaipur Honeymoon Packages — Romantic Getaways from ₹4,000',
    intro: 'Heritage hotels, private fort tours, and candlelight dinners.',
    sections: [{ title: 'Romantic Experiences', paragraphs: ['Private tours, heritage stays, rooftop dinners.'] }],
  }),
  info('corporate-trips-jaipur', {
    metaTitle: 'Corporate Trips to Jaipur – Team Outings | TripPlanner',
    metaDescription: 'Corporate trips to Jaipur for team outings and offsites from ₹4,000.',
    primaryKeyword: 'corporate trips to jaipur',
    h1: 'Corporate Trips to Jaipur — Team Outings & Offsites',
    intro: 'Custom corporate packages with team-building activities.',
    sections: [{ title: 'Team Building', paragraphs: ['Fort treasure hunts, pottery workshops, cooking classes.'] }],
  }),
  info('school-trips-jaipur', {
    metaTitle: 'School Trips to Jaipur – Educational Tours | TripPlanner',
    metaDescription: 'School trips to Jaipur with safe transport and educational visits from ₹4,000.',
    primaryKeyword: 'school trips to jaipur',
    h1: 'School Trips to Jaipur — Safe Educational Tours',
    intro: 'Educational tours with safe transport and trained guides.',
    sections: [{ title: 'Educational Value', paragraphs: ['History, architecture, astronomy at Jantar Mantar.'] }],
  }),
  info('rajasthan-tour-packages', {
    metaTitle: 'Rajasthan Tour Packages – Jaipur Pushkar Ajmer | TripPlanner',
    metaDescription: 'Rajasthan tour packages covering Jaipur, Pushkar & Ajmer from ₹4,000.',
    primaryKeyword: 'rajasthan tour packages from jaipur',
    h1: 'Rajasthan Tour Packages — Jaipur, Pushkar & Ajmer',
    intro: 'Multi-city Rajasthan packages beyond Jaipur.',
    sections: [{ title: '4-Day Circuit', paragraphs: ['Jaipur · Pushkar · Ajmer multi-city itinerary.'] }],
  }),
  blog('jaipur-3-day-itinerary', {
    metaTitle: 'Jaipur 3 Day Itinerary – Complete Trip Plan | TripPlanner',
    metaDescription: 'Plan the perfect Jaipur 3 day itinerary with forts, palaces, bazaars & food.',
    primaryKeyword: 'jaipur 3 day itinerary',
    h1: 'Complete 3-Day Jaipur Itinerary',
    excerpt: 'A day-by-day plan covering Amber Fort, City Palace, Hawa Mahal, and bazaars.',
    intro: 'Three days is the sweet spot for Jaipur.',
    sections: [{ title: 'Day by Day', paragraphs: ['Day 1: Old City · Day 2: Forts · Day 3: Culture'] }],
    internalLinks: DEFAULT_LINKS,
    publishedAt: new Date('2026-01-07'),
  }),
  blog('top-10-places-to-visit-in-jaipur', {
    metaTitle: 'Top 10 Places to Visit in Jaipur | TripPlanner',
    metaDescription: 'The top 10 places to visit in Jaipur.',
    primaryKeyword: 'top 10 places to visit in jaipur',
    h1: 'Top 10 Places to Visit in Jaipur',
    excerpt: 'Must-see attractions for first-time visitors.',
    intro: 'The top 10 places you cannot miss.',
    sections: [{ title: 'The List', paragraphs: ['Amber Fort, Hawa Mahal, City Palace, and more.'] }],
    internalLinks: DEFAULT_LINKS,
    publishedAt: new Date('2026-01-10'),
  }),
  blog('best-hotels-in-jaipur-under-2000', {
    metaTitle: 'Best Hotels in Jaipur Under ₹2000 | TripPlanner',
    metaDescription: 'Find the best hotels in Jaipur under ₹2000.',
    primaryKeyword: 'best hotels in jaipur under 2000',
    h1: 'Best Hotels in Jaipur Under ₹2000',
    excerpt: 'Affordable stays with good reviews.',
    intro: 'Budget hotels and bundled packages from ₹4,000.',
    sections: [{ title: 'Tips', paragraphs: ['Malviya Nagar, C-Scheme, and MI Road areas.'] }],
    internalLinks: DEFAULT_LINKS,
    publishedAt: new Date('2026-01-14'),
  }),
  blog('delhi-to-jaipur-train-trip', {
    metaTitle: 'Delhi to Jaipur Train Trip – Complete Guide | TripPlanner',
    metaDescription: 'Plan your Delhi to Jaipur train trip.',
    primaryKeyword: 'delhi to jaipur train trip',
    h1: 'Delhi to Jaipur Train Trip — Complete Guide',
    excerpt: 'Best trains and weekend planning tips.',
    intro: 'Shatabdi Express is the fastest option at 4.5 hours.',
    sections: [{ title: 'Best Trains', paragraphs: ['Shatabdi Express (12015) from New Delhi.'] }],
    internalLinks: DEFAULT_LINKS,
    publishedAt: new Date('2026-01-17'),
  }),
  blog('famous-food-in-jaipur', {
    metaTitle: 'Famous Food in Jaipur – What to Eat | TripPlanner',
    metaDescription: 'Discover famous food in Jaipur.',
    primaryKeyword: 'famous food in jaipur',
    h1: 'Famous Food in Jaipur — What to Eat',
    excerpt: "Rajasthani dishes and where to find them.",
    intro: 'Dal baati, ghevar, pyaaz kachori, and more.',
    sections: [{ title: 'Must-Try', paragraphs: ['LMB, Rawat Mishthan Bhandar, Chokhi Dhani.'] }],
    internalLinks: DEFAULT_LINKS,
    publishedAt: new Date('2026-01-21'),
  }),
  {
    slug: 'about',
    category: 'about',
    path: '/about/',
    status: 'published',
    isEnabled: true,
    publishedAt: new Date('2026-01-01'),
    metaTitle: 'Jaipur Tour Operator in Malviya Nagar | TripPlanner',
    metaDescription: 'TripPlanner is a trusted Jaipur tour operator in Malviya Nagar.',
    primaryKeyword: 'jaipur tour operator near me',
    h1: 'Your Trusted Jaipur Tour Operator in Malviya Nagar',
    intro: 'Jaipur-based travel agency with honest, all-inclusive pricing.',
    sections: [
      { title: 'Our Story', paragraphs: ['Based in Malviya Nagar, Jaipur. Direct hotel and transport rates.'] },
      { title: 'Contact', paragraphs: ['Phone: +91 9828854006 · tripplanner.swamimohit.in'] },
    ],
    faqs: UNIVERSAL_FAQS,
    internalLinks: DEFAULT_LINKS,
    schemaTypes: ['TravelAgency', 'FAQPage', 'BreadcrumbList'],
  },
];

module.exports = { SEO_PAGES_SEED };
