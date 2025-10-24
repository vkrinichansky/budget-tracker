import { BudgetType } from '@budget-tracker/shared-models';

export enum CategoryEvents {
  CREATE_CATEGORY = 'Create category',
  REMOVE_CATEGORY = 'Remove category',

  RESET_CATEGORIES_START = 'Reset categories start',
  RESET_CATEGORIES_FINISH = 'Reset categories finish',

  OPEN_CATEGORY_TRANSACTION_MODAL = 'Open category transaction modal',
}

export interface ResetCategoriesEvent {
  budgetType: BudgetType;
}

export interface OpenCategoryTransactionModalEvent {
  categoryId: string;
}
