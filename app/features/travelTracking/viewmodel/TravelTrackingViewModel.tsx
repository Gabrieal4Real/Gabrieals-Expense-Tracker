import { useState } from "react";
import {
  TravelTrackingUiState,
  initialTravelTrackingUiState,
} from "./TravelTrackingUiState";
import { useCallback } from "react";

export function useTravelTrackingViewModel() {
  const [uiState, setUiState] = useState<TravelTrackingUiState>(
    initialTravelTrackingUiState,
  );

  const updateState = useCallback(
    (
      updater: (state: TravelTrackingUiState) => Partial<TravelTrackingUiState>,
    ) => {
      setUiState((prev) => ({ ...prev, ...updater(prev) }));
    },
    [],
  );

  return {
    uiState,
  };
}
