/**
 * ============================================================
 * MOCK DATA - In-Memory Database for Tunisian Smart City
 * ============================================================
 * 
 * This file contains sample data for Points of Interest (POIs)
 * and Events across different zones in Tunis, Tunisia.
 * 
 * In a real application, this would be replaced with a database
 * like MongoDB, PostgreSQL, etc.
 * ============================================================
 */

// ============================================================
// ZONES - The 12 Tunisian areas/neighborhoods
// ============================================================
export const zones = [
  {
    id: "zone-1",
    name: "Ariana Center",
    description: "Commercial and residential hub in Ariana",
    coordinates: { latitude: 36.8663, longitude: 10.1647 }
  },
  {
    id: "zone-2",
    name: "Bab Bhar",
    description: "Historic gate area, entrance to the Medina",
    coordinates: { latitude: 36.7992, longitude: 10.1802 }
  },
  {
    id: "zone-3",
    name: "Charguia",
    description: "Business district with many companies",
    coordinates: { latitude: 36.8350, longitude: 10.2230 }
  },
  {
    id: "zone-4",
    name: "Jardin Thameur",
    description: "Central area near Thameur Garden",
    coordinates: { latitude: 36.8015, longitude: 10.1795 }
  },
  {
    id: "zone-5",
    name: "La Goulette",
    description: "Coastal town, famous for fish restaurants",
    coordinates: { latitude: 36.8181, longitude: 10.3050 }
  },
  {
    id: "zone-6",
    name: "La Marsa",
    description: "Upscale coastal suburb with beaches",
    coordinates: { latitude: 36.8783, longitude: 10.3247 }
  },
  {
    id: "zone-7",
    name: "République",
    description: "Central Tunis, administrative area",
    coordinates: { latitude: 36.8008, longitude: 10.1800 }
  },
  {
    id: "zone-8",
    name: "Sidi Bou Said",
    description: "Famous blue and white village, tourist attraction",
    coordinates: { latitude: 36.8687, longitude: 10.3417 }
  },
  {
    id: "zone-9",
    name: "Tunis Carthage Airport",
    description: "Main international airport of Tunisia",
    coordinates: { latitude: 36.8510, longitude: 10.2272 }
  },
  {
    id: "zone-10",
    name: "Tunis Center",
    description: "Downtown Tunis, main commercial area",
    coordinates: { latitude: 36.8065, longitude: 10.1815 }
  },
  {
    id: "zone-11",
    name: "Tunis Marine",
    description: "Port area with maritime activities",
    coordinates: { latitude: 36.8028, longitude: 10.2000 }
  },
  {
    id: "zone-12",
    name: "Bardo",
    description: "Home to the famous Bardo National Museum",
    coordinates: { latitude: 36.8094, longitude: 10.1342 }
  }
];

// ============================================================
// CATEGORIES - Types of Points of Interest
// ============================================================
export const categories = [
  { id: "cat-1", name: "Museum", icon: "🏛️" },
  { id: "cat-2", name: "Restaurant", icon: "🍽️" },
  { id: "cat-3", name: "Beach", icon: "🏖️" },
  { id: "cat-4", name: "Historic Site", icon: "🏰" },
  { id: "cat-5", name: "Park", icon: "🌳" },
  { id: "cat-6", name: "Shopping", icon: "🛍️" },
  { id: "cat-7", name: "Cafe", icon: "☕" },
  { id: "cat-8", name: "Religious Site", icon: "🕌" }
];

