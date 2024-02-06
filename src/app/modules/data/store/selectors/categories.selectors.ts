import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import { Category } from '../../models';

const categoriesStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.categoriesState
);

const incomeCategoriesSelector = createSelector(
  categoriesStateSelector,
  (state) => Object.values(state.income.entities) as Category[]
);

const incomeValueSelector = createSelector(incomeCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + (category as Category).value, 0)
);

const expenseCategoriesSelector = createSelector(
  categoriesStateSelector,
  (state) => Object.values(state.expense.entities) as Category[]
);

const expenseValueSelector = createSelector(expenseCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + (category as Category).value, 0)
);

const categoryManagementInProgressSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryManagement.inProgress
);

const categoryManagementSuccessSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryManagement.success
);

const categoryManagementErrorSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryManagement.error
);

const categoryValueChangeInProgressSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryValueChange.inProgress
);

const categoryValueChangeSuccessSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryValueChange.success
);

const categoryValueChangeErrorSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryValueChange.error
);

const selectCategoryByIdSelector = (categoryId: string) =>
  createSelector(incomeCategoriesSelector, expenseCategoriesSelector, (income, expense) => ({
    ...([...income, ...expense].find((category) => (category as Category).id === categoryId) as Category),
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
