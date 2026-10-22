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

export type ServiceTypeCode =
  | "self_drive"
  | "chauffeur"
  | "airport_transfer"
  | "corporate_flex";

export type PickupModeCode =
  | "hub_station"
  | "airport_desk"
  | "doorstep_delivery"
  | "intercity_one_way";

export type ProtectionPlanCode = "basic" | "medium" | "premium";

export type AddonCode =
  | "security_escort"
  | "prepaid_fuel"
  | "wifi_hotspot"
  | "interstate_pass"
  | "extra_driver"
  | "child_seat";

export type ServicePillar = {
  code: ServiceTypeCode | "commercial_shuttle" | "host_marketplace";
  eyebrow: string;
  title: string;
  subtitle: string;
  dailySurchargeNgn: number;
  priceTag: string;
  description: string;
  highlights: string[];
  europcarUpgradeNote: string;
  href: string;
  cta: string;
};

export type ProtectionPlanOption = {
  code: ProtectionPlanCode;
  name: string;
  badge: string;
  dailyRateNgn: number;
  summary: string;
  coverageItems: string[];
};

export type PickupModeOption = {
  code: PickupModeCode;
  name: string;
  flatFeeNgn: number;
  description: string;
};

export type BookingAddonOption = {
  code: AddonCode;
  name: string;
  badge: string;
  billing: "daily" | "flat";
  amountNgn: number;
  description: string;
};

export type CompetitorBenchmarkRow = {
  capability: string;
  izzacAdvantage: string;
  europcarStandard: string;
  africanMarketImpact: string;
};

export type RegionalHub = {
  city: string;
  country: string;
  airportCode: string;
  airportName: string;
  corridors: string;
  servicesAvailable: string[];
};

