
import React, { useState } from 'react';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Brain, 
  Pill, 
  Shield, 
  Zap, 
  Search, 
  Filter, 
  TrendingUp,
  Users,
  Activity,
  ChevronRight,
  Star,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Drug categories with database-integrated data
  const categories = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular',
      icon: Heart,
      color: 'bg-red-500 dark:bg-red-600',
      description: 'Medications for heart and blood vessel conditions',
      drugCount: 8,
      subcategories: ['ACE Inhibitors', 'Beta Blockers', 'Calcium Channel Blockers', 'Diuretics', 'Statins'],
      commonDrugs: ['Lisinopril', 'Atorvastatin', 'Metoprolol', 'Amlodipine'],
      prescriptionVolume: '+12%'
    },
    {
      id: 'neurological',
      name: 'Neurological',
      icon: Brain,
      color: 'bg-purple-500 dark:bg-purple-600',
      description: 'Drugs affecting the nervous system and brain',
      drugCount: 4,
      subcategories: ['Antidepressants', 'Anticonvulsants', 'Anxiolytics', 'Antipsychotics'],
      commonDrugs: ['Sertraline', 'Gabapentin'],
      prescriptionVolume: '+8%'
    },
    {
      id: 'antibiotics',
      name: 'Antibiotics',
      icon: Shield,
      color: 'bg-green-500 dark:bg-green-600',
      description: 'Antimicrobial medications for infections',
      drugCount: 2,
      subcategories: ['Penicillins', 'Fluoroquinolones'],
      commonDrugs: ['Amoxicillin', 'Ciprofloxacin'],
      prescriptionVolume: '-3%'
    },
    {
      id: 'analgesics',
      name: 'Analgesics',
      icon: Zap,
      color: 'bg-orange-500 dark:bg-orange-600',
      description: 'Pain relief and anti-inflammatory medications',
      drugCount: 3,
      subcategories: ['NSAIDs', 'Acetaminophen'],
      commonDrugs: ['Ibuprofen', 'Acetaminophen'],
      prescriptionVolume: '+15%'
    },
    {
      id: 'diabetes',
      name: 'Antidiabetic',
      icon: Activity,
      color: 'bg-blue-500 dark:bg-blue-600',
      description: 'Medications for diabetes management',
      drugCount: 1,
      subcategories: ['Metformin', 'Insulin'],
      commonDrugs: ['Metformin'],
      prescriptionVolume: '+22%'
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      icon: Users,
      color: 'bg-teal-500 dark:bg-teal-600',
      description: 'Medications for respiratory conditions',
      drugCount: 3,
      subcategories: ['Bronchodilators', 'Corticosteroids'],
      commonDrugs: ['Albuterol', 'Prednisone'],
      prescriptionVolume: '+5%'
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CategoryCard = ({ category, detailed = false }) => (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
              <category.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">{category.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {category.drugCount} drugs available
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
        
        {detailed && (
          <div className="space-y-4">
            {/* Prescription Volume */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prescription Volume</span>
              <Badge 
                variant={category.prescriptionVolume.includes('+') ? 'default' : 'secondary'}
                className={category.prescriptionVolume.includes('+') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}
              >
                {category.prescriptionVolume}
              </Badge>
            </div>

            {/* Common Drugs */}
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Common Drugs</span>
              <div className="flex flex-wrap gap-2">
                {category.commonDrugs.map((drug, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {drug}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Subcategories</span>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.slice(0, 3).map((sub, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {sub}
                  </Badge>
                ))}
                {category.subcategories.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    +{category.subcategories.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Drug Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive collection of medication categories with detailed information and prescription analytics
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Sort by
              </Button>
            </div>
          </div>
        </div>

        {/* Category Views */}
        <Tabs defaultValue="grid" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="grid" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Grid View</TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Detailed View</TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </TabsContent>

          {/* Detailed View */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} detailed={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {categories.reduce((sum, cat) => sum + cat.drugCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Drugs</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                21
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Database Drugs</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
