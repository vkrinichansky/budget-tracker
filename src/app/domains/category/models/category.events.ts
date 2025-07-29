import { BudgetType } from '@budget-tracker/models';

export enum CategoryEvents {
  INIT_CATEGORY_DB = 'Init category DB',
  UPDATE_CATEGORIES = 'Update categories',
  CREATE_CATEGORY = 'Create category',
  REMOVE_CATEGORY = 'Remove category',
  RESET_CATEGORIES = 'Reset categories',
  RESET_CATEGORIES_START = 'Reset categories start',
  RESET_CATEGORIES_FINISH = 'Reset categories finish',
}

export interface ResetCategoriesEvent {
  budgetType: BudgetType;
}
