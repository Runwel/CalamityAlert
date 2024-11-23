import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NewsSection } from '../src/components/news/NewsSection';
import { supabase } from '../src/api/SupabaseApi';
import { format, subDays } from 'date-fns';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', '7days', '30days', '90days'

  useEffect(() => {
    fetchPosts();
    const subscription = setupSubscription();
    return () => subscription();
  }, [dateFilter]);

  const getDateFilterCondition = () => {
    if (dateFilter === 'all') return null;
    
    const days = {
      '7days': 7,
      '30days': 30,
      '90days': 90
    };
    
    return subDays(new Date(), days[dateFilter]).toISOString();
  };

  const fetchPosts = async () => {
    try {
      console.log('Fetching news posts with date filter:', dateFilter);
      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      const dateCondition = getDateFilterCondition();
      if (dateCondition) {
        query = query.gte('created_at', dateCondition);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Fetched news posts:', data);
      setPosts(data.map(post => ({
        ...post,
        formattedDate: format(new Date(post.created_at), 'MMMM dd, yyyy')
      })));
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSubscription = () => {
    console.log('Setting up real-time subscription for news posts...');
    const channel = supabase
      .channel('news_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            const newPost = {
              ...payload.new,
              formattedDate: format(new Date(payload.new.created_at), 'MMMM dd, yyyy')
            };
            setPosts(prev => [newPost, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev => 
              prev.map(post => {
                if (post.id === payload.new.id) {
                  return {
                    ...payload.new,
                    formattedDate: format(new Date(payload.new.created_at), 'MMMM dd, yyyy')
                  };
                }
                return post;
              })
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(post => post.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up news subscription...');
      supabase.removeChannel(channel);
    };
  };

  return (
    <View style={styles.container}>
      <NewsSection 
        posts={posts} 
        loading={loading} 
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});