import { 
  EmojiEvents as TrophyIcon,
  Flag as FlagIcon,
  Public as EarthIcon,
  LocationCity as CityIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  Whatshot as FireIcon,
  LocalFireDepartment as FlameIcon,
  Bolt as LightningIcon,
  WorkspacePremium as MedalIcon
} from '@mui/icons-material';
import { supabase } from '../lib/supabase'; // Fixed import path
import { QUIZ_TYPES, DIFFICULTY_LEVELS } from '../constants/quizConstants';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Milestone achievements
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first geography quiz',
    // icon: <TrophyIcon />,
    category: 'milestone'
  },
  QUIZ_MASTER_10: {
    id: 'quiz_master_10',
    name: 'Quiz Enthusiast',
    description: 'Complete 10 geography quizzes',
    // icon: <TrophyIcon />,
    category: 'milestone'
  },
  QUIZ_MASTER_25: {
    id: 'quiz_master_25',
    name: 'Quiz Master',
    description: 'Complete 25 geography quizzes',
    // icon: <TrophyIcon />,
    category: 'milestone'
  },
  QUIZ_MASTER_50: {
    id: 'quiz_master_50',
    name: 'Geography Addict',
    description: 'Complete 50 geography quizzes',
    // icon: <TrophyIcon />,
    category: 'milestone'
  },
  
  // Perfect score achievements
  PERFECT_EASY: {
    id: 'perfect_easy',
    name: 'Perfect Beginner',
    description: 'Get a perfect score on an Easy quiz',
    // icon: <StarIcon />,
    category: 'perfect'
  },
  PERFECT_MEDIUM: {
    id: 'perfect_medium',
    name: 'Perfect Intermediate',
    description: 'Get a perfect score on a Medium quiz',
    // icon: <StarIcon />,
    category: 'perfect'
  },
  PERFECT_HARD: {
    id: 'perfect_hard',
    name: 'Perfect Advanced',
    description: 'Get a perfect score on a Hard quiz',
    // icon: <StarIcon />,
    category: 'perfect'
  },
  PERFECT_EXPERT: {
    id: 'perfect_expert',
    name: 'Perfect Expert',
    description: 'Get a perfect score on an Expert quiz',
    // icon: <StarIcon />,
    category: 'perfect'
  },
  
  // Speed achievements
  SPEED_EASY: {
    id: 'speed_easy',
    name: 'Quick Learner',
    description: 'Complete an Easy quiz in half the allotted time with at least 80% accuracy',
    // icon: <SpeedIcon />,
    category: 'speed'
  },
  SPEED_MEDIUM: {
    id: 'speed_medium',
    name: 'Speed Geographer',
    description: 'Complete a Medium quiz in half the allotted time with at least 80% accuracy',
    // icon: <SpeedIcon />,
    category: 'speed'
  },
  SPEED_HARD: {
    id: 'speed_hard',
    name: 'Geography Speedster',
    description: 'Complete a Hard quiz in half the allotted time with at least 80% accuracy',
    // icon: <SpeedIcon />,
    category: 'speed'
  },
  SPEED_EXPERT: {
    id: 'speed_expert',
    name: 'Lightning Geographer',
    description: 'Complete an Expert quiz in half the allotted time with at least 80% accuracy',
    // icon: <LightningIcon />,
    category: 'speed'
  },
  
  // Mastery achievements
  MASTER_MEDIUM: {
    id: 'master_medium',
    name: 'Medium Mastery',
    description: 'Get at least 90% on 5 Medium quizzes',
    // icon: <MedalIcon />,
    category: 'mastery'
  },
  MASTER_HARD: {
    id: 'master_hard',
    name: 'Hard Mastery',
    description: 'Get at least 90% on 5 Hard quizzes',
    // icon: <MedalIcon />,
    category: 'mastery'
  },
  EXPERT_GEOGRAPHER: {
    id: 'expert_geographer',
    name: 'Expert Geographer',
    description: 'Get at least 90% on 5 Expert quizzes',
    // icon: <MedalIcon />,
    category: 'mastery'
  },
  
  // Quiz type expertise
  FLAG_EXPERT: {
    id: 'flag_expert',
    name: 'Flag Expert',
    description: 'Get at least 90% on 3 Flag quizzes at Hard or Expert difficulty',
    // icon: <FlagIcon />,
    category: 'expertise'
  },
  CAPITAL_EXPERT: {
    id: 'capital_expert',
    name: 'Capital Cities Expert',
    description: 'Get at least 90% on 3 Capital quizzes at Hard or Expert difficulty',
    // icon: <CityIcon />,
    category: 'expertise'
  },
  GEOGRAPHY_EXPERT: {
    id: 'geography_expert',
    name: 'Geography Expert',
    description: 'Get at least 90% on 3 Geography quizzes at Hard or Expert difficulty',
    // icon: <EarthIcon />,
    category: 'expertise'
  },
  
  // Special achievements
  CONSISTENT_PERFORMER: {
    id: 'consistent_performer',
    name: 'Consistent Performer',
    description: 'Get at least 80% on 10 consecutive quizzes',
    // icon: <FireIcon />,
    category: 'special'
  },
  GLOBAL_EXPLORER: {
    id: 'global_explorer',
    name: 'Global Explorer',
    description: 'Complete at least one quiz of each type',
    // icon: <EarthIcon />,
    category: 'special'
  },
  GEOGRAPHY_GENIUS: {
    id: 'geography_genius',
    name: 'Geography Genius',
    description: 'Earn all other achievements',
    // icon: <FlameIcon />,
    category: 'special'
  }
};

