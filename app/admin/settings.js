import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { supabase } from '../src/api/SupabaseApi'; // Import your Supabase client
import { useNavigation } from '@react-navigation/native';

export default function AdminSettings() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const navigation = useNavigation();

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);

  const handleLogout = async () => {
    try {
      console.log('Admin attempting to log out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Admin logout error:', error.message);
        alert('Failed to logout. Please try again.');
        return;
      }
      
      console.log('Admin successfully logged out');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during admin logout:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Switch value={isNotificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#ff4444',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});