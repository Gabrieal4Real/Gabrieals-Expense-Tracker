import React, { useEffect, useRef, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { TitleText, BiggerText, TinyText, DescriptionText } from '@/app/util/widgets/CustomText';
import { HorizontalDivider, RoundedBox, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { IconButton } from '@/app/util/widgets/CustomButton';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';
import { CustomBottomSheet } from '@/app/util/widgets/CustomBottomSheet';
import TransactionBottomSheet from '../../transactionBottomSheet/view/TransactionBottomSheet';
import { useHomeViewModel } from '../viewmodel/HomeViewModel';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = React.useState(-1);

  const { uiState, loadTransactions, getProfile } = useHomeViewModel();
  const { transactions, loading, error, type, profile } = uiState;

  const remaining = profile?.remaining ?? 0;
  const remainingText = `RM ${remaining.toFixed(2).replace('.00', '')}`;
  const remainingColor = remaining >= 0 ? Colors.greenAccent : Colors.redAccent;

  useEffect(() => {
    loadTransactions();
    getProfile();
  }, [loadTransactions, getProfile]);

  const handleSheetChange = useCallback((index: number) => {
    console.log('BottomSheet index:', index);
    setBottomSheetIndex(index);
  }, []);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const handleTransactionAdded = useCallback(() => {
    closeBottomSheet();
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
            text={remainingText}
            color={remainingColor}
            textAlign="center"
            style={{ paddingVertical: 4, paddingHorizontal: 48 }}
          />
          <TinyText text={"Remaining".toUpperCase()} color={Colors.textPrimary} textAlign="center" style={{ paddingBottom: 4 }} />
        </View>

        <IconButton icon="finger-print" size={32} color={Colors.textPrimary} onPress={() => {}} />
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
        transactions.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/nothing_here_yet.webp')}
              style={{ height: 300, right: 8 }}
              resizeMode="contain"
            />
            <SpacerVertical size={8} />
            <TinyText text="No transactions yet" color={Colors.textPrimary} textAlign="center" />
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
        )
      )}

      <CustomBottomSheet index={bottomSheetIndex} snapPoints={['90%']} ref={bottomSheetRef} onChange={handleSheetChange}>
        <TransactionBottomSheet type={type} onTransactionAdded={handleTransactionAdded} />
      </CustomBottomSheet>

      <FloatingActionButton
        onPress={bottomSheetIndex === -1 ? openBottomSheet : closeBottomSheet}
        icon={bottomSheetIndex === -1 ? 'add' : 'close'}
      />
    </View>
  );
}