import { Transaction } from "./TransactionItem";

export interface GroupedTransactionSection {
  date: string;
  data: Transaction[];
}
