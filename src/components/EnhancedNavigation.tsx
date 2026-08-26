import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Pill, FolderOpen, BarChart3, Users, User, Brain, LogOut, LogIn, Menu, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
const EnhancedNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const {
    user,
    profile,
    userRole,
    signOut,
    isAdmin
  } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };
  const navItems = [{
    path: '/',
    label: 'Home',
    icon: Home
  }, {
    path: '/drugs',
    label: 'Drugs',
    icon: Pill
  }, {
    path: '/categories',
    label: 'Categories',
    icon: FolderOpen
  }, {
    path: '/analytics',
    label: 'Analytics',
    icon: BarChart3
  }, {
    path: '/patients',
    label: 'Patients',
    icon: Users
  }];

  // Add admin-only items
  if (isAdmin()) {
    navItems.push({
      path: '/admin',
      label: 'Admin',
      icon: Shield
    });
  }
  const UserDropdown = () => <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={profile?.full_name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile?.full_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.specialty || 'Medical Professional'}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              Role: {userRole}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin() && <DropdownMenuItem asChild>
            <Link to="/admin" className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
  return <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-black border-b border-purple-700/30 dark:border-gray-700 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Website Name/Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 dark:from-purple-600 dark:to-blue-600 bg-clip-text text-transparent">
            Drug<span className="text-white dark:text-gray-200">IQ</span>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return <Link key={item.path} to={item.path}>
                <Button variant="ghost" size="sm" className={`flex items-center space-x-2 transition-all duration-200 ${isActive ? "bg-pink-500/20 text-pink-300 dark:bg-purple-600/20 dark:text-purple-300 border border-pink-500/30 dark:border-purple-500/30" : "text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"}`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>;
        })}
          
          {/* Auth Section */}
          <div className="ml-4 flex items-center space-x-2">
            {user ? <UserDropdown /> : <Link to="/login">
                <Button variant="outline" className="border-white/20 text-slate-50 bg-transparent">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center space-x-2">
          {user && <UserDropdown />}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-gradient-to-b from-purple-900 to-indigo-900 text-white border-l border-purple-700/30">
              <div className="flex flex-col space-y-4 mt-8">
                {user && profile && <div className="px-3 py-4 border-b border-purple-700/30">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" alt={profile.full_name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile.full_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {profile.full_name || 'User'}
                        </p>
                        <p className="text-xs text-white/70 truncate">
                          {profile.specialty || 'Medical Professional'}
                        </p>
                        <p className="text-xs text-white/50 capitalize">
                          {userRole}
                        </p>
                      </div>
                    </div>
                  </div>}
                
                {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className={`w-full justify-start transition-all duration-200 ${isActive ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>;
              })}
                
                {user ? <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10">
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </> : <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                      <LogIn className="h-4 w-4 mr-3" />
                      Sign In
                    </Button>
                  </Link>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>;
};
export default EnhancedNavigation;