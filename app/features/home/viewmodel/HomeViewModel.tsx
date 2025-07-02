import { useState, useCallback, useEffect } from 'react';
import { HomeUiState, initialHomeUiState } from './HomeUiState';
import { HomeRepository } from '../repo/HomeRepository';
import { TransactionType, ExpenseCategory, IncomeCategory, Transaction } from '@/app/data/TransactionItem';
import { Profile } from '@/app/data/Profile';

export function useHomeViewModel() {
  const [uiState, setUiState] = useState<HomeUiState>(initialHomeUiState);

  const updateState = useCallback((updater: (state: HomeUiState) => Partial<HomeUiState>) => {
    setUiState(prev => ({ ...prev, ...updater(prev) }));
  }, []);

  const updateLoading = useCallback((loading: boolean, error: string | null) => {
    updateState(() => ({ loading, error }));
  }, [updateState]);

  const updateSelectedTransaction = useCallback((selectedTransactions: number[], selectedTransaction: number) => {
    const current = new Set(selectedTransactions);
    current.has(selectedTransaction) ? current.delete(selectedTransaction) : current.add(selectedTransaction);
    updateState(() => ({ selectedTransactions: Array.from(current) }));
  }, [updateState]);

  const clearSelectedTransactions = useCallback(() => {
    updateState(() => ({ selectedTransactions: [] }));
  }, [updateState]);

  const updateIsDeleteMode = useCallback((isDeleteMode: boolean) => {
    updateState(() => ({ isDeleteMode }));
  }, [updateState]);

  const updateCurrentTypeFilter = useCallback((currentTypeFilter: string) => {
    updateState(() => ({ currentTypeFilter }));
  }, [updateState]);

  const updateCurrentCategoryFilter = useCallback((currentCategoryFilter?: string) => {
    updateState(() => ({ currentCategoryFilter }));
  }, [updateState]);

  const getProfile = useCallback(async () => {
    updateLoading(true, null);
    try {
      const profile = await HomeRepository.getProfile();
      if (!profile) {
        await HomeRepository.updateProfile(0, true);
        const defaultProfile = { remaining: 0, requireAuth: true };
        updateState(() => ({ profile: defaultProfile }));
        return defaultProfile;
      } else {
        updateState(() => ({ profile }));
        return profile;
      }
    } catch {
      updateLoading(false, 'Failed to get profile');
      return null;
    } finally {
      updateLoading(false, null);
    }
  }, [updateState, updateLoading]);

  const updateProfile = useCallback(async (profile: Profile) => {
    updateLoading(true, null);
    try {
      await HomeRepository.updateProfile(profile.remaining, profile.requireAuth);
      updateState(() => ({ profile }));
    } catch {
      updateLoading(false, 'Failed to update profile');
    } finally {
      updateLoading(false, null);
    }
  }, [updateState, updateLoading]);

  const getTransactions = useCallback(async () => {
    updateLoading(true, null);
    try {
      const transactions = await HomeRepository.fetchTransactions();
      updateState(() => ({ transactions }));
    } catch {
      updateLoading(false, 'Failed to load transactions');
    } finally {
      updateLoading(false, null);
    }
  }, [updateState, updateLoading]);

  const updateTransaction = useCallback(async (
    type: TransactionType,
    amount: number,
    category: ExpenseCategory | IncomeCategory,
    description: string
  ) => {
    updateLoading(true, null);
    try {
      await HomeRepository.createTransaction(type, amount, category, description);

      const profile = await getProfile();
      if (profile) {
        const remaining = type === TransactionType.Expense
          ? profile.remaining - amount
          : profile.remaining + amount;

        await updateProfile({ remaining, requireAuth: profile.requireAuth });
        await getTransactions();
      }
    } catch {
      updateLoading(false, 'Failed to add transaction');
    } finally {
      updateLoading(false, null);
    }
  }, [getProfile, updateProfile, getTransactions, updateLoading]);

  const deleteTransactions = useCallback(async (ids: number[], transactions: Transaction[]) => {
    updateLoading(true, null);
    try {
      const profile = await getProfile();
      if (profile) {
        const remaining = ids.reduce((acc, id) => {
          const transaction = transactions.find(t => t.id === id);
          if (!transaction) return acc;
          return acc + (transaction.type === TransactionType.Expense ? transaction.amount : -transaction.amount);
        }, profile.remaining);

        await updateProfile({ remaining, requireAuth: profile.requireAuth });
      }

      await HomeRepository.deleteTransactionsByIds(ids);
      await getTransactions();
      clearSelectedTransactions();
      updateIsDeleteMode(false);
    } catch {
      updateLoading(false, 'Failed to delete transactions');
    } finally {
      updateLoading(false, null);
    }
  }, [getProfile, updateProfile, getTransactions, clearSelectedTransactions, updateIsDeleteMode, updateLoading]);

  useEffect(() => {
    (async () => {
      await getProfile();
      await getTransactions();
    })();
  }, [getProfile, getTransactions]);

  return {
    uiState,
    getTransactions,
    updateTransaction,
    getProfile,
    updateProfile,
    updateCurrentTypeFilter,
    updateCurrentCategoryFilter,
    updateSelectedTransaction,
    deleteTransactions,
    updateIsDeleteMode,
    clearSelectedTransactions
  };
}