import { supabase } from '../lib/supabase';

export const analyticsService = {
  // Track a user event
  trackEvent: async (eventType, eventData = {}) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;
      
      const { error } = await supabase
        .from('user_events')
        .insert([{
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
          session_id: localStorage.getItem('geoculture_session_id') || null,
          user_agent: navigator.userAgent,
          ip_address: null // This will be set by server-side processing
        }]);
        
      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Error in trackEvent:', error);
    }
  },
  
  // Initialize analytics session
  initSession: () => {
    // Generate a session ID if one doesn't exist
    if (!localStorage.getItem('geoculture_session_id')) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('geoculture_session_id', sessionId);
    }
    
    // Track session start
    analyticsService.trackEvent('session_start', {
      referrer: document.referrer,
      landing_page: window.location.pathname
    });
  },
  
  // Track page view
  trackPageView: (pageName, pageData = {}) => {
    analyticsService.trackEvent('page_view', {
      page_name: pageName,
      page_path: window.location.pathname,
      ...pageData
    });
  },
  
  // Track quiz start
  trackQuizStart: (quizType, difficulty) => {
    analyticsService.trackEvent('quiz_start', {
      quiz_type: quizType,
      difficulty
    });
  },
  
  // Track quiz completion
  trackQuizCompletion: (quizData) => {
    analyticsService.trackEvent('quiz_completion', quizData);
  },
  
  // Track feature usage
  trackFeatureUsage: (featureName, featureData = {}) => {
    analyticsService.trackEvent('feature_usage', {
      feature_name: featureName,
      ...featureData
    });
  }
};