export type PrivilegeTier = {
  tier: string;
  threshold: string;
  discount: string;
  perks: string[];
};

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    code: "chauffeur",
    eyebrow: "01 · Executive Chauffeur & Convoy",
    title: "Chauffeur-Driven Mobility & Security Protocol",
    subtitle: "Nigeria's #1 preferred executive transit mode",
    dailySurchargeNgn: 25000,
    priceTag: "+₦25,000 /day",
    description:
      "Every listing can be booked with a vetted, uniformed corporate chauffeur trained in defensive driving, Lagos Island/Mainland traffic routing, and Abuja diplomatic protocol.",
    highlights: [
      "12-hour daily shift with English & local-language speaking corporate driver",
      "Optional armed Mobile Police (MOPOL) or unarmed protocol escort detail",
      "Zero driver liability for renter in dense urban traffic or checkpoints",
    ],
    europcarUpgradeNote:
      "Improves on Europcar's European self-drive default by making vetted chauffeur-drive a first-class, instant-book toggle on every vehicle.",
    href: "/cars?service=Chauffeur+%26+Protocol",
    cta: "Browse chauffeur fleet",
  },
  {
    code: "self_drive",
    eyebrow: "02 · Instant Digital Self-Drive",
    title: "Verified Self-Drive (NIN & FRSC Fast-Track)",
    subtitle: "Paperless handover in gated hubs & estates",
    dailySurchargeNgn: 0,
    priceTag: "Included in base rate",
    description:
      "Prefer the wheel yourself? Complete one-time NIN and FRSC driver's license verification online and unlock paperless pickup with zero airport counter queues.",
    highlights: [
      "Digital pre-trip inspection ledger with timestamped photo telemetry",
      "Flexible daily, weekly (-10%), and monthly (-22%) self-drive rates",
      "Available across Victoria Island, Lekki, Ikeja GRA, Maitama, and Wuse II",
    ],
    europcarUpgradeNote:
      "Replaces Europcar's physical credit-card deposit blocks and slow counter paperwork with instant Nigerian NIN/BVN & digital escrow verification.",
    href: "/cars?service=Verified+Self-Drive",
    cta: "Book self-drive",
  },
  {
    code: "airport_transfer",
    eyebrow: "03 · Aviation Meet & Greet",
    title: "Airport VIP Protocol & Curbside Transfers",
    subtitle: "LOS · ABV · PHC · KAN · ACC · NBO",
    dailySurchargeNgn: 30000,
    priceTag: "+₦30,000 /day or Terminal Pickup",
    description:
      "Seamless arrival and departure logistics across Murtala Muhammed Int'l (LOS), Nnamdi Azikiwe Int'l (ABV), and Port Harcourt (PHC) with real-time flight tracking.",
    highlights: [
      "Chauffeur or handover agent waiting at arrivals with name-board & cold refreshments",
      "Automatic delay adjustment for British Airways, Air Peace, Virgin, Qatar & Delta flights",
      "Optional VIP lounge fast-track & luggage protocol assistance",
    ],
    europcarUpgradeNote:
      "Eliminates the trek to remote rental car lots in tropical heat or rain—your chilled vehicle meets you directly at the terminal exit.",
    href: "/cars?service=Airport+VIP+Transfer",
    cta: "Schedule airport pickup",
  },
  {
    code: "corporate_flex",
    eyebrow: "04 · B2B & Monthly Subscriptions",
    title: "Izzac SuperFlex Monthly & Corporate Fleet",
    subtitle: "1–24 month asset-light leasing without auto-loan debt",
    dailySurchargeNgn: 15000,
    priceTag: "Save 10% Weekly · 22% Monthly",
    description:
      "Built for multinationals, oil & gas operators, fintechs, embassies, and diaspora returnees who need multi-week or monthly vehicles with full maintenance included.",
    highlights: [
      "Automatic 10% Weekly Saver (7+ days) & 22% Monthly SuperFlex (30+ days) discounts",
      "Guaranteed 2-hour replacement vehicle in Lagos, Abuja & Port Harcourt if servicing is needed",
      "Consolidated NGN/USD VAT invoicing, corporate LPO billing, and Paystack/wire settlement",
    ],
    europcarUpgradeNote:
      "Outperforms Europcar's rigid 12–36 month corporate leases with instant online monthly subscriptions and 2-hour local replacement SLAs.",
    href: "/cars?service=Corporate+SuperFlex",
    cta: "Explore SuperFlex fleet",
  },
  {
    code: "commercial_shuttle",
    eyebrow: "05 · Commercial, Field 4x4 & Shuttles",
    title: "Hilux 4x4 Pickups, Escort Units & Executive Vans",
    subtitle: "Engineered for interstate corridors & project logistics",
    dailySurchargeNgn: 0,
    priceTag: "From ₦130,000 /day",
    description:
      "Instead of generic European box vans unsuited to African highways, Izzac deploys high-clearance 4x4 double-cab pickups and luxury executive vans.",
    highlights: [
      "Toyota Hilux Adventure 4x4 & Ford Ranger Wildtrak Bi-Turbo for field & escort duty",
      "Mercedes-Benz V250d Avantgarde 7-seater lounge vans for board roadshows & delegations",
      "Pre-cleared Interstate Corridor Pass with nationwide AA Rescue breakdown cover",
    ],
    europcarUpgradeNote:
      "Replaces European light Luton vans with heavy-duty 4x4 turbo-diesel pickups and executive shuttles built for Nigerian interstate terrain.",
    href: "/cars?category=Pickup+%26+Shuttle",
    cta: "View pickups & shuttles",
  },
  {
    code: "host_marketplace",
    eyebrow: "06 · Dual-Role Fleet Marketplace",
    title: "Host & Commercial Partner Fleet Monetization",
    subtitle: "Turn idle vehicles into high-yield NGN/USD cashflow",
    dailySurchargeNgn: 0,
    priceTag: "Earn ₦1.2M–₦4.5M /mo",
    description:
      "Unlike Europcar's closed franchise inventory, Izzac empowers verified Nigerian car owners and fleet operators to list vehicles and manage bookings from one account.",
    highlights: [
      "List as Chauffeur-Only (your driver or Izzac's) or Verified Self-Drive",
      "Direct garage & reservation workspace with instant host/rider view switching",
      "Protected against inflation with dynamic daily pricing and corporate demand",
    ],
    europcarUpgradeNote:
      "Combines enterprise rental reliability with decentralized P2P supply so riders get newer trims and hosts build recurring wealth.",
    href: "/host",
    cta: "Explore host tools",
  },
];

