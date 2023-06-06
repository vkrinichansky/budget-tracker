import { BudgetType } from '@budget-tracker/shared';

export interface AddCategoryModalData {
  budgetType: BudgetType;
}

export interface CategoryValueModalData {
  categoryId: string;
}
