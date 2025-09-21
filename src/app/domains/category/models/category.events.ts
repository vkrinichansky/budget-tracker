import { BudgetType } from '@budget-tracker/shared-models';

export enum CategoryEvents {
  CREATE_CATEGORY = 'Create category',
  REMOVE_CATEGORY = 'Remove category',

  RESET_CATEGORIES_START = 'Reset categories start',
  RESET_CATEGORIES_FINISH = 'Reset categories finish',

  CHANGE_CATEGORY_VALUE_START = 'Change category value start',
  CHANGE_CATEGORY_VALUE_FINISH = 'Change category value finish',
}

export interface ResetCategoriesEvent {
  budgetType: BudgetType;
}

export interface ChangeCategoryValueEvent {
  categoryId: string;
  accountId: string;
  valueToAdd: number;
  convertedValueToAdd: number;
  note: string;
}
