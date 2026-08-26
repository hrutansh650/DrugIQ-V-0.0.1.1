-- Create drug_interactions table to store drug interaction data
CREATE TABLE public.drug_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drug_name TEXT NOT NULL,
  interacts_with TEXT NOT NULL,
  interaction_description TEXT NOT NULL,
  severity_level TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.drug_interactions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for prescription checking)
CREATE POLICY "Public read access to drug interactions" 
ON public.drug_interactions 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert/update interactions (admin functionality)
CREATE POLICY "Authenticated users can manage drug interactions" 
ON public.drug_interactions 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_drug_interactions_updated_at
BEFORE UPDATE ON public.drug_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the drug interaction data
INSERT INTO public.drug_interactions (drug_name, interacts_with, interaction_description, severity_level) VALUES
('Acetaminophen', 'Alcohol', 'Increased risk of liver toxicity', 'high'),
('Acetaminophen', 'Isoniazid', 'Increased risk of liver toxicity', 'high'),
('Ibuprofen', 'Warfarin', 'Increased bleeding risk', 'high'),
('Ibuprofen', 'ACE inhibitors', 'Kidney risk', 'moderate'),
('Ibuprofen', 'Lithium', 'Lithium toxicity', 'high'),
('Amoxicillin', 'Methotrexate', 'Increases methotrexate toxicity', 'high'),
('Amoxicillin', 'Oral contraceptives', 'May reduce contraceptive effectiveness', 'moderate'),
('Atorvastatin', 'Clarithromycin', 'Raises statin levels, muscle toxicity risk', 'high'),
('Atorvastatin', 'Grapefruit juice', 'Muscle toxicity (rhabdomyolysis) risk', 'moderate'),
('Lisinopril', 'Potassium supplements', 'High potassium levels', 'high'),
('Lisinopril', 'Spironolactone', 'High potassium levels', 'high'),
('Lisinopril', 'NSAIDs', 'Reduced effect and kidney risk', 'moderate'),
('Metformin', 'Contrast dye', 'Lactic acidosis risk', 'high'),
('Metformin', 'Cimetidine', 'Increases metformin levels', 'moderate'),
('Amlodipine', 'Simvastatin', 'Raises simvastatin levels, muscle toxicity', 'moderate'),
('Amlodipine', 'Diltiazem', 'Additive blood pressure lowering', 'moderate'),
('Simvastatin', 'Erythromycin', 'Raises statin levels, muscle toxicity risk', 'high'),
('Simvastatin', 'Grapefruit juice', 'Muscle toxicity risk', 'moderate'),
('Omeprazole', 'Clopidogrel', 'Reduces clopidogrel efficacy', 'high'),
('Omeprazole', 'Warfarin', 'Raises warfarin levels', 'moderate'),
('Omeprazole', 'Diazepam', 'Raises diazepam levels', 'moderate'),
('Levothyroxine', 'Iron', 'Reduced thyroid hormone absorption', 'moderate'),
('Levothyroxine', 'Calcium', 'Reduced thyroid hormone absorption', 'moderate'),
('Levothyroxine', 'Antacids', 'Reduced thyroid hormone absorption', 'moderate'),
('Albuterol', 'Beta-blockers', 'Reduced bronchodilation', 'high'),
('Albuterol', 'MAO inhibitors', 'Hypertensive crisis', 'high'),
('Metoprolol', 'Verapamil', 'Slow heart rate/heart block', 'high'),
('Metoprolol', 'Diltiazem', 'Slow heart rate/heart block', 'high'),
('Metoprolol', 'Insulin', 'Masks low blood sugar symptoms', 'moderate'),
('HCTZ', 'Lithium', 'Raises lithium levels', 'high'),
('HCTZ', 'NSAIDs', 'Reduced blood pressure lowering', 'moderate'),
('HCTZ', 'Antidiabetics', 'May raise blood sugar', 'moderate'),
('Gabapentin', 'Antacids', 'Reduced gabapentin effect', 'moderate'),
('Gabapentin', 'Morphine', 'Increased gabapentin concentration', 'moderate'),
('Furosemide', 'Aminoglycosides', 'Hearing loss risk', 'high'),
('Furosemide', 'Digoxin', 'Digoxin toxicity', 'high'),
('Furosemide', 'NSAIDs', 'Reduced diuretic effect', 'moderate'),
('Sertraline', 'MAOIs', 'Serotonin syndrome', 'high'),
('Sertraline', 'Triptans', 'Serotonin syndrome', 'high'),
('Sertraline', 'NSAIDs', 'Increased bleeding risk', 'moderate'),
('Prednisone', 'NSAIDs', 'GI ulcers risk', 'high'),
('Prednisone', 'Diabetes drugs', 'Alters blood sugar control', 'moderate'),
('Prednisone', 'Warfarin', 'Increases/decreases warfarin effect', 'moderate'),
('Clopidogrel', 'Omeprazole', 'Reduced clopidogrel effect', 'high'),
('Clopidogrel', 'NSAIDs', 'Increased bleeding risk', 'high'),
('Clopidogrel', 'Warfarin', 'Increased bleeding risk', 'high'),
('Ciprofloxacin', 'Tizanidine', 'Dangerously low blood pressure', 'high'),
('Ciprofloxacin', 'Antacids', 'Reduces ciprofloxacin absorption', 'moderate'),
('Ciprofloxacin', 'Warfarin', 'Raises warfarin levels', 'moderate'),
('Insulin glargine', 'Beta-blockers', 'Masks low blood sugar warning signs', 'moderate'),
('Insulin glargine', 'Thiazides', 'Raises blood sugar', 'moderate');

-- Create index for faster lookups
CREATE INDEX idx_drug_interactions_drug_name ON public.drug_interactions(drug_name);
CREATE INDEX idx_drug_interactions_interacts_with ON public.drug_interactions(interacts_with);