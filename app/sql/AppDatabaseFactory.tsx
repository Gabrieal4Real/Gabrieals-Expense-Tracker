// db.ts
import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("appspensive.db");
  }
  return dbInstance;
}

export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    remaining REAL NOT NULL,
    requireAuth INTEGER NOT NULL DEFAULT 0
  );`,
];

export async function initDB() {
  const db = await getDB();
  await db.execAsync(schemaStatements.join("\n"));
  await runMigrations(db);
}

export async function runMigrations(db: SQLite.SQLiteDatabase) {
  const columns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(profile);`,
  );
  const hasRequireAuth = columns.some((col) => col.name === "requireAuth");

  if (!hasRequireAuth) {
    await db.execAsync(
      `ALTER TABLE profile ADD COLUMN requireAuth INTEGER NOT NULL DEFAULT 0;`,
    );
  }
}
