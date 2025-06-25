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
        await loadTransactions();
      } catch (err) {
        console.error('Failed to add transaction:', err);
        updateUiState({ loading: false, error: 'Failed to add transaction' });
      }
    },
    [updateUiState, loadTransactions]
  );

  return { uiState, updateUiState, loadTransactions, addNewTransaction };
}