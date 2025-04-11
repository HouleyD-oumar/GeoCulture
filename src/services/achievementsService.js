import { supabase } from '../lib/supabase';

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'beginner'
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get a perfect score on any quiz',
    icon: '🏆',
    category: 'mastery'
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: '🧠',
    category: 'dedication'
  },
  GEOGRAPHY_EXPERT: {
    id: 'geography_expert',
    name: 'Geography Expert',
    description: 'Get a score of 80% or higher on an expert difficulty quiz',
    icon: '🌍',
    category: 'mastery'
  },
  FLAG_ENTHUSIAST: {
    id: 'flag_enthusiast',
    name: 'Flag Enthusiast',
    description: 'Complete 5 flag quizzes',
    icon: '🚩',
    category: 'specialization'
  },
  CAPITAL_CONNOISSEUR: {
    id: 'capital_connoisseur',
    name: 'Capital Connoisseur',
    description: 'Complete 5 capital city quizzes',
    icon: '🏙️',
    category: 'specialization'
  },
  WORLD_TRAVELER: {
    id: 'world_traveler',
    name: 'World Traveler',
    description: 'Add 10 countries to your favorites',
    icon: '✈️',
    category: 'exploration'
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in less than half the allotted time with at least 80% accuracy',
    icon: '⚡',
    category: 'mastery'
  },
  CONTINENT_MASTER: {
    id: 'continent_master',
    name: 'Continent Master',
    description: 'Score at least 80% on quizzes for all continents',
    icon: '🌐',
    category: 'exploration'
  }
};

export const achievementsService = {
  // Get all available achievements
  getAllAchievements: () => {
    return Object.values(ACHIEVEMENTS);
  },
  
  // Get user achievements
  getUserAchievements: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userData.user.id);
      
    if (error) throw error;
    
    return data || [];
  },
  
  // Award an achievement to the user
  awardAchievement: async (achievementId) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Check if achievement exists
    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
    if (!achievement) {
      throw new Error(`Achievement ${achievementId} not found`);
    }
    
    // Check if user already has this achievement
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('achievement_id', achievementId)
      .maybeSingle();
      
    if (existingAchievement) {
      return existingAchievement; // User already has this achievement
    }
    
    // Award the achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert([{
        user_id: userData.user.id,
        achievement_id: achievement.id,
        achievement_name: achievement.name,
        achievement_description: achievement.description,
        achievement_icon: achievement.icon
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Check for achievements based on quiz results
  checkQuizAchievements: async (quizData) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return [];
      
      const awardedAchievements = [];
      
      // Get user's quiz results
      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userData.user.id);
      
      if (!quizResults) return [];
      
      // First quiz achievement
      if (quizResults.length === 1) {
        const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.FIRST_QUIZ.id);
        if (achievement) awardedAchievements.push(achievement);
      }
      
      // Quiz master achievement
      if (quizResults.length === 10) {
        const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.QUIZ_MASTER.id);
        if (achievement) awardedAchievements.push(achievement);
      }
      
      // Perfect score achievement
      if (quizData.percentage === 100) {
        const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.PERFECT_SCORE.id);
        if (achievement) awardedAchievements.push(achievement);
      }
      
      // Geography expert achievement
      if (quizData.difficulty === 'expert' && quizData.percentage >= 80) {
        const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.GEOGRAPHY_EXPERT.id);
        if (achievement) awardedAchievements.push(achievement);
      }
      
      // Flag enthusiast achievement
      if (quizData.quizType === 'flags') {
        const flagQuizzes = quizResults.filter(quiz => quiz.quiz_type === 'flags');
        if (flagQuizzes.length === 5) {
          const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.FLAG_ENTHUSIAST.id);
          if (achievement) awardedAchievements.push(achievement);
        }
      }
      
      // Capital connoisseur achievement
      if (quizData.quizType === 'capitals') {
        const capitalQuizzes = quizResults.filter(quiz => quiz.quiz_type === 'capitals');
        if (capitalQuizzes.length === 5) {
          const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.CAPITAL_CONNOISSEUR.id);
          if (achievement) awardedAchievements.push(achievement);
        }
      }
      
      // Speed demon achievement
      if (quizData.timeUsed && quizData.percentage >= 80) {
        // Check if time used is less than half the allotted time
        // This assumes the quiz has a timeLimit property
        const timeLimit = quizData.timeLimit || 300; // Default to 5 minutes if not specified
        if (quizData.timeUsed < timeLimit / 2) {
          const achievement = await achievementsService.awardAchievement(ACHIEVEMENTS.SPEED_DEMON.id);
          if (achievement) awardedAchievements.push(achievement);
        }
      }
      
      return awardedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }
};