import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SectionList,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { baseStyles } from "@/constants/Styles";

import { Transaction } from "@/app/data/TransactionItem";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";
import {
  TransactionFilter,
  TransactionType,
  TransactionTypeFilter,
} from "@/app/util/enums/TransactionType";

import {
  authenticate,
  useAuth,
} from "@/app/util/systemFunctions/AuthenticationUtil";
import { useHomeViewModel } from "../viewmodel/HomeViewModel";

import {
  AnimatedIonicons,
  useExpandUpShrinkDown,
  useFadeInOut,
} from "@/app/util/widgets/CustomAnimations";
import {
  CustomBottomSheet,
  closeBottomSheet,
  openBottomSheet,
} from "@/app/util/widgets/CustomBottomSheet";
import {
  CategoryLabel,
  FilterChipGroup,
  HorizontalDivider,
  RoundedBox,
  SpacerVertical,
} from "@/app/util/widgets/CustomBox";
import {
  FloatingActionButton,
  IconButton,
} from "@/app/util/widgets/CustomButton";
import {
  BiggerText,
  DescriptionText,
  SubtitleText,
  TinyText,
  TitleText,
} from "@/app/util/widgets/CustomText";

import CustomPicker from "@/app/util/widgets/CustomPicker";
import TransactionBottomSheet from "../../transactionBottomSheet/view/TransactionBottomSheet";
import {
  navigateBack,
  navigateToEditTransaction,
} from "@/app/util/systemFunctions/NavigationUtil";
import EventBus from "@/app/util/systemFunctions/EventBus";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const { uiState, ...homeViewModel } = useHomeViewModel();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [currentFilter, setCurrentFilter] = useState<TransactionFilter[]>([
    TransactionFilter.Date,
  ]);

  useEffect(() => {
    homeViewModel.getTransactions();
    homeViewModel.getProfile().then((profile) => {
      setIsAuthenticated(profile?.requireAuth === 0);
    });
  }, []);

  const handleFilterPress = (filter: TransactionFilter[]) => {
    setCurrentFilter(filter);
  };

  const filterDateLogic = () => {
    return (a: Transaction, b: Transaction) => {
      if (
        currentFilter.includes(TransactionFilter.Date) ||
        currentFilter.length == 0
      ) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return 0;
    };
  };

  const filterTypeLogic = () => {
    return (a: Transaction, b: Transaction) => {
      if (currentFilter.includes(TransactionFilter.Type)) {
        return a.type.localeCompare(b.type);
      }
      return 0;
    };
  };

  const filterCategoryLogic = () => {
    return (a: Transaction, b: Transaction) => {
      if (currentFilter.includes(TransactionFilter.Category)) {
        return a.category.localeCompare(b.category);
      }
      return 0;
    };
  };

  const fabAnim = useExpandUpShrinkDown(
    !isAuthenticated || (!uiState.isDeleteMode && isAuthenticated),
  );
  const checkmarkAnim = useFadeInOut(uiState.isDeleteMode && isAuthenticated);
  const cancelDeleteAnim = useExpandUpShrinkDown(
    uiState.isDeleteMode && isAuthenticated,
  );

  const filteredTransactions = uiState.transactions
    .filter(
      (t) =>
        uiState.currentTypeFilter === TransactionTypeFilter.All ||
        t.type === uiState.currentTypeFilter.valueOf(),
    )
    .filter(
      (t) =>
        !uiState.currentCategoryFilter ||
        t.category === uiState.currentCategoryFilter,
    )
    .sort(filterDateLogic())
    .sort(filterCategoryLogic())
    .sort(filterTypeLogic());

  const groupedTransactions =
    homeViewModel.groupedTransactionsByDate(filteredTransactions);

  const handleFabPress = () => {
    if (!isAuthenticated) {
      authenticate(() => {
        setIsAuthenticated(true);
      });
    } else if (uiState.isDeleteMode) {
      homeViewModel.deleteTransactions(
        uiState.selectedTransactions,
        uiState.transactions,
      );
      homeViewModel.updateIsDeleteMode(false);
      homeViewModel.clearSelectedTransactions();
    } else {
      bottomSheetIndex === -1
        ? openBottomSheet(bottomSheetRef)
        : closeBottomSheet(bottomSheetRef);
    }
  };

  const handleTransactionAdded = useCallback(
    (
      type: TransactionType,
      amount: number,
      category: ExpenseCategory | IncomeCategory,
      description: string,
    ) => {
      homeViewModel.addTransaction(type, amount, category, description);
      closeBottomSheet(bottomSheetRef);
    },
    [],
  );

  const handleTransactionUpdated = useCallback(() => {
    homeViewModel.getTransactions();
    homeViewModel.getProfile();
    navigateBack();
  }, []);

  useEffect(() => {
    const handler = () => handleTransactionUpdated();
    EventBus.on("transactionUpdated", handler);
    return () => EventBus.off("transactionUpdated", handler);
  }, [handleTransactionUpdated]);

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
        homeViewModel.updateSelectedTransaction(
          uiState.selectedTransactions,
          item.id ?? -1,
        );
      } else {
        navigateToEditTransaction(item);
      }
    };

    const handleLongPress = () => {
      homeViewModel.clearSelectedTransactions();
      homeViewModel.updateIsDeleteMode(!uiState.isDeleteMode);
      if (!uiState.isDeleteMode) {
        homeViewModel.updateSelectedTransaction(
          uiState.selectedTransactions,
          item.id ?? -1,
        );
      }
    };

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={
          !uiState.isDeleteMode
            ? () => (
                <Pressable
                  onPress={() =>
                    homeViewModel.deleteTransactions(
                      [item.id ?? -1],
                      uiState.transactions,
                    )
                  }
                  style={{
                    backgroundColor: Colors.red,
                    justifyContent: "center",
                    alignItems: "flex-end",
                    paddingHorizontal: 20,
                  }}
                >
                  <Ionicons name="trash" size={24} color={Colors.white} />
                </Pressable>
              )
            : undefined
        }
        friction={2}
      >
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={({ pressed }) => [pressed && baseStyles.pressed]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AnimatedIonicons
              name={isSelected ? "checkbox" : "checkbox-outline"}
              size={20}
              color={Colors.white}
              style={[
                checkmarkAnim.animatedStyle,
                { marginLeft: uiState.isDeleteMode ? 12 : 0 },
              ]}
            />
            <RoundedBox
              style={{ flex: 1, paddingVertical: 12, borderRadius: 0 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <SubtitleText
                  text={`RM ${item.amount.toFixed(2)}`}
                  textAlign="left"
                />
                <Ionicons
                  name={
                    item.type === TransactionType.Income
                      ? "arrow-down"
                      : "arrow-up"
                  }
                  size={24}
                  color={
                    item.type === TransactionType.Income
                      ? Colors.greenAccent
                      : Colors.redAccent
                  }
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <TinyText
                  text={item.description}
                  color={Colors.textPrimary}
                  textAlign="left"
                  style={{ flex: 1, marginEnd: 8 }}
                />
                <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
                  <CategoryLabel
                    title={item.category.valueOf()}
                    onClick={() =>
                      homeViewModel.updateCurrentCategoryFilter(
                        uiState.currentCategoryFilter !== item.category
                          ? item.category
                          : undefined,
                      )
                    }
                  />
                </View>
              </View>
            </RoundedBox>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top }]}>
      <TitleText
        text="Gabrieal's Appspensive"
        color={Colors.textPrimary}
        textAlign="center"
      />

      <RoundedBox style={{ marginVertical: 16 }}>
        <View style={{ alignItems: "center" }}>
          <BiggerText
            text={
              isAuthenticated
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "MYR",
                  }).format(uiState.profile?.remaining ?? 0)
                : "******"
            }
            color={
              (uiState.profile?.remaining ?? 0) >= 0
                ? Colors.greenAccent
                : Colors.redAccent
            }
            textAlign="center"
            style={{ paddingVertical: 4, paddingHorizontal: 48 }}
          />
          <TinyText
            text="REMAINING"
            color={Colors.textPrimary}
            textAlign="center"
            style={{ paddingBottom: 4 }}
          />
        </View>
        {!isAuthenticated && (
          <IconButton
            onPress={() => authenticate(() => setIsAuthenticated(true))}
            style={baseStyles.iconButton}
          />
        )}
      </RoundedBox>

      <TitleText
        text="Expenses"
        color={Colors.textPrimary}
        textAlign="left"
        style={{ marginVertical: 8 }}
      />
      <HorizontalDivider />

      {uiState.loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ActivityIndicator size="large" color={Colors.textPrimary} />
        </View>
      ) : uiState.error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <TinyText
            text={uiState.error}
            color={Colors.redAccent}
            textAlign="center"
          />
        </View>
      ) : !isAuthenticated || uiState.transactions.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Image
            source={require("@/assets/images/nothing_here_yet.webp")}
            style={{ height: 300 }}
            resizeMode="contain"
          />
          <SpacerVertical size={8} />
          <TinyText
            text="No transactions yet"
            color={Colors.textPrimary}
            textAlign="center"
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FilterChipGroup
              items={Object.values(TransactionTypeFilter)}
              selected={uiState.currentTypeFilter}
              onSelectedChange={homeViewModel.updateCurrentTypeFilter}
            />
            <View style={{ flex: 1 }}>
              <CustomPicker
                options={Object.values(TransactionFilter).map((type) => ({
                  label: type.valueOf(),
                  value: type.valueOf(),
                }))}
                autoSelected={[TransactionFilter.Date]}
                onChangeSelection={(values) => {
                  handleFilterPress(values as TransactionFilter[]);
                }}
              />
            </View>
          </View>
          {uiState.currentCategoryFilter && (
            <View style={{ marginBottom: 8, flexDirection: "row" }}>
              <CategoryLabel
                title={uiState.currentCategoryFilter.valueOf()}
                onClick={() =>
                  homeViewModel.updateCurrentCategoryFilter(undefined)
                }
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
              const listOfSectionIds = section.data.map((t) => t.id ?? -1);
              const isSectionSelected = uiState.selectedTransactions.some(
                (id) => listOfSectionIds.includes(id),
              );

              const totalAmount = listOfSectionIds.reduce((acc, id) => {
                const transaction = section.data.find((t) => t.id === id);

                if (transaction?.type === TransactionType.Expense) {
                  return acc - (transaction?.amount ?? 0);
                } else if (transaction?.type === TransactionType.Income) {
                  return acc + (transaction?.amount ?? 0);
                }
                return acc;
              }, 0);

              return (
                <RoundedBox
                  style={{
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    borderTopLeftRadius: isFirst ? 12 : 0,
                    borderTopRightRadius: isFirst ? 12 : 0,
                    borderBottomLeftRadius: isLast ? 12 : 0,
                    borderBottomRightRadius: isLast ? 12 : 0,
                    marginBottom: isLast ? 12 : 0,
                  }}
                >
                  {isFirst && (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginHorizontal: 12,
                        }}
                      >
                        <DescriptionText
                          text={section.date}
                          textAlign="left"
                          style={{ paddingVertical: 14 }}
                        />
                        {uiState.isDeleteMode &&
                          IconButton({
                            icon: isSectionSelected
                              ? "checkbox"
                              : "checkbox-outline",
                            onPress: () =>
                              homeViewModel.updateSelectedTransactions(
                                uiState.selectedTransactions,
                                listOfSectionIds,
                                isSectionSelected,
                              ),
                            size: 20,
                            color: Colors.textPrimary,
                          })}
                        {!uiState.isDeleteMode && (
                          <TinyText
                            text={Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "MYR",
                            }).format(totalAmount)}
                            color={
                              totalAmount >= 0
                                ? Colors.greenAccent
                                : Colors.redAccent
                            }
                            textAlign="right"
                            style={{
                              backgroundColor: Colors.backgroundColor,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 4,
                            }}
                          />
                        )}
                      </View>
                      <HorizontalDivider />
                    </View>
                  )}
                  {renderTransaction({ item })}
                </RoundedBox>
              );
            }}
            keyExtractor={(item) =>
              item.id?.toString() ?? Math.random().toString()
            }
            ItemSeparatorComponent={() => (
              <HorizontalDivider
                style={{ backgroundColor: Colors.placeholder }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <CustomBottomSheet
        index={bottomSheetIndex}
        snapPoints={["90%"]}
        ref={bottomSheetRef}
        onChange={setBottomSheetIndex}
      >
        <TransactionBottomSheet onTransactionAdded={handleTransactionAdded} />
      </CustomBottomSheet>

      <FloatingActionButton
        onPress={handleFabPress}
        icon={
          isAuthenticated
            ? bottomSheetIndex === -1
              ? "add"
              : "close"
            : "finger-print"
        }
        style={fabAnim.animatedStyle}
      />

      <Animated.View
        style={[
          cancelDeleteAnim.animatedStyle,
          baseStyles.cancelDelete,
          { flex: 1, flexDirection: "row" },
        ]}
      >
        <Pressable
          onPress={() => {
            if (uiState.isDeleteMode) {
              homeViewModel.updateIsDeleteMode(false);
              homeViewModel.clearSelectedTransactions();
            }
          }}
          style={[
            baseStyles.baseRoundedBox,
            { flex: 0.4, backgroundColor: Colors.placeholder, marginEnd: 4 },
          ]}
        >
          <TinyText
            text="Cancel"
            color={Colors.textPrimary}
            textAlign="center"
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (uiState.isDeleteMode) {
              homeViewModel.deleteTransactions(
                uiState.selectedTransactions,
                uiState.transactions,
              );
            }
          }}
          style={[
            baseStyles.baseRoundedBox,
            { flex: 1, backgroundColor: Colors.red, marginStart: 4 },
          ]}
        >
          <TinyText
            text="Delete"
            color={Colors.textPrimary}
            textAlign="center"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}
