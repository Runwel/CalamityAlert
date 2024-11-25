import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../api/SupabaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const configurePushNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

export const storeFCMToken = async (token) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('users')
      .update({ 
        fcm_token: token,
        notification_enabled: true 
      })
      .eq('id', user.id);

    await AsyncStorage.setItem('fcmToken', token);
    console.log('FCM token stored successfully');
  } catch (error) {
    console.error('Error storing FCM token:', error);
  }
};

export const removeFCMToken = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('users')
      .update({ 
        fcm_token: null,
        notification_enabled: false 
      })
      .eq('id', user.id);

    await AsyncStorage.removeItem('fcmToken');
    console.log('FCM token removed successfully');
  } catch (error) {
    console.error('Error removing FCM token:', error);
  }
};