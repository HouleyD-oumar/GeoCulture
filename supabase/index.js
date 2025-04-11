// Supabase Edge Function to delete a user account
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// This function handles user account deletion
// It requires admin privileges to delete a user
export const handler = async (req, res) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }
  
  // Extract the JWT token
  const token = authHeader.replace('Bearer ', '');
  
  // Create Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  );
  
  // Create Supabase client with user token
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user token' });
    }
    
    // Delete user data from various tables
    await Promise.all([
      // Delete user favorites
      supabaseAdmin.from('favorites').delete().eq('user_id', user.id),
      
      // Delete user quiz results
      supabaseAdmin.from('quiz_results').delete().eq('user_id', user.id),
      
      // Delete user achievements
      supabaseAdmin.from('user_achievements').delete().eq('user_id', user.id),
      
      // Delete user settings
      supabaseAdmin.from('user_settings').delete().eq('user_id', user.id)
    ]);
    
    // Finally, delete the user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};