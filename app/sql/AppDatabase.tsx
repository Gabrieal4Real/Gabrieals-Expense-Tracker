import { Transaction } from '../data/TransactionItem';
import { getDB } from './AppDatabaseFactory';
import { Profile } from '../data/Profile';

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

export async function getProfile(): Promise<Profile | null> {
  const db = await getDB();
  const result = await db.getFirstAsync<Profile>('SELECT remaining FROM profile WHERE id = 1');
  return result ?? null;
}

export async function upsertProfile(remaining: number): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO profile (id, remaining) VALUES (1, ?) 
     ON CONFLICT(id) DO UPDATE SET remaining = excluded.remaining`,
    [remaining]
  );
}