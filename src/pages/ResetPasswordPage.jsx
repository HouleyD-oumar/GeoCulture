import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updatePassword, loading, error } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hashPresent, setHashPresent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Check for hash fragment on load
  useEffect(() => {
    const checkHash = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        setHashPresent(true);
        
        // Extract access token from URL
        const accessToken = hash
          .substring(1)
          .split('&')
          .find(param => param.startsWith('access_token='))
          ?.split('=')[1];
          
        if (accessToken) {
          // Set the session with Supabase
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: null
          });
          
          if (error) {
            setFormError('Invalid or expired reset link. Please request a new one.');
            setHashPresent(false);
          }
        } else {
          setFormError('Invalid reset link. Please request a new one.');
          setHashPresent(false);
        }
      } else {
        setHashPresent(false);
        setFormError('No reset token found. Please request a password reset from the login page.');
      }
    };
    
    checkHash();
  }, []);
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);
  
  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'error';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    if (passwordStrength < 100) return 'Strong';
    return 'Very Strong';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    
    if (!password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    if (passwordStrength < 50) {
      setFormError('Please choose a stronger password');
      return;
    }
    
    const { error } = await updatePassword(password);
    
    if (error) {
      setFormError(error.message);
    } else {
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('auth.newPasswordTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('auth.newPasswordSubtitle')}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Password has been reset successfully! Redirecting to login...
          </Alert>
        )}
        
        {hashPresent ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label={t('auth.password')}
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={success}
              helperText={password ? `${t('auth.passwordStrength', 'Password strength')}: ${getStrengthLabel()}` : t('auth.passwordRequirements', 'At least 8 characters with uppercase, lowercase and numbers')}
            />
            
            {password && (
              <Box sx={{ mb: 2, mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  color={getStrengthColor()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
            
            <TextField
              label={t('auth.confirmPassword')}
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={success}
              error={confirmPassword && password !== confirmPassword}
              helperText={confirmPassword && password !== confirmPassword ? t('password.mismatch') : ''}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || success}
            >
              {loading ? <CircularProgress size={24} /> : t('auth.resetPassword')}
            </Button>
          </Box>
        ) : (
          <Box textAlign="center" mt={2}>
            <Button
              component={RouterLink}
              to="/forgot-password"
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('auth.requestNewResetLink')}
            </Button>
          </Box>
        )}
        
        <Box textAlign="center" mt={2}>
          <Link component={RouterLink} to="/login" variant="body2">
            {t('auth.backToLogin')}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;