import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TinyText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';

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

interface CustomButtonProps {
  text: string;
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
  disabled?: boolean;
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
      pressed && baseStyles.pressed,
      style,
    ]}>
    <TinyText text={text} color={color} textAlign="center" />
  </Pressable>
);

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress = () => console.log('Button pressed'),
  style,
  color = Colors.textPrimary,
  disabled = false,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      baseStyles.button,
      pressed && baseStyles.pressed,
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
    style={({ pressed }) => [styles.iconButton, pressed && baseStyles.pressed, style]}
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
);

export const FloatingActionButton = ({ onPress, icon = 'add' }: { onPress: () => void, icon?: string }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <MaterialIcons name={icon as any} size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tinyButton: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: Colors.textSecondary,
    width: 48,
    height: 48,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});