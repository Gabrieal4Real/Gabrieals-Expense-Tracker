export enum TransactionType {
    Expense = 'Expense',
    Income = 'Income'
}

export enum Category {
    Food = 'Food',
    Transport = 'Transport',
    Shopping = 'Shopping',
    Entertainment = 'Entertainment',
    Health = 'Health',
    Education = 'Education',
    Utilities = 'Utilities',
    Other = 'Other'
}

export interface Transaction {
    id?: number;
    amount: number;
    date: string;
    type: TransactionType;
    category: Category;
    description: string;
  }