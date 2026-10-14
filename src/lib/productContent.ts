export type FeatureCard = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export type JourneyStep = {
  title: string;
  description: string;
};

export type WorkflowStage = {
  title: string;
  description: string;
  items: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const platformFeatureCards: FeatureCard[] = [
  {
    eyebrow: 'Discovery',
    title: 'Browse live car listings',
    description:
      'Search the catalogue by make, model, or location and narrow options by budget before you choose a ride.',
    href: '/cars',
    cta: 'Browse cars',
  },
  {
    eyebrow: 'Car detail',
    title: 'Review every listing in full',
    description:
      'Open a car page to inspect photos, pricing, location, year, and description before you book.',
    href: '/cars',
    cta: 'View listings',
  },
  {
    eyebrow: 'Booking',
    title: 'Book trips with price estimates',
    description:
      'Choose your dates, see the estimated total instantly, and create a booking from the listing page.',
    href: '/cars',
    cta: 'Start booking',
  },
  {
    eyebrow: 'Accounts',
    title: 'Sign up, log in, and restore sessions',
    description:
      'Create an account, authenticate with JWT, and return to the app with your session restored automatically.',
    href: '/signup',
    cta: 'Create account',
  },
  {
    eyebrow: 'Hosting',
    title: 'Publish and manage your own cars',
    description:
      'Add a listing with make, model, year, daily price, location, description, and a photo upload.',
    href: '/dashboard/add-car',
    cta: 'List your car',
  },
  {
    eyebrow: 'Dashboards',
    title: 'Track trips as rider or host',
    description:
      'Use the bookings workspace to switch between rides you booked and bookings made on your cars.',
    href: '/dashboard/bookings',
    cta: 'Open bookings',
  },
];

export const riderJourney: JourneyStep[] = [
  {
    title: 'Create your account',
    description:
      'Sign up or log in, then land in the rider-ready app with protected actions unlocked.',
  },
  {
    title: 'Search the live catalogue',
    description:
      'Browse featured vehicles on the homepage or open the full cars page to filter by search term and budget.',
  },
  {
    title: 'Open the listing that fits',
    description:
      'Inspect the car detail page, review the daily rate, and confirm the location and description.',
  },
  {
    title: 'Book and manage your trip',
    description:
      'Submit your dates, see the total price, and review your trips later from the bookings dashboard.',
  },
];

export const hostJourney: JourneyStep[] = [
  {
    title: 'Start from the host flow',
    description:
      'Use the host pages or list-car route to enter the host onboarding path and create an account if needed.',
  },
  {
    title: 'Create a complete listing',
    description:
      'Publish a car with pricing, year, location, description, availability, and a required vehicle photo.',
  },
  {
    title: 'Manage your garage',
    description:
      'Review every car you own from the host dashboard and keep your inventory in one place.',
  },
  {
    title: 'Track bookings on your cars',
    description:
      'Switch the bookings page into host mode to see reservation activity across your vehicles.',
  },
];

export const hostFeatureCards: FeatureCard[] = [
  {
    eyebrow: 'Listing builder',
    title: 'Create rich car listings',
    description:
      'Add the exact details renters need: make, model, year, price per day, location, description, and photos.',
    href: '/dashboard/add-car',
    cta: 'Create a listing',
  },
  {
    eyebrow: 'Garage',
    title: 'Manage your inventory',
    description:
      'Your garage page shows all cars you own so you can keep track of what is live on Izzac.',
    href: '/dashboard',
    cta: 'Open garage',
  },
  {
    eyebrow: 'Bookings',
    title: 'View host-side demand',
    description:
      'The bookings workspace includes a host toggle so you can review reservations on your cars in one view.',
    href: '/dashboard/bookings',
    cta: 'Check host bookings',
  },
  {
    eyebrow: 'Dual role',
    title: 'Use one account for both sides',
    description:
      'The same user account can browse, book rides, list cars, and monitor host activity across the app.',
    href: '/dashboard/rider',
    cta: 'See rider tools',
  },
];

export const hostWorkflow: WorkflowStage[] = [
  {
    title: 'Before you publish',
    description:
      'Use the host entry pages to understand exactly what a successful Izzac listing needs.',
    items: [
      'Create an account or log in before protected actions',
      'Prepare a clear car photo and pricing plan',
      'Gather model, year, location, and listing copy',
    ],
  },
  {
    title: 'When your listing goes live',
    description:
      'Your car enters the same catalogue riders browse on the homepage and cars pages.',
    items: [
      'Riders can discover your car from featured and full listings',
      'Each car gets its own detail page with booking form',
      'Media and listing details are surfaced across the app',
    ],
  },
  {
    title: 'After bookings start',
    description:
      'Host tools make it easy to keep an eye on both your inventory and incoming reservation activity.',
    items: [
      'Review owned vehicles inside your garage',
      'Switch bookings into host mode to monitor reservations',
      'Use the same account to book rides when you need them',
    ],
  },
];

export const hostFaqs: FaqItem[] = [
  {
    question: 'Do I need an account before listing a car?',
    answer:
      'You can explore the host pages without signing in, but publishing a listing and opening host dashboards requires authentication.',
  },
  {
    question: 'What information does a host listing include?',
    answer:
      'Every listing captures make, model, year, daily price, location, description, availability, and an uploaded vehicle image.',
  },
  {
    question: 'Where do I manage the cars I own?',
    answer:
      'Your garage dashboard is the main place to review the cars attached to your account after they are published.',
  },
  {
    question: 'How do I see bookings made on my cars?',
    answer:
      'Open the bookings page and switch to the host view to see reservation activity across your listings.',
  },
  {
    question: 'Can I be both a rider and a host?',
    answer:
      'Yes. One account can browse cars, create bookings, publish listings, and monitor host-side bookings.',
  },
];
