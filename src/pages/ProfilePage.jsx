import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  History as HistoryIcon,
  EmojiEvents as TrophyIcon,
  Flag as FlagIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { quizDataService } from '../services/quizDataService';
import * as favoritesService from '../services/favoritesService';
import { supabase } from '../lib/supabase'; // Make sure this is imported
import { userProfileService } from '../services/userProfileService'; // Changed from default to named import
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { formatDate } from '../utils/dateUtils';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading, error, updateProfile, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [quizHistory, setQuizHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Load user data
  useEffect(() => {
    if (user) {
      // Set basic form data from auth user
      setFormData({
        ...formData,
        fullName: user.user_metadata?.full_name || '',
        username: user.user_metadata?.username || '',
        email: user.email || ''
      });
      
      // Load profile data from Supabase profiles table
      loadProfileData();
      
      // Load quiz history
      loadQuizHistory();
      
      // Load favorites
      loadFavorites();
    }
  }, [user]);
  
  const loadProfileData = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const profile = await userProfileService.getUserProfile();
      setProfileData(profile);
      
      // Update form data with profile information
      setFormData(prevData => ({
        ...prevData,
        fullName: profile.full_name || prevData.fullName,
        username: profile.username || prevData.username,
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      }));
      
      // Set avatar preview if available
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
      showSnackbar('Failed to load profile data', 'error');
    } finally {
      setProfileLoading(false);
    }
  };
  
  const loadQuizHistory = async () => {
    if (!user) return;
    
    setHistoryLoading(true);
    try {
      // Direct Supabase query instead of using a non-existent service method
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setQuizHistory(data || []);
    } catch (err) {
      console.error('Error loading quiz history:', err);
      showSnackbar('Failed to load quiz history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };
  
  const loadFavorites = async () => {
    if (!user) return;
    
    setFavoritesLoading(true);
    try {
      // Direct Supabase query instead of using a non-existent service method
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
      showSnackbar('Failed to load favorites', 'error');
    } finally {
      setFavoritesLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFormError('');
    setFormSuccess('');
    
    // Reset form data if canceling edit
    if (editMode) {
      setFormData({
        ...formData,
        fullName: profileData?.full_name || user.user_metadata?.full_name || '',
        username: profileData?.username || user.user_metadata?.username || '',
        bio: profileData?.bio || '',
        location: profileData?.location || '',
        website: profileData?.website || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset avatar preview and file
      if (avatarFile) {
        setAvatarFile(null);
        setAvatarPreview(profileData?.avatar_url || '');
      }
    }
  };
  
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        showSnackbar('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar('Image size should be less than 2MB', 'error');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDeleteAvatar = async () => {
    try {
      setAvatarUploading(true);
      await userProfileService.deleteAvatar();
      setAvatarPreview('');
      setAvatarFile(null);
      
      // Update profile data
      await loadProfileData();
      
      showSnackbar('Avatar deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting avatar:', err);
      showSnackbar('Failed to delete avatar', 'error');
    } finally {
      setAvatarUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Validate form
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }
    
    try {
      // First, upload avatar if changed
      if (avatarFile) {
        setAvatarUploading(true);
        await userProfileService.uploadAvatar(avatarFile);
        setAvatarUploading(false);
        setAvatarFile(null);
      }
      
      // Update profile in Supabase profiles table
      await userProfileService.updateUserProfile({
        full_name: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      });
      
      // Update auth metadata if needed
      if (formData.fullName !== user.user_metadata?.full_name || 
          formData.username !== user.user_metadata?.username) {
        const { error: authUpdateError } = await updateProfile({
          data: {
            full_name: formData.fullName,
            username: formData.username
          }
        });
        
        if (authUpdateError) throw authUpdateError;
      }
      
      // Update password if provided
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setFormError('Current password is required to change password');
          return;
        }
        
        const { error: passwordError } = await updateProfile({
          password: formData.newPassword
        });
        
        if (passwordError) throw passwordError;
        
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      // Reload profile data
      await loadProfileData();
      
      setFormSuccess('Profile updated successfully');
      showSnackbar('Profile updated successfully', 'success');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setFormError(err.message || 'Failed to update profile');
      showSnackbar('Failed to update profile', 'error');
    }
  };
  
  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteAccount = async () => {
    try {
      // Call Supabase Edge Function to delete account
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
      
      setShowDeleteDialog(false);
      await signOut();
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Failed to delete account');
      showSnackbar('Failed to delete account', 'error');
    }
  };
  
  // Replace the formatDate function with our new utility
  
  // Remove the existing formatDate function:
  // const formatDate = (dateString) => {
  //   if (!dateString) return 'N/A';
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric'
  //   });
  // };
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  if (loading || profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          <Button
            variant={editMode ? "outlined" : "contained"}
            color={editMode ? "secondary" : "primary"}
            startIcon={editMode ? null : <EditIcon />}
            onClick={toggleEditMode}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Profile Information" />
          <Tab label="Quiz History" />
          <Tab label="Favorites" />
        </Tabs>
        
        {/* Profile Tab */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleSubmit}>
            {(error || formError) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {formError || error}
              </Alert>
            )}
            
            {formSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {formSuccess}
              </Alert>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={avatarPreview}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {formData.fullName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                
                {editMode && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCameraIcon />}
                      disabled={avatarUploading}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Button>
                    
                    {avatarPreview && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteAvatar}
                        disabled={avatarUploading || !avatarPreview}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                )}
                
                <Typography variant="h6" gutterBottom>
                  {formData.fullName || user.email}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Member since: {formatDate(user.created_at)}
                </Typography>
                
                {profileData?.website && (
                  <Typography variant="body2" color="text.secondary">
                    <Link href={profileData.website} target="_blank" rel="noopener noreferrer">
                      {profileData.website}
                    </Link>
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      disabled={true}
                      margin="normal"
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                      placeholder="https://example.com"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                      multiline
                      rows={3}
                      placeholder="Tell us about yourself"
                    />
                  </Grid>
                  
                  {editMode && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Change Password
                          </Typography>
                        </Divider>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          margin="normal"
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            )
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          margin="normal"
                          error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''}
                          helperText={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '' ? "Passwords don't match" : ""}
                        />
                      </Grid>
                      
                      {formData.newPassword && (
                        <Grid item xs={12}>
                          <PasswordStrengthMeter password={formData.newPassword} />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
                
                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={avatarUploading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Quiz History Tab */}
        {activeTab === 1 && (
          <Box>
            {historyLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : quizHistory.length === 0 ? (
              <Alert severity="info">
                You haven't taken any quizzes yet. Start exploring and test your knowledge!
              </Alert>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Quiz History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View your past quiz results and track your progress
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {/* Quiz Stats Summary */}
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4} md={2}>
                          <Box textAlign="center">
                            <Typography variant="h5" color="primary">
                              {quizHistory.length}
                            </Typography>
                            <Typography variant="body2">Total Quizzes</Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={4} md={2}>
                          <Box textAlign="center">
                            <Typography variant="h5" color="primary">
                              {Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizHistory.length || 0)}%
                            </Typography>
                            <Typography variant="body2">Avg. Score</Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={4} md={2}>
                          <Box textAlign="center">
                            <Typography variant="h5" color="primary">
                              {Math.max(...quizHistory.map(quiz => quiz.percentage), 0)}%
                            </Typography>
                            <Typography variant="body2">Best Score</Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h5" color="primary">
                              {quizHistory.reduce((types, quiz) => {
                                if (!types.includes(quiz.quiz_type)) {
                                  types.push(quiz.quiz_type);
                                }
                                return types;
                              }, []).length}
                            </Typography>
                            <Typography variant="body2">Quiz Types</Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h5" color="primary">
                              {quizHistory.reduce((sum, quiz) => sum + quiz.correct_answers, 0)}
                            </Typography>
                            <Typography variant="body2">Correct Answers</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  {/* Quiz History List */}
                  <Grid item xs={12}>
                    <List>
                      {quizHistory.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((quiz, index) => (
                        <Paper key={quiz.id || index} elevation={1} sx={{ mb: 2 }}>
                          <ListItem>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle1">
                                      {quiz.quiz_type.charAt(0).toUpperCase() + quiz.quiz_type.slice(1)} Quiz
                                      {' - '}
                                      <Typography component="span" color="text.secondary" variant="subtitle2">
                                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                                      </Typography>
                                    </Typography>
                                  }
                                  secondary={
                                    <>
                                      <Typography variant="body2" color="text.secondary">
                                        {formatDate(quiz.created_at)}
                                      </Typography>
                                      <Typography variant="body2">
                                        Score: {quiz.score} / {quiz.max_score} ({quiz.percentage.toFixed(1)}%)
                                      </Typography>
                                    </>
                                  }
                                />
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Box display="flex" flexDirection="column" alignItems="flex-end" height="100%" justifyContent="center">
                                  <Typography variant="body2">
                                    {quiz.correct_answers} correct, {quiz.incorrect_answers} incorrect, {quiz.skipped_answers} skipped
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Time: {Math.floor(quiz.time_used / 60)}m {quiz.time_used % 60}s
                                    {quiz.time_bonus > 0 && ` (Bonus: +${quiz.time_bonus})`}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}
        
        {/* Favorites Tab */}
        {activeTab === 2 && (
          <Box>
            {favoritesLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : favorites.length === 0 ? (
              <Alert severity="info">
                You haven't added any countries to your favorites yet. Explore countries and add them to your favorites!
              </Alert>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Favorite Countries
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Countries you've marked as favorites
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {favorites.map(favorite => (
                    <Grid item xs={12} sm={6} md={4} key={favorite.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar 
                              src={`https://flagcdn.com/w80/${favorite.country_id.toLowerCase()}.png`}
                              alt={favorite.country_name}
                              variant="rounded"
                              sx={{ width: 40, height: 30, mr: 2 }}
                            />
                            <Typography variant="h6" component="div">
                              {favorite.country_name}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary">
                            Added on {formatDate(favorite.created_at)}
                          </Typography>
                          
                          <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => navigate(`/country/${favorite.country_id}`)}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteAccount} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;