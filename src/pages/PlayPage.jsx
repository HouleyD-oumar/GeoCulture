import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Grid, Paper, Button, 
  Card, CardContent, CardMedia, CardActionArea,
  Tabs, Tab, Divider
} from '@mui/material';
import {
  Flag as FlagIcon,
  LocationCity as CityIcon,
  People as PeopleIcon,
  Public as EarthIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

import { QUIZ_TYPES, DIFFICULTY_LEVELS, DIFFICULTY_CONFIG } from '../constants/quizConstants';
import { useTranslation } from 'react-i18next';

const PlayPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [loaded, setLoaded] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleQuizSelect = (quizType) => {
    navigate(`/play/${quizType}/${selectedDifficulty}`);
  };
  
  // Add the advanced quiz type to your quizTypes array
  const quizTypes = [
    {
      type: QUIZ_TYPES.FLAGS,
      title: t('quiz.types.flags'),
      description: t('quiz.descriptions.flags'),
      icon: <FlagIcon fontSize="large" />,
      image: '/images/quiz-flags.jpg',
      color: '#e57373'
    },
    {
      type: QUIZ_TYPES.CAPITALS,
      title: t('quiz.types.capitals'),
      description: t('quiz.descriptions.capitals'),
      icon: <CityIcon fontSize="large" />,
      image: '/images/quiz-capitals.jpg',
      color: '#64b5f6'
    },
    {
      type: QUIZ_TYPES.POPULATION,
      title: t('quiz.types.population'),
      description: t('quiz.descriptions.population'),
      icon: <PeopleIcon fontSize="large" />,
      image: '/images/quiz-population.jpg',
      color: '#81c784'
    },
    {
      type: QUIZ_TYPES.GEOGRAPHY,
      title: t('quiz.types.geography'),
      description: t('quiz.descriptions.geography'),
      icon: <EarthIcon fontSize="large" />,
      image: '/images/quiz-geography.jpg',
      color: '#ffb74d'
    },
    {
      type: QUIZ_TYPES.ADVANCED,
      title: t('quiz.types.advanced'),
      description: t('quiz.descriptions.advanced'),
      icon: <SchoolIcon fontSize="large" />,
      image: '/images/quiz-advanced.jpg',
      color: '#ba68c8'
    }
  ];
  
  const renderDifficultySelector = () => {
    return (
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          {t('quiz.selectDifficulty')}:
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(DIFFICULTY_CONFIG).map(([level, config]) => (
            <Grid item xs={6} sm={3} key={level}>
              <Button
                variant={selectedDifficulty === level ? 'contained' : 'outlined'}
                color={
                  level === DIFFICULTY_LEVELS.EASY ? 'success' :
                  level === DIFFICULTY_LEVELS.MEDIUM ? 'info' :
                  level === DIFFICULTY_LEVELS.HARD ? 'warning' : 'error'
                }
                fullWidth
                onClick={() => setSelectedDifficulty(level)}
                sx={{ py: 1 }}
              >
                {t(`quiz.difficulty.${level.toLowerCase()}`)}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  const renderDifficultyDetails = () => {
    const config = DIFFICULTY_CONFIG[selectedDifficulty];
    
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {t(`quiz.difficulty.${selectedDifficulty.toLowerCase()}`)} {t('quiz.mode')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t(`quiz.difficultyDescriptions.${selectedDifficulty.toLowerCase()}`)}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {t('quiz.questions')}
              </Typography>
              <Typography variant="h6">
                {config.totalQuestions}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {t('quiz.timeLimit')}
              </Typography>
              <Typography variant="h6">
                {Math.floor(config.timeLimit / 60)}:{(config.timeLimit % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {t('quiz.points')}
              </Typography>
              <Typography variant="h6">
                +{config.pointsPerQuestion}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {t('quiz.penalty')}
              </Typography>
              <Typography variant="h6">
                {config.penaltyPerWrong}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };
  
  const renderQuizCards = () => {
    // Filter quiz types based on active tab
    let filteredQuizTypes = quizTypes;
    
    if (activeTab === 1) { // Basic quizzes
      filteredQuizTypes = quizTypes.filter(quiz => 
        quiz.type === QUIZ_TYPES.FLAGS || 
        quiz.type === QUIZ_TYPES.CAPITALS
      );
    } else if (activeTab === 2) { // Advanced quizzes
      filteredQuizTypes = quizTypes.filter(quiz => 
        quiz.type === QUIZ_TYPES.POPULATION || 
        quiz.type === QUIZ_TYPES.GEOGRAPHY || 
        quiz.type === QUIZ_TYPES.ADVANCED
      );
    }
    
    return (
      <Grid container spacing={3}>
        {filteredQuizTypes.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.type}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleQuizSelect(quiz.type)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={quiz.image}
                  alt={quiz.title}
                  sx={{ 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1,
                      color: quiz.color
                    }}
                  >
                    {quiz.icon}
                    <Typography variant="h6" component="h3" ml={1}>
                      {quiz.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                    {quiz.description}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent CardActionArea click
                      handleQuizSelect(quiz.type);
                    }}
                    sx={{ 
                      alignSelf: 'flex-start',
                      borderColor: quiz.color,
                      color: quiz.color,
                      '&:hover': {
                        borderColor: quiz.color,
                        backgroundColor: `${quiz.color}10`
                      }
                    }}
                  >
                    {t('quiz.start')}
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          {t('quiz.pageTitle')}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom textAlign="center" color="textSecondary">
          {t('quiz.pageSubtitle')}
        </Typography>
        
        {renderDifficultySelector()}
        {renderDifficultyDetails()}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label={t('quiz.tabs.all')} />
            <Tab label={t('quiz.tabs.basic')} />
            <Tab label={t('quiz.tabs.advanced')} />
          </Tabs>
        </Box>
        
        {renderQuizCards()}
        
        <Box mt={6} textAlign="center">
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            startIcon={<TrophyIcon />}
            onClick={() => navigate('/achievements')}
          >
            {t('achievements.viewAll')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PlayPage;
