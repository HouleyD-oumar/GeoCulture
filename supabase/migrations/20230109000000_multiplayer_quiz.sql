-- Create multiplayer rooms table
CREATE TABLE IF NOT EXISTS public.multiplayer_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code VARCHAR(6) NOT NULL UNIQUE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type VARCHAR NOT NULL,
  difficulty VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'waiting',
  max_players INTEGER NOT NULL DEFAULT 4,
  questions JSONB NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create multiplayer players table
CREATE TABLE IF NOT EXISTS public.multiplayer_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.multiplayer_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL DEFAULT 'ready',
  score INTEGER NOT NULL DEFAULT 0,
  answers JSONB DEFAULT '[]',
  last_answer_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only join a room once
  UNIQUE(room_id, user_id)
);

-- Enable RLS
ALTER TABLE public.multiplayer_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_players ENABLE ROW LEVEL SECURITY;

-- Create policies for multiplayer rooms
CREATE POLICY "Multiplayer rooms are viewable by everyone" 
  ON public.multiplayer_rooms FOR SELECT 
  USING (true);

CREATE POLICY "Users can create multiplayer rooms" 
  ON public.multiplayer_rooms FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Room creators can update their rooms" 
  ON public.multiplayer_rooms FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Create policies for multiplayer players
CREATE POLICY "Multiplayer players are viewable by everyone" 
  ON public.multiplayer_players FOR SELECT 
  USING (true);

CREATE POLICY "Users can join rooms" 
  ON public.multiplayer_players FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player data" 
  ON public.multiplayer_players FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to clean up old rooms
CREATE OR REPLACE FUNCTION public.cleanup_old_multiplayer_rooms()
RETURNS void AS $$
BEGIN
  -- Delete rooms older than 24 hours
  DELETE FROM public.multiplayer_rooms
  WHERE created_at < NOW() - INTERVAL '24 hours'
  AND (status = 'ended' OR status = 'waiting');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run the cleanup function
SELECT cron.schedule(
  'cleanup-multiplayer-rooms',
  '0 3 * * *', -- Run at 3 AM every day
  $$SELECT public.cleanup_old_multiplayer_rooms()$$
);