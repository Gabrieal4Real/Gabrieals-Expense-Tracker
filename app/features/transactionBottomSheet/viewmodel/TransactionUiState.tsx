import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";
import { TransactionType } from "@/app/util/enums/TransactionType";

export interface TransactionUiState {
  amount: string;
  description: string;
  category: ExpenseCategory | IncomeCategory;
  transactionType: TransactionType;
}

export const initialTransactionUiState: TransactionUiState = {
  amount: "",
  description: "",
  category: ExpenseCategory.Food,
  transactionType: TransactionType.Expense,
};
