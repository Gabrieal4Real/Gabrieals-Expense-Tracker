import { useState, useCallback } from 'react';
import { StatisticUiState, initialStatisticUiState } from "./StatisticUiState";
import { HomeRepository } from '../../home/repo/HomeRepository';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';

export function useStatisticViewModel() {
    const [uiState, setUiState] = useState<StatisticUiState>(initialStatisticUiState);
    
    const updateState = useCallback((updater: (state: StatisticUiState) => Partial<StatisticUiState>) => {
      setUiState(prev => ({ ...prev, ...updater(prev) }));
    }, []);

    const updateLoading = useCallback((loading: boolean, error: string | null) => {
      updateState(() => ({ loading, error }));
    }, [updateState]);

    const generateChartData = useCallback((transactions: Transaction[]) => {
      const expenseCategoryMap: Record<string, number> = {};
      const incomeCategoryMap: Record<string, number> = {};
    
      transactions.sort((a, b) => b.amount - a.amount);
    
      transactions.forEach(({ amount, category, type }) => {
        if(type == TransactionType.Expense)
          expenseCategoryMap[category] = (expenseCategoryMap[category] || 0) + amount;
        else
        incomeCategoryMap[category] = (incomeCategoryMap[category] || 0) + amount;
      });
    
      const expenseChartData = Object.entries(expenseCategoryMap).map(([category, totalAmount]) => ({
        x: category,
        y: totalAmount,
      }));

      const incomeChartData = Object.entries(incomeCategoryMap).map(([category, totalAmount]) => ({
        x: category,
        y: totalAmount,
      }));
    
      updateState(() => ({ expenseChartData, incomeChartData }));
    }, [updateState]);

    const generateFakeChartData = () => {
      const expenseCategoryMap: Record<string, number> = {};
      const incomeCategoryMap: Record<string, number> = {};
      
      const expenseTransactions = [
        { amount: 100, category: 'Food' },
        { amount: 200, category: 'Transport' },
        { amount: 300, category: 'Entertainment' },
        { amount: 400, category: 'Shopping' },
        { amount: 600, category: 'Education' },
        { amount: 700, category: 'Others' },
      ].map(item => ({
        x: item.category,
        y: item.amount,
      }));

      const incomeTransactions = [
        { amount: 5000, category: 'Salary' },
        { amount: 200, category: 'Bonus' },
        { amount: 600, category: 'Investment' },
        { amount: 4000, category: 'Gift' },
        { amount: 700, category: 'Others' },
      ].map(item => ({
        x: item.category,
        y: item.amount,
      }));
      
      expenseTransactions.forEach(({ x, y }) => {
        expenseCategoryMap[x] = (expenseCategoryMap[x] || 0) + y;
      });

      incomeTransactions.forEach(({ x, y }) => {
        incomeCategoryMap[x] = (incomeCategoryMap[x] || 0) + y;
      });

      const expenseChart = Object.entries(expenseCategoryMap).map(([category, totalAmount]) => ({
        x: category,
        y: totalAmount
      }));

      const incomeChart = Object.entries(incomeCategoryMap).map(([category, totalAmount]) => ({
        x: category,
        y: totalAmount
      }));
      
      return { expenseChart, incomeChart };
    };
    
    const getTransactions = useCallback(async () => {
      updateLoading(true, null);
      try {
        const transactions = await HomeRepository.fetchTransactions();
        updateState(() => ({ transactions }));
        generateChartData(transactions);
      } catch {
        updateLoading(false, 'Failed to load transactions');
      } finally {
        updateLoading(false, null);
      }
    }, [updateState, updateLoading]);

    return {
      uiState,
      updateLoading,
      getTransactions,
      generateChartData,
      generateFakeChartData
    };
}