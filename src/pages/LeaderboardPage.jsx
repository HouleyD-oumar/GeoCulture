import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Fade,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlagIcon from '@mui/icons-material/Flag';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import { getQuizResults, QUIZ_TYPES } from '../services/quizService';
import { useNavigate } from 'react-router-dom';

// Replace the formatDate function with our new utility
import { formatDateTime } from '../utils/dateUtils';

// Replace the existing formatDate function:
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
// };

// Use the imported function instead
const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Load quiz results
  useEffect(() => {
    setLoading(true);
    
    // Get quiz results from localStorage
    const results = getQuizResults();
    
    // Sort by score (highest first)
    const sortedResults = [...results].sort((a, b) => b.score - a.score);
    
    setLeaderboardData(sortedResults);
    setLoading(false);
    setLoaded(true);
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter results by quiz type
  const getFilteredResults = () => {
    if (tabValue === 0) {
      return leaderboardData;
    }
    
    const quizTypes = [
      QUIZ_TYPES.FLAGS,
      QUIZ_TYPES.CAPITALS,
      QUIZ_TYPES.POPULATION,
      QUIZ_TYPES.GEOGRAPHY
    ];
    
    return leaderboardData.filter(result => result.quizType === quizTypes[tabValue - 1]);
  };

  // Get icon for quiz type
  const getQuizTypeIcon = (quizType) => {
    switch (quizType) {
      case QUIZ_TYPES.FLAGS:
        return <FlagIcon fontSize="small" sx={{ color: '#f44336' }} />;
      case QUIZ_TYPES.CAPITALS:
        return <LocationCityIcon fontSize="small" sx={{ color: '#2196f3' }} />;
      case QUIZ_TYPES.POPULATION:
        return <PeopleIcon fontSize="small" sx={{ color: '#4caf50' }} />;
      case QUIZ_TYPES.GEOGRAPHY:
        return <PublicIcon fontSize="small" sx={{ color: '#ff9800' }} />;
      default:
        return null;
    }
  };

  // Get color for difficulty
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredResults = getFilteredResults();

  return (
    <Fade in={loaded}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmojiEventsIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
          <Typography variant="h3" component="h1">
            Leaderboard
          </Typography>
        </Box>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          Track your quiz performance and see your highest scores
        </Typography>
        
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="leaderboard tabs"
          >
            <Tab label="All Quizzes" />
            <Tab 
              icon={<FlagIcon />} 
              iconPosition="start" 
              label="Flags" 
            />
            <Tab 
              icon={<LocationCityIcon />} 
              iconPosition="start" 
              label="Capitals" 
            />
            <Tab 
              icon={<PeopleIcon />} 
              iconPosition="start" 
              label="Population" 
            />
            <Tab 
              icon={<PublicIcon />} 
              iconPosition="start" 
              label="Geography" 
            />
          </Tabs>
        </Paper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredResults.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="leaderboard table">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Quiz</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Correct Answers</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResults.map((result, index) => (
                  <TableRow
                    key={result.id}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                      ...(index < 3 ? { bgcolor: index === 0 ? 'gold.light' : index === 1 ? 'silver.light' : 'bronze.light' } : {})
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {index < 3 && (
                          <EmojiEventsIcon 
                            sx={{ 
                              mr: 1, 
                              color: index === 0 ? 'gold.main' : index === 1 ? 'silver.main' : 'bronze.main'
                            }} 
                          />
                        )}
                        {index + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getQuizTypeIcon(result.quizType)}
                        <Typography sx={{ ml: 1 }}>
                          {result.quizTitle}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body1" 
                        fontWeight={index < 3 ? 'bold' : 'normal'}
                        color={result.score >= 70 ? 'success.main' : result.score >= 40 ? 'warning.main' : 'error.main'}
                      >
                        {result.score}%
                      </Typography>
                    </TableCell>
                    <TableCell>{result.correctCount} / {result.totalQuestions}</TableCell>
                    <TableCell>
                      <Chip 
                        label={result.difficulty ? result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1) : 'Medium'} 
                        size="small"
                        color={getDifficultyColor(result.difficulty)}
                      />
                    </TableCell>
                    <TableCell>{formatDate(result.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No quiz results yet
            </Typography>
            <Typography variant="body1" paragraph>
              Take some quizzes to see your scores on the leaderboard!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/play')}
              sx={{ mt: 2 }}
            >
              Start a Quiz
            </Button>
          </Paper>
        )}
      </Container>
    </Fade>
  );
};

export default LeaderboardPage;