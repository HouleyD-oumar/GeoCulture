import { supabase } from '../lib/supabase';

export const quizDataService = {
  // Save quiz result to the database
  saveQuizResult: async (quizData) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { 
      quizType, 
      difficulty, 
      score, 
      maxPossibleScore,
      percentage,
      correctCount, 
      incorrectCount,
      skippedCount,
      timeUsed,
      timeBonus
    } = quizData;
    
    // Save quiz result and return the saved data
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([{ 
        user_id: userData.user.id, 
        quiz_type: quizType, 
        difficulty, 
        score,
        max_score: maxPossibleScore,
        percentage,
        correct_answers: correctCount,
        incorrect_answers: incorrectCount,
        skipped_answers: skippedCount,
        time_used: timeUsed,
        time_bonus: timeBonus
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Check for achievements (will implement this later)
    return { quizResult: data };
  },
  
  // Get user's quiz results
  getUserQuizResults: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    return await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
  },
  
  // Get user's quiz statistics
  getUserQuizStats: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userData.user.id);
      
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
  
  // Get leaderboard data
  getLeaderboard: async (quizType = null, difficulty = null, limit = 10) => {
    let query = supabase
      .from('quiz_results')
      .select(`
        id,
        user_id,
        quiz_type,
        difficulty,
        score,
        max_score,
        percentage,
        time_used,
        created_at,
        profiles:user_id (username, avatar_url)
      `)
      .order('percentage', { ascending: false })
      .order('time_used', { ascending: true })
      .limit(limit);
    
    // Apply filters if provided
    if (quizType) {
      query = query.eq('quiz_type', quizType);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  }
};