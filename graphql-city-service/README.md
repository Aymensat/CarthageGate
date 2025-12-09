# 🏙️ GraphQL City Service - Smart City Tunisia

A GraphQL microservice for managing Points of Interest (POIs) and Events in Tunisian cities.

## 📋 Project Information

- **Course**: Service Oriented Computing
- **Year**: 2025-2026
- **Protocol**: GraphQL
- **Runtime**: Node.js with Express.js

## 🗺️ Available Zones

- Ariana Center
- Bab Bhar
- Charguia
- Jardin Thameur
- La Goulette
- La Marsa
- République
- Sidi Bou Said
- Tunis Carthage Airport
- Tunis Center
- Tunis Marine
- Bardo

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd graphql-city-service

# Install dependencies
npm install

# Start the server
npm run dev
```
### Access the Service
- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health
- **Service Info**: http://localhost:4000/

---

## 📊 Example Queries

### Get All Zones
```graphql
query {
  zones {
    id
    name
    description
  }
}
```

### Get POIs with Filters
```graphql
query {
  pointsOfInterest(filter: { minRating: 4 }) {
    name
    rating
    zone {
      name
    }
    category {
      name
      icon
    }
  }
}
```

### Get Top Rated POIs
```graphql
query {
  topRatedPOIs(limit: 3) {
    name
    rating
    address
    reviews {
      author
      comment
    }
  }
}
```

### Get Upcoming Events
```graphql
query {
  upcomingEvents(limit: 5) {
    title
    zone {
      name
    }
    startDate
    price
    isFree
    availableSpots
  }
}
```

### Get City Statistics
```graphql
query {
  cityStats {
    totalPOIs
    totalEvents
    totalZones
    averageRating
    upcomingEventsCount
  }
}
```

---

## ✏️ Example Mutations

### Create a New POI
```graphql
mutation {
  createPOI(input: {
    name: "Café Saf Saf"
    description: "Traditional café under a giant tree"
    categoryId: "cat-7"
    zoneId: "zone-6"
    address: "Avenue de la Liberté, La Marsa"
    priceLevel: 2
    openingHours: "08:00-22:00"
  }) {
    id
    name
    zone {
      name
    }
  }
}
```

### Add a Review
```graphql
mutation {
  addReview(input: {
    poiId: "poi-1"
    author: "Yassine"
    comment: "Incredible mosaics, a must visit!"
    rating: 5
  }) {
    name
    rating
    reviews {
      author
      comment
      date
    }
  }
}
```

### Register for an Event
```graphql
mutation {
  registerForEvent(input: {
    eventId: "evt-2"
    attendeeName: "Amine"
    attendeeEmail: "amine@example.com"
  }) {
    title
    registeredCount
    availableSpots
  }
}
```

---

## 🐳 Docker

### Build and Run
```bash
# Build the image
docker build -t graphql-city-service .

# Run the container
docker run -p 4000:4000 graphql-city-service
```

---

## 📁 Project Structure

```text
graphql-city-service/
├── package.json           # Project dependencies
├── Dockerfile            # Docker configuration
├── schema.graphql        # SDL documentation
├── README.md             # This file
└── src/
    ├── index.js          # Express server entry point
    ├── schema/
    │   └── typeDefs.js   # GraphQL type definitions
    ├── resolvers/
    │   └── index.js      # Resolver functions
    └── data/
        └── mockData.js   # In-memory data
```

---

## 📚 Documentation

- **SDL Schema**: See `schema.graphql` file
- **Interactive Docs**: Open http://localhost:4000/graphql and click "Docs"

---
Made with ❤️ in Tunisia 🇹🇳
