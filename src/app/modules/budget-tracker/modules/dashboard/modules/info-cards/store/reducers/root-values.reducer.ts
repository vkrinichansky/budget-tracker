import { Category } from '@budget-tracker/shared';
import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { RootValuesActions } from '../actions';

const rootValuesFeatureName = 'rootValues';

export interface RootValuesState {
  balance: number;
  savings: number;
  free: number;
  rootValueUpdating: { success: boolean; error: boolean; inProgress: boolean };
}

function selectCategoryId(category: Category) {
  return category.id;
}

export const categoryEntityAdapter = createEntityAdapter({
  selectId: selectCategoryId,
});

const initialState: RootValuesState = {
  balance: 0,
  savings: 0,
  free: 0,
  rootValueUpdating: {
    success: false,
    error: false,
    inProgress: false,
  },
};

export const rootValuesFeature = createFeature({
  name: rootValuesFeatureName,
  reducer: createReducer(
    initialState,

    on(RootValuesActions.rootValuesLoaded, (state, action) => ({
      ...state,
      savings: action.savings,
      balance: action.balance,
      free: action.freeMoney,
    })),

    on(RootValuesActions.updateBalance, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: true,
        error: false,
        success: false,
      },
    })),

    on(RootValuesActions.balanceUpdated, (state, action) => ({
      ...state,
      balance: action.newBalanceValue,
      rootValueUpdating: {
        inProgress: false,
        error: false,
        success: true,
      },
    })),

    on(RootValuesActions.balanceUpdateFail, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: false,
        error: true,
        success: false,
      },
    })),

    on(RootValuesActions.updateSavings, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: true,
        error: false,
        success: false,
      },
    })),

    on(RootValuesActions.savingsUpdated, (state, action) => ({
      ...state,
      savings: action.newSavingsValue,
      rootValueUpdating: {
        inProgress: false,
        error: false,
        success: true,
      },
    })),

    on(RootValuesActions.savingsUpdateFail, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: false,
        error: true,
        success: false,
      },
    })),

    on(RootValuesActions.updateFreeMoney, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: true,
        error: false,
        success: false,
      },
    })),

    on(RootValuesActions.freeMoneyUpdated, (state, action) => ({
      ...state,
      free: action.newFreeMoneyValue,
      rootValueUpdating: {
        inProgress: false,
        error: false,
        success: true,
      },
    })),

    on(RootValuesActions.freeMoneyUpdateFail, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: false,
        error: true,
        success: false,
      },
    })),

    on(RootValuesActions.resetValueUpdatingProp, (state) => ({
      ...state,
      rootValueUpdating: {
        inProgress: false,
        error: false,
        success: false,
      },
    })),

    on(RootValuesActions.clean, () => initialState)
  ),
});

export const {
  name,
  reducer,
  selectRootValuesState,
  selectBalance,
  selectSavings,
  selectFree,
  selectRootValueUpdating,
} = rootValuesFeature;

export const { selectIds, selectEntities, selectAll, selectTotal } = categoryEntityAdapter.getSelectors();
