import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PostList } from './PostList';
import { supabase } from '../../../src/api/SupabaseApi';

export function PostTabs({ 
  activeTab,
  setActiveTab,
  newsProps,
  alertsProps,
  hotlineProps,
  postCounts: initialCounts
}) {
  const [postCounts, setPostCounts] = useState({ news: 0, alert: 0, hotline: 0 });

  const fetchAndUpdateCounts = async () => {
    console.log('Fetching current post counts...');
    const { data, error } = await supabase
      .from('posts')
      .select('category');
    
    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    const counts = data.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, { news: 0, alert: 0, hotline: 0 });

    console.log('Initial post counts:', counts);
    setPostCounts(counts);
  };

  useEffect(() => {
    // Initial fetch of counts
    fetchAndUpdateCounts();

    // Set up realtime subscription
    console.log('Setting up realtime subscription for posts...');
    const channel = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        async (payload) => {
          console.log('Received realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('New post added:', payload.new.category);
            setPostCounts(prev => ({
              ...prev,
              [payload.new.category]: (prev[payload.new.category] || 0) + 1
            }));
          } 
          else if (payload.eventType === 'DELETE') {
            console.log('Post deleted:', payload.old.category);
            setPostCounts(prev => ({
              ...prev,
              [payload.old.category]: Math.max(0, (prev[payload.old.category] || 0) - 1)
            }));
          }
          else if (payload.eventType === 'UPDATE' && payload.old.category !== payload.new.category) {
            // Handle category changes
            console.log('Post category changed from', payload.old.category, 'to', payload.new.category);
            setPostCounts(prev => ({
              ...prev,
              [payload.old.category]: Math.max(0, (prev[payload.old.category] || 0) - 1),
              [payload.new.category]: (prev[payload.new.category] || 0) + 1
            }));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  const tabs = [
    { id: 'news', label: 'News', count: postCounts.news },
    { id: 'alert', label: 'Alert', count: postCounts.alert },
    { id: 'hotline', label: 'Hotline', count: postCounts.hotline }
  ];

  const getSearchPlaceholder = (tabId) => {
    switch (tabId) {
      case 'news':
        return 'Search news posts...';
      case 'alert':
        return 'Search alerts...';
      case 'hotline':
        return 'Search hotline posts...';
      default:
        return 'Search posts...';
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'news':
        return <PostList {...newsProps} searchPlaceholder={getSearchPlaceholder('news')} />;
      case 'alert':
        return <PostList {...alertsProps} searchPlaceholder={getSearchPlaceholder('alert')} />;
      case 'hotline':
        return <PostList {...hotlineProps} searchPlaceholder={getSearchPlaceholder('hotline')} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsHeader}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label} ({tab.count || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabContent}>
        {getTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6E59A5',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
});