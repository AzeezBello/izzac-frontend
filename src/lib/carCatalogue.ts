export type CarCategory =
  | "Executive Sedan"
  | "Luxury SUV"
  | "Crossover"
  | "City Commuter"
  | "Electric & Hybrid"
  | "Pickup & Shuttle";

export type DetailedCar = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  location: string;
  description: string;
  category?: CarCategory;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  seats?: number;
  features?: string[];
};

export const CAR_CATEGORIES: CarCategory[] = [
  "Executive Sedan",
  "Luxury SUV",
  "Crossover",
  "City Commuter",
  "Electric & Hybrid",
  "Pickup & Shuttle",
];

export const DETAILED_CAR_CATALOGUE: DetailedCar[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry SE",
    year: 2013,
    price_per_day: 75000,
    location: "Surulere, Lagos",
    image: "/images/hero-bg.webp",
    category: "Executive Sedan",
    transmission: "6-Speed Auto",
    drivetrain: "FWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Paddle Shifters",
      "Dual-Zone Chilled AC",
      "Bluetooth Audio",
      "Reversing Camera",
    ],
    description:
      "Sport-tuned 2.5L 4-cylinder midsize sedan with 6-speed automatic paddle shifters, chilled dual-zone AC, Bluetooth audio, backup camera, and firm suspension tuned for daily Lagos mainland and island commutes.",
  },
  {
    id: 2,
    make: "Toyota",
    model: "Corolla LE",
    year: 2022,
    price_per_day: 84000,
    location: "Lekki Phase 1, Lagos",
    image: "/images/feature1.webp",
    category: "City Commuter",
    transmission: "CVT Auto",
    drivetrain: "FWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Apple CarPlay & Android Auto",
      "Toyota Safety Sense 2.0",
      "Adaptive Cruise Control",
      "Bi-LED Headlamps",
    ],
    description:
      "Fuel-sipping 1.8L Dynamic Force sedan equipped with Apple CarPlay, Android Auto, Toyota Safety Sense 2.0 adaptive cruise control, LED headlamps, and an ultra-clean fabric cabin ideal for executive errands across Lekki and Victoria Island.",
  },
  {
    id: 3,
    make: "Toyota",
    model: "Land Cruiser Prado TXL",
    year: 2022,
    price_per_day: 125000,
    location: "Ikeja GRA, Lagos",
    image: "/images/feature3.webp",
    category: "Luxury SUV",
    transmission: "6-Speed Auto",
    drivetrain: "4WD",
    fuelType: "Petrol",
    seats: 7,
    features: [
      "Center Console Cool Box",
      "Perforated Leather 7-Seater",
      "3-Zone Climate Control",
      "High Ground Clearance",
    ],
    description:
      "Full-time 4WD seven-seater body-on-frame SUV with high ground clearance, perforated leather seats, cool box center console, 3-zone climate control, and effortless composure over both expressways and uneven city roads.",
  },
  {
    id: 4,
    make: "Toyota",
    model: "Highlander Hybrid Platinum",
    year: 2023,
    price_per_day: 200000,
    location: "Lekki Phase 1, Lagos",
    image: "/images/hero-bg.webp",
    category: "Electric & Hybrid",
    transmission: "e-CVT",
    drivetrain: "AWD",
    fuelType: "Hybrid",
    seats: 7,
    features: [
      "12.3-inch Touchscreen",
      "JBL 11-Speaker Audio",
      "Panoramic Glass Roof",
      "360° Bird's-Eye Camera",
    ],
    description:
      "Flagship AWD hybrid three-row SUV featuring a 12.3-inch touchscreen, JBL 11-speaker audio, panoramic glass roof, heated/ventilated captain's chairs, 360-degree bird's-eye camera, and whisper-quiet electric-assisted city cruising.",
  },
  {
    id: 5,
    make: "Mercedes-Benz",
    model: "C300 AMG Line",
    year: 2023,
    price_per_day: 165000,
    location: "Victoria Island, Lagos",
    image: "/images/feature1.webp",
    category: "Executive Sedan",
    transmission: "9G-TRONIC",
    drivetrain: "RWD",
    fuelType: "Mild Hybrid",
    seats: 5,
    features: [
      "11.9-inch MBUX Portrait Display",
      "Burmester 3D Surround Sound",
      "64-Color Ambient Lighting",
      "AMG Diamond Grille",
    ],
    description:
      "Mild-hybrid 2.0L turbo executive saloon with 9G-TRONIC transmission, 11.9-inch MBUX portrait display, Burmester 3D surround sound, 64-color ambient cabin lighting, and AMG diamond-grille styling for corporate arrivals.",
  },
  {
    id: 6,
    make: "BMW",
    model: "330i M Sport",
    year: 2023,
    price_per_day: 170000,
    location: "Ikoyi, Lagos",
    image: "/images/hero-bg.webp",
    category: "Executive Sedan",
    transmission: "8-Speed Steptronic",
    drivetrain: "RWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "BMW Curved Display",
      "Vernasca Leather Sport Seats",
      "Harman Kardon Surround",
      "M Adaptive Suspension",
    ],
    description:
      "Rear-wheel-drive sport sedan powered by a 255-hp TwinPower Turbo engine, curved BMW Live Cockpit Professional display, Vernasca leather sport seats, Harman Kardon audio, and M Sport adaptive suspension.",
  },
  {
    id: 7,
    make: "Lexus",
    model: "ES 350 F Sport",
    year: 2024,
    price_per_day: 155000,
    location: "Maitama, Abuja",
    image: "/images/feature1.webp",
    category: "Executive Sedan",
    transmission: "8-Speed Direct-Shift",
    drivetrain: "FWD",
    fuelType: "Petrol V6",
    seats: 5,
    features: [
      "Mark Levinson PurePlay Audio",
      "Acoustic Laminated Glass",
      "Ventilated Circuit Red Seats",
      "Power Rear Sunshade",
    ],
    description:
      "Silky 3.5L V6 luxury cruiser delivering 302 hp, acoustic laminated glass, Mark Levinson PurePlay audio, ventilated Circuit Red NuLuxe seating, and cloud-like ride quality tailored for Abuja diplomatic corridors.",
  },
  {
    id: 8,
    make: "Honda",
    model: "Accord Touring Hybrid",
    year: 2023,
    price_per_day: 98000,
    location: "Ikeja GRA, Lagos",
    image: "/images/hero-bg.webp",
    category: "Electric & Hybrid",
    transmission: "e-CVT",
    drivetrain: "FWD",
    fuelType: "Hybrid",
    seats: 5,
    features: [
      "12.3-inch Google Built-In",
      "Head-Up Display",
      "Bose 12-Speaker Audio",
      "Wireless Phone Charger",
    ],
    description:
      "Twelfth-generation hybrid fastback sedan with Google Built-In 12.3-inch infotainment, head-up display, Bose 12-speaker premium audio, wireless phone charging, and 48 mpg city efficiency.",
  },
  {
    id: 9,
    make: "Audi",
    model: "A4 S-Line Quattro",
    year: 2022,
    price_per_day: 140000,
    location: "Wuse II, Abuja",
    image: "/images/feature1.webp",
    category: "Executive Sedan",
    transmission: "7-Speed S tronic",
    drivetrain: "AWD Quattro",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Audi Virtual Cockpit Plus",
      "Matrix LED Headlights",
      "Bang & Olufsen 3D Sound",
      "Quattro All-Wheel Drive",
    ],
    description:
      "All-wheel-drive German executive sedan with Audi Virtual Cockpit Plus, Matrix LED headlights, S-Line flat-bottom steering wheel, Bang & Olufsen 3D sound, and confident wet-weather traction.",
  },
  {
    id: 10,
    make: "Genesis",
    model: "G80 3.5T Prestige",
    year: 2024,
    price_per_day: 185000,
    location: "Asokoro, Abuja",
    image: "/images/feature3.webp",
    category: "Executive Sedan",
    transmission: "8-Speed Auto",
    drivetrain: "AWD",
    fuelType: "Twin-Turbo V6",
    seats: 5,
    features: [
      "Quilted Nappa Leather",
      "Ergo Motion Massage Seat",
      "Lexicon 21-Speaker Audio",
      "Road-Preview Suspension",
    ],
    description:
      "Twin-turbo V6 flagship saloon featuring quilted Nappa leather, Ergo Motion massaging driver seat, Lexicon 21-speaker audio, rear executive sunshades, and electronically controlled road-preview suspension.",
  },
  {
    id: 11,
    make: "Mercedes-Benz",
    model: "GLE 450 4MATIC",
    year: 2024,
    price_per_day: 260000,
    location: "Banana Island, Ikoyi",
    image: "/images/feature3.webp",
    category: "Luxury SUV",
    transmission: "9G-TRONIC",
    drivetrain: "4MATIC AWD",
    fuelType: "Mild Hybrid",
    seats: 7,
    features: [
      "AIRMATIC Air Suspension",
      "Dual 12.3-inch Widescreen",
      "Soft-Close Doors",
      "Illuminated Running Boards",
    ],
    description:
      "3.0L inline-6 turbo with EQ Boost 48V mild-hybrid system, AIRMATIC air suspension, dual 12.3-inch widescreen cockpit, soft-close doors, illuminated running boards, and commanding presence for VIP transfers.",
  },
  {
    id: 12,
    make: "Land Rover",
    model: "Range Rover Velar R-Dynamic",
    year: 2023,
    price_per_day: 245000,
    location: "Victoria Island, Lagos",
    image: "/images/hero-bg.webp",
    category: "Luxury SUV",
    transmission: "8-Speed Auto",
    drivetrain: "AWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Flush Deployable Handles",
      "Pivi Pro Curved Glass",
      "Meridian 3D Surround",
      "Windsor Perforated Leather",
    ],
    description:
      "Avant-garde luxury SUV with flush deployable door handles, Pivi Pro curved glass interface, Meridian 3D surround sound, Windsor perforated leather, and Terrain Response 2.",
  },
  {
    id: 13,
    make: "Lexus",
    model: "RX 350h Luxury",
    year: 2024,
    price_per_day: 210000,
    location: "Maitama, Abuja",
    image: "/images/feature3.webp",
    category: "Electric & Hybrid",
    transmission: "e-CVT",
    drivetrain: "AWD",
    fuelType: "Hybrid",
    seats: 5,
    features: [
      "14-inch Lexus Interface",
      "Digital Latch E-Handles",
      "Semi-Aniline Leather",
      "Thematic Ambient Lighting",
    ],
    description:
      "Redesigned fifth-generation luxury hybrid crossover with 14-inch Lexus Interface touchscreen, Digital Latch e-handles, thematic ambient illumination, and semi-aniline leather trim.",
  },
  {
    id: 14,
    make: "Toyota",
    model: "Land Cruiser 300 GR Sport",
    year: 2024,
    price_per_day: 320000,
    location: "Asokoro, Abuja",
    image: "/images/feature3.webp",
    category: "Luxury SUV",
    transmission: "10-Speed Auto",
    drivetrain: "4WD",
    fuelType: "Twin-Turbo V6",
    seats: 7,
    features: [
      "E-KDSS Dynamic Suspension",
      "Biometric Fingerprint Start",
      "Dual Rear Entertainment Screens",
      "Front & Rear Diff Locks",
    ],
    description:
      "3.5L V6 twin-turbo flagship SUV with E-KDSS electronic kinetic dynamic suspension, front/rear differential locks, biometric fingerprint start, rear seat entertainment screens, and unmatched executive security stature.",
  },
  {
    id: 15,
    make: "BMW",
    model: "X5 xDrive40i",
    year: 2023,
    price_per_day: 235000,
    location: "Lekki Phase 1, Lagos",
    image: "/images/hero-bg.webp",
    category: "Luxury SUV",
    transmission: "8-Speed Sport Auto",
    drivetrain: "xDrive AWD",
    fuelType: "Mild Hybrid",
    seats: 5,
    features: [
      "Sky Lounge Panoramic LED Roof",
      "CraftedClarity Glass Controls",
      "Merino Leather Cabin",
      "Parking Assistant Pro",
    ],
    description:
      "375-hp inline-six luxury SAV with Sky Lounge panoramic LED roof, crafted clarity glass controls, split power tailgate, Parking Assistant Professional, and plush Merino leather cabin.",
  },
  {
    id: 16,
    make: "Porsche",
    model: "Cayenne Coupe",
    year: 2023,
    price_per_day: 310000,
    location: "Victoria Island, Lagos",
    image: "/images/feature3.webp",
    category: "Luxury SUV",
    transmission: "8-Speed Tiptronic S",
    drivetrain: "AWD",
    fuelType: "Turbo V6",
    seats: 4,
    features: [
      "Sport Chrono Package",
      "21-inch RS Spyder Wheels",
      "Bordeaux Red Sport Seats",
      "Bose Surround Sound",
    ],
    description:
      "Turbocharged V6 sport SUV with Sport Chrono Package, adaptive rear spoiler, 21-inch RS Spyder design wheels, Bose Surround Sound, and 8-way Bordeaux Red leather sport seats.",
  },
  {
    id: 17,
    make: "Toyota",
    model: "RAV4 Adventure AWD",
    year: 2023,
    price_per_day: 105000,
    location: "Yaba, Lagos",
    image: "/images/hero-bg.webp",
    category: "Crossover",
    transmission: "8-Speed Auto",
    drivetrain: "AWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Torque-Vectoring AWD",
      "Multi-Terrain Select",
      "SofTex Trimmed Seats",
      "Wireless Apple CarPlay",
    ],
    description:
      "Rugged compact SUV with dynamic torque-vectoring AWD, Multi-Terrain Select, orange-stitched SofTex interior, wireless Apple CarPlay, and generous cargo space for tech teams and weekend trips.",
  },
  {
    id: 18,
    make: "Honda",
    model: "CR-V EX-L",
    year: 2023,
    price_per_day: 95000,
    location: "Gbagada, Lagos",
    image: "/images/feature1.webp",
    category: "Crossover",
    transmission: "CVT Auto",
    drivetrain: "AWD",
    fuelType: "Turbo Petrol",
    seats: 5,
    features: [
      "Leather-Trimmed Cabin",
      "Hands-Free Power Tailgate",
      "85° Wide-Opening Rear Doors",
      "Front & Rear Parking Sensors",
    ],
    description:
      "Sixth-generation turbocharged family crossover with leather-trimmed seating, power tailgate, 9-inch touchscreen, front/rear parking sensors, and wide-opening 85-degree rear doors.",
  },
  {
    id: 19,
    make: "Hyundai",
    model: "Tucson Limited",
    year: 2024,
    price_per_day: 92000,
    location: "Port Harcourt GRA",
    image: "/images/feature3.webp",
    category: "Crossover",
    transmission: "8-Speed Auto",
    drivetrain: "HTRAC AWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Blind-Spot View Monitor",
      "Surround View Camera",
      "Ventilated Front Seats",
      "Panoramic Sunroof",
    ],
    description:
      "Parametric-jewel LED styling paired with blind-spot view monitor, Surround View camera, ventilated front seats, panoramic sunroof, and Remote Smart Parking Assist.",
  },
  {
    id: 20,
    make: "Kia",
    model: "Sportage X-Line",
    year: 2024,
    price_per_day: 90000,
    location: "Wuse II, Abuja",
    image: "/images/hero-bg.webp",
    category: "Crossover",
    transmission: "8-Speed Auto",
    drivetrain: "AWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "Dual 12.3-inch Curved Display",
      "Harman Kardon Audio",
      "Quilted Syntex Seating",
      "Smart Power Liftgate",
    ],
    description:
      "Dual-panoramic 12.3-inch curved display crossover with Harman Kardon audio, sage-green quilted syntactic leather, high-utility roof rails, and generous rear legroom.",
  },
  {
    id: 21,
    make: "Mazda",
    model: "CX-5 Turbo Signature",
    year: 2023,
    price_per_day: 88000,
    location: "Bodija, Ibadan",
    image: "/images/feature1.webp",
    category: "Crossover",
    transmission: "6-Speed Skyactiv",
    drivetrain: "i-Activ AWD",
    fuelType: "Turbo Petrol",
    seats: 5,
    features: [
      "Caturra Brown Nappa Leather",
      "Genuine Abachi Wood Trim",
      "Active Driving Display HUD",
      "G-Vectoring Control Plus",
    ],
    description:
      "256-hp Skyactiv-G 2.5 Turbo AWD crossover crafted with Caturra Brown Nappa leather, genuine Abachi wood trim, active driving display, and refined G-Vectoring Control Plus.",
  },
  {
    id: 22,
    make: "Peugeot",
    model: "3008 GT Pack",
    year: 2023,
    price_per_day: 86000,
    location: "Independence Layout, Enugu",
    image: "/images/feature3.webp",
    category: "Crossover",
    transmission: "8-Speed EAT8",
    drivetrain: "FWD",
    fuelType: "Turbo Petrol",
    seats: 5,
    features: [
      "Peugeot 3D i-Cockpit",
      "Alcantara Massage Seats",
      "Focal 10-Speaker Hi-Fi",
      "Night Vision Camera",
    ],
    description:
      "French i-Cockpit fastback SUV with 10-inch HD screen, Alcantara/leather massage seats, Focal Hi-Fi audio, frameless radiator grille, and agile urban handling.",
  },
  {
    id: 23,
    make: "Honda",
    model: "Civic Sport Touring",
    year: 2023,
    price_per_day: 78000,
    location: "Surulere, Lagos",
    image: "/images/feature1.webp",
    category: "City Commuter",
    transmission: "CVT w/ Paddles",
    drivetrain: "FWD",
    fuelType: "VTEC Turbo",
    seats: 5,
    features: [
      "10.2-inch Digital Cluster",
      "Bose 12-Speaker Sound",
      "Honeycomb Mesh Dash",
      "Wireless CarPlay",
    ],
    description:
      "1.5L VTEC Turbo hatchback/sedan featuring honeycomb mesh dash vents, 10.2-inch digital cluster, Bose 12-speaker sound system, leather seats, and razor-sharp steering.",
  },
  {
    id: 24,
    make: "Hyundai",
    model: "Elantra N-Line",
    year: 2023,
    price_per_day: 72000,
    location: "Ajah, Lagos",
    image: "/images/hero-bg.webp",
    category: "City Commuter",
    transmission: "7-Speed DCT",
    drivetrain: "FWD",
    fuelType: "Turbo Petrol",
    seats: 5,
    features: [
      "201-hp 1.6L Turbo Engine",
      "Sport Bolstered Seats",
      "Multi-Link Rear Suspension",
      "Digital Key Support",
    ],
    description:
      "201-hp 1.6L turbocharged sport compact with 7-speed dual-clutch transmission, multi-link independent rear suspension, sport bolstered seats, and digital key support.",
  },
  {
    id: 25,
    make: "Kia",
    model: "Cerato GT-Line",
    year: 2022,
    price_per_day: 68000,
    location: "Maryland, Lagos",
    image: "/images/feature1.webp",
    category: "City Commuter",
    transmission: "6-Speed Auto",
    drivetrain: "FWD",
    fuelType: "Petrol",
    seats: 5,
    features: [
      "LED Daytime Running Lights",
      "Smart Trunk Release",
      "Rear Passenger AC Vents",
      "Apple CarPlay",
    ],
    description:
      "Dependable and stylish compact saloon with LED daytime running lights, smart trunk release, rear AC vents, Apple CarPlay, and low fuel consumption for multi-day bookings.",
  },
  {
    id: 26,
    make: "Volkswagen",
    model: "Golf GTI Mk8",
    year: 2023,
    price_per_day: 115000,
    location: "Ikoyi, Lagos",
    image: "/images/hero-bg.webp",
    category: "City Commuter",
    transmission: "7-Speed DSG",
    drivetrain: "FWD w/ VAQ Diff",
    fuelType: "2.0L TSI",
    seats: 5,
    features: [
      "241-hp 2.0L TSI Engine",
      "Digital Cockpit Pro",
      "Vienna Leather Bucket Seats",
      "IQ.DRIVE Travel Assist",
    ],
    description:
      "Iconic 241-hp 2.0L TSI hot hatch with 7-speed DSG, VAQ torque-sensing limited-slip differential, Digital Cockpit Pro, tartan/Vienna leather sport bucket seats, and IQ.DRIVE.",
  },
  {
    id: 27,
    make: "Toyota",
    model: "Yaris Cross Hybrid",
    year: 2023,
    price_per_day: 65000,
    location: "Festac Town, Lagos",
    image: "/images/feature1.webp",
    category: "Electric & Hybrid",
    transmission: "e-CVT",
    drivetrain: "FWD",
    fuelType: "Hybrid",
    seats: 5,
    features: [
      "Ultra-Low Fuel Consumption",
      "Elevated Crossover Seating",
      "Wireless Smartphone Link",
      "Compact City Footprint",
    ],
    description:
      "Nimble subcompact hybrid crossover with elevated seating position, exceptional fuel economy, reversing camera, wireless smartphone integration, and effortless tight-space parking.",
  },
  {
    id: 28,
    make: "Tesla",
    model: "Model 3 Long Range AWD",
    year: 2024,
    price_per_day: 195000,
    location: "Victoria Island, Lagos",
    image: "/images/feature3.webp",
    category: "Electric & Hybrid",
    transmission: "Single-Speed Direct",
    drivetrain: "Dual-Motor AWD",
    fuelType: "100% Electric",
    seats: 5,
    features: [
      "341-Mile EPA Range",
      "8-inch Rear Passenger Display",
      "360° Acoustic Glass",
      "Mobile Wall Connector Included",
    ],
    description:
      "Highland-refresh dual-motor all-electric sedan with 341-mile range, ventilated front seats, 8-inch rear passenger touchscreen, acoustic 360 glass, and home/office mobile connector included.",
  },
  {
    id: 29,
    make: "Tesla",
    model: "Model Y Performance",
    year: 2024,
    price_per_day: 225000,
    location: "Ikoyi, Lagos",
    image: "/images/hero-bg.webp",
    category: "Electric & Hybrid",
    transmission: "Single-Speed Direct",
    drivetrain: "Dual-Motor AWD",
    fuelType: "100% Electric",
    seats: 5,
    features: [
      "3.5s 0–60 mph Acceleration",
      "All-Glass Panoramic Roof",
      "HEPA Bioweapon Defense Filter",
      "76 cu ft Cargo Volume",
    ],
    description:
      "All-electric performance crossover with 3.5-second 0–60 mph acceleration, expansive all-glass panoramic roof, HEPA Bioweapon Defense Mode filtration, and 76 cu ft of cargo capacity.",
  },
  {
    id: 30,
    make: "Ford",
    model: "Ranger Wildtrak Bi-Turbo",
    year: 2023,
    price_per_day: 135000,
    location: "Port Harcourt GRA",
    image: "/images/feature3.webp",
    category: "Pickup & Shuttle",
    transmission: "10-Speed Auto",
    drivetrain: "4x4 Selectable",
    fuelType: "Bi-Turbo Diesel",
    seats: 5,
    features: [
      "12-inch SYNC 4A Portrait Screen",
      "Power Roller Shutter Bed",
      "360° Off-Road Trail Camera",
      "Matrix LED Headlamps",
    ],
    description:
      "Next-Gen 2.0L Bi-Turbo diesel 4x4 double-cab pickup with 10-speed automatic, 12-inch SYNC 4A portrait screen, power roller shutter bed cover, and 360-degree trail cameras.",
  },
  {
    id: 31,
    make: "Toyota",
    model: "Hilux Adventure 4x4",
    year: 2023,
    price_per_day: 130000,
    location: "Nassarawa GRA, Kano",
    image: "/images/feature3.webp",
    category: "Pickup & Shuttle",
    transmission: "6-Speed Auto",
    drivetrain: "4x4 Part-Time",
    fuelType: "2.8L Turbo Diesel",
    seats: 5,
    features: [
      "2.8L GD-6 High-Torque Diesel",
      "JBL 9-Speaker Audio",
      "Downhill Assist Control",
      "Lockable Tonneau Bed Cover",
    ],
    description:
      "2.8L GD-6 turbo-diesel 4x4 double cab engineered for interstate reliability, featuring heavy-duty leaf springs, JBL audio, downhill assist control, and lockable tonneau cover.",
  },
  {
    id: 32,
    make: "Mercedes-Benz",
    model: "V250d Avantgarde",
    year: 2023,
    price_per_day: 250000,
    location: "Victoria Island, Lagos",
    image: "/images/hero-bg.webp",
    category: "Pickup & Shuttle",
    transmission: "9G-TRONIC",
    drivetrain: "RWD",
    fuelType: "Turbo Diesel",
    seats: 7,
    features: [
      "Lugano Leather Captain's Chairs",
      "Folding Executive Table",
      "Dual Power Sliding Doors",
      "Burmester Surround Sound",
    ],
    description:
      "Seven-passenger luxury executive lounge van with dual power sliding doors, Lugano leather captain's chairs, folding conference table, Burmester surround audio, and AGILITY CONTROL suspension.",
  },
];

