const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const emergencyRoutes = require("./routes/emergency"); // Import gRPC emergency routes
const airQualityRoutes = require("./routes/airQuality"); // Import SOAP air quality routes

const app = express();
const port = 3001;

// Logging middleware to see incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

// Simple root endpoint for testing connectivity
app.get("/", (req, res) => {
  res.send("Hello Gateway!");
});

// Proxy for REST Mobility Service API endpoints
// TEMPORARY: Using localhost for testing against locally running Docker services
app.use(
  "/mobility",
  proxy("http://rest-service:8080", {
    proxyReqPathResolver: function (req) {
      console.log(`Resolving path for /mobility: original path = ${req.path}`);
      if (req.path === "/api-docs") {
        console.log("  -> Resolved to /v3/api-docs");
        return "/v3/api-docs";
      }
      const resolvedPath = `/api${req.path}`;
      console.log(`  -> Resolved to ${resolvedPath}`);
      return resolvedPath;
    },
  })
);

// Proxy for GraphQL City Service
// TEMPORARY: Using localhost for testing against locally running Docker services
app.use(
  "/graphql",
  proxy("http://graphql-service:4000", {
    proxyReqPathResolver: function (req) {
      console.log(`[GraphQL Proxy] Resolving for: ${req.originalUrl}`);
      return "/graphql"; // Explicitly send all /graphql gateway requests to /graphql on the backend
    },
  })
);

// Routes for gRPC Emergency Alert Service
app.use("/emergency", emergencyRoutes);

// Routes for SOAP Air Quality Service
app.use("/air-quality", airQualityRoutes);

// Proxy for Orchestrator Service
// TEMPORARY: Using localhost for testing against locally running Docker services
app.use(
  "/orchestrator",
  proxy("http://orchestrator:3000", {
    proxyReqPathResolver: function (req) {
      return `/api${req.path}`;
    },
  })
);

// Proxy for Chatbot Service
app.use(
  "/chat",
  proxy("http://chatbot-service:8000", {
    proxyReqPathResolver: function (req) {
      console.log(`[Chatbot Proxy] Forwarding request to chatbot-service: ${req.url}`);
      return req.url;
    },
  })
);

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
