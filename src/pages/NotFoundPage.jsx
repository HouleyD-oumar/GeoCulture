import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 4 }} />
      
      <Typography variant="h2" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      
      <Typography variant="h5" color="text.secondary" paragraph>
        Oops! The page you're looking for doesn't exist or has been moved.
      </Typography>
      
      <Box sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/"
        >
          Go to Homepage
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          component={RouterLink}
          to="/learn"
        >
          Explore Countries
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;