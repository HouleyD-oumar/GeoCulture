import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import OAuthButtons from '../components/OAuthButtons';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signOut, user, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    if (user) {
      navigate('/profile'); // Redirection après connexion
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/'); // Redirection après déconnexion
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError(t('errors.fillAllFields'));
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setFormError(error.message);
    } else {
      navigate('/');
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('auth.loginTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('auth.loginSubtitle')}
          </Typography>
        </Box>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError || error}
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
          />
          
          <TextField
            label={t('auth.password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('navigation.login')}
          </Button>
          
          {/* Add OAuth Buttons */}
          <OAuthButtons />
          
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                {t('auth.forgotPassword')}
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {t('auth.noAccount')} {t('navigation.signup')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;