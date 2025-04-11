import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  // Log the error for debugging
  console.error('Supabase error:', error);
  
  // Map common Supabase error codes to user-friendly messages
  if (error.code === 'auth/invalid-email') {
    return { message: 'Invalid email address format.' };
  }
  
  if (error.code === 'auth/email-already-in-use') {
    return { message: 'This email is already in use.' };
  }
  
  if (error.code === 'auth/weak-password') {
    return { message: 'Password is too weak. It should be at least 6 characters.' };
  }
  
  if (error.code === '23505') {
    return { message: 'This record already exists.' };
  }
  
  // Return the original error message or a generic one
  return { 
    message: error.message || error.error_description || 'An unexpected error occurred.' 
  };
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};