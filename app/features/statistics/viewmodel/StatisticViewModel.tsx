import { useState, useCallback } from 'react';
import { StatisticUiState, initialStatisticUiState } from "./StatisticUiState";
import { HomeRepository } from '../../home/repo/HomeRepository';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';
import { ChartPageData } from '@/app/data/ChartData';
import { getMonthName, getYearName } from '@/app/util/systemFunctions/DateUtil';
import { getRandomAmount } from '@/app/util/systemFunctions/TextUtil';

type ChartGroup = Record<string, number>;

export function useStatisticViewModel() {
  const [uiState, setUiState] = useState<StatisticUiState>(initialStatisticUiState);

  const updateState = useCallback((updater: (state: StatisticUiState) => Partial<StatisticUiState>) => {
    setUiState(prev => ({ ...prev, ...updater(prev) }));
  }, []);

  const updateLoading = useCallback((loading: boolean, error: string | null) => {
    updateState(() => ({ loading, error }));
  }, [updateState]);

  const generateChartData = useCallback((transactions: Transaction[]) => {
    const grouped = new Map<string, { expense: ChartGroup; income: ChartGroup }>();

    transactions.forEach(({ amount, category, type, date }) => {
      const txDate = new Date(date);
      const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;

      if (!grouped.has(key)) {
        grouped.set(key, { expense: {}, income: {} });
      }

      const group = grouped.get(key)!;
      const target = type === TransactionType.Expense ? group.expense : group.income;
      target[category] = (target[category] || 0) + amount;
    });

    const chartPages: ChartPageData[] = [];

    grouped.forEach(({ expense, income }, key) => {
      const [yearStr, monthStr] = key.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);

      const baseTitle = `${getMonthName(month)} ${getYearName(year)}`;

      const expenseData = Object.entries(expense).map(([x, y]) => ({ x, y }));
      const incomeData = Object.entries(income).map(([x, y]) => ({ x, y }));

      if (expenseData.length)
        chartPages.push({ title: `${baseTitle} Expense Summary`, data: expenseData, type: 'expense', month, year });

      if (incomeData.length)
        chartPages.push({ title: `${baseTitle} Income Summary`, data: incomeData, type: 'income', month, year });
    });

    chartPages.sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));

    updateState(() => ({ chartPages }));
  }, [updateState]);

  const generateFakeChartData = (): ChartPageData[] => {
    const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Education', 'Others'];
    const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Gift', 'Others'];

    const months = [
      { month: 7, year: 2024 },
      { month: 5, year: 2025 },
    ];

    return months.flatMap(({ month, year }) => {
      const monthName = getMonthName(month);
      const yearLabel = getYearName(year);

      const expenseChart: ChartPageData = {
        title: `${monthName} ${yearLabel} Expense Summary`,
        data: expenseCategories.map(cat => ({ x: cat, y: getRandomAmount(100, 800) })),
        type: 'expense',
        month,
        year,
      };

      const incomeChart: ChartPageData = {
        title: `${monthName} ${year} Income Summary`,
        data: incomeCategories.map(cat => ({ x: cat, y: getRandomAmount(1000, 5000) })),
        type: 'income',
        month,
        year,
      };

      return [expenseChart, incomeChart];
    });
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
  }, [updateLoading, generateChartData, updateState]);

  return {
    uiState,
    updateLoading,
    getTransactions,
    generateChartData,
    generateFakeChartData
  };
}