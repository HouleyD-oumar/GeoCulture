// Ajout de vérification pour le chargement des thèmes et quiz
useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des quiz:', error);
    }
  };

  fetchQuizzes();
}, []);

// Ajout de recherche et filtrage
const filteredQuizzes = quizzes.filter(quiz =>
  quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
);