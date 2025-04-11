import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="text.primary">
                GeoCulture
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Explore the world's countries, learn about their cultures, and test your knowledge with fun quizzes.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/learn" color="inherit" underline="hover">
                  Learn
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/play" color="inherit" underline="hover">
                  Play
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/favorites" color="inherit" underline="hover">
                  Favorites
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="https://restcountries.com/" target="_blank" rel="noopener" color="inherit" underline="hover">
                  REST Countries API
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="https://mui.com/" target="_blank" rel="noopener" color="inherit" underline="hover">
                  Material UI
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="https://reactjs.org/" target="_blank" rel="noopener" color="inherit" underline="hover">
                  React
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 4, mb: 4 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} GeoCulture. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;