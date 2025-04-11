/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format a number with commas for thousands
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Get a score message based on percentage and difficulty
 * @param {number} percentage - Score percentage
 * @param {string} difficulty - Difficulty level
 * @returns {string} Score message
 */
export const getScoreMessage = (percentage, difficulty) => {
  const messages = {
    expert: {
      90: "Extraordinary! You're a true geography expert!",
      70: "Excellent expertise level!",
      50: "Good work at expert level!",
      0: "Expert level is a real challenge!"
    },
    hard: {
      90: "Impressive! You've mastered the difficult level!",
      70: "Great performance!",
      50: "Well played at high difficulty!",
      0: "Keep practicing at this level!"
    },
    medium: {
      90: "Excellent! You're ready for the next level!",
      70: "Very good! You have solid knowledge!",
      50: "Good work! Keep it up!",
      0: "Keep practicing!"
    },
    easy: {
      90: "Perfect! Try the normal level!",
      70: "Very good! You're making progress!",
      50: "Good start! Keep learning!",
      0: "Keep practicing!"
    }
  };

  // Map difficulty levels to match the messages object
  const difficultyMap = {
    expert: 'expert',
    hard: 'hard',
    medium: 'medium',
    normal: 'medium',
    easy: 'easy'
  };

  const mappedDifficulty = difficultyMap[difficulty] || 'medium';
  const levelMessages = messages[mappedDifficulty];
  
  for (const threshold of [90, 70, 50, 0]) {
    if (percentage >= threshold) return levelMessages[threshold];
  }
  
  return "Keep practicing!";
};

/**
 * Calculate quiz score and statistics
 * @param {Object} quiz - Quiz object
 * @param {Array} userAnswers - User answers array
 * @param {number} timeLeft - Time left in seconds
 * @returns {Object} Quiz result object
 */
export const calculateQuizScore = (quiz, userAnswers, timeLeft) => {
  const difficultyConfig = quiz.difficultyConfig;
  const questions = quiz.questions;
  
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;
  let score = 0;
  
  // Calculate correct/incorrect answers
  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    
    if (!userAnswer) {
      skippedCount++;
    } else if (userAnswer === question.correctAnswer) {
      correctCount++;
      score += difficultyConfig.pointsPerQuestion;
    } else {
      incorrectCount++;
      score += difficultyConfig.penaltyPerWrong; // This is usually negative or zero
    }
  });
  
  // Ensure score is not negative
  score = Math.max(0, score);
  
  // Calculate time bonus if applicable
  const timeUsed = difficultyConfig.timeLimit - timeLeft;
  const timeBonus = calculateTimeBonus(timeUsed, difficultyConfig);
  score += timeBonus;
  
  // Calculate maximum possible score
  const maxPossibleScore = questions.length * difficultyConfig.pointsPerQuestion;
  
  // Calculate percentage
  const percentage = (score / maxPossibleScore) * 100;
  
  // Generate score message
  const message = getScoreMessage(percentage, quiz.difficulty);
  
  return {
    score,
    maxPossibleScore,
    percentage,
    correctCount,
    incorrectCount,
    skippedCount,
    timeUsed,
    timeBonus,
    message,
    quizType: quiz.type,
    difficulty: quiz.difficulty,
    date: new Date().toISOString()
  };
};

/**
 * Calculate time bonus based on time used and difficulty config
 * @param {number} timeUsed - Time used in seconds
 * @param {Object} difficultyConfig - Difficulty configuration
 * @returns {number} Time bonus points
 */
const calculateTimeBonus = (timeUsed, difficultyConfig) => {
  // Only apply time bonus if configured and if user completed in less than 75% of allowed time
  if (!difficultyConfig.timeBonus || timeUsed > difficultyConfig.timeLimit * 0.75) {
    return 0;
  }
  
  // Calculate bonus based on time saved
  const timeSaved = difficultyConfig.timeLimit - timeUsed;
  const bonusPercentage = timeSaved / difficultyConfig.timeLimit;
  const maxBonus = difficultyConfig.pointsPerQuestion * 2; // Maximum bonus is 2 questions worth
  
  return Math.round(bonusPercentage * maxBonus);
};