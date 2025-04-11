import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Grid, Paper, Divider, 
  Card, CardContent, Chip, LinearProgress, Tabs, Tab,
  List, ListItem, ListItemIcon, ListItemText, Avatar,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, Badge
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import { 
  getAllAchievements, 
  getAchievementStatistics, 
  resetAchievements,
  getAchievementsByCategory,
  getAchievementProgress
} from '../services/achievementService';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [achievementsByCategory, setAchievementsByCategory] = useState({});
  
  // Load achievements and stats
  useEffect(() => {
    setLoading(true);
    const allAchievements = getAllAchievements();
    const achievementStats = getAchievementStatistics();
    const categorizedAchievements = getAchievementsByCategory();
    
    setAchievements(allAchievements);
    setStats(achievementStats);
    setAchievementsByCategory(categorizedAchievements);
    setLoading(false);
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle achievement click
  const handleAchievementClick = (achievement) => {
    // Get progress data for non-earned achievements
    if (!achievement.earned) {
      const progressData = getAchievementProgress(achievement.id);
      achievement.progress = progressData;
    }
    setSelectedAchievement(achievement);
  };
  
  // Handle reset achievements
  const handleResetAchievements = () => {
    if (resetAchievements()) {
      // Reload achievements and stats
      const allAchievements = getAllAchievements();
      const achievementStats = getAchievementStatistics();
      const categorizedAchievements = getAchievementsByCategory();
      
      setAchievements(allAchievements);
      setStats(achievementStats);
      setAchievementsByCategory(categorizedAchievements);
      
      // Provide feedback to the user
      alert('Achievements have been reset.');
    } else {
      alert('Failed to reset achievements.');
    }
    
    setShowResetDialog(false);
  };
  
  // Filter achievements by category
  const getFilteredAchievements = () => {
    if (activeTab === 0) {
      return achievements;
    }
    
    const categories = ['milestone', 'perfect', 'speed', 'mastery', 'expertise', 'special'];
    return achievements.filter(achievement => achievement.category === categories[activeTab - 1]);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box py={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Loading Achievements...
          </Typography>
          <LinearProgress />
        </Box>
      </Container>
    );
  }
  
  // Ensure stats is defined
  if (!stats) {
    return (
      <Container maxWidth="lg">
        <Box py={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            No Achievements Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start playing quizzes to earn achievements!
          </Typography>
        </Box>
      </Container>
    );
  }
  
  const filteredAchievements = getFilteredAchievements();
  
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={() => navigate('/play')} 
            sx={{ mr: 2 }}
            aria-label="Back to play"
          >
            <BackIcon />
          </IconButton>
          <TrophyIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
          <Typography variant="h3" component="h1">
            Achievements
          </Typography>
        </Box>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          Track your progress and unlock special achievements
        </Typography>
        
        {/* Achievement Progress */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Progress
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Box flexGrow={1} mr={2}>
              <LinearProgress 
                variant="determinate" 
                value={stats.completionPercentage} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h6">
              {stats.earnedCount} / {stats.totalAchievements}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            You've earned {stats.earnedCount} out of {stats.totalAchievements} achievements ({stats.completionPercentage.toFixed(1)}%)
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Quiz Completion
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box flexGrow={1} mr={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.quizCount.percentage} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {stats.quizCount.current}/{stats.quizCount.next}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stats.quizCount.current < 10 ? "Complete 10 quizzes" : 
                   stats.quizCount.current < 25 ? "Complete 25 quizzes" : 
                   stats.quizCount.current < 50 ? "Complete 50 quizzes" : 
                   "All quiz count achievements earned!"}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Perfect Scores
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box flexGrow={1} mr={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.perfectScores.percentage} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {stats.perfectScores.current}/{stats.perfectScores.total}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Get perfect scores at different difficulty levels
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Difficulty Mastery
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box flexGrow={1} mr={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.difficultyMastery.percentage} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {stats.difficultyMastery.current}/{stats.difficultyMastery.total}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Master different difficulty levels
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Quiz Type Expertise
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box flexGrow={1} mr={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.quizTypeExpertise.percentage} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {stats.quizTypeExpertise.current}/{stats.quizTypeExpertise.total}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Become an expert in different quiz types
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Recent Achievements
          </Typography>
          
          {stats.recentAchievements.length > 0 ? (
            <List>
              {stats.recentAchievements.map((achievement, index) => (
                <ListItem key={index} button onClick={() => handleAchievementClick(achievement)}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                      {achievement.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={achievement.name} 
                    secondary={`Earned on ${formatDate(achievement.dateEarned)}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No achievements earned yet. Start playing quizzes!
            </Typography>
          )}
        </Paper>
        
        {/* Achievement Categories */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="All Achievements" />
            <Tab label="Milestones" />
            <Tab label="Perfect Scores" />
            <Tab label="Speed" />
            <Tab label="Mastery" />
            <Tab label="Expertise" />
            <Tab label="Special" />
          </Tabs>
        </Box>
        
        {/* Achievement Grid */}
        {filteredAchievements.length > 0 ? (
          <Grid container spacing={3}>
            {filteredAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card 
                  elevation={achievement.earned ? 3 : 1}
                  sx={{ 
                    height: '100%',
                    opacity: achievement.earned ? 1 : 0.7,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => handleAchievementClick(achievement)}
                >
                  <CardContent>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      mb={2}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: achievement.earned ? 'warning.main' : 'grey.300',
                          mr: 2
                        }}
                      >
                        {achievement.earned ? achievement.icon : <LockIcon />}
                      </Avatar>
                      <Typography variant="h6">
                        {achievement.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {achievement.description}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)} 
                        size="small"
                        color={achievement.earned ? "primary" : "default"}
                        variant={achievement.earned ? "filled" : "outlined"}
                      />
                      
                      {achievement.earned && (
                        <Typography variant="caption" color="text.secondary">
                          Earned: {formatDate(achievement.dateEarned).split(' ')[0]}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No achievements found in this category
            </Typography>
          </Box>
        )}
        
        {/* Reset Button (for development/testing) */}
        <Box mt={4} textAlign="center">
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={() => setShowResetDialog(true)}
            startIcon={<InfoIcon />}
          >
            Reset All Achievements
          </Button>
        </Box>
      </Box>
      
      {/* Achievement Detail Dialog */}
      <Dialog 
        open={!!selectedAchievement} 
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <Avatar 
                  sx={{ 
                    bgcolor: selectedAchievement.earned ? 'warning.main' : 'grey.300',
                    mr: 2
                  }}
                >
                  {selectedAchievement.earned ? selectedAchievement.icon : <LockIcon />}
                </Avatar>
                <Typography variant="h6">
                  {selectedAchievement.name}
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <Typography variant="body1" paragraph>
                {selectedAchievement.description}
              </Typography>
              
              <Box mb={2}>
                <Chip 
                  label={selectedAchievement.category.charAt(0).toUpperCase() + selectedAchievement.category.slice(1)} 
                  size="small"
                  color={selectedAchievement.earned ? "primary" : "default"}
                  variant={selectedAchievement.earned ? "filled" : "outlined"}
                  sx={{ mr: 1 }}
                />
                
                {selectedAchievement.earned ? (
                  <Chip 
                    label={`Earned: ${formatDate(selectedAchievement.dateEarned)}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ) : (
                  <Chip 
                    label="Not Earned Yet"
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                How to earn:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedAchievement.howToEarn || "Complete the required challenge to earn this achievement."}
              </Typography>
              
              {!selectedAchievement.earned && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Progress:
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box flexGrow={1} mr={2}>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedAchievement.progress.percentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2">
                      {selectedAchievement.progress.current}/{selectedAchievement.progress.required} ({selectedAchievement.progress.percentage.toFixed(0)}%)
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedAchievement(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Reset Confirmation Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
      >
        <DialogTitle>Reset All Achievements?</DialogTitle>
        <DialogContent>
          <Typography>
            This will remove all your earned achievements. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleResetAchievements} color="error">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AchievementsPage;