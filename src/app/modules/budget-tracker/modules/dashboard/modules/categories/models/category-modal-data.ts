import { BudgetType } from '@budget-tracker/data';

export interface AddCategoryModalData {
  budgetType: BudgetType;
}

export interface CategoryValueModalData {
  categoryId: string;
}
