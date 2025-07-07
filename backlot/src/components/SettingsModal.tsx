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
import { useTheme } from '../context/ThemeContext';
import { TextStyles } from '../constants/Typography';

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
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.settingsItem, borderBottomColor: colors.settingsItemBorder }]}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.settingsIconBg }]}>
          <Ionicons name={icon} size={scaledSize(20)} color={colors.settingsIcon} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {showValue && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{showValue}</Text>}
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={switchValue ? colors.textInverse : colors.textInverse}
          />
        ) : (
          showChevron && <Ionicons name="chevron-forward" size={scaledSize(16)} color={colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { colors, theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    newCarAlerts: 'all',
    priceDropWarnings: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const [swipePreferences, setSwipePreferences] = useState({
    allowUndo: true,
  });

  const [location, setLocation] = useState({
    allowLocation: true,
  });

  const [currency, setCurrency] = useState({
    currency: 'USD',
    units: 'miles',
  });

  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Handle sign out logic here
          if (__DEV__) console.log('User signed out');
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
          if (__DEV__) console.log('History cleared');
        }},
      ]
    );
  };

  const handleThemeSelection = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    setShowThemeModal(false);
    if (__DEV__) console.log('Theme changed to:', selectedTheme);
  };

  const getThemeDisplayValue = (currentTheme: string) => {
    switch (currentTheme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      default: return 'Light Mode';
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.settingsSection }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.settingsItem, borderColor: colors.border }]}>
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={scaledSize(24)} color={colors.text} />
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
                title="Allow Undo Last Swipe"
                icon="arrow-undo-outline"
                showSwitch={true}
                switchValue={swipePreferences.allowUndo}
                onSwitchChange={(value) => setSwipePreferences(prev => ({ ...prev, allowUndo: value }))}
              />
            </>
          )}

          {/* Appearance */}
          {renderSection('Appearance',
            <>
              <SettingItem
                title="Theme"
                subtitle="Follows device setting"
                icon="color-palette-outline"
                showValue={getThemeDisplayValue(theme)}
                onPress={() => setShowThemeModal(true)}
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

        {/* Theme Selection Modal */}
        <Modal
          visible={showThemeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowThemeModal(false)}
        >
          <View style={[styles.themeModalOverlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.themeModalContent, { backgroundColor: colors.modal }]}>
              <View style={styles.themeModalHeader}>
                <Text style={[styles.themeModalTitle, { color: colors.text }]}>Choose Theme</Text>
                <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                  <Ionicons name="close" size={scaledSize(24)} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  theme === 'light' && { borderColor: colors.primary, backgroundColor: colors.primaryLight }
                ]}
                onPress={() => handleThemeSelection('light')}
              >
                <Ionicons 
                  name="sunny-outline" 
                  size={scaledSize(24)} 
                  color={theme === 'light' ? colors.primary : colors.textSecondary} 
                />
                <View style={styles.themeOptionText}>
                  <Text style={[
                    styles.themeOptionTitle,
                    { color: colors.text },
                    theme === 'light' && { color: colors.primary }
                  ]}>
                    Light Mode
                  </Text>
                  <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>Always use light theme</Text>
                </View>
                {theme === 'light' && (
                  <Ionicons name="checkmark" size={scaledSize(20)} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  theme === 'dark' && { borderColor: colors.primary, backgroundColor: colors.primaryLight }
                ]}
                onPress={() => handleThemeSelection('dark')}
              >
                <Ionicons 
                  name="moon-outline" 
                  size={scaledSize(24)} 
                  color={theme === 'dark' ? colors.primary : colors.textSecondary} 
                />
                <View style={styles.themeOptionText}>
                  <Text style={[
                    styles.themeOptionTitle,
                    { color: colors.text },
                    theme === 'dark' && { color: colors.primary }
                  ]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>Always use dark theme</Text>
                </View>
                {theme === 'dark' && (
                  <Ionicons name="checkmark" size={scaledSize(20)} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(12),
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...TextStyles.heading2,
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
    ...TextStyles.overline,
    marginBottom: scaledSize(8),
    paddingHorizontal: scaledSize(16),
  },
  sectionContent: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(16),
    borderBottomWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaledSize(12),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...TextStyles.bodyLarge,
    fontWeight: '500',
    marginBottom: scaledSize(2),
  },
  settingSubtitle: {
    ...TextStyles.bodyMedium,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    ...TextStyles.bodyMedium,
    marginRight: scaledSize(8),
  },
  themeModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeModalContent: {
    padding: scaledSize(20),
    borderRadius: scaledSize(12),
    width: '85%',
    maxWidth: scaledSize(320),
  },
  themeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledSize(20),
  },
  themeModalTitle: {
    ...TextStyles.heading3,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scaledSize(16),
    marginBottom: scaledSize(12),
    borderWidth: 2,
    borderRadius: scaledSize(12),
  },
  themeOptionText: {
    flex: 1,
    marginLeft: scaledSize(12),
  },
  themeOptionTitle: {
    ...TextStyles.bodyLarge,
    fontWeight: '600',
    marginBottom: scaledSize(2),
  },
  themeOptionSubtitle: {
    ...TextStyles.bodyMedium,
  },
});

export default SettingsModal; 