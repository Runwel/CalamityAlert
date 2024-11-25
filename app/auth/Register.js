import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../src/api/SupabaseApi'; 

const { width, height } = Dimensions.get('window');

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !email || !password) {
      Alert.alert('All fields are required!');
      return;
    }
  
    try {
      // Check if email already exists in the database
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
  
      if (selectError && selectError.code !== 'PGRST116') { // 'PGRST116' means no row was found
        throw selectError;
      }
  
      if (existingUser) {
        Alert.alert('Email is already registered!');
        return;
      }
  
      // Insert user details into 'users' table
      const { error: insertError } = await supabase.from('users').insert([
        {
          username,
          firstname: firstName,
          lastname: lastName,
          email,
          password, // Consider hashing the password before storing it
          role: 'user', // Default role
        },
      ]);
  
      if (insertError) throw insertError;
  
      // Navigate to login screen after successful registration
      Alert.alert('Registration Successful', 'You can now log in.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong!');
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
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitleText}>
                Join us to monitor weather patterns and receive real-time alerts
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={Math.round(width * 0.06)} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              {/* First Name Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={Math.round(width * 0.06)} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              {/* Last Name Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={Math.round(width * 0.06)} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Feather name="mail" size={Math.round(width * 0.06)} color="#fff" style={styles.icon} />
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

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={Math.round(width * 0.06)} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={Math.round(width * 0.06)} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.linkText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Math.min(width * 0.06, 24),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Math.min(height * 0.08, 64),
    marginBottom: Math.min(height * 0.04, 32),
  },
  logo: {
    width: Math.min(width * 0.4, 160),
    height: Math.min(width * 0.4, 160),
    marginBottom: Math.min(height * 0.02, 16),
  },
  welcomeText: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: Math.min(height * 0.01, 8),
  },
  subtitleText: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: Math.min(width * 0.1, 40),
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Math.min(width * 0.05, 20),
    padding: Math.min(width * 0.05, 20),
    marginBottom: Math.min(height * 0.05, 20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Math.min(width * 0.03, 12),
    marginBottom: Math.min(height * 0.02, 16),
    paddingHorizontal: Math.min(width * 0.03, 12),
    height: Math.min(height * 0.07, 50),
  },
  icon: {
    marginRight: Math.min(width * 0.02, 8),
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: Math.min(width * 0.04, 16),
  },
  eyeIcon: {
    padding: Math.min(width * 0.02, 8),
  },
  registerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Math.min(width * 0.03, 12),
    height: Math.min(height * 0.07, 50),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Math.min(height * 0.02, 16),
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: Math.min(width * 0.035, 14),
  },
  loginLink: {
    color: '#fff',
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: 'bold',
  },
});