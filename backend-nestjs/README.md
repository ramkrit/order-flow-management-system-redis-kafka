
## Description

Order Flow Management System with Redis, Kafka, and NestJS. This application provides authentication with OTP, order management, and real-time messaging capabilities.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm

## Setup Instructions

### Step 1: Start Redis with Docker

```bash
docker run -d --name redis-server -p 6379:6379 redis
```

### Step 2: Start Kafka with Docker

First, start Zookeeper:
```bash
docker run -d --name zookeeper -p 2181:2181 confluentinc/cp-zookeeper:6.2.10 \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000
```

Then start Kafka (replace `192.168.1.12` with your local IP):
```bash
docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=192.168.1.12:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.12:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:6.2.10
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Environment Configuration

Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=order_flow_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka Configuration
KAFKA_BROKERS=localhost:9092

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Application Configuration
PORT=3000
```

### Step 5: Database Setup

Run database migrations:
```bash
npm run db:migrate
```

Seed the database with initial data:
```bash
npm run db:seed
```

## Running the Application

### Development Mode

```bash
# Start in development mode
npm run start

# Start in watch mode (recommended for development)
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

The application will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /auth/request-otp` - Request OTP for phone number
- `POST /auth/verify-otp` - Verify OTP and get JWT token

### Orders
- `GET /orders` - Get all orders (requires authentication)
- `POST /orders` - Create a new order (requires authentication)
- `GET /orders/:id` - Get order by ID (requires authentication)


### Common Issues

1. **Redis Connection Error**
   - Ensure Redis container is running: `docker ps | grep redis`
   - Check if port 6379 is available: `netstat -an | grep 6379`
   - Restart Redis container: `docker restart redis-server`

2. **Kafka Connection Error**
   - Verify both Zookeeper and Kafka containers are running
   - Check if ports 2181 and 9092 are available
   - Update the IP address in Kafka configuration to match your local machine's IP

3. **Database Migration Errors**
   - Ensure your database server is running
   - Verify database credentials in `.env` file
   - Check if the database exists or create it manually

4. **JWT Token Issues**
   - Verify JWT_SECRET is set in `.env` file
   - Check token expiration settings



## Features

- **OTP Authentication**: Phone number-based authentication with OTP verification
- **Order Management**: Create and retrieve orders with real-time processing
- **Redis Integration**: Caching and session management
- **Kafka Integration**: Message queuing for order processing
- **Database Migrations**: Automated database schema management
- **JWT Authorization**: Secure API endpoints with JWT tokens