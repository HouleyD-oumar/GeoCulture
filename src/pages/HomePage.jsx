import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  Fade
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Example of how to use translations in a component
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      title: 'Learn About Countries',
      description: 'Explore detailed information about countries around the world, including geography, culture, and more.',
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: '/learn'
    },
    {
      title: 'Test Your Knowledge',
      description: 'Challenge yourself with quizzes about countries, capitals, flags, and cultural facts.',
      icon: <ExploreIcon fontSize="large" color="primary" />,
      link: '/play'
    },
    {
      title: 'Compete with Others',
      description: 'See how your geography knowledge ranks against other players on our leaderboard.',
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      link: '/leaderboard'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(/images/showcase/worldbg.webp)',
          height: { xs: '50vh', md: '70vh' }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Fade in={loaded} timeout={1000}>
          <Container
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              py: { xs: 3, md: 6 },
            }}
          >
            <Typography component="h1" variant="h2" color="inherit" gutterBottom>
              Explore the World with GeoCulture
            </Typography>
            <Typography variant="h5" color="inherit" paragraph sx={{ maxWidth: '800px' }}>
              Learn about countries, test your knowledge, and discover fascinating cultural facts from around the globe.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                component={RouterLink} 
                to="/learn"
                sx={{ mr: 2 }}
              >
                Start Learning
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={RouterLink} 
                to="/play"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'white',
                  }
                }}
              >
                Play Quiz
              </Button>
            </Box>
          </Container>
        </Fade>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover what GeoCulture has to offer
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={loaded} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      size="small" 
                      color="primary" 
                      component={RouterLink} 
                      to={feature.link}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to test your knowledge?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Challenge yourself with our geography quizzes and see how you rank on the leaderboard.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={RouterLink} 
              to="/play"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              Start Quiz
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;