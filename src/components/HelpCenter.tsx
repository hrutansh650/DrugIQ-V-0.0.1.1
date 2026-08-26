
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  BookOpen, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const HelpCenter = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn how to navigate DrugIQ and make the most of our features",
      icon: BookOpen
    },
    {
      title: "Drug Search",
      description: "How to search and filter drugs effectively",
      icon: HelpCircle
    },
    {
      title: "AI Recommendations",
      description: "Understanding our smart recommendation system",
      icon: MessageCircle
    },
    {
      title: "Patient Management",
      description: "Managing patient notes and medication plans",
      icon: HelpCircle
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">8591923420</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@drugiq.org</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Help Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpTopics.map((topic, index) => {
              const IconComponent = topic.icon;
              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-medium">{topic.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{topic.description}</p>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                        Learn more <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;
