import { createAction, props } from '@ngrx/store';
import {
  Account,
  CategoriesResetRecord,
  Category,
  CategoryManagementRecord,
  CategoryValueChangeRecord,
} from '../../models';

enum CategoriesActionsType {
  CategoriesLoaded = '[Categories] Categories loaded',

  AddCategory = '[Categories] Add category',
  CategoryAdded = '[Categories] Category added',
  AddCategoryFail = '[Categories] Add category fail',

  RemoveCategory = '[Categories] Remove category',
  CategoryRemoved = '[Categories] Category removed',
  RemoveCategoryFail = '[Categories] Remove category fail',

  ResetCategoryManagementProp = '[Categories] Reset categoryManagement prop',

  ChangeCategoryValue = '[Categories] Change category value',
  CategoryValueChanged = '[Categories] Category value changed',
  ChangeCategoryValueFail = '[Categories] Change category value fail',

  ResetCategoryValueChangeProp = '[Categories] Reset categoryValueChange prop',

  ResetCategories = '[Categories] Reset categories',
  CategoriesReset = '[Categories] Categories reset',
  ReserCategoriesFail = '[Categories] Reset categories fail',

  Clean = '[Categories] Clean state',
}

export const CategoriesActions = {
  categoriesLoaded: createAction(CategoriesActionsType.CategoriesLoaded, props<{ categories: Category[] }>()),

  addCategory: createAction(
    CategoriesActionsType.AddCategory,
    props<{ category: Category; activityLogRecord: CategoryManagementRecord }>()
  ),

  categoryAdded: createAction(CategoriesActionsType.CategoryAdded, props<{ category: Category }>()),

  addCategoryFail: createAction(CategoriesActionsType.AddCategoryFail),

  removeCategory: createAction(
    CategoriesActionsType.RemoveCategory,
    props<{
      category: Category;
      activityLogRecord: CategoryManagementRecord;
      recordsToRemove: CategoryValueChangeRecord[];
    }>()
  ),

  categoryRemoved: createAction(CategoriesActionsType.CategoryRemoved, props<{ category: Category }>()),

  removeCategoryFail: createAction(CategoriesActionsType.RemoveCategoryFail, props<{ categoryId: string }>()),

  resetCategoryManagementProp: createAction(CategoriesActionsType.ResetCategoryManagementProp),

  changeCategoryValue: createAction(
    CategoriesActionsType.ChangeCategoryValue,
    props<{
      updatedCategory: Category;
      updatedAccount: Account;
      activityLogRecord: CategoryValueChangeRecord;
    }>()
  ),

  categoryValueChanged: createAction(
    CategoriesActionsType.CategoryValueChanged,
    props<{ updatedCategory: Category }>()
  ),

  changeCategoryValueFail: createAction(CategoriesActionsType.ChangeCategoryValueFail),

  resetCategoryValueChangeProp: createAction(CategoriesActionsType.ResetCategoryValueChangeProp),

  resetCategories: createAction(
    CategoriesActionsType.ResetCategories,
    props<{
      updatedCategories: Category[];
      activityLogRecord: CategoriesResetRecord;
    }>()
  ),

  categoriesReset: createAction(
    CategoriesActionsType.CategoriesReset,
    props<{
      updatedCategories: Category[];
    }>()
  ),

  resetCategoriesFail: createAction(CategoriesActionsType.ReserCategoriesFail),

  clean: createAction(CategoriesActionsType.Clean),
};
