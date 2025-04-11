import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useErrorHandler from '../hooks/useErrorHandler';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('all');
  const { t } = useTranslation();
  const { handleError, error } = useErrorHandler();

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedTheme]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const url = selectedTheme === 'all' 
        ? '/api/leaderboard' 
        : `/api/leaderboard?theme=${selectedTheme}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load leaderboard data');
      
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme) => setSelectedTheme(theme);

  return (
    <div className="leaderboard">
      <h2>{t('leaderboard.title', 'Leaderboard')}</h2>
      
      {error && (
        <div className="error-message">
          {error.message}
        </div>
      )}
      
      <div className="theme-filters">
        <button 
          className={selectedTheme === 'all' ? 'active' : ''} 
          onClick={() => handleThemeChange('all')}
        >
          {t('common.all')}
        </button>
        <button 
          className={selectedTheme === 'geography' ? 'active' : ''} 
          onClick={() => handleThemeChange('geography')}
        >
          {t('themes.geography', 'Geography')}
        </button>
        <button 
          className={selectedTheme === 'culture' ? 'active' : ''} 
          onClick={() => handleThemeChange('culture')}
        >
          {t('themes.culture', 'Culture')}
        </button>
        <button 
          className={selectedTheme === 'history' ? 'active' : ''} 
          onClick={() => handleThemeChange('history')}
        >
          {t('themes.history', 'History')}
        </button>
      </div>
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>{t('leaderboard.rank', 'Rank')}</th>
              <th>{t('leaderboard.player', 'Player')}</th>
              <th>{t('leaderboard.score', 'Score')}</th>
              <th>{t('leaderboard.time', 'Time')}</th>
              <th>{t('leaderboard.date', 'Date')}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length > 0 ? (
              leaderboardData.map((entry, index) => (
                <tr key={`${entry.user_id}-${entry.challenge_id}`}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="player-info">
                      {entry.avatar_url && (
                        <img 
                          src={entry.avatar_url} 
                          alt={`${entry.username}'s avatar`}
                          className="player-avatar"
                        />
                      )}
                      <span>{entry.username}</span>
                    </div>
                  </td>
                  <td>{entry.score}</td>
                  <td>{entry.time_used}s</td>
                  <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;