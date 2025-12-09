# ============================================================ 
# DOCKERFILE - GraphQL City Service
# ============================================================ 
# Multi-stage build for smaller production image
# Stage 1: Install dependencies
# Stage 2: Run the application
# ============================================================ 

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# ============================================================ 
# Stage 2: Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S graphql -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/schema.graphql ./

# Change ownership to non-root user
RUN chown -R graphql:nodejs /app

# Switch to non-root user
USER graphql

# Expose the port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "src/index.js"]
