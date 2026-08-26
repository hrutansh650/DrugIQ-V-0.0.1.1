-- Add unique constraint on generic_name and then update brand information
ALTER TABLE public.drug_brands ADD CONSTRAINT unique_generic_name UNIQUE (generic_name);

-- Now insert/update the drug brand data
INSERT INTO public.drug_brands (generic_name, brand_name_1, brand_name_2, brand_name_3, brand_name_4, brand_name_5, category, dosage_form, company) 
VALUES 
  ('Acetaminophen', 'Tylenol', 'Panadol', 'Mapap', 'FeverAll', 'Tempra', 'Analgesic', 'Tablet', 'Various'),
  ('Ibuprofen', 'Advil', 'Motrin', 'Nurofen', 'Brufen', 'Midol IB', 'NSAID', 'Tablet', 'Various'),
  ('Amoxicillin', 'Amoxil', 'Trimox', 'Moxatag', 'Dispermox', 'Larotid', 'Antibiotic', 'Capsule', 'Various'),
  ('Atorvastatin', 'Lipitor', 'Atorlip', 'Atorva', 'Sortis', 'Torvacard', 'Statin', 'Tablet', 'Various'),
  ('Lisinopril', 'Prinivil', 'Zestril', 'Linvas', 'Hipril', 'Lipril', 'ACE Inhibitor', 'Tablet', 'Various'),
  ('Metformin', 'Glucophage', 'Glumetza', 'Riomet', 'Fortamet', 'Obimet', 'Antidiabetic', 'Tablet', 'Various'),
  ('Amlodipine', 'Norvasc', 'Amlogard', 'Amlopres', 'Amvasc', 'Stamlo', 'Calcium Channel Blocker', 'Tablet', 'Various'),
  ('Simvastatin', 'Zocor', 'Simvacor', 'Simcard', 'Simlup', 'Simvotin', 'Statin', 'Tablet', 'Various'),
  ('Omeprazole', 'Prilosec', 'Losec', 'Omez', 'Zegerid', 'Omepral', 'Proton Pump Inhibitor', 'Capsule', 'Various'),
  ('Levothyroxine', 'Synthroid', 'Euthyrox', 'Eltroxin', 'Levoxyl', 'Thyrax', 'Thyroid Hormone', 'Tablet', 'Various'),
  ('Albuterol', 'Ventolin', 'ProAir', 'Proventil', 'AccuNeb', 'Airomir', 'Bronchodilator', 'Inhaler', 'Various'),
  ('Metoprolol', 'Lopressor', 'Toprol XL', 'Betaloc', 'Metolar', 'Metoprolol Succinate ER', 'Beta Blocker', 'Tablet', 'Various'),
  ('Hydrochlorothiazide', 'Microzide', 'HydroDIURIL', 'Esidrix', 'Oretic', 'Urozide', 'Diuretic', 'Tablet', 'Various'),
  ('Gabapentin', 'Neurontin', 'Gralise', 'Gabarone', 'Fanatrex', 'Horizant', 'Anticonvulsant', 'Capsule', 'Various'),
  ('Furosemide', 'Lasix', 'Frusemide', 'Frumex', 'Fumide', 'Diuver', 'Diuretic', 'Tablet', 'Various'),
  ('Sertraline', 'Zoloft', 'Serlain', 'Lustral', 'Asentra', 'Stimuloton', 'SSRI', 'Tablet', 'Various'),
  ('Prednisone', 'Deltasone', 'Rayos', 'Meticorten', 'Sterapred', 'Prednisone Intensol', 'Corticosteroid', 'Tablet', 'Various'),
  ('Clopidogrel', 'Plavix', 'Clopilet', 'Clopivas', 'Ceruvin', 'Deplatt', 'Antiplatelet', 'Tablet', 'Various'),
  ('Ciprofloxacin', 'Cipro', 'Ciloxan', 'Cifran', 'Ciplox', 'Cetraxal', 'Antibiotic', 'Tablet', 'Various'),
  ('Insulin Glargine', 'Lantus', 'Basaglar', 'Toujeo', 'Semglee', 'Abasaglar', 'Insulin', 'Injection', 'Various')
ON CONFLICT (generic_name) 
DO UPDATE SET 
  brand_name_1 = EXCLUDED.brand_name_1,
  brand_name_2 = EXCLUDED.brand_name_2,
  brand_name_3 = EXCLUDED.brand_name_3,
  brand_name_4 = EXCLUDED.brand_name_4,
  brand_name_5 = EXCLUDED.brand_name_5,
  category = EXCLUDED.category,
  dosage_form = EXCLUDED.dosage_form,
  company = EXCLUDED.company,
  updated_at = now();