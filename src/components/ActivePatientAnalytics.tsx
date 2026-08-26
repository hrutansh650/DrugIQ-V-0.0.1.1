
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Filter,
  Activity,
  UserCheck,
  UserPlus,
  Clock
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';

const ActivePatientAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [patientFilter, setPatientFilter] = useState('all');
  const [showGrowthRate, setShowGrowthRate] = useState(true);

  // Generate dummy active patient data based on time range
  const generateActivePatientData = (range) => {
    const dataPoints = {
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
      'custom': 180
    };

    const points = dataPoints[range] || 180;
    const data = [];
    const baseValue = 1200;

    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (points - i));
      
      const seasonalFactor = 1 + 0.1 * Math.sin(i / 30); // Seasonal variation
      const trendFactor = 1 + (i / points) * 0.3; // Growth trend
      const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // Random variation
      
      const activePatients = Math.floor(baseValue * seasonalFactor * trendFactor * randomFactor);
      const newPatients = Math.floor(activePatients * 0.05 * (1 + Math.random() * 0.5));
      const returningPatients = activePatients - newPatients;

      data.push({
        date: date.toISOString().split('T')[0],
        month: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activePatients,
        newPatients,
        returningPatients,
        growthRate: i > 0 ? ((activePatients - data[i-1]?.activePatients) / data[i-1]?.activePatients * 100) : 0
      });
    }

    return data;
  };

  const patientData = generateActivePatientData(timeRange);

  // Calculate summary statistics
  const currentActive = patientData[patientData.length - 1]?.activePatients || 0;
  const previousActive = patientData[patientData.length - 2]?.activePatients || 0;
  const growthRate = ((currentActive - previousActive) / previousActive * 100).toFixed(1);
  const avgGrowthRate = (patientData.reduce((sum, item) => sum + item.growthRate, 0) / patientData.length).toFixed(1);
  const totalNewPatients = patientData.reduce((sum, item) => sum + item.newPatients, 0);

  // Generate demographic breakdown
  const demographicData = [
    { ageGroup: '18-25', patients: 280, percentage: 23 },
    { ageGroup: '26-35', patients: 420, percentage: 35 },
    { ageGroup: '36-45', patients: 350, percentage: 29 },
    { ageGroup: '46-55', patients: 210, percentage: 18 },
    { ageGroup: '56+', patients: 140, percentage: 12 }
  ];

  // Generate specialty breakdown
  const specialtyData = [
    { specialty: 'Cardiology', patients: 340, growth: '+12%' },
    { specialty: 'Diabetes', patients: 280, growth: '+18%' },
    { specialty: 'Neurology', patients: 220, growth: '+8%' },
    { specialty: 'Oncology', patients: 180, growth: '+15%' },
    { specialty: 'Orthopedics', patients: 160, growth: '+5%' }
  ];

  const chartConfig = {
    activePatients: {
      label: "Active Patients",
      color: "hsl(var(--chart-1))"
    },
    newPatients: {
      label: "New Patients",
      color: "hsl(var(--chart-2))"
    },
    returningPatients: {
      label: "Returning Patients",
      color: "hsl(var(--chart-3))"
    },
    growthRate: {
      label: "Growth Rate",
      color: "hsl(var(--chart-4))"
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Patient Analytics Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeRange === 'custom' && (
              <>
                <div>
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="patientFilter">Patient Type</Label>
              <Select value={patientFilter} onValueChange={setPatientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="new">New Patients</SelectItem>
                  <SelectItem value="returning">Returning Patients</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <Button
              variant={showGrowthRate ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrowthRate(!showGrowthRate)}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {showGrowthRate ? 'Hide' : 'Show'} Growth Rate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Patients</p>
                <p className="text-2xl font-bold">{currentActive.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Badge variant={parseFloat(growthRate) > 0 ? "default" : "secondary"} className="text-xs">
                {parseFloat(growthRate) > 0 ? '+' : ''}{growthRate}% from last period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Patients</p>
                <p className="text-2xl font-bold">{totalNewPatients.toLocaleString()}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Badge variant="default" className="text-xs">
                {avgGrowthRate}% avg growth rate
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Returning Patients</p>
                <p className="text-2xl font-bold">{(currentActive - patientData[patientData.length - 1]?.newPatients).toLocaleString()}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                {((currentActive - patientData[patientData.length - 1]?.newPatients) / currentActive * 100).toFixed(1)}% retention
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Daily Growth</p>
                <p className="text-2xl font-bold">{Math.abs(parseFloat(avgGrowthRate))}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">
                Last {timeRange === '1month' ? '30' : timeRange === '3months' ? '90' : '180'} days
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Active Patient Trends
          </CardTitle>
          <CardDescription>
            Patient activity and growth over selected time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="activePatients" 
                  stackId="1" 
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="newPatients" 
                  stackId="2" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.3}
                />
                {showGrowthRate && (
                  <Line 
                    type="monotone" 
                    dataKey="growthRate" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2, r: 3 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
            <CardDescription>Age distribution of active patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demographicData.map((item) => (
                <div key={item.ageGroup} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{item.ageGroup}</span>
                    <Badge variant="outline">{item.patients} patients</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specialty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Patients by Specialty</CardTitle>
            <CardDescription>Distribution across medical specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {specialtyData.map((item) => (
                <div key={item.specialty} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{item.specialty}</span>
                    <Badge variant="outline">{item.patients} patients</Badge>
                  </div>
                  <Badge variant={item.growth.includes('+') ? "default" : "secondary"}>
                    {item.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivePatientAnalytics;
