
-- Create patient records table
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  visit_date DATE NOT NULL,
  chief_complaint TEXT,
  blood_pressure TEXT,
  pulse_rate TEXT,
  weight TEXT,
  primary_diagnosis TEXT,
  clinical_notes TEXT,
  medications JSONB DEFAULT '[]'::jsonb,
  investigations JSONB DEFAULT '[]'::jsonb,
  treatment_plan TEXT,
  next_followup_date DATE,
  private_notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for patient records
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- Create policies for patient records
CREATE POLICY "Users can view their own patient records" 
  ON public.patient_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patient records" 
  ON public.patient_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient records" 
  ON public.patient_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patient records" 
  ON public.patient_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_patient_records_updated_at 
    BEFORE UPDATE ON public.patient_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
