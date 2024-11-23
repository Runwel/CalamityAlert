import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../../../src/api/SupabaseApi';
import { useRealtimeSubscription } from '../../../src/hooks/useRealtimeSubscription';

export function DashboardHeader({ usersCount, postCounts, onUserCountChange, onPostCountChange }) {
  const fetchUserCounts = async () => {
    console.log('Fetching updated user counts');
    const { data, error } = await supabase.from('users').select('role');
    if (error) {
      console.error('Error fetching user counts:', error);
      return;
    }
    const counts = { total: data.length, admin: data.filter(user => user.role === 'admin').length };
    console.log('New user counts:', counts);
    onUserCountChange(counts);
  };

  useEffect(() => {
    console.log('Initial fetch of counts');
    fetchUserCounts();
  }, []);

  // Subscribe to users table changes
  useRealtimeSubscription((payload) => {
    console.log('Users table change detected:', payload);
    if (payload.eventType === 'DELETE') {
      console.log('User deleted, updating counts');
      onUserCountChange(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        admin: payload.old.role === 'admin' ? Math.max(0, prev.admin - 1) : prev.admin
      }));
    } else if (payload.eventType === 'INSERT') {
      console.log('User inserted, updating counts');
      onUserCountChange(prev => ({
        ...prev,
        total: prev.total + 1,
        admin: payload.new.role === 'admin' ? prev.admin + 1 : prev.admin
      }));
    }
  }, 'users');

  return (
    <View style={styles.header}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="users" size={24} color="#6E59A5" />
          <Text style={styles.statTitle}>Total Users</Text>
          <Text style={styles.statValue}>{usersCount.total}</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="file-text" size={24} color="#6E59A5" />
          <Text style={styles.statTitle}>Total Posts</Text>
          <Text style={styles.statValue}>
            {postCounts.news + postCounts.alert + postCounts.hotline}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1F2C',
    marginTop: 4,
  },
});