
-- Add dark mode preference and last feedback reminder to profiles table
ALTER TABLE public.profiles 
ADD COLUMN dark_mode_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN last_feedback_reminder TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN total_usage_hours INTEGER DEFAULT 0;

-- Create feedback table to store user feedback
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback table
CREATE POLICY "Users can view their own feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" 
  ON public.feedback 
  FOR UPDATE 
  USING (auth.uid() = user_id);
