import { Platform } from 'react-native';

// Human-Centered Typography System
export const FontFamilies = {
  // Primary brand font - Professional, readable for headings
  primary: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
  }),
  
  // Secondary font - Warm, friendly for body text
  secondary: Platform.select({
    ios: 'SF Pro Text',
    android: 'Open Sans',
    default: '"Open Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  }),
  
  // Accent font - Distinctive yet approachable for special elements
  accent: Platform.select({
    ios: 'Poppins',
    android: 'Poppins',
    default: '"Poppins", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  }),
  
  // Monospace for technical data - Clean and readable
  mono: Platform.select({
    ios: 'SF Mono',
    android: 'JetBrains Mono',
    default: '"JetBrains Mono", "SF Mono", "Consolas", "Monaco", monospace',
  }),
  
  // Display font for large headers - Bold and confident
  display: Platform.select({
    ios: 'Playfair Display',
    android: 'Playfair Display',
    default: '"Playfair Display", "Georgia", serif',
  })
};

// Font Weights
export const FontWeights = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// Refined font sizing for human-friendly reading
const scale = (size: number) => {
  // Subtle scaling for optimal readability
  return size * 1.05;
};

// Human-Centered Typography Scale
export const FontSizes = {
  // Display sizes for hero sections - more refined
  display: {
    large: scale(36),
    medium: scale(32),
    small: scale(28),
  },
  
  // Heading sizes - better hierarchy
  heading: {
    h1: scale(28),
    h2: scale(24),
    h3: scale(20),
    h4: scale(18),
    h5: scale(16),
    h6: scale(14),
  },
  
  // Body text - optimized for readability
  body: {
    large: scale(18),
    medium: scale(16),
    small: scale(14),
  },
  
  // UI elements - refined for interaction
  ui: {
    button: scale(16),
    caption: scale(13),
    overline: scale(12),
  }
};

// Line Heights - optimized for readability
export const LineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.65,
  loose: 1.8,
};

// Letter Spacing - refined for better readability
export const LetterSpacing = {
  tighter: -0.02,
  tight: -0.01,
  normal: 0,
  wide: 0.01,
  wider: 0.02,
  widest: 0.05,
};

// Human-Friendly Text Styles - polished and professional
export const TextStyles = {
  // Display styles - for hero sections and main headlines
  displayLarge: {
    fontFamily: FontFamilies.display,
    fontSize: FontSizes.display.large,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.display.large * LineHeights.tight,
    letterSpacing: LetterSpacing.tight,
  },
  
  displayMedium: {
    fontFamily: FontFamilies.display,
    fontSize: FontSizes.display.medium,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.display.medium * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Heading styles - clear hierarchy and refined spacing
  heading1: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.heading.h1,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.heading.h1 * LineHeights.normal,
    letterSpacing: LetterSpacing.tight,
  },
  
  heading2: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.heading.h2,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.heading.h2 * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  heading3: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.heading.h3,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.heading.h3 * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Body styles - comfortable reading experience
  bodyLarge: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.body.large,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.body.large * LineHeights.relaxed,
    letterSpacing: LetterSpacing.normal,
  },
  
  bodyMedium: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.body.medium,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.body.medium * LineHeights.relaxed,
    letterSpacing: LetterSpacing.normal,
  },
  
  bodySmall: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.body.small,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.body.small * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Special styles - distinctive yet approachable
  accent: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.body.medium,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.body.medium * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  },
  
  monospace: {
    fontFamily: FontFamilies.mono,
    fontSize: FontSizes.body.medium,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.body.medium * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // UI elements - clear and inviting
  button: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.ui.button,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.ui.button * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  },
  
  caption: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.ui.caption,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.ui.caption * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  overline: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.ui.overline,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.ui.overline * LineHeights.normal,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  
  // Brand-specific styles - polished and professional
  price: {
    fontFamily: FontFamilies.mono,
    fontSize: FontSizes.heading.h3,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.heading.h3 * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  carTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.heading.h2,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.heading.h2 * LineHeights.normal,
    letterSpacing: LetterSpacing.tight,
  },
  
  stepTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.heading.h1,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.heading.h1 * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  label: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.body.medium,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.body.medium * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  }
}; 