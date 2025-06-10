-- Create feedback table
CREATE TYPE feedback_category_score AS (
  name TEXT,
  score INTEGER,
  comment TEXT
);

CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userId TEXT NOT NULL,
  quizId UUID NOT NULL,
  totalScore INTEGER NOT NULL,
  categoryScores JSONB NOT NULL,
  strengths JSONB NOT NULL,
  areasForImprovement JSONB NOT NULL,
  finalAssessment TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  FOREIGN KEY (quizId) REFERENCES public.quizzes(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX feedbacks_user_id_idx ON public.feedbacks(userId);
CREATE INDEX feedbacks_quiz_id_idx ON public.feedbacks(quizId);
CREATE INDEX feedbacks_category_scores_gin_idx ON public.feedbacks USING gin (categoryScores);
CREATE INDEX feedbacks_strengths_gin_idx ON public.feedbacks USING gin (strengths);
CREATE INDEX feedbacks_areas_gin_idx ON public.feedbacks USING gin (areasForImprovement);
