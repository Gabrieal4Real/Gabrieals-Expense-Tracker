import { useState, useCallback } from "react";
import {
  EditTransactionUiState,
  initialEditTransactionUiState,
} from "./EditTransactionUiState";
import { Transaction } from "@/app/data/TransactionItem";
import { TransactionType } from "@/app/util/enums/TransactionType";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";

export function useEditTransactionViewModel() {
  const [uiState, setUiState] = useState<EditTransactionUiState>(
    initialEditTransactionUiState,
  );

  const updateState = useCallback(
    (
      updater: (
        state: EditTransactionUiState,
      ) => Partial<EditTransactionUiState>,
    ) => {
      setUiState((prev) => ({ ...prev, ...updater(prev) }));
    },
    [],
  );

  const setTransaction = useCallback(
    (data: string) => {
      updateLoading(true, null);
      try {
        const decoded = decodeURIComponent(data as string);
        const transaction = JSON.parse(decoded);
        updateState(() => ({ transaction }));
        updateAmount(transaction.amount.toString());
        updateDescription(transaction.description);
        updateCategory(transaction.category);
        updateTransactionType(transaction.type);
      
        updateLoading(false, null);
      } catch {
        updateLoading(false, "Failed to parse transaction");
      }
    },
    [updateState],
  );

  const updateTransaction = useCallback(
    (transaction: Transaction) => {
      updateState(() => ({ transaction }));
    },
    [updateState],
  );

  const updateAmount = useCallback(
    (amount: string) => {
      updateState(() => ({ amount }));
    },
    [updateState],
  );

  const updateDescription = useCallback(
    (description: string) => {
      updateState(() => ({ description }));
    },
    [updateState],
  );

  const updateCategory = useCallback(
    (category: ExpenseCategory | IncomeCategory) => {
      updateState(() => ({ category }));
    },
    [updateState],
  );

  const updateTransactionType = useCallback(
    (type: TransactionType) => {
      updateState(() => ({ transactionType: type }));
    },
    [updateState],
  );

  const updateLoading = useCallback(
    (loading: boolean, error: string | null) => {
      updateState(() => ({ loading, error }));
    },
    [updateState],
  );

  return {
    uiState,
    updateLoading,
    setTransaction,
    updateTransaction,
    updateAmount,
    updateDescription,
    updateCategory,
    updateTransactionType,
  };
}
