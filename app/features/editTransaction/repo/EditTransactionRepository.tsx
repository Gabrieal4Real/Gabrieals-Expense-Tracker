import {
  updateTransactionById,
  deleteTransactionsByIds,
  getProfile,
  upsertProfile,
} from "@/app/sql/AppDatabase";
import { Transaction } from "@/app/data/TransactionItem";

export const EditTransactionRepository = {
  async updateTransactionById(id: number, transaction: Transaction) {
    return await updateTransactionById(id, transaction);
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
