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
} from '@mui/material';
import { basicAxios } from '../utils/axios';
import {
  setLoading,
  setError,
  setMobile,
  setOtpRequested,
  loginSuccess,
  clearError,
} from '../store/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, mobile, otpRequested } = useSelector((state) => state.auth);

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/create-order');
    }
  }, [navigate]);

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length !== 10) {
      dispatch(setError('Please enter a valid 10-digit mobile number'));
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await basicAxios.post('/api/auth/request-otp', {
        mobile: mobileNumber,
      });
      
      if (response.status === 200) {
        console.log(response.data);
        dispatch(setMobile(mobileNumber));
        dispatch(setOtpRequested(true));
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to request OTP'));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      dispatch(setError('Please enter a valid 6-digit OTP'));
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await basicAxios.post('/api/auth/verify-otp', {
        mobile: mobileNumber,
        otp: otp,
      });

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        dispatch(loginSuccess(response.data));
        navigate('/create-order');
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Invalid OTP'));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
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
          <Typography component="h1" variant="h4" gutterBottom>
            Login with OTP
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {!otpRequested ? (
            <Box component="form" onSubmit={handleMobileSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mobile Number"
                type="tel"
                value={mobileNumber}
                onChange={handleMobileChange}
                placeholder="Enter 10-digit mobile number"
                inputProps={{ maxLength: 10 }}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !mobileNumber || mobileNumber.length !== 10}
              >
                {loading ? <CircularProgress size={24} /> : 'Request OTP'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleOtpSubmit} sx={{ width: '100%' }}>
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                OTP sent to {mobileNumber}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="OTP"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                inputProps={{ maxLength: 6 }}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !otp || otp.length !== 6}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  dispatch(setOtpRequested(false));
                  setOtp('');
                  dispatch(clearError());
                }}
                disabled={loading}
              >
                Change Mobile Number
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
