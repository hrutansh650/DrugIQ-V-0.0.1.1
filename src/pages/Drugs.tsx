import React, { useState } from 'react';
import { Search, Eye, Calculator, Plus, Minus, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import BrandInfoTable from "@/components/BrandInfoTable";
import DrugIndexTable from "@/components/DrugIndexTable";
const Drugs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('drugs');

  // Dosage Calculator State
  const [selectedDrug, setSelectedDrug] = useState('');
  const [patientWeight, setPatientWeight] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [renalFunction, setRenalFunction] = useState('normal');
  const [hepaticFunction, setHepaticFunction] = useState('normal');
  const [patientGroup, setPatientGroup] = useState('adult');
  const [indication, setIndication] = useState('');
  const [calculatedDose, setCalculatedDose] = useState(null);

  // Featured drugs for info display
  const featuredDrugs = [{
    name: 'Metformin',
    category: 'Antidiabetic',
    indication: 'Type 2 Diabetes',
    dosage: '500-1000mg',
    frequency: 'Twice daily',
    safety: 90,
    cost: '₹45/month'
  }, {
    name: 'Amlodipine',
    category: 'Antihypertensive',
    indication: 'Hypertension',
    dosage: '5-10mg',
    frequency: 'Once daily',
    safety: 85,
    cost: '₹35/month'
  }, {
    name: 'Atorvastatin',
    category: 'Statin',
    indication: 'High Cholesterol',
    dosage: '10-80mg',
    frequency: 'Once daily',
    safety: 82,
    cost: '₹120/month'
  }, {
    name: 'Lisinopril',
    category: 'ACE Inhibitor',
    indication: 'Hypertension',
    dosage: '10-40mg',
    frequency: 'Once daily',
    safety: 88,
    cost: '₹50/month'
  }, {
    name: 'Omeprazole',
    category: 'PPI',
    indication: 'GERD, Ulcers',
    dosage: '20-40mg',
    frequency: 'Once daily',
    safety: 85,
    cost: '₹40/month'
  }, {
    name: 'Amoxicillin',
    category: 'Antibiotic',
    indication: 'Bacterial Infections',
    dosage: '500mg',
    frequency: 'Three times daily',
    safety: 88,
    cost: '₹25/course'
  }];

  // Dosage calculation function
  const calculateDose = () => {
    if (!selectedDrug || !patientWeight || !patientAge) return;
    const drugFormulas = {
      'Metformin': {
        baseCalc: (weight, age) => {
          const baseDose = Math.min(1000, weight * 10); // mg
          if (age > 65) return baseDose * 0.8;
          return baseDose;
        },
        unit: 'mg',
        frequency: 'twice daily',
        maxDose: 2000
      },
      'Amoxicillin': {
        baseCalc: (weight, age) => {
          if (patientGroup === 'pediatric') return weight * 40; // 40mg/kg/day
          return 500; // Standard adult dose
        },
        unit: 'mg',
        frequency: 'three times daily',
        maxDose: 1000
      },
      'Paracetamol': {
        baseCalc: (weight, age) => {
          if (patientGroup === 'pediatric') return weight * 15; // 15mg/kg/dose
          return Math.min(1000, weight * 15);
        },
        unit: 'mg',
        frequency: 'every 6 hours',
        maxDose: 1000
      }
    };
    const drugData = drugFormulas[selectedDrug];
    if (!drugData) return;
    let dose = drugData.baseCalc(parseFloat(patientWeight), parseFloat(patientAge));

    // Adjust for renal function
    if (renalFunction === 'mild_impairment') dose *= 0.8;else if (renalFunction === 'moderate_impairment') dose *= 0.6;else if (renalFunction === 'severe_impairment') dose *= 0.4;

    // Adjust for hepatic function
    if (hepaticFunction === 'mild_impairment') dose *= 0.9;else if (hepaticFunction === 'moderate_impairment') dose *= 0.7;else if (hepaticFunction === 'severe_impairment') dose *= 0.5;

    // Cap at maximum dose
    dose = Math.min(dose, drugData.maxDose);
    setCalculatedDose({
      dose: Math.round(dose),
      unit: drugData.unit,
      frequency: drugData.frequency,
      maxDose: drugData.maxDose,
      adjustments: {
        renal: renalFunction !== 'normal',
        hepatic: hepaticFunction !== 'normal',
        age: patientGroup !== 'adult'
      }
    });
  };

  // Sample drug data with detailed information
  const drugsData = [{
    id: 1,
    genericName: "Metformin",
    brandNames: ["Glycomet", "Glucophage", "Formin"],
    drugClass: "Antidiabetic (Biguanide)",
    indications: ["Type 2 Diabetes Mellitus", "Polycystic Ovary Syndrome (PCOS)", "Prediabetes"],
    dosage: "Initial: 500mg twice daily with meals. Maximum: 2000-2500mg daily in divided doses",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Vitamin B12 deficiency", "Lactic acidosis (rare)"],
    contraindications: ["Severe kidney disease", "Acute heart failure", "Metabolic acidosis", "Severe liver disease"],
    category: "Endocrine",
    mechanism: "Decreases hepatic glucose production and improves insulin sensitivity",
    halfLife: "4-9 hours",
    bioavailability: "50-60%",
    interactions: ["Alcohol (increases lactic acidosis risk)", "Contrast agents", "Cimetidine"],
    monitoring: ["Renal function", "Vitamin B12 levels", "Lactic acid levels"]
  }, {
    id: 2,
    genericName: "Lisinopril",
    brandNames: ["Prinivil", "Zestril", "Hipril"],
    drugClass: "ACE Inhibitor",
    indications: ["Hypertension", "Heart failure", "Post-myocardial infarction", "Diabetic nephropathy"],
    dosage: "Initial: 5-10mg once daily. Maintenance: 10-40mg once daily",
    sideEffects: ["Dry cough", "Hyperkalemia", "Angioedema", "Hypotension", "Dizziness"],
    contraindications: ["Pregnancy", "Angioedema history", "Bilateral renal artery stenosis"],
    category: "Cardiovascular"
  }, {
    id: 3,
    genericName: "Atorvastatin",
    brandNames: ["Lipitor", "Atorlip", "Storvas"],
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    indications: ["Hypercholesterolemia", "Mixed dyslipidemia", "Primary prevention of cardiovascular disease"],
    dosage: "Initial: 10-20mg once daily. Maximum: 80mg once daily",
    sideEffects: ["Muscle pain", "Elevated liver enzymes", "Headache", "Gastrointestinal upset"],
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding", "Concurrent use of certain drugs"],
    category: "Cardiovascular"
  }, {
    id: 4,
    genericName: "Amlodipine",
    brandNames: ["Norvasc", "Amlopress", "Amlodac"],
    drugClass: "Calcium Channel Blocker (Dihydropyridine)",
    indications: ["Hypertension", "Chronic stable angina", "Vasospastic angina"],
    dosage: "Initial: 2.5-5mg once daily. Maximum: 10mg once daily",
    sideEffects: ["Peripheral edema", "Dizziness", "Flushing", "Fatigue", "Palpitations"],
    contraindications: ["Cardiogenic shock", "Severe aortic stenosis", "Hypersensitivity"],
    category: "Cardiovascular"
  }, {
    id: 5,
    genericName: "Omeprazole",
    brandNames: ["Prilosec", "Omez", "Losec"],
    drugClass: "Proton Pump Inhibitor (PPI)",
    indications: ["Gastroesophageal reflux disease", "Peptic ulcer disease", "Zollinger-Ellison syndrome"],
    dosage: "GERD: 20mg once daily. Peptic ulcer: 20-40mg once daily",
    sideEffects: ["Headache", "Nausea", "Diarrhea", "Vitamin B12 deficiency", "Increased fracture risk"],
    contraindications: ["Hypersensitivity", "Concurrent use with rilpivirine"],
    category: "Gastrointestinal"
  }, {
    id: 6,
    genericName: "Amoxicillin",
    brandNames: ["Amoxil", "Moxikind", "Amoxyclav"],
    drugClass: "Beta-lactam Antibiotic (Penicillin)",
    indications: ["Bacterial infections", "Respiratory tract infections", "Urinary tract infections"],
    dosage: "Adults: 250-500mg every 8 hours or 500-875mg every 12 hours",
    sideEffects: ["Diarrhea", "Nausea", "Rash", "Allergic reactions", "Clostridioides difficile infection"],
    contraindications: ["Penicillin allergy", "Infectious mononucleosis", "Lymphocytic leukemia"],
    category: "Anti-infective"
  }, {
    id: 7,
    genericName: "Levothyroxine",
    brandNames: ["Synthroid", "Eltroxin", "Thyronorm"],
    drugClass: "Thyroid Hormone",
    indications: ["Hypothyroidism", "Thyroid hormone replacement", "TSH suppression"],
    dosage: "Initial: 25-50mcg daily. Maintenance: 100-200mcg daily",
    sideEffects: ["Palpitations", "Insomnia", "Weight loss", "Heat intolerance", "Tremors"],
    contraindications: ["Untreated adrenal insufficiency", "Recent myocardial infarction", "Thyrotoxicosis"],
    category: "Endocrine"
  }, {
    id: 8,
    genericName: "Aspirin",
    brandNames: ["Ecosprin", "Disprin", "Aspegic"],
    drugClass: "NSAID (Salicylate)",
    indications: ["Pain relief", "Fever reduction", "Cardiovascular protection", "Anti-inflammatory"],
    dosage: "Cardioprotective: 75-100mg daily. Pain: 300-600mg every 4-6 hours",
    sideEffects: ["Gastric irritation", "Bleeding risk", "Tinnitus", "Reye's syndrome (in children)"],
    contraindications: ["Active peptic ulcer", "Bleeding disorders", "Children with viral infections"],
    category: "Analgesic"
  }, {
    id: 9,
    genericName: "Metoprolol",
    brandNames: ["Lopressor", "Metolar", "Betaloc"],
    drugClass: "Beta-1 Selective Blocker",
    indications: ["Hypertension", "Angina pectoris", "Heart failure", "Post-myocardial infarction"],
    dosage: "Initial: 25-50mg twice daily. Maximum: 200mg twice daily",
    sideEffects: ["Bradycardia", "Fatigue", "Dizziness", "Cold extremities", "Depression"],
    contraindications: ["Severe bradycardia", "Heart block", "Cardiogenic shock", "Severe asthma"],
    category: "Cardiovascular"
  }];
  const filteredDrugs = drugsData.filter(drug => drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) || drug.brandNames.some(brand => brand.toLowerCase().includes(searchTerm.toLowerCase())) || drug.drugClass.toLowerCase().includes(searchTerm.toLowerCase()) || drug.indications.some(indication => indication.toLowerCase().includes(searchTerm.toLowerCase())));
  const DrugDetailDialog = ({
    drug
  }) => <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-blue-600">
          {drug.genericName}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Brand Names */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Brand Names</h3>
          <div className="flex flex-wrap gap-2">
            {drug.brandNames.map((brand, index) => <Badge key={index} variant="secondary" className="text-sm">
                {brand}
              </Badge>)}
          </div>
        </div>

        <Separator />

        {/* Drug Class */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Drug Class</h3>
          <Badge variant="outline" className="text-sm">
            {drug.drugClass}
          </Badge>
        </div>

        <Separator />

        {/* Indications */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Indications</h3>
          <ul className="list-disc list-inside space-y-1">
            {drug.indications.map((indication, index) => <li key={index} className="text-gray-700">{indication}</li>)}
          </ul>
        </div>

        <Separator />

        {/* Dosage */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Dosage</h3>
          <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{drug.dosage}</p>
        </div>

        <Separator />

        {/* Side Effects */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Side Effects</h3>
          <ul className="list-disc list-inside space-y-1">
            {drug.sideEffects.map((effect, index) => <li key={index} className="text-gray-700">{effect}</li>)}
          </ul>
        </div>

        <Separator />

        {/* Mechanism of Action */}
        {drug.mechanism && <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Mechanism of Action</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{drug.mechanism}</p>
            </div>
            <Separator />
          </>}

        {/* Pharmacokinetics */}
        {(drug.halfLife || drug.bioavailability) && <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Pharmacokinetics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drug.halfLife && <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Half-life</p>
                    <p className="text-gray-600">{drug.halfLife}</p>
                  </div>}
                {drug.bioavailability && <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Bioavailability</p>
                    <p className="text-gray-600">{drug.bioavailability}</p>
                  </div>}
              </div>
            </div>
            <Separator />
          </>}

        {/* Drug Interactions */}
        {drug.interactions && <>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-orange-600">Drug Interactions</h3>
              <ul className="list-disc list-inside space-y-1">
                {drug.interactions.map((interaction, index) => <li key={index} className="text-orange-700 bg-orange-50 p-2 rounded">
                    {interaction}
                  </li>)}
              </ul>
            </div>
            <Separator />
          </>}

        {/* Monitoring Parameters */}
        {drug.monitoring && <>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Monitoring Parameters</h3>
              <ul className="list-disc list-inside space-y-1">
                {drug.monitoring.map((param, index) => <li key={index} className="text-green-700 bg-green-50 p-2 rounded">
                    {param}
                  </li>)}
              </ul>
            </div>
            <Separator />
          </>}

        {/* Contraindications */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Contraindications</h3>
          <ul className="list-disc list-inside space-y-1">
            {drug.contraindications.map((contraindication, index) => <li key={index} className="text-red-700 bg-red-50 p-2 rounded">
                {contraindication}
              </li>)}
          </ul>
        </div>
      </div>
    </DialogContent>;
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">DrugIQ Index</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive drug database with smart dosage calculator</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Brand Info</TabsTrigger>
            <TabsTrigger value="drugs">Drug Database</TabsTrigger>
            <TabsTrigger value="calculator">Dosage Calculator</TabsTrigger>
          </TabsList>

          {/* Brand Info Display */}
          <TabsContent value="info" className="space-y-6">
            <BrandInfoTable />
          </TabsContent>

          {/* Drug Database */}
          <TabsContent value="drugs" className="space-y-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="Search drugs by name, indication, or category..." className="pl-10 text-lg h-12" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrugs.map(drug => <Card key={drug.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-blue-600 dark:text-blue-400">{drug.genericName}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {drug.brandNames.slice(0, 2).map((brand, index) => <Badge key={index} variant="secondary" className="text-xs">
                            {brand}
                          </Badge>)}
                        {drug.brandNames.length > 2 && <Badge variant="secondary" className="text-xs">
                            +{drug.brandNames.length - 2} more
                          </Badge>}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {drug.drugClass}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Primary Indications:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {drug.indications.slice(0, 2).join(", ")}
                          {drug.indications.length > 2 && "..."}
                        </p>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Profile
                          </Button>
                        </DialogTrigger>
                        <DrugDetailDialog drug={drug} />
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {filteredDrugs.length === 0 && <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No drugs found matching your search criteria.</p>
              </div>}
          </TabsContent>

          {/* Dosage Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-8 w-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Dosage Calculator</h2>
                  <p className="text-gray-600 dark:text-gray-400">Calculate personalized dosages based on patient parameters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input id="weight" type="number" placeholder="70" value={patientWeight} onChange={e => setPatientWeight(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="age">Age (years)</Label>
                          <Input id="age" type="number" placeholder="35" value={patientAge} onChange={e => setPatientAge(e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <Label>Patient Group</Label>
                        <Select value={patientGroup} onValueChange={setPatientGroup}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pediatric">Pediatric (0-18 years)</SelectItem>
                            <SelectItem value="adult">Adult (18-65 years)</SelectItem>
                            <SelectItem value="geriatric">Geriatric (65+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Renal Function</Label>
                          <Select value={renalFunction} onValueChange={setRenalFunction}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="mild_impairment">Mild Impairment</SelectItem>
                              <SelectItem value="moderate_impairment">Moderate Impairment</SelectItem>
                              <SelectItem value="severe_impairment">Severe Impairment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Hepatic Function</Label>
                          <Select value={hepaticFunction} onValueChange={setHepaticFunction}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="mild_impairment">Mild Impairment</SelectItem>
                              <SelectItem value="moderate_impairment">Moderate Impairment</SelectItem>
                              <SelectItem value="severe_impairment">Severe Impairment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Drug Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Select Drug</Label>
                        <Select value={selectedDrug} onValueChange={setSelectedDrug}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a drug" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Metformin">Metformin</SelectItem>
                            <SelectItem value="Amoxicillin">Amoxicillin</SelectItem>
                            <SelectItem value="Paracetamol">Paracetamol</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="indication">Indication (optional)</Label>
                        <Input id="indication" placeholder="e.g., Type 2 Diabetes" value={indication} onChange={e => setIndication(e.target.value)} />
                      </div>

                      <Button onClick={calculateDose} className="w-full" disabled={!selectedDrug || !patientWeight || !patientAge}>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Dose
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  {calculatedDose && <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Calculated Dosage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {calculatedDose.dose} {calculatedDose.unit}
                          </div>
                          <div className="text-lg text-green-700 dark:text-green-300">
                            {calculatedDose.frequency}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Maximum safe dose:</span>
                            <span className="text-sm font-medium">{calculatedDose.maxDose} {calculatedDose.unit}</span>
                          </div>
                          
                          {(calculatedDose.adjustments.renal || calculatedDose.adjustments.hepatic || calculatedDose.adjustments.age) && <div className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Adjustments Applied:</span>
                              </div>
                              <div className="space-y-1 text-xs text-orange-600 dark:text-orange-400">
                                {calculatedDose.adjustments.renal && <div>• Dose adjusted for renal function</div>}
                                {calculatedDose.adjustments.hepatic && <div>• Dose adjusted for hepatic function</div>}
                                {calculatedDose.adjustments.age && <div>• Dose adjusted for age group</div>}
                              </div>
                            </div>}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => {
                        const newDose = Math.max(calculatedDose.dose - 50, 0);
                        setCalculatedDose({
                          ...calculatedDose,
                          dose: newDose
                        });
                      }}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                        const newDose = Math.min(calculatedDose.dose + 50, calculatedDose.maxDose);
                        setCalculatedDose({
                          ...calculatedDose,
                          dose: newDose
                        });
                      }}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Safety Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Always verify calculated doses against established guidelines</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Consider patient comorbidities and drug interactions</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Monitor for therapeutic response and adverse effects</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                        <span>This calculator provides guidance only - clinical judgment is essential</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Drugs;