// Get earned achievements from local storage
export const getEarnedAchievements = () => {
  try {
    const achievements = localStorage.getItem('earnedAchievements');
    return achievements ? JSON.parse(achievements) : [];
  } catch (error) {
    console.error('Error getting earned achievements:', error);
    return [];
  }
};

// Save earned achievements to local storage
const saveEarnedAchievements = (achievements) => {
  try {
    localStorage.setItem('earnedAchievements', JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving earned achievements:', error);
  }
};

// Check if an achievement is already earned
const isAchievementEarned = (achievementId) => {
  const earnedAchievements = getEarnedAchievements();
  return earnedAchievements.some(a => a.id === achievementId);
};

// Add a new earned achievement
const addEarnedAchievement = (achievementId) => {
  if (isAchievementEarned(achievementId)) return false;
  
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return false;
  
  const earnedAchievements = getEarnedAchievements();
  const newAchievement = {
    ...achievement,
    dateEarned: new Date().toISOString()
  };
  
  earnedAchievements.push(newAchievement);
  saveEarnedAchievements(earnedAchievements);
  
  return newAchievement;
};

// Get quiz results from local storage
const getQuizResults = () => {
  try {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
};

// Check achievements after a quiz
export const checkAchievements = async (quizResult) => {
  const newAchievements = [];
  const results = getQuizResults();
  
  // First quiz achievement
  if (results.length === 1) {
    const achievement = addEarnedAchievement('first_quiz');
    if (achievement) newAchievements.push(achievement);
  }
  
  // Quiz count achievements
  if (results.length === 10) {
    const achievement = addEarnedAchievement('quiz_master_10');
    if (achievement) newAchievements.push(achievement);
  } else if (results.length === 25) {
    const achievement = addEarnedAchievement('quiz_master_25');
    if (achievement) newAchievements.push(achievement);
  } else if (results.length === 50) {
    const achievement = addEarnedAchievement('quiz_master_50');
    if (achievement) newAchievements.push(achievement);
  }
  
  // Perfect score achievements
  if (quizResult.percentage === 100) {
    let achievementId = null;
    
    switch (quizResult.difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        achievementId = 'perfect_easy';
        break;
      case DIFFICULTY_LEVELS.MEDIUM:
        achievementId = 'perfect_medium';
        break;
      case DIFFICULTY_LEVELS.HARD:
        achievementId = 'perfect_hard';
        break;
      case DIFFICULTY_LEVELS.EXPERT:
        achievementId = 'perfect_expert';
        break;
    }
    
    if (achievementId) {
      const achievement = addEarnedAchievement(achievementId);
      if (achievement) newAchievements.push(achievement);
    }
  }
  
  // Speed achievements
  const difficultyConfig = {
    [DIFFICULTY_LEVELS.EASY]: { timeLimit: 360, achievementId: 'speed_easy' },
    [DIFFICULTY_LEVELS.MEDIUM]: { timeLimit: 300, achievementId: 'speed_medium' },
    [DIFFICULTY_LEVELS.HARD]: { timeLimit: 240, achievementId: 'speed_hard' },
    [DIFFICULTY_LEVELS.EXPERT]: { timeLimit: 180, achievementId: 'speed_expert' }
  };
  
  const config = difficultyConfig[quizResult.difficulty];
  if (config && quizResult.percentage >= 80 && quizResult.timeUsed < config.timeLimit / 2) {
    const achievement = addEarnedAchievement(config.achievementId);
    if (achievement) newAchievements.push(achievement);
  }
  
  // Mastery achievements
  const difficultyMasteryMap = {
    [DIFFICULTY_LEVELS.MEDIUM]: 'master_medium',
    [DIFFICULTY_LEVELS.HARD]: 'master_hard',
    [DIFFICULTY_LEVELS.EXPERT]: 'expert_geographer'
  };
  
  const masteryAchievementId = difficultyMasteryMap[quizResult.difficulty];
  if (masteryAchievementId && quizResult.percentage >= 90) {
    // Count how many quizzes at this difficulty with 90%+ score
    const previousResults = getQuizResults().filter(
      r => r.difficulty === quizResult.difficulty && r.percentage >= 90
    );
    
    // If this is the 5th one (including current quiz)
    if (previousResults.length >= 4) {
      const achievement = addEarnedAchievement(masteryAchievementId);
      if (achievement) newAchievements.push(achievement);
    }
  }
  
  // Quiz type expertise
  const expertiseMap = {
    [QUIZ_TYPES.FLAGS]: 'flag_expert',
    [QUIZ_TYPES.CAPITALS]: 'capital_expert',
    [QUIZ_TYPES.GEOGRAPHY]: 'geography_expert'
  };
  
  const expertiseAchievementId = expertiseMap[quizResult.quizType];
  if (expertiseAchievementId && 
      (quizResult.difficulty === DIFFICULTY_LEVELS.HARD || quizResult.difficulty === DIFFICULTY_LEVELS.EXPERT) && 
      quizResult.percentage >= 90) {
    
    // Count high scores for this quiz type at hard/expert difficulty
    const previousResults = getQuizResults().filter(
      r => r.quizType === quizResult.quizType && 
           (r.difficulty === DIFFICULTY_LEVELS.HARD || r.difficulty === DIFFICULTY_LEVELS.EXPERT) &&
           r.percentage >= 90
    );
    
    // If this is the 3rd one (including current quiz)
    if (previousResults.length >= 2) {
      const achievement = addEarnedAchievement(expertiseAchievementId);
      if (achievement) newAchievements.push(achievement);
    }
  }
  
  // Consistent performer achievement
  const previousResults = getQuizResults();
  if (previousResults.length >= 9) {
    const last10Results = [quizResult, ...previousResults.slice(0, 9)];
    const allConsistent = last10Results.every(r => r.percentage >= 80);
    
    if (allConsistent) {
      const achievement = addEarnedAchievement('consistent_performer');
      if (achievement) newAchievements.push(achievement);
    }
  }
  
  // Global explorer achievement
  const completedQuizTypes = new Set(previousResults.map(r => r.quizType));
  completedQuizTypes.add(quizResult.quizType);
  
  if (completedQuizTypes.size >= Object.keys(QUIZ_TYPES).length) {
    const achievement = addEarnedAchievement('global_explorer');
    if (achievement) newAchievements.push(achievement);
  }
  
  // Geography genius achievement (all other achievements earned)
  const earnedAchievements = getEarnedAchievements();
  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  
  // If all achievements except geography_genius are earned
  if (earnedAchievements.length === totalAchievements - 1 && 
      !isAchievementEarned('geography_genius')) {
    const achievement = addEarnedAchievement('geography_genius');
    if (achievement) newAchievements.push(achievement);
  }
  
  // If user is authenticated, also save achievements to Supabase
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      // Save each new achievement to Supabase
      for (const achievement of newAchievements) {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userData.user.id,
            achievement_id: achievement.id,
            achievement_name: achievement.name,
            achievement_description: achievement.description,
            earned_at: new Date().toISOString()
          });
          
        if (error) console.error('Error saving achievement to Supabase:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing achievements with Supabase:', error);
  }
  
  return newAchievements;
};

