import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Switch,
  useMediaQuery,
  useTheme,
  Container,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../contexts/AuthContext';

// Remove these comments as they might be causing issues
// Add the LanguageSelector to your Navigation component
// This is a partial update assuming you have a Navigation component

import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

// Remove this comment too
// Inside your Navigation component
const Navigation = ({ darkMode, toggleDarkMode }) => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const IS_MOBILE = useMediaQuery(theme.breakpoints.down('md'));
  const { user, signOut } = useAuth();

  // Update the navItems array to include Achievements
  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Learn', path: '/learn' },
    { text: 'Play', path: '/play' },
    { text: 'Favorites', path: '/favorites' },
    { text: 'Achievements', path: '/achievements' },
    { text: 'Leaderboard', path: '/leaderboard' },
  ];

  const isActive = (path) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleMenuClose();
    navigate('/');
  };

  const drawer = (
    <Box
      sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' ,alignItems: "space-between" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          GeoCulture
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 , flexDirection:"row",justifyContent: "center"} } >
        {navItems.map((item) => (
          <ListItem 
            component={RouterLink} 
            to={item.path} 
            key={item.text}
            selected={isActive(item.path)}
            disablePadding
          >
            <ListItemButton>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Auth-related items for mobile */}
        {user ? (
          <>
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar 
                  sx={{ width: 32, height: 32, mr: 1 }}
                  src={user.user_metadata?.avatar_url || ''}
                >
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <ListItemText 
                  primary={user.user_metadata?.full_name || user.email} 
                  secondary="Logged in"
                  primaryTypographyProps={{ noWrap: true }}
                />
              </Box>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={RouterLink} to="/login" disablePadding>
              <ListItemButton>
                <LoginIcon sx={{ mr: 1 }} />
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem component={RouterLink} to="/signup" disablePadding>
              <ListItemButton>
                <PersonAddIcon sx={{ mr: 1 }} />
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      
      <Divider />
      
      <ListItem>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', p: 1 }}>
          <Brightness4Icon fontSize="small" />
          <Switch 
            checked={darkMode} 
            onChange={toggleDarkMode} 
            color="primary" 
          />
          <Brightness7Icon fontSize="small" />
        </Box>
      </ListItem>
    </Box>
  );

  // The drawer implementation looks good with ListItemButton

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <PublicIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              GeoCulture
            </Typography>
          </Box>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo for mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <PublicIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              GeoCulture
            </Typography>
          </Box>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                sx={{ 
                  color: 'white', 
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  borderBottom: isActive(item.path) ? '2px solid white' : 'none'
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Auth buttons for desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            {user ? (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={handleMenuOpen} color="inherit">
                    <Avatar 
                      sx={{ width: 32, height: 32 }}
                      src={user.user_metadata?.avatar_url || ''}
                    >
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                    <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={RouterLink} 
                  to="/signup"
                  startIcon={<PersonAddIcon />}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Theme toggle button */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer - Make sure to use proper props */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navigation;