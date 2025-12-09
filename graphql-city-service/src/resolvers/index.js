/**
 * ============================================================
 * GRAPHQL RESOLVERS
 * ============================================================
 * 
 * Resolvers are functions that handle the actual data fetching
 * and manipulation for each field in the GraphQL schema.
 * 
 * Structure:
 * - Query resolvers: Handle data reading
 * - Mutation resolvers: Handle data creation/updates/deletes
 * - Type resolvers: Handle nested/related data
 * 
 * Each resolver receives 4 arguments:
 * - parent: The result from the parent resolver
 * - args: Arguments passed to the field
 * - context: Shared data across all resolvers (auth, db, etc.)
 * - info: Query execution information
 * ============================================================
 */

import {
  zones,
  categories,
  pointsOfInterest,
  events,
  generateId
} from '../data/mockData.js';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate average rating from reviews
 * @param {Array} reviews - Array of review objects
 * @returns {number} - Average rating or 0 if no reviews
 */
const calculateAverageRating = (pois) => {
  const allRatings = pois.filter(p => p.rating).map(p => p.rating);
  if (allRatings.length === 0) return 0;
  return allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
};

/**
 * Filter POIs based on provided criteria
 * @param {Object} filter - Filter object from query
 * @returns {Array} - Filtered POIs
 */
const filterPOIs = (filter) => {
  let results = [...pointsOfInterest];

  if (!filter) return results;

  if (filter.zoneId) {
    results = results.filter(poi => poi.zoneId === filter.zoneId);
  }

  if (filter.categoryId) {
    results = results.filter(poi => poi.categoryId === filter.categoryId);
  }

  if (filter.minRating) {
    results = results.filter(poi => poi.rating >= filter.minRating);
  }

  if (filter.maxPriceLevel) {
    results = results.filter(poi => poi.priceLevel <= filter.maxPriceLevel);
  }

  if (filter.isOpen !== undefined) {
    results = results.filter(poi => poi.isOpen === filter.isOpen);
  }

  if (filter.searchTerm) {
    const term = filter.searchTerm.toLowerCase();
    results = results.filter(poi =>
      poi.name.toLowerCase().includes(term) ||
      (poi.description && poi.description.toLowerCase().includes(term))
    );
  }

  return results;
};

/**
 * Filter events based on provided criteria
 */
const filterEvents = (filter) => {
  let results = [...events];

  if (!filter) return results;

  if (filter.zoneId) {
    results = results.filter(e => e.zoneId === filter.zoneId);
  }

  if (filter.eventType) {
    results = results.filter(e => e.eventType === filter.eventType);
  }

  if (filter.isFree !== undefined) {
    results = results.filter(e => e.isFree === filter.isFree);
  }

  if (filter.isActive !== undefined) {
    results = results.filter(e => e.isActive === filter.isActive);
  }

  if (filter.fromDate) {
    results = results.filter(e => e.startDate >= filter.fromDate);
  }

  if (filter.toDate) {
    results = results.filter(e => e.endDate <= filter.toDate);
  }

  return results;
};

// ============================================================
// RESOLVERS OBJECT
// ============================================================

