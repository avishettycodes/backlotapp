import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0,
  },
  defaultSemiBold: {
    fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0,
  },
  title: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.01,
  },
  subtitle: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.01,
  },
  link: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
    color: '#0a7ea4',
    letterSpacing: 0,
  },
});
