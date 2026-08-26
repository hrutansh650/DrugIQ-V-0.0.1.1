import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Pill, BarChart3, Users, Brain, User, MessageCircle, CreditCard, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Activity } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerSections = [{
    title: "Main Features",
    links: [{
      name: "Home",
      href: "/",
      icon: Home
    }, {
      name: "Drug Index",
      href: "/drugs",
      icon: Pill
    }, {
      name: "Categories",
      href: "/categories",
      icon: BarChart3
    }, {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3
    }, {
      name: "Patients",
      href: "/patients",
      icon: Users
    }, {
      name: "Smart Recommendations",
      href: "/smart-recommendation",
      icon: Brain
    }]
  }, {
    title: "Account & Support",
    links: [{
      name: "Profile",
      href: "/profile",
      icon: User
    }, {
      name: "Activity Saved",
      href: "/profile",
      icon: Activity
    }, {
      name: "Pricing",
      href: "/pricing",
      icon: CreditCard
    }, {
      name: "Help Center",
      href: "#",
      icon: MessageCircle
    }]
  }, {
    title: "Resources",
    links: [{
      name: "Drug Database",
      href: "/drugs",
      icon: Pill
    }, {
      name: "Medical Categories",
      href: "/categories",
      icon: BarChart3
    }, {
      name: "Prescription Analytics",
      href: "/analytics",
      icon: BarChart3
    }, {
      name: "Patient Management",
      href: "/patients",
      icon: Users
    }]
  }];
  return <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg flex items-center justify-center">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">DrugIQ</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Comprehensive drug information and analytics platform for healthcare professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => <li key={linkIndex}>
                    <Link to={link.href} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <span>drugiq.pharmhub@gmail.com</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mx-[58px]">
              <Phone className="h-4 w-4 mr-2" />
              <span className="my-0 px-0 mx-0">+91 8591923420</span>
            </div>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} drugIQ. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;