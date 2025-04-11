import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useErrorHandler = (options = {}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const { logToService = false } = options;

  // Fonction pour gérer les erreurs
  const handleError = useCallback((error, customMessage = null) => {
    console.error('Error occurred:', error);
    
    // Déterminer le message d'erreur à afficher
    let errorMessage = customMessage;
    let errorType = 'general';
    
    if (!errorMessage) {
      // Erreurs d'API
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          errorMessage = t('errors.unauthorized', 'You are not authorized to perform this action');
          errorType = 'auth';
        } else if (status === 403) {
          errorMessage = t('errors.forbidden', 'You do not have permission to access this resource');
          errorType = 'auth';
        } else if (status === 404) {
          errorMessage = t('errors.notFound', 'The requested resource was not found');
          errorType = 'notFound';
        } else if (status === 422) {
          errorMessage = t('errors.validation', 'Validation error. Please check your input');
          errorType = 'validation';
        } else if (status === 500) {
          errorMessage = t('errors.serverError', 'A server error occurred. Please try again later');
          errorType = 'server';
        } else {
          errorMessage = error.response.data?.message || t('errors.general', 'An error occurred. Please try again');
        }
      } 
      // Erreurs réseau
      else if (error.request) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = t('errors.timeout', 'Request timed out. Please try again');
          errorType = 'network';
        } else {
          errorMessage = t('errors.network', 'Network error. Please check your connection');
          errorType = 'network';
        }
      } 
      // Erreurs de validation côté client
      else if (error.name === 'ValidationError') {
        errorMessage = error.message || t('errors.validation', 'Validation error. Please check your input');
        errorType = 'validation';
      }
      // Autres erreurs
      else {
        errorMessage = error.message || t('errors.general', 'An error occurred. Please try again');
      }
    }
    
    // Créer un objet d'erreur structuré
    const errorObject = {
      message: errorMessage,
      type: errorType,
      originalError: error,
      timestamp: new Date().toISOString()
    };
    
    // Enregistrer l'erreur dans un service externe si activé
    if (logToService) {
      // Implémentation future pour envoyer l'erreur à un service de journalisation
      // logErrorToService(errorObject);
    }
    
    setError(errorObject);
    
    // Retourner l'objet d'erreur pour une utilisation flexible
    return errorObject;
  }, [t, logToService]);

  // Fonction pour effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction utilitaire pour vérifier si une erreur est d'un certain type
  const isErrorType = useCallback((type) => {
    return error?.type === type;
  }, [error]);

  return { 
    error, 
    errorMessage: error?.message || null,
    handleError, 
    clearError,
    isNetworkError: isErrorType('network'),
    isAuthError: isErrorType('auth'),
    isValidationError: isErrorType('validation'),
    isServerError: isErrorType('server'),
    isNotFoundError: isErrorType('notFound')
  };
};

export default useErrorHandler;