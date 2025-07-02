import { useState, useCallback } from 'react';
import { StatisticUiState, initialStatisticUiState } from './StatisticUiState';
import { HomeRepository } from '../../home/repo/HomeRepository';
import {
  Transaction,
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
} from '@/app/data/TransactionItem';
import { ChartPageData, ChartData } from '@/app/data/ChartData';
import { getMonthName, getYearName } from '@/app/util/systemFunctions/DateUtil';
import { getRandomAmount } from '@/app/util/systemFunctions/TextUtil';

type ChartGroup = Record<string, number>;

export function useStatisticViewModel() {
  const [uiState, setUiState] = useState<StatisticUiState>(initialStatisticUiState);

  const updateLoading = (loading: boolean, error: string | null) => {
    setUiState(prev => ({ ...prev, loading, error }));
  };

  const groupTransactions = (transactions: Transaction[]): ChartPageData[] => {
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

    return Array.from(grouped.entries())
      .map(([key, { expense, income }]) => {
        const [yearStr, monthStr] = key.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const title = `${getMonthName(month)} ${getYearName(year)} Summary`;

        return {
          title,
          year,
          month,
          expense: Object.entries(expense).map(([x, y]) => ({ x, y })),
          income: Object.entries(income).map(([x, y]) => ({ x, y })),
        };
      })
      .sort((a, b) => b.year * 12 + b.month - (a.year * 12 + a.month));
  };

  const generateChartData = useCallback((transactions: Transaction[]) => {
    const chartPages = groupTransactions(transactions);
    setUiState(prev => ({ ...prev, chartPages }));
  }, []);

  const getCategorySummary = (chartPages: ChartPageData[]): ChartPageData[] => {
    return chartPages.map(({ year, month, expense, income }) => {
      const combinedMap: Record<string, number> = {};

      expense.forEach(({ x, y }) => {
        const label = x.includes(ExpenseCategory.Other) ? 'Ex. Other' : x;
        combinedMap[label] = (combinedMap[label] || 0) + y;
      });

      income.forEach(({ x, y }) => {
        const label = x.includes(IncomeCategory.Other) ? 'In. Other' : x;
        combinedMap[label] = (combinedMap[label] || 0) + y;
      });

      const combined: ChartData[] = Object.entries(combinedMap).map(([x, y]) => ({ x, y }));

      return {
        year,
        month,
        title: `${getMonthName(month)} ${getYearName(year)} Category Summary`,
        expense: combined,
        income: [],
      };
    });
  };

  const generateFakeChartData = (): ChartPageData[] => {
    const months = [
      { month: 7, year: 2024 },
      { month: 8, year: 2024 },
    ];

    return months.map(({ month, year }) => ({
      title: `${getMonthName(month)} ${getYearName(year)} Summary`,
      year,
      month,
      expense: Object.values(ExpenseCategory).map(x => ({ x, y: getRandomAmount(100, 800) })),
      income: Object.values(IncomeCategory).map(x => ({ x, y: getRandomAmount(1000, 5000) })),
    }));
  };

  const getTransactions = useCallback(async () => {
    updateLoading(true, null);
    try {
      const transactions = await HomeRepository.fetchTransactions();
      setUiState(prev => ({ ...prev, transactions }));
      generateChartData(transactions);
    } catch {
      updateLoading(false, 'Failed to load transactions');
    } finally {
      updateLoading(false, null);
    }
  }, [generateChartData]);

  return {
    uiState,
    updateLoading,
    getTransactions,
    generateChartData,
    generateFakeChartData,
    getCategorySummary,
  };
}