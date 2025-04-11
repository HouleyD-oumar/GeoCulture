import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import AppRoutes from './routes';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { useLanguageDetection } from './hooks/useLanguageDetection';

// Initialize language detection
import './i18n';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Use the language detection hook
  useLanguageDetection();
  
  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };
  
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
