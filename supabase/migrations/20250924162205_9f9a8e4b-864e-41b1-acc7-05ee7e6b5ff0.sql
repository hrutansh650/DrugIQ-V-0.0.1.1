-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  specialization TEXT,
  license_number TEXT,
  clinic_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  dark_mode_enabled BOOLEAN DEFAULT false,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  last_feedback_reminder TIMESTAMP WITH TIME ZONE,
  total_usage_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create drug brands table
CREATE TABLE public.drug_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  dosage_form TEXT,
  company TEXT,
  brand_name_1 TEXT,
  brand_name_2 TEXT,
  brand_name_3 TEXT,
  brand_name_4 TEXT,
  brand_name_5 TEXT,
  price_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  medical_history TEXT,
  current_medications TEXT,
  allergies TEXT,
  vitals JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contraindications table
CREATE TABLE public.contraindications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name TEXT NOT NULL,
  contraindicated_with TEXT NOT NULL,
  severity TEXT DEFAULT 'moderate',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drug_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contraindications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for feedback
CREATE POLICY "Users can insert their own feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for patients
CREATE POLICY "Users can manage their own patients" ON public.patients
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for drug_brands (public read access)
CREATE POLICY "Anyone can view drug brands" ON public.drug_brands
  FOR SELECT USING (true);

-- Create RLS policies for contraindications (public read access)
CREATE POLICY "Anyone can view contraindications" ON public.contraindications
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample drug data
INSERT INTO public.drug_brands (category, generic_name, dosage_form, company, brand_name_1, brand_name_2, price_range) VALUES
('Analgesics', 'Paracetamol', 'Tablet', 'Various', 'Crocin', 'Dolo', '₹10-50'),
('Analgesics', 'Ibuprofen', 'Tablet', 'Various', 'Brufen', 'Combiflam', '₹20-80'),
('Antibiotics', 'Amoxicillin', 'Capsule', 'Various', 'Amoxil', 'Novamox', '₹50-150'),
('Antacids', 'Omeprazole', 'Capsule', 'Various', 'Omez', 'Prilosec', '₹30-100'),
('Cardiovascular', 'Aspirin', 'Tablet', 'Various', 'Dispirin', 'Ecosprin', '₹15-60');

-- Insert some contraindications data
INSERT INTO public.contraindications (drug_name, contraindicated_with, severity, description) VALUES
('Warfarin', 'Aspirin', 'high', 'Increased bleeding risk when combined'),
('Aspirin', 'Ibuprofen', 'moderate', 'May reduce cardioprotective effects of aspirin'),
('Omeprazole', 'Warfarin', 'moderate', 'May increase warfarin levels'),
('Spironolactone', 'Aspirin', 'moderate', 'May reduce effectiveness of spironolactone');