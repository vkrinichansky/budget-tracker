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
} = budgetTrackerFeature;

export const { selectIds, selectEntities, selectAll, selectTotal } = categoryEntityAdapter.getSelectors();
