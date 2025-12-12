/**
 * ============================================================
 * GRAPHQL EXPRESS SERVER - Main Entry Point
 * ============================================================
 * 
 * This file sets up:
 * 1. Express.js web server
 * 2. Apollo GraphQL server
 * 3. Middleware (CORS, body-parser)
 * 4. GraphQL endpoint at /graphql
 * 
 * Apollo Server 4 integrates with Express via middleware pattern.
 * The GraphQL Playground is available at /graphql in browser.
 * ============================================================
 */

// ============================================================
// IMPORTS
// ============================================================

// Express - minimalist web framework for Node.js
import express from 'express';

// Apollo Server - GraphQL server implementation

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';



// Middleware to connect Apollo Server with Express

import { expressMiddleware } from '@apollo/server/express4';

// CORS - allows cross-origin requests (needed for web clients)
import cors from 'cors';

// Body Parser - parses incoming request bodies (JSON)
import bodyParser from 'body-parser';

// Our GraphQL schema and resolvers
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';

// ============================================================
// CONFIGURATION
// ============================================================

// Port configuration - can be overridden with environment variable
const PORT = process.env.PORT || 4000;

// Service information for health checks
const SERVICE_INFO = {
  name: 'GraphQL City Service',
  version: '1.0.0',
  description: 'Points of Interest & Events Service for Smart City Tunisia',
  protocol: 'GraphQL',
  endpoints: {
    graphql: '/graphql',
    health: '/health'
  }
};

// ============================================================
// MAIN FUNCTION - Server Setup
// ============================================================

async function startServer() {
  // ----------------------------------------------------------
  // Step 1: Create Express application
  // ----------------------------------------------------------
  const app = express();

  // ----------------------------------------------------------
  // Step 2: Create Apollo Server instance
  // Apollo Server handles GraphQL query parsing and execution
  // ----------------------------------------------------------
  const apolloServer = new ApolloServer({
    // The GraphQL schema definition
    typeDefs,
    
    // The resolver functions
    resolvers,
    
    // Disable CSRF prevention for this project to allow proxying
    csrfPrevention: false,

    // Introspection allows tools to discover the schema
    // Enable in development, might disable in production
    introspection: true,

    // Enable the landing page in all environments
    plugins: [
      ApolloServerPluginLandingPageLocalDefault(),
    ],
    
    // Format errors for better debugging
    formatError: (error) => {
      console.error('❌ GraphQL Error:', error.message);
      return {
        message: error.message,
        path: error.path,
        // In production, you might want to hide the stack trace
        extensions: {
          code: error.extensions?.code || 'INTERNAL_ERROR'
        }
      };
    }
  });

  // ----------------------------------------------------------
  // Step 3: Start Apollo Server
  // Must be started before applying middleware
  // ----------------------------------------------------------
  await apolloServer.start();
  console.log('🚀 Apollo Server started');

  // ----------------------------------------------------------
  // Step 4: Apply Middleware
  // ----------------------------------------------------------
  
  // Apply CORS and JSON body parser globally
  app.use(cors());
  app.use(bodyParser.json());

  // Apply Apollo Server as middleware on /graphql route
  // This handles all GraphQL requests
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      // Context function - runs for every request
      // Add shared data like auth, database connections, etc.
      context: async ({ req }) => {
        // You could add authentication here:
        // const token = req.headers.authorization;
        // const user = await validateToken(token);
        // return { user };
        
        return {
          // Request timestamp for logging
          timestamp: new Date().toISOString()
        };
      }
    })
  );

  // ----------------------------------------------------------
  // Step 5: Additional REST Endpoints (optional but useful)
  // ----------------------------------------------------------

  /**
   * Health check endpoint
   * Useful for Docker, Kubernetes, load balancers
   */
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: SERVICE_INFO.name,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  /**
   * Service info endpoint
   */
  app.get('/', (req, res) => {
    res.json({
      ...SERVICE_INFO,
      links: {
        graphql: `http://localhost:${PORT}/graphql`,
        graphqlPlayground: `http://localhost:${PORT}/graphql`,
        health: `http://localhost:${PORT}/health`
      },
      documentation: {
        sdl: 'Available at /graphql endpoint via introspection',
        readme: 'See schema.graphql file for SDL documentation'
      }
    });
  });

  // ----------------------------------------------------------
  // Step 6: Start Express Server
  // ----------------------------------------------------------
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║   🌍 GraphQL City Service - Smart City Tunisia 🇹🇳       ║');
    console.log('║                                                          ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║                                                          ║');
    console.log(`║   🚀 Server running at: http://localhost:${PORT}            ║`);
    console.log(`║   📊 GraphQL Endpoint:  http://localhost:${PORT}/graphql    ║`);
    console.log(`║   💚 Health Check:      http://localhost:${PORT}/health     ║`);
    console.log('║                                                          ║');
    console.log('║   📝 Open /graphql in browser for GraphQL Playground    ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
  });
}

// ============================================================
// ERROR HANDLING
// ============================================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// ============================================================
// START THE SERVER
// ============================================================

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});