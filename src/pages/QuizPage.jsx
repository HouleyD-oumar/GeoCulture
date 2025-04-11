import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Button, Paper, Radio, RadioGroup, 
  FormControlLabel, FormControl, FormLabel, CircularProgress,
  Card, CardContent, CardMedia, CardActions, Alert, Snackbar,
  Grid, Divider, Chip, Select, MenuItem, InputLabel
} from '@mui/material';
import { 
  Timer as TimerIcon, 
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  Replay as ReplayIcon,
  Home as HomeIcon,
  ArrowForward as NextIcon
} from '@mui/icons-material';

import { 
  generateQuiz, 
  calculateQuizScore, 
  saveQuizResult,
  QUIZ_TYPES, 
  DIFFICULTY_LEVELS,
  DIFFICULTY_CONFIG,
  formatTime
} from '../services/quizService';

const QuizPage = () => {
  const { quizType } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [achievements, setAchievements] = useState([]);
  
  const timerRef = useRef(null);
  
  // Validate quiz type
  useEffect(() => {
    if (!Object.values(QUIZ_TYPES).includes(quizType)) {
      navigate('/play');
    }
  }, [quizType, navigate]);
  
  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Start the quiz
  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newQuiz = await generateQuiz(quizType, difficulty);
      setQuiz(newQuiz);
      setUserAnswers(new Array(newQuiz.questions.length).fill(null));
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setTimeLeft(newQuiz.timeLimit);
      setQuizStarted(true);
      setQuizCompleted(false);
      setQuizResult(null);
      
      // Start timer
      startTimer();
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError('Failed to start quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Start the timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Time's up
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Handle time up
  const handleTimeUp = () => {
    if (!quizCompleted) {
      setShowFeedback(true);
      setFeedbackMessage("Time's up!");
      setFeedbackType('warning');
      handleQuizComplete();
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };
  
  // Handle submitting an answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const diffConfig = DIFFICULTY_CONFIG[difficulty];
    
    // Update user answers
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);
    
    // Show feedback
    setShowFeedback(true);
    if (isCorrect) {
      setFeedbackMessage(`Correct! +${diffConfig.pointsPerQuestion} points`);
      setFeedbackType('success');
      
      // Add time bonus for correct answer if configured
      if (diffConfig.timeBonus) {
        setTimeLeft(prevTime => prevTime + diffConfig.timeBonus);
      }
    } else {
      setFeedbackMessage(`Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`);
      setFeedbackType('error');
    }
    
    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer('');
      } else {
        handleQuizComplete();
      }
    }, 2000);
  };
  
  // Handle quiz completion
  const handleQuizComplete = () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calculate results
    const result = calculateQuizScore(quiz, userAnswers, timeLeft);
    setQuizResult(result);
    
    // Save result and check for achievements
    const savedResult = saveQuizResult(result);
    if (savedResult && savedResult.achievements && savedResult.achievements.length > 0) {
      setAchievements(savedResult.achievements);
    }
    
    setQuizCompleted(true);
  };
  
  // Handle playing again
  const handlePlayAgain = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizResult(null);
    setAchievements([]);
  };
  
  // Render difficulty selector
  const renderDifficultySelector = () => (
    <Box mb={3}>
      <FormControl fullWidth>
        <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
        <Select
          labelId="difficulty-select-label"
          id="difficulty-select"
          value={difficulty}
          label="Difficulty"
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <MenuItem value={DIFFICULTY_LEVELS.EASY}>
            Easy - {DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.EASY].description}
          </MenuItem>
          <MenuItem value={DIFFICULTY_LEVELS.MEDIUM}>
            Medium - {DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.MEDIUM].description}
          </MenuItem>
          <MenuItem value={DIFFICULTY_LEVELS.HARD}>
            Hard - {DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.HARD].description}
          </MenuItem>
          <MenuItem value={DIFFICULTY_LEVELS.EXPERT}>
            Expert - {DIFFICULTY_CONFIG[DIFFICULTY_LEVELS.EXPERT].description}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
  
  // Render quiz intro
  const renderQuizIntro = () => {
    const quizTypeNames = {
      [QUIZ_TYPES.FLAGS]: 'Flag Quiz',
      [QUIZ_TYPES.CAPITALS]: 'Capital Cities Quiz',
      [QUIZ_TYPES.POPULATION]: 'Population Quiz',
      [QUIZ_TYPES.GEOGRAPHY]: 'Geography Quiz',
      [QUIZ_TYPES.ADVANCED]: 'Advanced Geography Quiz'
    };
    
    const diffConfig = DIFFICULTY_CONFIG[difficulty];
    
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="h4" gutterBottom>
          {quizTypeNames[quizType] || 'Geography Quiz'}
        </Typography>
        
        <Typography variant="body1" paragraph>
          Test your knowledge of world geography!
        </Typography>
        
        {renderDifficultySelector()}
        
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            {diffConfig.name} Level
          </Typography>
          <Typography variant="body2">
            • {diffConfig.totalQuestions} questions
          </Typography>
          <Typography variant="body2">
            • {Math.floor(diffConfig.timeLimit / 60)} minutes time limit
          </Typography>
          <Typography variant="body2">
            • {diffConfig.pointsPerQuestion} points per correct answer
          </Typography>
          {diffConfig.penaltyPerWrong !== 0 && (
            <Typography variant="body2">
              • {diffConfig.penaltyPerWrong} points penalty for wrong answers
            </Typography>
          )}
          {diffConfig.timeBonus > 0 && (
            <Typography variant="body2">
              • +{diffConfig.timeBonus} seconds bonus for each correct answer
            </Typography>
          )}
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartQuiz}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Start Quiz'}
        </Button>
      </Box>
    );
  };
  
  // Render current question
  const renderQuestion = () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip 
            label={`Question ${currentQuestionIndex + 1}/${quiz.questions.length}`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<TimerIcon />} 
            label={formatTime(timeLeft)} 
            color={timeLeft < 30 ? "error" : "default"} 
            variant="outlined"
          />
        </Box>
        
        <Typography variant="h5" gutterBottom>
          {currentQuestion.question}
        </Typography>
        
        {currentQuestion.image && (
          <Box my={2} textAlign="center">
            <img 
              src={currentQuestion.image} 
              alt="Question" 
              style={{ maxWidth: '100%', maxHeight: '200px' }} 
            />
          </Box>
        )}
        
        <FormControl component="fieldset" fullWidth>
          <RadioGroup 
            value={selectedAnswer} 
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {currentQuestion.options.map((option, index) => (
              <Paper 
                key={index} 
                elevation={1} 
                sx={{ 
                  mb: 1, 
                  p: 1, 
                  border: selectedAnswer === option ? '2px solid #3f51b5' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ width: '100%' }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>
        
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={() => {
              if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setSelectedAnswer('');
              } else {
                handleQuizComplete();
              }
            }}
          >
            Skip
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            endIcon={<NextIcon />}
          >
            Submit
          </Button>
        </Box>
      </Box>
    );
  };
  
  // Render quiz results
  const renderResults = () => {
    if (!quizResult) return null;
    
    const { 
      score, maxPossibleScore, percentage, correctCount, 
      incorrectCount, skippedCount, timeUsed, message 
    } = quizResult;
    
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            {percentage.toFixed(1)}%
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {message}
          </Typography>
        </Box>
        
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Score</Typography>
              <Typography variant="h4">{score} / {maxPossibleScore}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Time Used</Typography>
              <Typography variant="h4">{formatTime(timeUsed)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
              <Typography variant="body2" gutterBottom>Correct</Typography>
              <Typography variant="h5" color="success.main">{correctCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
              <Typography variant="body2" gutterBottom>Incorrect</Typography>
              <Typography variant="h5" color="error.main">{incorrectCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2" gutterBottom>Skipped</Typography>
              <Typography variant="h5" color="text.secondary">{skippedCount}</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {achievements.length > 0 && (
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Achievements Unlocked!
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {achievements.map((achievement, index) => (
                <Grid item key={index}>
                  <Chip
                    icon={<TrophyIcon />}
                    label={achievement.name}
                    color="secondary"
                    variant="outlined"
                    sx={{ p: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/play')}
          >
            Back to Menu
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReplayIcon />}
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </Box>
      </Box>
    );
  };
  
  return (
    <Container maxWidth="md">
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {!quizStarted && !quizCompleted && renderQuizIntro()}
      
      {quizStarted && !quizCompleted && renderQuestion()}
      
      {quizCompleted && renderResults()}
      
      <Snackbar
        open={showFeedback}
        autoHideDuration={2000}
        onClose={() => setShowFeedback(false)}
      >
        <Alert severity={feedbackType} sx={{ width: '100%' }}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuizPage;