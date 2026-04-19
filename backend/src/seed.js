require('dotenv').config();
const sequelize = require('./config/database');
const Car = require('./models/Car');

const cars = [
  // ── HATCHBACKS (budget: ₹3L–₹12L) ──────────────────────────────────────
  {
    make: 'Maruti Suzuki', model: 'Alto K10', variant: 'VXi',
    price_lakhs: 3.99, mileage_kmpl: 24.9, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 2.0, segment: 'hatchback',
    use_case_tags: ['city', 'first_car', 'budget'],
    description: 'India\'s most affordable daily driver. Ultra-low running costs, easy to park, ideal for first-time buyers and students.',
  },
  {
    make: 'Maruti Suzuki', model: 'WagonR', variant: 'ZXi 1.2',
    price_lakhs: 6.99, mileage_kmpl: 24.4, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 2.5, segment: 'hatchback',
    use_case_tags: ['city', 'family', 'cng_available'],
    description: 'Tall-boy design gives surprising cabin space. Very popular with small families and Uber/Ola drivers for CNG economics.',
  },
  {
    make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi+',
    price_lakhs: 9.50, mileage_kmpl: 23.8, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.0, segment: 'hatchback',
    use_case_tags: ['city', 'sporty', 'enthusiast'],
    description: 'Sporty hatchback with sharp handling. Favourite of young professionals who want fun-to-drive without burning a hole in the wallet.',
  },
  {
    make: 'Tata', model: 'Tiago', variant: 'XZ+ CNG',
    price_lakhs: 8.49, mileage_kmpl: 26.5, fuel_type: 'cng',
    seating_capacity: 5, safety_rating: 4.0, segment: 'hatchback',
    use_case_tags: ['city', 'low_running_cost', 'safety'],
    description: '5-star Global NCAP safety in a sub-9L car — rare. CNG variant gives excellent running costs for high-mileage city drivers.',
  },
  {
    make: 'Hyundai', model: 'i20', variant: 'Asta (O) Turbo',
    price_lakhs: 11.99, mileage_kmpl: 20.6, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.0, segment: 'hatchback',
    use_case_tags: ['city', 'premium_hatchback', 'features', 'sporty'],
    description: 'Premium hatchback loaded with features — sunroof, 10.25" screen, turbo engine. Best hatchback if you want near-sedan features at hatchback price.',
  },
  {
    make: 'Renault', model: 'Kwid', variant: 'RXL 1.0',
    price_lakhs: 4.99, mileage_kmpl: 22.3, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 1.5, segment: 'hatchback',
    use_case_tags: ['city', 'budget', 'first_car'],
    description: 'SUV-inspired styling at hatchback price. High ground clearance handles rough village/town roads well. Style-conscious budget buyer\'s pick.',
  },
  {
    make: 'Tata', model: 'Punch', variant: 'Accomplished MT',
    price_lakhs: 9.99, mileage_kmpl: 18.8, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 5.0, segment: 'hatchback',
    use_case_tags: ['city', 'safety', 'micro_suv', 'first_car'],
    description: 'World\'s safest micro-SUV. 5-star Global NCAP. High seating position, good ground clearance — feels like an SUV, parks like a hatchback.',
  },
  {
    make: 'Maruti Suzuki', model: 'Celerio', variant: 'ZXi CNG',
    price_lakhs: 7.69, mileage_kmpl: 35.6, fuel_type: 'cng',
    seating_capacity: 5, safety_rating: 2.0, segment: 'hatchback',
    use_case_tags: ['city', 'low_running_cost', 'cng_available'],
    description: 'Highest mileage CNG hatchback in India at 35+ km/kg. For pure running-cost savings in city stop-go traffic, nothing beats it.',
  },

  // ── SEDANS (₹8L–₹25L) ───────────────────────────────────────────────────
  {
    make: 'Maruti Suzuki', model: 'Dzire', variant: 'ZXi+',
    price_lakhs: 10.49, mileage_kmpl: 24.1, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.0, segment: 'sedan',
    use_case_tags: ['city', 'highway', 'family', 'cab_fleet'],
    description: 'India\'s bestselling sedan for years. Large boot, refined ride, huge resale value. Professional\'s everyday car and ideal for long family trips.',
  },
  {
    make: 'Honda', model: 'City', variant: 'ZX CVT',
    price_lakhs: 16.50, mileage_kmpl: 18.4, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.5, segment: 'sedan',
    use_case_tags: ['highway', 'premium', 'comfort', 'professional'],
    description: 'Benchmark mid-size sedan — plush ride, spacious cabin, Honda reliability. The classic choice for corporate professionals and highway warriors.',
  },
  {
    make: 'Hyundai', model: 'Verna', variant: 'SX(O) Turbo DCT',
    price_lakhs: 19.99, mileage_kmpl: 20.0, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.0, segment: 'sedan',
    use_case_tags: ['highway', 'premium', 'sporty', 'features'],
    description: 'Most feature-packed sedan under ₹20L. ADAS safety tech, ventilated seats, large panoramic sunroof. For buyers who want executive car features without the price tag.',
  },
  {
    make: 'Skoda', model: 'Slavia', variant: 'Style 1.5 TSI DSG',
    price_lakhs: 21.99, mileage_kmpl: 19.5, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 4.0, segment: 'sedan',
    use_case_tags: ['highway', 'driving_enthusiast', 'premium', 'sporty'],
    description: 'Driver\'s sedan with European DNA. 150hp turbo petrol, best-in-class handling. For the buyer who loves driving and wants a grown-up fast car.',
  },

  // ── SUVs (₹10L–₹50L) ────────────────────────────────────────────────────
  {
    make: 'Maruti Suzuki', model: 'Brezza', variant: 'ZXi+',
    price_lakhs: 13.99, mileage_kmpl: 19.9, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 4.0, segment: 'suv',
    use_case_tags: ['city', 'compact_suv', 'safety', 'value'],
    description: 'Safest compact SUV with lowest ownership costs. Strong Maruti service network — ideal for buyers prioritising reliability and resale over features.',
  },
  {
    make: 'Hyundai', model: 'Creta', variant: 'SX(O) Turbo DCT',
    price_lakhs: 20.99, mileage_kmpl: 17.0, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.5, segment: 'suv',
    use_case_tags: ['city', 'highway', 'premium', 'family', 'features'],
    description: 'India\'s most popular mid-size SUV. Panoramic sunroof, ADAS, connected car tech. Does everything well — city, highway, family road trips.',
  },
  {
    make: 'Kia', model: 'Seltos', variant: 'HTX+ Turbo',
    price_lakhs: 19.99, mileage_kmpl: 16.8, fuel_type: 'petrol',
    seating_capacity: 5, safety_rating: 3.5, segment: 'suv',
    use_case_tags: ['city', 'highway', 'sporty', 'features'],
    description: 'Sporty design with segment-first features. Kia\'s 3.3L service intervals and 3-year warranty make it low-maintenance for working professionals.',
  },
  {
    make: 'Mahindra', model: 'Scorpio-N', variant: 'Z8 L 4WD',
    price_lakhs: 24.99, mileage_kmpl: 15.4, fuel_type: 'diesel',
    seating_capacity: 7, safety_rating: 5.0, segment: 'suv',
    use_case_tags: ['highway', 'offroad', 'family', 'safety', 'rugged'],
    description: '5-star Global NCAP 7-seater at an honest price. Unstoppable 4WD off-road ability, massive road presence. For families who travel rough terrain or need serious towing.',
  },
  {
    make: 'Mahindra', model: 'XUV700', variant: 'AX7 L Diesel AWD',
    price_lakhs: 27.99, mileage_kmpl: 16.0, fuel_type: 'diesel',
    seating_capacity: 7, safety_rating: 5.0, segment: 'suv',
    use_case_tags: ['highway', 'family', 'luxury_suv', 'safety', 'features'],
    description: 'Best value 7-seater flagship. ADAS level 2, 200hp diesel, 5-star safety — features that match European SUVs at half the price.',
  },
  {
    make: 'Mahindra', model: 'Thar Roxx', variant: '4WD MX5 Diesel',
    price_lakhs: 18.99, mileage_kmpl: 15.2, fuel_type: 'diesel',
    seating_capacity: 5, safety_rating: 4.0, segment: 'suv',
    use_case_tags: ['offroad', 'weekend', 'lifestyle', 'rugged', 'enthusiast'],
    description: 'India\'s lifestyle icon made practical with 4 doors. If weekends mean mountains, rivers, and dirt tracks — this is the only answer.',
  },
  {
    make: 'Tata', model: 'Safari', variant: 'Adventure Persona Diesel',
    price_lakhs: 25.49, mileage_kmpl: 16.3, fuel_type: 'diesel',
    seating_capacity: 7, safety_rating: 5.0, segment: 'suv',
    use_case_tags: ['highway', 'family', 'comfort', 'safety'],
    description: 'Large, safe, and comfortable 7-seater for big families. 5-star safety, panoramic sunroof, lounge-like second row — built for long Indian road trips.',
  },

  // ── MUVs (₹10L–₹22L) ────────────────────────────────────────────────────
  {
    make: 'Maruti Suzuki', model: 'Ertiga', variant: 'ZXi+ CNG',
    price_lakhs: 13.99, mileage_kmpl: 26.1, fuel_type: 'cng',
    seating_capacity: 7, safety_rating: 3.0, segment: 'muv',
    use_case_tags: ['family', 'city', 'low_running_cost', 'cng_available'],
    description: 'Best 7-seater value in India. CNG variant makes it among the cheapest per-km 7-seaters available. Perfect for large families on a tight budget.',
  },
  {
    make: 'Toyota', model: 'Innova Crysta', variant: '2.4 GX MT',
    price_lakhs: 20.99, mileage_kmpl: 15.1, fuel_type: 'diesel',
    seating_capacity: 7, safety_rating: 3.5, segment: 'muv',
    use_case_tags: ['highway', 'family', 'commercial', 'reliability'],
    description: 'The undisputed king of reliability in India. Taxi operators, large families, and businesses trust it for 5–10 lakh kms without a rebuild. Legendary resale.',
  },

  // ── EVs (₹15L–₹35L) ─────────────────────────────────────────────────────
  {
    make: 'Tata', model: 'Nexon EV', variant: 'Long Range Max',
    price_lakhs: 16.99, mileage_kmpl: null, fuel_type: 'electric',
    seating_capacity: 5, safety_rating: 5.0, segment: 'ev',
    use_case_tags: ['city', 'ev', 'safety', 'low_running_cost'],
    description: 'India\'s best-selling EV with 465km real-world range. ₹1–1.5 per km running cost vs ₹7–8 for petrol. Best entry into EVs for city buyers with home charging.',
  },
  {
    make: 'MG', model: 'Windsor EV', variant: 'Excite',
    price_lakhs: 13.50, mileage_kmpl: null, fuel_type: 'electric',
    seating_capacity: 5, safety_rating: 3.5, segment: 'ev',
    use_case_tags: ['city', 'ev', 'features', 'value'],
    description: 'Crossover EV with lounge-style cabin and 331km range at ₹13.5L — most affordable EV with this much cabin quality. Battery-as-a-service option reduces upfront cost further.',
  },

  // ── PREMIUM / LUXURY (₹45L–₹70L) ────────────────────────────────────────
  {
    make: 'BMW', model: '3 Series', variant: '320Ld Luxury Line',
    price_lakhs: 57.90, mileage_kmpl: 21.6, fuel_type: 'diesel',
    seating_capacity: 5, safety_rating: 5.0, segment: 'luxury',
    use_case_tags: ['premium', 'professional', 'driving_enthusiast', 'highway'],
    description: 'The definitive executive sedan. Rear-wheel drive, xDrive chassis, BMW ConnectedDrive. Status symbol with genuine driver\'s car credentials for CXOs and senior professionals.',
  },
  {
    make: 'Mercedes-Benz', model: 'C-Class', variant: 'C 220d MHEV',
    price_lakhs: 63.00, mileage_kmpl: 19.8, fuel_type: 'diesel',
    seating_capacity: 5, safety_rating: 5.0, segment: 'luxury',
    use_case_tags: ['premium', 'comfort', 'highway', 'professional'],
    description: 'Pinnacle of cabin luxury in its class. Hyperscreen MBUX, air suspension, soft-close doors. For buyers where comfort, prestige, and brand image matter above all else.',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ force: true });
    console.log('✅ Tables created');
    await Car.bulkCreate(cars);
    console.log(`✅ ${cars.length} cars seeded`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();