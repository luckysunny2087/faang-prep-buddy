-- Create interview_sessions table
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  role TEXT NOT NULL,
  level TEXT NOT NULL,
  company TEXT,
  question_types TEXT[] NOT NULL DEFAULT '{}',
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for interview_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.interview_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" 
ON public.interview_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.interview_sessions 
FOR DELETE 
USING (auth.uid() = user_id);