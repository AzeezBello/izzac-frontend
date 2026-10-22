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

export type InsurancePlanCode =
  | "third_party_niid"
  | "comprehensive_shield"
  | "zero_excess_all_risk";

export type AddonCode =
  | "security_escort"
  | "prepaid_fuel"
  | "wifi_hotspot"
  | "interstate_pass"
  | "extra_driver"
  | "child_seat";

export type InsurancePlanOption = {
  code: InsurancePlanCode;
  name: string;
  underwriter: string;
  badge: string;
  dailyRateNgn: number;
  coverageLimitNgn: number;
  summary: string;
  coverageItems: string[];
};

export type DrivingTestQuestion = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
};

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
    subtitle: "Preferred executive & trial transit mode",
    dailySurchargeNgn: 25000,
    priceTag: "+₦25,000 /day",
    description:
      "Every listing can be booked with a vetted, uniformed corporate chauffeur trained in defensive driving, urban traffic routing, and diplomatic protocol.",
    highlights: [
      "12-hour daily shift with English & multi-lingual corporate driver",
      "Optional armed Mobile Police (MOPOL) or unarmed protocol escort detail",
      "Zero driver liability for renter in dense urban traffic or checkpoints",
    ],
    europcarUpgradeNote:
      "Improves on Europcar's self-drive default by making vetted chauffeur-drive a first-class, instant-book toggle on every vehicle.",
    href: "/cars?service=Chauffeur+%26+Protocol",
    cta: "Browse chauffeur fleet",
  },
  {
    code: "self_drive",
    eyebrow: "02 · Graduated Self-Drive & Driving Test",
    title: "Evaluated Self-Drive (Post-Chauffeur Trial + Exam)",
    subtitle: "Chauffeur Trial Period → Driving Test Evaluation → Self-Drive Unlock",
    dailySurchargeNgn: 0,
    priceTag: "Unlocked after Trial + Test",
    description:
      "To protect high-value vehicles, all new users begin with a Chauffeur-Driven trial period, then pass our License/ID Driving Test Evaluation to unlock independent Self-Drive.",
    highlights: [
      "Step 1: Complete your initial Chauffeur-Driven trial trip to establish account trust",
      "Step 2: Pass the 5-question Highway Code, flood-corridor & road readiness evaluation",
      "Step 3: Unlock paperless Self-Drive backed by Verified Motor Insurance",
    ],
    europcarUpgradeNote:
      "Replaces Europcar's high-friction credit-card deposit blocks with a graduated Chauffeur Trial + Driving Test Evaluation that protects hosts and rewards safe drivers.",
    href: "/dashboard/rider#evaluation",
    cta: "Take driving test evaluation",
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
      "Eliminates the trek to remote rental car lots in heat or rain—your chilled vehicle meets you directly at the terminal exit.",
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
      "Built for enterprises, energy operators, fintechs, embassies, and executives who need multi-week or monthly vehicles with full maintenance included.",
    highlights: [
      "Automatic 10% Weekly Saver (7+ days) & 22% Monthly SuperFlex (30+ days) discounts",
      "Guaranteed 2-hour replacement vehicle in Lagos, Abuja & Port Harcourt if servicing is needed",
      "Consolidated VAT invoicing, corporate LPO billing, and instant card/wire settlement",
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
      "Instead of generic light box vans unsuited to demanding highways, Izzac deploys high-clearance 4x4 double-cab pickups and luxury executive vans.",
    highlights: [
      "Toyota Hilux Adventure 4x4 & Ford Ranger Wildtrak Bi-Turbo for field & escort duty",
      "Mercedes-Benz V250d Avantgarde 7-seater lounge vans for board roadshows & delegations",
      "Pre-cleared Interstate Corridor Pass with 24/7 AA Rescue breakdown cover",
    ],
    europcarUpgradeNote:
      "Replaces light Luton vans with heavy-duty 4x4 turbo-diesel pickups and executive shuttles built for interstate terrain.",
    href: "/cars?category=Pickup+%26+Shuttle",
    cta: "View pickups & shuttles",
  },
  {
    code: "host_marketplace",
    eyebrow: "06 · Dual-Role Fleet Marketplace",
    title: "Host & Commercial Partner Fleet Monetization",
    subtitle: "Turn idle vehicles into high-yield recurring cashflow",
    dailySurchargeNgn: 0,
    priceTag: "Earn ₦1.2M–₦4.5M /mo",
    description:
      "Unlike Europcar's closed franchise inventory, Izzac empowers verified car owners and fleet operators to list vehicles and manage bookings from one account.",
    highlights: [
      "List as Chauffeur-Only (your driver or Izzac's) or Evaluated Self-Drive",
      "Direct garage & reservation workspace with instant host/rider view switching",
      "Protected with dynamic daily pricing, guest driving evaluation, and motor insurance",
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
    label: "Evaluated Self-Drive (Post-Trial + Exam)",
    shortLabel: "Self-Drive",
    dailyRateNgn: 0,
    description: "Drive yourself after completing Chauffeur Trial & Driving Test.",
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

export const INSURANCE_PLAN_OPTIONS: InsurancePlanOption[] = [
  {
    code: "third_party_niid",
    name: "Statutory Third-Party Motor Insurance (NIID Verified)",
    underwriter: "Leadway Assurance / AXA Mansard Partner Pool",
    badge: "Mandatory Baseline",
    dailyRateNgn: 0,
    coverageLimitNgn: 3000000,
    summary:
      "Statutory National Motor Insurance Database (NIID) third-party bodily injury and property damage cover up to ₦3,000,000.",
    coverageItems: [
      "Live NIID policy certificate issued per booking for highway verification",
      "Up to ₦3,000,000 third-party property damage & bodily injury liability",
      "Renter remains liable for own-vehicle collision damage unless upgraded",
    ],
  },
  {
    code: "comprehensive_shield",
    name: "Comprehensive Motor + Pothole, Tyre & Flood Insurance",
    underwriter: "AXA Mansard / Leadway Comprehensive Pool",
    badge: "Recommended Insurance",
    dailyRateNgn: 15000,
    coverageLimitNgn: 45000000,
    summary:
      "Full accidental collision cover up to ₦45M plus pothole tyre/rim burst, windscreen chips, and flood-corridor protection (80% excess waiver).",
    coverageItems: [
      "Comprehensive own-damage & collision cover up to ₦45,000,000",
      "Covers pothole tyre sidewall/rim damage, windscreen chips & flood recovery",
      "80% reduction in renter deductible + 24/7 claims & rescue coordination",
    ],
  },
  {
    code: "zero_excess_all_risk",
    name: "Executive Zero-Excess All-Risk + SRCC Insurance",
    underwriter: "Leadway Executive Fleet Syndicate",
    badge: "Zero Deductible",
    dailyRateNgn: 28000,
    coverageLimitNgn: 150000000,
    summary:
      "₦0 excess liability, comprehensive collision/theft/fire up to ₦150M, Strike/Riot/Civil Commotion (SRCC) extension, and 2-hour replacement car.",
    coverageItems: [
      "₦0 excess / deductible on collision, theft, fire & vandalism claims",
      "Includes Strike, Riot & Civil Commotion (SRCC) + ₦2.5M Personal Accident medical cover",
      "Guaranteed 2-hour replacement vehicle SLA in Lagos, Abuja & Port Harcourt",
    ],
  },
];

export const SELF_DRIVE_TRIAL_STAGES = [
  {
    stage: "Stage 01",
    title: "Mandatory Chauffeur-Driven Trial Period",
    subtitle: "Required for all new Izzac accounts",
    description:
      "Every new user starts in Chauffeur-Driven mode for their initial trial booking. Our vetted driver handles navigation while our operations team verifies your identity, punctuality, and trip conduct.",
  },
  {
    stage: "Stage 02",
    title: "Driver License, ID & Driving Test Evaluation",
    subtitle: "80% minimum passing score + 2+ years experience",
    description:
      "Once your Chauffeur Trial Period is recorded, complete our 5-question Highway Code, wet-season flood protocol, and defensive driving evaluation alongside License & 11-digit ID verification.",
  },
  {
    stage: "Stage 03",
    title: "Verified Self-Drive + Active Motor Insurance",
    subtitle: "Instant paperless key handover unlocked",
    description:
      "Receive your digital Izzac Self-Drive Clearance Certificate (IZZAC-SD) and book any eligible vehicle in Self-Drive mode backed by NIID-verified Comprehensive or Zero-Excess Motor Insurance.",
  },
];

export const DRIVING_TEST_QUESTIONS: DrivingTestQuestion[] = [
  {
    id: "q1",
    question:
      "1. Under the Highway Code, what is the maximum legal speed limit for a passenger car on a multi-lane expressway in dry conditions?",
    options: [
      { id: "a", label: "80 km/h" },
      { id: "b", label: "100 km/h" },
      { id: "c", label: "130 km/h" },
    ],
    correctOptionId: "b",
    explanation:
      "Highway Code regulations set the maximum expressway speed limit for private passenger cars at 100 km/h.",
  },
  {
    id: "q2",
    question:
      "2. When approaching a flooded urban or expressway corridor during heavy rain, what is the mandatory Izzac self-drive protocol?",
    options: [
      {
        id: "a",
        label: "Accelerate at high RPM through deep standing water",
      },
      {
        id: "b",
        label:
          "Never enter water above tyre hub/exhaust level; halt safely and reroute or contact Izzac 24/7 Operations",
      },
      {
        id: "c",
        label: "Switch off hazard lights and tailgate the vehicle ahead",
      },
    ],
    correctOptionId: "b",
    explanation:
      "Driving into standing water above hub height risks engine hydrolock; stopping and rerouting keeps both driver and Comprehensive Flood Insurance valid.",
  },
  {
    id: "q3",
    question:
      "3. What is the minimum safe following distance behind another vehicle on a high-speed bridge or airport expressway in wet weather?",
    options: [
      {
        id: "a",
        label: "At least a 4-second gap (double the dry 2-second rule)",
      },
      { id: "b", label: "One car length at 90 km/h" },
      { id: "c", label: "Half a second if ABS is active" },
    ],
    correctOptionId: "a",
    explanation:
      "Heavy rain and surface oil film double stopping distances; a minimum 4-second gap is mandatory.",
  },
  {
    id: "q4",
    question:
      "4. Before taking a self-drive vehicle outside your pickup metro hub (e.g., Lagos to Ibadan or Abuja to Kaduna), what clearance is required?",
    options: [
      { id: "a", label: "No notification is needed" },
      {
        id: "b",
        label:
          "Active Interstate Corridor Clearance Pass on the booking + verified NIID Motor Insurance certificate",
      },
      { id: "c", label: "Disconnecting the vehicle GPS telemetry unit" },
    ],
    correctOptionId: "b",
    explanation:
      "All cross-corridor movements require an active Interstate Corridor Pass and NIID insurance certificate for highway checkpoints and AA Rescue coverage.",
  },
  {
    id: "q5",
    question:
      "5. In the event of a minor traffic incident or pothole tyre burst, what is the first required action under your Motor Insurance policy?",
    options: [
      {
        id: "a",
        label: "Use an unapproved roadside mechanic without reporting",
      },
      {
        id: "b",
        label:
          "Move to a safe spot, activate hazards, capture timestamped photos, and alert Izzac 24/7 Rescue & Insurance Desk immediately",
      },
      { id: "c", label: "Abandon the vehicle unlocked on the highway" },
    ],
    correctOptionId: "b",
    explanation:
      "Immediate timestamped reporting activates your motor insurance cover and dispatches authorized tyre/flatbed support.",
  },
];

export const PROTECTION_PLAN_OPTIONS: ProtectionPlanOption[] = [
  {
    code: "basic",
    name: "Basic Statutory & Roadworthiness Compliance",
    badge: "Included",
    dailyRateNgn: 0,
    summary:
      "NIID-verified third-party liability insurance, valid vehicle papers, and 24/7 phone support.",
    coverageItems: [
      "NIID statutory third-party liability cover",
      "Complete roadworthiness documentation pack",
      "Standard security deposit & damage deductible applies",
    ],
  },
  {
    code: "medium",
    name: "Road, Tyre & Flood Shield",
    badge: "Most Popular",
    dailyRateNgn: 12000,
    summary:
      "Engineered for real-world road conditions: covers pothole tyre/rim damage, windscreen chips, and reduces excess by 50%.",
    coverageItems: [
      "100% tyre sidewall, rim & pothole impact protection",
      "Windscreen, headlamp & wing-mirror chip waiver",
      "Wet-season flood & water-logged corridor recovery assistance",
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
    name: "5G In-Car Wi-Fi Router (Starlink / 5G)",
    badge: "Mobile Office",
    billing: "daily",
    amountNgn: 8500,
    description:
      "Unlimited high-speed cabin Wi-Fi for up to 8 devices so executives work uninterrupted on the move.",
  },
  {
    code: "interstate_pass",
    name: "Interstate Corridor Clearance & AA Rescue",
    badge: "Cross-Corridor",
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
    capability: "Graduated Self-Drive & Driving Test Evaluation",
    izzacAdvantage:
      "New users complete a Chauffeur-Driven trial period first, then pass the License/ID Driving Test Evaluation (80%+) to unlock Self-Drive.",
    europcarStandard:
      "Hands keys to any first-time renter with a credit card deposit hold, exposing fleet owners to unvetted road risk.",
    africanMarketImpact:
      "Eliminates vehicle diversion and reckless driving while rewarding safe drivers with zero-deposit paperless Self-Drive.",
  },
  {
    capability: "Verified Motor Insurance & Road Protection",
    izzacAdvantage:
      "Every trip includes an NIID-verified Third-Party policy with 1-click upgrades to Comprehensive Pothole/Flood Insurance (+₦15k/d) or Zero-Excess All-Risk + SRCC (+₦28k/d).",
    europcarStandard:
      "Standard CDW frequently excludes potholes, tyre bursts, rims, underbody, and civil commotion in fine print.",
    africanMarketImpact:
      "Provides legally verifiable insurance certificates at highway checkpoints plus real pothole and flood cover.",
  },
  {
    capability: "Drive Mode & Chauffeur Integration",
    izzacAdvantage:
      "Instant toggle between Evaluated Self-Drive and Vetted Corporate Chauffeur (+₦25k/day) on every car.",
    europcarStandard:
      "Built around self-drive counters; chauffeur bookings require separate manual quotes.",
    africanMarketImpact:
      "Over 75% of corporate, diplomatic, and executive riders prefer a route-savvy local driver.",
  },
  {
    capability: "Executive Security & Protocol Add-Ons",
    izzacAdvantage:
      "On-demand MOPOL / protocol security escort, convoy coordination, and biometric/armored-ready SUVs.",
    europcarStandard:
      "Offers seasonal extras (ski racks, snow chains, winter tyres) unsuited to executive urban & highway transit.",
    africanMarketImpact:
      "Essential for energy executives, diplomats, VIP events, and interstate highway movements.",
  },
  {
    capability: "Fuel Scarcity & Queue Protection",
    izzacAdvantage:
      "Prepaid Full-Tank Fuel Provisioning guarantees 100% tank on delivery—skip filling station queues.",
    europcarStandard:
      "Standard full-to-full policy with penalty surcharges if renter cannot refuel before return.",
    africanMarketImpact:
      "Eliminates trip delays during periodic fuel station bottlenecks across major hubs.",
  },
  {
    capability: "Road, Pothole & Rainy-Season Protection",
    izzacAdvantage:
      "Road, Tyre & Flood Shield explicitly covers pothole tyre/rim damage, windscreen chips, and flood recovery.",
    europcarStandard:
      "Standard CDW often excludes tyres, rims, underbody, and water-logged road incidents in fine print.",
    africanMarketImpact:
      "Protects renters from surprise deductions caused by uneven roads or heavy downpours.",
  },
  {
    capability: "Duration Discounts & Monthly SuperFlex",
    izzacAdvantage:
      "Automatic 10% Weekly (7+ days) and 22% Monthly SuperFlex (30+ days) discounts calculated live online.",
    europcarStandard:
      "Long-term corporate rates locked behind offline B2B account managers and rigid credit checks.",
    africanMarketImpact:
      "Gives enterprises, startups, and visiting teams instant asset-light fleet access without high-interest auto loans.",
  },
  {
    capability: "Currency & Local Payment Rails",
    izzacAdvantage:
      "Native ₦ NGN pricing with live $ USD, GH₵ GHS & KSh KES switcher; supports transfers, cards & LPOs.",
    europcarStandard:
      "Prices often quoted in EUR/USD with steep FX conversion spreads and international credit card holds.",
    africanMarketImpact:
      "Transparent local currency pricing for domestic riders alongside USD clarity for international teams.",
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
    country: "West Corridor",
    airportCode: "LOS",
    airportName: "Murtala Muhammed Int'l & MMA2",
    corridors: "Victoria Island · Ikoyi · Lekki Phase 1 · Ikeja GRA · Surulere · Yaba",
    servicesAvailable: [
      "Airport VIP Meet & Greet",
      "Chauffeur & MOPOL Convoy",
      "Evaluated Self-Drive",
      "2-Hr Standby Relief Car",
    ],
  },
  {
    city: "Abuja (Central Capital District)",
    country: "Capital Hub",
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
    country: "South Hub",
    airportCode: "PHC",
    airportName: "Port Harcourt Int'l Airport (Omagwa)",
    corridors: "Old & New GRA · Trans-Amadi · Onne Energy Free Zone",
    servicesAvailable: [
      "Hilux 4x4 & Field Pickups",
      "MOPOL Escort Integration",
      "Corporate LPO Leasing",
      "Chauffeur Drive",
    ],
  },
  {
    city: "Kano, Ibadan & Enugu",
    country: "Regional Hubs",
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
    city: "Accra & Nairobi (Partner Desks)",
    country: "International Hubs",
    airportCode: "ACC / NBO",
    airportName: "Kotoka Int'l (Accra) · Jomo Kenyatta Int'l (Nairobi)",
    corridors: "Airport Residential & Cantonments (Accra) · Westlands & Karen (Nairobi)",
    servicesAvailable: [
      "Cross-Hub Executive Booking",
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
      "One-time digital License/ID verification badge for paperless pickups",
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
      "Priority vehicle allocation during peak holiday & conference periods",
      "Dedicated WhatsApp & phone concierge with 2-hour replacement vehicle guarantee",
    ],
  },
  {
    tier: "Privilege Sovereign VIP",
    threshold: "30+ rental days or Corporate Fleet Partner",
    discount: "22% Monthly SuperFlex + Protocol Perks",
    perks: [
      "Complimentary VIP Domestic Lounge pass at MMA2 Lagos & Abuja terminals",
      "Consolidated monthly corporate invoicing with 14-day net LPO terms",
      "Priority access to flagship fleet (Land Cruiser 300 GR Sport, GLE 450, V250d Avantgarde)",
    ],
  },
];

export const platformFeatureCards: FeatureCard[] = [
  {
    eyebrow: "Discovery",
    title: "Browse 32+ executive & field vehicles",
    description:
      "Filter by city hub (Lagos, Abuja, PH, Kano), service mode (Chauffeur, Self-Drive, Airport VIP), or daily budget.",
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
    title: "Configure insurance, road shield & fuel live",
    description:
      "Select Verified Motor Insurance, Road & Tyre Shield, prepaid full-tank fuel, and 5G cabin Wi-Fi with instant itemized pricing.",
    href: "/cars",
    cta: "Start booking",
  },
  {
    eyebrow: "Corporate SuperFlex",
    title: "Save up to 22% on weekly & monthly plans",
    description:
      "Automatic 10% weekly and 22% monthly discounts with standby replacement vehicles for businesses and extended stays.",
    href: "/services#calculator",
    cta: "Calculate savings",
  },
  {
    eyebrow: "Hosting",
    title: "Monetize your vehicle or commercial fleet",
    description:
      "Publish your car for chauffeur-driven or evaluated self-drive bookings and earn recurring host revenue.",
    href: "/dashboard/add-car",
    cta: "List your car",
  },
  {
    eyebrow: "Dashboards",
    title: "Track rider & host reservations in one place",
    description:
      "Review confirmed trips, service modes, insurance certificates, and host-side demand from your unified workspace.",
    href: "/dashboard/bookings",
    cta: "Open bookings",
  },
];

export const riderJourney: JourneyStep[] = [
  {
    title: "Start with your Chauffeur-Driven trial trip",
    description:
      "All new accounts begin with a Chauffeur-Driven trial booking in Lagos, Abuja, Port Harcourt, or Kano so our team verifies your profile and trip conduct.",
  },
  {
    title: "Pass the License/ID Driving Test Evaluation",
    description:
      "Complete our 5-question Highway Code, flood-corridor, and defensive driving evaluation (80%+ passing score) to unlock Evaluated Self-Drive.",
  },
  {
    title: "Select Verified Motor Insurance & Road Shield",
    description:
      "Choose Statutory Third-Party (NIID), Comprehensive Pothole & Flood Insurance (+₦15k/day), or Executive Zero-Excess All-Risk + SRCC (+₦28k/day).",
  },
  {
    title: "Confirm & track with live policy certificates",
    description:
      "Lock in daily, weekly (-10%), or monthly SuperFlex (-22%) pricing with an auto-issued NIID insurance certificate reference on every booking.",
  },
];

export const hostJourney: JourneyStep[] = [
  {
    title: "Onboard as an individual owner or fleet partner",
    description:
      "Use the host portal to register your account and decide whether your vehicle will operate Chauffeur-Driven, Evaluated Self-Drive, or both.",
  },
  {
    title: "Publish a complete executive listing",
    description:
      "Set your daily rate, city hub (e.g. Victoria Island, Lekki, Maitama), vehicle specs, and upload high-resolution photos.",
  },
  {
    title: "Manage your garage & corporate availability",
    description:
      "Keep track of all vehicles in your garage and tap into high-yield corporate, airport transfer, and executive demand.",
  },
  {
    title: "Monitor host-side bookings & insurance certificates",
    description:
      "Switch your bookings dashboard into host view to inspect upcoming dates, drive modes, motor insurance certificates, and earnings.",
  },
];

export const hostFeatureCards: FeatureCard[] = [
  {
    eyebrow: "Chauffeur or Self-Drive",
    title: "Protect your asset with chauffeur-inclusive hosting",
    description:
      "Many owners prefer a trusted driver behind the wheel. Pair your car with your own vetted driver or Izzac's corporate chauffeur pool.",
    href: "/dashboard/add-car",
    cta: "Create a listing",
  },
  {
    eyebrow: "Garage Telemetry",
    title: "Manage single vehicles or multi-car commercial fleets",
    description:
      "Your garage dashboard centralizes every sedan, SUV, and 4x4 pickup you operate across Lagos, Abuja, and Port Harcourt.",
    href: "/dashboard/host",
    cta: "Open host garage",
  },
  {
    eyebrow: "Corporate & Executive Demand",
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
      "Prepare your vehicle for executive and commuter standards so it commands top daily and monthly occupancy.",
    items: [
      "Verify chilled AC, tyres, NIID motor insurance, and roadworthiness papers",
      "Decide between Chauffeur-Driven, Evaluated Self-Drive, or dual-mode availability",
      "Set competitive daily pricing (weekly -10% & monthly -22% apply automatically)",
    ],
  },
  {
    title: "When your listing goes live",
    description:
      "Your vehicle is indexed across City Hubs, Airport Transfer desks, and Corporate SuperFlex searches.",
    items: [
      "Riders can add Chauffeur service, Motor Insurance, Road Shield, and Prepaid Fuel at checkout",
      "Airport flight-tracking & doorstep delivery fees are calculated transparently",
      "Automatic overlap protection prevents double-booking across dates",
    ],
  },
  {
    title: "During & after trips",
    description:
      "Track every reservation, service mode, and motor insurance policy from your unified workspace.",
    items: [
      "Monitor active and upcoming reservations in Host Bookings mode",
      "Protected by tiered motor insurance, guest driving tests, and 24/7 roadside support",
      "Scale from a single car to a multi-city commercial fleet on one account",
    ],
  },
];

export const hostFaqs: FaqItem[] = [
  {
    question: "Can I list my car as Chauffeur-Driven only instead of Self-Drive?",
    answer:
      "Yes. Unlike platforms that force self-drive handovers, you can supply your own trusted driver or tap into Izzac's vetted corporate chauffeur pool—and any Self-Drive guest must first complete a Chauffeur Trial and pass our ≥80% Driving Test.",
  },
  {
    question: "How does Izzac improve on traditional franchises like Europcar for hosts and fleet owners?",
    answer:
      "Europcar operates a closed franchise fleet. Izzac opens enterprise-grade booking channels (Airport VIP Meet & Greet, Corporate Monthly SuperFlex, and Executive Convoy bookings) to verified private owners and fleet operators.",
  },
  {
    question: "How are potholes, tyre damage, and motor insurance handled?",
    answer:
      "Every booking includes NIID-verified Motor Insurance (Third-Party, Comprehensive +₦15k/day, or All-Risk Zero-Excess +₦28k/day) plus optional Road, Tyre & Flood Shield (+₦12,000/day), backed by 24/7 AA Rescue recovery.",
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
