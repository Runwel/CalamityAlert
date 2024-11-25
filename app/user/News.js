import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { NewsSection } from '../src/components/news/NewsSection';
import { supabase } from '../src/api/SupabaseApi';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../src/context/ThemeContext';
import { responsive } from '../src/utils/responsive';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', '7days', '30days', '90days'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
    const subscription = setupSubscription();
    return () => subscription();
  }, [dateFilter, searchTerm]); // Include searchTerm in the dependencies

  const getDateFilterCondition = () => {
    if (dateFilter === 'all') return null;

    const days = {
      '7days': 7,
      '30days': 30,
      '90days': 90
    };

    const date = new Date();
    date.setDate(date.getDate() - days[dateFilter]);
    return date.toISOString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchPosts = async () => {
    try {
      console.log('Fetching news posts with date filter:', dateFilter);
      let query = supabase
        .from('posts') // Assuming your table is called 'posts'
        .select('*')
        .eq('category', 'news') // Filter posts by category 'news'
        .order('created_at', { ascending: false });

      const dateCondition = getDateFilterCondition();
      if (dateCondition) {
        query = query.gte('created_at', dateCondition);
      }

      // Apply search term filter if provided
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`); // Assuming you want to search by 'title' field
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Fetched news posts:', data);
      setPosts(data.map(post => ({
        ...post,
        formattedDate: formatDate(post.created_at)
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
          table: 'posts', // Ensure this matches your table name
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          if (payload.eventType === 'INSERT' && payload.new.category === 'news') {
            const newPost = {
              ...payload.new,
              formattedDate: formatDate(payload.new.created_at)
            };
            setPosts(prev => [newPost, ...prev]);
          } else if (payload.eventType === 'UPDATE' && payload.new.category === 'news') {
            setPosts(prev =>
              prev.map(post => {
                if (post.id === payload.new.id) {
                  return {
                    ...payload.new,
                    formattedDate: formatDate(payload.new.created_at)
                  };
                }
                return post;
              })
            );
          } else if (payload.eventType === 'DELETE' && payload.old.category === 'news') {
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

  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[
      styles.safeArea, 
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
    ]}>
      <View style={[
        styles.header,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
      ]}>
        <View style={[
          styles.searchContainer,
          { width: responsive.isLargeDevice ? '40%' : '60%' }
        ]}>
          <TextInput
            style={[
              styles.searchBar,
              {
                backgroundColor: isDarkMode ? '#f1f5f9' : '#f5f5f5',
                borderColor: isDarkMode ? '#404040' : '#ddd',
                color: isDarkMode ? '#fff' : '#000',
              }
            ]}
            placeholder="Search news..."
            placeholderTextColor={isDarkMode ? '#808080' : '#666'}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <View style={[
          styles.pickerContainer,
          { width: responsive.isLargeDevice ? '20%' : '35%' }
        ]}>
          <Picker
            selectedValue={dateFilter}
            style={[
              styles.dateFilter,
              {
                backgroundColor: isDarkMode ? '#f1f5f9' : '#f5f5f5',
                color: isDarkMode ? '#000' : '#000',
              }
            ]}
            onValueChange={(itemValue) => setDateFilter(itemValue)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="All Time" value="all" style={styles.pickerOption} />
            <Picker.Item label="Last 7 Days" value="7days" style={styles.pickerOption} />
            <Picker.Item label="Last 30 Days" value="30days" style={styles.pickerOption} />
            <Picker.Item label="Last 90 Days" value="90days" style={styles.pickerOption} />
          </Picker>
        </View>
      </View>
      
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}
        contentContainerStyle={styles.scrollViewContent}
      >
        <NewsSection
          posts={posts}
          loading={loading}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          isDarkMode={isDarkMode}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingTop: responsive.padding.medium,
    paddingLeft: 7,
    paddingRight: -8,
  },
  searchContainer: {
    marginRight: responsive.padding.small,
  },
  searchBar: {
    height: responsive.scale(47),
    borderWidth: 1,
    borderRadius: responsive.scale(8),
    paddingHorizontal: responsive.padding.medium,
    fontSize: responsive.fontSize.large,
  },
  dateFilter: {
    height: responsive.scale(45), // Increased from 40 to give more room
    borderRadius: responsive.scale(8),
    fontSize: responsive.fontSize.small,
  },
  pickerItem: {
    fontSize: responsive.fontSize.medium,
    height: responsive.scale(45), // Match with dateFilter height
    paddingVertical: responsive.padding.small, // Add some vertical padding
  },
  pickerOption: {
    fontSize: responsive.fontSize.medium,
    paddingVertical: responsive.padding.small, // Add padding to options too
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});