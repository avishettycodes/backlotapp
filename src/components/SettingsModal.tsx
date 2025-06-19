import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
const scaledSize = (size: number) => size * scale;
const scaledFontSize = (size: number) => size * scale;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showChevron?: boolean;
  showValue?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  showChevron = true,
  showValue,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={showSwitch}
  >
    <View style={styles.settingItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={scaledSize(20)} color="#3b82f6" />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingItemRight}>
      {showValue && <Text style={styles.settingValue}>{showValue}</Text>}
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
          thumbColor={switchValue ? '#ffffff' : '#ffffff'}
        />
      ) : (
        showChevron && <Ionicons name="chevron-forward" size={scaledSize(16)} color="#9ca3af" />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState({
    newCarAlerts: 'all',
    priceDropWarnings: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const [swipePreferences, setSwipePreferences] = useState({
    sensitivity: 'normal',
    allowUndo: true,
    animationSpeed: 'normal',
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    cardStyle: 'rounded',
    fontSize: 'medium',
  });

  const [location, setLocation] = useState({
    allowLocation: true,
  });

  const [currency, setCurrency] = useState({
    currency: 'USD',
    units: 'miles',
  });

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Handle sign out logic here
          console.log('User signed out');
        }},
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will clear all your search and swipe history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          // Handle clear history logic here
          console.log('History cleared');
        }},
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={scaledSize(24)} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Account & Profile */}
          {renderSection('Account & Profile',
            <>
              <SettingItem
                title="Edit Profile"
                subtitle="Name, email, phone"
                icon="person-outline"
                onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
              />
              <SettingItem
                title="Security"
                subtitle="Password & biometric unlock"
                icon="shield-outline"
                onPress={() => Alert.alert('Security', 'Security settings coming soon!')}
              />
              <SettingItem
                title="Sign Out"
                icon="log-out-outline"
                onPress={handleSignOut}
                showChevron={false}
              />
            </>
          )}

          {/* Notifications */}
          {renderSection('Notifications',
            <>
              <SettingItem
                title="New Car Alerts"
                subtitle="All cars"
                icon="notifications-outline"
                showValue={notifications.newCarAlerts === 'all' ? 'All' : notifications.newCarAlerts === 'great' ? 'Great Deals' : 'Off'}
                onPress={() => Alert.alert('New Car Alerts', 'Alert preferences coming soon!')}
              />
              <SettingItem
                title="Price Drop Warnings"
                icon="trending-down-outline"
                showSwitch={true}
                switchValue={notifications.priceDropWarnings}
                onSwitchChange={(value) => setNotifications(prev => ({ ...prev, priceDropWarnings: value }))}
              />
              <SettingItem
                title="Push Notifications"
                icon="phone-portrait-outline"
                showSwitch={true}
                switchValue={notifications.pushNotifications}
                onSwitchChange={(value) => setNotifications(prev => ({ ...prev, pushNotifications: value }))}
              />
              <SettingItem
                title="Email Notifications"
                icon="mail-outline"
                showSwitch={true}
                switchValue={notifications.emailNotifications}
                onSwitchChange={(value) => setNotifications(prev => ({ ...prev, emailNotifications: value }))}
              />
            </>
          )}

          {/* Swipe Preferences */}
          {renderSection('Swipe Preferences',
            <>
              <SettingItem
                title="Swipe Sensitivity"
                subtitle="Normal"
                icon="hand-left-outline"
                showValue={swipePreferences.sensitivity}
                onPress={() => Alert.alert('Swipe Sensitivity', 'Sensitivity settings coming soon!')}
              />
              <SettingItem
                title="Allow Undo Last Swipe"
                icon="arrow-undo-outline"
                showSwitch={true}
                switchValue={swipePreferences.allowUndo}
                onSwitchChange={(value) => setSwipePreferences(prev => ({ ...prev, allowUndo: value }))}
              />
              <SettingItem
                title="Animation Speed"
                subtitle="Normal"
                icon="speedometer-outline"
                showValue={swipePreferences.animationSpeed}
                onPress={() => Alert.alert('Animation Speed', 'Animation settings coming soon!')}
              />
            </>
          )}

          {/* Appearance */}
          {renderSection('Appearance',
            <>
              <SettingItem
                title="Theme"
                subtitle="System default"
                icon="color-palette-outline"
                showValue={appearance.theme === 'system' ? 'System' : appearance.theme === 'dark' ? 'Dark' : 'Light'}
                onPress={() => Alert.alert('Theme', 'Theme settings coming soon!')}
              />
              <SettingItem
                title="Card Style"
                subtitle="Rounded corners"
                icon="card-outline"
                showValue={appearance.cardStyle === 'rounded' ? 'Rounded' : 'Square'}
                onPress={() => Alert.alert('Card Style', 'Card style settings coming soon!')}
              />
              <SettingItem
                title="Font Size"
                subtitle="Medium"
                icon="text-outline"
                showValue={appearance.fontSize === 'medium' ? 'Medium' : appearance.fontSize === 'small' ? 'Small' : 'Large'}
                onPress={() => Alert.alert('Font Size', 'Font size settings coming soon!')}
              />
            </>
          )}

          {/* Location & Privacy */}
          {renderSection('Location & Privacy',
            <>
              <SettingItem
                title="Allow Location"
                subtitle="Show nearby cars"
                icon="location-outline"
                showSwitch={true}
                switchValue={location.allowLocation}
                onSwitchChange={(value) => setLocation(prev => ({ ...prev, allowLocation: value }))}
              />
              <SettingItem
                title="Clear History"
                subtitle="Search & swipe history"
                icon="trash-outline"
                onPress={handleClearHistory}
                showChevron={false}
              />
              <SettingItem
                title="Data Sharing"
                subtitle="Privacy preferences"
                icon="shield-checkmark-outline"
                onPress={() => Alert.alert('Data Sharing', 'Privacy settings coming soon!')}
              />
            </>
          )}

          {/* Currency & Units */}
          {renderSection('Currency & Units',
            <>
              <SettingItem
                title="Currency"
                subtitle="US Dollar"
                icon="cash-outline"
                showValue={currency.currency}
                onPress={() => Alert.alert('Currency', 'Currency settings coming soon!')}
              />
              <SettingItem
                title="Distance Units"
                subtitle="Miles"
                icon="map-outline"
                showValue={currency.units === 'miles' ? 'Miles' : 'Kilometers'}
                onPress={() => Alert.alert('Distance Units', 'Unit settings coming soon!')}
              />
            </>
          )}

          {/* Support & Feedback */}
          {renderSection('Support & Feedback',
            <>
              <SettingItem
                title="Help Center"
                subtitle="FAQ & tutorials"
                icon="help-circle-outline"
                onPress={() => Alert.alert('Help Center', 'Help center coming soon!')}
              />
              <SettingItem
                title="Report a Bug"
                icon="bug-outline"
                onPress={() => Alert.alert('Report Bug', 'Bug reporting coming soon!')}
              />
              <SettingItem
                title="Send Feedback"
                icon="chatbubble-outline"
                onPress={() => Alert.alert('Send Feedback', 'Feedback form coming soon!')}
              />
              <SettingItem
                title="Rate App"
                icon="star-outline"
                onPress={() => Alert.alert('Rate App', 'App store rating coming soon!')}
              />
            </>
          )}

          {/* About */}
          {renderSection('About',
            <>
              <SettingItem
                title="Version"
                subtitle="1.0.0"
                icon="information-circle-outline"
                showChevron={false}
              />
              <SettingItem
                title="Terms of Service"
                icon="document-text-outline"
                onPress={() => Alert.alert('Terms of Service', 'Terms coming soon!')}
              />
              <SettingItem
                title="Privacy Policy"
                icon="lock-closed-outline"
                onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(12),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: scaledFontSize(20),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: scaledSize(4),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: scaledSize(24),
  },
  sectionTitle: {
    fontSize: scaledFontSize(14),
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: scaledSize(8),
    paddingHorizontal: scaledSize(16),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(16),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: scaledSize(32),
    height: scaledSize(32),
    borderRadius: scaledSize(8),
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaledSize(12),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: scaledFontSize(16),
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: scaledSize(2),
  },
  settingSubtitle: {
    fontSize: scaledFontSize(14),
    color: '#6b7280',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: scaledFontSize(14),
    color: '#6b7280',
    marginRight: scaledSize(8),
  },
});

export default SettingsModal; 