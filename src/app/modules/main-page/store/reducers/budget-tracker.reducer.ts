import { BudgetTrackerState } from '@budget-tracker/shared';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BudgetTrackerActions } from '../actions';

const budgetTrackerFeatureName = 'budgetTracker';

export interface FullBudgetTrackerState extends BudgetTrackerState {
  loading: boolean;
  loaded: boolean;
}

const initialState: FullBudgetTrackerState = {
  income: [],
  expense: [],
  balance: 0,
  accumulation: 0,
  free: 0,
  loaded: false,
  loading: false,
};

export const mainAppFeature = createFeature({
  name: budgetTrackerFeatureName,
  reducer: createReducer(
    initialState,
    on(BudgetTrackerActions.init, (state) => ({
      ...state,
      loading: true,
    })),

    on(BudgetTrackerActions.dataLoaded, (state, action) => ({
      ...state,
      ...action.data,
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
  selectAccumulation,
  selectFree,
  selectLoaded,
  selectLoading,
} = mainAppFeature;
