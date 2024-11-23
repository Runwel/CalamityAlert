import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { supabase } from '../src/api/SupabaseApi';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('User attempting to log out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        alert('Failed to logout. Please try again.');
        return;
      }
      
      console.log('Successfully logged out');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const SettingItem = ({ title, value, onValueChange, type = 'switch' }: {
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={[
      styles.settingOption,
      { backgroundColor: isDarkMode ? '#222' : '#f5f5f5' }
    ]}>
      <Text style={[
        styles.settingText,
        { color: isDarkMode ? '#fff' : '#000' }
      ]}>
        {title}
      </Text>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        />
      ) : (
        <View />
      )}
    </View>
  );
  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#333' : '#fff' }
      ]}
    >
      // ... keep existing code (settings sections)
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: isDarkMode ? '#ff4444' : '#ff6b6b' }
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});