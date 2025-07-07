import { Dimensions, Platform } from 'react-native';

// Screen dimensions
export const SCREEN_DIMENSIONS = Dimensions.get('window');
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = SCREEN_DIMENSIONS;

// Base design dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Responsive scaling
export const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);

// Scaling functions
export const scaledSize = (size: number): number => Math.round(size * scale);
export const scaledFontSize = (size: number): number => Math.round(size * scale);

// Spacing constants
export const SPACING = {
  xs: scaledSize(4),
  sm: scaledSize(8),
  md: scaledSize(16),
  lg: scaledSize(24),
  xl: scaledSize(32),
  xxl: scaledSize(48),
  xxxl: scaledSize(64),
} as const;

// Border radius constants
export const BORDER_RADIUS = {
  sm: scaledSize(4),
  md: scaledSize(8),
  lg: scaledSize(12),
  xl: scaledSize(16),
  xxl: scaledSize(20),
  round: scaledSize(999),
} as const;

// Tab bar constants
export const TAB_BAR = {
  height: Platform.OS === 'ios' ? scaledSize(85) : scaledSize(65),
  iconSize: scaledSize(24),
  iconSizeFocused: scaledSize(26),
  fontSize: scaledSize(11),
  paddingVertical: scaledSize(8),
  paddingHorizontal: scaledSize(8),
  borderRadius: scaledSize(16),
} as const;

// Card constants
export const CARD = {
  width: SCREEN_WIDTH * 0.9,
  height: SCREEN_HEIGHT * 0.65,
  borderRadius: scaledSize(20),
} as const;

// Card shadow (for View components only)
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: scaledSize(4) },
  shadowOpacity: 0.15,
  shadowRadius: scaledSize(8),
  elevation: 6,
} as const;

// Common layout helpers
export const SAFE_AREA_PADDING = {
  top: scaledSize(16),
  bottom: scaledSize(16),
  left: scaledSize(16),
  right: scaledSize(16),
} as const;

// Content padding that accounts for tab bar
export const CONTENT_PADDING = {
  bottom: TAB_BAR.height + scaledSize(16),
} as const;

// Icon sizes
export const ICON_SIZES = {
  xs: scaledSize(12),
  sm: scaledSize(16),
  md: scaledSize(20),
  lg: scaledSize(24),
  xl: scaledSize(28),
  xxl: scaledSize(32),
} as const;

// Button constants
export const BUTTON = {
  height: scaledSize(48),
  borderRadius: scaledSize(12),
  paddingHorizontal: scaledSize(16),
  paddingVertical: scaledSize(12),
  fontSize: scaledSize(16),
} as const;

// Input constants
export const INPUT = {
  height: scaledSize(48),
  borderRadius: scaledSize(8),
  paddingHorizontal: scaledSize(16),
  paddingVertical: scaledSize(12),
  fontSize: scaledSize(16),
  borderWidth: 1,
} as const;

// Modal constants
export const MODAL = {
  borderRadius: scaledSize(16),
  paddingHorizontal: scaledSize(20),
  paddingVertical: scaledSize(24),
  maxWidth: SCREEN_WIDTH * 0.9,
} as const;

export default {
  SCREEN_DIMENSIONS,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  scale,
  scaledSize,
  scaledFontSize,
  SPACING,
  BORDER_RADIUS,
  TAB_BAR,
  CARD,
  SAFE_AREA_PADDING,
  CONTENT_PADDING,
  ICON_SIZES,
  BUTTON,
  INPUT,
  MODAL,
}; 