// Get achievement statistics
export const getAchievementStatistics = () => {
  const earnedAchievements = getEarnedAchievements();
  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  
  // Group achievements by category
  const categoryCounts = {};
  const earnedByCategory = {};
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const category = achievement.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    
    if (isAchievementEarned(achievement.id)) {
      earnedByCategory[category] = (earnedByCategory[category] || 0) + 1;
    }
  });
  
  // Calculate completion percentage
  const completionPercentage = (earnedAchievements.length / totalAchievements) * 100;
  
  // Get most recent achievements
  const recentAchievements = [...earnedAchievements]
    .sort((a, b) => new Date(b.dateEarned) - new Date(a.dateEarned))
    .slice(0, 5);
  
  // Calculate progress for different achievement types
  const quizResults = getQuizResults();
  const quizCount = {
    current: quizResults.length,
    next: quizResults.length < 10 ? 10 : quizResults.length < 25 ? 25 : quizResults.length < 50 ? 50 : 50,
    percentage: quizResults.length >= 50 ? 100 : 
                quizResults.length >= 25 ? 50 + (quizResults.length - 25) * 2 :
                quizResults.length >= 10 ? 20 + (quizResults.length - 10) * 3 :
                quizResults.length * 2
  };
  
  // Perfect scores progress
  const perfectScores = {
    current: earnedAchievements.filter(a => a.id.startsWith('perfect_')).length,
    total: Object.values(ACHIEVEMENTS).filter(a => a.id.startsWith('perfect_')).length,
    percentage: 0
  };
  perfectScores.percentage = (perfectScores.current / perfectScores.total) * 100;
  
  // Difficulty mastery progress
  const difficultyMastery = {
    current: earnedAchievements.filter(a => a.category === 'mastery').length,
    total: Object.values(ACHIEVEMENTS).filter(a => a.category === 'mastery').length,
    percentage: 0
  };
  difficultyMastery.percentage = (difficultyMastery.current / difficultyMastery.total) * 100;
  
  // Quiz type expertise progress
  const quizTypeExpertise = {
    current: earnedAchievements.filter(a => a.category === 'expertise').length,
    total: Object.values(ACHIEVEMENTS).filter(a => a.category === 'expertise').length,
    percentage: 0
  };
  quizTypeExpertise.percentage = (quizTypeExpertise.current / quizTypeExpertise.total) * 100;
  
  return {
    totalAchievements,
    earnedCount: earnedAchievements.length,
    completionPercentage,
    categoryCounts,
    earnedByCategory,
    recentAchievements,
    quizCount,
    perfectScores,
    difficultyMastery,
    quizTypeExpertise
  };
};