/**
 * Merges live API car responses with the 32-vehicle curated catalogue so that:
 * 1. Matching cars from the API are enriched with technical specs (category, transmission, drivetrain, features).
 * 2. If the remote API has fewer than the full 32-car fleet, the remaining detailed catalogue entries are included seamlessly.
 */
export function mergeWithDetailedCatalogue(apiCars: DetailedCar[]): DetailedCar[] {
  if (!Array.isArray(apiCars) || apiCars.length === 0) {
    return DETAILED_CAR_CATALOGUE;
  }

  const catalogueByKey = new Map<string, DetailedCar>();
  const catalogueById = new Map<number, DetailedCar>();

  for (const item of DETAILED_CAR_CATALOGUE) {
    catalogueByKey.set(`${item.make.toLowerCase()}::${item.model.toLowerCase()}`, item);
    catalogueById.set(item.id, item);
  }

  const seenKeys = new Set<string>();
  const seenIds = new Set<number>();

  const merged: DetailedCar[] = apiCars.map((car) => {
    const exactKey = `${car.make.toLowerCase()}::${car.model.toLowerCase()}`;
    const matched = catalogueByKey.get(exactKey) || catalogueById.get(car.id);

    seenIds.add(car.id);
    seenKeys.add(exactKey);
    if (matched) {
      seenKeys.add(`${matched.make.toLowerCase()}::${matched.model.toLowerCase()}`);
    }

    return {
      ...matched,
      ...car,
      price_per_day: Number(car.price_per_day),
      description:
        car.description && car.description.length > 40
          ? car.description
          : matched?.description || car.description,
    };
  });

  for (const item of DETAILED_CAR_CATALOGUE) {
    const key = `${item.make.toLowerCase()}::${item.model.toLowerCase()}`;
    if (!seenIds.has(item.id) && !seenKeys.has(key)) {
      merged.push(item);
    }
  }

  return merged;
}

export function getCatalogueCarById(id: number): DetailedCar | null {
  return DETAILED_CAR_CATALOGUE.find((car) => car.id === id) || null;
}
