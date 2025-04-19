import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import { BudgetType } from '@budget-tracker/models';

const categoriesStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.categoriesState
);

const allCategoriesDictionarySelector = createSelector(
  categoriesStateSelector,
  (state) => state.categories.entities
);

const categoriesLoadedSelector = createSelector(categoriesStateSelector, (state) => state.isLoaded);

const allCategoriesSelector = createSelector(
  allCategoriesDictionarySelector,
  (categoriesDictionary) => Object.values(categoriesDictionary)
);

const selectCategoryByIdSelector = (categoryId: string) =>
  createSelector(
    allCategoriesDictionarySelector,
    (categoriesDictionary) => categoriesDictionary[categoryId]
  );

const incomeCategoriesSelector = createSelector(allCategoriesSelector, (allCategories) =>
  allCategories.filter((category) => category.budgetType === BudgetType.Income)
);

const expenseCategoriesSelector = createSelector(allCategoriesSelector, (allCategories) =>
  allCategories.filter((category) => category.budgetType === BudgetType.Expense)
);

const incomeValueSelector = createSelector(incomeCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + category.value, 0)
);

const expenseValueSelector = createSelector(expenseCategoriesSelector, (categories) =>
  categories.reduce((sum, category) => sum + category.value, 0)
);

const areIncomeCategoriesAllResetSelector = createSelector(incomeCategoriesSelector, (categories) =>
  categories.every((category) => category.value === 0)
);

const areExpenseCategoriesAllResetSelector = createSelector(
  expenseCategoriesSelector,
  (categories) => categories.every((category) => category.value === 0)
);

const currentMonthBalanceSelector = createSelector(
  incomeValueSelector,
  expenseValueSelector,
  (income, expense) => income - expense
);

const categoryManagementInProgressSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryManagement.inProgress
);

const categoryManagementSuccessSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryManagement.success
);

const categoryValueChangeInProgressSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryValueChange.inProgress
);

const categoryValueChangeSuccessSelector = createSelector(
  categoriesStateSelector,
  (state) => state.categoryValueChange.success
);

const isCategoryRemovingSelector = (categoryId: string) =>
  createSelector(categoriesStateSelector, (state) =>
    state.removingCategoriesIds.includes(categoryId)
  );

export const CategoriesSelectors = {
  categoriesStateSelector,
  incomeCategoriesSelector,
  incomeValueSelector,
  expenseCategoriesSelector,
  expenseValueSelector,
  categoryManagementInProgressSelector,
  categoryManagementSuccessSelector,
  categoryValueChangeInProgressSelector,
  categoryValueChangeSuccessSelector,
  selectCategoryByIdSelector,
  allCategoriesSelector,
  allCategoriesDictionarySelector,
  isCategoryRemovingSelector,
  areIncomeCategoriesAllResetSelector,
  areExpenseCategoriesAllResetSelector,
  currentMonthBalanceSelector,
  categoriesLoadedSelector,
};
