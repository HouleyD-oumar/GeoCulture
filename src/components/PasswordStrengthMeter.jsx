import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress, Typography } from '@mui/material';

const PasswordStrengthMeter = ({ password }) => {
  const { t } = useTranslation();
  const [strength, setStrength] = useState(0);
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }
    
    let calculatedStrength = 0;
    
    // Length check
    if (password.length >= 8) calculatedStrength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) calculatedStrength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) calculatedStrength += 25;
    
    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) calculatedStrength += 25;
    
    setStrength(calculatedStrength);
  }, [password]);
  
  const getStrengthColor = () => {
    if (strength < 50) return 'error';
    if (strength < 75) return 'warning';
    return 'success';
  };
  
  const getStrengthLabel = () => {
    if (strength < 25) return t('password.veryWeak');
    if (strength < 50) return t('password.weak');
    if (strength < 75) return t('password.good');
    if (strength < 100) return t('password.strong');
    return t('password.veryStrong');
  };
  
  if (!password) return null;
  
  return (
    <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {t('password.strength')}
        </Typography>
        <Typography variant="caption" color={`${getStrengthColor()}.main`}>
          {getStrengthLabel()}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={strength} 
        color={getStrengthColor()} 
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default PasswordStrengthMeter;