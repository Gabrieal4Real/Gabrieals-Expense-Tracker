export enum TransactionType {
    Expense = 'Expense',
    Income = 'Income'
}


export enum ExpenseCategory {
    Food = '🍕 Food',
    Transport = '🚗 Transport',
    Shopping = '🛒 Shopping',
    Entertainment = '🍿 Entertainment',
    Health = '💊 Health',
    Education = '📚 Education',
    Utilities = '🏠 Utilities',
    Other = '💁 Other',
  }
  
export enum IncomeCategory {
  Salary = '💼 Salary',
  Bonus = '🎁 Bonus',
  Investment = '📈 Investment',
  Gift = '🎉 Gift',
  Other = '💁 Other',
}


export interface Transaction {
  id?: number;
  amount: number;
  date: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  description: string;
}