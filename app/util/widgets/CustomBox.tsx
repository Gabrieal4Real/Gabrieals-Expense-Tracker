import { baseStyles } from '@/constants/Styles';
import React, { ReactNode } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

type RoundedBoxProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const RoundedBox = ({ children, style }: RoundedBoxProps) => {
  return <View style={[baseStyles.baseRoundedBox, style]}>{children}</View>;
}

export const HorizontalDivider = () => {
  return <View
  style={{
    height: 1.5,
    backgroundColor: Colors.borderStroke,
  }}
/>
}

export const VerticalDivider = () => {
  return (
    <View
      style={{
        width: 1.5,
        backgroundColor: Colors.borderStroke,
        alignSelf: 'stretch',
      }}
    />
  );
};

export const Spacer = ({ size = 8 }: { size?: number }) => (
  <View style={{ width: size }} />
);

export const SpacerVertical = ({ size = 8 }: { size?: number }) => (
  <View style={{ height: size }} />
);