import { ChartData } from "@/app/data/ChartData";
import { Transaction } from "@/app/data/TransactionItem";

export interface StatisticUiState {
    loading: boolean;
    error: string | null;
    transactions: Transaction[];
    expenseChartData: ChartData[];
    incomeChartData: ChartData[];
}

export const initialStatisticUiState: StatisticUiState = {
    loading: false,
    error: null,
    transactions: [],
    expenseChartData: [],
    incomeChartData: []
};