export const SERVICE_TYPE_OPTIONS: {
  code: ServiceTypeCode;
  label: string;
  shortLabel: string;
  dailyRateNgn: number;
  description: string;
}[] = [
  {
    code: "self_drive",
    label: "Verified Self-Drive (NIN / FRSC)",
    shortLabel: "Self-Drive",
    dailyRateNgn: 0,
    description: "Drive yourself after instant digital license & NIN verification.",
  },
  {
    code: "chauffeur",
    label: "Chauffeur-Driven (Pro Executive Driver)",
    shortLabel: "Chauffeur-Driven",
    dailyRateNgn: 25000,
    description: "Uniformed, route-certified corporate chauffeur (12 hrs/day).",
  },
  {
    code: "airport_transfer",
    label: "Airport VIP Meet & Greet + Chauffeur",
    shortLabel: "Airport VIP",
    dailyRateNgn: 30000,
    description: "Flight-tracked terminal curbside pickup + executive driver.",
  },
  {
    code: "corporate_flex",
    label: "Corporate Fleet / SuperFlex Priority",
    shortLabel: "Corporate Flex",
    dailyRateNgn: 15000,
    description: "Includes VAT/LPO corporate invoice & 2-hr standby relief car SLA.",
  },
];

export const PICKUP_MODE_OPTIONS: PickupModeOption[] = [
  {
    code: "hub_station",
    name: "Izzac City Hub / Station Pickup",
    flatFeeNgn: 0,
    description: "Collect at VI, Lekki Phase 1, Ikeja GRA, Maitama, Wuse II, or PH GRA hub.",
  },
  {
    code: "airport_desk",
    name: "Airport Terminal Curbside Meet & Greet",
    flatFeeNgn: 15000,
    description: "MMIA Lagos (LOS), Nnamdi Azikiwe Abuja (ABV), PH (PHC), or Kano (KAN).",
  },
  {
    code: "doorstep_delivery",
    name: "Doorstep, Hotel or Office Delivery",
    flatFeeNgn: 20000,
    description: "Delivered directly to Eko Hotel, Transcorp Hilton, home, or office.",
  },
  {
    code: "intercity_one_way",
    name: "Inter-City One-Way Corridor Drop-Off",
    flatFeeNgn: 45000,
    description: "Pick up in one city hub and return at another Izzac regional station.",
  },
];

export const PROTECTION_PLAN_OPTIONS: ProtectionPlanOption[] = [
  {
    code: "basic",
    name: "Basic Statutory & FRSC Compliance",
    badge: "Included",
    dailyRateNgn: 0,
    summary:
      "NIID-verified third-party liability insurance, valid vehicle papers, and 24/7 phone support.",
    coverageItems: [
      "NIID statutory third-party liability cover",
      "Complete FRSC & VIO roadworthiness documentation pack",
      "Standard security deposit & damage deductible applies",
    ],
  },
  {
    code: "medium",
    name: "Naija Road, Tyre & Flood Shield",
    badge: "Most Popular in NG",
    dailyRateNgn: 12000,
    summary:
      "Engineered for Nigerian road realities: covers pothole tyre/rim damage, windscreen chips, and reduces excess by 50%.",
    coverageItems: [
      "100% tyre sidewall, rim & pothole impact protection",
      "Windscreen, headlamp & wing-mirror chip waiver",
      "Rainy-season flood & water-logged corridor recovery assistance",
    ],
  },
  {
    code: "premium",
    name: "Executive Zero-Excess + Standby Relief Car",
    badge: "Full Peace of Mind",
    dailyRateNgn: 25000,
    summary:
      "₦0 damage excess liability, 24/7 AA Rescue recovery, and a guaranteed replacement car within 2 hours.",
    coverageItems: [
      "₦0 collision & comprehensive damage deductible",
      "Guaranteed 2-hour replacement vehicle in Lagos, Abuja & PH",
      "24/7 AA Rescue flatbed recovery & priority VIP hotline",
    ],
  },
];

