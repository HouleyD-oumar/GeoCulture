// Calcul du score
const calculateScore = () => {
  return answers.reduce((score, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    return question.correctAnswer === answer.answer ? score + 1 : score;
  }, 0);
};

// Affichage du récapitulatif des réponses
const renderSummary = () => {
  return answers.map((answer, index) => {
    const question = questions.find(q => q.id === answer.questionId);
    return (
      <div key={index}>
        <p>{question.text}</p>
        <p>{`Votre réponse : ${answer.answer}`}</p>
        <p>{`Réponse correcte : ${question.correctAnswer}`}</p>
      </div>
    );
  });
};

// Mise à jour du leaderboard
useEffect(() => {
  if (gameFinished) {
    const finalScore = calculateScore();
    fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, score: finalScore })
    });
  }
}, [gameFinished]);