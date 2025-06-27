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
      style={[textStyles.titleText, { color: color || Colors.textPrimary, textAlign }, style]} 
      {...props}
    >
      {text.toUpperCase()}
    </Text>
  );
};

export const BiggerText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'center', ...props }) => (
  <Text
    {...props}
    style={[textStyles.biggerText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text.toUpperCase()}
  </Text>
);

export const BigText: React.FC<TypographyProps> = ({ text, style, color, numberOfLines, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    numberOfLines={numberOfLines}
    style={[textStyles.bigText, { color: color || Colors.textSecondary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const SubtitleText: React.FC<TypographyProps> = ({ text, style, color, numberOfLines, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    numberOfLines={numberOfLines}
    style={[textStyles.subtitleText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const DescriptionText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    style={[textStyles.descriptionText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const TinyText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    style={[textStyles.tinyText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const TinierText: React.FC<TypographyProps> = ({ text, style, color, textAlign = 'left', ...props }) => (
  <Text
    {...props}
    style={[textStyles.tinierText, { color: color || Colors.textPrimary, textAlign }, style]}
  >
    {text}
  </Text>
);

export const textStyles = StyleSheet.create({
  titleText: {
    fontFamily: 'PoppinsBold',
    fontSize: 18,
    letterSpacing: 4,
    lineHeight: 24,
    includeFontPadding: false,
  },
  biggerText: {
    fontFamily: 'PoppinsExtraBold',
    fontSize: 22,
    letterSpacing: 4,
    lineHeight: 30,
    includeFontPadding: false,
  },
  bigText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 20,
    lineHeight: 28,
    includeFontPadding: false,
  },
  subtitleText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 16,
    lineHeight: 22,
    includeFontPadding: false,
  },
  descriptionText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },
  tinyText: {
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
    lineHeight: 18,
    includeFontPadding: false,
  },
  tinierText: {
    fontFamily: 'PoppinsRegular',
    fontSize: 10,
    lineHeight: 14,
    includeFontPadding: false,
  },
});