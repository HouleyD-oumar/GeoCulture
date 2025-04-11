import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
import OAuthButtons from '../components/OAuthButtons';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Ajout de validations supplémentaires pour l'email et le mot de passe
    if (!email || !password || !confirmPassword) {
      setFormError(t('errors.fillAllFields'));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError(t('errors.enterEmail'));
      return;
    }

    if (password.length < 8) {
      setFormError(t('password.requirements'));
      return;
    }

    if (password !== confirmPassword) {
      setFormError(t('password.mismatch'));
      return;
    }
    
    const { error } = await signUp(email, password);
    
    // Ajout de gestion des erreurs spécifiques pour l'inscription
    if (error) {
      if (error.message.includes('email already exists')) {
        setFormError(t('errors.emailAlreadyUsed'));
      } else if (error.message.includes('weak password')) {
        setFormError(t('errors.weakPassword'));
      } else {
        setFormError(error.message);
      }
    } else {
      navigate('/login');
    }
  };
  
  const handleOAuthSuccess = () => {
    navigate('/');
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up for GeoCulture
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start your geography journey today
          </Typography>
        </Box>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError || error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          {/* Add OAuth Buttons */}
          <OAuthButtons onSuccess={handleOAuthSuccess} />
          
          <Box textAlign="center" mt={2}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Log in
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;