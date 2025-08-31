import { createAction, props } from '@ngrx/store';
import { Category } from '../models';
import { BudgetType } from '@budget-tracker/models';

export const CategoryActions = {
  loadCategories: createAction('[Categories] Load categories'),
  categoriesLoaded: createAction(
    '[Categories] Categories loaded',
    props<{ categories: Category[] }>()
  ),
  cleanState: createAction('[Categories] Clean state'),

  addCategory: createAction('[Categories] Add category', props<{ category: Category }>()),
  categoryAdded: createAction('[Categories] Category added', props<{ category: Category }>()),

  removeCategory: createAction(
    '[Categories] Remove category',
    props<{
      categoryId: string;
    }>()
  ),
  categoryRemoved: createAction('[Categories] Category removed', props<{ categoryId: string }>()),

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

  updateCategories: createAction(
    '[Categories] Update categories',
    props<{ categories: Category[] }>()
  ),
};
