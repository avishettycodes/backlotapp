# 🚗 Backlot - Car Garage App

A React Native Expo app for browsing and saving cars with swipe functionality, similar to Tinder but for vehicles.

## 📱 Features

- **Swipe Interface**: Swipe right to save cars to your garage, left to pass
- **Car Details Modal**: Tap any car to view detailed information
- **Image Carousel**: Browse multiple images of each vehicle
- **Garage Management**: View and manage your saved cars
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go app** on your phone (iOS App Store or Google Play Store)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/avishettycodes/backlotapp.git
cd backlotapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npx expo start
```

### 4. Run on Your Device

1. **Install Expo Go** on your phone from the App Store (iOS) or Google Play Store (Android)
2. **Scan the QR code** that appears in your terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. The app will load on your device!

## 📋 How to Use the App

### Home Tab (Swipe Interface)
- **Swipe Right**: Save car to your garage
- **Swipe Left**: Pass on the car (it goes back to the queue)
- **Tap**: Open detailed car information modal
- **View**: Car image, year, make, model, mileage, location, and price

### Garage Tab
- **View Saved Cars**: All cars you've swiped right on
- **Tap Car**: Open detailed modal with full information
- **Message Seller**: Contact the car seller (placeholder feature)
- **Remove from Garage**: Delete car from your saved list (returns to home queue)

### Car Detail Modal
- **Image Carousel**: Swipe through multiple car images
- **Car Information**: Complete specs, seller details, pros/cons
- **Listing Date**: Shows when the car was posted
- **Action Buttons**: Message seller or remove from garage

## 🔧 Troubleshooting

### Common Issues

#### 1. "Unable to resolve module" errors
```bash
# Clear cache and restart
npx expo start --clear
```

#### 2. App not loading on device
- Ensure your phone and computer are on the same WiFi network
- Try switching between Tunnel, LAN, and Local connection modes in Expo

#### 3. Dependencies issues
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

#### 4. Expo Go connection issues
- Restart Expo Go app on your phone
- Try using a different connection method (Tunnel/LAN/Local)

### Development Tips

- **Hot Reload**: Changes automatically appear on your device
- **Debug Menu**: Shake your device to access developer options
- **Console Logs**: Check terminal for debugging information

## 📁 Project Structure

```
backlotapp/
├── src/
│   ├── components/
│   │   ├── CarDetailModal.tsx    # Car detail popup
│   │   ├── Garage.tsx            # Garage page
│   │   ├── SwipeDeck.tsx         # Main swipe interface
│   │   └── Submit.tsx            # Submit button
│   ├── store/
│   │   ├── garageStore.ts        # Garage state management
│   │   └── swipeQueueStore.ts    # Swipe queue management
│   └── types/
│       └── car.ts                # Car data types
├── App.tsx                       # Main app component
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🎨 Customization

### Adding New Cars
Edit `src/components/SwipeDeck.tsx` and add to the `sampleCars` array:

```typescript
{
  id: 4,
  year: 2022,
  make: "Tesla",
  model: "Model 3",
  price: 45000,
  mileage: 15000,
  location: "Austin, TX",
  image: "https://example.com/tesla-image.jpg",
  // ... other properties
}
```

### Styling Changes
- Main styles are in each component file
- Colors and themes can be modified in the StyleSheet objects
- Icons use Expo Vector Icons (Ionicons)

## 📱 Supported Platforms

- **iOS**: iPhone and iPad (via Expo Go)
- **Android**: All Android devices (via Expo Go)
- **Web**: Limited support (some features may not work)

## 🔄 State Management

The app uses Zustand for state management:
- **Garage Store**: Manages saved cars
- **Swipe Queue Store**: Manages cars in the swipe queue

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try clearing cache and restarting: `npx expo start --clear`
4. Check that your Node.js version is compatible

## 🚀 Deployment

To build for production:

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

## 📄 License

This project is for internal use and collaboration.

---

**Happy coding! 🚗✨** 