import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import { userSettingsService } from '../services/userSettingsService';

const SettingsPage = ({ darkMode, toggleDarkMode }) => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notification_preferences: {}
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Available languages
  const languages = userSettingsService.getAvailableLanguages();
  
  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const userSettings = await userSettingsService.getUserSettings();
        setSettings(userSettings);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle language change
  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    
    try {
      // Update in state
      setSettings(prev => ({ ...prev, language: newLanguage }));
      
      // Update in i18n
      await i18n.changeLanguage(newLanguage);
      
      // Save to database
      await userSettingsService.updateLanguage(newLanguage);
      
      setSuccess(true);
    } catch (err) {
      console.error('Error updating language:', err);
      setError('Failed to update language');
    }
  };
  
  // Handle theme change
  const handleThemeChange = async (event) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    
    try {
      // Update in state
      setSettings(prev => ({ ...prev, theme: newTheme }));
      
      // Update theme
      toggleDarkMode();
      
      // Save to database
      await userSettingsService.updateTheme(newTheme);
      
      setSuccess(true);
    } catch (err) {
      console.error('Error updating theme:', err);
      setError('Failed to update theme');
    }
  };
  
  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError('');
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('settings.title')}
        </Typography>
        
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Settings updated successfully!
          </Alert>
        </Snackbar>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            {/* Language Settings */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t('settings.language')}
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">
                  {t('settings.language')}
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={settings.language}
                  label={t('settings.language')}
                  onChange={handleLanguageChange}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px' }}>{lang.flag}</span>
                        {lang.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Theme Settings */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {t('settings.theme')}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleThemeChange}
                    color="primary"
                  />
                }
                label={darkMode ? t('settings.dark') : t('settings.light')}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;