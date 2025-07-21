import {
  updateTransactionById,
  deleteTransactionsByIds,
} from "@/app/sql/AppDatabase";
import { Transaction } from "@/app/data/TransactionItem";

export const EditTransactionRepository = {
  async updateTransactionById(id: number, transaction: Transaction) {
    return await updateTransactionById(id, transaction);
  },

  async deleteTransactionsByIds(ids: number[]) {
    return await deleteTransactionsByIds(ids);
  },
};
