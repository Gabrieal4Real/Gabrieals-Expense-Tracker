import { useState, useCallback } from "react";
import {
  EditTransactionUiState,
  initialEditTransactionUiState,
} from "./EditTransactionUiState";
import { Transaction } from "@/app/data/TransactionItem";
import { TransactionType } from "@/app/util/enums/TransactionType";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";
import { HomeRepository } from "../../home/repo/HomeRepository";
import { EditTransactionRepository } from "../repo/EditTransactionRepository";
import { getProfile } from "@/app/sql/AppDatabase";
import { Profile } from "@/app/data/Profile";
import { navigateBack } from "@/app/util/systemFunctions/NavigationUtil";
import EventBus from "@/app/util/systemFunctions/EventBus";

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

  const deleteTransactionById = useCallback(
    async (id: number, transaction: Transaction) => {
      updateLoading(true, null);
      try {
        await HomeRepository.deleteTransactionsByIds([id]);

        const profile = await getProfile();

        if (profile) {
          const adjustment =
            transaction.type === TransactionType.Expense
              ? transaction.amount
              : -transaction.amount;

          const remaining = profile.remaining + adjustment;

          await updateProfile({ remaining, requireAuth: profile.requireAuth });
        }
      } catch {
        updateLoading(false, "Failed to delete transaction");
      } finally {
        updateLoading(false, null);
      }
    },
    [getProfile, updateLoading],
  );

  const updateTransactionById = useCallback(
    async (
      id: number,
      prevTransaction: Transaction,
      updatedTransaction: Transaction,
    ) => {
      updateLoading(true, null);
      try {
        await EditTransactionRepository.updateTransactionById(
          id,
          updatedTransaction,
        );

        const profile = await getProfile();
        if (profile) {
          const getSignedAmount = (tx: Transaction) =>
            tx.type === TransactionType.Expense ? -tx.amount : tx.amount;

          let currentRemaining =
            profile.remaining +
            getSignedAmount(prevTransaction) * -1 +
            getSignedAmount(updatedTransaction);

          await updateProfile({
            remaining: currentRemaining,
            requireAuth: profile.requireAuth,
          });
        }
      } catch {
        updateLoading(false, "Failed to update transaction");
      } finally {
        updateLoading(false, null);
      }
    },
    [getProfile, updateLoading],
  );

  const updateProfile = useCallback(
    async (profile: Profile) => {
      updateLoading(true, null);
      try {
        await HomeRepository.updateProfile(
          profile.remaining,
          profile.requireAuth,
        );

        EventBus.emit("transactionUpdated");
      } catch {
        updateLoading(false, "Failed to update profile");
      } finally {
        updateLoading(false, null);
      }
    },
    [updateState, updateLoading],
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
    updateTransactionById,
    deleteTransactionById,
  };
}
