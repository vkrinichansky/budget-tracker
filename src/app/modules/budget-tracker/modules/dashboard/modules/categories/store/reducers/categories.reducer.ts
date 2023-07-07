import { Category } from '@budget-tracker/shared';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CategoriesActions } from '../actions';

const CategoriesFeatureName = 'categories';

export interface CategoriesState {
  income: EntityState<Category>;
  expense: EntityState<Category>;
  categoryManagement: { success: boolean; error: boolean; inProgress: boolean };
  categoryValueChange: { success: boolean; error: boolean; inProgress: boolean };
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
};

export const categoriesFeature = createFeature({
  name: CategoriesFeatureName,
  reducer: createReducer(
    initialState,

    on(CategoriesActions.categoriesLoaded, (state, action) => ({
      ...state,
      expense: categoryEntityAdapter.addMany(action.expense, state.expense),
      income: categoryEntityAdapter.addMany(action.income, state.income),
    })),

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

    on(CategoriesActions.removeCategory, (state) => ({
      ...state,
      categoryManagement: {
        inProgress: true,
        error: false,
        success: false,
      },
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
    })),

    on(CategoriesActions.removeCategoryFail, (state) => ({
      ...state,
      categoryManagement: {
        inProgress: false,
        error: true,
        success: false,
      },
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
      balance: action.newBalanceValue,
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
  ),
});

export const {
  name,
  reducer,
  selectCategoriesState,
  selectIncome,
  selectExpense,
  selectCategoryManagement,
  selectCategoryValueChange,
} = categoriesFeature;

export const { selectIds, selectEntities, selectAll, selectTotal } = categoryEntityAdapter.getSelectors();
