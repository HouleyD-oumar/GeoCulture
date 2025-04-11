import { supabase } from '../lib/supabase';
import { generateQuiz } from './quizService';
import { achievementsService } from './achievementsService';

export const dailyChallengeService = {
  // Get today's challenge
  getTodaysChallenge: async () => {
    try {
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check if challenge exists for today
      const { data: existingChallenge, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (existingChallenge) {
        return existingChallenge;
      }
      
      // Generate a new challenge for today
      // Rotate through quiz types and difficulties
      const quizTypes = ['flags', 'capitals', 'geography', 'population', 'advanced'];
      const difficulties = ['easy', 'medium', 'hard'];
      
      // Get the last challenge to determine next type and difficulty
      const { data: lastChallenge, error: lastError } = await supabase
        .from('daily_challenges')
        .select('quiz_type, difficulty')
        .order('challenge_date', { ascending: false })
        .limit(1)
        .single();
        
      if (lastError && lastError.code !== 'PGRST116') throw lastError;
      
      let quizTypeIndex = 0;
      let difficultyIndex = 0;
      
      if (lastChallenge) {
        quizTypeIndex = (quizTypes.indexOf(lastChallenge.quiz_type) + 1) % quizTypes.length;
        difficultyIndex = (difficulties.indexOf(lastChallenge.difficulty) + 1) % difficulties.length;
      }
      
      const quizType = quizTypes[quizTypeIndex];
      const difficulty = difficulties[difficultyIndex];
      
      // Generate quiz
      const quiz = await generateQuiz(quizType, difficulty);
      
      // Create new challenge
      const { data: newChallenge, error: createError } = await supabase
        .from('daily_challenges')
        .insert({
          challenge_date: today,
          quiz_type: quizType,
          difficulty,
          questions: quiz.questions,
          time_limit: 300 // 5 minutes
        })
        .select()
        .single();
        
      if (createError) throw createError;
      
      return newChallenge;
    } catch (error) {
      console.error('Error getting daily challenge:', error);
      throw error;
    }
  },
  
  // Submit daily challenge result
  submitChallengeResult: async (challengeId, results) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Check if user already completed this challenge
      const { data: existingResult } = await supabase
        .from('daily_challenge_results')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('user_id', userData.user.id)
        .maybeSingle();
        
      if (existingResult) {
        throw new Error('You have already completed this challenge');
      }
      
      // Save result
      const { data, error } = await supabase
        .from('daily_challenge_results')
        .insert({
          challenge_id: challengeId,
          user_id: userData.user.id,
          score: results.score,
          max_score: results.maxPossibleScore,
          percentage: results.percentage,
          correct_answers: results.correctCount,
          incorrect_answers: results.incorrectCount,
          skipped_answers: results.skippedCount,
          time_used: results.timeUsed
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Check for streak achievement
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('daily_challenge_streak')
        .eq('user_id', userData.user.id)
        .single();
        
      let streak = 1;
      if (userSettings && userSettings.daily_challenge_streak) {
        streak = userSettings.daily_challenge_streak + 1;
      }
      
      // Update streak
      await supabase
        .from('user_settings')
        .upsert({
          user_id: userData.user.id,
          daily_challenge_streak: streak,
          last_challenge_date: new Date().toISOString().split('T')[0]
        });
        
      // Check for achievements based on streak
      if (streak === 7) {
        await achievementsService.awardAchievement('weekly_challenger');
      } else if (streak === 30) {
        await achievementsService.awardAchievement('monthly_challenger');
      }
      
      return data;
    } catch (error) {
      console.error('Error submitting challenge result:', error);
      throw error;
    }
  },
  
  // Get leaderboard for today's challenge
  getTodaysLeaderboard: async (limit = 10) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: challenge, error: challengeError } = await supabase
        .from('daily_challenges')
        .select('id')
        .eq('challenge_date', today)
        .single();
        
      if (challengeError && challengeError.code !== 'PGRST116') throw challengeError;
      
      if (!challenge) {
        // Return empty leaderboard if no challenge exists yet
        return [];
      }
      
      // Get results with user profiles
      const { data, error } = await supabase
        .from('daily_challenge_results')
        .select(`
          id,
          score,
          percentage,
          time_used,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('challenge_id', challenge.id)
        .order('score', { ascending: false })
        .order('time_used', { ascending: true })
        .limit(limit);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting daily challenge leaderboard:', error);
      return []; // Return empty array instead of throwing
    }
  },
  
  // Check if user has completed today's challenge
  hasCompletedTodaysChallenge: async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's challenge
      const { data: challenge } = await supabase
        .from('daily_challenges')
        .select('id')
        .eq('challenge_date', today)
        .single();
        
      if (!challenge) return false;
      
      // Check if user has completed this challenge
      const { data, error } = await supabase
        .from('daily_challenge_results')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', userData.user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      return !!data;
    } catch (error) {
      console.error('Error checking if user completed challenge:', error);
      return false;
    }
  },
  
  // Get user's challenge history
  getUserChallengeHistory: async (limit = 10) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('daily_challenge_results')
        .select(`
          id,
          score,
          percentage,
          time_used,
          created_at,
          daily_challenges:challenge_id (
            challenge_date,
            quiz_type,
            difficulty
          )
        `)
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting user challenge history:', error);
      throw error;
    }
  },
  
  // Get challenge statistics
  getChallengeStats: async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Get user's challenge results
      const { data, error } = await supabase
        .from('daily_challenge_results')
        .select(`
          id,
          score,
          percentage,
          time_used,
          daily_challenges:challenge_id (
            quiz_type,
            difficulty
          )
        `)
        .eq('user_id', userData.user.id);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          totalChallenges: 0,
          averageScore: 0,
          bestScore: 0,
          fastestTime: 0,
          byQuizType: {},
          byDifficulty: {}
        };
      }
      
      // Calculate statistics
      const totalChallenges = data.length;
      const averageScore = data.reduce((sum, item) => sum + item.percentage, 0) / totalChallenges;
      const bestScore = Math.max(...data.map(item => item.percentage));
      const fastestTime = Math.min(...data.map(item => item.time_used));
      
      // Group by quiz type
      const byQuizType = {};
      data.forEach(item => {
        const quizType = item.daily_challenges.quiz_type;
        if (!byQuizType[quizType]) {
          byQuizType[quizType] = {
            count: 0,
            totalScore: 0,
            bestScore: 0
          };
        }
        byQuizType[quizType].count++;
        byQuizType[quizType].totalScore += item.percentage;
        byQuizType[quizType].bestScore = Math.max(byQuizType[quizType].bestScore, item.percentage);
      });
      
      // Calculate averages for quiz types
      Object.keys(byQuizType).forEach(key => {
        byQuizType[key].averageScore = byQuizType[key].totalScore / byQuizType[key].count;
      });
      
      // Group by difficulty
      const byDifficulty = {};
      data.forEach(item => {
        const difficulty = item.daily_challenges.difficulty;
        if (!byDifficulty[difficulty]) {
          byDifficulty[difficulty] = {
            count: 0,
            totalScore: 0,
            bestScore: 0
          };
        }
        byDifficulty[difficulty].count++;
        byDifficulty[difficulty].totalScore += item.percentage;
        byDifficulty[difficulty].bestScore = Math.max(byDifficulty[difficulty].bestScore, item.percentage);
      });
      
      // Calculate averages for difficulties
      Object.keys(byDifficulty).forEach(key => {
        byDifficulty[key].averageScore = byDifficulty[key].totalScore / byDifficulty[key].count;
      });
      
      return {
        totalChallenges,
        averageScore,
        bestScore,
        fastestTime,
        byQuizType,
        byDifficulty
      };
    } catch (error) {
      console.error('Error getting challenge stats:', error);
      throw error;
    }
  }
};

export default dailyChallengeService;