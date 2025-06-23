import { baseStyles } from '@/constants/Styles';
import React, { ReactNode } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

type RoundedBoxProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const RoundedBox = ({ children, style }: RoundedBoxProps) => {
  return <View style={[baseStyles.baseRoundedBox, style]}>{children}</View>;
}