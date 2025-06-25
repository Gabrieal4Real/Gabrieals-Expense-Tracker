import { Category } from "@/app/data/TransactionItem";

export interface TransactionUiState {
  amount: string;
  description: string;
  category: Category;
}

export const initialTransactionUiState: TransactionUiState = {
  amount: '',
  description: '',
  category: Category.Food,
};