// Get all achievements with earned status
export const getAllAchievements = () => {
  const earnedAchievements = getEarnedAchievements();
  const earnedIds = earnedAchievements.map(a => a.id);
  
  return Object.values(ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    earned: earnedIds.includes(achievement.id),
    dateEarned: earnedAchievements.find(a => a.id === achievement.id)?.dateEarned
  }));
};

// Get achievements by category
export const getAchievementsByCategory = () => {
  const allAchievements = getAllAchievements();
  const categories = {};
  
  allAchievements.forEach(achievement => {
    if (!categories[achievement.category]) {
      categories[achievement.category] = [];
    }
    categories[achievement.category].push(achievement);
  });
  
  return categories;
};

// Save quiz result and check for achievements
export const saveQuizResultAndCheckAchievements = (quizResult) => {
  try {
    // Ensure quizResult has all required fields
    if (!quizResult || !quizResult.quizType || !quizResult.difficulty) {
      console.error('Invalid quiz result:', quizResult);
      return [];
    }
    
    // Save quiz result
    const results = getQuizResults();
    results.unshift(quizResult); // Add to beginning of array
    localStorage.setItem('quizResults', JSON.stringify(results.slice(0, 100))); // Keep only last 100 results
    
    // Check for achievements
    return checkAchievements(quizResult);
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return [];
  }
};

// Reset all achievements (for testing)
export const resetAchievements = () => {
  try {
    localStorage.removeItem('earnedAchievements');
    return true;
  } catch (error) {
    console.error('Error resetting achievements:', error);
    return false;
  }
};

