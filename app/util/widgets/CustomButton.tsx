import React from 'react';
import { Pressable, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DescriptionText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';

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
    <DescriptionText text={text.toUpperCase()} color={color} textAlign="center" />
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
    style={({ pressed }) => [baseStyles.iconButton, pressed && baseStyles.pressed, style]}
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
);

export const FloatingActionButton = ({ onPress, icon = 'add' }: { onPress: () => void, icon?: string }) => {
  return (
    <TouchableOpacity style={baseStyles.fab} onPress={onPress}>
      <MaterialIcons name={icon as any} size={24} color="black" />
    </TouchableOpacity>
  );
};