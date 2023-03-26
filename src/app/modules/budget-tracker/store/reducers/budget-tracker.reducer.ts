import { Category } from '@budget-tracker/shared';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BudgetTrackerActions } from '../actions';

const budgetTrackerFeatureName = 'budgetTracker';

export interface FullBudgetTrackerState {
  income: EntityState<Category>;
  expense: EntityState<Category>;
  balance: number;
  savings: number;
  free: number;
  loading: boolean;
  loaded: boolean;
  valueUpdating: { success: boolean; error: boolean; inProgress: boolean };
}

function selectCategoryId(category: Category) {
  return category.id;
}

export const categoryEntityAdapter = createEntityAdapter({
  selectId: selectCategoryId,
});

const initialState: FullBudgetTrackerState = {
  income: categoryEntityAdapter.getInitialState({}),
  expense: categoryEntityAdapter.getInitialState({}),
  balance: 0,
  savings: 0,
  free: 0,
  loaded: false,
  loading: false,
  valueUpdating: {
    success: false,
    error: false,
    inProgress: false,
  },
};

export const budgetTrackerFeature = createFeature({
  name: budgetTrackerFeatureName,
  reducer: createReducer(
    initialState,
    on(BudgetTrackerActions.init, (state) => ({
      ...state,
      loading: true,
    })),

    on(BudgetTrackerActions.dataLoaded, (state, action) => ({
      ...state,
      savings: action.data.savings,
      balance: action.data.balance,
      free: action.data.free,
      income: categoryEntityAdapter.addMany(action.data.income, state.income),
      expense: categoryEntityAdapter.addMany(action.data.expense, state.expense),
      loading: false,
      loaded: true,
    })),

    on(BudgetTrackerActions.updateBalance, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: true,
        error: false,
        success: false,
      },
    })),

    on(BudgetTrackerActions.balanceUpdated, (state, action) => ({
      ...state,
      balance: action.newBalanceValue,
      valueUpdating: {
        inProgress: false,
        error: false,
        success: true,
      },
    })),

    on(BudgetTrackerActions.balanceUpdateFail, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: false,
        error: true,
        success: false,
      },
    })),

    on(BudgetTrackerActions.updateSavings, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: true,
        error: false,
        success: false,
      },
    })),

    on(BudgetTrackerActions.savingsUpdated, (state, action) => ({
      ...state,
      savings: action.newSavingsValue,
      valueUpdating: {
        inProgress: false,
        error: false,
        success: true,
      },
    })),

    on(BudgetTrackerActions.savingsUpdateFail, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: false,
        error: true,
        success: false,
      },
    })),

    on(BudgetTrackerActions.updateFreeMoney, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: true,
        error: false,
        success: false,
      },
    })),

    on(BudgetTrackerActions.freeMoneyUpdated, (state, action) => ({
      ...state,
      free: action.newFreeMoneyValue,
      valueUpdating: {
        inProgress: false,
        error: false,
        success: true,
      },
    })),

    on(BudgetTrackerActions.freeMoneyUpdateFail, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: false,
        error: true,
        success: false,
      },
    })),

    on(BudgetTrackerActions.resetValueUpdatingProp, (state) => ({
      ...state,
      valueUpdating: {
        inProgress: false,
        error: false,
        success: false,
      },
    }))
  ),
});

export const {
  name,
  reducer,
  selectBudgetTrackerState,
  selectIncome,
  selectExpense,
  selectBalance,
  selectSavings,
  selectFree,
  selectLoaded,
  selectLoading,
  selectValueUpdating,
} = budgetTrackerFeature;

export const { selectIds, selectEntities, selectAll, selectTotal } = categoryEntityAdapter.getSelectors();
