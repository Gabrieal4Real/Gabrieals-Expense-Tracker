import { baseStyles } from '@/constants/Styles';
import React, { ReactNode } from 'react';
import { View, StyleProp, ViewStyle, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TinyText, TinierText } from '@/app/util/widgets/CustomText';

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

export const SpacerHorizontal = ({ size = 8 }: { size?: number }) => (
  <View style={{ width: size }} />
);

export const SpacerVertical = ({ size = 8 }: { size?: number }) => (
  <View style={{ height: size }} />
);

type FilterChipGroupProps<T> = {
  title?: string;
  items: T[];
  selected: T;
  onSelectedChange: (item: T) => void;
  extractLabel?: (item: T) => string;
  style?: ViewStyle;
};

export function FilterChipGroup<T extends string | number>({
  title,
  items,
  selected,
  onSelectedChange,
  extractLabel = (item) => String(item),
  style,
}: FilterChipGroupProps<T>) {
  return (
    <>
    {title && <TinyText text={title} color={Colors.textPrimary} />}
      <View style={[baseStyles.categoryContainer, style]}>
        {items.map((item) => {
          const isSelected = selected === item;
          return (
          <Pressable
            key={String(item)}
            onPress={() => onSelectedChange(item)}
            style={({ pressed }) => [
              baseStyles.categoryButton,
              isSelected && baseStyles.selectedCategoryButton,
              pressed && baseStyles.pressed,
            ]}
          >
            <TinyText text={extractLabel(item)} color={isSelected ? Colors.black : Colors.textPrimary} textAlign="center" />
          </Pressable>
        );
      })}
    </View>
    </>
  );
}


  export const CategoryLabel = ({ title = "" }: { title: string }) => (
    <View style={[baseStyles.categoryDisplay]}>
      <TinierText text={title} color={Colors.white} textAlign="center" />
    </View>
  );