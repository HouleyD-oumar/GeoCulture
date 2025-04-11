import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Fade,
  CircularProgress,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapComponent from '../components/MapComponent';
import { getAllCountries, getCountriesByRegion, searchCountries, getAllRegions } from '../services/countryService';

const LearningPage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const navigate = useNavigate();
  
  // Fetch all regions
  useEffect(() => {
    getAllRegions()
      .then(data => {
        setRegions(data);
      })
      .catch(error => {
        console.error('Error fetching regions:', error);
      });
  }, []);

  // Fetch countries data
  useEffect(() => {
    setLoading(true);
    getAllCountries()
      .then(data => {
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
        setLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setLoading(false);
      });
  }, []);

  // Filter countries based on search term and region
  useEffect(() => {
    if (searchTerm || region) {
      setLoading(true);
      
      // If both search term and region are provided
      if (searchTerm && region) {
        searchCountries(searchTerm)
          .then(searchResults => {
            const filtered = searchResults.filter(country => country.region === region);
            setFilteredCountries(filtered);
            setLoading(false);
          });
      } 
      // If only region is provided
      else if (region) {
        getCountriesByRegion(region)
          .then(regionResults => {
            setFilteredCountries(regionResults);
            setLoading(false);
          });
      } 
      // If only search term is provided
      else if (searchTerm) {
        searchCountries(searchTerm)
          .then(searchResults => {
            setFilteredCountries(searchResults);
            setLoading(false);
          });
      }
    } else {
      // If no filters are applied, show all countries
      setFilteredCountries(countries);
      setLoading(false);
    }
  }, [searchTerm, region, countries]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle region filter change
  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  // Handle country selection from map - Fix the navigation path
  const handleCountrySelect = (country) => {
    console.log('Selected country:', country);
    if (country && (country.id || country.alpha3Code || country.cca3)) {
      // Change from /learn/ to /country/ to match the route in CountryPage
      navigate(`/country/${country.id || country.alpha3Code || country.cca3}`);
    } else {
      console.error('Invalid country data:', country);
    }
  };

  return (
    <Fade in={loaded}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Learn About Countries
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            Explore countries from around the world. Learn about their geography, culture, and more.
          </Typography>
        </Box>
        
        <Paper sx={{ mb: 4, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search countries"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Region</InputLabel>
                <Select
                  value={region}
                  label="Filter by Region"
                  onChange={handleRegionChange}
                >
                  <MenuItem value="">All Regions</MenuItem>
                  {regions.map((regionName) => (
                    <MenuItem key={regionName} value={regionName}>
                      {regionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Tabs
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="view mode"
                centered
              >
                <Tab icon={<ViewListIcon />} value="grid" aria-label="grid view" />
                <Tab icon={<MapIcon />} value="map" aria-label="map view" />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {filteredCountries.map((country) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={country.id || country.alpha3Code || country.cca3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Fix the navigation path here too */}
                      <CardActionArea component={RouterLink} to={`/country/${country.id || country.alpha3Code || country.cca3}`}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={country.flags?.svg || country.flags?.png || country.flag}
                          alt={`${country.name?.common || country.name} flag`}
                          sx={{ objectFit: 'contain', bgcolor: '#f5f5f5', p: 1 }}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {country.name?.common || country.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Capital: {country.capital || country.capital?.[0] || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Region: {country.region || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Population: {(country.population || 0).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ mt: 2, height: '600px' }}>
                <MapComponent countries={filteredCountries} onCountrySelect={handleCountrySelect} />
              </Box>
            )}
            
            {filteredCountries.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6">No countries found matching your criteria</Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Fade>
  );
};

export default LearningPage;