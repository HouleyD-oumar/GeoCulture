import { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Grid, Paper, Divider, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, CircularProgress, Chip
} from '@mui/material';
import { 
  BarChart as ChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

import { getQuizResults, getQuizStatistics, DIFFICULTY_LEVELS, QUIZ_TYPES } from '../services/quizService';

// Add import for date formatting
import { formatDate } from '../utils/dateUtils';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const quizStats = getQuizStatistics();
    const quizResults = getQuizResults();
    
    setStats(quizStats);
    setResults(quizResults);
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!stats) {
    return (
      <Container maxWidth="md">
        <Box py={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            No Statistics Available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Complete some quizzes to see your statistics here!
          </Typography>
        </Box>
      </Container>
    );
  }
  
  // Calculate trend (improving, declining, or stable)
  const calculateTrend = () => {
    if (results.length < 3) return 'stable';
    
    const recent = results.slice(0, 3).map(r => r.percentage);
    const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    
    const older = results.slice(3, 6).map(r => r.percentage);
    if (older.length === 0) return 'stable';
    
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const diff = avg - olderAvg;
    if (diff > 5) return 'improving';
    if (diff < -5) return 'declining';
    return 'stable';
  };
  
  const trend = calculateTrend();
  const trendIcons = {
    improving: <TrendingUpIcon color="success" />,
    declining: <TrendingDownIcon color="error" />,
    stable: <TrendingFlatIcon color="action" />
  };
  
  const difficultyNames = {
    [DIFFICULTY_LEVELS.EASY]: 'Easy',
    [DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
    [DIFFICULTY_LEVELS.HARD]: 'Hard',
    [DIFFICULTY_LEVELS.EXPERT]: 'Expert'
  };
  
  const quizTypeNames = {
    [QUIZ_TYPES.FLAGS]: 'Flags',
    [QUIZ_TYPES.CAPITALS]: 'Capitals',
    [QUIZ_TYPES.POPULATION]: 'Population',
    [QUIZ_TYPES.GEOGRAPHY]: 'Geography',
    [QUIZ_TYPES.ADVANCED]: 'Advanced'
  };
  
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Quiz Statistics
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom textAlign="center" color="textSecondary">
          Track your geography knowledge progress
        </Typography>
        
        {/* Overview Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Quizzes
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalQuizzes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.averageScore.toFixed(1)}%
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {trendIcons[trend]}
                  <Typography variant="body2" color="textSecondary" ml={0.5}>
                    {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Best Score
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.bestScore.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  {stats.bestScoreQuizType && quizTypeNames[stats.bestScoreQuizType]} - {stats.bestScoreDifficulty && difficultyNames[stats.bestScoreDifficulty]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Accuracy Rate
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.accuracyRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  {stats.totalCorrect} correct / {stats.totalQuestions} questions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Performance by Difficulty */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Performance by Difficulty
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {Object.entries(stats.byDifficulty || {}).map(([difficulty, data]) => (
              <Grid item xs={12} sm={6} md={3} key={difficulty}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {difficultyNames[difficulty] || difficulty}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Quizzes:
                      </Typography>
                      <Typography variant="body1">
                        {data.count}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Avg Score:
                      </Typography>
                      <Typography variant="body1">
                        {data.averageScore.toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Best Score:
                      </Typography>
                      <Typography variant="body1">
                        {data.bestScore.toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary">
                        Accuracy:
                      </Typography>
                      <Typography variant="body1">
                        {data.accuracyRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
        
        {/* Performance by Quiz Type */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Performance by Quiz Type
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {Object.entries(stats.byQuizType || {}).map(([quizType, data]) => (
              <Grid item xs={12} sm={6} md={4} key={quizType}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {quizTypeNames[quizType] || quizType}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Quizzes:
                      </Typography>
                      <Typography variant="body1">
                        {data.count}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Avg Score:
                      </Typography>
                      <Typography variant="body1">
                        {data.averageScore.toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Best Score:
                      </Typography>
                      <Typography variant="body1">
                        {data.bestScore.toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary">
                        Accuracy:
                      </Typography>
                      <Typography variant="body1">
                        {data.accuracyRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
        
        {/* Recent Quiz Results */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Recent Quiz Results
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {results.length === 0 ? (
            <Typography variant="body1" textAlign="center" py={2}>
              No quiz results available yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Quiz Type</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Time Used</TableCell>
                    <TableCell>Accuracy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.slice(0, 10).map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        // Add import for date formatting
                        import { formatDate } from '../utils/dateUtils';
                        
                        // Then in the table row, replace:
                        // {new Date(result.date).toLocaleDateString()}
                        // With:
                        // {formatDate(result.date)}
                      </TableCell>
                      <TableCell>
                        {quizTypeNames[result.quizType] || result.quizType}
                      </TableCell>
                      <TableCell>
                        {difficultyNames[result.difficulty] || result.difficulty}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${result.percentage.toFixed(1)}%`}
                          color={
                            result.percentage >= 80 ? 'success' :
                            result.percentage >= 60 ? 'primary' :
                            result.percentage >= 40 ? 'warning' : 'error'
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {Math.floor(result.timeUsed / 60)}:{(result.timeUsed % 60).toString().padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        {result.correctCount}/{result.correctCount + result.incorrectCount + result.skippedCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default StatsPage;