// ============================================================
// POINTS OF INTEREST (POIs) - Places to visit
// ============================================================
export let pointsOfInterest = [
  {
    id: "poi-1",
    name: "Bardo National Museum",
    description: "World's largest collection of Roman mosaics",
    categoryId: "cat-1",
    zoneId: "zone-12",
    address: "Route de Bizerte, Bardo",
    rating: 4.7,
    priceLevel: 2, // 1-4 scale ($ to $$$$)
    openingHours: "09:00-17:00",
    phoneNumber: "+216 71 513 650",
    imageUrl: "https://example.com/bardo.jpg",
    isOpen: true,
    reviews: [
      { id: "rev-1", author: "Ahmed", comment: "Magnifique!", rating: 5, date: "2024-01-15" },
      { id: "rev-2", author: "Sarah", comment: "A must visit", rating: 4, date: "2024-02-20" }
    ]
  },
  {
    id: "poi-2",
    name: "Café des Nattes",
    description: "Historic café with stunning views of Sidi Bou Said",
    categoryId: "cat-7",
    zoneId: "zone-8",
    address: "Rue Habib Thameur, Sidi Bou Said",
    rating: 4.5,
    priceLevel: 2,
    openingHours: "08:00-23:00",
    phoneNumber: "+216 71 740 587",
    imageUrl: "https://example.com/cafe-nattes.jpg",
    isOpen: true,
    reviews: [
      { id: "rev-3", author: "Mohamed", comment: "Best tea in Tunisia!", rating: 5, date: "2024-03-10" }
    ]
  },
  {
    id: "poi-3",
    name: "La Marsa Beach",
    description: "Popular sandy beach with restaurants nearby",
    categoryId: "cat-3",
    zoneId: "zone-6",
    address: "Corniche La Marsa",
    rating: 4.2,
    priceLevel: 1,
    openingHours: "24/7",
    phoneNumber: null,
    imageUrl: "https://example.com/marsa-beach.jpg",
    isOpen: true,
    reviews: []
  },
  {
    id: "poi-4",
    name: "Medina of Tunis",
    description: "UNESCO World Heritage site, ancient walled city",
    categoryId: "cat-4",
    zoneId: "zone-2",
    address: "Médina de Tunis",
    rating: 4.8,
    priceLevel: 1,
    openingHours: "Always accessible",
    phoneNumber: null,
    imageUrl: "https://example.com/medina.jpg",
    isOpen: true,
    reviews: [
      { id: "rev-4", author: "Emma", comment: "Incredible history!", rating: 5, date: "2024-01-28" },
      { id: "rev-5", author: "Karim", comment: "Must explore the souks", rating: 4, date: "2024-02-14" }
    ]
  },
  {
    id: "poi-5",
    name: "Belvedere Park",
    description: "Largest urban park in Tunis with zoo",
    categoryId: "cat-5",
    zoneId: "zone-10",
    address: "Avenue Taieb Mhiri",
    rating: 4.0,
    priceLevel: 1,
    openingHours: "06:00-19:00",
    phoneNumber: "+216 71 892 456",
    imageUrl: "https://example.com/belvedere.jpg",
    isOpen: true,
    reviews: []
  },
  {
    id: "poi-6",
    name: "Le Grand Bleu",
    description: "Famous fish restaurant by the sea",
    categoryId: "cat-2",
    zoneId: "zone-5",
    address: "Port de La Goulette",
    rating: 4.4,
    priceLevel: 3,
    openingHours: "12:00-23:00",
    phoneNumber: "+216 71 735 899",
    imageUrl: "https://example.com/grand-bleu.jpg",
    isOpen: true,
    reviews: [
      { id: "rev-6", author: "Fatma", comment: "Best couscous au poisson!", rating: 5, date: "2024-03-05" }
    ]
  },
  {
    id: "poi-7",
    name: "Zitouna Mosque",
    description: "One of the oldest and largest mosques in Tunisia",
    categoryId: "cat-8",
    zoneId: "zone-2",
    address: "Rue Jamaa Zitouna, Médina",
    rating: 4.9,
    priceLevel: 1,
    openingHours: "08:00-14:00 (non-Muslims)",
    phoneNumber: null,
    imageUrl: "https://example.com/zitouna.jpg",
    isOpen: true,
    reviews: []
  },
  {
    id: "poi-8",
    name: "Tunisia Mall",
    description: "Modern shopping center with international brands",
    categoryId: "cat-6",
    zoneId: "zone-1",
    address: "Les Berges du Lac 2",
    rating: 4.1,
    priceLevel: 3,
    openingHours: "10:00-22:00",
    phoneNumber: "+216 71 963 000",
    imageUrl: "https://example.com/mall.jpg",
    isOpen: true,
    reviews: []
  }
];

// ============================================================
// EVENTS - Upcoming events in the city
// ============================================================
export let events = [
  {
    id: "evt-1",
    title: "Carthage International Festival",
    description: "Annual music and arts festival at the Roman amphitheater",
    zoneId: "zone-8",
    startDate: "2026-07-10", // Future date
    endDate: "2026-08-20",
    time: "21:00",
    price: 50.0,
    currency: "TND",
    capacity: 5000,
    registeredCount: 3200,
    organizer: "Ministry of Culture",
    eventType: "FESTIVAL",
    isFree: false,
    isActive: true
  },
  {
    id: "evt-2",
    title: "Medina Heritage Walk",
    description: "Guided tour through the historic Medina",
    zoneId: "zone-2",
    startDate: "2025-12-20", // Future date
    endDate: "2025-12-20",
    time: "10:00",
    price: 0,
    currency: "TND",
    capacity: 30,
    registeredCount: 18,
    organizer: "Tunis Tourism Office",
    eventType: "TOUR",
    isFree: true,
    isActive: true
  },
  {
    id: "evt-3",
    title: "La Marsa Beach Cleanup",
    description: "Community event to clean the beach",
    zoneId: "zone-6",
    startDate: "2025-06-01", // Past date
    endDate: "2025-06-01",
    time: "08:00",
    price: 0,
    currency: "TND",
    capacity: 100,
    registeredCount: 45,
    organizer: "Green Tunisia NGO",
    eventType: "COMMUNITY",
    isFree: true,
    isActive: true
  },
  {
    id: "evt-4",
    title: "Tech Startup Conference",
    description: "Annual tech conference for Tunisian startups",
    zoneId: "zone-3",
    startDate: "2026-01-15", // Future date
    endDate: "2026-01-17",
    time: "09:00",
    price: 120.0,
    currency: "TND",
    capacity: 500,
    registeredCount: 280,
    organizer: "Startup Tunisia",
    eventType: "CONFERENCE",
    isFree: false,
    isActive: true
  },
  {
    id: "evt-5",
    title: "Ramadan Night Market",
    description: "Special night market during Ramadan",
    zoneId: "zone-10",
    startDate: "2026-02-20", // Future date
    endDate: "2026-03-22",
    time: "20:00",
    price: 0,
    currency: "TND",
    capacity: null,
    registeredCount: 0,
    organizer: "Tunis Municipality",
    eventType: "MARKET",
    isFree: true,
    isActive: true
  }
];

// ============================================================
// HELPER: Generate unique IDs
// ============================================================
export const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
