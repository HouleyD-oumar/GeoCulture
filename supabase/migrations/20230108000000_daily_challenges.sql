-- Create daily challenges table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_date DATE NOT NULL UNIQUE,
  quiz_type VARCHAR NOT NULL,
  difficulty VARCHAR NOT NULL,
  questions JSONB NOT NULL,
  time_limit INTEGER NOT NULL DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily challenge results table
CREATE TABLE IF NOT EXISTS public.daily_challenge_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  skipped_answers INTEGER NOT NULL,
  time_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only submit one result per challenge
  UNIQUE(user_id, challenge_id)
);

-- Add daily_challenge_streak to user_settings
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS daily_challenge_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_challenge_date DATE;

-- Enable RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_results ENABLE ROW LEVEL SECURITY;

-- Create policies for daily challenges
CREATE POLICY "Daily challenges are viewable by everyone" 
  ON public.daily_challenges FOR SELECT 
  USING (true);

-- Create policies for daily challenge results
CREATE POLICY "Users can view their own challenge results" 
  ON public.daily_challenge_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge results" 
  ON public.daily_challenge_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create view for daily challenge leaderboard
CREATE OR REPLACE VIEW public.daily_challenge_leaderboard AS
SELECT
  dcr.challenge_id,
  dc.challenge_date,
  dcr.user_id,
  p.username,
  p.avatar_url,
  dcr.score,
  dcr.percentage,
  dcr.time_used,
  dcr.created_at
FROM
  public.daily_challenge_results dcr
JOIN
  public.daily_challenges dc ON dcr.challenge_id = dc.id
JOIN
  public.profiles p ON dcr.user_id = p.id
ORDER BY
  dc.challenge_date DESC,
  dcr.score DESC,
  dcr.time_used ASC;

-- Create policy for the leaderboard view
CREATE POLICY "Daily challenge leaderboard is viewable by everyone" 
  ON public.daily_challenge_leaderboard FOR SELECT 
  USING (true);


-- Add update policy for daily challenge results
CREATE POLICY "Users can update their own challenge results" 
  ON public.daily_challenge_results FOR UPDATE 
  USING (auth.uid() = user_id);