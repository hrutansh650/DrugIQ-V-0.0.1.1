import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ActivityLogEntry {
  activity_type: string;
  resource_type?: string;
  resource_id?: string;
  resource_name?: string;
  details?: Record<string, any>;
}

export const useActivityLog = () => {
  const { user } = useAuth();

  const logActivity = async (entry: ActivityLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          ...entry
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
};