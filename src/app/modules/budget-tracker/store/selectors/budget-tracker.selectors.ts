import { createSelector } from '@ngrx/store';
import { budgetTrackerFeature, selectAll } from '../reducers';
import { Category } from '@budget-tracker/shared';

const budgetTrackerStateSelector = createSelector(
  budgetTrackerFeature.selectBudgetTrackerState,
  (budgetTrackerState) => budgetTrackerState
);

const dataLoadingSelector = createSelector(budgetTrackerFeature.selectLoading, (isLoading) => isLoading);

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

const categoryManagementInProgressSelector = createSelector(
  budgetTrackerFeature.selectCategoryManagement,
  (valueUpdating) => valueUpdating.inProgress
);

const categoryManagementSuccessSelector = createSelector(
  budgetTrackerFeature.selectCategoryManagement,
  (valueUpdating) => valueUpdating.success
);

const categoryManagementErrorSelector = createSelector(
  budgetTrackerFeature.selectCategoryManagement,
  (valueUpdating) => valueUpdating.error
);

const categoryValueChangeInProgressSelector = createSelector(
  budgetTrackerFeature.selectCategoryValueChange,
  (valueUpdating) => valueUpdating.inProgress
);

const categoryValueChangeSuccessSelector = createSelector(
  budgetTrackerFeature.selectCategoryValueChange,
  (valueUpdating) => valueUpdating.success
);

const categoryValueChangeErrorSelector = createSelector(
  budgetTrackerFeature.selectCategoryValueChange,
  (valueUpdating) => valueUpdating.error
);

const selectCategoryByIdSelector = (categoryId: string) =>
  createSelector(incomeCategoriesSelector, expenseCategoriesSelector, (income, expense) => ({
    ...([...income, ...expense].find((category) => category.id === categoryId) as Category),
  }));

const activityLogSelector = createSelector(budgetTrackerFeature.selectActivityLog, (activityLog) => activityLog);

export const BudgetTrackerSelectors = {
  budgetTrackerStateSelector,
  dataLoadingSelector,
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
  categoryManagementInProgressSelector,
  categoryManagementSuccessSelector,
  categoryManagementErrorSelector,
  categoryValueChangeInProgressSelector,
  categoryValueChangeSuccessSelector,
  categoryValueChangeErrorSelector,
  selectCategoryByIdSelector,
};
