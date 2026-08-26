
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Pill, 
  FolderOpen, 
  BarChart3, 
  Users, 
  User,
  Brain,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, profile, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/drugs', label: 'Drugs', icon: Pill },
    { path: '/categories', label: 'Categories', icon: FolderOpen },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-black border-b border-purple-700/30 dark:border-gray-700 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Website Name/Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 dark:from-purple-600 dark:to-blue-600 bg-clip-text text-transparent">
            Drug<span className="text-white dark:text-gray-800">IQ</span>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    isActive 
                      ? "bg-pink-500/20 text-pink-300 dark:bg-purple-600/20 dark:text-purple-300 border border-pink-500/30 dark:border-purple-500/30" 
                      : "text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          
          {/* Auth Buttons */}
          <div className="ml-4 flex items-center space-x-2">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Links - Tablet */}
        <div className="hidden md:flex lg:hidden items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`flex items-center justify-center transition-all duration-200 px-2 ${
                    isActive 
                      ? "bg-pink-500/20 text-pink-300 dark:bg-purple-600/20 dark:text-purple-300 border border-pink-500/30 dark:border-purple-500/30" 
                      : "text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                  }`}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </Link>
            );
          })}
          
          {/* Auth Button */}
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                title="Sign In"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button and Auth */}
        <div className="md:hidden flex items-center space-x-2">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-white/10"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                title="Sign In"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-white/10">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Hidden by default, can be toggled */}
      <div className="md:hidden mt-3 pt-3 border-t border-purple-700/30 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`w-full flex items-center space-x-2 justify-start transition-all duration-200 ${
                    isActive 
                      ? "bg-pink-500/20 text-pink-300 dark:bg-purple-600/20 dark:text-purple-300 border border-pink-500/30 dark:border-purple-500/30" 
                      : "text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
