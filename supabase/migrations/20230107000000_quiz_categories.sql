-- Create quiz categories table
CREATE TABLE IF NOT EXISTS public.quiz_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz subcategories table
CREATE TABLE IF NOT EXISTS public.quiz_subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.quiz_categories(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id and subcategory_id to quiz_results
ALTER TABLE public.quiz_results 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.quiz_categories(id),
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.quiz_subcategories(id);

-- Enable RLS
ALTER TABLE public.quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz categories (viewable by everyone)
CREATE POLICY "Quiz categories are viewable by everyone" 
  ON public.quiz_categories FOR SELECT 
  USING (true);

-- Create policies for quiz subcategories (viewable by everyone)
CREATE POLICY "Quiz subcategories are viewable by everyone" 
  ON public.quiz_subcategories FOR SELECT 
  USING (true);

-- Insert default categories
INSERT INTO public.quiz_categories (name, description, icon) VALUES
('Geography', 'Test your knowledge of world geography', '🌍'),
('Flags', 'Identify flags from around the world', '🚩'),
('Capitals', 'Test your knowledge of capital cities', '🏙️'),
('Culture', 'Learn about cultures around the world', '🎭'),
('History', 'Test your knowledge of world history', '📜')
ON CONFLICT DO NOTHING;