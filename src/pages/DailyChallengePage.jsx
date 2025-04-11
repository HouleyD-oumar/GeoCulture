import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  CircularProgress, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { dailyChallengeService } from '../services/dailyChallengeService';
import Quiz from '../components/Quiz';

import { formatDate } from '../utils/dateUtils';

const DailyChallengePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Load daily challenge
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true);
        
        // Get today's challenge
        const todaysChallenge = await dailyChallengeService.getTodaysChallenge();
        setChallenge(todaysChallenge);
        
        // Check if user has completed today's challenge
        const isCompleted = await dailyChallengeService.isCompletedToday();
        setCompleted(isCompleted);
        
        // Get user's streak
        const userStreak = await dailyChallengeService.getUserStreak();
        setStreak(userStreak);
        
        // Get user's challenge history
        const challengeHistory = await dailyChallengeService.getUserChallengeHistory();
        setHistory(challengeHistory);
        
      } catch (err) {
        console.error('Error loading daily challenge:', err);
        setError('Failed to load daily challenge');
      } finally {
        setLoading(false);
      }
    };
    
    loadChallenge();
  }, []);
  
  // Handle starting the challenge
  const handleStartChallenge = () => {
    setShowQuiz(true);
  };
  
  // Handle quiz completion
  const handleQuizComplete = async (result) => {
    try {
      // Save challenge result
      await dailyChallengeService.saveChallengeResult(result);
      
      // Update state
      setCompleted(true);
      setShowQuiz(false);
      
      // Refresh streak and history
      const userStreak = await dailyChallengeService.getUserStreak();
      setStreak(userStreak);
      
      const challengeHistory = await dailyChallengeService.getUserChallengeHistory();
      setHistory(challengeHistory);
      
    } catch (err) {
      console.error('Error saving challenge result:', err);
      setError('Failed to save challenge result');
    }
  };
  
  // Format date
  const formatChallengeDate = (dateString) => {
    return formatDate(dateString, { weekday: 'long' });
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </Container>
    );
  }
  
  if (showQuiz && challenge) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('dailyChallenge.title')} - {formatDate(challenge.challenge_date)}
        </Typography>
        <Quiz 
          quiz={challenge.quiz} 
          onComplete={handleQuizComplete}
          isChallenge={true}
        />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dailyChallenge.title')}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Challenge info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5">
                {challenge ? formatDate(challenge.challenge_date) : 'Today'}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {t('dailyChallenge.description')}
            </Typography>
            
            {completed ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                {t('dailyChallenge.completed')}
              </Alert>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={handleStartChallenge}
                sx={{ mt: 2 }}
              >
                {t('dailyChallenge.start')}
              </Button>
            )}
            
            {challenge && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Challenge Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Type
                        </Typography>
                        <Typography variant="body1">
                          {challenge.quiz.type}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Difficulty
                        </Typography>
                        <Typography variant="body1">
                          {challenge.quiz.difficulty}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Questions
                        </Typography>
                        <Typography variant="body1">
                          {challenge.quiz.questions.length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Time Limit
                        </Typography>
                        <Typography variant="body1">
                          {challenge.quiz.timeLimit} seconds
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Streak and stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <WhatshotIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6">
                {t('dailyChallenge.streak', { count: streak })}
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={(streak % 7) * (100/7)} 
              sx={{ height: 10, borderRadius: 5, mb: 1 }} 
            />
            
            <Typography variant="body2" color="text.secondary" align="right">
              {streak % 7}/7 days to next reward
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('dailyChallenge.statistics')}
            </Typography>
            
            <List disablePadding>
              <ListItem divider>
                <ListItemText 
                  primary={t('dailyChallenge.totalChallenges')} 
                  secondary={history.length} 
                />
              </ListItem>
              <ListItem divider>
                <ListItemText 
                  primary={t('dailyChallenge.averageScore')} 
                  secondary={
                    history.length > 0 
                      ? `${Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)}%` 
                      : 'N/A'
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary={t('dailyChallenge.bestScore')} 
                  secondary={
                    history.length > 0 
                      ? `${Math.max(...history.map(h => h.score))}%` 
                      : 'N/A'
                  } 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Challenge history */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dailyChallenge.history')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {history.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No challenge history yet. Complete your first daily challenge!
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {history.slice(0, 5).map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Date
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(item.date)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Score
                            </Typography>
                            <Typography variant="body2">
                              {item.score}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Time
                            </Typography>
                            <Typography variant="body2">
                              {item.timeSpent} seconds
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                              <Chip 
                                size="small" 
                                label={item.quizType} 
                                color="primary" 
                                variant="outlined" 
                              />
                              <Chip 
                                size="small" 
                                label={item.difficulty} 
                                color="secondary" 
                                variant="outlined" 
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {history.length > 5 && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button variant="outlined">
                  View All History
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DailyChallengePage;