export const BOOKING_ADDON_OPTIONS: BookingAddonOption[] = [
  {
    code: "prepaid_fuel",
    name: "Prepaid Full-Tank Fuel Provisioning",
    badge: "Skip Fuel Queues",
    billing: "flat",
    amountNgn: 48000,
    description:
      "Vehicle delivered with a 100% full tank and no return refueling required—never wait in filling station queues.",
  },
  {
    code: "security_escort",
    name: "Executive MOPOL / Protocol Security Escort",
    badge: "VIP Security",
    billing: "daily",
    amountNgn: 65000,
    description:
      "Vetted armed Mobile Police (MOPOL) or diplomatic protocol officer for high-profile movements & interstate trips.",
  },
  {
    code: "wifi_hotspot",
    name: "5G In-Car Wi-Fi Router (Starlink / MTN 5G)",
    badge: "Mobile Office",
    billing: "daily",
    amountNgn: 8500,
    description:
      "Unlimited high-speed cabin Wi-Fi for up to 8 devices so executives work uninterrupted in Lagos or Abuja traffic.",
  },
  {
    code: "interstate_pass",
    name: "Interstate Corridor Clearance & AA Rescue",
    badge: "Cross-State",
    billing: "flat",
    amountNgn: 35000,
    description:
      "Authorizes travel beyond metro boundaries (e.g., Lagos–Ibadan, Abuja–Kaduna, PH–Owerri) with satellite tracking.",
  },
  {
    code: "extra_driver",
    name: "Additional Verified Relief Driver",
    badge: "Multi-Shift",
    billing: "daily",
    amountNgn: 10000,
    description:
      "Add a second verified self-drive operator or night-shift relief chauffeur for extended itineraries.",
  },
  {
    code: "child_seat",
    name: "ISOFIX Child Safety Seat",
    badge: "Family Ready",
    billing: "daily",
    amountNgn: 5000,
    description:
      "Sanitized infant, toddler, or booster safety seat pre-installed before airport or hotel delivery.",
  },
];

export const EUROPCAR_COMPETITOR_BENCHMARK: CompetitorBenchmarkRow[] = [
  {
    capability: "Drive Mode & Chauffeur Integration",
    izzacAdvantage:
      "Instant toggle between Verified Self-Drive and Vetted Corporate Chauffeur (+₦25k/day) on every car.",
    europcarStandard:
      "Built around European self-drive counters; chauffeur bookings require separate manual quotes.",
    africanMarketImpact:
      "Over 75% of Nigerian corporate, diplomatic, and diaspora riders prefer a route-savvy local driver.",
  },
  {
    capability: "Executive Security & Protocol Add-Ons",
    izzacAdvantage:
      "On-demand MOPOL / protocol security escort, convoy coordination, and biometric/armored-ready SUVs.",
    europcarStandard:
      "Offers European seasonal extras (ski racks, snow chains, winter tyres) irrelevant to West/East Africa.",
    africanMarketImpact:
      "Essential for oil & gas executives, diplomats, VIP events, and interstate highway movements.",
  },
  {
    capability: "Fuel Scarcity & Queue Protection",
    izzacAdvantage:
      "Prepaid Full-Tank Fuel Provisioning guarantees 100% tank on delivery—skip filling station queues.",
    europcarStandard:
      "Standard full-to-full policy with penalty surcharges if renter cannot refuel before return.",
    africanMarketImpact:
      "Eliminates trip delays during periodic PMS supply bottlenecks in Lagos, Abuja, and regional hubs.",
  },
  {
    capability: "Road, Pothole & Rainy-Season Protection",
    izzacAdvantage:
      "Naija Road Shield explicitly covers pothole tyre/rim damage, windscreen chips, and flood recovery.",
    europcarStandard:
      "Standard CDW often excludes tyres, rims, underbody, and water-logged road incidents in fine print.",
    africanMarketImpact:
      "Protects renters from surprise deductions caused by uneven roads or tropical downpours.",
  },
  {
    capability: "Duration Discounts & Monthly SuperFlex",
    izzacAdvantage:
      "Automatic 10% Weekly (7+ days) and 22% Monthly SuperFlex (30+ days) discounts calculated live online.",
    europcarStandard:
      "Long-term corporate rates locked behind offline B2B account managers and rigid credit checks.",
    africanMarketImpact:
      "Gives SMEs, startups, and diaspora visitors instant asset-light fleet access without 28%+ bank auto loans.",
  },
  {
    capability: "Currency & Local Payment Rails",
    izzacAdvantage:
      "Native ₦ NGN pricing with live $ USD, GH₵ GHS & KSh KES switcher; supports transfers, cards & LPOs.",
    europcarStandard:
      "Prices often quoted in EUR/USD with steep FX conversion spreads and international credit card holds.",
    africanMarketImpact:
      "Transparent local Naira pricing for domestic riders alongside USD clarity for international teams.",
  },
  {
    capability: "Fleet Supply & Vehicle Freshness",
    izzacAdvantage:
      "Hybrid P2P + Commercial Fleet model: verified hosts & fleet partners list 2022–2024 luxury & commuter trims.",
    europcarStandard:
      "Single-operator franchise fleet with high capital overhead and limited model variety.",
    africanMarketImpact:
      "Unlocks 32+ curated models from Toyota Corolla commuters to Land Cruiser 300 GR Sport & Tesla EVs.",
  },
];

