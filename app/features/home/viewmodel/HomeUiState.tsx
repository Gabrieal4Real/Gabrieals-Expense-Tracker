import { Profile } from '@/app/data/Profile';
import { Transaction, TransactionType } from '@/app/data/TransactionItem';

export interface HomeUiState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  type: TransactionType;
  profile: Profile | null;
}

export const initialHomeUiState: HomeUiState = {
  transactions: [],
  loading: false,
  error: null,
  type: TransactionType.Expense,
  profile: null,
};