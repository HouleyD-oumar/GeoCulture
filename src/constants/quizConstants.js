// Quiz types
// Add ADVANCED to your QUIZ_TYPES if it's not already there
export const QUIZ_TYPES = {
  FLAGS: 'flags',
  CAPITALS: 'capitals',
  POPULATION: 'population',
  GEOGRAPHY: 'geography',
  ADVANCED: 'advanced',
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
};

// Difficulty configuration
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

// Score messages by difficulty and percentage
export const SCORE_MESSAGES = {
  [DIFFICULTY_LEVELS.EXPERT]: {
    90: "Extraordinary! You're a true geography expert!",
    70: "Excellent expertise level!",
    50: "Good work at expert level!",
    0: "Expert level is a real challenge!"
  },
  [DIFFICULTY_LEVELS.HARD]: {
    90: "Impressive! You've mastered the difficult level!",
    70: "Great performance!",
    50: "Well played at high difficulty!",
    0: "Keep practicing at this level!"
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    90: "Excellent! You're ready for the next level!",
    70: "Very good! You have solid knowledge!",
    50: "Good work! Keep it up!",
    0: "Keep practicing!"
  },
  [DIFFICULTY_LEVELS.EASY]: {
    90: "Perfect! Try the medium level!",
    70: "Very good! You're making progress!",
    50: "Good start! Keep learning!",
    0: "Keep practicing!"
  }
};

// Quiz mode configuration
export const QUIZ_MODE_CONFIG = {
  // Flag quizzes
  FLAG_TO_COUNTRY: {
    type: QUIZ_TYPES.FLAGS,
    question: "Which country does this flag belong to?",
    imageType: "flag"
  },
  COUNTRY_TO_FLAG: {
    type: QUIZ_TYPES.FLAGS,
    question: "Select the flag of {country}",
    imageOptions: true
  },
  
  // Capital quizzes
  CAPITAL_TO_COUNTRY: {
    type: QUIZ_TYPES.CAPITALS,
    question: "{capital} is the capital of which country?"
  },
  COUNTRY_TO_CAPITAL: {
    type: QUIZ_TYPES.CAPITALS,
    question: "What is the capital of {country}?"
  },
  
  // Population quizzes
  POPULATION_COMPARISON: {
    type: QUIZ_TYPES.POPULATION,
    question: "Which country has a larger population?",
    comparisonType: "population"
  },
  POPULATION_ESTIMATE: {
    type: QUIZ_TYPES.POPULATION,
    question: "What is the approximate population of {country}?",
    numericOptions: true
  },
  
  // Geography quizzes
  COUNTRY_TO_CONTINENT: {
    type: QUIZ_TYPES.GEOGRAPHY,
    question: "On which continent is {country} located?"
  },
  COUNTRY_TO_REGION: {
    type: QUIZ_TYPES.GEOGRAPHY,
    question: "In which region is {country} located?"
  },
  BORDER_COUNTRIES: {
    type: QUIZ_TYPES.GEOGRAPHY,
    question: "Which of these countries borders {country}?"
  },
  LANDLOCKED_COUNTRIES: {
    type: QUIZ_TYPES.GEOGRAPHY,
    question: "Which of these countries is landlocked?",
    specialFilter: "landlocked"
  }
};

// Achievement types
export const ACHIEVEMENT_TYPES = {
  FIRST_TIME: 'first_time',
  PERFECT_SCORE: 'perfect_score',
  SPEED: 'speed',
  MASTERY: 'mastery',
  EXPERTISE: 'expertise',
  MILESTONE: 'milestone',
  SPECIAL: 'special'
};