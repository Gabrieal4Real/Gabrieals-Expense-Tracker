import React, { useEffect } from 'react';
import { View } from 'react-native';
import { TitleText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { SpacerVertical } from '@/app/util/widgets/CustomBox';
import { ExpenseCategory, IncomeCategory, TransactionType } from '@/app/data/TransactionItem';
import { useHomeViewModel } from '../../home/viewmodel/HomeViewModel';
import CustomTextInput from '@/app/util/widgets/CustomTextInput';
import { CustomButton } from '@/app/util/widgets/CustomButton';
import { FilterChipGroup } from '@/app/util/widgets/CustomBox';
import { useTransactionViewModel } from '../viewmodel/TransactionViewModel';

interface TransactionBottomSheetProps {
  type: TransactionType;
  onTransactionAdded?: () => void;
}

export default function TransactionBottomSheet({ type, onTransactionAdded }: TransactionBottomSheetProps) {
  const { addNewTransaction } = useHomeViewModel();
  const { uiState, updateUiState } = useTransactionViewModel();
  const { amount, description, category, transactionType } = uiState;

 const getCategoriesByType = (type: TransactionType): string[] => {
    return type === TransactionType.Expense
      ? Object.values(ExpenseCategory)
      : Object.values(IncomeCategory);
  };

  useEffect(() => {
    updateUiState({ transactionType: type });
  }, [type, updateUiState]);

  const handleSubmit = () => {
    addNewTransaction(transactionType, Number(amount), category, description);
  
    updateUiState({
      amount: '',
      description: '',
      category:
        transactionType === TransactionType.Expense
          ? ExpenseCategory.Food
          : IncomeCategory.Salary,
    });
  
    onTransactionAdded?.();
  };

  return (
    <View style={{ padding: 16 }}>
      <TitleText text={`Add ${transactionType}`} color={Colors.textPrimary} textAlign="center" />
      <SpacerVertical size={16} />

      <FilterChipGroup
        items={Object.values(TransactionType)}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        selected={transactionType}
        onSelectedChange={(type) => updateUiState({ transactionType: type as TransactionType })}
      />
      <SpacerVertical size={8} />

      <CustomTextInput
        label="Amount"
        prefix="RM"
        placeholder="75.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={
          (text) => {
            if (text === '' || /^\d*\.?\d{0,2}$/.test(text)) {
              updateUiState({ amount: text });
            }
          }
        }
      />
      <SpacerVertical size={8} />
      <CustomTextInput
        label="Description"
        placeholder="Enter description"
        value={description}
        onChangeText={
          (text) => {
            updateUiState({ description: text });
          }
        }
      />
      <SpacerVertical size={8} />

      <FilterChipGroup
        title="Category"
        items={Object.values(getCategoriesByType(transactionType))}
        selected={category}
        onSelectedChange={(category) => {
          updateUiState({ category: category as ExpenseCategory | IncomeCategory });
        }}
      />

      <SpacerVertical size={32} />

      <CustomButton
        text="Confirm"
        style={{ backgroundColor: amount === '' 
          ? Colors.navigationBar : transactionType === TransactionType.Expense 
          ? Colors.red : Colors.green }}
        color={amount === '' 
          ? Colors.white : transactionType === TransactionType.Expense ? Colors.textPrimary : Colors.black}
        onPress={handleSubmit}
        disabled={amount === ''}
      />
    </View>
  );
}