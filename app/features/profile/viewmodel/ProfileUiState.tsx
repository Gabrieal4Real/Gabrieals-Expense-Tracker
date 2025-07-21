import { Profile } from "@/app/data/Profile";

export interface ProfileUiState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export const initialProfileUiState: ProfileUiState = {
  profile: null,
  loading: false,
  error: null,
};
