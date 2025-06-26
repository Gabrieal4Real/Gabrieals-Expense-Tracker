import { Profile } from '@/app/data/Profile';
import { Transaction } from '@/app/data/TransactionItem';

export interface HomeUiState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  authenticated: boolean;
  currentFilter: string;
}

export const initialHomeUiState: HomeUiState = {
  transactions: [],
  loading: false,
  error: null,
  profile: null,
  authenticated: false,
  currentFilter: "All",
};