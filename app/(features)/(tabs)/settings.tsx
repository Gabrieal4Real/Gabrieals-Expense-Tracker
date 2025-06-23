import React from 'react';
import { TitleText } from '@/app/util/widgets/custom-text';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={baseStyles.baseBackground}>
      <TitleText text="Settings" color={Colors.textPrimary} />
    </SafeAreaView>
  );
}