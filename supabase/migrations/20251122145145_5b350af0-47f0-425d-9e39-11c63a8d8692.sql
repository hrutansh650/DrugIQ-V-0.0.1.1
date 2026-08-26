-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  visit_date DATE NOT NULL,
  chief_complaint TEXT,
  blood_pressure TEXT,
  pulse_rate TEXT,
  weight TEXT,
  primary_diagnosis TEXT,
  clinical_notes TEXT,
  medications JSONB,
  investigations JSONB,
  treatment_plan TEXT,
  next_followup_date DATE,
  private_notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on patients
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own patients
CREATE POLICY "Users can view their own patients"
  ON public.patients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Doctors can insert their own patients
CREATE POLICY "Users can insert their own patients"
  ON public.patients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Doctors can update their own patients
CREATE POLICY "Users can update their own patients"
  ON public.patients
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Doctors can delete their own patients
CREATE POLICY "Users can delete their own patients"
  ON public.patients
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all patients
CREATE POLICY "Admins can view all patients"
  ON public.patients
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create contraindications reference table
CREATE TABLE public.contraindications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drug_name TEXT NOT NULL,
  condition TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(drug_name, condition)
);

-- Enable RLS on contraindications
ALTER TABLE public.contraindications ENABLE ROW LEVEL SECURITY;

-- Everyone can read contraindications (reference data)
CREATE POLICY "Anyone can view contraindications"
  ON public.contraindications
  FOR SELECT
  USING (true);

-- Only admins can insert contraindications
CREATE POLICY "Admins can insert contraindications"
  ON public.contraindications
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update contraindications
CREATE POLICY "Admins can update contraindications"
  ON public.contraindications
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Only admins can delete contraindications
CREATE POLICY "Admins can delete contraindications"
  ON public.contraindications
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_contraindications_updated_at
  BEFORE UPDATE ON public.contraindications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add some initial contraindication data
INSERT INTO public.contraindications (drug_name, condition, severity, description) VALUES
  ('Metformin', 'Kidney disease', 'severe', 'Risk of lactic acidosis in patients with renal impairment'),
  ('Metformin', 'Severe heart failure', 'severe', 'Increased risk of lactic acidosis'),
  ('Metformin', 'Lactic acidosis', 'severe', 'Absolute contraindication'),
  ('Amlodipine', 'Severe aortic stenosis', 'severe', 'May worsen cardiac function'),
  ('Amlodipine', 'Cardiogenic shock', 'severe', 'Contraindicated in shock states'),
  ('Atorvastatin', 'Active liver disease', 'severe', 'May worsen hepatic function'),
  ('Atorvastatin', 'Pregnancy', 'severe', 'Teratogenic effects'),
  ('Atorvastatin', 'Breastfeeding', 'severe', 'Excreted in breast milk'),
  ('Lisinopril', 'Pregnancy', 'severe', 'Fetal toxicity'),
  ('Lisinopril', 'Angioedema history', 'severe', 'Risk of recurrent angioedema'),
  ('Aspirin', 'Active bleeding', 'severe', 'Increases bleeding risk'),
  ('Aspirin', 'Hemophilia', 'severe', 'Severe bleeding risk'),
  ('Omeprazole', 'Hypersensitivity to PPIs', 'moderate', 'Allergic reactions'),
  ('Azithromycin', 'QT prolongation', 'severe', 'Risk of cardiac arrhythmias'),
  ('Warfarin', 'Pregnancy', 'severe', 'Teratogenic effects'),
  ('Warfarin', 'Active bleeding', 'severe', 'Contraindicated in bleeding disorders');

-- Create index for faster lookups
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_visit_date ON public.patients(visit_date);
CREATE INDEX idx_contraindications_drug_name ON public.contraindications(drug_name);