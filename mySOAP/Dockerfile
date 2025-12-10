# Stage 1: Build the application with Maven
FROM maven:3.9.8-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy the Maven project files
COPY pom.xml ./
COPY .mvn/ .mvn/
COPY mvnw ./
COPY mvnw.cmd ./

# Download dependencies
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Stage 2: Create the final lightweight image
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/soap-air-quality-service-1.0.0.jar /app/soap-air-quality-service.jar

RUN mkdir -p /app/data
VOLUME /app/data

# Expose the port the application runs on
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "/app/soap-air-quality-service.jar"]
