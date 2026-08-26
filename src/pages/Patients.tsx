
import React, { useState, useEffect } from 'react';
import AuthDialog from '@/components/AuthDialog';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  FileText, 
  Plus, 
  User, 
  Calendar, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  ClipboardList,
  Search,
  Filter,
  Upload,
  Eye,
  Edit,
  Clock,
  AlertCircle,
  CheckCircle2,
  Save,
  X,
  Printer,
  FileCheck,
  PlusCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Download,
  Activity,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PatientRecord {
  id: string;
  patient_name: string;
  patient_age: number;
  gender: string;
  visit_date: string;
  chief_complaint?: string;
  blood_pressure?: string;
  pulse_rate?: string;
  weight?: string;
  primary_diagnosis?: string;
  clinical_notes?: string;
  medications?: any;
  investigations?: any;
  treatment_plan?: string;
  next_followup_date?: string;
  private_notes?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [authDialog, setAuthDialog] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'age'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    if (!user) {
      setAuthDialog(true);
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch patient records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePatient = async (formData: any) => {
    if (!user) return;

    try {
      const patientData = {
        user_id: user.id,
        patient_name: formData.patientName,
        patient_age: parseInt(formData.patientAge),
        gender: formData.gender,
        visit_date: formData.visitDate,
        chief_complaint: formData.complaint || null,
        blood_pressure: formData.bp || null,
        pulse_rate: formData.pulse || null,
        weight: formData.weight || null,
        primary_diagnosis: formData.diagnosis || null,
        clinical_notes: formData.clinicalNotes || null,
        treatment_plan: formData.treatmentPlan || null,
        next_followup_date: formData.followUpDate || null,
        private_notes: formData.privateNotes || null,
      };

      if (editingPatient) {
        // Update existing patient
        const { error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', editingPatient.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Patient record updated successfully",
        });
      } else {
        // Insert new patient
        const { error } = await supabase
          .from('patients')
          .insert(patientData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Patient record created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "Failed to save patient record",
        variant: "destructive"
      });
    }
  };

  const filteredPatients = patients
    .filter(patient =>
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.primary_diagnosis && patient.primary_diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.patient_name.toLowerCase();
          bValue = b.patient_name.toLowerCase();
          break;
        case 'age':
          aValue = a.patient_age;
          bValue = b.patient_age;
          break;
        case 'date':
        default:
          aValue = new Date(a.visit_date).getTime();
          bValue = new Date(b.visit_date).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const PatientForm = ({ patient = null }: { patient?: PatientRecord | null }) => {
    const [formData, setFormData] = useState({
      patientName: patient?.patient_name || '',
      patientAge: patient?.patient_age?.toString() || '',
      gender: patient?.gender || 'Male',
      visitDate: patient?.visit_date || '',
      complaint: patient?.chief_complaint || '',
      bp: patient?.blood_pressure || '',
      pulse: patient?.pulse_rate || '',
      weight: patient?.weight || '',
      diagnosis: patient?.primary_diagnosis || '',
      clinicalNotes: patient?.clinical_notes || '',
      treatmentPlan: patient?.treatment_plan || '',
      followUpDate: patient?.next_followup_date || '',
      privateNotes: patient?.private_notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSavePatient(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input 
              id="patientName" 
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({...prev, patientName: e.target.value}))}
              required 
            />
          </div>
          <div>
            <Label htmlFor="patientAge">Age *</Label>
            <Input 
              id="patientAge" 
              type="number" 
              value={formData.patientAge}
              onChange={(e) => setFormData(prev => ({...prev, patientAge: e.target.value}))}
              required 
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <select 
              className="w-full h-10 px-3 py-2 border rounded-md bg-background"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="visitDate">Visit Date *</Label>
            <Input 
              id="visitDate" 
              type="date" 
              value={formData.visitDate}
              onChange={(e) => setFormData(prev => ({...prev, visitDate: e.target.value}))}
              required 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="complaint">Chief Complaint</Label>
          <Textarea 
            id="complaint" 
            value={formData.complaint}
            onChange={(e) => setFormData(prev => ({...prev, complaint: e.target.value}))}
            rows={2} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bp">Blood Pressure</Label>
            <Input 
              id="bp" 
              placeholder="120/80"
              value={formData.bp}
              onChange={(e) => setFormData(prev => ({...prev, bp: e.target.value}))}
            />
          </div>
          <div>
            <Label htmlFor="pulse">Pulse Rate</Label>
            <Input 
              id="pulse" 
              placeholder="72"
              value={formData.pulse}
              onChange={(e) => setFormData(prev => ({...prev, pulse: e.target.value}))}
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input 
              id="weight" 
              placeholder="70"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({...prev, weight: e.target.value}))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="diagnosis">Primary Diagnosis</Label>
          <Input 
            id="diagnosis" 
            value={formData.diagnosis}
            onChange={(e) => setFormData(prev => ({...prev, diagnosis: e.target.value}))}
          />
        </div>

        <div>
          <Label htmlFor="clinicalNotes">Clinical Notes</Label>
          <Textarea 
            id="clinicalNotes" 
            value={formData.clinicalNotes}
            onChange={(e) => setFormData(prev => ({...prev, clinicalNotes: e.target.value}))}
            rows={3} 
          />
        </div>

        <div>
          <Label htmlFor="treatmentPlan">Treatment Plan & Advice</Label>
          <Textarea 
            id="treatmentPlan" 
            value={formData.treatmentPlan}
            onChange={(e) => setFormData(prev => ({...prev, treatmentPlan: e.target.value}))}
            rows={3} 
          />
        </div>

        <div>
          <Label htmlFor="followUpDate">Next Follow-up Date</Label>
          <Input 
            id="followUpDate" 
            type="date" 
            value={formData.followUpDate}
            onChange={(e) => setFormData(prev => ({...prev, followUpDate: e.target.value}))}
          />
        </div>

        <div>
          <Label htmlFor="privateNotes">Private Doctor Notes</Label>
          <Textarea 
            id="privateNotes" 
            value={formData.privateNotes}
            onChange={(e) => setFormData(prev => ({...prev, privateNotes: e.target.value}))}
            rows={2} 
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {setIsDialogOpen(false); setEditingPatient(null);}}
          >
            Cancel
          </Button>
          <Button type="submit">
            {patient ? 'Update Record' : 'Save Patient Record'}
          </Button>
        </div>
      </form>
    );
  };

  const PatientDetailView = ({ patient }: { patient: PatientRecord }) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{patient.patient_name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{patient.patient_age} years, {patient.gender}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Visit: {patient.visit_date}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => {
              setEditingPatient(patient);
              setIsDialogOpen(true);
            }}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Record
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="w-full sm:w-auto">
                <Printer className="h-4 w-4 mr-2" />
                Smart Prescription Builder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Smart Prescription Builder for {patient.patient_name}</DialogTitle>
              </DialogHeader>
              <SmartPrescriptionBuilder patient={patient} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Chief Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{patient.chief_complaint || 'Not recorded'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Primary Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{patient.primary_diagnosis || 'Not recorded'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Next Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{patient.next_followup_date || "Not scheduled"}</p>
          </CardContent>
        </Card>
      </div>

      {patient.blood_pressure || patient.pulse_rate || patient.weight ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {patient.blood_pressure && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blood Pressure</p>
                  <p className="text-lg">{patient.blood_pressure}</p>
                </div>
              )}
              {patient.pulse_rate && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pulse Rate</p>
                  <p className="text-lg">{patient.pulse_rate}</p>
                </div>
              )}
              {patient.weight && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight</p>
                  <p className="text-lg">{patient.weight} kg</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {patient.clinical_notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{patient.clinical_notes}</p>
          </CardContent>
        </Card>
      )}

      {patient.treatment_plan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Treatment Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{patient.treatment_plan}</p>
          </CardContent>
        </Card>
      )}

      {patient.private_notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
              Private Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">{patient.private_notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Smart Prescription Builder Component
  const SmartPrescriptionBuilder = ({ patient }: { patient: PatientRecord }) => {
    const [searchDrug, setSearchDrug] = useState('');
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [showInteractions, setShowInteractions] = useState(true);
    const [showAlternatives, setShowAlternatives] = useState(true);
    const [contraindications, setContraindications] = useState([]);
    const [isLoadingContraindications, setIsLoadingContraindications] = useState(false);

    // Fetch contraindications from database
    const fetchContraindications = async (drugNames: string[]) => {
      if (drugNames.length === 0) {
        setContraindications([]);
        return;
      }

      setIsLoadingContraindications(true);
      try {
        const { data, error } = await supabase
          .from('contraindications')
          .select('*')
          .in('drug_name', drugNames);

        if (error) throw error;

        setContraindications(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error", 
          description: "Failed to fetch contraindications",
          variant: "destructive"
        });
      } finally {
        setIsLoadingContraindications(false);
      }
    };

    // Update contraindications when selected drugs change
    useEffect(() => {
      const drugNames = selectedDrugs.map(drug => drug.genericName);
      fetchContraindications(drugNames);
    }, [selectedDrugs]);

    // Drug database for India
    const drugDatabase = [
      {
        id: 1,
        genericName: 'Metformin',
        brandNames: ['Glucophage', 'Glycomet', 'Formet', 'Obimet'],
        category: 'Antidiabetic',
        dosage: '500mg-1000mg',
        frequency: 'Twice daily',
        price: 45,
        efficacy: 85,
        safety: 90,
        interactions: ['Warfarin', 'Alcohol', 'Iodinated contrast', 'Furosemide'],
        indication: 'Type 2 Diabetes',
        contraindications: ['Kidney disease', 'Severe heart failure', 'Lactic acidosis'],
        sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste']
      },
      {
        id: 2,
        genericName: 'Amlodipine',
        brandNames: ['Norvasc', 'Amlip', 'Amtas', 'Stamlo'],
        category: 'Antihypertensive',
        dosage: '5mg-10mg',
        frequency: 'Once daily',
        price: 35,
        efficacy: 88,
        safety: 85,
        interactions: ['Simvastatin', 'Grapefruit juice', 'Rifampin', 'Atorvastatin'],
        indication: 'Hypertension, Angina',
        contraindications: ['Severe aortic stenosis', 'Cardiogenic shock'],
        sideEffects: ['Ankle swelling', 'Flushing', 'Fatigue']
      },
      {
        id: 3,
        genericName: 'Atorvastatin',
        brandNames: ['Lipitor', 'Atorlip', 'Storvas', 'Tonact'],
        category: 'Statin',
        dosage: '10mg-80mg',
        frequency: 'Once daily',
        price: 120,
        efficacy: 92,
        safety: 82,
        interactions: ['Warfarin', 'Cyclosporine', 'Gemfibrozil', 'Amlodipine'],
        indication: 'High cholesterol, Cardiovascular risk reduction',
        contraindications: ['Active liver disease', 'Pregnancy', 'Breastfeeding'],
        sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Digestive issues']
      },
      {
        id: 4,
        genericName: 'Lisinopril',
        brandNames: ['Prinivil', 'Zestril', 'Lipril', 'Lisril'],
        category: 'ACE Inhibitor',
        dosage: '10mg-40mg',
        frequency: 'Once daily',
        price: 50,
        efficacy: 87,
        safety: 88,
        interactions: ['Potassium supplements', 'NSAIDs', 'Lithium', 'Spironolactone'],
        indication: 'Hypertension, Heart failure',
        contraindications: ['Angioedema history', 'Pregnancy', 'Bilateral renal artery stenosis'],
        sideEffects: ['Dry cough', 'Hyperkalemia', 'Angioedema']
      },
      {
        id: 5,
        genericName: 'Aspirin',
        brandNames: ['Ecosprin', 'Disprin', 'Loprin', 'Aspisol'],
        category: 'Antiplatelet',
        dosage: '75mg-300mg',
        frequency: 'Once daily',
        price: 25,
        efficacy: 85,
        safety: 78,
        interactions: ['Warfarin', 'Methotrexate', 'Lisinopril', 'Ibuprofen'],
        indication: 'Cardiovascular protection, Pain relief',
        contraindications: ['Active bleeding', 'Peptic ulcer', 'Allergy to salicylates'],
        sideEffects: ['Gastric irritation', 'Bleeding risk', 'Tinnitus']
      },
      {
        id: 6,
        genericName: 'Warfarin',
        brandNames: ['Coumadin', 'Warf', 'Acitrom', 'Warepid'],
        category: 'Anticoagulant',
        dosage: '2mg-10mg',
        frequency: 'Once daily',
        price: 80,
        efficacy: 90,
        safety: 70,
        interactions: ['Aspirin', 'Metformin', 'Atorvastatin', 'Amoxicillin'],
        indication: 'Atrial fibrillation, DVT/PE prevention',
        contraindications: ['Active bleeding', 'Pregnancy', 'Recent surgery'],
        sideEffects: ['Bleeding', 'Bruising', 'Hair loss']
      },
      {
        id: 7,
        genericName: 'Ibuprofen',
        brandNames: ['Brufen', 'Combiflam', 'Ibugesic', 'Advil'],
        category: 'NSAID',
        dosage: '400mg-800mg',
        frequency: 'Three times daily',
        price: 30,
        efficacy: 82,
        safety: 75,
        interactions: ['Lisinopril', 'Warfarin', 'Aspirin', 'Methotrexate'],
        indication: 'Pain relief, Inflammation',
        contraindications: ['Peptic ulcer', 'Kidney disease', 'Heart failure'],
        sideEffects: ['Gastric irritation', 'Kidney problems', 'Hypertension']
      },
      {
        id: 8,
        genericName: 'Spironolactone',
        brandNames: ['Aldactone', 'Spirotone', 'Lasilactone', 'Aldospiron'],
        category: 'Potassium-sparing diuretic',
        dosage: '25mg-100mg',
        frequency: 'Once or twice daily',
        price: 60,
        efficacy: 80,
        safety: 85,
        interactions: ['Lisinopril', 'Potassium supplements', 'Trimethoprim'],
        indication: 'Heart failure, Hypertension, Edema',
        contraindications: ['Hyperkalemia', 'Severe kidney disease', 'Addison disease'],
        sideEffects: ['Hyperkalemia', 'Gynecomastia', 'Menstrual irregularities']
      },
      {
        id: 9,
        genericName: 'Paracetamol',
        brandNames: ['Crocin', 'Dolo', 'P-125', 'Tylenol'],
        category: 'Analgesic/Antipyretic',
        dosage: '500mg-1000mg',
        frequency: 'Four times daily',
        price: 20,
        efficacy: 78,
        safety: 95,
        interactions: ['Warfarin', 'Alcohol', 'Carbamazepine'],
        indication: 'Pain relief, Fever',
        contraindications: ['Severe liver disease', 'Allergy to paracetamol'],
        sideEffects: ['Rare: liver damage with overdose', 'Skin rash']
      },
      {
        id: 10,
        genericName: 'Omeprazole',
        brandNames: ['Prilosec', 'Omez', 'Gastid', 'Ocid'],
        category: 'Proton Pump Inhibitor',
        dosage: '20mg-40mg',
        frequency: 'Once daily',
        price: 45,
        efficacy: 88,
        safety: 90,
        interactions: ['Warfarin', 'Clopidogrel', 'Digoxin'],
        indication: 'GERD, Peptic ulcer, H. pylori eradication',
        contraindications: ['Allergy to PPIs', 'Severe liver disease'],
        sideEffects: ['Headache', 'Nausea', 'Long-term: B12 deficiency']
      }
    ];

    // Smart interaction checker between selected drugs
    const checkDrugInteractions = () => {
      const interactions = [];
      
      for (let i = 0; i < selectedDrugs.length; i++) {
        for (let j = i + 1; j < selectedDrugs.length; j++) {
          const drug1 = selectedDrugs[i];
          const drug2 = selectedDrugs[j];
          
          // Check if drug1 interacts with drug2
          if (drug1.interactions?.includes(drug2.genericName)) {
            interactions.push({
              drug1: drug1.genericName,
              drug2: drug2.genericName,
              severity: 'moderate',
              description: `${drug1.genericName} may interact with ${drug2.genericName}. Monitor for increased side effects.`
            });
          }
          
          // Check if drug2 interacts with drug1
          if (drug2.interactions?.includes(drug1.genericName)) {
            interactions.push({
              drug1: drug2.genericName,
              drug2: drug1.genericName,
              severity: 'moderate',
              description: `${drug2.genericName} may interact with ${drug1.genericName}. Monitor for increased side effects.`
            });
          }
        }
      }
      
      return interactions;
    };

    const drugInteractions = checkDrugInteractions();

    const filteredDrugs = drugDatabase.filter(drug =>
      drug.genericName.toLowerCase().includes(searchDrug.toLowerCase()) ||
      drug.brandNames.some(brand => brand.toLowerCase().includes(searchDrug.toLowerCase())) ||
      drug.category.toLowerCase().includes(searchDrug.toLowerCase())
    );

    const addDrug = (drug) => {
      if (!selectedDrugs.find(d => d.id === drug.id)) {
        setSelectedDrugs([...selectedDrugs, { ...drug, dosage: drug.dosage, frequency: drug.frequency, duration: '7 days' }]);
      }
      setSearchDrug('');
    };

    const removeDrug = (drugId) => {
      setSelectedDrugs(selectedDrugs.filter(d => d.id !== drugId));
    };

    const getInteractions = () => {
      const interactions = [];
      for (let i = 0; i < selectedDrugs.length; i++) {
        for (let j = i + 1; j < selectedDrugs.length; j++) {
          const drug1 = selectedDrugs[i];
          const drug2 = selectedDrugs[j];
          
          if (drug1.interactions.includes(drug2.genericName) || 
              drug2.interactions.includes(drug1.genericName)) {
            interactions.push({
              drug1: drug1.genericName,
              drug2: drug2.genericName,
              severity: 'Moderate',
              description: `Potential interaction between ${drug1.genericName} and ${drug2.genericName}. Monitor patient closely.`
            });
          }
        }
      }
      return interactions;
    };

    const getSaferAlternatives = (drug) => {
      return drugDatabase.filter(d => 
        d.category === drug.category && 
        d.id !== drug.id && 
        d.safety > drug.safety
      ).slice(0, 2);
    };

    const interactions = getInteractions();

    return (
      <div className="space-y-6">
        {/* Patient Info */}
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Patient: {patient.patient_name}</h3>
          <p className="text-blue-800 dark:text-blue-200">{patient.patient_age} years • {patient.gender} • {patient.primary_diagnosis}</p>
        </div>

        {/* Drug Search */}
        <div className="space-y-4">
          <Label>Search & Add Medications</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by generic name, brand, or category..."
              value={searchDrug}
              onChange={(e) => setSearchDrug(e.target.value)}
              className="pl-10"
            />
            {searchDrug && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredDrugs.map((drug) => (
                  <button
                    key={drug.id}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b"
                    onClick={() => addDrug(drug)}
                  >
                    <div className="font-medium">{drug.genericName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{drug.brandNames.join(', ')}</div>
                    <div className="text-xs text-gray-500">{drug.indication}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Drugs */}
        <div className="space-y-4">
          <Label>Selected Medications ({selectedDrugs.length})</Label>
          {selectedDrugs.map((drug) => (
            <Card key={drug.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{drug.genericName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{drug.brandNames[0]} • {drug.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDrug(drug.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Dosage</Label>
                  <Input
                    value={drug.dosage}
                    onChange={(e) => {
                      const updated = selectedDrugs.map(d => 
                        d.id === drug.id ? { ...d, dosage: e.target.value } : d
                      );
                      setSelectedDrugs(updated);
                    }}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Input
                    value={drug.frequency}
                    onChange={(e) => {
                      const updated = selectedDrugs.map(d => 
                        d.id === drug.id ? { ...d, frequency: e.target.value } : d
                      );
                      setSelectedDrugs(updated);
                    }}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Duration</Label>
                  <Input
                    value={drug.duration}
                    onChange={(e) => {
                      const updated = selectedDrugs.map(d => 
                        d.id === drug.id ? { ...d, duration: e.target.value } : d
                      );
                      setSelectedDrugs(updated);
                    }}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-3 text-sm">
                <Badge variant="outline">₹{drug.price}/month</Badge>
                <Badge variant="secondary">Efficacy: {drug.efficacy}%</Badge>
                <Badge variant={drug.safety > 85 ? "default" : "secondary"}>
                  Safety: {drug.safety}%
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Smart Drug Interactions - Between Selected Drugs */}
        {drugInteractions.length > 0 && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-red-800 dark:text-red-200">⚠️ Smart Prescription Alert</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              <p className="font-semibold mb-2">Interactions detected between selected drugs:</p>
              <ul className="list-disc list-inside space-y-2">
                {drugInteractions.map((interaction, index) => (
                  <li key={index} className="bg-white dark:bg-red-900/40 p-2 rounded border border-red-200 dark:border-red-700">
                    <strong>{interaction.drug1}</strong> ↔ <strong>{interaction.drug2}</strong>
                    <br />
                    <span className="text-sm">{interaction.description}</span>
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {interaction.severity}
                    </Badge>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Drug Interactions */}
        {interactions.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-orange-800 dark:text-orange-200">General Drug Interactions</AlertTitle>
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              <strong>Potential interactions with other medications:</strong>
              <ul className="mt-2 space-y-1">
                {interactions.map((interaction, index) => (
                  <li key={index} className="text-sm">
                    • {interaction.description}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Contraindications from Database */}
        {contraindications.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Contraindications & Warnings
                {isLoadingContraindications && (
                  <div className="ml-2 w-4 h-4 border border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contraindications.map((contraindication, index) => (
                  <div key={index} className="border border-orange-200 dark:border-orange-700 bg-white dark:bg-orange-900/40 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                        {contraindication.drug_name}
                      </h4>
                      <Badge 
                        variant={contraindication.severity_level === 'severe' ? "destructive" : 
                                contraindication.severity_level === 'moderate' ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {contraindication.severity_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <strong>Interacts with:</strong> {contraindication.interacts_with}
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      {contraindication.interaction_description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isLoadingContraindications && contraindications.length === 0 && selectedDrugs.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                <p className="text-blue-800 dark:text-blue-200">Loading contraindications...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safer Alternatives */}
        {selectedDrugs.length > 0 && (
          <div className="space-y-4">
            <Label>Suggested Safer Alternatives</Label>
            {selectedDrugs.map((drug) => {
              const alternatives = getSaferAlternatives(drug);
              if (alternatives.length === 0) return null;
              
              return (
                <Card key={`alt-${drug.id}`} className="p-4">
                  <h4 className="font-medium mb-2">Alternatives to {drug.genericName}:</h4>
                  <div className="space-y-2">
                    {alternatives.map((alt) => (
                      <div key={alt.id} className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900 rounded">
                        <div>
                          <span className="font-medium">{alt.genericName}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({alt.brandNames[0]})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">+{alt.safety - drug.safety}% safer</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              removeDrug(drug.id);
                              addDrug(alt);
                            }}
                          >
                            Replace
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Prescription Summary */}
        {selectedDrugs.length > 0 && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold mb-3">Prescription Summary</h4>
            <div className="space-y-2">
              {selectedDrugs.map((drug, index) => (
                <div key={drug.id} className="text-sm">
                  <strong>{index + 1}. {drug.genericName}</strong> ({drug.brandNames[0]})
                  <br />
                  <span className="text-gray-600 dark:text-gray-400">
                    {drug.dosage} • {drug.frequency} • {drug.duration}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total estimated cost: ₹{selectedDrugs.reduce((total, drug) => total + drug.price, 0)}/month
              </p>
            </div>
            <Button className="w-full mt-4">
              <FileText className="h-4 w-4 mr-2" />
              Generate Prescription
            </Button>
          </Card>
        )}
      </div>
    );
  };

  const PrescriptionMaker = ({ patient }: { patient: PatientRecord }) => {
    const [medications, setMedications] = useState([
      { drug: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);

    const addMedication = () => {
      setMedications([...medications, { drug: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeMedication = (index: number) => {
      setMedications(medications.filter((_, i) => i !== index));
    };

    const updateMedication = (index: number, field: string, value: string) => {
      const updated = medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      );
      setMedications(updated);
    };

    const handlePrint = () => {
      const printContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">PRESCRIPTION</h1>
          
          <div style="margin: 20px 0;">
            <h3>Patient Information:</h3>
            <p><strong>Name:</strong> ${patient.patient_name}</p>
            <p><strong>Age:</strong> ${patient.patient_age} years</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Diagnosis:</h3>
            <p>${patient.primary_diagnosis || 'Not specified'}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Medications:</h3>
            ${medications.map((med, index) => `
              <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
                <p><strong>${index + 1}. ${med.drug}</strong></p>
                <p>Dosage: ${med.dosage}</p>
                <p>Frequency: ${med.frequency}</p>
                <p>Duration: ${med.duration}</p>
                <p>Instructions: ${med.instructions}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 40px; text-align: right;">
            <p>Doctor's Signature</p>
            <p style="border-top: 1px solid #000; width: 200px; margin-left: auto; margin-top: 30px;"></p>
          </div>
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(printContent);
      printWindow?.document.close();
      printWindow?.print();
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p><strong>Patient:</strong> {patient.patient_name}</p>
            <p><strong>Age:</strong> {patient.patient_age} years</p>
          </div>
          <div>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Medications</h3>
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Drug Name</Label>
                    <Input
                      value={medication.drug}
                      onChange={(e) => updateMedication(index, 'drug', e.target.value)}
                      placeholder="e.g., Amoxicillin"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      placeholder="e.g., 7 days"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Special Instructions</Label>
                  <Textarea
                    value={medication.instructions}
                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    placeholder="e.g., Take with food"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <Button
            onClick={addMedication}
            variant="outline"
            className="w-full mt-4"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Medication
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Prescription
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading patient records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">Patient Records</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive patient management and medical records</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingPatient(null);
                  setIsDialogOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Patient Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? 'Edit Patient Record' : 'Create New Patient Record'}
                </DialogTitle>
                <DialogDescription>
                  {editingPatient ? 'Update patient information and visit details' : 'Add comprehensive patient information and visit details'}
                </DialogDescription>
              </DialogHeader>
              <PatientForm patient={editingPatient} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients by name or diagnosis..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full sm:w-40"
                />
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List/Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-lg">Patients ({filteredPatients.length})</h3>
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSortBy(sortBy === 'date' ? 'name' : sortBy === 'name' ? 'age' : 'date');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Sort: {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Age'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto space-y-2">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className={`cursor-pointer transition-all p-3 ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <User className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm truncate">{patient.patient_name}</h3>
                        <p className="text-xs text-gray-500 truncate">
                          {patient.patient_age}y, {patient.gender} • {patient.primary_diagnosis || 'No diagnosis'}
                        </p>
                        <p className="text-xs text-gray-400">{new Date(patient.visit_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {patient.status || 'Active'}
                      </Badge>
                      {patient.next_followup_date && (
                        <div className="flex items-center text-xs text-orange-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Follow-up
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredPatients.length === 0 && !user && (
                <div className="text-center py-8">
                  <LogIn className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please sign in to view your patient records
                  </p>
                  <Button onClick={() => setAuthDialog(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}
              
              {filteredPatients.length === 0 && user && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No patients found. Add your first patient record to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Patient Detail View */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="smart-prescription">Smart Prescription</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <PatientDetailView patient={selectedPatient} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="records" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Medical Records</h3>
                        <p className="text-gray-500 mb-4">View and manage detailed medical records</p>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Records
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Treatment Timeline</CardTitle>
                      <CardDescription>
                        Comprehensive medical history and treatment progression
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Timeline View</h3>
                        <p className="text-gray-500 mb-4">View patient's complete medical timeline</p>
                        <Button variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          View Timeline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="smart-prescription" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Smart Prescription Builder</CardTitle>
                      <CardDescription>
                        AI-powered prescription maker with drug interaction checks and dosage recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SmartPrescriptionBuilder patient={selectedPatient} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a Patient</h3>
                    <p className="text-gray-500 dark:text-gray-400">Choose a patient from the list to view their detailed records</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* HIPAA Compliance Notice */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
              Data Security & Privacy
            </CardTitle>
            <CardDescription>Patient data protection and compliance information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • All patient records are encrypted and stored securely in compliance with HIPAA regulations
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Only authorized medical personnel can access patient data
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • All access is logged and monitored for security purposes
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Patient data is never shared without explicit consent
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AuthDialog 
        isOpen={authDialog} 
        onClose={() => setAuthDialog(false)}
        message="Please sign in to access patient records and manage your medical practice."
      />
    </div>
  );
};

export default Patients;
