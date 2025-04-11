import { getAllCountries } from './countryService';
import { checkAchievements } from './achievementService';
import { supabase } from '../lib/supabase'; // Fixed import path

// Quiz types
export const QUIZ_TYPES = {
  FLAGS: 'flags',
  CAPITALS: 'capitals',
  POPULATION: 'population',
  GEOGRAPHY: 'geography',
  ADVANCED: 'advanced'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
};

// Difficulty level configurations
export const DIFFICULTY_CONFIG = {
  [DIFFICULTY_LEVELS.EASY]: {
    name: 'Easy',
    totalQuestions: 8,
    timeLimit: 360, // 6 minutes
    pointsPerQuestion: 1,
    penaltyPerWrong: 0,
    optionsCount: 3,
    timeBonus: 5, // Bonus seconds per correct answer
    description: 'Basic questions with more time and no penalty'
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    name: 'Medium',
    totalQuestions: 10,
    timeLimit: 300, // 5 minutes
    pointsPerQuestion: 2,
    penaltyPerWrong: -1,
    optionsCount: 4,
    timeBonus: 3,
    description: 'Balance between difficulty and time'
  },
  [DIFFICULTY_LEVELS.HARD]: {
    name: 'Hard',
    totalQuestions: 12,
    timeLimit: 240, // 4 minutes
    pointsPerQuestion: 3,
    penaltyPerWrong: -2,
    optionsCount: 4,
    timeBonus: 2,
    description: 'Advanced questions, less time, higher penalties'
  },
  [DIFFICULTY_LEVELS.EXPERT]: {
    name: 'Expert',
    totalQuestions: 15,
    timeLimit: 180, // 3 minutes
    pointsPerQuestion: 4,
    penaltyPerWrong: -3,
    optionsCount: 5,
    timeBonus: 0,
    description: 'For true geography enthusiasts!'
  }
};

