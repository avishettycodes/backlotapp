import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from './SettingsModal';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375; // Base scale on iPhone 8
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

export default function Submit() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Submit a Car</Text>
      </View>
      
      {/* Settings Button */}
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.primary }]}
        onPress={() => setSettingsVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="settings-outline" size={scaledSize(24)} color={colors.textInverse} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Coming soon!</Text>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scaledSize(16),
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: scaledSize(80),
    right: scaledSize(20),
    width: scaledSize(44),
    height: scaledSize(44),
    borderRadius: scaledSize(22),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledSize(20),
  },
  subtitle: {
    fontSize: scaledFontSize(16),
    textAlign: 'center',
  },
}); 