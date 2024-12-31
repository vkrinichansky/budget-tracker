import { createAction, props } from '@ngrx/store';
import {
  BudgetType,
  CategoriesResetRecord,
  Category,
  CategoryValueChangeRecord,
} from '../../models';

export const CategoriesActions = {
  categoriesLoaded: createAction(
    '[Categories] Categories loaded',
    props<{ categories: Category[] }>()
  ),

  addCategory: createAction('[Categories] Add category', props<{ category: Category }>()),

  categoryAdded: createAction('[Categories] Category added', props<{ category: Category }>()),

  addCategoryFail: createAction('[Categories] Add category fail'),

  removeCategory: createAction(
    '[Categories] Remove category',
    props<{
      categoryId: string;
      recordsToRemove: CategoryValueChangeRecord[];
    }>()
  ),

  categoryRemoved: createAction('[Categories] Category removed', props<{ categoryId: string }>()),

  removeCategoryFail: createAction(
    '[Categories] Remove category fail',
    props<{ categoryId: string }>()
  ),

  resetCategoryManagementProp: createAction('[Categories] Reset categoryManagement prop'),

  changeCategoryValue: createAction(
    '[Categories] Change category value',
    props<{
      updatedCategoryId: string;
      updatedCategoryValue: number;
      updatedAccountId: string;
      updatedAccountValue: number;
      activityLogRecord: CategoryValueChangeRecord;
    }>()
  ),

  categoryValueChanged: createAction(
    '[Categories] Category value changed',
    props<{ updatedCategory: Category }>()
  ),

  changeCategoryValueFail: createAction('[Categories] Change category value fail'),

  resetCategoryValueChangeProp: createAction('[Categories] Reset categoryValueChange prop'),

  resetCategories: createAction(
    '[Categories] Reset categories',
    props<{
      categoriesIdsToReset: string[];
      budgetType: BudgetType;
      activityLogRecord: CategoriesResetRecord;
    }>()
  ),

  categoriesReset: createAction(
    '[Categories] Categories reset',
    props<{
      categoriesIdsToReset: string[];
    }>()
  ),

  resetCategoriesFail: createAction('[Categories] Reset categories fail'),

  clean: createAction('[Categories] Clean state'),
};
