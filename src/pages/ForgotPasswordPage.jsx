import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPassword, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    
    if (!email) {
      setFormError(t('errors.enterEmail'));
      return;
    }
    
    const { error } = await resetPassword(email);
    
    if (error) {
      setFormError(error.message);
    } else {
      setSuccess(true);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('auth.resetTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('auth.resetSubtitle')}
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
            {t('auth.resetLinkSent')}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label={t('auth.email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={success}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} /> : t('auth.sendResetLink')}
          </Button>
          
          <Box textAlign="center" mt={2}>
            <Link component={RouterLink} to="/login" variant="body2">
              {t('auth.backToLogin')}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;