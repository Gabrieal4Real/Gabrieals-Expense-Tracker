import { Transaction } from "@/app/data/TransactionItem";
import { ChartPageData } from "@/app/data/ChartData";

export interface StatisticUiState {
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  chartPages: ChartPageData[];
}

export const initialStatisticUiState: StatisticUiState = {
  loading: false,
  error: null,
  transactions: [],
  chartPages: [],
};