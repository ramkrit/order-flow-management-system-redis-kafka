# Order Flow Management System

A comprehensive order management system built with modern technologies including NestJS, React, Redis, Kafka, and a legacy PHP application for order summaries.

## Kafka Topic List

| Topic Name | Sample Payload |
|------------|---------|----------------|
| `orders.created` | `{"orderId": "OID0008", "userId": 1, "amount": 50.99, "timestamp": "2025-09-03T18:05:10.000Z"}` |

## Architecture Overview

This system consists of three main components:

1. **Backend (NestJS)** - REST API with OTP authentication, order management, Redis caching, and Kafka messaging
2. **Frontend (React)** - Modern web interface for order management and authentication
3. **Legacy PHP** - Simple order summary display application

## Prerequisites

- Node.js (v16 or higher)
- PHP 7.4 or higher
- Docker and Docker Compose
- npm

## Quick Start

### 1. Infrastructure Setup

**Start Redis:**
```bash
docker run -d --name redis-server -p 6379:6379 redis
```

**Start Zookeeper:**
```bash
docker run -d --name zookeeper -p 2181:2181 confluentinc/cp-zookeeper:6.2.10 \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000
```

**Start Kafka (replace IP with your local IP):**
```bash
docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=192.168.1.12:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.12:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:6.2.10
```

### 2. Backend Setup

```bash
cd backend-nestjs
npm install

# Create .env file with database, Redis, Kafka, and JWT configuration
# Run database migrations and seeding
npm run db:migrate
npm run db:seed

# Start the application
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend-reactjs
npm install

# Create .env file
echo "REACT_APP_BASE_URL=http://localhost:5000" > .env

# Start development server
npm start
```

### 4. Legacy PHP Application

```bash
cd legacy-php
# Using PHP's built-in server
php -S localhost:8000

# Access: http://localhost:8000/order_summary.php?order_id=1
```

## Environment Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=order_flow_db
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKERS=localhost:9092
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### Frontend (.env)
```env
REACT_APP_BASE_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /auth/request-otp` - Request OTP for phone number
- `POST /auth/verify-otp` - Verify OTP and get JWT token

### Orders
- `GET /orders` - Get all orders (requires authentication)
- `POST /orders` - Create a new order (requires authentication)
- `GET /orders/:id` - Get order by ID (requires authentication)

## Features

### Backend Features
- **OTP Authentication**: Phone number-based authentication with OTP verification
- **Order Management**: Create and retrieve orders with real-time processing
- **Redis Integration**: Caching and session management
- **Kafka Integration**: Message queuing for order processing
- **Database Migrations**: Automated database schema management
- **JWT Authorization**: Secure API endpoints with JWT tokens

### Frontend Features
- **Modern React Interface**: Built with React.js and Redux for state management
- **OTP-based Authentication**: Secure login flow with phone number verification
- **Order Management**: Create orders and view order history
- **Responsive Design**: Mobile-friendly user interface

### Legacy PHP Features
- **Order Summary Display**: View detailed order information
- **Bootstrap UI**: Modern, responsive interface using Bootstrap 5.3.0
- **API Integration**: Connects to the NestJS REST API
- **JWT Authentication**: Uses Bearer token authentication
- **Error Handling**: Comprehensive error handling for various scenarios

## Troubleshooting

### Common Issues

1. **Redis Connection Error**
   - Ensure Redis container is running: `docker ps | grep redis`
   - Check port availability: `netstat -an | grep 6379`
   - Restart Redis: `docker restart redis-server`

2. **Kafka Connection Error**
   - Verify both Zookeeper and Kafka containers are running
   - Check ports 2181 and 9092 availability
   - Update IP address in Kafka configuration

3. **Database Migration Errors**
   - Ensure database server is running
   - Verify credentials in `.env` file
   - Check if database exists

4. **API Connection Issues**
   - Verify backend server is running on correct port
   - Check API endpoint URLs in frontend and PHP applications
   - Ensure JWT tokens are valid

## Development

### Running in Development Mode

- **Backend**: `npm run start:dev` (hot reload enabled)
- **Frontend**: `npm start` (hot reload enabled)
- **PHP**: `php -S localhost:8000` (manual refresh required)

### Building for Production

- **Backend**: `npm run build && npm run start:prod`
- **Frontend**: `npm run build`
- **PHP**: No build step required

## Project Structure

```
order-flow-redis-kafka/
├── backend-nestjs/          # NestJS REST API
│   ├── src/                 # Source code
│   ├── migrations/          # Database migrations
│   ├── seeders/            # Database seeders
│   └── config/             # Configuration files
├── frontend-reactjs/        # React.js frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   └── components/         # React components
├── legacy-php/             # PHP order summary app
│   └── order_summary.php   # Main application file
└── README.md              # This file
```
