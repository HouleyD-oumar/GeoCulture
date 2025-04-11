import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Cette implémentation est plus complète avec gestion des rôles
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required role if specified
  if (requiredRole && user.user_metadata?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Render children if authenticated and authorized
  return children;
};