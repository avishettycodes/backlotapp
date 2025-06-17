import { BottomTabView } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

export function CustomTabView(props: any) {
  const {
    safeAreaInsets,
    detachInactiveScreens = Platform.OS === 'web',
    ...rest
  } = props;

  return (
    <BottomTabView
      {...rest}
      safeAreaInsets={safeAreaInsets}
      detachInactiveScreens={detachInactiveScreens}
    />
  );
} 