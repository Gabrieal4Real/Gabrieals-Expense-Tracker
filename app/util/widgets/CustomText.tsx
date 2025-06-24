import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type TypographyProps = TextProps & {
  text: string;
  color?: string;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
};

export const TitleText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'left', ...props }) => {
  return (
    <Text 
      style={[styles.titleText, { color: color || Colors.textPrimary, textAlign }, style]} 
      {...props}
    >
      {text.toUpperCase()}
    </Text>
  );
};

export const BiggerText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'center', ...props }) => (
  <Text
    {...props}
    style={[styles.biggerText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text.toUpperCase()}
  </Text>
);

export const BigText: React.FC<TypographyProps> = ({ text, style, numberOfLines, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    numberOfLines={numberOfLines}
    style={[styles.bigText, { color: Colors.textSecondary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const SubtitleText: React.FC<TypographyProps> = ({ text, style, color, numberOfLines, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    numberOfLines={numberOfLines}
    style={[styles.subtitleText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const DescriptionText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    style={[styles.descriptionText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const TinyText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    style={[styles.tinyText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'PoppinsBold',
    fontSize: 18,
    letterSpacing: 4,
    lineHeight: 24,
  },
  biggerText: {
    fontFamily: 'PoppinsExtraBold',
    fontSize: 24,
    letterSpacing: 10,
    lineHeight: 30,
  },
  bigText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  subtitleText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  descriptionText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    lineHeight: 20,
  },
  tinyText: {
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
    lineHeight: 18,
  },
});
