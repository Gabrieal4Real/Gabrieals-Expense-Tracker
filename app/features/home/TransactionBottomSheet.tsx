import React from 'react';
import { View } from 'react-native';
import { TinyText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';

export default function TransactionBottomSheet() {
  return (
    <View style={{ padding: 16 }}>
      <TinyText text="Transaction" color={Colors.textPrimary} textAlign="left" />
    </View>
  );
}