// Helper function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate quiz based on type and difficulty
export const generateQuiz = async (quizType, difficulty = DIFFICULTY_LEVELS.MEDIUM) => {
  try {
    // Get all countries
    const allCountries = await getAllCountries();
    
    // Get difficulty configuration
    const diffConfig = DIFFICULTY_CONFIG[difficulty];
    const questionCount = diffConfig.totalQuestions;
    
    // Generate questions based on quiz type
    switch (quizType) {
      case QUIZ_TYPES.FLAGS:
        return generateFlagQuiz(allCountries, questionCount, diffConfig);
      case QUIZ_TYPES.CAPITALS:
        return generateCapitalsQuiz(allCountries, questionCount, diffConfig);
      case QUIZ_TYPES.POPULATION:
        return generatePopulationQuiz(allCountries, questionCount, diffConfig);
      case QUIZ_TYPES.GEOGRAPHY:
        return generateGeographyQuiz(allCountries, questionCount, diffConfig);
      case QUIZ_TYPES.ADVANCED:
        return generateAdvancedQuiz(allCountries, questionCount, diffConfig);
      default:
        throw new Error(`Unknown quiz type: ${quizType}`);
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

// Generate flag quiz
const generateFlagQuiz = (countries, questionCount, diffConfig) => {
  // Filter countries with valid flags
  const validCountries = countries.filter(country => country.flag);
  
  // Get random countries for questions
  const quizCountries = getRandomItems(validCountries, questionCount);
  
  // Create questions
  const questions = quizCountries.map(country => {
    // Get random incorrect options
    const incorrectOptions = getRandomItems(
      validCountries.filter(c => c.id !== country.id),
      diffConfig.optionsCount - 1
    ).map(c => c.name);
    
    // Create answer options
    const options = [...incorrectOptions, country.name].sort(() => 0.5 - Math.random());
    
    return {
      id: country.id,
      question: "Which country does this flag belong to?",
      image: country.flag,
      options,
      correctAnswer: country.name
    };
  });
  
  return {
    title: "Flag Quiz",
    description: "Test your knowledge of country flags from around the world",
    type: QUIZ_TYPES.FLAGS,
    questions,
    totalQuestions: questions.length,
    difficulty: diffConfig.name.toLowerCase(),
    difficultyConfig: diffConfig,
    timeLimit: diffConfig.timeLimit
  };
};

// Generate capitals quiz
const generateCapitalsQuiz = (countries, questionCount, diffConfig) => {
  // Filter countries with valid capitals
  const validCountries = countries.filter(country => country.capital && country.capital !== 'N/A');
  
  // Get random countries for questions
  const quizCountries = getRandomItems(validCountries, questionCount);
  
  // Create questions
  const questions = quizCountries.map(country => {
    // Get random incorrect options
    const incorrectOptions = getRandomItems(
      validCountries.filter(c => c.id !== country.id),
      diffConfig.optionsCount - 1
    ).map(c => c.capital);
    
    // Create answer options
    const options = [...incorrectOptions, country.capital].sort(() => 0.5 - Math.random());
    
    return {
      id: country.id,
      question: `What is the capital of ${country.name}?`,
      options,
      correctAnswer: country.capital
    };
  });
  
  return {
    title: "Capital Cities Quiz",
    description: "Test your knowledge of capital cities around the world",
    type: QUIZ_TYPES.CAPITALS,
    questions,
    totalQuestions: questions.length,
    difficulty: diffConfig.name.toLowerCase(), // Fixed: use diffConfig.name.toLowerCase() instead of undefined difficulty
    difficultyConfig: diffConfig,
    timeLimit: diffConfig.timeLimit
  };
};

// Generate population quiz
const generatePopulationQuiz = (countries, questionCount, diffConfig) => {
  // Filter countries with valid population
  const validCountries = countries.filter(country => country.population > 0);
  
  // Get random countries for questions
  const quizCountries = getRandomItems(validCountries, questionCount);
  
  // Create questions
  const questions = quizCountries.map(country => {
    // Get random countries for comparison
    const comparisonCountries = getRandomItems(
      validCountries.filter(c => c.id !== country.id),
      diffConfig.optionsCount - 1
    );
    
    // Create answer options with all countries
    const allOptions = [country, ...comparisonCountries].sort(() => 0.5 - Math.random());
    
    // Determine question type (larger or smaller population)
    const isLarger = Math.random() > 0.5;
    const questionText = isLarger 
      ? "Which country has the largest population?" 
      : "Which country has the smallest population?";
    
    // Determine correct answer based on question type
    const correctAnswer = isLarger 
      ? allOptions.reduce((max, c) => c.population > max.population ? c : max, { population: 0 }).name
      : allOptions.reduce((min, c) => c.population < min.population ? c : min, { population: Number.MAX_SAFE_INTEGER }).name;
    
    return {
      id: `pop-${country.id}`,
      question: questionText,
      options: allOptions.map(c => c.name),
      correctAnswer
    };
  });
  
  return {
    title: "Population Quiz",
    description: "Test your knowledge of country populations around the world",
    type: QUIZ_TYPES.POPULATION,
    questions,
    totalQuestions: questions.length,
    difficulty: diffConfig.name.toLowerCase(), // Fixed: use diffConfig.name.toLowerCase() instead of undefined difficulty
    difficultyConfig: diffConfig,
    timeLimit: diffConfig.timeLimit
  };
};

// Generate geography quiz
const generateGeographyQuiz = (countries, questionCount, diffConfig) => {
  // Filter countries with valid region
  const validCountries = countries.filter(country => country.region);
  
  // Get random countries for questions
  const quizCountries = getRandomItems(validCountries, questionCount);
  
  // Create questions
  const questions = quizCountries.map((country, index) => {
    // Alternate between different geography question types
    const questionType = index % 3;
    
    switch (questionType) {
      // Region questions
      case 0: {
        // Get random incorrect regions
        const allRegions = [...new Set(validCountries.map(c => c.region))];
        const incorrectOptions = getRandomItems(
          allRegions.filter(r => r !== country.region),
          diffConfig.optionsCount - 1
        );
        
        // Create answer options
        const options = [...incorrectOptions, country.region].sort(() => 0.5 - Math.random());
        
        return {
          id: `geo-region-${country.id}`,
          question: `In which region is ${country.name} located?`,
          options,
          correctAnswer: country.region
        };
      }
      
      // Subregion questions
      case 1: {
        if (!country.subregion) {
          // Fallback to region question if subregion is not available
          const allRegions = [...new Set(validCountries.map(c => c.region))];
          const incorrectOptions = getRandomItems(
            allRegions.filter(r => r !== country.region),
            diffConfig.optionsCount - 1
          );
          
          const options = [...incorrectOptions, country.region].sort(() => 0.5 - Math.random());
          
          return {
            id: `geo-region-fallback-${country.id}`,
            question: `In which region is ${country.name} located?`,
            options,
            correctAnswer: country.region
          };
        }
        
        // Get countries in the same region
        const sameRegionCountries = validCountries.filter(c => c.region === country.region);
        
        // Get all subregions in this region
        const subregionsInRegion = [...new Set(sameRegionCountries.map(c => c.subregion))].filter(Boolean);
        
        // Get random incorrect subregions
        const incorrectOptions = getRandomItems(
          subregionsInRegion.filter(s => s !== country.subregion),
          Math.min(diffConfig.optionsCount - 1, subregionsInRegion.length - 1)
        );
        
        // If we don't have enough subregions, add some from other regions
        if (incorrectOptions.length < diffConfig.optionsCount - 1) {
          const otherSubregions = [...new Set(validCountries.map(c => c.subregion))].filter(s => 
            s && s !== country.subregion && !incorrectOptions.includes(s)
          );
          
          incorrectOptions.push(...getRandomItems(
            otherSubregions,
            diffConfig.optionsCount - 1 - incorrectOptions.length
          ));
        }
        
        // Create answer options
        const options = [...incorrectOptions, country.subregion].sort(() => 0.5 - Math.random());
        
        return {
          id: `geo-subregion-${country.id}`,
          question: `In which subregion is ${country.name} located?`,
          options,
          correctAnswer: country.subregion
        };
      }
      
      // Border countries questions
      case 2: {
        if (!country.borders || country.borders.length === 0) {
          // Fallback to region question if no borders
          const allRegions = [...new Set(validCountries.map(c => c.region))];
          const incorrectOptions = getRandomItems(
            allRegions.filter(r => r !== country.region),
            diffConfig.optionsCount - 1
          );
          
          const options = [...incorrectOptions, country.region].sort(() => 0.5 - Math.random());
          
          return {
            id: `geo-region-fallback2-${country.id}`,
            question: `In which region is ${country.name} located?`,
            options,
            correctAnswer: country.region
          };
        }
        
        // Get a random border country
        const borderCode = country.borders[Math.floor(Math.random() * country.borders.length)];
        const borderCountry = countries.find(c => c.alpha3Code === borderCode);
        
        if (!borderCountry) {
          // Fallback if border country not found
          const allRegions = [...new Set(validCountries.map(c => c.region))];
          const incorrectOptions = getRandomItems(
            allRegions.filter(r => r !== country.region),
            diffConfig.optionsCount - 1
          );
          
          const options = [...incorrectOptions, country.region].sort(() => 0.5 - Math.random());
          
          return {
            id: `geo-region-fallback3-${country.id}`,
            question: `In which region is ${country.name} located?`,
            options,
            correctAnswer: country.region
          };
        }
        
        // Get random incorrect countries
        const incorrectOptions = getRandomItems(
          validCountries.filter(c => 
            c.id !== country.id && 
            c.id !== borderCountry.id && 
            !country.borders.includes(c.alpha3Code)
          ),
          diffConfig.optionsCount - 1
        ).map(c => c.name);
        
        // Create answer options
        const options = [...incorrectOptions, borderCountry.name].sort(() => 0.5 - Math.random());
        
        return {
          id: `geo-border-${country.id}`,
          question: `Which of these countries borders ${country.name}?`,
          options,
          correctAnswer: borderCountry.name
        };
      }
      
      default:
        return null;
    }
  }).filter(Boolean); // Remove any null questions
  
  return {
    title: "Geography Quiz",
    description: "Test your knowledge of world geography",
    type: QUIZ_TYPES.GEOGRAPHY,
    questions: questions, // Use 'questions' instead of undefined 'allQuestions'
    totalQuestions: questions.length,
    difficulty: diffConfig.name.toLowerCase(),
    difficultyConfig: diffConfig,
    timeLimit: diffConfig.timeLimit
  };
};

// Calculate quiz score with detailed statistics
export const calculateQuizScore = (quiz, userAnswers, timeRemaining = 0) => {
  if (!quiz || !userAnswers) return null;
  
  const diffConfig = quiz.difficultyConfig;
  let correctCount = 0;
  let incorrectCount = 0;
  let score = 0;
  
  // Calculate correct/incorrect answers and base score
  quiz.questions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      correctCount++;
      score += diffConfig.pointsPerQuestion;
    } else if (userAnswers[index]) {
      incorrectCount++;
      // Apply penalty for wrong answers if configured
      if (diffConfig.penaltyPerWrong) {
        score += diffConfig.penaltyPerWrong;
      }
    }
  });
  
  // Ensure score doesn't go below zero
  score = Math.max(0, score);
  
  // Calculate percentage
  const maxPossibleScore = quiz.questions.length * diffConfig.pointsPerQuestion;
  const percentage = (score / maxPossibleScore) * 100;
  
  // Calculate time bonus if applicable
  let timeBonus = 0;
  if (timeRemaining > 0 && diffConfig.timeBonus) {
    timeBonus = Math.floor(timeRemaining / 10); // Bonus points for remaining time
    score += timeBonus;
  }
  
  // Calculate time used
  const timeUsed = diffConfig.timeLimit - timeRemaining;
  
  return {
    score,
    maxPossibleScore,
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    correctCount,
    incorrectCount,
    skippedCount: quiz.questions.length - correctCount - incorrectCount,
    totalQuestions: quiz.questions.length,
    quizType: quiz.type,
    difficulty: quiz.difficulty,
    timeUsed,
    timeRemaining,
    timeBonus,
    message: getScoreMessage(percentage, quiz.difficulty)
  };
};

