import { createSelector } from '@ngrx/store';
import { categoriesFeature, selectAll } from '../reducers';
import { Category } from '@budget-tracker/shared';

const categoriesStateSelector = createSelector(
  categoriesFeature.selectCategoriesState,
  (categoriesState) => categoriesState
);

const incomeCategoriesSelector = createSelector(categoriesFeature.selectIncome, selectAll);

const incomeValueSelector = createSelector(incomeCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + category.value, 0)
);

const expenseCategoriesSelector = createSelector(categoriesFeature.selectExpense, selectAll);

const expenseValueSelector = createSelector(expenseCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + category.value, 0)
);

const categoryManagementInProgressSelector = createSelector(
  categoriesFeature.selectCategoryManagement,
  (valueUpdating) => valueUpdating.inProgress
);

const categoryManagementSuccessSelector = createSelector(
  categoriesFeature.selectCategoryManagement,
  (valueUpdating) => valueUpdating.success
);

const categoryManagementErrorSelector = createSelector(
  categoriesFeature.selectCategoryManagement,
  (valueUpdating) => valueUpdating.error
);

const categoryValueChangeInProgressSelector = createSelector(
  categoriesFeature.selectCategoryValueChange,
  (valueUpdating) => valueUpdating.inProgress
);

const categoryValueChangeSuccessSelector = createSelector(
  categoriesFeature.selectCategoryValueChange,
  (valueUpdating) => valueUpdating.success
);

const categoryValueChangeErrorSelector = createSelector(
  categoriesFeature.selectCategoryValueChange,
  (valueUpdating) => valueUpdating.error
);

const selectCategoryByIdSelector = (categoryId: string) =>
  createSelector(incomeCategoriesSelector, expenseCategoriesSelector, (income, expense) => ({
    ...([...income, ...expense].find((category) => category.id === categoryId) as Category),
  }));


export const CategoriesSelectors = {
  categoriesStateSelector,
  incomeCategoriesSelector,
  incomeValueSelector,
  expenseCategoriesSelector,
  expenseValueSelector,
  categoryManagementInProgressSelector,
  categoryManagementSuccessSelector,
  categoryManagementErrorSelector,
  categoryValueChangeInProgressSelector,
  categoryValueChangeSuccessSelector,
  categoryValueChangeErrorSelector,
  selectCategoryByIdSelector,
};
