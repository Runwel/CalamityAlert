import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Dashboard from '../../admin/dashboard';
import AdminManilaCityMap from '../../admin/mapManila';
import Settings from '../../admin/settings';
const Tab = createBottomTabNavigator();
const BottomAdminNavigation = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#1A1F2C', paddingBottom: 5 },
          tabBarActiveTintColor: '#0EA5E9',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Maps" 
          component={AdminManilaCityMap} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="add-alert" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={Settings} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
        <MaterialIcons name="emergency" size={28} color="white" />
      </TouchableOpacity> */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergency Actions</Text>
            <TouchableOpacity style={styles.emergencyButton} onPress={() => { /* Emergency broadcast */ }}>
              <Text style={styles.emergencyText}>Send Emergency Broadcast</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertButton} onPress={() => { /* Create alert */ }}>
              <Text style={styles.emergencyText}>Create Alert</Text>
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
  actionButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: '#ea384c',
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
    marginBottom: 20,
  },
  emergencyButton: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#ea384c',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  alertButton: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeText: {
    color: '#64748B',
    fontSize: 16,
  },
});
export default BottomAdminNavigation;