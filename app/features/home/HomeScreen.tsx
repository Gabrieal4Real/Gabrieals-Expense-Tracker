import React, { useEffect, useRef, useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { TitleText, BiggerText, TinyText, DescriptionText } from '@/app/util/widgets/CustomText';
import { HorizontalDivider, RoundedBox, VerticalDivider, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { IconButton, TinyButton } from '@/app/util/widgets/CustomButton';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { TransactionType } from '@/app/data/TransactionItem';
import { useHomeViewModel } from './HomeViewModel';
import { CustomBottomSheet } from '@/app/util/widgets/CustomBottomSheet';
import TransactionBottomSheet from './TransactionBottomSheet';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { transactions, loading, error, loadTransactions } = useHomeViewModel();

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    console.log('BottomSheet index:', index);
  }, []);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  const renderTransaction = ({ item }: any) => (
    <RoundedBox style={{ paddingVertical: 12 }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <DescriptionText
            text={"RM " + item.amount.toString()}
            textAlign="left"
          />
          <TinyText text={item.type} color={item.type === TransactionType.Income ? Colors.greenAccent : Colors.redAccent} textAlign="right" />
        </View>
        <TinyText
          text={item.description || 'No description'}
          color={Colors.textPrimary}
          textAlign="left"
          style={{ paddingBottom: 4 }}
        />
      </View>
    </RoundedBox>
  );

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top }]}>
      <TitleText text="Gabrieal's Appspensive" color={Colors.textPrimary} textAlign="center" />

      <RoundedBox style={{ marginVertical: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <BiggerText text="RM 7000" color={Colors.greenAccent} textAlign="center" style={{ paddingVertical: 4, paddingHorizontal: 48 }} />
          <TinyText text="REMAINING" color={Colors.textPrimary} textAlign="center" style={{ paddingBottom: 4 }} />
        </View>

        <IconButton icon="finger-print" size={32} color={Colors.textPrimary} onPress={() => {
          // TODO: Implement fingerprint authentication
        }} />

        <SpacerVertical size={8} />
        <HorizontalDivider />
        <SpacerVertical size={8} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TinyButton text="- Expense" color={Colors.redAccent} onPress={openBottomSheet} style={{ padding: 4 }} />
          <VerticalDivider />
          <TinyButton text="+ Income" color={Colors.greenAccent} onPress={openBottomSheet} style={{ padding: 4 }} />
        </View>
      </RoundedBox>

      <TitleText text="Expenses" color={Colors.textPrimary} textAlign="left" style={{ marginVertical: 8 }} />
      <HorizontalDivider />

      {loading ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.textPrimary} />
        </View>
      ) : error ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <TinyText text={error} color={Colors.redAccent} textAlign="center" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}

      <CustomBottomSheet 
        snapPoints={['90%']}
        ref={bottomSheetRef}
        onChange={handleSheetChange}>
        <TransactionBottomSheet />
      </CustomBottomSheet>
    </View>
  );
}