export const AFRICAN_REGIONAL_HUBS: RegionalHub[] = [
  {
    city: "Lagos (Island & Mainland)",
    country: "Nigeria",
    airportCode: "LOS",
    airportName: "Murtala Muhammed Int'l & MMA2",
    corridors: "Victoria Island · Ikoyi · Lekki Phase 1 · Ikeja GRA · Surulere · Yaba",
    servicesAvailable: [
      "Airport VIP Meet & Greet",
      "Chauffeur & MOPOL Convoy",
      "Verified Self-Drive",
      "2-Hr Standby Relief Car",
    ],
  },
  {
    city: "Abuja (Federal Capital Territory)",
    country: "Nigeria",
    airportCode: "ABV",
    airportName: "Nnamdi Azikiwe Int'l Airport",
    corridors: "Maitama · Asokoro · Wuse II · Central Business District · Jabi",
    servicesAvailable: [
      "Diplomatic Protocol Chauffeur",
      "Executive SUV Convoy",
      "Airport Curbside Handover",
      "Corporate SuperFlex",
    ],
  },
  {
    city: "Port Harcourt (Energy Corridor)",
    country: "Nigeria",
    airportCode: "PHC",
    airportName: "Port Harcourt Int'l Airport (Omagwa)",
    corridors: "Old & New GRA · Trans-Amadi · Onne Oil & Gas Free Zone",
    servicesAvailable: [
      "Hilux 4x4 & Field Pickups",
      "MOPOL Escort Integration",
      "Corporate LPO Leasing",
      "Chauffeur Drive",
    ],
  },
  {
    city: "Kano, Ibadan & Enugu",
    country: "Nigeria",
    airportCode: "KAN / ENU / IBA",
    airportName: "Mallam Aminu Kano · Akanu Ibiam · Ibadan Corridor",
    corridors: "Nassarawa GRA Kano · Bodija Ibadan · Independence Layout Enugu",
    servicesAvailable: [
      "Interstate Corridor Pass",
      "4x4 Pickup & SUV Fleet",
      "Station & Hotel Delivery",
    ],
  },
  {
    city: "Accra & Nairobi (Pan-African Partner Desks)",
    country: "Ghana & Kenya",
    airportCode: "ACC / NBO",
    airportName: "Kotoka Int'l (Accra) · Jomo Kenyatta Int'l (Nairobi)",
    corridors: "Airport Residential & Cantonments (Accra) · Westlands & Karen (Nairobi)",
    servicesAvailable: [
      "ECOWAS & East Africa Cross-Hub Booking",
      "Multi-Currency Billing (GH₵ / KSh / $)",
      "Executive Airport Transfers",
    ],
  },
];

export const IZZAC_PRIVILEGE_TIERS: PrivilegeTier[] = [
  {
    tier: "Privilege Green",
    threshold: "Instant upon sign-up (0+ days)",
    discount: "10% off 7+ day weekly bookings",
    perks: [
      "One-time digital NIN/FRSC verification badge for paperless pickups",
      "Free flight-delay protection on all Airport Meet & Greet bookings",
      "Single unified account for both booking rides and hosting vehicles",
    ],
  },
  {
    tier: "Privilege Emerald Executive",
    threshold: "10+ rental days or 3 trips/year",
    discount: "15% off multi-day + Free 5G Cabin Wi-Fi",
    perks: [
      "Complimentary vehicle class upgrade (e.g., Sedan to Crossover SUV) when available",
      "Priority vehicle allocation during peak December ('Detty December') & Sallah/Easter periods",
      "Dedicated WhatsApp & phone concierge with 2-hour replacement vehicle guarantee",
    ],
  },
  {
    tier: "Privilege Sovereign VIP",
    threshold: "30+ rental days or Corporate Fleet Partner",
    discount: "22% Monthly SuperFlex + Protocol Perks",
    perks: [
      "Complimentary VIP Domestic Lounge pass at MMA2 Lagos & Abuja terminals",
      "Consolidated monthly NGN/USD corporate invoicing with 14-day net LPO terms",
      "Priority access to flagship fleet (Land Cruiser 300 GR Sport, GLE 450, V250d Avantgarde)",
    ],
  },
];

