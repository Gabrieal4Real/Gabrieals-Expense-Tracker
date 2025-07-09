import { useCallback, useState } from "react";
import { TransactionUiState, initialTransactionUiState } from "./TransactionUiState";
import { TransactionType } from "@/app/util/enums/TransactionType";
import { ExpenseCategory, IncomeCategory } from "@/app/util/enums/Category";

export function useTransactionViewModel() {
    const [uiState, setUiState] = useState<TransactionUiState>(initialTransactionUiState);

    const getCategoriesByType = (type: TransactionType): (ExpenseCategory | IncomeCategory)[] => {
        return type === TransactionType.Expense
            ? Object.values(ExpenseCategory)
            : Object.values(IncomeCategory);
    };

    const reset = () => {
        updateUiState(initialTransactionUiState);
    };

    const updateAmount = (amount: string) => {
        updateUiState({ amount });
    };

    const updateDescription = (description: string) => {
        updateUiState({ description });
    };
    
    const updateTransactionType = (type: TransactionType) => {
        updateUiState({ transactionType: type });
        updateCategory(type === TransactionType.Expense ? ExpenseCategory.Food : IncomeCategory.Salary);
    };

    const updateCategory = (category: ExpenseCategory | IncomeCategory) => {
        updateUiState({ category });
    };

    const updateUiState = useCallback((partial: Partial<TransactionUiState>) => {
        setUiState((prev) => ({ ...prev, ...partial }));
      }, []);
  
    return {
        uiState,
        updateUiState,
        getCategoriesByType,
        updateCategory,
        updateTransactionType,
        updateAmount,
        updateDescription,
        reset
    };
}
