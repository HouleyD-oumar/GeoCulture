import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { useErrorHandler } from '../hooks/useErrorHandler';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { handleError, clearError } = useErrorHandler();
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await authService.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          const { data: userData, error: userError } = await authService.getCurrentUser();
          if (userError) throw userError;
          setUser(userData.user);
        }
      } catch (err) {
        const errorMsg = handleError(err);
        setAuthError(errorMsg.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (event === 'SIGNED_IN' && session) {
          const { data, error } = await authService.getCurrentUser();
          if (error) {
            setAuthError(error.message);
          } else if (data?.user) {
            setUser(data.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'USER_UPDATED' && session) {
          const { data, error } = await authService.getCurrentUser();
          if (error) {
            setAuthError(error.message);
          } else if (data?.user) {
            setUser(data.user);
          }
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [handleError]);

  // Sign up function
  const signUp = async (email, password, metadata = {}) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await authService.signUp(email, password, metadata);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const errorMsg = handleError(error);
      setAuthError(errorMsg.message);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const errorMsg = handleError(error);
      setAuthError(errorMsg.message);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with OAuth
  const signInWithOAuth = async (provider) => {
    clearError();
    
    try {
      const { data, error } = await authService.signInWithOAuth(provider);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const errorMsg = handleError(error);
      setAuthError(errorMsg.message);
      return { success: false, error: errorMsg };
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    clearError();
    
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      const errorMsg = handleError(error);
      setAuthError(errorMsg.message);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setLoading(true);
    clearError();
    
    try {
      const { error } = await authService.resetPassword(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      const errorMsg = handleError(error);
      setAuthError(errorMsg.message);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    setLoading(true);
    clearError();
    
    try {
      const { error } = await authService.updatePassword(newPassword);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      const errorMsg = handleError(error);
      setAuthError(errorMsg.message);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error: authError,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin: user?.user_metadata?.role === 'admin',
    isModerator: user?.user_metadata?.role === 'moderator' || user?.user_metadata?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};