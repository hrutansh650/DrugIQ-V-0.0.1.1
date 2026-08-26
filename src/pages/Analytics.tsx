import React, { useState } from 'react';
import Footer from '@/components/Footer';
import DrugComparison from '@/components/DrugComparison';
import ActivePatientAnalytics from '@/components/ActivePatientAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrendingUp, Calendar, Filter, Download, AlertTriangle, Search, Clock, Play, Square, Pause, FileText, Activity, ZoomIn, ZoomOut } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart as RechartsBarChart, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Bar, Line, Area, AreaChart } from 'recharts';

const Analytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchDrug, setSearchDrug] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('Metformin');
  const [timelineView, setTimelineView] = useState('3months');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');

  // Drug list from drug index
  const availableDrugs = [
    'Metformin', 'Lisinopril', 'Atorvastatin', 'Amlodipine', 'Omeprazole',
    'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Simvastatin'
  ];

  const filteredDrugs = availableDrugs.filter(drug => 
    drug.toLowerCase().includes(searchDrug.toLowerCase())
  );

  // Generate drug-specific trend data
  const generateDrugTrendData = (drugName: string) => {
    const baseValue = Math.floor(Math.random() * 5000) + 8000;
    return [
      { month: 'Jan', prescriptions: baseValue + Math.floor(Math.random() * 1000) },
      { month: 'Feb', prescriptions: baseValue + Math.floor(Math.random() * 1000) },
      { month: 'Mar', prescriptions: baseValue + Math.floor(Math.random() * 1000) },
      { month: 'Apr', prescriptions: baseValue + Math.floor(Math.random() * 1000) },
      { month: 'May', prescriptions: baseValue + Math.floor(Math.random() * 1000) },
      { month: 'Jun', prescriptions: baseValue + Math.floor(Math.random() * 1000) }
    ];
  };

  const drugUsageData = generateDrugTrendData(selectedDrug);

  // Top prescribed drugs by category
  const topDrugsData = [{
    drug: 'Metformin',
    prescriptions: 8500,
    category: 'Antidiabetic',
    change: '+12%'
  }, {
    drug: 'Lisinopril',
    prescriptions: 7200,
    category: 'ACE Inhibitor',
    change: '+8%'
  }, {
    drug: 'Atorvastatin',
    prescriptions: 6800,
    category: 'Statin',
    change: '+5%'
  }, {
    drug: 'Amlodipine',
    prescriptions: 6200,
    category: 'Calcium Channel Blocker',
    change: '+15%'
  }, {
    drug: 'Omeprazole',
    prescriptions: 5900,
    category: 'PPI',
    change: '-3%'
  }];

  // Side effect reports by drug category
  const sideEffectData = [{
    category: 'Cardiovascular',
    reports: 89,
    severity: 'Moderate'
  }, {
    category: 'Antibiotics',
    reports: 156,
    severity: 'Mild'
  }, {
    category: 'Analgesics',
    reports: 203,
    severity: 'Moderate'
  }, {
    category: 'Antidiabetic',
    reports: 67,
    severity: 'Mild'
  }, {
    category: 'Psychiatric',
    reports: 134,
    severity: 'Severe'
  }];

  // Drug comparison data
  const comparisonData = [{
    metric: 'Efficacy',
    drugA: 85,
    drugB: 78
  }, {
    metric: 'Safety',
    drugA: 92,
    drugB: 88
  }, {
    metric: 'Cost',
    drugA: 65,
    drugB: 82
  }, {
    metric: 'Patient Satisfaction',
    drugA: 79,
    drugB: 84
  }];
  const chartConfig = {
    prescriptions: {
      label: "Prescriptions",
      color: "hsl(var(--chart-1))"
    }
  };

  // Treatment Timeline Data
  const generateTimelineData = () => {
    const patients = [
      { id: 'P001', name: 'John Doe', age: 45 },
      { id: 'P002', name: 'Jane Smith', age: 62 },
      { id: 'P003', name: 'Mike Johnson', age: 38 }
    ];

    const medications = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Amlodipine', 'Omeprazole'];
    const events = [];

    patients.forEach(patient => {
      // Generate 3-5 medication events per patient
      const numEvents = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numEvents; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
        const duration = Math.floor(Math.random() * 30) + 7; // 7-37 days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        events.push({
          id: `${patient.id}-${i}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'medication',
          drug: medications[Math.floor(Math.random() * medications.length)],
          startDate,
          endDate,
          status: Math.random() > 0.7 ? 'stopped' : 'active',
          reason: Math.random() > 0.8 ? 'adverse_event' : 'treatment',
          dosage: '10mg',
          outcome: Math.random() > 0.3 ? 'effective' : 'moderate'
        });
      }

      // Add lab results
      for (let i = 0; i < 3; i++) {
        const labDate = new Date();
        labDate.setDate(labDate.getDate() - Math.floor(Math.random() * 90));
        events.push({
          id: `${patient.id}-lab-${i}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'lab_result',
          description: ['HbA1c', 'Lipid Panel', 'Liver Function'][i],
          date: labDate,
          result: Math.random() > 0.2 ? 'normal' : 'abnormal'
        });
      }
    });

    return events.sort((a, b) => {
      const dateA = a.startDate || a.date;
      const dateB = b.startDate || b.date;
      return dateA.getTime() - dateB.getTime();
    });
  };

  const timelineData = generateTimelineData();

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Centered and responsive */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Drug Analytics Dashboard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive insights into drug usage patterns and prescribing analytics</p>
        </div>

        {/* Filters with Drug Search - Centered with proper spacing */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Drug Search */}
            <div className="flex items-center gap-2 relative">
              <Label htmlFor="drugSearch" className="font-medium">Select Drug:</Label>
              <div className="relative">
                <Input
                  id="drugSearch"
                  type="text"
                  placeholder="Search drugs..."
                  value={searchDrug}
                  onChange={(e) => setSearchDrug(e.target.value)}
                  className="w-40 pr-8"
                />
                <Search className="h-4 w-4 absolute right-2 top-2.5 text-gray-400" />
                {searchDrug && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                    {filteredDrugs.map((drug) => (
                      <button
                        key={drug}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setSelectedDrug(drug);
                          setSearchDrug('');
                        }}
                      >
                        {drug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-3 py-2 bg-pink-100 text-pink-700 rounded-md text-sm font-medium">
                {selectedDrug}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="timeRange" className="font-medium">Time Range:</Label>
              <select id="timeRange" value={selectedTimeRange} onChange={e => setSelectedTimeRange(e.target.value)} className="border rounded-md px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="category" className="font-medium">Category:</Label>
              <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border rounded-md px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Categories</option>
                <option value="cardiovascular">Cardiovascular</option>
                <option value="antibiotics">Antibiotics</option>
                <option value="analgesics">Analgesics</option>
              </select>
            </div>
            <Button variant="outline" size="sm" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards - Centered grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-gray-900">1,247</div>
              <p className="text-sm text-purple-600 mt-1">+5.2% from last period</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Drug Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-gray-900">156</div>
              <p className="text-sm text-green-600 mt-1">+3.1% from last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs - Centered */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="patients" className="text-xs sm:text-sm">Patients</TabsTrigger>
              <TabsTrigger value="drug-compare" className="text-xs sm:text-sm">Drug Compare</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Drug Usage Trends */}
                <Card className="shadow-sm w-full">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-base sm:text-lg">{selectedDrug} Usage Trends (6 Months)</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Monthly prescription volumes for {selectedDrug}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 sm:px-6">
                    <ChartContainer config={chartConfig} className="h-64 sm:h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={drugUsageData} margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10
                      }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={value => `${value / 1000}k`} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="prescriptions" stroke="#3b82f6" strokeWidth={2} dot={{
                          fill: '#3b82f6',
                          strokeWidth: 2,
                          r: 3
                        }} name="Prescriptions" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Top Prescribed Drugs */}
                <Card className="shadow-sm w-full">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-base sm:text-lg">Top Prescribed Drugs</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Most frequently prescribed medications this period</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 sm:px-6">
                    <div className="space-y-3">
                      {topDrugsData.map((drug, index) => <div key={drug.drug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-600 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{drug.drug}</div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate">{drug.category}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-bold text-gray-900 text-sm sm:text-base">{drug.prescriptions.toLocaleString()}</div>
                            <Badge variant={drug.change.includes('+') ? 'default' : 'secondary'} className="text-xs">
                              {drug.change}
                            </Badge>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Timeline Feature Moved</CardTitle>
                  <CardDescription>
                    The Drug Record Treatment Timeline has been moved to the Patient Records section for better integration with patient data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      You can now find the interactive treatment timeline in the Patient Records page under each patient's record.
                    </p>
                    <Button onClick={() => window.location.href = '/patients'}>
                      Go to Patient Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="space-y-6">
              <ActivePatientAnalytics />
            </TabsContent>

            <TabsContent value="drug-compare" className="space-y-6">
              <DrugComparison />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>;
};

export default Analytics;
