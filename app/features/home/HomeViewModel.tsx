import { useState } from 'react';
import { addTransaction, getAllTransactions } from '@/app/sql/AppDatabase';
import { Transaction, TransactionType, Category } from '@/app/data/TransactionItem';

export class HomeViewModel {
  private _transactions: Transaction[] = [];
  private _setTransactions: (transactions: Transaction[]) => void;

  constructor() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    this._transactions = transactions;
    this._setTransactions = setTransactions;
  }

  get transactions(): Transaction[] {
    return this._transactions;
  }

  async loadTransactions(): Promise<void> {
    try {
      const data = await getAllTransactions();
      this._setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  }

  async addNewTransaction(type: TransactionType, amount: number, category: Category, description: string): Promise<void> {
    try {
      await addTransaction({
        amount,
        date: new Date().toISOString(),
        type,
        category,
        description
      });
      await this.loadTransactions();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  }
}

// Custom hook to use the HomeViewModel
export function useHomeViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const addNewTransaction = async (type: TransactionType, amount: number, category: Category, description: string) => {
    setLoading(true);
    setError(null);
    try {
      await addTransaction({
        amount,
        date: new Date().toISOString(),
        type,
        category,
        description
      });
      await loadTransactions();
    } catch (err) {
      console.error('Failed to add transaction:', err);
      setError('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    addNewTransaction
  };
}
