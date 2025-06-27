import { useState, useCallback } from 'react';
import { StatisticUiState, initialStatisticUiState } from "./StatisticUiState";
import { HomeRepository } from '../../home/repo/HomeRepository';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';
import { ChartPageData } from '@/app/data/ChartData';
import { getMonthName, getYearName } from '@/app/util/systemFunctions/DateUtil';


export function useStatisticViewModel() {
    const [uiState, setUiState] = useState<StatisticUiState>(initialStatisticUiState);
    
    const updateState = useCallback((updater: (state: StatisticUiState) => Partial<StatisticUiState>) => {
      setUiState(prev => ({ ...prev, ...updater(prev) }));
    }, []);

    const updateLoading = useCallback((loading: boolean, error: string | null) => {
      updateState(() => ({ loading, error }));
    }, [updateState]);

    const generateChartData = useCallback((transactions: Transaction[]) => {
      const groupedMap = new Map<string, {
        expense: Record<string, number>,
        income: Record<string, number>
      }>();
    
      transactions.forEach(({ amount, category, type, date }) => {
        const txDate = new Date(date);
        const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;
    
        if (!groupedMap.has(key)) {
          groupedMap.set(key, { expense: {}, income: {} });
        }
    
        const group = groupedMap.get(key)!;
    
        if (type === TransactionType.Expense) {
          group.expense[category] = (group.expense[category] || 0) + amount;
        } else {
          group.income[category] = (group.income[category] || 0) + amount;
        }
      });
    
      const chartPages: {
        title: string;
        data: { x: string, y: number }[];
        type: 'expense' | 'income';
        month: number;
        year: number;
      }[] = [];
    
      groupedMap.forEach((group, key) => {
        const [yearStr, monthStr] = key.split('-');
        const year = parseInt(yearStr);
        const yearName = getYearName(year);
        const month = parseInt(monthStr);
        const monthName = getMonthName(month);
    
        const expenseChart = Object.entries(group.expense).map(([x, y]) => ({ x, y }));
        const incomeChart = Object.entries(group.income).map(([x, y]) => ({ x, y }));
    
        if (expenseChart.length > 0) {
          chartPages.push({
            title: `${monthName} ${yearName} Expense Summary`,
            data: expenseChart,
            type: 'expense',
            month,
            year,
          });
        }
    
        if (incomeChart.length > 0) {
          chartPages.push({
            title: `${monthName} ${year} Income Summary`,
            data: incomeChart,
            type: 'income',
            month,
            year,
          });
        }
      });
    
      chartPages.sort((a, b) => {
        const aKey = a.year * 12 + a.month;
        const bKey = b.year * 12 + b.month;
        return bKey - aKey;
      });
    
      updateState(() => ({ chartPages }));
    }, [updateState]);

    const getRandomAmount = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const generateFakeChartData = (): ChartPageData[] => {
      const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Education', 'Others'];
      const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Gift', 'Others'];
    
      const months = [
        {month: 7, year: 2024},
        { month: 5, year: 2025 },
      ];
    
      return months.flatMap(({ month, year }) => {
        const expenseChart: ChartPageData = {
          title: `${getMonthName(month)} ${getYearName(year)} Expense Summary`,
          data: expenseCategories.map((category) => ({
            x: category,
            y: getRandomAmount(100, 800),
          })),
          type: 'expense',
          month,
          year,
        };
    
        const incomeChart: ChartPageData = {
          title: `${getMonthName(month)} ${year} Income Summary`,
          data: incomeCategories.map((category) => ({
            x: category,
            y: getRandomAmount(1000, 5000),
          })),
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
    }, [updateState, updateLoading]);

    return {
      uiState,
      updateLoading,
      getTransactions,
      generateChartData,
      generateFakeChartData
    };
}