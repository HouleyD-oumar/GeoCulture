// Ajout de l'affichage séquentiel des questions
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const currentQuestion = questions[currentQuestionIndex];

// Ajout du chronomètre
useEffect(() => {
  const timer = setTimeout(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, 30000); // 30 secondes par question

  return () => clearTimeout(timer);
}, [currentQuestionIndex]);

// Enregistrement des réponses
const handleAnswer = (answer) => {
  setAnswers((prev) => [...prev, { questionId: currentQuestion.id, answer }]);
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }
};