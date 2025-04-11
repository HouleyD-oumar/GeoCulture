import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { userProfileService } from '../services/userProfileService';

const ProfileEditor = ({ onProfileUpdate }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    website: ''
  });
  const [usernameError, setUsernameError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userData = await userProfileService.getUserProfile();
        setProfile(userData);
        setFormData({
          username: userData.username || '',
          full_name: userData.full_name || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || ''
        });
        setAvatarPreview(userData.avatar_url || '');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear username error when user types
    if (name === 'username') {
      setUsernameError('');
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
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

  // Handle avatar deletion
  const handleDeleteAvatar = async () => {
    try {
      setSaving(true);
      await userProfileService.deleteAvatar();
      setAvatarPreview('');
      setAvatarFile(null);
      setSuccess(true);
      
      // Update profile state
      setProfile(prev => ({
        ...prev,
        avatar_url: ''
      }));
      
      // Notify parent component
      if (onProfileUpdate) {
        onProfileUpdate({
          ...profile,
          avatar_url: ''
        });
      }
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setError('Failed to delete avatar. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Check username availability
  const checkUsername = async (username) => {
    if (!username || username === profile.username) return true;
    
    try {
      const isAvailable = await userProfileService.checkUsernameAvailability(username);
      if (!isAvailable) {
        setUsernameError('Username is already taken');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking username:', err);
      setError('Failed to check username availability');
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      // Validate username
      if (formData.username) {
        const isUsernameValid = await checkUsername(formData.username);
        if (!isUsernameValid) {
          setSaving(false);
          return;
        }
      }
      
      // Upload avatar if selected
      let updatedProfile = { ...formData };
      
      if (avatarFile) {
        const profileWithAvatar = await userProfileService.uploadAvatar(avatarFile);
        updatedProfile.avatar_url = profileWithAvatar.avatar_url;
      }
      
      // Update profile
      const savedProfile = await userProfileService.updateUserProfile(updatedProfile);
      
      // Update local state
      setProfile(savedProfile);
      setSuccess(true);
      
      // Notify parent component
      if (onProfileUpdate) {
        onProfileUpdate(savedProfile);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('profile.editProfile')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {t('profile.profileUpdated')}
        </Alert>
      </Snackbar>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Avatar Section */}
          <Grid item xs={12} display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              src={avatarPreview}
              alt={formData.full_name || formData.username || "User"}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                disabled={saving}
              >
                {t('profile.uploadAvatar')}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
              
              {avatarPreview && (
                <IconButton 
                  color="error" 
                  onClick={handleDeleteAvatar}
                  disabled={saving || !avatarPreview}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Grid>
          
          {/* Profile Form */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('profile.username')}
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              error={!!usernameError}
              helperText={usernameError || t('profile.usernameHelp')}
              disabled={saving}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('profile.fullName')}
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              margin="normal"
              disabled={saving}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('profile.bio')}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              disabled={saving}
              helperText={t('profile.aboutYou')}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('profile.location')}
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              disabled={saving}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('profile.website')}
              name="website"
              value={formData.website}
              onChange={handleChange}
              margin="normal"
              disabled={saving}
              placeholder={t('profile.websitePlaceholder')}
            />
          </Grid>
          
          <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              {saving ? <CircularProgress size={24} /> : t('profile.saveChanges')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProfileEditor;