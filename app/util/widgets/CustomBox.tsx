import { baseStyles } from "@/constants/Styles";
import React, { ReactNode } from "react";
import { View, StyleProp, ViewStyle, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { TinyText, TinierText } from "@/app/util/widgets/CustomText";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { TitleText } from "@/app/util/widgets/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { navigateBack } from "@/app/util/systemFunctions/NavigationUtil";

export const TitleBox = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <Pressable
        onPress={() => {
          navigateBack();
        }}
        style={({ pressed }) => [pressed && baseStyles.pressed]}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={Colors.textPrimary}
        />
      </Pressable>
      <TitleText text={title} color={Colors.textPrimary} textAlign="center" />
      <SpacerHorizontal size={24} />
    </View>
  );
};

export const RoundedBox = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return <View style={[baseStyles.baseRoundedBox, style]}>{children}</View>;
};

export const CustomBlurView = ({
  children,
  isShowBlur,
}: {
  children: ReactNode;
  isShowBlur: boolean;
}) => {
  return (
    <View>
      {children}
      {isShowBlur && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            marginBottom: 16,
            ...StyleSheet.absoluteFillObject,
          }}
        >
          <BlurView
            intensity={20}
            experimentalBlurMethod="dimezisBlurView"
            tint="dark"
            style={{
              borderRadius: 12,
              overflow: "hidden",
              ...StyleSheet.absoluteFillObject,
            }}
          />
          <TitleText
            text="Add a transaction to see statistics"
            color={Colors.white}
            textAlign="center"
            style={{
              backgroundColor: Colors.lightMaroon,
              padding: 16,
              borderRadius: 12,
            }}
          />
        </View>
      )}
    </View>
  );
};

export const HorizontalDivider = ({ style }: { style?: ViewStyle }) => {
  return (
    <View
      style={{ height: 1.5, backgroundColor: Colors.borderStroke, ...style }}
    />
  );
};

export const VerticalDivider = () => {
  return (
    <View
      style={{
        width: 1.5,
        backgroundColor: Colors.borderStroke,
        alignSelf: "stretch",
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

export function FilterChipGroup<T extends string | number>({
  title,
  items,
  selected,
  onSelectedChange,
  extractLabel = (item) => String(item),
  style,
}: {
  title?: string;
  items: T[];
  selected: T;
  onSelectedChange: (item: T) => void;
  extractLabel?: (item: T) => string;
  style?: ViewStyle;
}) {
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
              <TinyText
                text={extractLabel(item)}
                color={isSelected ? Colors.black : Colors.textPrimary}
                textAlign="center"
              />
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

export const CategoryLabel = ({
  title = "",
  onClick,
  style,
}: {
  title: string;
  onClick?: () => void;
  style?: ViewStyle;
}) => (
  <Pressable
    onPress={onClick}
    style={({ pressed }) => [
      baseStyles.categoryDisplay,
      pressed && baseStyles.pressed,
      style,
    ]}
  >
    <TinierText
      text={title.toUpperCase()}
      color={Colors.white}
      textAlign="center"
    />
  </Pressable>
);
