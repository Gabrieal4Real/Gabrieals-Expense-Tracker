import { useState, useCallback } from 'react';
import { StatisticUiState, initialStatisticUiState } from "./StatisticUiState";
import { HomeRepository } from '../../home/repo/HomeRepository';
import { Transaction } from '@/app/data/TransactionItem';
import { ExpenseCategory, IncomeCategory } from '@/app/data/TransactionItem';
import { blueScaleColors, ChartData } from '@/app/data/ChartData';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';

export function useStatisticViewModel() {
    const [uiState, setUiState] = useState<StatisticUiState>(initialStatisticUiState);
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    
    const updateState = useCallback((updater: (state: StatisticUiState) => Partial<StatisticUiState>) => {
      setUiState(prev => ({ ...prev, ...updater(prev) }));
    }, []);

    const updateLoading = useCallback((loading: boolean, error: string | null) => {
      updateState(() => ({ loading, error }));
    }, [updateState]);

    const generateChartData = useCallback((transactions: Transaction[]) => {
      const categoryMap: Record<string, number> = {};

      transactions.sort((a, b) => b.amount - a.amount);
      
      transactions.forEach(({ amount, category }) => {
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      });
      
      const chartData = Object.entries(categoryMap).map(([category, totalAmount], index) => ({
        name: category,
        population: totalAmount,
        color: blueScaleColors[index % blueScaleColors.length],
        legendFontColor: Colors.white,
        legendFontSize: 12,
        legendFontFamily: 'PoppinsRegular',
        legendLineHeight: 14,
        legendIncludeFontPadding: false,
      }));

      updateState(() => ({ chartData }));
    }, [updateState]);

    const generateFakeChartData = () => {
      const categoryMap: Record<string, number> = {};
      
      const transactions = [
        { amount: 100, category: 'Food' },
        { amount: 200, category: 'Transport' },
        { amount: 300, category: 'Entertainment' },
        { amount: 400, category: 'Shopping' },
        { amount: 500, category: 'Health' },
        { amount: 600, category: 'Education' },
        { amount: 700, category: 'Others' },
      ].sort((a, b) => b.amount - a.amount);
      
      transactions.forEach(({ amount, category }) => {
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      });
      
      return Object.entries(categoryMap).map(([category, totalAmount], index) => ({
        name: category,
        population: totalAmount,
        color: blueScaleColors[index % blueScaleColors.length],
        legendFontColor: Colors.white,
        legendFontSize: 12,
        legendFontFamily: 'PoppinsRegular',
        legendLineHeight: 14,
        legendIncludeFontPadding: false,
      }));
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