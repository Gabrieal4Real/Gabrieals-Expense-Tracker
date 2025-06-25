import React, { useEffect } from 'react';
import { View } from 'react-native';
import { TitleText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { SpacerVertical } from '@/app/util/widgets/CustomBox';
import { Category, TransactionType } from '@/app/data/TransactionItem';
import { useHomeViewModel } from '../../home/viewmodel/HomeViewModel';
import CustomTextInput from '@/app/util/widgets/CustomTextInput';
import { CustomButton } from '@/app/util/widgets/CustomButton';
import { FilterChipGroup } from '@/app/util/widgets/CustomBox';
import { useTransactionViewModel } from '../viewmodel/TransactionViewModel';

interface TransactionBottomSheetProps {
  transactionType: TransactionType;
  onTransactionAdded?: () => void;
}

export default function TransactionBottomSheet({ transactionType, onTransactionAdded }: TransactionBottomSheetProps) {
  const { addNewTransaction } = useHomeViewModel();
  const { uiState, updateUiState } = useTransactionViewModel();
  const { amount, description, category } = uiState;

  const handleSubmit = () => {
    addNewTransaction(transactionType, Number(amount), category, description);
    updateUiState({ amount: '', description: '', category: Category.Food });
    onTransactionAdded?.();
  };

  return (
    <View style={{ padding: 16 }}>
      <TitleText text={`Add ${transactionType}`} color={Colors.textPrimary} textAlign="center" />
      <SpacerVertical size={16} />

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
        items={Object.values(Category)}
        selected={category}
        onSelectedChange={(category) => {
          updateUiState({ category });
        }}
      />

      <SpacerVertical size={32} />

      <CustomButton
        text="Add Transaction"
        style={{ backgroundColor: amount === '' ? Colors.navigationBar : transactionType === TransactionType.Expense ? Colors.redAccent : Colors.greenAccent }}
        color={Colors.textPrimary}
        onPress={handleSubmit}
        disabled={amount === ''}
      />
    </View>
  );
}