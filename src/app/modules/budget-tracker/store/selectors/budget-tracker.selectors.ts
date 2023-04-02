import { createSelector } from '@ngrx/store';
import { budgetTrackerFeature, selectAll } from '../reducers';

const budgetTrackerStateSelector = createSelector(
  budgetTrackerFeature.selectBudgetTrackerState,
  (budgetTrackerState) => budgetTrackerState
);

const incomeCategoriesSelector = createSelector(budgetTrackerFeature.selectIncome, selectAll);

const incomeValueSelector = createSelector(incomeCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + category.value, 0)
);

const expenseCategoriesSelector = createSelector(budgetTrackerFeature.selectExpense, selectAll);

const expenseValueSelector = createSelector(expenseCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + category.value, 0)
);

const fullBalanceSelector = createSelector(budgetTrackerFeature.selectBalance, (balance) => balance);

const currentBalanceSelector = createSelector(
  budgetTrackerFeature.selectBalance,
  budgetTrackerFeature.selectFree,
  budgetTrackerFeature.selectSavings,
  (balance, free, savings) => balance - free - savings
);

const freeMoneySelector = createSelector(budgetTrackerFeature.selectFree, (freeMoney) => freeMoney);

const savingsSelector = createSelector(budgetTrackerFeature.selectSavings, (savings) => savings);

const valueUpdatingInProgressSelector = createSelector(
  budgetTrackerFeature.selectValueUpdating,
  (valueUpdating) => valueUpdating.inProgress
);

const valueUpdatingSuccessSelector = createSelector(
  budgetTrackerFeature.selectValueUpdating,
  (valueUpdating) => valueUpdating.success
);

const valueUpdatingErrorSelector = createSelector(
  budgetTrackerFeature.selectValueUpdating,
  (valueUpdating) => valueUpdating.error
);

const activityLogSelector = createSelector(budgetTrackerFeature.selectActivityLog, (activityLog) => activityLog);

export const BudgetTrackerSelectors = {
  budgetTrackerStateSelector,
  incomeCategoriesSelector,
  incomeValueSelector,
  expenseCategoriesSelector,
  expenseValueSelector,
  fullBalanceSelector,
  freeMoneySelector,
  savingsSelector,
  currentBalanceSelector,
  valueUpdatingInProgressSelector,
  valueUpdatingSuccessSelector,
  valueUpdatingErrorSelector,
  activityLogSelector,
};
