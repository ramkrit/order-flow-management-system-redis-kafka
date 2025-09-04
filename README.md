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
  
## Quick start visit the folders README.md file

```
order-flow-redis-kafka/
├── backend-nestjs/          # NestJS REST API
│   ├── README.md
├── frontend-reactjs/        # React.js frontend
│   ├── READMED.md
├── legacy-php/             # PHP order summary app
│   └── READMED.md
```


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
