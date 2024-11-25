import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../src/api/SupabaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Check for stored session on component mount
    checkStoredSession();

    return () => unsubscribe();
  }, []);

  const checkStoredSession = async () => {
    try {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        const userData = JSON.parse(userSession);
        console.log('Found stored session:', userData);
        navigation.navigate(userData.role === 'admin' ? 'BottomAdminNavigation' : 'BottomTabNavigation');
      }
    } catch (error) {
      console.error('Error checking stored session:', error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!isConnected) {
        // Check stored credentials if offline
        const storedSession = await AsyncStorage.getItem('userSession');
        if (storedSession) {
          const userData = JSON.parse(storedSession);
          if (email === userData.email && password === userData.password) {
            navigation.navigate(userData.role === 'admin' ? 'BottomAdminNavigation' : 'BottomTabNavigation');
            return;
          }
          alert('Incorrect credentials for offline login.');
          return;
        }
        alert('No stored session found for offline login.');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('id, role, password, email')
        .eq('email', email)
        .single();

      if (error) {
        alert('User not found or incorrect credentials.');
        return;
      }

      if (userData.password !== password) {
        alert('Incorrect password.');
        return;
      }

      // Store the session including email for offline login
      await AsyncStorage.setItem('userSession', JSON.stringify({ ...userData, email }));

      // Reset navigation stack and navigate based on user role
      const targetScreen = userData.role === 'admin' ? 'BottomAdminNavigation' : 'BottomTabNavigation';
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: targetScreen }],
        })
      );
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LinearGradient
      colors={['#0EA5E9', '#10B981']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>
              Monitor weather patterns, receive real-time alerts, and stay informed about your local conditions
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  logo: {
    width: width * 0.8,
    height: width * 0.6,
  },
  appTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  appDescription: {
    fontSize: width * 0.04,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: width * 0.1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    marginTop: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.01,
  },
  subtitleText: {
    fontSize: width * 0.04,
    color: '#fff',
    opacity: 0.9,
    marginBottom: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.03,
    height: height * 0.07,
  },
  inputIcon: {
    marginRight: width * 0.02,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.04,
  },
  eyeIcon: {
    padding: width * 0.02,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: height * 0.02,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: width * 0.03,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: '#fff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  registerText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  registerLink: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
});