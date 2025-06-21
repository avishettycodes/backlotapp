import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375; // Base scale on iPhone 8
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

export default function Submit() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Coming soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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