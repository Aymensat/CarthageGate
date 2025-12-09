/**
 * ============================================================
 * GRAPHQL TYPE DEFINITIONS (SDL - Schema Definition Language)
 * ============================================================
 * 
 * This file defines the structure of our GraphQL API:
 * - Types: Define the shape of data (like classes/interfaces)
 * - Queries: Define what data clients can READ
 * - Mutations: Define what data clients can CREATE/UPDATE/DELETE
 * - Enums: Define fixed sets of values
 * - Input Types: Define the shape of data for mutations
 * 
 * Documentation: Comments starting with """ become part of
 * the GraphQL schema documentation (visible in playground)
 * ============================================================
 */

export const typeDefs = `#graphql

  # ============================================================
  # CUSTOM SCALAR TYPES (not used here, but good to know)
  # scalar Date - could define custom date handling
  # ============================================================

  # ============================================================
  # ENUM TYPES - Fixed set of possible values
  # ============================================================
  
  """
  Types of events that can occur in the city
  """
  enum EventType {
    FESTIVAL
    CONCERT
    CONFERENCE
    TOUR
    COMMUNITY
    MARKET
    SPORTS
    EXHIBITION
  }

  """
  Price level indicator (1 = cheap, 4 = expensive)
  """
  enum PriceLevel {
    BUDGET      # $
    MODERATE    # $$
    EXPENSIVE   # $$$
    LUXURY      # $$$$
  }

  # ============================================================
  # OBJECT TYPES - Define the shape of data objects
  # ============================================================

  """
  Geographic coordinates for a location
  """
  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  """
  A zone/neighborhood in the city of Tunis
  """
  type Zone {
    "Unique identifier for the zone"
    id: ID!
    "Name of the zone (e.g., 'Sidi Bou Said')"
    name: String!
    "Description of the zone"
    description: String
    "GPS coordinates of the zone center"
    coordinates: Coordinates
    "List of all POIs in this zone"
    pointsOfInterest: [PointOfInterest!]!
    "List of all events happening in this zone"
    events: [Event!]!
  }

  """
  Category for points of interest (Museum, Restaurant, etc.)
  """
  type Category {
    id: ID!
    name: String!
    "Emoji icon representing the category"
    icon: String
    "Number of POIs in this category"
    poiCount: Int!
  }

  """
  A user review for a point of interest
  """
  type Review {
    id: ID!
    author: String!
    comment: String!
    rating: Int!
    date: String!
  }

  """
  A Point of Interest (POI) - places to visit in the city
  """
  type PointOfInterest {
    id: ID!
    name: String!
    description: String
    "The category of this POI"
    category: Category
    "The zone where this POI is located"
    zone: Zone
    address: String
    "Average rating (1-5)"
    rating: Float
    "Price level: 1=Budget, 2=Moderate, 3=Expensive, 4=Luxury"
    priceLevel: Int
    openingHours: String
    phoneNumber: String
    imageUrl: String
    "Is the POI currently open?"
    isOpen: Boolean!
    "User reviews for this POI"
    reviews: [Review!]!
    "Total number of reviews"
    reviewCount: Int!
  }

  """
  An event happening in the city
  """
  type Event {
    id: ID!
    title: String!
    description: String
    "The zone where the event takes place"
    zone: Zone
    startDate: String!
    endDate: String!
    time: String
    "Ticket price (0 if free)"
    price: Float!
    currency: String!
    "Maximum number of attendees"
    capacity: Int
    "Current number of registrations"
    registeredCount: Int!
    "Number of spots still available"
    availableSpots: Int
    organizer: String
    eventType: EventType!
    isFree: Boolean!
    isActive: Boolean!
  }

  """
  Statistics about the city's POIs and events
  """
  type CityStats {
    totalPOIs: Int!
    totalEvents: Int!
    totalZones: Int!
    totalCategories: Int!
    averageRating: Float!
    upcomingEventsCount: Int!
  }

  # ============================================================
  # INPUT TYPES - Used for mutations (creating/updating data)
  # ============================================================

  """
  Input for creating a new Point of Interest
  """
  input CreatePOIInput {
    name: String!
    description: String
    categoryId: ID!
    zoneId: ID!
    address: String
    priceLevel: Int
    openingHours: String
    phoneNumber: String
    imageUrl: String
  }

  """
  Input for adding a review to a POI
  """
  input AddReviewInput {
    poiId: ID!
    author: String!
    comment: String!
    rating: Int!
  }

  """
  Input for creating a new event
  """
  input CreateEventInput {
    title: String!
    description: String
    zoneId: ID!
    startDate: String!
    endDate: String!
    time: String
    price: Float
    capacity: Int
    organizer: String
    eventType: EventType!
  }

  """
  Input for registering to an event
  """
  input EventRegistrationInput {
    eventId: ID!
    attendeeName: String!
    attendeeEmail: String!
  }

  # ============================================================
  # FILTER INPUT TYPES - For flexible querying
  # ============================================================

  """
  Filter options for POI queries
  """
  input POIFilter {
    "Filter by zone ID"
    zoneId: ID
    "Filter by category ID"
    categoryId: ID
    "Minimum rating (1-5)"
    minRating: Float
    "Maximum price level (1-4)"
    maxPriceLevel: Int
    "Only show currently open POIs"
    isOpen: Boolean
    "Search in name or description"
    searchTerm: String
  }

  """
  Filter options for Event queries
  """
  input EventFilter {
    zoneId: ID
    eventType: EventType
    isFree: Boolean
    isActive: Boolean
    "Start date (YYYY-MM-DD format)"
    fromDate: String
    "End date (YYYY-MM-DD format)"
    toDate: String
  }

  # ============================================================
  # QUERY TYPE - All READ operations
  # ============================================================

  """
  Root Query type - all data fetching operations
  """
  type Query {
    # ----- ZONE QUERIES -----
    "Get all zones in the city"
    zones: [Zone!]!
    
    "Get a specific zone by ID"
    zone(id: ID!): Zone

    "Search zones by name"
    searchZones(name: String!): [Zone!]!

    # ----- CATEGORY QUERIES -----
    "Get all POI categories"
    categories: [Category!]!
    
    "Get a specific category by ID"
    category(id: ID!): Category

    # ----- POI QUERIES -----
    "Get all points of interest (with optional filters)"
    pointsOfInterest(filter: POIFilter, limit: Int, offset: Int): [PointOfInterest!]!
    
    "Get a specific POI by ID"
    pointOfInterest(id: ID!): PointOfInterest
    
    "Get top-rated POIs"
    topRatedPOIs(limit: Int = 5): [PointOfInterest!]!

    "Search POIs by name"
    searchPOIs(term: String!): [PointOfInterest!]!

    # ----- EVENT QUERIES -----
    "Get all events (with optional filters)"
    events(filter: EventFilter, limit: Int, offset: Int): [Event!]!
    
    "Get a specific event by ID"
    event(id: ID!): Event
    
    "Get upcoming events"
    upcomingEvents(limit: Int = 10): [Event!]!

    "Get free events"
    freeEvents: [Event!]!

    # ----- STATS -----
    "Get city statistics"
    cityStats: CityStats!
  }

  # ============================================================
  # MUTATION TYPE - All WRITE operations
  # ============================================================

  """
  Root Mutation type - all data modification operations
  """
  type Mutation {
    # ----- POI MUTATIONS -----
    "Create a new Point of Interest"
    createPOI(input: CreatePOIInput!): PointOfInterest!
    
    "Update an existing POI"
    updatePOI(id: ID!, input: CreatePOIInput!): PointOfInterest
    
    "Delete a POI"
    deletePOI(id: ID!): Boolean!
    
    "Add a review to a POI"
    addReview(input: AddReviewInput!): PointOfInterest

    # ----- EVENT MUTATIONS -----
    "Create a new event"
    createEvent(input: CreateEventInput!): Event!
    
    "Register for an event"
    registerForEvent(input: EventRegistrationInput!): Event
    
    "Cancel an event"
    cancelEvent(id: ID!): Event

    "Delete an event"
    deleteEvent(id: ID!): Boolean!
  }

  # ============================================================
  # SUBSCRIPTION TYPE (Optional - for real-time updates)
  # Not implemented here, but shows the concept
  # ============================================================
  
  # type Subscription {
  #   "Get notified when a new event is created"
  #   eventCreated: Event!
  #   "Get notified when a POI gets a new review"
  #   reviewAdded(poiId: ID!): Review!
  # }
`;