// Get personalized score message based on percentage and difficulty
export const getScoreMessage = (percentage, difficulty) => {
  const messages = {
    [DIFFICULTY_LEVELS.EXPERT]: {
      90: "Extraordinary! You are a true geography expert!",
      70: "Excellent level of expertise!",
      50: "Good work at the expert level!",
      0: "The expert level is a real challenge!"
    },
    [DIFFICULTY_LEVELS.HARD]: {
      90: "Impressive! You've mastered the difficult level!",
      70: "Very strong performance!",
      50: "Well played at high difficulty!",
      0: "Keep training at this level!"
    },
    [DIFFICULTY_LEVELS.MEDIUM]: {
      90: "Excellent! You're ready for the next level!",
      70: "Very good! You have solid knowledge!",
      50: "Good work! Keep it up!",
      0: "Keep practicing!"
    },
    [DIFFICULTY_LEVELS.EASY]: {
      90: "Perfect! Try the normal level!",
      70: "Very good! You're making progress!",
      50: "Good start! Keep learning!",
      0: "Keep practicing!"
    }
  };

  const levelMessages = messages[difficulty] || messages[DIFFICULTY_LEVELS.MEDIUM];
  for (const threshold of [90, 70, 50, 0]) {
    if (percentage >= threshold) return levelMessages[threshold];
  }
  
  return "Keep learning about world geography!";
};

