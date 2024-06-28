import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CategoriesActions } from '../actions';
import { Category } from '../../models';
import { ChartPalette } from '@budget-tracker/design-system';

export interface CategoriesState {
  income: EntityState<Category>;
  expense: EntityState<Category>;
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
  income: categoryEntityAdapter.getInitialState({}),
  expense: categoryEntityAdapter.getInitialState({}),
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
    const incomeCategories = action.income.map((category) =>
      category?.hexColor
        ? category
        : {
            ...category,
            hexColor: ChartPalette[Math.floor(Math.random() * 30)],
          }
    );

    const expenseCategories = action.expense.map((category) =>
      category?.hexColor
        ? category
        : {
            ...category,
            hexColor: ChartPalette[Math.floor(Math.random() * 30)],
          }
    );
    return {
      ...state,
      expense: categoryEntityAdapter.addMany(expenseCategories, state.expense),
      income: categoryEntityAdapter.addMany(incomeCategories, state.income),
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
    [action.category.budgetType]: categoryEntityAdapter.addOne(action.category, state[action.category.budgetType]),
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
    [action.category.budgetType]: categoryEntityAdapter.removeOne(
      action.category.id,
      state[action.category.budgetType]
    ),
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
    [action.updatedCategory.budgetType]: categoryEntityAdapter.updateOne(
      { changes: action.updatedCategory, id: action.updatedCategory.id },
      state[action.updatedCategory.budgetType]
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
    [action.updatedCategories[0].budgetType]: categoryEntityAdapter.updateMany(
      action.updatedCategories.map((category) => ({ changes: category, id: category.id })),
      state[action.updatedCategories[0].budgetType]
    ),
  })),

  on(CategoriesActions.clean, () => initialState)
);

export function categoriesReducer(state = initialState, action: Action): CategoriesState {
  return adapterReducer(state, action);
}
