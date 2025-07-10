import { BudgetType } from '@budget-tracker/models';

export interface AddCategoryModalData {
  budgetType: BudgetType;
}

export interface CategoryValueModalData {
  categoryId: string;
}
