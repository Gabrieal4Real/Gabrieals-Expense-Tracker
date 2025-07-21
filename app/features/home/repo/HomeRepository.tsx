import {
  addTransaction,
  deleteTransactionsByIds,
  getAllTransactions,
  getProfile,
  upsertProfile,
} from "@/app/sql/AppDatabase";
import { TransactionType } from "@/app/util/enums/TransactionType";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";

export const HomeRepository = {
  async fetchTransactions() {
    return await getAllTransactions();
  },

  async createTransaction(
    type: TransactionType,
    amount: number,
    category: ExpenseCategory | IncomeCategory,
    description: string,
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

  async updateProfile(remaining: number, requireAuth: number) {
    return await upsertProfile(remaining, requireAuth);
  },

  async deleteTransactionsByIds(ids: number[]) {
    return await deleteTransactionsByIds(ids);
  },
};
