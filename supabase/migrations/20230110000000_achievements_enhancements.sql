-- Create achievements table to store all available achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR,
  category VARCHAR NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  difficulty VARCHAR NOT NULL DEFAULT 'medium',
  hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add points column to user_achievements
ALTER TABLE public.user_achievements
ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 10;

-- Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policy for achievements
CREATE POLICY "Achievements are viewable by everyone" 
  ON public.achievements FOR SELECT 
  USING (true);

-- Insert default achievements
INSERT INTO public.achievements (id, name, description, icon, category, points, difficulty, hidden) VALUES
('first_quiz', 'Quiz Novice', 'Complete your first quiz', '🎓', 'quiz', 5, 'easy', false),
('perfect_score', 'Perfect Score', 'Get a perfect score on any quiz', '🏆', 'quiz', 20, 'medium', false),
('geography_master', 'Geography Master', 'Complete 10 geography quizzes with at least 80% score', '🌍', 'quiz', 30, 'hard', false),
('flags_expert', 'Flag Expert', 'Identify 50 different country flags correctly', '🚩', 'quiz', 25, 'medium', false),
('capitals_genius', 'Capitals Genius', 'Match 30 countries with their capitals correctly', '🏙️', 'quiz', 25, 'medium', false),
('daily_streak_7', 'Weekly Challenger', 'Complete daily challenges for 7 consecutive days', '📅', 'challenge', 15, 'medium', false),
('daily_streak_30', 'Monthly Devotion', 'Complete daily challenges for 30 consecutive days', '🗓️', 'challenge', 50, 'hard', false),
('world_explorer', 'World Explorer', 'Add 20 different countries to your favorites', '🧭', 'exploration', 15, 'easy', false),
('continent_collector', 'Continent Collector', 'Add at least one country from each continent to favorites', '🌐', 'exploration', 30, 'medium', false),
('night_owl', 'Night Owl', 'Complete a quiz between midnight and 4 AM', '🦉', 'special', 10, 'easy', true),
('speed_demon', 'Speed Demon', 'Complete a quiz in less than half the allotted time', '⚡', 'special', 20, 'medium', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  points = EXCLUDED.points,
  difficulty = EXCLUDED.difficulty,
  hidden = EXCLUDED.hidden;

-- Create view for user achievement progress
CREATE OR REPLACE VIEW public.user_achievement_stats AS
SELECT
  u.id as user_id,
  p.username,
  COUNT(ua.id) as achievements_earned,
  SUM(a.points) as total_points,
  COUNT(CASE WHEN a.difficulty = 'easy' THEN 1 END) as easy_achievements,
  COUNT(CASE WHEN a.difficulty = 'medium' THEN 1 END) as medium_achievements,
  COUNT(CASE WHEN a.difficulty = 'hard' THEN 1 END) as hard_achievements,
  COUNT(CASE WHEN a.category = 'quiz' THEN 1 END) as quiz_achievements,
  COUNT(CASE WHEN a.category = 'challenge' THEN 1 END) as challenge_achievements,
  COUNT(CASE WHEN a.category = 'exploration' THEN 1 END) as exploration_achievements,
  COUNT(CASE WHEN a.category = 'special' THEN 1 END) as special_achievements
FROM
  auth.users u
LEFT JOIN
  public.profiles p ON u.id = p.id
LEFT JOIN
  public.user_achievements ua ON u.id = ua.user_id
LEFT JOIN
  public.achievements a ON ua.achievement_id = a.id
GROUP BY
  u.id, p.username;

-- Create policy for the achievement stats view
CREATE POLICY "Users can view their own achievement stats" 
  ON public.user_achievement_stats FOR SELECT 
  USING (auth.uid() = user_id);