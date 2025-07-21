import { Profile } from "@/app/data/Profile";
import { Transaction } from "@/app/data/TransactionItem";
import { TransactionType } from "@/app/util/enums/TransactionType";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";

export interface EditTransactionUiState {
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
  amount: string;
  description: string;
  category: ExpenseCategory | IncomeCategory;
  transactionType: TransactionType;
}

export const initialEditTransactionUiState: EditTransactionUiState = {
  transaction: null,
  loading: false,
  error: null,
  amount: "",
  description: "",
  category: ExpenseCategory.Other,
  transactionType: TransactionType.Expense,
};
