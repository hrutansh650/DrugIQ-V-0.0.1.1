
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  X, 
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Users,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const DrugComparison = () => {
  const [selectedDrugs, setSelectedDrugs] = useState(['Metformin', 'Insulin']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Categories data from Categories page
  const categoriesData = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular', 
      drugs: ['Lisinopril', 'Atorvastatin', 'Metoprolol', 'Amlodipine', 'Ramipril', 'Bisoprolol', 'Valsartan', 'Telmisartan']
    },
    {
      id: 'neurological',
      name: 'Neurological',
      drugs: ['Sertraline', 'Gabapentin', 'Lorazepam', 'Risperidone']
    },
    {
      id: 'antibiotics',
      name: 'Antibiotics',
      drugs: ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Cephalexin']
    },
    {
      id: 'analgesics',
      name: 'Analgesics',
      drugs: ['Ibuprofen', 'Acetaminophen', 'Morphine', 'Tramadol']
    },
    {
      id: 'diabetes',
      name: 'Antidiabetic',
      drugs: ['Metformin', 'Insulin', 'Glipizide', 'Sitagliptin']
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      drugs: ['Albuterol', 'Prednisone', 'Loratadine', 'Guaifenesin']
    }
  ];

  // Extract all drugs from categories
  const drugDatabase = categoriesData.flatMap(category => category.drugs);

  const filteredDrugs = drugDatabase.filter(drug => 
    drug.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedDrugs.includes(drug)
  );

  // Generate comprehensive dummy data for drug comparison
  const generateDrugData = (drugName) => {
    // Find which category this drug belongs to
    const drugCategory = categoriesData.find(cat => cat.drugs.includes(drugName))?.name || 'Other';
    
    return {
      name: drugName,
      category: drugCategory,
    efficacy: Math.floor(Math.random() * 20) + 75,
    safety: Math.floor(Math.random() * 15) + 80,
    tolerability: Math.floor(Math.random() * 20) + 70,
    costEffectiveness: Math.floor(Math.random() * 25) + 65,
    patientSatisfaction: Math.floor(Math.random() * 20) + 75,
    prescriptionVolume: Math.floor(Math.random() * 5000) + 8000,
    sideEffects: Math.floor(Math.random() * 15) + 10,
    drugInteractions: Math.floor(Math.random() * 20) + 15,
    dosageFlexibility: Math.floor(Math.random() * 25) + 70,
    onsetTime: `${Math.floor(Math.random() * 120) + 30} mins`,
    duration: `${Math.floor(Math.random() * 12) + 4} hours`,
    bioavailability: `${Math.floor(Math.random() * 30) + 60}%`,
    price: `$${(Math.random() * 100 + 20).toFixed(2)}`,
    commonSideEffects: ['Nausea', 'Headache', 'Dizziness', 'Fatigue'].slice(0, Math.floor(Math.random() * 3) + 2),
    contraindications: ['Kidney disease', 'Liver disease', 'Pregnancy'].slice(0, Math.floor(Math.random() * 2) + 1),
    interactions: ['Warfarin', 'Aspirin', 'Alcohol'].slice(0, Math.floor(Math.random() * 2) + 1),
    mechanism: 'Inhibits hepatic glucose production',
    halfLife: `${Math.floor(Math.random() * 8) + 2} hours`,
    metabolism: 'Hepatic',
      excretion: 'Renal'
    };
  };

  const comparisonData = selectedDrugs.map(drug => generateDrugData(drug));

  const radarData = [
    { metric: 'Efficacy', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.efficacy }), {}) },
    { metric: 'Safety', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.safety }), {}) },
    { metric: 'Tolerability', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.tolerability }), {}) },
    { metric: 'Cost-Effectiveness', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.costEffectiveness }), {}) },
    { metric: 'Patient Satisfaction', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.patientSatisfaction }), {}) },
  ];

  const barData = [
    { metric: 'Prescription Volume', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.prescriptionVolume }), {}) },
    { metric: 'Side Effects', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.sideEffects }), {}) },
    { metric: 'Drug Interactions', ...comparisonData.reduce((acc, drug) => ({ ...acc, [drug.name]: drug.drugInteractions }), {}) },
  ];

  const addDrug = (drugName) => {
    if (selectedDrugs.length < 4) {
      setSelectedDrugs([...selectedDrugs, drugName]);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  const removeDrug = (drugName) => {
    setSelectedDrugs(selectedDrugs.filter(drug => drug !== drugName));
  };

  const chartConfig = {
    [selectedDrugs[0]]: {
      label: selectedDrugs[0],
      color: "hsl(var(--chart-1))"
    },
    [selectedDrugs[1]]: {
      label: selectedDrugs[1],
      color: "hsl(var(--chart-2))"
    },
    [selectedDrugs[2]]: {
      label: selectedDrugs[2],
      color: "hsl(var(--chart-3))"
    },
    [selectedDrugs[3]]: {
      label: selectedDrugs[3],
      color: "hsl(var(--chart-4))"
    }
  };

  return (
    <div className="space-y-6">
      {/* Drug Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Drug Selection
          </CardTitle>
          <CardDescription>
            Select up to 4 drugs to compare. Click on a drug to remove it from comparison.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedDrugs.map((drug) => (
              <Badge
                key={drug}
                variant="secondary"
                className="px-3 py-1 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                onClick={() => removeDrug(drug)}
              >
                {drug}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          
          {selectedDrugs.length < 4 && (
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for drugs to add..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {isSearchOpen && (searchTerm || filteredDrugs.length > 0) && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto mt-1">
                  {filteredDrugs.slice(0, 10).map((drug) => (
                    <button
                      key={drug}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => addDrug(drug)}
                    >
                      {drug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedDrugs.length >= 2 && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="efficacy">Efficacy</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="pharmacology">Pharmacology</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>Overall performance metrics across key parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name={selectedDrugs[0]} 
                          dataKey={selectedDrugs[0]} 
                          stroke="hsl(var(--chart-1))" 
                          fill="hsl(var(--chart-1))" 
                          fillOpacity={0.1} 
                        />
                        <Radar 
                          name={selectedDrugs[1]} 
                          dataKey={selectedDrugs[1]} 
                          stroke="hsl(var(--chart-2))" 
                          fill="hsl(var(--chart-2))" 
                          fillOpacity={0.1} 
                        />
                        {selectedDrugs[2] && (
                          <Radar 
                            name={selectedDrugs[2]} 
                            dataKey={selectedDrugs[2]} 
                            stroke="hsl(var(--chart-3))" 
                            fill="hsl(var(--chart-3))" 
                            fillOpacity={0.1} 
                          />
                        )}
                        {selectedDrugs[3] && (
                          <Radar 
                            name={selectedDrugs[3]} 
                            dataKey={selectedDrugs[3]} 
                            stroke="hsl(var(--chart-4))" 
                            fill="hsl(var(--chart-4))" 
                            fillOpacity={0.1} 
                          />
                        )}
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage & Safety Metrics</CardTitle>
                  <CardDescription>Prescription volume and safety indicators</CardDescription>
                </CardHeader>
                <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="metric" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey={selectedDrugs[0]} fill="#8b5cf6" />
                            <Bar dataKey={selectedDrugs[1]} fill="#a855f7" />
                            {selectedDrugs[2] && <Bar dataKey={selectedDrugs[2]} fill="#9333ea" />}
                            {selectedDrugs[3] && <Bar dataKey={selectedDrugs[3]} fill="#7c3aed" />}
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Comparison</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Metric</th>
                        {selectedDrugs.map(drug => (
                          <th key={drug} className="text-left p-2 font-medium">{drug}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Efficacy', key: 'efficacy', suffix: '%' },
                        { label: 'Safety', key: 'safety', suffix: '%' },
                        { label: 'Price', key: 'price', suffix: '' },
                        { label: 'Onset Time', key: 'onsetTime', suffix: '' },
                        { label: 'Duration', key: 'duration', suffix: '' },
                      ].map(metric => (
                        <tr key={metric.key} className="border-b">
                          <td className="p-2 font-medium">{metric.label}</td>
                          {comparisonData.map(drug => (
                            <td key={drug.name} className="p-2">
                              {drug[metric.key]}{metric.suffix}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficacy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisonData.map(drug => (
                <Card key={drug.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {drug.name} - Efficacy Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Overall Efficacy</span>
                        <Badge variant="outline">{drug.efficacy}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Patient Satisfaction</span>
                        <Badge variant="outline">{drug.patientSatisfaction}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Prescription Volume</span>
                        <Badge variant="outline">{drug.prescriptionVolume.toLocaleString()}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Mechanism of Action:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{drug.mechanism}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisonData.map(drug => (
                <Card key={drug.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {drug.name} - Safety Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Safety Score</span>
                        <Badge variant="outline">{drug.safety}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Side Effects</span>
                        <Badge variant="outline">{drug.sideEffects}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Common Side Effects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {drug.commonSideEffects.map(effect => (
                            <Badge key={effect} variant="secondary" className="text-xs">{effect}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Contraindications:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {drug.contraindications.map(contra => (
                            <Badge key={contra} variant="destructive" className="text-xs">{contra}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pharmacology" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisonData.map(drug => (
                <Card key={drug.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      {drug.name} - Pharmacological Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Bioavailability</span>
                        <span className="font-medium">{drug.bioavailability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Half-life</span>
                        <span className="font-medium">{drug.halfLife}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Metabolism</span>
                        <span className="font-medium">{drug.metabolism}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Excretion</span>
                        <span className="font-medium">{drug.excretion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Onset Time</span>
                        <span className="font-medium">{drug.onsetTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="font-medium">{drug.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium">Drug Interactions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {drug.interactions.map(interaction => (
                            <Badge key={interaction} variant="outline" className="text-xs">{interaction}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DrugComparison;
