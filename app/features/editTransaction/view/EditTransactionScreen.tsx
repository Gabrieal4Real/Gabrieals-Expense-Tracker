import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { baseStyles } from "@/constants/Styles";

import { TitleBox } from "@/app/util/widgets/CustomBox";
import { Pressable, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SpacerVertical } from "@/app/util/widgets/CustomBox";
import CustomTextInput from "@/app/util/widgets/CustomTextInput";
import { useEditTransactionViewModel } from "../viewmodel/EditTransactionViewModel";
import { TransactionType } from "@/app/util/enums/TransactionType";
import { FilterChipGroup } from "@/app/util/widgets/CustomBox";
import { TinyText } from "@/app/util/widgets/CustomText";
import { Colors } from "@/constants/Colors";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";
import { useTransactionViewModel } from "../../transactionBottomSheet/viewmodel/TransactionViewModel";
import { useHomeViewModel } from "../../home/viewmodel/HomeViewModel";
import { navigateBack } from "@/app/util/systemFunctions/NavigationUtil";

export default function EditTransactionScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useLocalSearchParams();

  const { uiState, ...editTransactionViewModel } = useEditTransactionViewModel();
  const { ...transactionViewModel } = useTransactionViewModel();
  const { ...homeViewModel } = useHomeViewModel();

  useEffect(() => {
    editTransactionViewModel.setTransaction(data as string);
  }, []);

  return (
    <View
      style={[
        baseStyles.baseBackground,
        { paddingTop: 18 + insets.top, paddingBottom: 18 + insets.bottom },
      ]}
    >
      <TitleBox title="Edit Transaction" />
      <SpacerVertical size={12} />
      <FilterChipGroup
        items={Object.values(TransactionType)}
        selected={uiState.transactionType}
        onSelectedChange={(type) =>
          editTransactionViewModel.updateTransactionType(
            type as TransactionType,
          )
        }
        style={{ justifyContent: "center", alignItems: "center" }}
      />
      <SpacerVertical size={12} />
      <CustomTextInput
        label="Amount"
        prefix="RM"
        placeholder="75.00"
        keyboardType="decimal-pad"
        value={uiState.amount}
        onChangeText={(text) => {
          if (text === "" || /^\d*\.?\d{0,2}$/.test(text)) {
            editTransactionViewModel.updateAmount(text);
          }
        }}
      />
      <SpacerVertical size={8} />

      <CustomTextInput
        label="Description"
        placeholder="Enter description"
        value={uiState.description}
        maxLength={100}
        onChangeText={(text) =>
          editTransactionViewModel.updateDescription(text)
        }
      />
      <SpacerVertical size={8} />

      <FilterChipGroup
        title="Category"
        items={Object.values(
          transactionViewModel.getCategoriesByType(uiState.transactionType),
        )}
        selected={uiState.category}
        onSelectedChange={(cat) =>
          editTransactionViewModel.updateCategory(
            cat as ExpenseCategory | IncomeCategory,
          )
        }
      />
      <SpacerVertical size={32} />
      <View
        style={[
          baseStyles.cancelDelete,
          { flex: 1, flexDirection: "row", paddingVertical: 12 },
        ]}
      >
        <Pressable
          onPress={() => {
            homeViewModel.deleteTransactions([uiState.transaction?.id ?? -1], [uiState.transaction!!]);
            navigateBack();
          }}
          style={[
            baseStyles.baseRoundedBox,
            { flex: 0.4, backgroundColor: Colors.red, marginEnd: 4 },
          ]}
        >
          <TinyText
            text="Delete"
            color={Colors.textPrimary}
            textAlign="center"
          />
        </Pressable>
        <Pressable
          onPress={() => {

          }}
          style={[
            baseStyles.baseRoundedBox,
            { flex: 1, backgroundColor: Colors.placeholder, marginStart: 4 },
          ]}
        >
          <TinyText
            text="Update"
            color={Colors.textPrimary}
            textAlign="center"
          />
        </Pressable>
      </View>
    </View>
  );
}
