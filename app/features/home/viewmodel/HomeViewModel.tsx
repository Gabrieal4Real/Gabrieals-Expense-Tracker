import { useState, useCallback, useEffect } from 'react';
import { HomeUiState, initialHomeUiState } from './HomeUiState';
import { HomeRepository } from '../repo/HomeRepository';
import { TransactionType, ExpenseCategory, IncomeCategory } from '@/app/data/TransactionItem';
import { Profile } from '@/app/data/Profile';

export function useHomeViewModel() {
  const [uiState, setUiState] = useState<HomeUiState>(initialHomeUiState);

  const updateState = useCallback((updater: (state: HomeUiState) => Partial<HomeUiState>) => {
    setUiState(prev => ({ ...prev, ...updater(prev) }));
  }, []);

  const updateLoading = useCallback((loading: boolean, error: string | null) => {
    updateState(() => ({ loading, error }));
  }, [updateState]);

  const updateAuthenticated = useCallback((authenticated: boolean) => {
    updateState(() => ({ authenticated }));
  }, [updateState]);

  const getProfile = useCallback(async () => {
    updateLoading(true, null);
    try {
      const profile = await HomeRepository.getProfile();
      if (!profile) {
        await HomeRepository.updateProfile(0);
        updateState(() => ({ profile: { remaining: 0 } }));
        return { remaining: 0 };
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
      await HomeRepository.updateProfile(profile.remaining);
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
        await updateProfile({ remaining });
        await getTransactions();
      }
    } catch {
      updateLoading(false, 'Failed to add transaction');
    }
  }, [getProfile, updateProfile, getTransactions, updateLoading]);

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
    updateAuthenticated
  };
}