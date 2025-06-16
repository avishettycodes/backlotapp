import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PinchGestureHandler, PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FullscreenImageViewerProps {
  visible: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const AnimatedImage = ({ uri, onLoad }: { uri: string; onLoad: () => void }) => {
  const [loading, setLoading] = useState(true);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateY.value = event.translationY;
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationY) > 100) {
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
      }
    },
  });

  const doubleTapHandler = useAnimatedGestureHandler({
    onActive: () => {
      scale.value = scale.value > 1 ? 
        withTiming(1, { duration: 300 }) : 
        withTiming(2, { duration: 300 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: 1 - Math.abs(translateY.value) / 500,
  }));

  return (
    <TapGestureHandler
      numberOfTaps={2}
      onHandlerStateChange={doubleTapHandler}
    >
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <PanGestureHandler onGestureEvent={panHandler} onHandlerStateChange={panHandler}>
          <Animated.View style={styles.imageWrapper}>
            <PinchGestureHandler onGestureEvent={pinchHandler} onHandlerStateChange={pinchHandler}>
              <Animated.View style={styles.imageWrapper}>
                <Image
                  source={{ uri }}
                  style={styles.image}
                  resizeMode="contain"
                  onLoad={() => {
                    setLoading(false);
                    onLoad();
                  }}
                />
                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1CE1A9" />
                  </View>
                )}
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

export default function FullscreenImageViewer({
  visible,
  images,
  startIndex,
  onClose,
}: FullscreenImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.content}>
          <AnimatedImage
            uri={images[currentIndex]}
            onLoad={handleImageLoad}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}); 