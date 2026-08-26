
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadThemePreference = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('dark_mode_enabled')
          .eq('id', user.id)
          .single();
        
        if (data?.dark_mode_enabled) {
          setIsDarkMode(data.dark_mode_enabled);
          document.documentElement.classList.add('dark');
        }
      }
    };

    loadThemePreference();
  }, [user]);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (user) {
      await supabase
        .from('profiles')
        .update({ dark_mode_enabled: newMode })
        .eq('id', user.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
