import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native";

export const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
export const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const useExpandUpShrinkDown = (
  visible: boolean,
  duration: number = 150,
) => {
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(visible ? 0 : 100);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.ease),
    });

    translateY.value = withTiming(visible ? 0 : 100, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { shouldRender: visible, animatedStyle };
};

export const useFadeInOut = (
  visible: boolean,
  duration: number = 70,
  maxWidth: number = 24,
) => {
  const scale = useSharedValue(visible ? 1 : 0);
  const width = useSharedValue(visible ? maxWidth : 0);

  useEffect(() => {
    scale.value = withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.ease),
    });

    width.value = withTiming(visible ? maxWidth : 0, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    width: width.value,
  }));

  return { shouldRender: visible, animatedStyle };
};
