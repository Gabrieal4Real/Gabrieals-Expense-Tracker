import { addTransaction, getAllTransactions, getProfile, upsertProfile } from "@/app/sql/AppDatabase";
import { TransactionType, ExpenseCategory, IncomeCategory } from "@/app/data/TransactionItem";

export const HomeRepository = {
    async fetchTransactions() {
      return await getAllTransactions();
    },
  
    async createTransaction(
      type: TransactionType,
      amount: number,
      category: ExpenseCategory | IncomeCategory,
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

    async getProfile() {
      return await getProfile();
    },

    async updateProfile(remaining: number) {
      return await upsertProfile(remaining);
    },
  };