// Update the saveQuizResult function to use the achievement service
// Remove duplicate import since we already added it at the top
export const saveQuizResult = (result) => {
  try {
    const savedResults = JSON.parse(localStorage.getItem('geoculture_quiz_results') || '[]');
    
    const newResult = {
      ...result,
      date: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    // Check for achievements
    const achievements = checkAchievements(newResult, savedResults);
    if (achievements.length > 0) {
      newResult.achievements = achievements;
    }
    
    // Add new result and keep only the latest 20 results
    const updatedResults = [newResult, ...savedResults].slice(0, 20);
    
    localStorage.setItem('geoculture_quiz_results', JSON.stringify(updatedResults));
    
    return {
      result: newResult,
      achievements
    };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return null;
  }
};

// Calculate achievements based on current result and history
const calculateAchievements = (currentResult, previousResults) => {
  const achievements = [];
  
  // First-time achievements
  if (previousResults.length === 0) {
    achievements.push({
      id: 'first_quiz',
      name: 'First Steps',
      description: 'Completed your first geography quiz',
      icon: '🌱'
    });
  }
  
  // Perfect score achievement
  if (currentResult.percentage === 100) {
    achievements.push({
      id: `perfect_${currentResult.difficulty}`,
      name: 'Perfect Score',
      description: `Achieved a perfect score on ${DIFFICULTY_CONFIG[currentResult.difficulty].name} difficulty`,
      icon: '🏆'
    });
  }
  
  // Speed achievement
  const timeLimit = DIFFICULTY_CONFIG[currentResult.difficulty].timeLimit;
  if (currentResult.percentage >= 80 && currentResult.timeUsed < timeLimit / 2) {
    achievements.push({
      id: `speed_${currentResult.difficulty}`,
      name: 'Speed Demon',
      description: `Completed a quiz quickly with high accuracy on ${DIFFICULTY_CONFIG[currentResult.difficulty].name}`,
      icon: '⚡'
    });
  }
  
  // Difficulty progression
  if (currentResult.difficulty === DIFFICULTY_LEVELS.HARD && 
      currentResult.percentage >= 70 && 
      !previousResults.some(r => r.difficulty === DIFFICULTY_LEVELS.HARD && r.percentage >= 70)) {
    achievements.push({
      id: 'master_hard',
      name: 'Geography Master',
      description: 'Mastered the hard difficulty level',
      icon: '🎓'
    });
  }
  
  // Expert achievement
  if (currentResult.difficulty === DIFFICULTY_LEVELS.EXPERT && 
      currentResult.percentage >= 60 && 
      !previousResults.some(r => r.difficulty === DIFFICULTY_LEVELS.EXPERT && r.percentage >= 60)) {
    achievements.push({
      id: 'expert_geographer',
      name: 'Expert Geographer',
      description: 'Proved your expertise at the highest difficulty',
      icon: '🌍'
    });
  }
  
  // Consistency achievement
  if (previousResults.length >= 4) {
    const last5Results = [currentResult, ...previousResults.slice(0, 4)];
    const allGood = last5Results.every(r => r.percentage >= 70);
    
    if (allGood) {
      achievements.push({
        id: 'consistent_performer',
        name: 'Consistent Performer',
        description: 'Achieved good scores in 5 consecutive quizzes',
        icon: '📈'
      });
    }
  }
  
  return achievements;
};

// Get all quiz results
export const getQuizResults = () => {
  try {
    return JSON.parse(localStorage.getItem('geoculture_quiz_results') || '[]');
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
};

// Get all achievements earned
export const getAchievements = () => {
  try {
    const results = getQuizResults();
    const allAchievements = results.reduce((acc, result) => {
      if (result.achievements && result.achievements.length > 0) {
        result.achievements.forEach(achievement => {
          if (!acc.some(a => a.id === achievement.id)) {
            acc.push({
              ...achievement,
              dateEarned: result.date
            });
          }
        });
      }
      return acc;
    }, []);
    
    return allAchievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// Format time in minutes and seconds
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Get quiz statistics
export const getQuizStatistics = () => {
  try {
    const results = getQuizResults();
    
    if (results.length === 0) {
      return null;
    }
    
    // Calculate overall statistics
    const totalQuizzes = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes;
    const bestScore = Math.max(...results.map(r => r.percentage));
    const totalCorrect = results.reduce((sum, r) => sum + r.correctCount, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const accuracyRate = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    // Statistics by difficulty
    const byDifficulty = Object.values(DIFFICULTY_LEVELS).reduce((acc, difficulty) => {
      const difficultyResults = results.filter(r => r.difficulty === difficulty);
      
      if (difficultyResults.length > 0) {
        acc[difficulty] = {
          count: difficultyResults.length,
          averageScore: difficultyResults.reduce((sum, r) => sum + r.percentage, 0) / difficultyResults.length,
          bestScore: Math.max(...difficultyResults.map(r => r.percentage)),
          totalCorrect: difficultyResults.reduce((sum, r) => sum + r.correctCount, 0),
          totalQuestions: difficultyResults.reduce((sum, r) => sum + r.totalQuestions, 0)
        };
      }
      
      return acc;
    }, {});
    
    // Statistics by quiz type
    const byQuizType = Object.values(QUIZ_TYPES).reduce((acc, type) => {
      const typeResults = results.filter(r => r.quizType === type);
      
      if (typeResults.length > 0) {
        acc[type] = {
          count: typeResults.length,
          averageScore: typeResults.reduce((sum, r) => sum + r.percentage, 0) / typeResults.length,
          bestScore: Math.max(...typeResults.map(r => r.percentage))
        };
      }
      
      return acc;
    }, {});
    
    return {
      totalQuizzes,
      averageScore,
      bestScore,
      accuracyRate,
      byDifficulty,
      byQuizType,
      achievements: getAchievements()
    };
  } catch (error) {
    console.error('Error calculating quiz statistics:', error);
    return null;
  }
};

// Add these functions to your existing quizService.js

export const getUserQuizStats = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;
    
    const { data, error } = await supabase
      .from('user_quiz_stats')
      .select('*')
      .eq('user_id', userData.user.id);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    throw error;
  }
};

export const trackQuizStreak = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;
    
    // Get user settings where we'll store streak info
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let lastQuizDate = null;
    
    if (settings) {
      lastQuizDate = settings.last_quiz_date;
      streak = settings.quiz_streak || 0;
      
      // Check if last quiz was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastQuizDate === yesterdayStr) {
        // Continuing streak
        streak += 1;
      } else if (lastQuizDate !== today) {
        // Streak broken (not yesterday and not today)
        streak = 1;
      }
      // If lastQuizDate is today, don't increment streak
    } else {
      // First quiz ever
      streak = 1;
    }
    
    // Update or insert settings
    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userData.user.id,
        last_quiz_date: today,
        quiz_streak: streak
      });
      
    if (upsertError) throw upsertError;
    
    return { streak };
  } catch (error) {
    console.error('Error tracking quiz streak:', error);
    return { streak: 0 };
  }
};

