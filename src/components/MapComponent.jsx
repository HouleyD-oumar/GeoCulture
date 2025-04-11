import { useState, useEffect, useRef, useMemo } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Alert } from '@mui/material';

// Set Mapbox token from environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapComponent = ({ quizzes = [], bounds = {}, selectedType, onMarkerClick }) => {
  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 5
  });

  // Filter quizzes based on bounds and selected type
  const filteredQuizzes = useMemo(() => {
    if (!bounds.north || !bounds.south || !bounds.east || !bounds.west) {
      return quizzes;
    }
    
    return quizzes.filter((quiz) => {
      const isWithinBounds =
        quiz.location.lat >= bounds.south &&
        quiz.location.lat <= bounds.north &&
        quiz.location.lng >= bounds.west &&
        quiz.location.lng <= bounds.east;

      return isWithinBounds && (selectedType ? quiz.type === selectedType : true);
    });
  }, [quizzes, bounds, selectedType]);

  // Initialize map when component mounts
  useEffect(() => {
    // Check if MapBox token is available
    if (!MAPBOX_TOKEN) {
      setMapError(t('map.missingToken', 'MapBox token is missing. Please check your environment variables.'));
      return;
    }

    // Initialize map only once
    if (map.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom,
        attributionControl: true
      });

      // Add navigation control (zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Setup map event listeners
      map.current.on('move', () => {
        const center = map.current.getCenter();
        setViewport({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.current.getZoom()
        });
      });

      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('MapBox error:', e);
        setMapError(t('map.loadError', 'Error loading map. Please try again later.'));
      });
    } catch (error) {
      console.error('Error initializing MapBox:', error);
      setMapError(t('map.initError', 'Failed to initialize map. Please check your connection.'));
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [t]);

  // Update markers when filtered quizzes change
  useEffect(() => {
    if (!map.current || mapError) return;

    // Wait for map to be loaded
    if (!map.current.loaded()) {
      map.current.once('load', updateMarkers);
    } else {
      updateMarkers();
    }

    function updateMarkers() {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      filteredQuizzes.forEach(quiz => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = `marker marker-${quiz.type || 'default'}`;
        
        // Set marker style based on quiz type
        const markerColor = getMarkerColor(quiz.type);
        markerElement.style.backgroundColor = markerColor;
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.border = '2px solid white';
        markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        markerElement.style.cursor = 'pointer';
        
        // Create popup with quiz info
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3>${quiz.title || 'Quiz'}</h3>
            <p>${quiz.description || ''}</p>
            <p><strong>${t('map.type')}:</strong> ${quiz.type || 'N/A'}</p>
          `);

        // Create and add marker
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([quiz.location.lng, quiz.location.lat])
          .setPopup(popup)
          .addTo(map.current);
        
        // Add click event
        markerElement.addEventListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(quiz);
          }
        });
        
        // Store marker reference for cleanup
        markersRef.current.push(marker);
      });
    }
  }, [filteredQuizzes, mapError, t, onMarkerClick]);

  // Helper function to get marker color based on quiz type
  const getMarkerColor = (type) => {
    switch (type) {
      case 'geography': return '#4CAF50'; // Green
      case 'culture': return '#2196F3';   // Blue
      case 'history': return '#FFC107';   // Amber
      default: return '#9C27B0';          // Purple
    }
  };

  // If there's an error, display it
  if (mapError) {
    return (
      <Box sx={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: '80%' }}>
          <Typography variant="body1">{mapError}</Typography>
          <Typography variant="body2">
            {t('map.checkConsole', 'Please check the console for more details.')}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
      aria-label={t('map.mapView', 'Interactive map view')}
    />
  );
};

export default MapComponent;