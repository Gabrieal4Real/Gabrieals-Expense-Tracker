import React, { forwardRef, useContext, useState } from "react";
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

interface CustomBottomSheetProps {
  index: number;
  children: React.ReactNode;
  snapPoints?: string[];
  onChange?: (index: number) => void;
  backgroundColor?: string;
  contentContainerStyle?: ViewStyle;
}

const CustomBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="close"
    opacity={0.5}
  />
);

export const CustomBottomSheet = forwardRef<
  BottomSheet,
  CustomBottomSheetProps
>((props, ref) => {
  const {
    index,
    children,
    snapPoints = ["65%"],
    onChange,
    backgroundColor = Colors.bottomSheetBackground,
    contentContainerStyle,
  } = props;

  return (
    <BottomSheet
      ref={ref}
      index={index}
      snapPoints={snapPoints}
      onChange={onChange}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: Colors.placeholder }}
      backgroundStyle={{ backgroundColor }}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={contentContainerStyle}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

export const openBottomSheet = (ref: React.RefObject<BottomSheet | null>) => {
    ref.current?.expand();
};

export const closeBottomSheet = (ref: React.RefObject<BottomSheet | null>) => {
  ref.current?.close();
};