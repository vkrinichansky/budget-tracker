import { BudgetType } from './budget-type.enum';

export interface Category {
  id: string;
  name: string;
  icon: string;
  value: number;
  budgetType: BudgetType;
  hexColor: string;
  isSystem: boolean;
}

export const incomeAdjustmentCategory: Category = {
  id: 'income-adjustment-category',
  name: 'predefinedCategories.adjustments',
  value: 0,
  budgetType: BudgetType.Income,
  icon: 'wrench',
  isSystem: true,
  hexColor: '#109279',
};

export const expenseAdjustmentCategory: Category = {
  id: 'expense-adjustment-category',
  name: 'predefinedCategories.adjustments',
  value: 0,
  budgetType: BudgetType.Expense,
  icon: 'wrench',
  isSystem: true,
  hexColor: '#AD3546',
};
