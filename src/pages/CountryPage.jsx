import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Public as PublicIcon,
  LocationCity as LocationCityIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  AttachMoney as AttachMoneyIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  AccessTime as AccessTimeIcon,
  Straighten as StraightenIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getCountryById, getAllCountries } from '../services/countryService';
import FavoriteButton from '../components/FavoriteButton';
import MapComponent from '../components/MapComponent';
import { useTranslation } from 'react-i18next';

const CountryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
  };
  
  // Fixed useEffect to properly handle data fetching
  useEffect(() => {
    let isMounted = true;
    
    const fetchCountryData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      // Check if id is undefined or empty
      if (!id) {
        setError('Country ID is missing. Please select a country from the list.');
        setLoading(false);
        return;
      }
      
      try {
        // Get the country details
        const countryData = await getCountryById(id);
        
        if (!isMounted) return;
        
        if (!countryData) {
          setError('Country not found');
          setLoading(false);
          return;
        }
        
        // Normalize country data
        const normalizedCountry = {
          ...countryData,
          name: countryData.name?.common || countryData.name,
          capital: Array.isArray(countryData.capital) ? countryData.capital[0] : countryData.capital,
        };
        
        setCountry(normalizedCountry);
        
        // Get border countries if any
        if (countryData.borders && countryData.borders.length > 0) {
          const allCountries = await getAllCountries();
          
          if (!isMounted) return;
          
          const borders = countryData.borders
            .map(borderCode => {
              const borderCountry = allCountries.find(
                c => (c.alpha3Code || c.cca3) === borderCode
              );
              return borderCountry ? {
                id: borderCountry.alpha3Code || borderCountry.cca3 || borderCountry.id,
                name: borderCountry.name?.common || borderCountry.name,
                flag: borderCountry.flags?.svg || borderCountry.flags?.png || borderCountry.flag
              } : null;
            })
            .filter(Boolean);
          
          setBorderCountries(borders);
        } else {
          setBorderCountries([]);
        }
        
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching country data:', err);
        setError('Failed to load country information. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCountryData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id]);
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleBorderCountryClick = (countryId) => {
    // Make sure we're navigating to the correct route
    navigate(`/country/${countryId}`);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading country information...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!country) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Country not found</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  // In the return statement, ensure the FavoriteButton has a valid ID
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button and favorite */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackClick}
        >
          {t('common.back', 'Back')}
        </Button>
        {/* Make sure we're passing a string ID to FavoriteButton */}
        <FavoriteButton 
          countryId={String(country.alpha3Code || country.cca3 || country.id)} 
          size="large" 
        />
      </Box>
      
      {/* Country header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            {(country.flags?.svg || country.flags?.png || country.flag) && (
              <Box
                component="img"
                src={country.flags?.svg || country.flags?.png || country.flag}
                alt={`Flag of ${country.name?.common || country.name}`}
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #eee',
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {country.name?.common || country.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {country.name?.nativeName && Object.values(country.name.nativeName)[0]?.common !== (country.name?.common || country.name) && (
                <span>{Object.values(country.name.nativeName)[0]?.common || country.nativeName} • </span>
              )}
              {country.region} {country.subregion && `• ${country.subregion}`}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip 
                icon={<LocationCityIcon />} 
                label={`Capital: ${country.capital?.[0] || country.capital || 'N/A'}`} 
              />
              <Chip icon={<PeopleIcon />} label={`Population: ${formatNumber(country.population)}`} />
              <Chip icon={<StraightenIcon />} label={`Area: ${formatNumber(country.area)} km²`} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={4}>
        {/* Left column - Details */}
        <Grid item xs={12} md={7}>
          {/* General Information */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                General Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocationCityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Capital" 
                    secondary={country.capital?.[0] || country.capital || 'N/A'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Population" 
                    secondary={formatNumber(country.population)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PublicIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Region" 
                    secondary={`${country.region}${country.subregion ? ` / ${country.subregion}` : ''}`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <StraightenIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Area" 
                    secondary={`${formatNumber(country.area)} km²`} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Geographic Data */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Geographic Data
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MapIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Coordinates" 
                    secondary={country.latlng ? `${country.latlng[0]}°, ${country.latlng[1]}°` : 'N/A'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Timezones" 
                    secondary={country.timezones ? country.timezones.join(', ') : 'N/A'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Culture and Language */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Culture and Language
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Languages" 
                    secondary={
                      country.languages 
                        ? (Array.isArray(country.languages)
                            ? country.languages.map(lang => lang.name).join(', ')
                            : Object.values(country.languages).join(', '))
                        : 'N/A'
                    } 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Demonym" 
                    secondary={country.demonym || 'N/A'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Economy and Communication */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Economy and Communication
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Currencies" 
                    secondary={
                      country.currencies 
                        ? (Array.isArray(country.currencies)
                            ? country.currencies.map(curr => 
                                `${curr.symbol ? curr.symbol + ' ' : ''}${curr.name} (${curr.code})`
                              ).join(', ')
                            : Object.entries(country.currencies).map(([code, currency]) =>
                                `${currency.symbol || ''} ${currency.name} (${code})`
                              ).join(', '))
                        : 'N/A'
                    } 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Calling Codes" 
                    secondary={
                      country.callingCodes && Array.isArray(country.callingCodes) && country.callingCodes.length > 0 
                        ? '+' + country.callingCodes.join(', +') 
                        : country.idd 
                          ? `+${country.idd.root || ''}${country.idd.suffixes && Array.isArray(country.idd.suffixes) 
                              ? country.idd.suffixes.join(', +' + (country.idd.root || '')) 
                              : ''}`
                          : 'N/A'
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column - Map and Border Countries */}
        <Grid item xs={12} md={5}>
          {/* Map */}
          <Card sx={{ mb: 4, height: 400 }}>
            {country.latlng && (
              <MapComponent 
                latitude={country.latlng[0]} 
                longitude={country.latlng[1]} 
                zoom={5}
                markers={[
                  {
                    latitude: country.latlng[0],
                    longitude: country.latlng[1],
                    title: country.name,
                    icon: country.flags?.svg || country.flags?.png || country.flag
                  }
                ]}
              />
            )}
          </Card>
          
          {/* Border Countries */}
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Border Countries
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {borderCountries.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {borderCountries.map(border => (
                    <Button 
                      key={border.id}
                      variant="outlined"
                      size="small"
                      onClick={() => handleBorderCountryClick(border.id)}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        textTransform: 'none'
                      }}
                    >
                      {border.flag && (
                        <Box
                          component="img"
                          src={border.flag}
                          alt={`Flag of ${border.name}`}
                          sx={{ width: 24, height: 16, mr: 1 }}
                        />
                      )}
                      {border.name}
                    </Button>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">
                  No bordering countries
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CountryPage;