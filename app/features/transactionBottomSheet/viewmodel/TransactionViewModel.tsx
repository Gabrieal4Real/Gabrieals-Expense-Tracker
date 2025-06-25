import { useCallback, useState } from "react";
import { TransactionUiState, initialTransactionUiState } from "./TransactionUiState";


export function useTransactionViewModel() {
    const [uiState, setUiState] = useState<TransactionUiState>(initialTransactionUiState);

    const updateUiState = useCallback((partial: Partial<TransactionUiState>) => {
        setUiState((prev) => ({ ...prev, ...partial }));
      }, []);
  
    return {
        uiState,
        updateUiState
    };
}
