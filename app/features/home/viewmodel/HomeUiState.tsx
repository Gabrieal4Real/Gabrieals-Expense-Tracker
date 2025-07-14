import { Profile } from "@/app/data/Profile";
import { Transaction } from "@/app/data/TransactionItem";
import { TransactionTypeFilter } from "@/app/util/enums/TransactionType";

export interface HomeUiState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  currentTypeFilter: TransactionTypeFilter;
  currentCategoryFilter?: string;
  selectedTransactions: number[];
  isDeleteMode: boolean;
}

export const initialHomeUiState: HomeUiState = {
  transactions: [],
  loading: false,
  error: null,
  profile: null,
  currentTypeFilter: TransactionTypeFilter.All,
  currentCategoryFilter: undefined,
  selectedTransactions: [],
  isDeleteMode: false,
};
