import { useState, useCallback, useEffect } from "react";
import { ProfileUiState, initialProfileUiState } from "./ProfileUiState";

import { Profile } from "@/app/data/Profile";
import { HomeRepository } from "../../home/repo/HomeRepository";

export function useProfileViewModel() {
  const [uiState, setUiState] = useState<ProfileUiState>(initialProfileUiState);

  const updateState = useCallback(
    (updater: (state: ProfileUiState) => Partial<ProfileUiState>) => {
      setUiState((prev) => ({ ...prev, ...updater(prev) }));
    },
    [],
  );

  const updateLoading = useCallback(
    (loading: boolean, error: string | null) => {
      updateState(() => ({ loading, error }));
    },
    [updateState],
  );

  const getProfile = useCallback(async () => {
    updateLoading(true, null);
    try {
      const profile = await HomeRepository.getProfile();
      if (!profile) {
        await HomeRepository.updateProfile(0, true);
        const defaultProfile = { remaining: 0, requireAuth: true };
        updateState(() => ({ profile: defaultProfile }));
        return defaultProfile;
      } else {
        updateState(() => ({ profile }));
        return profile;
      }
    } catch {
      updateLoading(false, "Failed to get profile");
      return null;
    } finally {
      updateLoading(false, null);
    }
  }, [updateState, updateLoading]);

  const updateProfile = useCallback(
    async (profile: Profile) => {
      updateLoading(true, null);
      try {
        await HomeRepository.updateProfile(
          profile.remaining,
          profile.requireAuth,
        );
        updateState(() => ({ profile }));
      } catch {
        updateLoading(false, "Failed to update profile");
      } finally {
        updateLoading(false, null);
      }
    },
    [updateState, updateLoading],
  );

  useEffect(() => {
    (async () => {
      await HomeRepository.getProfile();
    })();
  }, []);

  return {
    uiState,
    getProfile,
    updateProfile,
  };
}
