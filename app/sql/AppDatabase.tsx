import { Transaction } from '../data/TransactionItem';
import { getDB } from './AppDatabaseFactory';

export async function addTransaction(transaction: Transaction): Promise<number> {
  const db = await getDB();
  const result = await db.runAsync(
    `INSERT INTO transactions (amount, date, type, category, description) VALUES (?, ?, ?, ?, ?)`,
    [transaction.amount, transaction.date, transaction.type, transaction.category, transaction.description]
  );
  return result.lastInsertRowId;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDB();
  return db.getAllAsync<Transaction>('SELECT * FROM transactions');
}

export async function getTransactionById(id: number): Promise<Transaction | null> {
  const db = await getDB();
  const result = await db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', id);
  return result ?? null;
}