import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Pill, BarChart3, Users, Brain, Shield, Zap, Globe, ChevronRight, Star, User, Settings, LogIn } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
const Index = () => {
  const {
    user
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const features = [{
    icon: Search,
    title: "Comprehensive Drug Search",
    description: "Search through thousands of medications with detailed information including dosage, interactions, and side effects.",
    color: "bg-blue-500"
  }, {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track prescribing patterns, drug utilization, and clinical outcomes with powerful analytics tools.",
    color: "bg-green-500"
  }, {
    icon: Users,
    title: "Patient Management",
    description: "Manage patient records, track medication history, and generate comprehensive reports.",
    color: "bg-purple-500"
  }, {
    icon: Brain,
    title: "Smart Recommendations",
    description: "Get intelligent drug recommendations based on patient history and clinical best practices.",
    color: "bg-pink-500"
  }, {
    icon: Shield,
    title: "Safety Monitoring",
    description: "Real-time safety alerts, drug interaction warnings, and adverse event tracking.",
    color: "bg-orange-500"
  }, {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Lightning-fast search and data retrieval with 99.9% uptime guarantee.",
    color: "bg-yellow-500"
  }];
  const stats = [{
    number: "50,000+",
    label: "Drugs in Database"
  }, {
    number: "500+",
    label: "Medical Categories"
  }, {
    number: "10,000+",
    label: "Healthcare Professionals"
  }, {
    number: "99.9%",
    label: "Uptime Guarantee"
  }];
  const testimonials = [{
    name: "Dr. Joydeep Chatterjee",
    role: "MBBS MS, Practicing Surgeon",
    rating: 4,
    comment: "I am a practicing surgeon at Badlapur, with over 20 years of experience. I just came across this particular app, Drug IQ. I think it's going to be useful for our daily practice as a general practitioner and as a consultant. I think this is going to be helpful for all the doctors who are in practice."
  }, {
    name: "Dr. Ganpat Vishwas Rao",
    role: "BHMS",
    rating: 5,
    comment: "DrugIQ is a game-changer for doctors like me. Its doctor-friendly interface and reliable drug interaction insights will help me prescribe safely and confidently. The prescription maker and patient record features have streamlined my practice. A must-have for every modern clinic."
  }, {
    name: "Dr. Somnath Lamture",
    role: "MBBS MS, General Surgeon and Diabetologist",
    rating: 5,
    comment: "The comprehensive drug database and advanced features make this an essential tool for modern medical practice."
  }];
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 dark:from-purple-800 dark:via-blue-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-6 md:text-6xl">Smarter Drug Decisions for Doctors</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">Access detailed drug information, manage patients, and get Smart  recommendations all in one platform designed for healthcare professionals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/drugs">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Explore Drug Database
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {user ? <Link to="/profile">
                  <Button size="lg" variant="outline" className="border-white hover:bg-white/10 px-8 py-3 text-lg text-gray-950">
                    <User className="mr-2 h-5 w-5" />
                    View Profile
                  </Button>
                </Link> : <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white hover:bg-white/10 px-8 py-3 text-lg text-zinc-950">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </Link>}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
      </div>

      {/* Stats Section */}
      

      {/* Drug Information Display */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Drug Information
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Quick access to essential drug data from our comprehensive database
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            name: 'Metformin',
            category: 'Antidiabetic',
            indication: 'Type 2 Diabetes',
            dosage: '500-1000mg',
            frequency: 'Twice daily',
            safety: 90,
            cost: '₹45/month',
            genericBrands: ['Glycomet', 'Glucophage', 'Glyciphage', 'Metsmall']
          }, {
            name: 'Amlodipine',
            category: 'Antihypertensive',
            indication: 'Hypertension',
            dosage: '5-10mg',
            frequency: 'Once daily',
            safety: 85,
            cost: '₹35/month',
            genericBrands: ['Amlong', 'Stamlo', 'Amlip', 'Norvasc']
          }, {
            name: 'Atorvastatin',
            category: 'Statin',
            indication: 'High Cholesterol',
            dosage: '10-80mg',
            frequency: 'Once daily',
            safety: 82,
            cost: '₹120/month',
            genericBrands: ['Lipitor', 'Atorva', 'Storvas', 'Tonact']
          }, {
            name: 'Lisinopril',
            category: 'ACE Inhibitor',
            indication: 'Hypertension',
            dosage: '10-40mg',
            frequency: 'Once daily',
            safety: 88,
            cost: '₹50/month',
            genericBrands: ['Listril', 'Lisicard', 'Prinivil', 'Zestril']
          }, {
            name: 'Omeprazole',
            category: 'PPI',
            indication: 'GERD, Ulcers',
            dosage: '20-40mg',
            frequency: 'Once daily',
            safety: 85,
            cost: '₹40/month',
            genericBrands: ['Omez', 'Prilosec', 'Ocid', 'Omecip']
          }, {
            name: 'Amoxicillin',
            category: 'Antibiotic',
            indication: 'Bacterial Infections',
            dosage: '500mg',
            frequency: 'Three times daily',
            safety: 88,
            cost: '₹25/course',
            genericBrands: ['Novamox', 'Amoxil', 'Biomox', 'Polymox']
          }].map((drug, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{drug.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{drug.category}</Badge>
                    </div>
                    <Badge variant={drug.safety > 85 ? "default" : "secondary"}>
                      {drug.safety}% Safe
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Indication:</span>
                      <span className="font-medium">{drug.indication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dosage:</span>
                      <span>{drug.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                      <span>{drug.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                      <span className="font-semibold text-green-600">{drug.cost}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-600 dark:text-gray-400 text-xs">Generic Brands:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {drug.genericBrands.slice(0, 3).map((brand, brandIndex) => <Badge key={brandIndex} variant="outline" className="text-xs">
                            {brand}
                          </Badge>)}
                        {drug.genericBrands.length > 3 && <Badge variant="outline" className="text-xs">
                            +{drug.genericBrands.length - 3} more
                          </Badge>}
                      </div>
                    </div>
                  </div>
                  <Link to="/drugs" className="block mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Healthcare Professionals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to make informed decisions about patient care and medication management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what doctors are saying about MedIndex
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust MedIndex for their drug information needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white hover:bg-white/10 px-8 py-3 text-lg text-purple-700">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Index;