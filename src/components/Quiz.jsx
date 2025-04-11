import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Paper,
  Grid,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import { calculateQuizScore, saveQuizResult } from '../services/quizService';

const Quiz = ({ quiz, difficulty }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(true);
  
  const timerRef = useRef(null);
  
  // Set up timer based on difficulty
  useEffect(() => {
    if (!quiz) return;
    
    let timePerQuestion;
    switch (difficulty) {
      case 'easy':
        timePerQuestion = 30;
        break;
      case 'hard':
        timePerQuestion = 15;
        break;
      case 'expert':
        timePerQuestion = 10;
        break;
      case 'medium':
      default:
        timePerQuestion = 20;
        break;
    }
    
    // Initialize timer
    setTimeRemaining(timePerQuestion);
    
    // Start timer
    if (timerActive && !quizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            // Time's up, move to next question
            clearInterval(timerRef.current);
            
            // Auto-submit empty answer if none selected
            if (!selectedAnswer) {
              const updatedAnswers = [...userAnswers];
              updatedAnswers[currentQuestionIndex] = '';
              setUserAnswers(updatedAnswers);
              
              if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(''); // Ensure selected answer is cleared
                return timePerQuestion; // Reset timer for next question
              } else {
                completeQuiz(updatedAnswers);
                return 0;
              }
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, quiz, difficulty, selectedAnswer, userAnswers, timerActive, quizCompleted]);
  
  // Pause timer when exit confirmation is shown
  useEffect(() => {
    if (showExitConfirm) {
      setTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (!quizCompleted) {
      setTimerActive(true);
    }
  }, [showExitConfirm, quizCompleted]);
  
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;
  
  // Handle answer selection
  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    // Clear current timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Save the current answer
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedAnswers);
    
    // Clear selection for next question
    setSelectedAnswer('');
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz(updatedAnswers);
    }
  };
  
  // Handle previous question
  const handlePreviousQuestion = () => {
    // Clear current timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '');
    }
  };
  
  // Complete the quiz and calculate score
  const completeQuiz = (answers) => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const quizResult = calculateQuizScore(quiz, answers);
    setResult(quizResult);
    setQuizCompleted(true);
    setTimerActive(false);
    
    // Save result to localStorage
    saveQuizResult({
      ...quizResult,
      quizTitle: quiz.title,
      difficulty
    });
  };
  
  // Handle exit quiz
  const handleExitQuiz = () => {
    if (currentQuestionIndex > 0 && !quizCompleted) {
      setShowExitConfirm(true);
    } else {
      navigate('/play');
    }
  };
  
  // Handle confirm exit
  const handleConfirmExit = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setShowExitConfirm(false);
    navigate('/play');
  };
  
  // Handle cancel exit
  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };
  
  // Handle play again
  const handlePlayAgain = () => {
    navigate('/play');
  };
  
  // Handle view leaderboard
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    return `${seconds}s`;
  };
  
  // Get timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 5) return 'error';
    if (timeRemaining <= 10) return 'warning';
    return 'primary';
  };
  
  if (!quiz) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h5">Loading quiz...</Typography>
      </Box>
    );
  }
    return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: '800px', lg: '1200px' }, 
      width: '100%',
      mx: 'auto', 
      my: 4,
      px: { xs: 2, sm: 3 }
    }}>
      {/* Quiz Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {quiz.title}
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleExitQuiz}>
          Exit Quiz
        </Button>
      </Box>
      
      {/* Progress Bar and Timer */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
          <Typography variant="body2">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Typography>
          
          {timerActive && (
            <Chip
              icon={<TimerIcon />}
              label={formatTimeRemaining(timeRemaining)}
              color={getTimerColor()}
              variant="outlined"
            />
          )}
          
          <Typography variant="body2">
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
      </Box>
      
      {!quizCompleted ? (
        <Fade in={true} key={currentQuestionIndex}>
          <Card sx={{ 
            mb: 4,
            maxWidth: { lg: '900px' },
            mx: 'auto'
          }}>
            {/* Question */}
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {currentQuestion.question}
              </Typography>
              
              {/* Flag Image (if present) */}
              {currentQuestion.image && (
                <CardMedia
                  component="img"
                  image={currentQuestion.image}
                  alt="Question Image"
                  sx={{ 
                    height: { xs: 200, md: 300 }, 
                    width: '100%', 
                    objectFit: 'contain',
                    my: 2,
                    bgcolor: '#f5f5f5'
                  }}
                />
              )}
              
              {/* Answer Options */}
              <RadioGroup
                value={selectedAnswer}
                onChange={handleAnswerSelect}
                sx={{ mt: 2 }}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  />
                ))}
              </RadioGroup>
            </CardContent>
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              p: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
              <Button
                variant="outlined"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                fullWidth={window.innerWidth < 600}
                sx={{ mb: { xs: 1, sm: 0 } }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                fullWidth={window.innerWidth < 600}
              >
                {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
              </Button>
            </Box>
          </Card>
        </Fade>
      ) : (
        <Fade in={true}>
          <Paper sx={{ 
            p: { xs: 3, md: 4 }, 
            textAlign: 'center',
            maxWidth: { lg: '900px' },
            mx: 'auto',
            borderRadius: { xs: 2, md: 3 }
          }}>
            <Typography variant="h4" gutterBottom>
              Quiz Completed!
            </Typography>
            
            <Box sx={{ 
              my: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography 
                variant="h2" 
                color={result.score >= 70 ? 'success.main' : result.score >= 40 ? 'warning.main' : 'error.main'}
                sx={{ fontSize: { xs: '3rem', md: '4rem' } }}
              >
                {result.score}%
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                gutterBottom
                sx={{ mt: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                You got {result.correctCount} out of {result.totalQuestions} questions correct
              </Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 4 }} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handlePlayAgain}
                  size="large"
                  sx={{ py: { xs: 1, md: 1.5 } }}
                >
                  Play Again
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleViewLeaderboard}
                  size="large"
                  sx={{ py: { xs: 1, md: 1.5 } }}
                >
                  View Leaderboard
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      )}
      
      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitConfirm}
        onClose={handleCancelExit}
      >
        <DialogTitle>Exit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit? Your progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelExit}>Cancel</Button>
          <Button onClick={handleConfirmExit} color="error">Exit Quiz</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quiz;
