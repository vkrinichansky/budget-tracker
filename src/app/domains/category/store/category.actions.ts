import { createAction, props } from '@ngrx/store';
import { Category } from '../models';
import { BudgetType } from '@budget-tracker/models';

export const CategoryActions = {
  initCategoryDB: createAction('[Categories] Init categories DB'),
  loadCategories: createAction('[Categories] Load categories'),
  categoriesLoaded: createAction(
    '[Categories] Categories loaded',
    props<{ categories: Category[] }>()
  ),
  cleanState: createAction('[Categories] Clean state'),

  addCategory: createAction('[Categories] Add category', props<{ category: Category }>()),
  categoryAdded: createAction('[Categories] Category added', props<{ category: Category }>()),
  addCategoryFail: createAction('[Categories] Add category fail'),
  removeCategory: createAction(
    '[Categories] Remove category',
    props<{
      categoryId: string;
    }>()
  ),
  categoryRemoved: createAction('[Categories] Category removed', props<{ categoryId: string }>()),
  removeCategoryFail: createAction(
    '[Categories] Remove category fail',
    props<{ categoryId: string }>()
  ),
  changeCategoryValue: createAction(
    '[Categories] Change category value',
    props<{
      updatedCategoryId: string;
      updatedCategoryValue: number;
    }>()
  ),
  categoryValueChanged: createAction(
    '[Categories] Category value changed',
    props<{ updatedCategory: Category }>()
  ),
  changeCategoryValueFail: createAction('[Categories] Change category value fail'),
  resetCategories: createAction(
    '[Categories] Reset categories',
    props<{
      categoriesIdsToReset: string[];
      budgetType: BudgetType;
    }>()
  ),
  categoriesReset: createAction(
    '[Categories] Categories reset',
    props<{
      categoriesIdsToReset: string[];
    }>()
  ),
  resetCategoriesFail: createAction('[Categories] Reset categories fail'),

  updateCategories: createAction(
    '[Categories] Update categories',
    props<{ categories: Category[] }>()
  ),
};
