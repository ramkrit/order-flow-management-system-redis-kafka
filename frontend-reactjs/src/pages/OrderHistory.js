import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { secureAxios } from '../utils/axios';
import { setOrders, setLoading, setError, clearError } from '../store/orderSlice';
import { logout } from '../store/authSlice';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await secureAxios.get('/api/orders');
      if (response.data) {
        dispatch(setOrders(response.data));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate('/login');
      } else {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch orders'));
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleCreateOrder = () => {
    navigate('/create-order');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography component="h1" variant="h4">
              Order History
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={handleCreateOrder}
                sx={{ mr: 2 }}
              >
                Create New Order
              </Button>
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {orders.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body1">
                Start by creating your first order!
              </Typography>
              <Button
                variant="contained"
                onClick={handleCreateOrder}
                sx={{ mt: 2 }}
              >
                Create Order
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Chip
                          label={order.orderId}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {formatAmount(order.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {loading && orders.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderHistory;
