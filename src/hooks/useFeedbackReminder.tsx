
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useFeedbackReminder = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const checkFeedbackReminder = async () => {
      // Feedback reminder functionality temporarily disabled
      // as columns are not yet in the profiles table
    };

    checkFeedbackReminder();
    
    // Check every 5 minutes for feedback reminder
    const interval = setInterval(checkFeedbackReminder, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, toast]);
};
