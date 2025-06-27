import React, { useEffect, useRef, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { TitleText, BiggerText, TinyText, SubtitleText } from '@/app/util/widgets/CustomText';
import { FilterChipGroup, HorizontalDivider, RoundedBox, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { IconButton } from '@/app/util/widgets/CustomButton';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';
import { CustomBottomSheet } from '@/app/util/widgets/CustomBottomSheet';
import TransactionBottomSheet from '../../transactionBottomSheet/view/TransactionBottomSheet';
import { useHomeViewModel } from '../viewmodel/HomeViewModel';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { ExpenseCategory, IncomeCategory } from '@/app/data/TransactionItem';
import { CategoryLabel } from '@/app/util/widgets/CustomBox';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { authenticate, useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = React.useState(-1);

  const homeViewModel = useHomeViewModel();
  const { transactions, loading, error, profile, currentFilter } = homeViewModel.uiState;
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const remaining = profile?.remaining ?? 0;

  const filteredTransactions = transactions.filter(transaction => currentFilter === "All" || transaction.type === currentFilter);

  const handleFabPress = () => {
    if (!isAuthenticated) {
      authenticate(() => {
        setIsAuthenticated(true);
        bottomSheetIndex === -1 ? openBottomSheet() : closeBottomSheet();
      });
    } else {
      bottomSheetIndex === -1 ? openBottomSheet() : closeBottomSheet();
    }
  };

  useEffect(() => {
    homeViewModel.getTransactions();
    homeViewModel.getProfile();
  }, [homeViewModel.getTransactions, homeViewModel.getProfile]);

  const handleSheetChange = useCallback((index: number) => {
    console.log('BottomSheet index:', index);
    setBottomSheetIndex(index);
  }, []);

  const openBottomSheet = () => bottomSheetRef.current?.expand();

  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const handleTransactionAdded = useCallback((type: TransactionType, amount: number, category: ExpenseCategory | IncomeCategory, description: string) => {
    homeViewModel.updateTransaction(type, amount, category, description);
    closeBottomSheet();
  }, []);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <RoundedBox style={{ paddingVertical: 12 }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <SubtitleText text={`RM ${item.amount.toFixed(2)}`} textAlign="left" />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={item.type === TransactionType.Income ? "arrow-down" : "arrow-up"} size={28} color={item.type === TransactionType.Income ? Colors.greenAccent : Colors.redAccent} />
          </View>
        </View>
        <TinyText
          text={item.description || 'No description'}
          color={Colors.textPrimary}
          textAlign="left"
          style={{ paddingBottom: 4 }}
        />
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <TinyText text={format(new Date(item.date), 'dd MMM yyyy hh:mm:ss a').toUpperCase()} color={Colors.textPrimary} textAlign="left" />
          <CategoryLabel title={item.category.valueOf()} />
        </View>
      </View>
    </RoundedBox>
  );

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top }]}>
      <TitleText text="Gabrieal's Appspensive" color={Colors.textPrimary} textAlign="center" />

      <RoundedBox style={{ marginVertical: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <BiggerText
            text={isAuthenticated ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'MYR' }).format(remaining) : '******'}
            color={remaining >= 0 ? Colors.greenAccent : Colors.redAccent}
            textAlign="center"
            style={{ paddingVertical: 4, paddingHorizontal: 48 }}
          />
          <TinyText text={"Remaining".toUpperCase()} color={Colors.textPrimary} textAlign="center" style={{ paddingBottom: 4 }} />
        </View>

        {!isAuthenticated && <IconButton icon="fingerprint" size={32} color={Colors.textPrimary} onPress={() => { authenticate(() => { setIsAuthenticated(true) }) }} />}
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
        (!isAuthenticated || transactions.length === 0) ? (
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
          <View style={{ flex: 1 }}>
            <FilterChipGroup
              items={["All", TransactionType.Expense, TransactionType.Income]}
              selected={currentFilter}
              onSelectedChange={homeViewModel.updateCurrentFilter}
            />

            <FlatList
              data={[...filteredTransactions].reverse()}
              renderItem={renderTransaction}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
              ItemSeparatorComponent={() => <SpacerVertical size={8} />}
              contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
            />
          </View>
        )
      )}

      <CustomBottomSheet index={bottomSheetIndex} snapPoints={['90%']} ref={bottomSheetRef} onChange={handleSheetChange}>
        <TransactionBottomSheet onTransactionAdded={handleTransactionAdded} />
      </CustomBottomSheet>

      <FloatingActionButton
        onPress={handleFabPress}
        icon={bottomSheetIndex === -1 ? 'add' : 'close'}
      />
    </View>
  );
}