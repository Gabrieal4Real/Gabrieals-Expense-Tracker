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

  const updateState = useCallback((updater: Partial<StatisticUiState> | ((prev: StatisticUiState) => Partial<StatisticUiState>)) => {
    setUiState(prev => ({
      ...prev,
      ...(typeof updater === 'function' ? updater(prev) : updater),
    }));
  }, []);

  const updateLoading = (loading: boolean, error: string | null) =>
    updateState({ loading, error });

  const groupTransactions = (transactions: Transaction[]) => {
    const grouped = new Map<string, { expense: ChartGroup; income: ChartGroup }>();

    transactions.forEach(({ amount, category, type, date }) => {
      const txDate = new Date(date);
      const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;
      const group = grouped.get(key) ?? { expense: {}, income: {} };
      const target = type === TransactionType.Expense ? group.expense : group.income;
      target[category] = (target[category] || 0) + amount;
      grouped.set(key, group);
    });

    return Array.from(grouped.entries()).map(([key, { expense, income }]) => {
      const [yearStr, monthStr] = key.split('-');
      const year = +yearStr;
      const month = +monthStr;
      const title = `${getMonthName(month)} ${getYearName(year)}`;
      return {
        title: `${title} Summary`,
        expense: Object.entries(expense).map(([x, y]) => ({ x, y })),
        income: Object.entries(income).map(([x, y]) => ({ x, y })),
        month,
        year,
      };
    }).sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));
  };

  const generateChartData = useCallback((transactions: Transaction[]) => {
    const chartPages = groupTransactions(transactions);
    updateState({ chartPages });
  }, [updateState]);

  const generateFakeChartData = (): ChartPageData[] => {
    const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Education', 'Others'];
    const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Gift', 'Others'];

    const months = [{ month: 7, year: 2024 }];

    return months.map(({ month, year }) => ({
      title: `${getMonthName(month)} ${getYearName(year)} Summary`,
      expense: expenseCategories.map(x => ({ x, y: getRandomAmount(100, 800) })),
      income: incomeCategories.map(x => ({ x, y: getRandomAmount(1000, 5000) })),
      month,
      year,
    }));
  };

  const getTransactions = useCallback(async () => {
    updateLoading(true, null);
    try {
      const transactions = await HomeRepository.fetchTransactions();
      updateState({ transactions });
      generateChartData(transactions);
    } catch {
      updateLoading(false, 'Failed to load transactions');
    } finally {
      updateLoading(false, null);
    }
  }, [generateChartData, updateState]);

  return {
    uiState,
    updateLoading,
    getTransactions,
    generateChartData,
    generateFakeChartData,
  };
}