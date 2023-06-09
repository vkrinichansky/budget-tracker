import { Category } from '@budget-tracker/shared';
import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BudgetTrackerActions } from '../actions';

const budgetTrackerFeatureName = 'budgetTracker';

export interface FullBudgetTrackerState {
  isDataLoading: boolean;
  isDataLoaded: boolean;
}

function selectCategoryId(category: Category) {
  return category.id;
}

export const categoryEntityAdapter = createEntityAdapter({
  selectId: selectCategoryId,
});

const initialState: FullBudgetTrackerState = {
  isDataLoaded: false,
  isDataLoading: false,
};

export const budgetTrackerFeature = createFeature({
  name: budgetTrackerFeatureName,
  reducer: createReducer(
    initialState,
    on(BudgetTrackerActions.init, (state) => ({
      ...state,
      isDataLoading: true,
    })),

    on(BudgetTrackerActions.clean, () => initialState),

    on(BudgetTrackerActions.dataLoaded, (state) => ({
      ...state,
      isDataLoading: false,
      isDataLoaded: true,
    }))
  ),
});

export const { name, reducer, selectBudgetTrackerState, selectIsDataLoading, selectIsDataLoaded } =
  budgetTrackerFeature;

export const { selectIds, selectEntities, selectAll, selectTotal } = categoryEntityAdapter.getSelectors();
