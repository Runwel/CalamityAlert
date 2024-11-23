import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/auth/Login';  // Path to Login component
import Register from './app/auth/Register';  // Path to Login component
import BottomTabNavigation from './app/src/components/BottomNavigation';  // Path to BottomTabNavigation component
import BottomAdminNavigation from './app/src/components/BottomAdminNavigation';
import { ThemeProvider } from './app/src/context/ThemeContext'; 

const Stack = createStackNavigator();

export default function App() {
  return (
  <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BottomAdminNavigation">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="BottomAdminNavigation" component={BottomAdminNavigation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
