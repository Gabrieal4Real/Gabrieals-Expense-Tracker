import React, { useEffect, useRef, useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { TitleText, BiggerText, TinyText, DescriptionText } from '@/app/util/widgets/CustomText';
import { HorizontalDivider, RoundedBox, VerticalDivider, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { IconButton, TinyButton } from '@/app/util/widgets/CustomButton';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';
import { CustomBottomSheet } from '@/app/util/widgets/CustomBottomSheet';
import TransactionBottomSheet from '../../transactionBottomSheet/view/TransactionBottomSheet';
import { useHomeViewModel } from '../viewmodel/HomeViewModel';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { uiState, loadTransactions, updateUiState } = useHomeViewModel();
  const { transactions, loading, error, type } = uiState;

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSheetChange = useCallback((index: number) => {
    console.log('BottomSheet index:', index);
  }, []);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  const handleTransactionAdded = useCallback(() => {
    bottomSheetRef.current?.close();
    loadTransactions();
    console.log('Transaction added successfully!');
  }, [loadTransactions]);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <RoundedBox style={{ paddingVertical: 12 }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <DescriptionText text={`RM ${item.amount.toFixed(2)}`} textAlign="left" />
          <TinyText
            text={item.type}
            color={item.type === TransactionType.Income ? Colors.greenAccent : Colors.redAccent}
            textAlign="right"
          />
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
          <BiggerText
            text="RM 7000"
            color={Colors.greenAccent}
            textAlign="center"
            style={{ paddingVertical: 4, paddingHorizontal: 48 }}
          />
          <TinyText text="REMAINING" color={Colors.textPrimary} textAlign="center" style={{ paddingBottom: 4 }} />
        </View>

        <IconButton icon="finger-print" size={32} color={Colors.textPrimary} onPress={() => {}} />

        <SpacerVertical size={8} />
        <HorizontalDivider />
        <SpacerVertical size={8} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TinyButton text="- Expense" color={Colors.redAccent} onPress={
            () => {
              updateUiState({ type: TransactionType.Expense });
              openBottomSheet();
            }
          } style={{ padding: 4 }} />
          <VerticalDivider />
          <TinyButton text="+ Income" color={Colors.greenAccent} onPress={
            () => {
              updateUiState({ type: TransactionType.Income });
              openBottomSheet();
            }
          } style={{ padding: 4 }} />
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
          data={[...transactions].reverse()}
          renderItem={renderTransaction}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}

      <CustomBottomSheet snapPoints={['90%']} ref={bottomSheetRef} onChange={handleSheetChange}>
        <TransactionBottomSheet transactionType={type} onTransactionAdded={handleTransactionAdded} />
      </CustomBottomSheet>
    </View>
  );
}