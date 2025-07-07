import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);
  
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({ light: '#ffffff', dark: '#1a1a1a' }, 'background');
  const inputBorderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'icon');
  const inputBackgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#2a2a2a' }, 'background');

  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isLogin ? 1 : 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    
    // Basic validation
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (!isLogin && !formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const action = isLogin ? 'Login' : 'Account creation';
      Alert.alert('Success', `${action} successful! Welcome to Backlot.`);
    }, 1500);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Logo */}
        <ThemedView style={[styles.headerContainer, { backgroundColor: 'transparent' }]}>
          <Image
            source={require('../../assets/images/partial-react-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText type="title" style={styles.appTitle}>
            Backlot
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Find your perfect ride
          </ThemedText>
        </ThemedView>

        {/* Auth Form Card */}
        <Animated.View 
          style={[
            styles.authCard, 
            { 
              backgroundColor: cardColor,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            }
          ]}
        >
          {/* Toggle Buttons */}
          <ThemedView style={[styles.toggleContainer, { backgroundColor: inputBackgroundColor }]}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isLogin && { backgroundColor: tintColor },
              ]}
              onPress={() => !isLogin && toggleMode()}
            >
              <ThemedText 
                style={[
                  styles.toggleText,
                  isLogin && { color: '#ffffff' },
                ]}
              >
                Login
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isLogin && { backgroundColor: tintColor },
              ]}
              onPress={() => isLogin && toggleMode()}
            >
              <ThemedText 
                style={[
                  styles.toggleText,
                  !isLogin && { color: '#ffffff' },
                ]}
              >
                Sign Up
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Form Fields */}
          <ThemedView style={[styles.formContainer, { backgroundColor: 'transparent' }]}>
            {!isLogin && (
              <ThemedView style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
                <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: inputBackgroundColor,
                      borderColor: inputBorderColor,
                      color: textColor,
                    }
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={useThemeColor({ light: '#999999', dark: '#666666' }, 'text')}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                />
              </ThemedView>
            )}

            <ThemedView style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: inputBackgroundColor,
                    borderColor: inputBorderColor,
                    color: textColor,
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={useThemeColor({ light: '#999999', dark: '#666666' }, 'text')}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </ThemedView>

            <ThemedView style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <ThemedView style={[styles.passwordContainer, { backgroundColor: 'transparent' }]}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    { 
                      backgroundColor: inputBackgroundColor,
                      borderColor: inputBorderColor,
                      color: textColor,
                    }
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={useThemeColor({ light: '#999999', dark: '#666666' }, 'text')}
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={useThemeColor({ light: '#666666', dark: '#999999' }, 'text')}
                  />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            {!isLogin && (
              <ThemedView style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
                <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
                <ThemedView style={[styles.passwordContainer, { backgroundColor: 'transparent' }]}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      { 
                        backgroundColor: inputBackgroundColor,
                        borderColor: inputBorderColor,
                        color: textColor,
                      }
                    ]}
                    placeholder="Confirm your password"
                    placeholderTextColor={useThemeColor({ light: '#999999', dark: '#666666' }, 'text')}
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color={useThemeColor({ light: '#666666', dark: '#999999' }, 'text')}
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { 
                  backgroundColor: tintColor,
                  opacity: isLoading ? 0.7 : 1,
                }
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <ThemedText style={styles.submitButtonText}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              </ThemedText>
            </TouchableOpacity>

            {/* Footer */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <ThemedText style={[styles.forgotPasswordText, { color: tintColor }]}>
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  authCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
