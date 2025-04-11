import { getCountryById } from './countryService';
import { supabase } from '../lib/supabase';

// Get all favorite countries from Supabase
export const getFavorites = async () => {
  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Get favorites from Supabase
    const { data: favorites, error } = await supabase
      .from('favorites')
      // Add the missing function here
      
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // If no favorites, return empty array
    if (!favorites || !favorites.length) return [];
    
    // Fetch full country data for each favorite
    const favoritesWithData = await Promise.all(
      favorites.map(async (favorite) => {
        try {
          const country = await getCountryById(favorite.country_id);
          return {
            ...country,
            dateAdded: new Date(favorite.created_at)
          };
        } catch (error) {
          console.error(`Error fetching country ${favorite.country_id}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any null values (countries that couldn't be fetched)
    return favoritesWithData.filter(Boolean);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Add a country to favorites
export const addToFavorites = async (country) => {
  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Check if country is already in favorites
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('country_id', country.cca3)
      .maybeSingle();
      
    if (existingFavorite) {
      return false; // Already in favorites
    }
    
    // Add to favorites in Supabase
    const { error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userData.user.id,
        country_id: country.cca3,
        country_name: country.name.common
      }]);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

// Remove a country from favorites
export const removeFromFavorites = async (countryId) => {
  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Remove from favorites in Supabase
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userData.user.id)
      .eq('country_id', countryId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// Check if a country is in favorites
export const isInFavorites = async (countryId) => {
  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return false; // Not authenticated, so not in favorites
    }
    
    // Check if country is in favorites
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('country_id', countryId)
      .maybeSingle();
      
    if (error) throw error;
    
    return !!data; // Return true if data exists, false otherwise
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

// Migrate favorites from localStorage to Supabase
export const migrateFavoritesFromLocalStorage = async () => {
  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return false; // Not authenticated
    }
    
    // Get favorites from localStorage
    const FAVORITES_STORAGE_KEY = 'geoculture_favorites';
    const localFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    
    if (!localFavorites.length) {
      return true; // No favorites to migrate
    }
    
    // Migrate each favorite
    for (const favorite of localFavorites) {
      try {
        const country = await getCountryById(favorite.id);
        await addToFavorites(country);
      } catch (error) {
        console.error(`Error migrating favorite ${favorite.id}:`, error);
      }
    }
    
    // Clear localStorage favorites after migration
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    
    return true;
  } catch (error) {
    console.error('Error migrating favorites:', error);
    return false;
  }
};

// Clear all favorites for the current user
export const clearAllFavorites = async () => {
  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Delete all favorites for the current user
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userData.user.id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
};