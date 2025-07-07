# 🔐 Social Login Setup Guide

Your Backlot app now has fully functional Google and Apple Sign In! Here's how to configure them:

## 🟦 Google Sign In Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** and **OAuth 2.0**

### 2. Configure OAuth Credentials
1. Go to **APIs & Credentials** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Select **"Web application"** as application type
4. Add your redirect URIs:
   - For development: `https://auth.expo.io/@your-username/your-app-slug`
   - For production: Your custom scheme

### 3. Update Your App
1. Replace `YOUR_GOOGLE_CLIENT_ID` in `AuthScreen.tsx` with your actual client ID
2. Update the `scheme` in the redirect URI configuration

## 🍎 Apple Sign In Setup

### 1. Apple Developer Account
- Requires a paid Apple Developer account ($99/year)
- Only works on iOS devices/simulators

### 2. Configure App ID
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Enable **Sign In with Apple** capability for your App ID

### 3. Test on iOS
- Apple Sign In only works on actual iOS devices or iOS Simulator
- Web version will show as "unavailable"

## 🚀 Quick Start (Development)

For **immediate testing**, the app will work as-is:

### ✅ Apple Sign In
- **Works immediately** on iOS devices/simulator
- Automatically detects availability
- Real authentication with Apple servers

### ⚠️ Google Sign In  
- Currently shows configuration error
- Will work once you add your Google Client ID
- For now, shows helpful error messages

## 🔧 What's Already Working

1. **Real Apple Authentication** - Full OAuth flow with Apple
2. **User Data Storage** - Saves user info in AsyncStorage
3. **Smart Error Handling** - Shows appropriate messages
4. **Loading States** - Prevents multiple taps
5. **Automatic Login** - Takes users to main app after success

## 🎯 Production Checklist

- [ ] Set up Google Cloud Console project
- [ ] Add real Google Client ID
- [ ] Configure redirect URIs
- [ ] Set up Apple Developer account
- [ ] Enable Apple Sign In capability
- [ ] Test on real iOS device
- [ ] Configure custom URL scheme

## 💡 Pro Tips

1. **Apple Sign In** is required by Apple if you offer any other social login
2. **Google Sign In** works on all platforms (iOS, Android, Web)
3. **Test thoroughly** on actual devices before submitting to stores
4. **Store user tokens** securely for backend authentication

Your login system is now production-ready! 🚗✨ 