// Add this to your quizService.js

export const generateTimedChallengeQuiz = async () => {
  try {
    // Get all countries
    const allCountries = await getAllCountries();
    
    // Timed challenge is a mix of different question types with strict time limits
    const questionCount = 15;
    const diffConfig = {
      ...DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.HARD],
      timePerQuestion: 10, // 10 seconds per question
      totalQuestions: questionCount
    };
    
    // Create a mix of different question types
    const flagQuiz = generateFlagQuiz(allCountries, 5, diffConfig);
    const capitalQuiz = generateCapitalsQuiz(allCountries, 5, diffConfig);
    const geographyQuiz = generateGeographyQuiz(allCountries, 5, diffConfig);
    
    // Combine and shuffle questions
    const allQuestions = [
      ...flagQuiz.questions,
      ...capitalQuiz.questions,
      ...geographyQuiz.questions
    ].sort(() => Math.random() - 0.5);
    
    return {
      title: "Timed Challenge",
      description: "Race against the clock in this fast-paced geography challenge",
      type: 'timed_challenge',
      questions: allQuestions.slice(0, questionCount),
      totalQuestions: questionCount,
      difficulty: 'challenge',
      difficultyConfig: diffConfig,
      timeLimit: questionCount * diffConfig.timePerQuestion
    };
  } catch (error) {
    console.error('Error generating timed challenge quiz:', error);
    throw error;
  }
};

