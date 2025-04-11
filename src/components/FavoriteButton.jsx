import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { addToFavorites, removeFromFavorites, isInFavorites } from '../services/favoritesService';

const FavoriteButton = ({ countryId, size = 'medium' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    setIsFavorite(isInFavorites(countryId));
  }, [countryId]);
  
  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(countryId);
      setIsFavorite(false);
    } else {
      addToFavorites(countryId);
      setIsFavorite(true);
    }
  };
  
  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton 
        onClick={handleToggleFavorite} 
        color={isFavorite ? "error" : "default"}
        size={size}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;