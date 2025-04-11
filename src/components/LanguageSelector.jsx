import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { userSettingsService } from '../services/userSettingsService';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const changeLanguage = async (languageCode) => {
    // Change language in i18n
    await i18n.changeLanguage(languageCode);
    
    // Save preference to user settings if logged in
    try {
      await userSettingsService.updateLanguage(languageCode);
    } catch (error) {
      console.log('User not logged in or error saving language preference');
    }
    
    handleClose();
  };
  
  return (
    <Box>
      <Tooltip title="Change language">
        <IconButton 
          color="inherit" 
          onClick={handleClick}
          aria-controls="language-menu"
          aria-haspopup="true"
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((language) => (
          <MenuItem 
            key={language.code} 
            onClick={() => changeLanguage(language.code)}
            selected={i18n.language === language.code}
          >
            <ListItemIcon sx={{ fontSize: '1.25rem' }}>
              {language.flag}
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;