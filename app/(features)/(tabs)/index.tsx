import React from 'react';
import { TitleText, BiggerText, TinyText } from '@/app/util/widgets/custom-text';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoundedBox } from '@/app/util/widgets/custom-box';
import { View } from 'react-native';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={baseStyles.baseBackground}>
      <TitleText text="Gabrieal's Appspensive" color={Colors.textPrimary} textAlign="center" />
      <RoundedBox style={{ marginVertical: 16, paddingVertical: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <BiggerText text="RM 7000" color={Colors.greenAccent} textAlign="center" style={{ paddingBottom: 4, paddingHorizontal: 48 }} />
          <TinyText text="REMAINING" color={Colors.textPrimary} textAlign="center"/>
        </View>

        <Pressable
          onPress={() => console.log('Fingerprint pressed')}
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
          }}
          android_ripple={{ color: Colors.borderStroke, borderless: true }}
        >
          <Ionicons name="finger-print" size={32} color={Colors.textPrimary} />
        </Pressable>
      </RoundedBox>
    </SafeAreaView>
  );
}