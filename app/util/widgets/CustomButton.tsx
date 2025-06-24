import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TinyText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';

interface TinyButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
}

interface IconButtonProps {
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const TinyButton: React.FC<TinyButtonProps> = ({
  text,
  onPress,
  style,
  color = Colors.textPrimary,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.tinyButton,
      pressed && styles.pressed,
      style,
    ]}>
    <TinyText text={text} color={color} textAlign="center" />
  </Pressable>
);

export const IconButton: React.FC<IconButtonProps> = ({
  icon = 'finger-print',
  onPress = () => console.log('Icon pressed'),
  size = 32,
  color = Colors.textPrimary,
  style,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed, style]}
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
);

const styles = StyleSheet.create({
  tinyButton: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.6,
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: '30%',
  },
});