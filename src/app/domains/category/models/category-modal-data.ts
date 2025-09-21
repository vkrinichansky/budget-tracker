import { BudgetType } from '@budget-tracker/shared-models';

export interface AddCategoryModalData {
  budgetType: BudgetType;
}

export interface CategoryValueModalData {
  categoryId: string;
}