// Get achievement progress for a specific achievement
export const getAchievementProgress = (achievementId) => {
  if (!ACHIEVEMENTS[achievementId]) return null;
  
  const quizResults = getQuizResults();
  
  // Define difficulty config for speed achievements
  const difficultyConfig = {
    'easy': { timeLimit: 360, achievementId: 'speed_easy' },
    'medium': { timeLimit: 300, achievementId: 'speed_medium' },
    'hard': { timeLimit: 240, achievementId: 'speed_hard' },
    'expert': { timeLimit: 180, achievementId: 'speed_expert' }
  };
  
  // Different logic based on achievement type
  switch (achievementId) {
    case 'first_quiz':
      return {
        current: quizResults.length > 0 ? 1 : 0,
        required: 1,
        percentage: quizResults.length > 0 ? 100 : 0
      };
      
    case 'quiz_master_10':
      return {
        current: Math.min(quizResults.length, 10),
        required: 10,
        percentage: Math.min(quizResults.length / 10 * 100, 100)
      };
      
    case 'quiz_master_25':
      return {
        current: Math.min(quizResults.length, 25),
        required: 25,
        percentage: Math.min(quizResults.length / 25 * 100, 100)
      };
      
    case 'quiz_master_50':
      return {
        current: Math.min(quizResults.length, 50),
        required: 50,
        percentage: Math.min(quizResults.length / 50 * 100, 100)
      };
      
    // Perfect score achievements
    case 'perfect_easy':
    case 'perfect_medium':
    case 'perfect_hard':
    case 'perfect_expert': {
      const difficulty = achievementId.split('_')[1];
      const perfectScores = quizResults.filter(
        r => r.difficulty === difficulty && r.percentage === 100
      ).length;
      
      return {
        current: Math.min(perfectScores, 1),
        required: 1,
        percentage: perfectScores > 0 ? 100 : 0
      };
    }
    
    // Mastery achievements
    case 'master_medium':
    case 'master_hard':
    case 'expert_geographer': {
      const difficulty = achievementId === 'expert_geographer' ? 'expert' : 
                         achievementId.split('_')[1];
      
      const highScores = quizResults.filter(
        r => r.difficulty === difficulty && r.percentage >= 90
      ).length;
      
      return {
        current: Math.min(highScores, 5),
        required: 5,
        percentage: Math.min(highScores / 5 * 100, 100)
      };
    }
    
    // Expertise achievements
    case 'flag_expert':
    case 'capital_expert':
    case 'geography_expert': {
      const quizType = achievementId.split('_')[0];
      
      const expertScores = quizResults.filter(
        r => r.quizType === quizType && 
             (r.difficulty === 'hard' || r.difficulty === 'expert') &&
             r.percentage >= 90
      ).length;
      
      return {
        current: Math.min(expertScores, 3),
        required: 3,
        percentage: Math.min(expertScores / 3 * 100, 100)
      };
    }
    
    // Speed achievements
    case 'speed_easy':
    case 'speed_medium':
    case 'speed_hard':
    case 'speed_expert': {
      const difficulty = achievementId.split('_')[1];
      const config = difficultyConfig[difficulty];
      
      const speedyResults = quizResults.filter(
        r => r.difficulty === difficulty && 
             r.percentage >= 80 && 
             r.timeUsed < config.timeLimit / 2
      ).length;
      
      return {
        current: Math.min(speedyResults, 1),
        required: 1,
        percentage: speedyResults > 0 ? 100 : 0
      };
    }
    
    // Consistent performer achievement
    case 'consistent_performer': {
      // Find longest streak of 80%+ scores
      let currentStreak = 0;
      let maxStreak = 0;
      
      for (const result of quizResults) {
        if (result.percentage >= 80) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      return {
        current: Math.min(maxStreak, 10),
        required: 10,
        percentage: Math.min(maxStreak / 10 * 100, 100)
      };
    }
    
    // Global explorer achievement
    case 'global_explorer': {
      const completedQuizTypes = new Set(quizResults.map(r => r.quizType));
      const totalTypes = Object.keys(QUIZ_TYPES).length;
      
      return {
        current: completedQuizTypes.size,
        required: totalTypes,
        percentage: (completedQuizTypes.size / totalTypes) * 100
      };
    }
    
    // Geography genius achievement
    case 'geography_genius': {
      const earnedAchievements = getEarnedAchievements();
      const totalAchievements = Object.keys(ACHIEVEMENTS).length - 1; // Exclude this one
      
      return {
        current: earnedAchievements.length,
        required: totalAchievements,
        percentage: (earnedAchievements.length / totalAchievements) * 100
      };
    }
    
    default:
      return null;
  }
};

// Debug function to check achievement progress (for development)
export const debugAchievementProgress = () => {
  const allAchievements = getAllAchievements();
  const progressData = {};
  
  allAchievements.forEach(achievement => {
    if (!achievement.earned) {
      progressData[achievement.id] = getAchievementProgress(achievement.id);
    }
  });
  
  console.log('Achievement Progress:', progressData);
  return progressData;
};