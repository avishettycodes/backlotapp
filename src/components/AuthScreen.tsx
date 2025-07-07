import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  View,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../App';
import ParkingLogo from './ParkingLogo';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // You'll need to replace this with your actual client ID

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
  const [isAppleSignInAvailable, setIsAppleSignInAvailable] = useState(false);
  
  const fadeAnim = new Animated.Value(1);
  
  const { colors } = useTheme();
  const { login } = useAuth();

  // Check if Apple Sign In is available
  useEffect(() => {
    const checkAppleSignInAvailability = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setIsAppleSignInAvailable(isAvailable);
    };
    checkAppleSignInAvailability();
  }, []);

  // Google OAuth configuration
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'your-app-scheme', // You'll need to configure this
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery
  );

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleAuthSuccess(authentication);
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (authentication: any) => {
    try {
      setIsLoading(true);
      
      // Fetch user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${authentication.accessToken}`
      );
      const userInfo = await userInfoResponse.json();
      
      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        authProvider: 'google'
      }));
      
      Alert.alert(
        'Welcome!', 
        `Successfully signed in with Google as ${userInfo.name}!`,
        [{ text: 'OK', onPress: () => login() }]
      );
    } catch (error) {
      console.error('Google auth error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsLogin(!isLogin);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
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
    
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        authProvider: 'email'
      }));
      
      const action = isLogin ? 'Login' : 'Account creation';
      Alert.alert('Success', `${action} successful! Welcome to Backlot.`, [
        { text: 'OK', onPress: () => login() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('Error', 'Google Sign In is not configured properly.');
      return;
    }
    
    setIsLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Failed to initiate Google Sign In.');
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (!isAppleSignInAvailable) {
      Alert.alert('Unavailable', 'Apple Sign In is not available on this device.');
      return;
    }

    setIsLoading(true);
    
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Process the credential
      const { user, email, fullName, identityToken, authorizationCode } = credential;
      
      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify({
        id: user,
        email: email,
        name: fullName ? `${fullName.givenName} ${fullName.familyName}` : 'Apple User',
        authProvider: 'apple',
        identityToken,
        authorizationCode
      }));

      Alert.alert(
        'Welcome!', 
        `Successfully signed in with Apple!`,
        [{ text: 'OK', onPress: () => login() }]
      );
    } catch (error: any) {
      console.error('Apple login error:', error);
      
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User canceled the sign-in flow
        return;
      }
      
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Simple Header */}
        <View style={styles.headerContainer}>
          <ParkingLogo size={64} />
        </View>

        {/* Form Container */}
        <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
          
          {/* Toggle Mode */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => !isLogin && toggleMode()}>
              <Text style={[styles.toggleLink, { 
                color: isLogin ? colors.primary : colors.textSecondary,
                fontWeight: isLogin ? '600' : '400'
              }]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <Text style={[styles.toggleSeparator, { color: colors.border }]}>•</Text>
            <TouchableOpacity onPress={() => isLogin && toggleMode()}>
              <Text style={[styles.toggleLink, { 
                color: !isLogin ? colors.primary : colors.textSecondary,
                fontWeight: !isLogin ? '600' : '400'
              }]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  placeholder="Full name"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                }]}
                placeholder="Email address"
                placeholderTextColor={colors.textSecondary}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
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
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    }]}
                    placeholder="Confirm password"
                    placeholderTextColor={colors.textSecondary}
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
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { 
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.6 : 1,
              }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.textSecondary }]}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            )}

            {/* Simple Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border }]}
                onPress={handleGoogleLogin}
                disabled={isLoading || !request}
              >
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {isAppleSignInAvailable && (
                <TouchableOpacity
                  style={[styles.socialButton, { 
                    backgroundColor: colors.text,
                    borderColor: colors.text 
                  }]}
                  onPress={handleAppleLogin}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-apple" size={18} color={colors.background} />
                  <Text style={[styles.socialButtonText, { color: colors.background }]}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  formWrapper: {
    maxWidth: 380,
    width: '100%',
    alignSelf: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  toggleLink: {
    fontSize: 16,
  },
  toggleSeparator: {
    fontSize: 16,
    opacity: 0.3,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 0,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
  },
  formContainer: {
    gap: 16,
    marginTop: 32,
  },
  inputContainer: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    paddingVertical: 16,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 0,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
}); 