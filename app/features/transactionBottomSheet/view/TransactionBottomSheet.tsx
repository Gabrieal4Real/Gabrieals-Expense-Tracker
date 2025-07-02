import React from 'react';
import { View } from 'react-native';
import { TitleText } from '@/app/util/widgets/CustomText';
import { SpacerVertical } from '@/app/util/widgets/CustomBox';
import CustomTextInput from '@/app/util/widgets/CustomTextInput';
import { CustomButton } from '@/app/util/widgets/CustomButton';
import { FilterChipGroup } from '@/app/util/widgets/CustomBox';
import { useTransactionViewModel } from '../viewmodel/TransactionViewModel';
import {
  ExpenseCategory,
  IncomeCategory,
  TransactionType,
} from '@/app/data/TransactionItem';
import { Colors } from '@/constants/Colors';

interface TransactionBottomSheetProps {
  onTransactionAdded?: (
    type: TransactionType,
    amount: number,
    category: ExpenseCategory | IncomeCategory,
    description: string
  ) => void;
}

export default function TransactionBottomSheet({ onTransactionAdded }: TransactionBottomSheetProps) {
  const transactionViewModel = useTransactionViewModel();
  const { transactionType, amount, category, description } = transactionViewModel.uiState;

  const handleSubmit = () => {
    onTransactionAdded?.(
      transactionType,
      Number(amount),
      category,
      description
    );
    transactionViewModel.reset();
  };

  const isAmountValid = amount !== '';

  const buttonBackground =
    !isAmountValid
      ? Colors.navigationBar
      : transactionType === TransactionType.Expense
      ? Colors.red
      : Colors.green;

  const buttonTextColor =
    !isAmountValid
      ? Colors.white
      : transactionType === TransactionType.Expense
      ? Colors.textPrimary
      : Colors.black;

  return (
    <View style={{ padding: 16 }}>
      <TitleText
        text={`Add ${transactionType}`}
        color={Colors.textPrimary}
        textAlign="center"
      />
      <SpacerVertical size={16} />

      <FilterChipGroup
        items={Object.values(TransactionType)}
        selected={transactionType}
        onSelectedChange={(type) =>
          transactionViewModel.updateTransactionType(type as TransactionType)
        }
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
      <SpacerVertical size={8} />

      <CustomTextInput
        label="Amount"
        prefix="RM"
        placeholder="75.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(text) => {
          if (text === '' || /^\d*\.?\d{0,2}$/.test(text)) {
            transactionViewModel.updateAmount(text);
          }
        }}
      />
      <SpacerVertical size={8} />

      <CustomTextInput
        label="Description"
        placeholder="Enter description"
        value={description}
        maxLength={100}
        onChangeText={(text) => transactionViewModel.updateDescription(text)}
      />
      <SpacerVertical size={8} />

      <FilterChipGroup
        title="Category"
        items={Object.values(
          transactionViewModel.getCategoriesByType(transactionType)
        )}
        selected={category}
        onSelectedChange={(cat) =>
          transactionViewModel.updateCategory(
            cat as ExpenseCategory | IncomeCategory
          )
        }
      />
      <SpacerVertical size={32} />

      <CustomButton
        text="Confirm"
        style={{ backgroundColor: buttonBackground }}
        color={buttonTextColor}
        onPress={handleSubmit}
        disabled={!isAmountValid}
      />
    </View>
  );
}