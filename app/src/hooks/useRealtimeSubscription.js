import { useEffect } from 'react';
import { supabase } from '../api/SupabaseApi';

export const useRealtimeSubscription = (callback, table = 'posts') => {
  useEffect(() => {
    console.log(`Setting up realtime subscription for ${table}...`);
    
    const channelName = `${table}_channel`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: table 
        }, 
        (payload) => {
          console.log(`Received realtime update for ${table}:`, payload);
          console.log('Event type:', payload.eventType);
          console.log('Payload data:', payload);
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      console.log(`Cleaning up realtime subscription for ${table}...`);
      subscription.unsubscribe();
    };
  }, [callback, table]);
};