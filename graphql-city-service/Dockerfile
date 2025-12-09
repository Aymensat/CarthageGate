# Stage 1: Build dependencies
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy all source files
COPY . .

# Stage 2: Create the final production image
FROM node:20-slim

# Set environment to production
ENV NODE_ENV production

# Set the working directory
WORKDIR /app

# Copy installed dependencies and source code from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/schema.graphql ./schema.graphql

# Expose the port the application runs on
EXPOSE 4000

# Command to run the application
CMD ["node", "src/index.js"]