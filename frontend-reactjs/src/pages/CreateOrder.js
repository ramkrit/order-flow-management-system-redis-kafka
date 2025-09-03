import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { secureAxios } from '../utils/axios';
import { addOrder, setLoading, setError, clearError } from '../store/orderSlice';
import { logout } from '../store/authSlice';

const CreateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, currentOrder } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [amount, setAmount] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      dispatch(setError('Please enter a valid amount'));
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await secureAxios.post('/api/orders', {
        amount: parseFloat(amount),
      });

      if (response.data) {
        dispatch(addOrder(response.data));
        setShowSuccessDialog(true);
        setAmount('');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate('/login');
      } else {
        dispatch(setError(error.response?.data?.message || 'Failed to create order'));
      }
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleCreateNewOrder = () => {
    setShowSuccessDialog(false);
    dispatch(clearError());
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              mb: 3,
            }}
          >
            <Typography component="h1" variant="h4">
              Create Order
            </Typography>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount (e.g., 100.50)"
              disabled={loading}
              inputProps={{
                step: '0.01',
                min: '0',
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !amount || parseFloat(amount) <= 0}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Order'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleViewOrders}
              sx={{ mb: 2 }}
            >
              View Order History
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
        <DialogTitle>Order Created Successfully!</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Your order has been created with the following details:
          </Typography>
          {currentOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Order ID:</strong> {currentOrder.orderId}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> ₹{currentOrder.amount}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateNewOrder} variant="contained">
            Create Another Order
          </Button>
          <Button onClick={handleViewOrders} variant="outlined">
            View All Orders
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateOrder;
