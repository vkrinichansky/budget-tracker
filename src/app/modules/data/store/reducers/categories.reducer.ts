import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CategoriesActions } from '../actions';
import { Category } from '../../models';
import { ChartPalette } from '@budget-tracker/design-system';

export interface CategoriesState {
  categories: EntityState<Category>;
  categoryManagement: { success: boolean; error: boolean; inProgress: boolean };
  categoryValueChange: { success: boolean; error: boolean; inProgress: boolean };
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
    error: false,
    inProgress: false,
  },
  categoryValueChange: {
    success: false,
    error: false,
    inProgress: false,
  },
  removingCategoriesIds: [],
};

const adapterReducer = createReducer(
  initialState,

  on(CategoriesActions.categoriesLoaded, (state, action) => {
    const resultCategories = action.categories.map((category) =>
      category?.hexColor
        ? category
        : {
            ...category,
            hexColor: ChartPalette[Math.floor(Math.random() * 30)],
          }
    );

    return {
      ...state,
      categories: categoryEntityAdapter.addMany(resultCategories, state.categories),
    };
  }),

  on(CategoriesActions.addCategory, (state) => ({
    ...state,
    categoryManagement: {
      inProgress: true,
      error: false,
      success: false,
    },
  })),

  on(CategoriesActions.categoryAdded, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.addOne(action.category, state.categories),
    categoryManagement: {
      inProgress: false,
      error: false,
      success: true,
    },
  })),

  on(CategoriesActions.addCategoryFail, (state) => ({
    ...state,
    categoryManagement: {
      inProgress: false,
      error: true,
      success: false,
    },
  })),

  on(CategoriesActions.removeCategory, (state, action) => ({
    ...state,
    categoryManagement: {
      inProgress: true,
      error: false,
      success: false,
    },
    removingCategoriesIds: [...state.removingCategoriesIds, action.category.id],
  })),

  on(CategoriesActions.categoryRemoved, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.removeOne(action.category.id, state.categories),
    categoryManagement: {
      inProgress: false,
      error: false,
      success: true,
    },
    removingCategoriesIds: state.removingCategoriesIds.filter((id) => id !== action.category.id),
  })),

  on(CategoriesActions.removeCategoryFail, (state, action) => ({
    ...state,
    categoryManagement: {
      inProgress: false,
      error: true,
      success: false,
    },
    removingCategoriesIds: state.removingCategoriesIds.filter((id) => id !== action.categoryId),
  })),

  on(CategoriesActions.resetCategoryManagementProp, (state) => ({
    ...state,
    categoryManagement: {
      inProgress: false,
      error: false,
      success: false,
    },
  })),

  on(CategoriesActions.changeCategoryValue, (state) => ({
    ...state,
    categoryValueChange: {
      inProgress: true,
      error: false,
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
      error: false,
      success: true,
    },
  })),

  on(CategoriesActions.changeCategoryValueFail, (state) => ({
    ...state,
    categoryValueChange: {
      inProgress: false,
      error: true,
      success: false,
    },
  })),

  on(CategoriesActions.resetCategoryValueChangeProp, (state) => ({
    ...state,
    categoryValueChange: {
      inProgress: false,
      error: false,
      success: false,
    },
  })),

  on(CategoriesActions.categoriesReset, (state, action) => ({
    ...state,
    categories: categoryEntityAdapter.updateMany(
      action.updatedCategories.map((category) => ({ changes: category, id: category.id })),
      state.categories
    ),
  })),

  on(CategoriesActions.clean, () => initialState)
);

export function categoriesReducer(state = initialState, action: Action): CategoriesState {
  return adapterReducer(state, action);
}
