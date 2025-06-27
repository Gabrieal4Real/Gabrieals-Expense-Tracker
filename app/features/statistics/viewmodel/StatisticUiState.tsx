import { ChartData } from "@/app/data/ChartData";
import { Transaction } from "@/app/data/TransactionItem";

export interface StatisticUiState {
    loading: boolean;
    error: string | null;
    transactions: Transaction[];
    chartData: ChartData[];
}

export const initialStatisticUiState: StatisticUiState = {
    loading: false,
    error: null,
    transactions: [],
    chartData: []
};