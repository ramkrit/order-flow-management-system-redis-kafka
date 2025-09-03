<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Summary</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <h1 class="text-center mb-4">Order Summary</h1>
                
                <?php
                
                $orderId = isset($_GET['order_id']) ? $_GET['order_id'] : '';
                
                if (empty($orderId)) {
                    echo '<div class="alert alert-warning" role="alert">
                            <h4 class="alert-heading">No Order ID Provided!</h4>
                            <p>Please add ?order_id=YOUR_ORDER_ID to the URL to view order details.</p>
                            <hr>
                            <p class="mb-0">Example: order_summary.php?order_id=1</p>
                          </div>';
                } else {
                    // API endpoint
                    $apiUrl = "http://localhost:5000/api/orders/{$orderId}";
                    
                    // Authorization header with out any expiry time for demo purpose only (On production it will get after login)
                    $authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibW9iaWxlIjoiOTgxODMyMjcwMyJ9.ejQ2SXM84-0gQJMeoA2mA8y6mfYyh74_eiFj7Nu7794";
                    
                    
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $apiUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'accept: */*',
                        'Authorization: Bearer ' . $authToken
                    ]);
                    
                    
                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
                    
                    if ($httpCode === 200 && $response) {
                        $orderData = json_decode($response, true);
                        
                        if (is_array($orderData) && !empty($orderData)) {
                            foreach ($orderData as $order) {
                                // Format dates
                                $createdAt = new DateTime($order['createdAt']);
                                $updatedAt = new DateTime($order['updatedAt']);
                                ?>
                                
                                <div class="card shadow-sm mb-4">
                                    <div class="card-header bg-primary text-white">
                                        <h5 class="card-title mb-0">
                                            <i class="bi bi-receipt"></i> Order #<?php echo htmlspecialchars($order['orderId']); ?>
                                        </h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <h6 class="text-muted">Order Details</h6>
                                                <p><strong>Order ID:</strong> <?php echo htmlspecialchars($order['orderId']); ?></p>
                                                <p><strong>User ID:</strong> <?php echo htmlspecialchars($order['userId']); ?></p>
                                                <p><strong>Amount:</strong> <span class="badge bg-success fs-6">$<?php echo htmlspecialchars($order['amount']); ?></span></p>
                                            </div>
                                            <div class="col-md-6">
                                                <h6 class="text-muted">Timestamps</h6>
                                                <p><strong>Created:</strong> <?php echo $createdAt->format('M d, Y \a\t g:i A'); ?></p>
                                                <p><strong>Updated:</strong> <?php echo $updatedAt->format('M d, Y \a\t g:i A'); ?></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer text-muted">
                                        <small>Order ID: <?php echo htmlspecialchars($order['id']); ?></small>
                                    </div>
                                </div>
                                
                                <?php
                            }
                        } else {
                            echo '<div class="alert alert-info" role="alert">
                                    <h4 class="alert-heading">No Order Found!</h4>
                                    <p>No order data was returned for the provided order ID.</p>
                                  </div>';
                        }
                    } else {
                        echo '<div class="alert alert-danger" role="alert">
                                <h4 class="alert-heading">Error!</h4>
                                <p>Failed to fetch order data. HTTP Status: ' . $httpCode . '</p>';
                        
                        if ($response) {
                            echo '<hr><p class="mb-0"><strong>Response:</strong> ' . htmlspecialchars($response) . '</p>';
                        }
                        
                        echo '</div>';
                    }
                }
                ?>
            </div>
        </div>
    </div>
</body>
</html>
