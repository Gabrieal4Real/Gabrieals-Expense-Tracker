import { addTransaction, deleteTransactionsByIds, getAllTransactions, getProfile, upsertProfile } from "@/app/sql/AppDatabase";
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

    async updateProfile(remaining: number, requireAuth: boolean) {
      return await upsertProfile(remaining, requireAuth);
    },

    async deleteTransactionsByIds(ids: number[]) {
      return await deleteTransactionsByIds(ids);
    },
  };