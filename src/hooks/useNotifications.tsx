import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'drug_update' | 'system_alert' | 'feedback_acknowledgement' | 'general';
  priority: string;
  is_global: boolean;
  created_at: string;
  expires_at: string | null;
  target_user_id?: string | null;
  target_role?: string | null;
  created_by?: string | null;
  is_read?: boolean;
  is_dismissed?: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      // Fetch notifications
      const { data: notifs, error: notifsError } = await supabase
        .from('notifications')
        .select('*')
        .or(`is_global.eq.true,target_user_id.eq.${user.id}`)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false });

      if (notifsError) throw notifsError;

      // Fetch user notification status
      const { data: statuses, error: statusError } = await supabase
        .from('user_notification_status')
        .select('notification_id, is_read, is_dismissed')
        .eq('user_id', user.id);

      if (statusError) throw statusError;

      // Merge notifications with status
      const statusMap = new Map(
        (statuses || []).map(s => [s.notification_id, s])
      );

      const mergedNotifications = (notifs || [])
        .filter(notif => {
          const status = statusMap.get(notif.id);
          return !status?.is_dismissed;
        })
        .map(notif => ({
          ...notif,
          is_read: statusMap.get(notif.id)?.is_read || false,
          is_dismissed: statusMap.get(notif.id)?.is_dismissed || false
        }));

      setNotifications(mergedNotifications);
      setUnreadCount(mergedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription
    if (user) {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications'
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_notification_status')
        .upsert({
          user_id: user.id,
          notification_id: notificationId,
          is_read: true,
          read_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,notification_id'
        });

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_notification_status')
        .upsert({
          user_id: user.id,
          notification_id: notificationId,
          is_dismissed: true,
          dismissed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,notification_id'
        });

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      
      const promises = unreadIds.map(id =>
        supabase
          .from('user_notification_status')
          .upsert({
            user_id: user.id,
            notification_id: id,
            is_read: true,
            read_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,notification_id'
          })
      );

      await Promise.all(promises);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    dismissNotification,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};