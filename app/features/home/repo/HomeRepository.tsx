import { addTransaction, getAllTransactions } from "@/app/sql/AppDatabase";
import { TransactionType, Category } from "@/app/data/TransactionItem";

export const HomeRepository = {
    async fetchTransactions() {
      return await getAllTransactions();
    },
  
    async createTransaction(
      type: TransactionType,
      amount: number,
      category: Category,
      description: string
    ) {
      return await addTransaction({
        amount,
        date: new Date().toISOString(),
        type,
        category,
        description,
      });
    },
  };