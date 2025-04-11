import { supabase } from '../lib/supabase';

export const userProfileService = {
  // Get user profile
  getUserProfile: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    // If no profile exists yet, create default profile
    if (!data) {
      const defaultProfile = {
        username: userData.user.email.split('@')[0],
        full_name: '',
        avatar_url: '',
        bio: '',
        location: '',
        website: '',
        social_links: {}
      };
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          id: userData.user.id,
          ...defaultProfile
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return newProfile;
    }
    
    return data;
  },
  
  // Update user profile
  updateUserProfile: async (updates) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Upload avatar image
  uploadAvatar: async (file) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);
      
    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded avatar');
    }
    
    // Update user profile with new avatar URL
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Delete avatar image
  deleteAvatar: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Get current profile to get avatar URL
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userData.user.id)
      .single();
      
    if (profile?.avatar_url) {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `avatars/${fileName}`;
      
      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('user-content')
        .remove([filePath]);
        
      if (deleteError) {
        console.error('Error deleting avatar file:', deleteError);
      }
    }
    
    // Update profile to remove avatar URL
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: '',
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Get user profile by ID (for public profiles)
  getPublicProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, bio, location, website')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Check if username is available
  checkUsernameAvailability: async (username) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
      
    if (error) throw error;
    
    return !data; // Return true if username is available (no data found)
  },
  
  // Get user achievements
  getUserAchievements: async (userId = null) => {
    const { data: userData } = await supabase.auth.getUser();
    const targetUserId = userId || userData?.user?.id;
    
    if (!targetUserId) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', targetUserId)
      .order('earned_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  },
  
  // Get user quiz stats
  getUserQuizStats: async (userId = null) => {
    const { data: userData } = await supabase.auth.getUser();
    const targetUserId = userId || userData?.user?.id;
    
    if (!targetUserId) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', targetUserId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        quizzesByType: {},
        quizzesByDifficulty: {}
      };
    }
    
    // Calculate statistics
    const totalQuizzes = data.length;
    const averageScore = data.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes;
    const bestScore = Math.max(...data.map(quiz => quiz.percentage));
    
    // Group by quiz type
    const quizzesByType = data.reduce((acc, quiz) => {
      acc[quiz.quiz_type] = (acc[quiz.quiz_type] || 0) + 1;
      return acc;
    }, {});
    
    // Group by difficulty
    const quizzesByDifficulty = data.reduce((acc, quiz) => {
      acc[quiz.difficulty] = (acc[quiz.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalQuizzes,
      averageScore,
      bestScore,
      quizzesByType,
      quizzesByDifficulty
    };
  },
  
  // Get user's favorite countries
  getUserFavorites: async (userId = null) => {
    const { data: userData } = await supabase.auth.getUser();
    const targetUserId = userId || userData?.user?.id;
    
    if (!targetUserId) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('favorites')
      .select('country_id, country_name, created_at')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  },
  
  // Get user activity feed
  getUserActivity: async (limit = 10) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Get combined activity (quizzes, achievements, favorites)
    const [quizResults, achievements, favorites] = await Promise.all([
      // Get quiz results
      supabase
        .from('quiz_results')
        .select('id, quiz_type, difficulty, percentage, created_at')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(limit),
        
      // Get achievements
      supabase
        .from('user_achievements')
        .select('id, achievement_id, achievement_name, earned_at')
        .eq('user_id', userData.user.id)
        .order('earned_at', { ascending: false })
        .limit(limit),
        
      // Get favorites
      supabase
        .from('favorites')
        .select('id, country_id, country_name, created_at')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);
    
    // Combine and format activities
    const activities = [
      // Format quiz results
      ...(quizResults.data || []).map(quiz => ({
        id: `quiz_${quiz.id}`,
        type: 'quiz',
        title: `Completed ${quiz.quiz_type} quiz`,
        description: `Scored ${quiz.percentage}% on ${quiz.difficulty} difficulty`,
        timestamp: new Date(quiz.created_at),
        data: quiz
      })),
      
      // Format achievements
      ...(achievements.data || []).map(achievement => ({
        id: `achievement_${achievement.id}`,
        type: 'achievement',
        title: `Earned achievement`,
        description: achievement.achievement_name,
        timestamp: new Date(achievement.earned_at),
        data: achievement
      })),
      
      // Format favorites
      ...(favorites.data || []).map(favorite => ({
        id: `favorite_${favorite.id}`,
        type: 'favorite',
        title: `Added to favorites`,
        description: favorite.country_name,
        timestamp: new Date(favorite.created_at),
        data: favorite
      }))
    ];
    
    // Sort by timestamp (newest first) and limit
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
};