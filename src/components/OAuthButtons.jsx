import { Button, Box, Divider, Typography } from '@mui/material';
import { 
  Google as GoogleIcon, 
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Apple as AppleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const OAuthButtons = ({ onSuccess }) => {
  const { signInWithOAuth, loading } = useAuth();
  const [providerLoading, setProviderLoading] = useState(null);
  
  const handleOAuthSignIn = async (provider) => {
    setProviderLoading(provider);
    try {
      const { data, error } = await signInWithOAuth(provider);
      if (!error && onSuccess) {
        onSuccess(data);
      }
    } finally {
      setProviderLoading(null);
    }
  };
  
  const providers = [
    { id: 'google', name: 'Google', icon: <GoogleIcon />, color: '#DB4437' },
    { id: 'github', name: 'GitHub', icon: <GitHubIcon />, color: '#333' },
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon />, color: '#4267B2' },
    { id: 'twitter', name: 'X (Twitter)', icon: <TwitterIcon />, color: '#000' },
    { id: 'apple', name: 'Apple', icon: <AppleIcon />, color: '#000' }
  ];
  
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Divider sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>
      
      {providers.map(provider => (
        <Button
          key={provider.id}
          fullWidth
          variant="outlined"
          startIcon={provider.icon}
          onClick={() => handleOAuthSignIn(provider.id)}
          disabled={loading || providerLoading !== null}
          sx={{ 
            mb: 1,
            borderColor: provider.color,
            color: provider.color,
            '&:hover': {
              borderColor: provider.color,
              backgroundColor: `${provider.color}10`
            }
          }}
        >
          {providerLoading === provider.id ? 'Connecting...' : `Continue with ${provider.name}`}
        </Button>
      ))}
    </Box>
  );
};

export default OAuthButtons;