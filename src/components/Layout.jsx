import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PublicIcon from '@mui/icons-material/Public';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleSignOut = async () => {
    await signOut();
    handleCloseUserMenu();
  };
  
  const navItems = [
    { name: t('navigation.home'), path: '/', icon: <HomeIcon /> },
    { name: t('navigation.learn'), path: '/learn', icon: <SchoolIcon /> },
    { name: t('navigation.play'), path: '/play', icon: <SportsEsportsIcon /> },
    { name: t('navigation.leaderboard'), path: '/leaderboard', icon: <LeaderboardIcon /> }
  ];
  
  const userMenuItems = user ? [
    { name: t('navigation.profile'), path: '/profile', icon: <AccountCircleIcon /> },
    { name: t('navigation.favorites'), path: '/favorites', icon: <FavoriteIcon /> },
    { name: t('navigation.achievements'), path: '/achievements', icon: <EmojiEventsIcon /> },
    { name: t('navigation.settings'), path: '/settings', icon: <SettingsIcon /> },
    { name: t('navigation.logout'), action: handleSignOut, icon: null }
  ] : [
    { name: t('navigation.login'), path: '/login', icon: null },
    { name: t('navigation.signup'), path: '/signup', icon: null }
  ];
  
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <PublicIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          GeoCulture
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {userMenuItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={item.path ? RouterLink : 'div'}
            to={item.path}
            onClick={item.action}
            selected={item.path && location.pathname === item.path}
            disablePadding
          >
            <ListItemButton onClick={item.action}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {userMenuItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={item.path ? RouterLink : 'div'}
            to={item.path}
            onClick={item.action}
            selected={item.path && location.pathname === item.path}
            disablePadding
          >
            <ListItemButton onClick={item.action}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for desktop */}
            <PublicIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              GeoCulture
            </Typography>
            
            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            
            {/* Logo for mobile */}
            <PublicIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              GeoCulture
            </Typography>
            
            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'block',
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                    borderRadius: 0
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
            
            {/* Dark mode toggle */}
            <Box sx={{ mr: 2 }}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
            
            {/* User menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={user ? t('navigation.profile') : t('navigation.login')}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user && user.user_metadata?.avatar_url ? (
                    <Avatar alt={user.user_metadata?.full_name} src={user.user_metadata?.avatar_url} />
                  ) : (
                    <Avatar><AccountCircleIcon /></Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userMenuItems.map((item) => (
                  <MenuItem 
                    key={item.name} 
                    onClick={handleCloseUserMenu}
                    component={item.path ? RouterLink : 'div'}
                    to={item.path}
                    sx={{ 
                      minWidth: 150,
                      ...(item.action && { onClick: item.action })
                    }}
                  >
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} GeoCulture. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;