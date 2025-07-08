import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, Image, Pressable, SectionList, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import BottomSheet from '@gorhom/bottom-sheet';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';

import { Transaction, TransactionType, ExpenseCategory, IncomeCategory } from '@/app/data/TransactionItem';
import { useAuth, authenticate } from '@/app/util/systemFunctions/AuthenticationUtil';
import { useHomeViewModel } from '../viewmodel/HomeViewModel';

import { AnimatedIonicons, useExpandUpShrinkDown, useFadeInOut } from '@/app/util/widgets/CustomAnimations';
import { CustomBottomSheet, closeBottomSheet, openBottomSheet } from '@/app/util/widgets/CustomBottomSheet';
import { IconButton, FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { FilterChipGroup, HorizontalDivider, RoundedBox, SpacerVertical, CategoryLabel } from '@/app/util/widgets/CustomBox';
import { TitleText, BiggerText, TinyText, SubtitleText, DescriptionText } from '@/app/util/widgets/CustomText';

import TransactionBottomSheet from '../../transactionBottomSheet/view/TransactionBottomSheet';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const { uiState, ...homeViewModel } = useHomeViewModel();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const fabAnim = useExpandUpShrinkDown(!isAuthenticated || (!uiState.isDeleteMode && isAuthenticated));
  const checkmarkAnim = useFadeInOut(uiState.isDeleteMode && isAuthenticated);
  const cancelDeleteAnim = useExpandUpShrinkDown(uiState.isDeleteMode && isAuthenticated);

  const filteredTransactions = uiState.transactions
    .filter(t => uiState.currentTypeFilter === "All" || t.type === uiState.currentTypeFilter)
    .filter(t => !uiState.currentCategoryFilter || t.category === uiState.currentCategoryFilter);

  const groupedTransactions = homeViewModel.groupedTransactionsByDate(filteredTransactions);

  useEffect(() => {
    homeViewModel.getTransactions();
    homeViewModel.getProfile();
  }, []);

  const handleFabPress = () => {
    if (!isAuthenticated) {
      authenticate(() => {
        setIsAuthenticated(true);
      });
    } else if (uiState.isDeleteMode) {
      homeViewModel.deleteTransactions(uiState.selectedTransactions, uiState.transactions);
      homeViewModel.updateIsDeleteMode(false);
      homeViewModel.clearSelectedTransactions();
    } else {
      bottomSheetIndex === -1 ? openBottomSheet(bottomSheetRef) : closeBottomSheet(bottomSheetRef);
    }
  };

  const handleTransactionAdded = useCallback(
    (type: TransactionType, amount: number, category: ExpenseCategory | IncomeCategory, description: string) => {
      homeViewModel.updateTransaction(type, amount, category, description);
      closeBottomSheet(bottomSheetRef);
    }, []
  );

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const swipeableRef = useRef<any>(null);
    const isSelected = uiState.selectedTransactions.includes(item.id ?? -1);

    useEffect(() => {
      if (uiState.isDeleteMode) {
        swipeableRef.current?.close();
      }
    }, [uiState.isDeleteMode]);


    const handlePress = () => {
      if (uiState.isDeleteMode) {
        homeViewModel.updateSelectedTransaction(uiState.selectedTransactions, item.id ?? -1);
      }
    };

    const handleLongPress = () => {
      homeViewModel.clearSelectedTransactions();
      homeViewModel.updateIsDeleteMode(!uiState.isDeleteMode);
      if (!uiState.isDeleteMode) {
        homeViewModel.updateSelectedTransaction(uiState.selectedTransactions, item.id ?? -1);
      }
    };

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={!uiState.isDeleteMode ? () => (
          <Pressable onPress={() => homeViewModel.deleteTransactions([item.id ?? -1], uiState.transactions)} style={{
            backgroundColor: Colors.red,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingHorizontal: 20}}>
            <Ionicons name="trash" size={24} color={Colors.white} />
          </Pressable>
        ) : undefined}
        friction={2}>
        <Pressable onPress={handlePress} onLongPress={handleLongPress} style={({ pressed }) => [pressed && baseStyles.pressed]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AnimatedIonicons
              name={isSelected ? "checkbox" : "checkbox-outline"}
              size={20}
              color={Colors.white}
              style={[checkmarkAnim.animatedStyle, { marginLeft: uiState.isDeleteMode ? 12 : 0}]}
            />
            <RoundedBox style={{ flex: 1, paddingVertical: 12, borderRadius: 0}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <SubtitleText text={`RM ${item.amount.toFixed(2)}`} textAlign="left" />
                <Ionicons
                  name={item.type === TransactionType.Income ? "arrow-down" : "arrow-up"}
                  size={28}
                  color={item.type === TransactionType.Income ? Colors.greenAccent : Colors.redAccent}
                />
              </View>
              <TinyText text={item.description} color={Colors.textPrimary} textAlign="left" />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <TinyText
                  text={format(new Date(item.date), 'hh:mm a').toUpperCase()}
                  color={Colors.textPrimary}
                  textAlign="left"
                />
                <CategoryLabel
                  title={item.category.valueOf()}
                  onClick={() =>
                    homeViewModel.updateCurrentCategoryFilter(uiState.currentCategoryFilter !== item.category ? item.category : undefined)
                  }
                />
              </View>
            </RoundedBox>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top }]}>
      <TitleText text="Gabrieal's Appspensive" color={Colors.textPrimary} textAlign="center" />

      <RoundedBox style={{ marginVertical: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <BiggerText
            text={isAuthenticated
              ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'MYR' }).format(uiState.profile?.remaining ?? 0)
              : '******'}
            color={(uiState.profile?.remaining ?? 0) >= 0 ? Colors.greenAccent : Colors.redAccent}
            textAlign="center"
            style={{ paddingVertical: 4, paddingHorizontal: 48 }}
          />
          <TinyText text="REMAINING" color={Colors.textPrimary} textAlign="center" style={{ paddingBottom: 4 }} />
        </View>
        {!isAuthenticated && <IconButton onPress={() => authenticate(() => setIsAuthenticated(true))} style={baseStyles.iconButton} />}
      </RoundedBox>

      <TitleText text="Expenses" color={Colors.textPrimary} textAlign="left" style={{ marginVertical: 8 }} />
      <HorizontalDivider />

      {uiState.loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <ActivityIndicator size="large" color={Colors.textPrimary} />
        </View>
      ) : uiState.error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <TinyText text={uiState.error} color={Colors.redAccent} textAlign="center" />
        </View>
      ) : (!isAuthenticated || uiState.transactions.length === 0) ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Image source={require('@/assets/images/nothing_here_yet.webp')} style={{ height: 300 }} resizeMode="contain" />
          <SpacerVertical size={8} />
          <TinyText text="No transactions yet" color={Colors.textPrimary} textAlign="center" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FilterChipGroup
            items={["All", TransactionType.Expense, TransactionType.Income]}
            selected={uiState.currentTypeFilter}
            onSelectedChange={homeViewModel.updateCurrentTypeFilter}
          />
          {uiState.currentCategoryFilter && (
            <View style={{ marginBottom: 8, flexDirection: 'row'}}>
              <CategoryLabel
                title={uiState.currentCategoryFilter.valueOf()}
                onClick={() => homeViewModel.updateCurrentCategoryFilter(undefined)}
              />
            </View>
          )}
          <SpacerVertical size={4} />
          <SectionList
            sections={groupedTransactions}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item, section, index }) => {
              const isFirst = index === 0;
              const isLast = index === section.data.length - 1;
              const listOfSectionIds = section.data.map(t => t.id ?? -1);
              const isSectionSelected = uiState.selectedTransactions.some(id => listOfSectionIds.includes(id));

              return (
                <RoundedBox style={{
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  borderTopLeftRadius: isFirst ? 12 : 0,
                  borderTopRightRadius: isFirst ? 12 : 0,
                  borderBottomLeftRadius: isLast ? 12 : 0,
                  borderBottomRightRadius: isLast ? 12 : 0,
                  marginBottom:isLast ? 12 : 0,
                }}>
                  {isFirst && (
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 12}}>
                        <DescriptionText text={section.date} textAlign="left"/>
                        {uiState.isDeleteMode && (
                          IconButton({
                            icon: isSectionSelected ? "checkbox" : "checkbox-outline",
                            onPress: () => homeViewModel.updateSelectedTransactions(uiState.selectedTransactions, listOfSectionIds, isSectionSelected),
                            size: 20,
                            color: Colors.textPrimary,
                            style: {  },
                          })
                        )}
                      </View>
                      <HorizontalDivider />
                    </View>
                  )}
                  {renderTransaction({ item })}
                </RoundedBox>
              );
            }}
            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
            ItemSeparatorComponent={() => <HorizontalDivider style={{backgroundColor: Colors.placeholder}}/>}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <CustomBottomSheet index={bottomSheetIndex} snapPoints={['90%']} ref={bottomSheetRef} onChange={setBottomSheetIndex}>
        <TransactionBottomSheet onTransactionAdded={handleTransactionAdded} />
      </CustomBottomSheet>

      <FloatingActionButton
        onPress={handleFabPress}
        icon={isAuthenticated ? (bottomSheetIndex === -1 ? 'add' : 'close') : 'finger-print'}
        style={fabAnim.animatedStyle}
      />

      <Animated.View style={[cancelDeleteAnim.animatedStyle, baseStyles.cancelDelete, { flex: 1, flexDirection: 'row' }]}>
        <Pressable 
          onPress={() => {
            if (uiState.isDeleteMode) {
              homeViewModel.updateIsDeleteMode(false);
              homeViewModel.clearSelectedTransactions();
            }
          }} 
          style={[baseStyles.baseRoundedBox, { flex: 0.5, backgroundColor: Colors.placeholder, marginEnd: 4 }]}>
          <TinyText text="Cancel" color={Colors.textPrimary} textAlign="center"/>
        </Pressable>
        <Pressable 
        onPress={() => {
          if (uiState.isDeleteMode) {
            homeViewModel.deleteTransactions(uiState.selectedTransactions, uiState.transactions);
          }
        }} 
        style={[baseStyles.baseRoundedBox, { flex: 1, backgroundColor: Colors.red, marginStart: 4 }]}>
          <TinyText text="Delete" color={Colors.textPrimary} textAlign="center" />
        </Pressable>
      </Animated.View>
    </View>
  );
}