export const platformFeatureCards: FeatureCard[] = [
  {
    eyebrow: "Discovery",
    title: "Browse 32+ Nigeria-ready vehicles",
    description:
      "Filter by city hub (Lagos, Abuja, PH, Kano), service mode (Chauffeur, Self-Drive, Airport VIP), or daily NGN/USD budget.",
    href: "/cars",
    cta: "Browse fleet",
  },
  {
    eyebrow: "Chauffeur & Protocol",
    title: "Add a vetted driver or security escort",
    description:
      "Upgrade any reservation with a uniformed corporate chauffeur, airport meet & greet, or executive MOPOL escort.",
    href: "/services",
    cta: "Explore services",
  },
  {
    eyebrow: "Smart Booking",
    title: "Configure protection, fuel & Wi-Fi live",
    description:
      "Select Naija Road & Tyre Shield, prepaid full-tank fuel, and 5G cabin Wi-Fi with instant itemized pricing.",
    href: "/cars",
    cta: "Start booking",
  },
  {
    eyebrow: "Corporate SuperFlex",
    title: "Save up to 22% on weekly & monthly plans",
    description:
      "Automatic 10% weekly and 22% monthly discounts with standby replacement vehicles for businesses and diaspora stays.",
    href: "/services#calculator",
    cta: "Calculate savings",
  },
  {
    eyebrow: "Hosting",
    title: "Monetize your vehicle or commercial fleet",
    description:
      "Publish your car for chauffeur-driven or verified self-drive bookings and earn recurring NGN revenue.",
    href: "/dashboard/add-car",
    cta: "List your car",
  },
  {
    eyebrow: "Dashboards",
    title: "Track rider & host reservations in one place",
    description:
      "Review confirmed trips, service modes, protection tiers, and host-side demand from your unified workspace.",
    href: "/dashboard/bookings",
    cta: "Open bookings",
  },
];

export const riderJourney: JourneyStep[] = [
  {
    title: "Choose your city hub & service mode",
    description:
      "Filter live inventory across Lagos, Abuja, Port Harcourt, Kano, Ibadan, or Enugu for Chauffeur-Driven, Self-Drive, or Airport VIP transfer.",
  },
  {
    title: "Inspect Nigeria-tuned specs & road readiness",
    description:
      "Review ground clearance, AC performance, nearest airport desk (LOS, ABV, PHC), and equipment before selecting dates.",
  },
  {
    title: "Customize protection & African mobility extras",
    description:
      "Add Naija Road & Tyre Shield, Prepaid Full-Tank Fuel (skip fuel queues), 5G Cabin Wi-Fi, or Executive Security Escort.",
  },
  {
    title: "Confirm & track from your bookings ledger",
    description:
      "Lock in instant daily, weekly (-10%), or monthly SuperFlex (-22%) pricing and manage every trip from your dashboard.",
  },
];

export const hostJourney: JourneyStep[] = [
  {
    title: "Onboard as an individual owner or fleet partner",
    description:
      "Use the host portal to register your account and decide whether your vehicle will operate Chauffeur-Driven, Self-Drive, or both.",
  },
  {
    title: "Publish a complete Nigeria-ready listing",
    description:
      "Set your daily NGN rate, city hub (e.g. Victoria Island, Lekki, Maitama), vehicle specs, and upload high-resolution photos.",
  },
  {
    title: "Manage your garage & corporate availability",
    description:
      "Keep track of all vehicles in your garage and tap into high-yield corporate, airport transfer, and diaspora demand.",
  },
  {
    title: "Monitor host-side bookings & service add-ons",
    description:
      "Switch your bookings dashboard into host view to inspect upcoming dates, drive modes, protection tiers, and earnings.",
  },
];

