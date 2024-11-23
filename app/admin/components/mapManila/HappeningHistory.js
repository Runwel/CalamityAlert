import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supabase } from '../../../src/api/SupabaseApi';
export const HappeningHistory = ({ onHappeningSelect }) => {
    const [allHappenings, setAllHappenings] = useState([]);
  
    useEffect(() => {
      console.log('Initializing HappeningHistory');
      fetchAllHappenings();
      const cleanup = setupRealtimeSubscription();
      return cleanup;
    }, []);
  
    const setupRealtimeSubscription = () => {
      console.log('Setting up history realtime subscription');
      const channel = supabase
        .channel('history_channel')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'happenings' },
          (payload) => {
            console.log('History realtime update received:', payload);
            handleRealtimeUpdate(payload);
          }
        )
        .subscribe();
  
      return () => {
        console.log('Cleaning up history subscription');
        supabase.removeChannel(channel);
      };
    };
  
    const handleRealtimeUpdate = (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      switch (eventType) {
        case 'INSERT':
          setAllHappenings(prev => [newRecord, ...prev]);
          break;
        case 'DELETE':
          setAllHappenings(prev => prev.filter(h => h.id !== oldRecord.id));
          break;
        case 'UPDATE':
          setAllHappenings(prev => 
            prev.map(h => h.id === newRecord.id ? newRecord : h)
          );
          break;
      }
    };
  
    const fetchAllHappenings = async () => {
      console.log('Fetching all happenings for history');
      try {
        const { data, error } = await supabase
          .from('happenings')
          .select('*')
          .order('created_at', { ascending: false });
  
        if (error) throw error;
        console.log(`Fetched ${data?.length} happenings for history`);
        setAllHappenings(data || []);
      } catch (error) {
        console.error('Error fetching happenings history:', error);
      }
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent History</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.historyList}>
            {allHappenings.map((happening) => (
              <TouchableOpacity
                key={happening.id}
                style={styles.historyCard}
                onPress={() => onHappeningSelect(happening)}
              >
                {happening.image && (
                  <Image 
                    source={{ uri: happening.image }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.region}>{happening.region}</Text>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {happening.title}
                  </Text>
                  <Text style={styles.date}>
                    {formatDate(happening.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    historyList: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 16,
    },
    historyCard: {
      width: 280,
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    thumbnail: {
      width: '100%',
      height: 160,
    },
    cardContent: {
      padding: 12,
    },
    region: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      lineHeight: 22,
    },
    date: {
      fontSize: 12,
      color: '#666',
    },
  });