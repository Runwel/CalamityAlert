import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../../user/Home';
import NewsScreen from '../../user/News';
import StatusScreen from '../../user/Status';
import SettingsScreen from '../../user/Settings';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: 'lightgray', paddingBottom: 5 },
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="News" 
          component={NewsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="article" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Status" 
          component={StatusScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="article" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.chatButton} onPress={toggleModal}>
        <MaterialIcons name="chat" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal for Chat Options */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chat Options</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => { /* Action for Display Current Data */ }}>
              <Text style={styles.optionText}>Display Current Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => { /* Other actions */ }}>
              <Text style={styles.optionText}>Other Options</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default BottomNavigation;