export const hostFeatureCards: FeatureCard[] = [
  {
    eyebrow: "Chauffeur or Self-Drive",
    title: "Protect your asset with chauffeur-inclusive hosting",
    description:
      "In Nigeria, many owners prefer a trusted driver behind the wheel. Pair your car with your own vetted driver or Izzac's corporate chauffeur pool.",
    href: "/dashboard/add-car",
    cta: "Create a listing",
  },
  {
    eyebrow: "Garage Telemetry",
    title: "Manage single vehicles or multi-car commercial fleets",
    description:
      "Your garage dashboard centralizes every sedan, SUV, and 4x4 pickup you operate across Lagos, Abuja, and Port Harcourt.",
    href: "/dashboard",
    cta: "Open garage",
  },
  {
    eyebrow: "Corporate & Diaspora Demand",
    title: "Capture weekly, monthly & airport transfer bookings",
    description:
      "Unlike traditional car hire desks, your listing automatically participates in Izzac's Airport VIP, Chauffeur, and Monthly SuperFlex channels.",
    href: "/dashboard/bookings",
    cta: "Check host bookings",
  },
  {
    eyebrow: "Dual-Role Architecture",
    title: "One account for riding, hosting, and fleet oversight",
    description:
      "Seamlessly book an executive SUV when traveling to Abuja while your own Lagos vehicles generate host revenue.",
    href: "/services",
    cta: "Compare with Europcar",
  },
];

export const hostWorkflow: WorkflowStage[] = [
  {
    title: "Before you publish",
    description:
      "Prepare your vehicle for Nigerian executive and commuter standards so it commands top daily and monthly occupancy.",
    items: [
      "Verify chilled AC, tyres, NIID insurance, and FRSC roadworthiness papers",
      "Decide between Chauffeur-Driven, Verified Self-Drive, or dual-mode availability",
      "Set competitive daily NGN pricing (weekly -10% & monthly -22% apply automatically)",
    ],
  },
  {
    title: "When your listing goes live",
    description:
      "Your vehicle is indexed across City Hubs, Airport Transfer desks, and Corporate SuperFlex searches.",
    items: [
      "Riders can add Chauffeur service, Naija Road Shield, and Prepaid Fuel at checkout",
      "Airport flight-tracking & doorstep delivery fees are calculated transparently",
      "Automatic overlap protection prevents double-booking across dates",
    ],
  },
  {
    title: "During & after trips",
    description:
      "Track every reservation, service mode, and protection package from your unified workspace.",
    items: [
      "Monitor active and upcoming reservations in Host Bookings mode",
      "Protected by tiered renter coverage and AA Rescue roadside support",
      "Scale from a single car to a multi-city commercial fleet on one account",
    ],
  },
];

export const hostFaqs: FaqItem[] = [
  {
    question: "Can I list my car as Chauffeur-Driven only instead of Self-Drive?",
    answer:
      "Yes. Unlike European platforms that force self-drive handovers, Izzac is built for the Nigerian market—you can supply your own trusted driver or tap into Izzac's vetted corporate chauffeur pool.",
  },
  {
    question: "How does Izzac improve on traditional franchises like Europcar for hosts and fleet owners?",
    answer:
      "Europcar operates a closed franchise fleet. Izzac opens enterprise-grade booking channels (Airport VIP Meet & Greet, Corporate Monthly SuperFlex, and Executive Convoy bookings) to verified private owners and local fleet operators.",
  },
  {
    question: "How are potholes, tyre damage, and Nigerian road hazards handled?",
    answer:
      "Riders can select Naija Road, Tyre & Flood Shield (+₦12,000/day) or Executive Zero-Excess Protection (+₦25,000/day) at checkout, backed by 24/7 AA Rescue recovery.",
  },
  {
    question: "What cities and airport hubs are supported?",
    answer:
      "Izzac supports Lagos (MMIA/VI/Lekki/Ikeja), Abuja (ABV/Maitama/Asokoro/Wuse II), Port Harcourt (PHC/GRA), Kano, Ibadan, and Enugu, plus partner corridors in Accra and Nairobi.",
  },
  {
    question: "Can corporate clients book my car for a full month?",
    answer:
      "Yes. Bookings of 7+ days automatically qualify for the 10% Weekly Saver tier, and 30+ day bookings unlock the 22% Monthly SuperFlex corporate subscription rate.",
  },
];
