import { useState, useCallback } from 'react';
import { HomeUiState, initialHomeUiState } from './HomeUiState';
import { HomeRepository } from '../repo/HomeRepository';
import { TransactionType, ExpenseCategory, IncomeCategory } from '@/app/data/TransactionItem';

export function useHomeViewModel() {
  const [uiState, setUiState] = useState<HomeUiState>(initialHomeUiState);

  const updateUiState = useCallback((partial: Partial<HomeUiState>) => {
    setUiState((prev) => ({ ...prev, ...partial }));
  }, []);

  const loadTransactions = useCallback(async () => {
    updateUiState({ loading: true, error: null });
    try {
      const data = await HomeRepository.fetchTransactions();
      updateUiState({ transactions: data, loading: false, error: null });
    } catch (err) {
      console.error('Failed to load transactions:', err);
      updateUiState({ transactions: [], loading: false, error: 'Failed to load transactions', type: TransactionType.Expense });
    }
  }, [updateUiState]);

  const addNewTransaction = useCallback(
    async (type: TransactionType, amount: number, category: ExpenseCategory | IncomeCategory, description: string) => {
      updateUiState({ loading: true, error: null });
      try {
        await HomeRepository.createTransaction(type, amount, category, description);
        const previousRemaining = uiState.profile?.remaining ?? 0;
        const currentRemaining = type === TransactionType.Expense ? previousRemaining - amount : previousRemaining + amount;

        await updateProfile(currentRemaining);
        await loadTransactions();
      } catch (err) {
        console.error('Failed to add transaction:', err);
        updateUiState({ loading: false, error: 'Failed to add transaction' });
      }
    },
    [updateUiState, loadTransactions]
  );

  const updateProfile = useCallback(
    async (remaining: number) => {
      updateUiState({ loading: true, error: null });
      try {
        await HomeRepository.updateProfile(remaining);
        await getProfile();
      } catch (err) {
        console.error('Failed to update profile:', err);
        updateUiState({ loading: false, error: 'Failed to update profile' });
      }
    },
    [updateUiState, loadTransactions]
  );

  const getProfile = useCallback(
    async () => {
      updateUiState({ loading: true, error: null });
      try {
        const profile = await HomeRepository.getProfile();
        updateUiState({ profile, loading: false, error: null });
      } catch (err) {
        console.error('Failed to get profile:', err);
        updateUiState({ loading: false, error: 'Failed to get profile' });
      }
    },
    [updateUiState]
  );

  return { uiState, updateUiState, loadTransactions, addNewTransaction, updateProfile, getProfile };
}