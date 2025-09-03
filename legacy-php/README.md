# Legacy PHP Order Summary Application

A simple PHP web application that displays order summaries by fetching data from a REST API. This application is designed to work with an order management system that uses Redis and Kafka for data processing.

## Features

- **Order Summary Display**: View detailed order information including order ID, user ID, amount, and timestamps
- **Bootstrap UI**: Modern, responsive interface using Bootstrap 5.3.0
- **API Integration**: Connects to a REST API endpoint to fetch order data
- **JWT Authentication**: Uses Bearer token authentication for API requests
- **Error Handling**: Comprehensive error handling for various scenarios

## Prerequisites

- PHP 7.4 or higher
- Web server (Apache, Nginx, or built-in PHP server)
- cURL extension enabled
- Access to the order management API

## Installation

1. Clone or download this repository to your web server directory
2. Ensure PHP and required extensions are installed
3. Configure your web server to serve PHP files
4. Update the API endpoint URL in `order_summary.php` if needed

## Usage

### Basic Usage

1. Start your web server
2. Navigate to `order_summary.php` in your browser
3. Add an order ID as a URL parameter: `order_summary.php?order_id=YOUR_ORDER_ID`

### Example URLs

```
http://localhost/order_summary.php?order_id=1
http://localhost/order_summary.php?order_id=12345
```

### API Configuration

The application is configured to connect to:
- **API Endpoint**: `http://localhost:5000/api/orders/{orderId}`
- **Authentication**: JWT Bearer token (currently hardcoded for demo purposes)

**⚠️ Security Note**: In production, the authentication token should be obtained through proper login mechanisms, not hardcoded.

## API Response Format

The application expects the API to return order data in the following format:

```json
[
  {
    "id": "unique_id",
    "orderId": "order_number",
    "userId": "user_identifier",
    "amount": "order_amount",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

## Error Handling

The application handles various error scenarios:

- **No Order ID**: Displays a warning message with usage instructions
- **API Connection Failure**: Shows HTTP status codes and error details
- **Empty Response**: Informs when no order data is returned
- **Invalid Data**: Gracefully handles malformed API responses

## File Structure

```
legacy-php/
├── order_summary.php    # Main application file
└── README.md           # This documentation file
```

## Dependencies

- **Bootstrap 5.3.0**: CSS framework for responsive design
- **PHP cURL**: For making HTTP requests to the API

## Development

### Local Development

To run this application locally:

```bash
# Using PHP's built-in server
php -S localhost:8000

# Navigate to http://localhost:8000/order_summary.php
```

### Customization

- **Styling**: Modify Bootstrap classes or add custom CSS
- **API Endpoint**: Update the `$apiUrl` variable in the PHP code
- **Authentication**: Implement proper token management for production use




### Common Issues

1. **"Failed to fetch order data"**
   - Check if the API server is running
   - Verify the API endpoint URL is correct
   - Ensure the authentication token is valid

2. **"No Order Found"**
   - Verify the order ID exists in the system
   - Check API response format matches expected structure

3. **cURL errors**
   - Ensure PHP cURL extension is installed
   - Check network connectivity to the API server

### Debug Mode

To enable debug mode, you can modify the PHP code to display more detailed error information:

```php
// Add this before the cURL request
error_reporting(E_ALL);
ini_set('display_errors', 1);
```