// Fix the generateAdvancedQuiz function to properly handle parameters
const generateAdvancedQuiz = (countries, questionCount, diffConfig) => {
  // Determine how many questions of each type to include
  const flagQuestionsCount = Math.floor(questionCount / 4);
  const capitalsQuestionsCount = Math.floor(questionCount / 4);
  const populationQuestionsCount = Math.floor(questionCount / 4);
  const geographyQuestionsCount = questionCount - flagQuestionsCount - capitalsQuestionsCount - populationQuestionsCount;
  
  // Generate individual quiz components
  const flagQuiz = generateFlagQuiz(countries, flagQuestionsCount, diffConfig);
  const capitalsQuiz = generateCapitalsQuiz(countries, capitalsQuestionsCount, diffConfig);
  const populationQuiz = generatePopulationQuiz(countries, populationQuestionsCount, diffConfig);
  const geographyQuiz = generateGeographyQuiz(countries, geographyQuestionsCount, diffConfig);
  
  // Combine all questions
  const allQuestions = [
    ...flagQuiz.questions,
    ...capitalsQuiz.questions,
    ...populationQuiz.questions,
    ...geographyQuiz.questions
  ];
  
  // Shuffle the questions
  const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
  
  return {
    title: "Advanced Geography Quiz",
    description: "Test your advanced knowledge with a mix of different geography questions",
    type: QUIZ_TYPES.ADVANCED,
    questions: shuffledQuestions,
    totalQuestions: shuffledQuestions.length,
    difficulty: diffConfig.name.toLowerCase(), // Fixed: use diffConfig.name.toLowerCase() instead of undefined difficulty
    difficultyConfig: diffConfig,
    timeLimit: diffConfig.timeLimit
  };
}