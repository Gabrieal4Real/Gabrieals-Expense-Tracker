import { Profile } from '@/app/data/Profile';
import { Transaction } from '@/app/data/TransactionItem';

export interface HomeUiState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  currentTypeFilter: string;
  currentCategoryFilter?: string;
}

export const initialHomeUiState: HomeUiState = {
  transactions: [],
  loading: false,
  error: null,
  profile: null,
  currentTypeFilter: "All",
  currentCategoryFilter: undefined,
};