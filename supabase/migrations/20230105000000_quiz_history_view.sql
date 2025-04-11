-- Create a view for quiz statistics
CREATE OR REPLACE VIEW public.user_quiz_stats AS
SELECT
  user_id,
  quiz_type,
  COUNT(*) as total_quizzes,
  AVG(percentage) as average_score,
  MAX(score) as highest_score,
  MIN(score) as lowest_score,
  AVG(time_used) as average_time,
  SUM(correct_answers) as total_correct_answers,
  SUM(incorrect_answers) as total_incorrect_answers,
  SUM(skipped_answers) as total_skipped_answers
FROM public.quiz_results
GROUP BY user_id, quiz_type;

-- Create policy for the view
CREATE POLICY "Users can view their own quiz stats" 
  ON public.user_quiz_stats FOR SELECT 
  USING (auth.uid() = user_id);