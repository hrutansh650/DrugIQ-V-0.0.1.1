-- Create table for drug brand information
CREATE TABLE public.drug_brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  dosage_form TEXT NOT NULL,
  company TEXT NOT NULL,
  brand_name_1 TEXT,
  brand_name_2 TEXT,
  brand_name_3 TEXT,
  brand_name_4 TEXT,
  brand_name_5 TEXT,
  brand_name_6 TEXT,
  brand_name_7 TEXT,
  brand_name_8 TEXT,
  brand_name_9 TEXT,
  brand_name_10 TEXT,
  price_range_per_strip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.drug_brands ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access to drug brands" 
ON public.drug_brands 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_drug_brands_updated_at
BEFORE UPDATE ON public.drug_brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.drug_brands (
  category, generic_name, dosage_form, company, 
  brand_name_1, brand_name_2, brand_name_3, brand_name_4, brand_name_5,
  brand_name_6, brand_name_7, brand_name_8, brand_name_9, brand_name_10,
  price_range_per_strip
) VALUES 
(
  'Analgesics', 'Paracetamol', 'Tablet', 'Abbott',
  'Crocin', 'Calpol', 'Metacin', 'Pacimol', 'Pyrigesic',
  'T98', 'Febrex', 'Paracip', 'Dolopar', 'Dolo',
  '₹10–₹35'
),
(
  'NSAIDs', 'Ibuprofen', 'Tablet', 'Cipla',
  'Brufen', 'Ibugesic', 'Ibumax', 'Ibuclin', 'Mefkind',
  'Advil', 'Motrin', 'Nurofen', 'Flarin', 'Bonjela',
  '₹15–₹40'
),
(
  'Antibiotics', 'Amoxicillin', 'Capsule', 'GSK',
  'Amoxil', 'Mox', 'Augmentin', 'Clavam', 'Almox',
  'Moxclav', 'Zimox', 'Ramox', 'Ranclav', 'Omnipen',
  '₹25–₹60'
),
(
  'Antacids', 'Pantoprazole', 'Tablet', 'Sun Pharma',
  'Pantocid', 'Pan 40', 'Pantop', 'Pantodac', 'Pansec',
  'Aciban', 'Pantoza', 'Pantakind', 'Pantin', 'Prazopan',
  '₹20–₹50'
);