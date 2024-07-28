import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CategoriesActions } from '../actions';
import { Category } from '../../models';

export interface CategoriesState {
  categories: EntityState<Category>;
  categoryManagement: { success: boolean; inProgress: boolean };
  categoryValueChange: { success: boolean; inProgress: boolean };
  removingCategoriesIds: string[];
}

function selectCategoryId(category: Category) {
  return category.id;
}

export const categoryEntityAdapter = createEntityAdapter({
  selectId: selectCategoryId,
});

const initialState: CategoriesState = {
  categories: categoryEntityAdapter.getInitialState({}),
  categoryManagement: {
    success: false,
    inProgress: false,
  },
  categoryValueChange: {
    success: false,
    inProgress: false,
  },
  removingCategoriesIds: [],
};

const adapterReducer = createReducer(
  initialState,

  on(CategoriesActions.categoriesLoaded, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.addMany(action.categories, state.categories),
  })),

  on(CategoriesActions.addCategory, (state) => ({
    ...state,
    categoryManagement: {
      inProgress: true,
      success: false,
    },
  })),

  on(CategoriesActions.categoryAdded, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.addOne(action.category, state.categories),
    categoryManagement: {
      inProgress: false,
      success: true,
    },
  })),

  on(CategoriesActions.addCategoryFail, (state) => ({
    ...state,
    categoryManagement: {
      inProgress: false,
      success: false,
    },
  })),

  on(CategoriesActions.removeCategory, (state, action) => ({
    ...state,
    removingCategoriesIds: [...state.removingCategoriesIds, action.categoryId],
  })),

  on(CategoriesActions.categoryRemoved, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.removeOne(action.categoryId, state.categories),
    removingCategoriesIds: state.removingCategoriesIds.filter((id) => id !== action.categoryId),
  })),

  on(CategoriesActions.removeCategoryFail, (state, action) => ({
    ...state,
    removingCategoriesIds: state.removingCategoriesIds.filter((id) => id !== action.categoryId),
  })),

  on(CategoriesActions.resetCategoryManagementProp, (state) => ({
    ...state,
    categoryManagement: {
      inProgress: false,
      success: false,
    },
  })),

  on(CategoriesActions.changeCategoryValue, (state) => ({
    ...state,
    categoryValueChange: {
      inProgress: true,
      success: false,
    },
  })),

  on(CategoriesActions.categoryValueChanged, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.updateOne(
      { changes: action.updatedCategory, id: action.updatedCategory.id },
      state.categories
    ),
    categoryValueChange: {
      inProgress: false,
      success: true,
    },
  })),

  on(CategoriesActions.changeCategoryValueFail, (state) => ({
    ...state,
    categoryValueChange: {
      inProgress: false,
      success: false,
    },
  })),

  on(CategoriesActions.resetCategoryValueChangeProp, (state) => ({
    ...state,
    categoryValueChange: {
      inProgress: false,
      success: false,
    },
  })),

  on(CategoriesActions.categoriesReset, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.updateMany(
      action.categoriesIdsToReset.map((categoryId) => ({ changes: { value: 0 }, id: categoryId })),
      state.categories
    ),
  })),

  on(CategoriesActions.clean, () => initialState)
);

export function categoriesReducer(state = initialState, action: Action): CategoriesState {
  return adapterReducer(state, action);
}
