import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './app/auth/Login';
import Register from './app/auth/Register';
import BottomTabNavigation from './app/src/components/BottomNavigation';
import BottomAdminNavigation from './app/src/components/BottomAdminNavigation';
import { ThemeProvider } from './app/src/context/ThemeContext';

const Stack = createStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Check for stored session on app start
    checkStoredSession();

    // Handle back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If we're at the main screen (BottomTabNavigation or BottomAdminNavigation), exit the app
      if (initialRoute === 'BottomTabNavigation' || initialRoute === 'BottomAdminNavigation') {
        BackHandler.exitApp();
        return true;
      }
      return false;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [initialRoute]);

  const checkStoredSession = async () => {
    try {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        const userData = JSON.parse(userSession);
        const targetScreen = userData.role === 'admin' ? 'BottomAdminNavigation' : 'BottomTabNavigation';
        setInitialRoute(targetScreen);
      }
    } catch (error) {
      console.error('Error checking stored session:', error);
    }
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        {!isConnected && (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
          </View>
        )}
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            gestureEnabled: false // Disable swipe back gesture
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
          <Stack.Screen name="BottomAdminNavigation" component={BottomAdminNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#ff4444',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
  },
});