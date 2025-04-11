import { supabase, handleSupabaseError } from '../lib/supabase';

export const authService = {
  // Sign up a new user
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      // Create default profile if signup was successful and user was created
      if (data?.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: email.split('@')[0],
          full_name: metadata.full_name || '',
          created_at: new Date()
        });
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Sign in an existing user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Sign out the current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: handleSupabaseError(error) };
    }
  },

  // Get the current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get the current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Update user password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Update user email
  updateEmail: async (newEmail) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update email error:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};