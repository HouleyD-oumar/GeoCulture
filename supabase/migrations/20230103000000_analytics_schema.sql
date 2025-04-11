-- Create user_events table for analytics
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user_events
-- Only allow inserts (reads are admin-only)
CREATE POLICY "Users can insert their own events" 
  ON public.user_events FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create function to anonymize IP addresses
CREATE OR REPLACE FUNCTION public.anonymize_ip_address()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract client IP from request headers
  NEW.ip_address = CASE 
    WHEN current_setting('request.headers', true)::json->>'x-forwarded-for' IS NOT NULL 
    THEN regexp_replace(split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1), '\\.[^.]*$', '.0')
    ELSE NULL
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for IP anonymization
DROP TRIGGER IF EXISTS anonymize_ip_on_insert ON public.user_events;
CREATE TRIGGER anonymize_ip_on_insert
  BEFORE INSERT ON public.user_events
  FOR EACH ROW EXECUTE FUNCTION public.anonymize_ip_address();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON public.user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON public.user_events(session_id);

-- Create policy for admins to read all events
CREATE POLICY "Admins can read all events" 
  ON public.user_events FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Create function to extract user agent details
CREATE OR REPLACE FUNCTION public.parse_user_agent(user_agent TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'browser', 
      CASE 
        WHEN user_agent ILIKE '%firefox%' THEN 'Firefox'
        WHEN user_agent ILIKE '%chrome%' AND user_agent NOT ILIKE '%edge%' THEN 'Chrome'
        WHEN user_agent ILIKE '%edge%' THEN 'Edge'
        WHEN user_agent ILIKE '%safari%' AND user_agent NOT ILIKE '%chrome%' THEN 'Safari'
        WHEN user_agent ILIKE '%opera%' OR user_agent ILIKE '%opr/%' THEN 'Opera'
        ELSE 'Other'
      END,
    'device_type',
      CASE
        WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'Mobile'
        WHEN user_agent ILIKE '%ipad%' OR user_agent ILIKE '%tablet%' THEN 'Tablet'
        ELSE 'Desktop'
      END
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create analytics views for reporting
CREATE OR REPLACE VIEW public.analytics_daily_events AS
SELECT 
  DATE_TRUNC('day', created_at) AS day,
  event_type,
  COUNT(*) AS event_count,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT session_id) AS unique_sessions
FROM 
  public.user_events
GROUP BY 
  DATE_TRUNC('day', created_at), 
  event_type
ORDER BY 
  day DESC, 
  event_count DESC;

-- Create view for user engagement metrics
CREATE OR REPLACE VIEW public.user_engagement_metrics AS
WITH user_sessions AS (
  SELECT 
    user_id,
    session_id,
    MIN(created_at) AS session_start,
    MAX(created_at) AS session_end,
    COUNT(*) AS events_count
  FROM 
    public.user_events
  WHERE 
    user_id IS NOT NULL AND session_id IS NOT NULL
  GROUP BY 
    user_id, session_id
)
SELECT 
  user_id,
  COUNT(DISTINCT session_id) AS total_sessions,
  AVG(EXTRACT(EPOCH FROM (session_end - session_start))) AS avg_session_duration_seconds,
  AVG(events_count) AS avg_events_per_session,
  MAX(session_end) AS last_active_at
FROM 
  user_sessions
GROUP BY 
  user_id;

-- Grant permissions for the service role
GRANT SELECT ON public.analytics_daily_events TO service_role;
GRANT SELECT ON public.user_engagement_metrics TO service_role;

-- Comment on tables and views for documentation
COMMENT ON TABLE public.user_events IS 'Stores anonymized user events for analytics purposes';
COMMENT ON VIEW public.analytics_daily_events IS 'Daily aggregated event metrics';
COMMENT ON VIEW public.user_engagement_metrics IS 'User engagement metrics based on sessions';