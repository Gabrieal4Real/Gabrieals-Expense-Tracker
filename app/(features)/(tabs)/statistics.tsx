import React from 'react';
import { TitleText } from '@/app/util/widgets/custom-text';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseStyles } from '@/constants/Styles';

export default function StatisticsScreen() {
  return (
    <SafeAreaView style={baseStyles.baseBackground}>
      <TitleText text="Statistics" color={Colors.textPrimary} />
    </SafeAreaView>
  );
}