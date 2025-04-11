import { useState, useEffect } from 'react';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Paper,
  Divider,
  IconButton,
  Fade
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { getFavorites, removeFromFavorites, clearAllFavorites } from '../services/favoritesService';
// Add import for date formatting
import { formatDate } from '../utils/dateUtils';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const favoritesData = await getFavorites();
        console.log("Loaded favorites:", favoritesData); // Add this debug line
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  // Remove a country from favorites
  const handleRemoveFavorite = (id) => {
    if (removeFromFavorites(id)) {
      setFavorites(favorites.filter(country => country.id !== id));
    }
  };

  // Clear all favorites
  const handleClearAll = () => {
    if (clearAllFavorites()) {
      setFavorites([]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        My Favorite Countries
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph align="center">
        View and manage your saved countries
      </Typography>
      
      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button 
          variant="outlined" 
          component={RouterLink} 
          to="/learn"
          startIcon={<InfoIcon />}
        >
          Explore More Countries
        </Button>
        
        {favorites.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearAll}
            startIcon={<DeleteIcon />}
          >
            Clear All Favorites
          </Button>
        )}
      </Box>
      
      {/* Favorites List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Loading your favorites...</Typography>
        </Box>
      ) : favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((country, index) => (
            <Grid item xs={12} sm={6} md={4} key={country.id}>
              <Fade in={loaded} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardActionArea 
                    onClick={() => navigate(`/country/${country.id}`)}
                    sx={{ flexGrow: 1 }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={country.flag}
                      alt={`Flag of ${country.name}`}
                      sx={{ objectFit: 'contain', bgcolor: 'grey.100', p: 1 }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {country.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="p">
                        <strong>Capital:</strong> {country.capital}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="p">
                        <strong>Region:</strong> {country.region}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="p">
                        // Then replace:
                        // <strong>Added on:</strong> {country.dateAdded.toLocaleDateString()}
                        // With:
                        // <strong>{t('favorites.addedOn')}:</strong> {formatDate(country.dateAdded)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton 
                      color="error" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFavorite(country.id);
                      }}
                      size="small"
                      aria-label="remove from favorites"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <FavoriteIcon color="disabled" sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Favorites Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start exploring countries and add them to your favorites!
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/learn"
            sx={{ mt: 2 }}
          >
            Explore Countries
          </Button>
        </Paper>
      )}
      
      {/* Tips Section */}
      <Paper sx={{ mt: 6, p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Did You Know?
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1">
          You can add countries to your favorites while exploring the Learn section or viewing country details.
          Your favorites are stored locally on your device and will be available the next time you visit.
        </Typography>
      </Paper>
    </Container>
  );
};

export default FavoritesPage;