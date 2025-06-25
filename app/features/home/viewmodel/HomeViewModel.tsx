import { useState, useCallback } from 'react';
import { TransactionType, Category } from '@/app/data/TransactionItem';
import { addTransaction, getAllTransactions } from '@/app/sql/AppDatabase';
import { HomeUiState, initialHomeUiState } from './HomeUiState';

export function useHomeViewModel() {
  const [uiState, setUiState] = useState<HomeUiState>(initialHomeUiState);

  const updateUiState = useCallback((partial: Partial<HomeUiState>) => {
    setUiState((prev) => ({ ...prev, ...partial }));
  }, []);

  const loadTransactions = useCallback(async () => {
    updateUiState({ loading: true, error: null });
    try {
      const data = await getAllTransactions();
      updateUiState({
        transactions: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Failed to load transactions:', err);
      updateUiState({
        transactions: [],
        loading: false,
        error: 'Failed to load transactions',
        type: TransactionType.Expense,
      });
    }
  }, [updateUiState]);

  const addNewTransaction = useCallback(
    async (type: TransactionType, amount: number, category: Category, description: string) => {
      updateUiState({ loading: true, error: null });
      try {
        await addTransaction({
          amount,
          date: new Date().toISOString(),
          type,
          category,
          description,
        });
        await loadTransactions();
      } catch (err) {
        console.error('Failed to add transaction:', err);
        updateUiState({ loading: false, error: 'Failed to add transaction' });
      }
    },
    [updateUiState, loadTransactions]
  );

  return {
    uiState,
    updateUiState,
    loadTransactions,
    addNewTransaction,
  };
}
