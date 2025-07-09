import { TransactionType } from "../util/enums/TransactionType";
import { ExpenseCategory, IncomeCategory } from "../util/enums/Category";

export interface Transaction {
  id?: number;
  amount: number;
  date: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  description: string;
}