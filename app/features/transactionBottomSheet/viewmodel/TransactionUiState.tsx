import { ExpenseCategory, IncomeCategory, TransactionType } from "@/app/data/TransactionItem";

export interface TransactionUiState {
  amount: string;
  description: string;
  category: ExpenseCategory | IncomeCategory;
  transactionType: TransactionType;
}

export const initialTransactionUiState: TransactionUiState = {
  amount: '',
  description: '',
  category: ExpenseCategory.Food,
  transactionType: TransactionType.Expense
};