export const resolvers = {
  // ==========================================================
  // QUERY RESOLVERS - Handle all read operations
  // ==========================================================
  Query: {
    // ----- ZONE QUERIES -----
    
    /**
     * Get all zones in the city
     * Example query:
     * query { zones { id name } }
     */
    zones: () => {
      console.log('📍 Fetching all zones...');
      return zones;
    },

    /**
     * Get a specific zone by ID
     * Example query:
     * query { zone(id: "zone-1") { name description } }
     */
    zone: (_, { id }) => {
      console.log(`📍 Fetching zone with ID: ${id}`);
      return zones.find(z => z.id === id);
    },

    /**
     * Search zones by name (case-insensitive)
     */
    searchZones: (_, { name }) => {
      const searchTerm = name.toLowerCase();
      return zones.filter(z => 
        z.name.toLowerCase().includes(searchTerm)
      );
    },

    // ----- CATEGORY QUERIES -----
    
    /**
     * Get all POI categories
     */
    categories: () => {
      console.log('🏷️ Fetching all categories...');
      return categories;
    },

    /**
     * Get a specific category by ID
     */
    category: (_, { id }) => {
      return categories.find(c => c.id === id);
    },

    // ----- POI QUERIES -----
    
    /**
     * Get all POIs with optional filtering and pagination
     * Example query:
     * query {
     *   pointsOfInterest(filter: { minRating: 4 }, limit: 5) {
     *     name rating zone { name }
     *   }
     * }
     */
    pointsOfInterest: (_, { filter, limit, offset = 0 }) => {
      console.log('🏛️ Fetching POIs with filter:', filter);
      
      let results = filterPOIs(filter);
      
      // Apply pagination
      if (offset) {
        results = results.slice(offset);
      }
      if (limit) {
        results = results.slice(0, limit);
      }
      
      return results;
    },

    /**
     * Get a specific POI by ID
     */
    pointOfInterest: (_, { id }) => {
      console.log(`🏛️ Fetching POI with ID: ${id}`);
      return pointsOfInterest.find(p => p.id === id);
    },

    /**
     * Get top-rated POIs
     */
    topRatedPOIs: (_, { limit = 5 }) => {
      return [...pointsOfInterest]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    },

    /**
     * Search POIs by name
     */
    searchPOIs: (_, { term }) => {
      const searchTerm = term.toLowerCase();
      return pointsOfInterest.filter(poi =>
        poi.name.toLowerCase().includes(searchTerm) ||
        (poi.description && poi.description.toLowerCase().includes(searchTerm))
      );
    },

    // ----- EVENT QUERIES -----
    
    /**
     * Get all events with optional filtering
     */
    events: (_, { filter, limit, offset = 0 }) => {
      console.log('🎉 Fetching events with filter:', filter);
      
      let results = filterEvents(filter);
      
      if (offset) results = results.slice(offset);
      if (limit) results = results.slice(0, limit);
      
      return results;
    },

    /**
     * Get a specific event by ID
     */
    event: (_, { id }) => {
      return events.find(e => e.id === id);
    },

    /**
     * Get upcoming events (sorted by start date)
     */
    upcomingEvents: (_, { limit = 10 }) => {
      const today = new Date().toISOString().split('T')[0];
      return events
        .filter(e => e.startDate >= today && e.isActive)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, limit);
    },

    /**
     * Get all free events
     */
    freeEvents: () => {
      return events.filter(e => e.isFree && e.isActive);
    },

    // ----- STATS QUERY -----
    
    /**
     * Get city statistics
     */
    cityStats: () => {
      const today = new Date().toISOString().split('T')[0];
      return {
        totalPOIs: pointsOfInterest.length,
        totalEvents: events.length,
        totalZones: zones.length,
        totalCategories: categories.length,
        averageRating: calculateAverageRating(pointsOfInterest),
        upcomingEventsCount: events.filter(e => e.startDate >= today && e.isActive).length
      };
    }
  },

  // ==========================================================
  // MUTATION RESOLVERS - Handle all write operations
  // ==========================================================
  Mutation: {
    /**
     * Create a new Point of Interest
     * Example mutation:
     * mutation {
     *   createPOI(input: {
     *     name: "New Restaurant"
     *     categoryId: "cat-2"
     *     zoneId: "zone-1"
     *   }) {
     *     id name
     *   }
     * }
     */
    createPOI: (_, { input }) => {
      console.log('➕ Creating new POI:', input.name);
      
      // Validate that category exists
      const categoryExists = categories.find(c => c.id === input.categoryId);
      if (!categoryExists) {
        throw new Error(`Category with ID ${input.categoryId} not found`);
      }
      
      // Validate that zone exists
      const zoneExists = zones.find(z => z.id === input.zoneId);
      if (!zoneExists) {
        throw new Error(`Zone with ID ${input.zoneId} not found`);
      }
      
      const newPOI = {
        id: generateId('poi'),
        name: input.name,
        description: input.description || null,
        categoryId: input.categoryId,
        zoneId: input.zoneId,
        address: input.address || null,
        rating: 0,
        priceLevel: input.priceLevel || 2,
        openingHours: input.openingHours || null,
        phoneNumber: input.phoneNumber || null,
        imageUrl: input.imageUrl || null,
        isOpen: true,
        reviews: []
      };
      
      pointsOfInterest.push(newPOI);
      console.log('✅ POI created with ID:', newPOI.id);
      
      return newPOI;
    },

    /**
     * Update an existing POI
     */
    updatePOI: (_, { id, input }) => {
      console.log(`✏️ Updating POI with ID: ${id}`);
      
      const poiIndex = pointsOfInterest.findIndex(p => p.id === id);
      if (poiIndex === -1) {
        throw new Error(`POI with ID ${id} not found`);
      }
      
      // Update fields
      const updatedPOI = {
        ...pointsOfInterest[poiIndex],
        ...input,
        id: id // Ensure ID doesn't change
      };
      
      pointsOfInterest[poiIndex] = updatedPOI;
      console.log('✅ POI updated');
      
      return updatedPOI;
    },

    /**
     * Delete a POI
     */
    deletePOI: (_, { id }) => {
      console.log(`🗑️ Deleting POI with ID: ${id}`);
      
      const poiIndex = pointsOfInterest.findIndex(p => p.id === id);
      if (poiIndex === -1) {
        return false;
      }
      
      pointsOfInterest.splice(poiIndex, 1);
      console.log('✅ POI deleted');
      
      return true;
    },

    /**
     * Add a review to a POI
     */
    addReview: (_, { input }) => {
      console.log(`📝 Adding review to POI: ${input.poiId}`);
      
      const poi = pointsOfInterest.find(p => p.id === input.poiId);
      if (!poi) {
        throw new Error(`POI with ID ${input.poiId} not found`);
      }
      
      // Validate rating
      if (input.rating < 1 || input.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      
      const newReview = {
        id: generateId('rev'),
        author: input.author,
        comment: input.comment,
        rating: input.rating,
        date: new Date().toISOString().split('T')[0]
      };
      
      poi.reviews.push(newReview);
      
      // Recalculate average rating
      const totalRating = poi.reviews.reduce((sum, r) => sum + r.rating, 0);
      poi.rating = Math.round((totalRating / poi.reviews.length) * 10) / 10;
      
      console.log('✅ Review added, new rating:', poi.rating);
      
      return poi;
    },

    /**
     * Create a new event
     */
    createEvent: (_, { input }) => {
      console.log('➕ Creating new event:', input.title);
      
      // Validate zone
      const zoneExists = zones.find(z => z.id === input.zoneId);
      if (!zoneExists) {
        throw new Error(`Zone with ID ${input.zoneId} not found`);
      }
      
      const isFree = !input.price || input.price === 0;
      
      const newEvent = {
        id: generateId('evt'),
        title: input.title,
        description: input.description || null,
        zoneId: input.zoneId,
        startDate: input.startDate,
        endDate: input.endDate,
        time: input.time || null,
        price: input.price || 0,
        currency: 'TND',
        capacity: input.capacity || null,
        registeredCount: 0,
        organizer: input.organizer || 'Unknown',
        eventType: input.eventType,
        isFree: isFree,
        isActive: true
      };
      
      events.push(newEvent);
      console.log('✅ Event created with ID:', newEvent.id);
      
      return newEvent;
    },

    /**
     * Register for an event
     */
    registerForEvent: (_, { input }) => {
      console.log(`📋 Registering for event: ${input.eventId}`);
      
      const event = events.find(e => e.id === input.eventId);
      if (!event) {
        throw new Error(`Event with ID ${input.eventId} not found`);
      }
      
      if (!event.isActive) {
        throw new Error('This event is no longer active');
      }
      
      if (event.capacity && event.registeredCount >= event.capacity) {
        throw new Error('This event is fully booked');
      }
      
      event.registeredCount += 1;
      console.log(`✅ Registration successful. Total: ${event.registeredCount}`);
      
      return event;
    },

    /**
     * Cancel an event
     */
    cancelEvent: (_, { id }) => {
      console.log(`❌ Cancelling event: ${id}`);
      
      const event = events.find(e => e.id === id);
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      
      event.isActive = false;
      console.log('✅ Event cancelled');
      
      return event;
    },

    /**
     * Delete an event
     */
    deleteEvent: (_, { id }) => {
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        return false;
      }
      
      events.splice(eventIndex, 1);
      return true;
    }
  },

  // ==========================================================
  // TYPE RESOLVERS - Handle nested/related data
  // ==========================================================
  
  /**
   * Zone type resolver - handles nested fields
   */
  Zone: {
    // When someone queries zone.pointsOfInterest, return POIs in that zone
    pointsOfInterest: (parent) => {
      return pointsOfInterest.filter(poi => poi.zoneId === parent.id);
    },
    
    // When someone queries zone.events, return events in that zone
    events: (parent) => {
      return events.filter(e => e.zoneId === parent.id);
    }
  },

  /**
   * Category type resolver
   */
  Category: {
    // Count of POIs in this category
    poiCount: (parent) => {
      return pointsOfInterest.filter(poi => poi.categoryId === parent.id).length;
    }
  },

  /**
   * PointOfInterest type resolver
   */
  PointOfInterest: {
    // Resolve the category object
    category: (parent) => {
      return categories.find(c => c.id === parent.categoryId);
    },
    
    // Resolve the zone object
    zone: (parent) => {
      return zones.find(z => z.id === parent.zoneId);
    },
    
    // Count of reviews
    reviewCount: (parent) => {
      return parent.reviews ? parent.reviews.length : 0;
    }
  },

  /**
   * Event type resolver
   */
  Event: {
    // Resolve the zone object
    zone: (parent) => {
      return zones.find(z => z.id === parent.zoneId);
    },
    
    // Calculate available spots
    availableSpots: (parent) => {
      if (!parent.capacity) return null;
      return parent.capacity - parent.registeredCount;
    }
  }
};