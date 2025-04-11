import { supabase } from '../lib/supabase';

export const userSettingsService = {
  // Get user settings
  getUserSettings: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    // If no settings exist yet, create default settings
    if (!data) {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguages = ['en', 'fr', 'es'];
      const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';
      
      const defaultSettings = {
        theme: 'light',
        language: defaultLang,
        notification_preferences: {}
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('user_settings')
        .insert([{ 
          user_id: userData.user.id,
          ...defaultSettings
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return newData;
    }
    
    return data;
  },
  
  // Update user settings
  updateUserSettings: async (settings) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userData.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Update theme preference
  updateTheme: async (theme) => {
    return await userSettingsService.updateUserSettings({ theme });
  },
  
  // Update language preference
  updateLanguage: async (language) => {
    return await userSettingsService.updateUserSettings({ language });
  },
  
  // Get available languages
  getAvailableLanguages: () => {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'es', name: 'Español' }
    ];
  }
};