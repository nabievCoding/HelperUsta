import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for real-time subscriptions to Supabase tables
 * @param {string} table - Table name to subscribe to
 * @param {function} onInsert - Callback for INSERT events
 * @param {function} onUpdate - Callback for UPDATE events
 * @param {function} onDelete - Callback for DELETE events
 * @param {object} filter - Optional filter for the subscription
 */
export const useRealtimeSubscription = (table, { onInsert, onUpdate, onDelete, filter } = {}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping subscription');
      return;
    }

    let subscription;

    const setupSubscription = async () => {
      try {
        // Create channel
        const channel = supabase.channel(`${table}_changes`);

        // Subscribe to changes
        subscription = channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: table,
              ...(filter || {}),
            },
            (payload) => {
              console.log(`Realtime event on ${table}:`, payload);

              switch (payload.eventType) {
                case 'INSERT':
                  if (onInsert) onInsert(payload.new);
                  break;
                case 'UPDATE':
                  if (onUpdate) onUpdate(payload.new, payload.old);
                  break;
                case 'DELETE':
                  if (onDelete) onDelete(payload.old);
                  break;
                default:
                  break;
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log(`✅ Subscribed to ${table}`);
              setIsSubscribed(true);
            } else if (status === 'CHANNEL_ERROR') {
              console.error(`❌ Error subscribing to ${table}`);
              setError('Subscription error');
              setIsSubscribed(false);
            }
          });
      } catch (err) {
        console.error(`Error setting up subscription for ${table}:`, err);
        setError(err.message);
        setIsSubscribed(false);
      }
    };

    setupSubscription();

    // Cleanup on unmount
    return () => {
      if (subscription) {
        console.log(`🔌 Unsubscribing from ${table}`);
        subscription.unsubscribe();
      }
    };
  }, [table, filter]);

  return { isSubscribed, error };
};

/**
 * Hook for subscribing to new orders
 */
export const useOrdersSubscription = (onNewOrder, onOrderUpdate) => {
  return useRealtimeSubscription('orders', {
    onInsert: onNewOrder,
    onUpdate: onOrderUpdate,
  });
};

/**
 * Hook for subscribing to notifications
 */
export const useNotificationsSubscription = (onNewNotification) => {
  return useRealtimeSubscription('notifications', {
    onInsert: onNewNotification,
    filter: {
      filter: 'user_type=eq.admin',
    },
  });
};

/**
 * Hook for subscribing to chat messages
 */
export const useChatMessagesSubscription = (roomId, onNewMessage) => {
  return useRealtimeSubscription('chat_messages', {
    onInsert: onNewMessage,
    filter: roomId ? { filter: `room_id=eq.${roomId}` } : undefined,
  });
};

export default useRealtimeSubscription;
