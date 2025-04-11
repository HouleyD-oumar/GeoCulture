import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useErrorHandler from '../hooks/useErrorHandler';

const AdminQuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quizzes');
      if (!response.ok) throw new Error(t('errors.loadingFailed', 'Failed to load quizzes'));
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData) => {
    try {
      validateQuizData(quizData);
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });
      if (!response.ok) throw new Error(t('errors.savingFailed', 'Error creating quiz'));
      fetchQuizzes();
      setCurrentQuiz(null);
    } catch (error) {
      handleError(error);
    }
  };

  const updateQuiz = async (quizId, updatedData) => {
    try {
      validateQuizData(updatedData);
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error(t('errors.savingFailed', 'Error updating quiz'));
      fetchQuizzes();
      setCurrentQuiz(null);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(t('errors.savingFailed', 'Error deleting quiz'));
      fetchQuizzes();
    } catch (error) {
      handleError(error);
    }
  };

  // Error handling and validations
  const handleError = (error) => {
    if (error.message.includes('validation failed')) {
      setErrorMessage(t('errors.validation'));
    } else {
      setErrorMessage(t('errors.general'));
    }
  };

  const validateQuizData = (quizData) => {
    if (!quizData.title || !quizData.questions || quizData.questions.length === 0) {
      throw new Error('validation failed');
    }
  };

  return (
    <div className="admin-quiz-manager">
      <h2>{t('admin.quizManagement')}</h2>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
          <button onClick={() => setErrorMessage('')}>{t('common.close')}</button>
        </div>
      )}
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <>
          <button 
            className="create-quiz-button"
            onClick={() => setCurrentQuiz({
              title: '',
              questions: []
            })}
          >
            {t('admin.createQuiz')}
          </button>
          
          <table className="quiz-table">
            <thead>
              <tr>
                <th>{t('admin.quizId')}</th>
                <th>{t('admin.quizTitle')}</th>
                <th>{t('admin.questionCount')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <tr key={quiz.id}>
                    <td>{quiz.id}</td>
                    <td>{quiz.title}</td>
                    <td>{quiz.questions?.length || 0}</td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => setCurrentQuiz(quiz)}
                      >
                        {t('common.edit')}
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => {
                          if (window.confirm(t('admin.confirmDelete', 'Are you sure you want to delete this quiz?'))) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-quizzes">
                    {t('admin.noQuizzes', 'No quizzes available')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
      
      {/* Quiz Editor Modal would go here */}
    </div>
  );
};

export default AdminQuizManager;