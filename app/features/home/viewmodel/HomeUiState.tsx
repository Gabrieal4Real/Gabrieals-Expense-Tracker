import { Profile } from '@/app/data/Profile';
import { Transaction } from '@/app/data/TransactionItem';

export interface HomeUiState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  currentTypeFilter: string;
  currentCategoryFilter?: string;
  selectedTransactions: number[];
  isDeleteMode: boolean;
}

export const initialHomeUiState: HomeUiState = {
  transactions: [],
  loading: false,
  error: null,
  profile: null,
  currentTypeFilter: "All",
  currentCategoryFilter: undefined,
  selectedTransactions: [],
  isDeleteMode: false
};